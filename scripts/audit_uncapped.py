#!/usr/bin/env python3
"""List active-card accelerators that are uncapped at >=3% effective value.

These distort rankings for any user who unlocks them (docs/TODO.md D20).
Read-only; run before and after each D20 remediation chunk.
"""
from pathlib import Path

import yaml

THRESHOLD_PCT = 3.0
# From this file, not the CWD; a backslash glob also matched nothing off Windows.
CARDS_DIR = Path(__file__).resolve().parent.parent / "data" / "cards"


def find_rows(cards_dir: Path = CARDS_DIR):
    rows = []
    for fp in sorted(Path(cards_dir).rglob("*.yaml")):
        d = yaml.safe_load(fp.read_text(encoding="utf-8"))
        if not d or d.get("status") not in ("active", "invite-only"):
            continue
        for rec in d.get("rewards") or []:
            if rec.get("effective_until") is not None:
                continue
            b = rec.get("base") or {}
            uv = b.get("unit_value_inr_realized") or b.get("unit_value_inr") or (
                1.0 if rec.get("currency") == "cashback" else None)
            if not uv or not b.get("per_inr"):
                continue
            for a in rec.get("accelerated") or []:
                cap = a.get("cap_per_cycle")
                if isinstance(cap, (int, float)):
                    continue  # capped
                # An authored card_attributable_rate of 0 is the card's real rate; `or`
                # would swap in the receipt-visible effective_rate instead.
                attributable = a.get("card_attributable_rate") is not None
                rate = a["card_attributable_rate"] if attributable else a.get("effective_rate")
                per = (a.get("card_attributable_per_inr") if attributable
                       else a.get("effective_per_inr")) or b["per_inr"]
                if rate is None:
                    continue
                pct = rate / per * uv * 100
                if pct >= THRESHOLD_PCT:
                    ch = (a.get("channel") or {}).get("class") if isinstance(a.get("channel"), dict) else None
                    documented = bool(rec.get("capping_rules"))
                    rows.append((d["id"], a.get("category"), rate, round(pct, 1), cap, ch, documented))
    rows.sort(key=lambda r: (r[6], -r[3]))  # undocumented first, then worst-first
    return rows


if __name__ == "__main__":
    rows = find_rows()
    undoc = sum(1 for r in rows if not r[6])
    print(f"{len(rows)} uncapped accelerators >= {THRESHOLD_PCT}% on active cards "
          f"({undoc} undocumented, {len(rows) - undoc} carry a capping_rules no-cap note)")
    for r in rows:
        tag = "        " if r[6] else "[NO-NOTE]"
        print(f"  {tag} {r[0]:35} {str(r[1])[:35]:37} rate={r[2]:>6} ~{r[3]:>5}% cap={r[4]} channel={r[5]}")
