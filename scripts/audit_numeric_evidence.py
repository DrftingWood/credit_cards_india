#!/usr/bin/env python3
"""Report numeric card fields not explicitly listed in source.fields_verified.

This is a coverage aid, not proof that a source supports a value. It deliberately
does not infer field-level verification from a URL, confidence grade, or note.
"""

from __future__ import annotations

from collections import Counter
from pathlib import Path
import sys

import yaml


ROOT = Path(__file__).resolve().parents[1]
RECORD_TYPES = ("fees", "rewards", "benefits", "eligibility")


def walk_numbers(value, path=""):
    if isinstance(value, bool) or value is None:
        return
    if isinstance(value, (int, float)):
        yield path
    elif isinstance(value, dict):
        for key, child in value.items():
            yield from walk_numbers(child, f"{path}.{key}" if path else str(key))
    elif isinstance(value, list):
        for child in value:
            yield from walk_numbers(child, path)


def normalize(path):
    # Source paths use schema notation without list indexes.
    import re

    return re.sub(r"\[\d+\]", "", path)


def is_covered(path, verified):
    path = normalize(path)
    return any(path == item or path.startswith(item + ".") for item in verified)


def main():
    counts = Counter()
    missing_samples = []
    files = sorted((ROOT / "data" / "cards").rglob("*.yaml"))
    for file in files:
        try:
            card = yaml.safe_load(file.read_text(encoding="utf-8")) or {}
        except Exception as exc:
            print(f"[skip] {file.relative_to(ROOT)}: {exc}", file=sys.stderr)
            continue
        if card.get("status") not in {"active", "invite-only"}:
            continue
        for record_type in RECORD_TYPES:
            records = card.get(record_type) or []
            if isinstance(records, dict):
                records = [records]
            for index, record in enumerate(records):
                if not isinstance(record, dict):
                    continue
                source = record.get("source") or {}
                verified = {normalize(str(item)) for item in source.get("fields_verified") or []}
                for field in walk_numbers(record):
                    if field == "source" or field.startswith("source."):
                        continue
                    full_path = f"{record_type}[{index}].{field}"
                    counts[(record_type, "numeric")] += 1
                    if is_covered(full_path, verified):
                        counts[(record_type, "covered")] += 1
                    else:
                        counts[(record_type, "uncovered")] += 1
                        if len(missing_samples) < 30:
                            missing_samples.append((file.relative_to(ROOT), full_path))

    print("Explicit numeric evidence coverage (coverage aid only; not source verification)")
    for record_type in RECORD_TYPES:
        total = counts[(record_type, "numeric")]
        covered = counts[(record_type, "covered")]
        missing = counts[(record_type, "uncovered")]
        pct = round(100 * covered / total) if total else 100
        print(f"{record_type}: {covered}/{total} numeric fields explicitly covered ({pct}%); {missing} without fields_verified coverage")
    print("Sample uncovered numeric paths:")
    for file, path in missing_samples:
        print(f"  {file} :: {path}")


if __name__ == "__main__":
    main()
