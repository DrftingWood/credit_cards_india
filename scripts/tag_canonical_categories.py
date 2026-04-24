#!/usr/bin/env python3
"""One-shot migration: pre-bake `canonical_categories` onto every untagged
`accelerated` entry in data/cards/**/*.yaml, using the same heuristic rules
the site carries for fallback.

Deliberately text-based (not a YAML round-trip) so file formatting,
key order, and comments are preserved — we only insert one new line per
tagged entry.

Usage:
    python scripts/tag_canonical_categories.py            # dry run, prints diffs
    python scripts/tag_canonical_categories.py --apply    # write changes

After this runs, the site calculator's heuristic fallback is rarely needed;
it remains in place for cards added before the author remembers to tag.
"""
from __future__ import annotations

import argparse
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CARDS_DIR = ROOT / "data" / "cards"

# Mirrors site/lib/category-mapping.ts RULES. Keep in sync.
# Order matters: first match wins for buckets that could overlap.
RULES: list[tuple[re.Pattern[str], list[str]]] = [
    (re.compile(r"amazon|flipkart|myntra|ajio|tata-?cliq|tata-?neu|jiomart|shopping|online|retail"), ["online"]),
    (re.compile(r"grocery|groceries|bigbasket|supermarket|departmental"), ["groceries"]),
    (re.compile(r"dining|restaurant|swiggy|zomato|eazydiner|food-delivery|instamart"), ["dining"]),
    (re.compile(r"fuel|bpcl|hpcl|indianoil|ioc(?!n)|petrol|diesel"), ["fuel"]),
    (re.compile(r"travel|flight|hotel|airline|makemytrip|mmt|yatra|cleartrip|ixigo|goibibo|easemytrip|edge-portal|indigo|air-india|vistara|irctc|marriott|taj|fine-hotels|adani-airports"), ["travel"]),
    (re.compile(r"utility|bill-payments|recharge|airtel-thanks|utilities"), ["utilities"]),
    (re.compile(r"rent"), ["rent"]),
    (re.compile(r"international|forex"), ["international"]),
    (re.compile(r"entertainment|movies|bookmyshow|pvr|cinema|gaming|ott"), ["entertainment"]),
]

# Entries whose category string is intentionally *not* category-specific
# (cross-category spend-threshold boosts, "any spend" uplifts). Skip tagging.
UNTAGGABLE = re.compile(
    r"spend-above|incremental-above|birthday|monthly-spend|weekend-spend|top-\d|any-spend|emi-spends|bundle",
    re.IGNORECASE,
)


def classify(category: str) -> list[str]:
    s = category.lower()
    if UNTAGGABLE.search(s):
        return []
    out: list[str] = []
    seen: set[str] = set()
    for pattern, buckets in RULES:
        if pattern.search(s):
            for b in buckets:
                if b not in seen:
                    out.append(b)
                    seen.add(b)
    return out


def process(path: Path) -> tuple[str, list[str]]:
    """Return (new_text, log_lines). Only returns log entries for changes."""
    text = path.read_text(encoding="utf-8")
    lines = text.split("\n")
    out: list[str] = []
    logs: list[str] = []

    i = 0
    while i < len(lines):
        line = lines[i]
        out.append(line)

        m = re.match(r"^(\s+)- category:\s*(.+?)\s*$", line)
        if m:
            indent = m.group(1)
            raw_category = m.group(2).strip()
            category = raw_category.strip('"').strip("'")
            # Skip if next non-blank entry line is already canonical_categories.
            j = i + 1
            next_line = lines[j] if j < len(lines) else ""
            item_indent = indent + "  "
            if next_line.startswith(f"{item_indent}canonical_categories:"):
                # Already tagged — leave alone.
                i += 1
                continue

            buckets = classify(category)
            if buckets:
                insert = f"{item_indent}canonical_categories: [{', '.join(buckets)}]"
                out.append(insert)
                logs.append(f"  {category} → {buckets}")
        i += 1

    new_text = "\n".join(out)
    return new_text, logs


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="Write changes (otherwise dry-run)")
    args = parser.parse_args()

    changed = 0
    skipped = 0
    for path in sorted(CARDS_DIR.rglob("*.yaml")):
        new_text, logs = process(path)
        if new_text != path.read_text(encoding="utf-8"):
            changed += 1
            rel = path.relative_to(ROOT)
            print(f"{rel}:")
            for entry in logs:
                print(entry)
            if args.apply:
                path.write_text(new_text, encoding="utf-8")
        else:
            skipped += 1

    mode = "APPLIED" if args.apply else "DRY-RUN"
    print(f"\n[{mode}] {changed} file(s) would change, {skipped} unchanged.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
