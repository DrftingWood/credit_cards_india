#!/usr/bin/env python3
"""Crawl-diff drift detection (docs/TODO.md D29).

Presence-checking, NOT scraping: for each active card, render its source.url and
hunt the page text for the card's OWN literal values (fees, base rate, forex, caps).
Report MATCHED / NOT-FOUND / CONFLICTING-NUMBER-NEARBY per field. Never parse the
page into a schema — cheap, robust to layout, exactly what the manual audits did.

Core (expectations_for / check_page) is pure + network-free and unit-tested in
scripts/test_crawl_diff.py. The --issuer shell renders live pages via Playwright.

Usage: python scripts/crawl_diff.py --issuer <id>
  exit 0 if every field is MATCHED / NOT-FOUND / SKIPPED
  exit 1 if any field is CONFLICTING-NUMBER-NEARBY
  exit 2 if a page could not be checked (non-2xx, render failure, Playwright missing)
"""
import argparse
import re
import sys
from collections import namedtuple
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

Expectation = namedtuple("Expectation", "field needle keyword needle2")
Result = namedtuple("Result", "field status needle detail")

# how close (chars) a stray number must be to a field keyword to count as a conflict
CONFLICT_WINDOW = 80


def _int_needle_regex(digits: str) -> re.Pattern:
    """Comma-tolerant matcher for an integer needle: 2999 matches '2,999'."""
    return re.compile(",?".join(re.escape(d) for d in digits))


# A needle must not sit inside a longer number: no digit, "d," or "d." right before it
# and no digit, ",d" or ".d" right after, so 500 never matches in "15,000" or "5,000".
_NUM_BEFORE = r"(?<!\d)(?<!\d[,.])"
_NUM_AFTER = r"(?!\d)(?![,.]\d)"


def _num_regex(needle: str) -> re.Pattern:
    """Regex for a needle: comma-tolerant if integer, literal if decimal; digit-bounded."""
    core = _int_needle_regex(needle).pattern if needle.isdigit() else re.escape(needle)
    return re.compile(_NUM_BEFORE + core + _NUM_AFTER)


def _open_record(records):
    for rec in records or []:
        if rec.get("effective_until") is None:
            return rec
    return None


def expectations_for(card: dict):
    """Extract literal needles from a card's OPEN dated records."""
    exps = []
    fee = _open_record(card.get("fees"))
    if fee:
        for field in ("annual_fee_inr", "joining_fee_inr"):
            v = fee.get(field)
            if isinstance(v, (int, float)) and v > 0:
                kw = "annual fee" if field == "annual_fee_inr" else "joining fee"
                exps.append(Expectation(field, str(int(v)), kw, None))
        fx = fee.get("forex_markup_pct")
        if isinstance(fx, (int, float)) and fx > 0:
            # normalise 3.5 -> "3.5", 2.0 -> "2"
            needle = ("%g" % fx)
            exps.append(Expectation("forex_markup_pct", needle, "markup", None))

    rew = _open_record(card.get("rewards"))
    if rew:
        base = rew.get("base") or {}
        rate, per = base.get("rate"), base.get("per_inr")
        if isinstance(rate, (int, float)) and isinstance(per, (int, float)) and per > 0:
            exps.append(Expectation("base_rate", ("%g" % rate), "per", str(int(per))))
        for a in rew.get("accelerated") or []:
            cap = a.get("cap_per_cycle")
            if isinstance(cap, (int, float)) and cap > 0:
                cat = a.get("category") or "accel"
                exps.append(Expectation(f"cap:{cat}", str(int(cap)), "cap", None))
    return exps


def _conflict_nearby(text_low: str, keyword: str, needle: str) -> bool:
    """Keyword present with a DIFFERENT number within CONFLICT_WINDOW chars."""
    if not keyword:
        return False
    for m in re.finditer(re.escape(keyword.lower()), text_low):
        lo = max(0, m.start() - CONFLICT_WINDOW)
        hi = min(len(text_low), m.end() + CONFLICT_WINDOW)
        window = text_low[lo:hi]
        for num in re.findall(r"\d[\d,]*\.?\d*", window):
            if num.replace(",", "").rstrip(".") != needle.replace(",", ""):
                return True
    return False


def check_page(text: str, exps):
    """Classify each expectation against page text."""
    results = []
    text_low = text.lower()
    for e in exps:
        if e.needle2 is not None:
            # proximity pattern: needle <..> keyword <..> needle2  (rate ... per ... per_inr)
            pat = re.compile(
                _num_regex(e.needle).pattern + r"\D{0,25}" + re.escape(e.keyword)
                + r"\D{0,15}" + _num_regex(e.needle2).pattern,
                re.IGNORECASE,
            )
            status = "MATCHED" if pat.search(text) else "NOT-FOUND"
        elif _num_regex(e.needle).search(text):
            status = "MATCHED"
        elif _conflict_nearby(text_low, e.keyword, e.needle):
            status = "CONFLICTING-NUMBER-NEARBY"
        else:
            status = "NOT-FOUND"
        results.append(Result(e.field, status, e.needle, None))
    return results


# --------------------------------------------------------------------------
# Live shell (Playwright). Kept below the pure core so the unit tests never
# import a browser. Network failures degrade to SKIPPED rows, never crash.
# --------------------------------------------------------------------------
def _render(url: str, timeout_s: int = 15):
    from playwright.sync_api import sync_playwright  # local import: optional dep
    with sync_playwright() as p:
        browser = p.chromium.launch()
        try:
            page = browser.new_page()
            resp = page.goto(url, timeout=timeout_s * 1000, wait_until="domcontentloaded")
            final_url = page.url
            text = page.inner_text("body")
            return text, final_url, (resp.status if resp else None)
        finally:
            browser.close()


def _load_cards(issuer: str, root: Path = ROOT):
    import yaml
    cards = []
    for fp in sorted((root / "data" / "cards" / issuer).glob("*.yaml")):
        d = yaml.safe_load(fp.read_text(encoding="utf-8"))
        if d and d.get("status") in ("active", "invite-only"):
            cards.append(d)
    return cards


def _source_url(card):
    for sect in ("fees", "rewards", "benefits"):
        rec = _open_record(card.get(sect))
        if rec and (rec.get("source") or {}).get("url"):
            return rec["source"]["url"]
    return None


def run_issuer(issuer: str, date_str: str, root: Path = ROOT, render=None) -> int:
    if render is None:
        # Without a browser every page would be SKIPPED and the run would look clean.
        try:
            import playwright.sync_api  # noqa: F401
        except ImportError:
            print("error: Playwright is not installed, so no page can be checked "
                  "(pip install playwright && playwright install chromium)", file=sys.stderr)
            return 2
        render = _render
    cards = _load_cards(issuer, root)
    lines = [f"# Crawl-diff drift report — {issuer} — {date_str}", ""]
    lines.append("| card | field | status | needle |")
    lines.append("| --- | --- | --- | --- |")
    any_conflict = False
    unchecked = 0
    from urllib.parse import urlparse
    for card in cards:
        cid = card.get("id")
        url = _source_url(card)
        if not url:
            lines.append(f"| {cid} | (no source.url) | SKIPPED | — |")
            continue
        exps = expectations_for(card)
        try:
            text, final_url, status_code = render(url)
        except Exception as exc:  # network / render failure: reported, never a crash
            unchecked += 1
            lines.append(f"| {cid} | (render) | FETCH-FAILED | {exc.__class__.__name__} |")
            continue
        # An error page's text is not the card's page, so matching against it means nothing.
        if status_code is not None and not 200 <= status_code < 300:
            unchecked += 1
            lines.append(f"| {cid} | (http) | FETCH-FAILED | HTTP {status_code} |")
            continue
        if urlparse(final_url).hostname != urlparse(url).hostname:
            lines.append(f"| {cid} | (redirect) | DRIFT | {urlparse(final_url).hostname} |")
        for r in check_page(text, exps):
            if r.status == "CONFLICTING-NUMBER-NEARBY":
                any_conflict = True
            lines.append(f"| {cid} | {r.field} | {r.status} | {r.needle} |")
    out = root / "docs" / "drift" / f"{issuer}-{date_str}.md"
    out.parent.mkdir(parents=True, exist_ok=True)
    with open(out, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(lines) + "\n")
    print(f"wrote {out} ({len(cards)} active cards; conflicts={'yes' if any_conflict else 'no'}; "
          f"unchecked={unchecked})")
    if unchecked:
        return 2
    return 1 if any_conflict else 0


def main():
    ap = argparse.ArgumentParser(description="Crawl-diff drift detection (D29)")
    ap.add_argument("--issuer", required=True, help="issuer slug, e.g. hsbc")
    ap.add_argument("--date", default=None, help="YYYY-MM-DD stamp for the report (required; no clock in-process)")
    args = ap.parse_args()
    if not args.date:
        ap.error("--date YYYY-MM-DD is required (pass today's date explicitly)")
    sys.exit(run_issuer(args.issuer, args.date))


if __name__ == "__main__":
    main()
