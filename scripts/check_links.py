#!/usr/bin/env python3
"""Source-link health check: is every URL the dataset cites still alive?

Collects every URL under data/ (source.url at any depth, application.apply_url /
pre_approval_check_url, issuer/network websites), de-duplicates them, and
checks each one: HEAD first, GET fallback. Requests are polite: a small worker
pool, at most --per-host requests in flight per host, a minimum gap between
requests to the same host, a browser User-Agent, and a timeout.

Each URL lands in exactly one class:

  ok             2xx at the cited URL
  redirect       2xx after redirects; `redirect_kind` says how far it moved:
                   cosmetic       same page (scheme / www / trailing-slash / case)
                   host-moved     same path on a new host (the .bank.in migration)
                   moved          a different path — update the cited URL
                   to-homepage    ended on the site root although the cited URL
                                  was a deep link (a soft 404)
                   to-error-page  ended on a 404 / error / sitemap page served
                                  with a 200 (a soft 404)
  not-found      404 / 410 — the page is gone
  blocked        401 / 403 / 429 / 999, or a bot-wall challenge page. Indian bank
                 sites (Akamai / Cloudflare) routinely refuse non-browser
                 clients, so this means "unverified", NOT "broken"
  client-error   any other 4xx
  server-error   5xx
  network-error  DNS, TLS, timeout, connection reset

URLs that come back blocked or with a network error from Python are re-tried
once with `curl` when it is on PATH: curl's TLS stack fetches missing
intermediate certificates on Windows and is not fingerprinted as a bot by some
bank CDNs, so this separates real failures from client quirks.

Writes <out-dir>/link-report.json and <out-dir>/link-report.md (default out-dir
dist/, which is gitignored). Exit 0 unless --fail-on names a class that occurred.

Usage:
    python scripts/check_links.py [--out-dir dist] [--workers 8] [--per-host 2]
                                  [--timeout 20] [--limit N]
                                  [--fail-on not-found,network-error]

Stdlib only, so it runs with scripts/requirements.txt and nothing else.
"""
from __future__ import annotations

import argparse
import json
import shutil
import socket
import ssl
import subprocess
import sys
import threading
import time
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from http.client import HTTPException
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen

import yaml

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
)
HEADERS = {
    "User-Agent": USER_AGENT,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,application/pdf;q=0.8,*/*;q=0.7",
    "Accept-Language": "en-IN,en;q=0.9",
    "Accept-Encoding": "identity",
}
BLOCKED_CODES = {401, 403, 429, 999}
GONE_CODES = {404, 410}
# Body markers of bot-wall challenge pages served with a 200/403/503.
CHALLENGE_MARKERS = (
    "just a moment...",
    "attention required! | cloudflare",
    "cf-browser-verification",
    "access denied</title>",
    "you don't have permission to access",
    "request unsuccessful. incapsula",
    "pardon our interruption",
)
SNIFF_BYTES = 65536
CLASSES = ("ok", "redirect", "not-found", "blocked", "client-error", "server-error", "network-error")


# ---------------------------------------------------------------- collection

def collect_urls(node, ref: str, out: dict, key: str | None = None, parent: str | None = None):
    """Walk a parsed YAML tree; record every http(s) URL under a *url / website key.

    `out` maps url -> list of {"ref", "kind"}; kind is source / application / website.
    """
    if isinstance(node, dict):
        for k, v in node.items():
            collect_urls(v, f"{ref}.{k}" if ref else str(k), out, str(k), key)
    elif isinstance(node, list):
        for i, item in enumerate(node):
            collect_urls(item, f"{ref}[{i}]", out, key, parent)
    elif isinstance(node, str) and key and (key.endswith("url") or key == "website"):
        if urlparse(node).scheme not in {"http", "https"}:
            return
        if key == "website":
            kind = "website"
        elif key == "url" and parent == "source":
            kind = "source"
        elif key in {"apply_url", "pre_approval_check_url"}:
            kind = "application"
        else:
            kind = "other"
        out.setdefault(node, []).append({"ref": ref, "kind": kind})


def collect_dataset_urls(data_dir: Path = DATA_DIR) -> dict:
    out: dict = {}
    for path in sorted(data_dir.rglob("*.yaml")):
        with path.open(encoding="utf-8") as f:
            doc = yaml.safe_load(f)
        local: dict = {}
        collect_urls(doc, "", local)
        rel = path.relative_to(ROOT).as_posix()
        for url, refs in local.items():
            for r in refs:
                r["file"] = rel
            out.setdefault(url, []).extend(refs)
    return out


# ---------------------------------------------------------------- classification

def _norm(url: str) -> tuple[str, str]:
    p = urlparse(url)
    host = (p.hostname or "").lower()
    host = host[4:] if host.startswith("www.") else host
    return host, (p.path or "/").rstrip("/").lower() + ("?" + p.query if p.query else "")


ERROR_PAGE_MARKERS = ("404", "not-found", "notfound", "page-not-found", "/error", "sitemap")


def redirect_kind(original: str, final: str) -> str | None:
    """None when final is the cited URL; else one of the redirect kinds above."""
    if final == original:
        return None
    o_host, o_path = _norm(original)
    f_host, f_path = _norm(final)
    if (o_host, o_path) == (f_host, f_path):
        return "cosmetic"
    if any(m in f_path for m in ERROR_PAGE_MARKERS) and not any(m in o_path for m in ERROR_PAGE_MARKERS):
        return "to-error-page"
    if f_path in {"", "/"} and o_path not in {"", "/"}:
        return "to-homepage"
    if o_path == f_path:
        return "host-moved"
    return "moved"


# Bot-manager interstitial hosts a blocked request is redirected to
# (Radware ShieldSquare on federal.bank.in is validate.perfdrive.com).
BOT_WALL_HOSTS = ("perfdrive.com", "shieldsquare.net", "hcaptcha.com", "captcha-delivery.com")


def is_bot_wall_url(url: str | None) -> bool:
    host = (urlparse(url or "").hostname or "").lower()
    return any(host == h or host.endswith("." + h) for h in BOT_WALL_HOSTS)


def looks_like_challenge(body: str) -> bool:
    low = body.lower()
    return any(m in low for m in CHALLENGE_MARKERS)


def classify(code: int | None, original: str, final: str | None, body: str = "", error: str | None = None) -> dict:
    """Pure: map one fetch outcome to {status, redirect_kind}."""
    if error is not None:
        return {"status": "network-error", "redirect_kind": None}
    if code in BLOCKED_CODES or (code is not None and code >= 400 and looks_like_challenge(body)):
        return {"status": "blocked", "redirect_kind": None}
    if code in GONE_CODES:
        return {"status": "not-found", "redirect_kind": None}
    if code is not None and 500 <= code:
        return {"status": "server-error", "redirect_kind": None}
    if code is not None and 400 <= code:
        return {"status": "client-error", "redirect_kind": None}
    if code is not None and 200 <= code < 400:
        if looks_like_challenge(body) or is_bot_wall_url(final):
            return {"status": "blocked", "redirect_kind": None}
        kind = redirect_kind(original, final or original)
        return {"status": "redirect" if kind else "ok", "redirect_kind": kind}
    return {"status": "network-error", "redirect_kind": None}


# ---------------------------------------------------------------- fetching

class HostThrottle:
    """At most `per_host` in-flight requests per host, `gap` seconds apart."""

    def __init__(self, per_host: int, gap: float):
        self.per_host, self.gap = per_host, gap
        self._sems: dict[str, threading.Semaphore] = {}
        self._last: dict[str, float] = defaultdict(float)
        self._lock = threading.Lock()

    def __call__(self, host: str):
        with self._lock:
            sem = self._sems.setdefault(host, threading.Semaphore(self.per_host))
        return _Slot(self, host, sem)


class _Slot:
    def __init__(self, throttle: HostThrottle, host: str, sem: threading.Semaphore):
        self.t, self.host, self.sem = throttle, host, sem

    def __enter__(self):
        self.sem.acquire()
        while True:
            with self.t._lock:
                wait = self.t._last[self.host] + self.t.gap - time.monotonic()
                if wait <= 0:
                    self.t._last[self.host] = time.monotonic()
                    return self
            time.sleep(wait)

    def __exit__(self, *exc):
        self.sem.release()


def _fetch(url: str, method: str, timeout: float):
    """One request. Returns (code, final_url, body_prefix, error)."""
    req = Request(url, method=method, headers=HEADERS)
    try:
        with urlopen(req, timeout=timeout, context=ssl.create_default_context()) as resp:
            body = resp.read(SNIFF_BYTES).decode("utf-8", "replace") if method == "GET" else ""
            return resp.status, resp.geturl(), body, None
    except HTTPError as exc:
        try:
            body = exc.read(SNIFF_BYTES).decode("utf-8", "replace")
        except Exception:  # noqa: BLE001 — body is best-effort
            body = ""
        return exc.code, exc.geturl() or url, body, None
    except (URLError, HTTPException, socket.timeout, TimeoutError, ConnectionError, ssl.SSLError, ValueError) as exc:
        reason = getattr(exc, "reason", exc)
        return None, None, "", f"{exc.__class__.__name__}: {reason}"[:200]


def _fetch_curl(url: str, timeout: float):
    """GET via the curl binary. Same return shape as _fetch."""
    marker = "\n__cci__"
    cmd = ["curl", "-s", "-L", "--max-redirs", "10", "--max-time", str(int(timeout)), "-o", "-",
           "-w", marker + "%{http_code} %{url_effective}"]
    for k, v in HEADERS.items():
        cmd += ["-H", f"{k}: {v}"]
    cmd.append(url)
    try:
        proc = subprocess.run(cmd, capture_output=True, timeout=timeout + 10)
    except (subprocess.TimeoutExpired, OSError) as exc:
        return None, None, "", f"curl {exc.__class__.__name__}"
    out = proc.stdout.decode("utf-8", "replace")
    body, _, tail = out.rpartition(marker)
    code_s, _, final = tail.strip().partition(" ")
    if proc.returncode != 0 or not code_s.isdigit() or code_s == "000":
        return None, None, "", f"curl exit {proc.returncode}"
    return int(code_s), final or url, body[:SNIFF_BYTES], None


def check_url(url: str, throttle: HostThrottle, timeout: float, use_curl: bool = False) -> dict:
    host = (urlparse(url).hostname or "").lower()
    with throttle(host):
        code, final, body, error = _fetch(url, "HEAD", timeout)
    method = "HEAD"
    # Many bank CDNs reject or mis-answer HEAD; anything short of a clean 2xx
    # gets a GET before we believe it.
    if error is not None or code is None or not (200 <= code < 300):
        with throttle(host):
            code, final, body, error = _fetch(url, "GET", timeout)
        method = "GET"
    result = classify(code, url, final, body, error)
    if use_curl and result["status"] in {"blocked", "network-error"}:
        first = f"{method} " + (f"HTTP {code}" if code else str(error))
        with throttle(host):
            c_code, c_final, c_body, c_error = _fetch_curl(url, timeout)
        c_result = classify(c_code, url, c_final, c_body, c_error)
        if c_result["status"] not in {"blocked", "network-error"}:
            return {"url": url, "host": host, "code": c_code, "final_url": c_final, "method": "curl",
                    "error": None, "python_result": first, **c_result}
        if c_error is None:  # curl reached the server; its answer is the better evidence
            code, final, error, result, method = c_code, c_final, None, c_result, "curl"
    return {"url": url, "host": host, "code": code, "final_url": final, "method": method,
            "error": error, **result}


# ---------------------------------------------------------------- reporting

def write_reports(results: list[dict], urls: dict, out_dir: Path, started: datetime) -> Counter:
    counts = Counter(r["status"] for r in results)
    redirect_kinds = Counter(r["redirect_kind"] for r in results if r["redirect_kind"])
    for r in results:
        r["refs"] = urls[r["url"]]
    out_dir.mkdir(parents=True, exist_ok=True)
    payload = {
        "generated_at": started.isoformat(timespec="seconds"),
        "total_urls": len(results),
        "counts": {c: counts.get(c, 0) for c in CLASSES},
        "redirect_kinds": dict(redirect_kinds),
        "results": sorted(results, key=lambda r: (CLASSES.index(r["status"]), r["url"])),
    }
    (out_dir / "link-report.json").write_text(json.dumps(payload, indent=2), encoding="utf-8")

    lines = [
        f"# Source link report — {started.date().isoformat()}",
        "",
        f"{len(results)} distinct URLs checked from `data/`.",
        "",
        "| Class | URLs |",
        "| --- | ---: |",
    ]
    lines += [f"| {c} | {counts.get(c, 0)} |" for c in CLASSES]
    if redirect_kinds:
        lines += ["", "Redirects by kind: " + ", ".join(f"{k} {v}" for k, v in sorted(redirect_kinds.items()))]
    blocked_hosts = Counter(r["host"] for r in results if r["status"] == "blocked")
    if blocked_hosts:
        lines += ["", "Blocked (bot wall, unverified — not broken), by host: "
                  + ", ".join(f"{h} {n}" for h, n in blocked_hosts.most_common())]
    for status, title in (
        ("not-found", "Not found (fix these first)"),
        ("redirect:to-error-page", "Redirects to an error page (soft 404)"),
        ("redirect:to-homepage", "Redirects to a homepage (likely soft 404)"),
        ("network-error", "Network errors"),
        ("server-error", "Server errors"),
        ("client-error", "Other client errors"),
        ("redirect:moved", "Moved (update the cited URL)"),
        ("redirect:host-moved", "Same path on a new host (update the domain)"),
        ("blocked", "Blocked by a bot wall (unverified, not broken)"),
    ):
        if status.startswith("redirect:"):
            rows = [r for r in results if r["redirect_kind"] == status.split(":")[1]]
        else:
            rows = [r for r in results if r["status"] == status]
        if not rows:
            continue
        lines += ["", f"## {title} ({len(rows)})", ""]
        for r in sorted(rows, key=lambda r: r["url"]):
            where = sorted({ref["file"] for ref in r["refs"]})
            more = f" (+{len(where) - 3} more)" if len(where) > 3 else ""
            detail = r["error"] or (f"HTTP {r['code']}" + (f" → {r['final_url']}" if r["redirect_kind"] else ""))
            lines.append(f"- {r['url']} — {detail} — {', '.join(where[:3])}{more}")
    (out_dir / "link-report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    return counts


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--out-dir", default=str(ROOT / "dist"))
    ap.add_argument("--workers", type=int, default=8)
    ap.add_argument("--per-host", type=int, default=2)
    ap.add_argument("--host-gap", type=float, default=1.0, help="min seconds between requests to one host")
    ap.add_argument("--timeout", type=float, default=20.0)
    ap.add_argument("--limit", type=int, default=0, help="check only the first N URLs (smoke runs)")
    ap.add_argument("--fail-on", default="", help="comma list of classes that make the exit code 1")
    ap.add_argument("--no-curl", action="store_true", help="skip the curl re-check of blocked/network-error URLs")
    args = ap.parse_args(argv)

    fail_on = {c.strip() for c in args.fail_on.split(",") if c.strip()}
    unknown = fail_on - set(CLASSES)
    if unknown:
        ap.error(f"unknown class(es) in --fail-on: {', '.join(sorted(unknown))}")

    started = datetime.now(timezone.utc)
    urls = collect_dataset_urls()
    todo = sorted(urls)[: args.limit] if args.limit else sorted(urls)
    throttle = HostThrottle(args.per_host, args.host_gap)
    use_curl = not args.no_curl and shutil.which("curl") is not None
    print(f"Checking {len(todo)} distinct URLs ({args.workers} workers, {args.per_host}/host, "
          f"{args.timeout:.0f}s timeout, curl re-check {'on' if use_curl else 'off'})...", flush=True)
    results = []
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {pool.submit(check_url, u, throttle, args.timeout, use_curl): u for u in todo}
        for i, fut in enumerate(as_completed(futures), 1):
            results.append(fut.result())
            if i % 50 == 0:
                print(f"  {i}/{len(todo)}", flush=True)
    counts = write_reports(results, {u: urls[u] for u in todo}, Path(args.out_dir), started)
    print("  " + " · ".join(f"{c} {counts.get(c, 0)}" for c in CLASSES))
    print(f"Report: {Path(args.out_dir) / 'link-report.md'}")
    hit = sorted(c for c in fail_on if counts.get(c))
    if hit:
        print(f"FAIL: {', '.join(hit)} present")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
