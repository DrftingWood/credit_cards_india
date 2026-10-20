#!/usr/bin/env python3
"""Backfill `source.type` where it follows mechanically from the cited URL (D-21).

Only the URL host decides, using lists the repo already maintains:

  host is issuer-owned (validate.py ISSUER_ALLOWED_DOMAINS for the card's issuer,
  or the issuer's data/issuers/<id>.yaml `website` host)
      -> issuer-pdf if the URL path ends in .pdf, else issuer-page
  host in validate.py AGGREGATOR_SOURCE_DOMAINS  -> aggregator
  host is web.archive.org                        -> archive
  anything else (press, partner sites)           -> left alone, listed

Co-brand partner hosts that the apply-URL allowlist tolerates (irctc.co.in,
scapia.cards) are NOT treated as issuer-owned here. Sources that already have a
`type` are never changed. Nothing else in the file is touched: the script
round-trips with ruamel.yaml and refuses to write a file whose diff would be
anything other than the inserted `type:` lines.

Usage:
    python scripts/backfill_source_type.py                 # dry run, prints a summary
    python scripts/backfill_source_type.py --apply         # writes the files
    python scripts/backfill_source_type.py --sections rewards,fees,benefits
"""
from __future__ import annotations

import argparse
import difflib
import io
import sys
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse

import yaml
from ruamel.yaml import YAML

sys.path.insert(0, str(Path(__file__).resolve().parent))
from validate import AGGREGATOR_SOURCE_DOMAINS, ISSUER_ALLOWED_DOMAINS  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
PARTNER_HOSTS = {"irctc.co.in", "www.irctc.co.in", "scapia.cards", "www.scapia.cards"}


def _strip_www(host: str) -> str:
    return host[4:] if host.startswith("www.") else host


def issuer_hosts() -> dict[str, set[str]]:
    hosts = {k: set(v) - PARTNER_HOSTS for k, v in ISSUER_ALLOWED_DOMAINS.items()}
    for path in (ROOT / "data" / "issuers").glob("*.yaml"):
        doc = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
        site = urlparse(doc.get("website") or "").hostname
        if site:
            hosts.setdefault(path.stem, set()).add(site.lower())
    return {k: {_strip_www(h) for h in v} for k, v in hosts.items()}


def derive_type(url: str, issuer: str, owned: dict[str, set[str]]) -> str | None:
    parsed = urlparse(url)
    host = (parsed.hostname or "").lower()
    if host in PARTNER_HOSTS:
        return None
    if _strip_www(host) in owned.get(issuer, set()):
        return "issuer-pdf" if parsed.path.lower().endswith(".pdf") else "issuer-page"
    if host in AGGREGATOR_SOURCE_DOMAINS:
        return "aggregator"
    if host == "web.archive.org":
        return "archive"
    return None


def make_yaml() -> YAML:
    y = YAML()
    y.preserve_quotes = True
    y.width = 4096
    y.indent(mapping=2, sequence=4, offset=2)
    y.representer.add_representer(type(None), lambda r, d: r.represent_scalar("tag:yaml.org,2002:null", "null"))
    return y


def add_type(src, value: str) -> None:
    """Insert `type` right after `retrieved_on`, keeping following comments/blank lines in place."""
    keys = list(src.keys())
    anchor = "retrieved_on" if "retrieved_on" in keys else keys[-1]
    pos = keys.index(anchor) + 1
    src.insert(pos, "type", value)
    if anchor in src.ca.items:
        # ruamel attaches the comment / blank line that follows a key to that
        # key; hand it to the new key so it stays after the inserted line
        src.ca.items["type"] = src.ca.items.pop(anchor)


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--sections", default="rewards")
    args = ap.parse_args(argv)
    sections = [s.strip() for s in args.sections.split(",") if s.strip()]

    owned = issuer_hosts()
    y = make_yaml()
    stats: Counter = Counter()
    skipped_hosts: Counter = Counter()
    refused: list[str] = []
    for path in sorted((ROOT / "data" / "cards").rglob("*.yaml")):
        raw = path.read_bytes().decode("utf-8")
        newline = "\r\n" if "\r\n" in raw else "\n"
        text = raw.replace("\r\n", "\n")
        doc = y.load(text)
        added = 0
        for sec in sections:
            for rec in doc.get(sec) or []:
                srcs = [rec.get("source")]
                srcs += [a.get("source") for a in (rec.get("accelerated") or []) if hasattr(a, "get")]
                for src in srcs:
                    if not src or not src.get("url"):
                        continue
                    if src.get("type"):
                        stats["already-typed"] += 1
                        continue
                    t = derive_type(src["url"], doc.get("issuer"), owned)
                    if t is None:
                        skipped_hosts[urlparse(src["url"]).hostname] += 1
                        continue
                    add_type(src, t)
                    stats[t] += 1
                    added += 1
        if not added:
            continue
        buf = io.StringIO()
        y.dump(doc, buf)
        out = buf.getvalue()
        diff = [ln for ln in difflib.ndiff(text.splitlines(), out.splitlines()) if ln[:1] in "+-"]
        pure = all(ln.startswith("+ ") and ln.strip()[2:].strip().startswith("type: ") for ln in diff)
        if not pure or len(diff) != added:
            refused.append(path.relative_to(ROOT).as_posix())
            stats["refused-sources"] += added
            continue
        stats["files"] += 1
        if args.apply:
            path.write_bytes(out.replace("\n", newline).encode("utf-8"))

    print(("Applied" if args.apply else "Dry run") + f" — sections: {', '.join(sections)}")
    for k in ("files", "issuer-page", "issuer-pdf", "aggregator", "archive", "already-typed", "refused-sources"):
        print(f"  {k:16} {stats.get(k, 0)}")
    if skipped_hosts:
        print("  left untyped (host not mechanically classifiable): "
              + ", ".join(f"{h} {n}" for h, n in skipped_hosts.most_common()))
    if refused:
        print("  refused (round-trip would change other lines; edit by hand): " + ", ".join(refused))
    return 0


if __name__ == "__main__":
    sys.exit(main())
