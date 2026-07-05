#!/usr/bin/env python3
"""List active-card accelerators that are uncapped at >=3% effective value.

These distort rankings for any user who unlocks them (docs/TODO.md D20).
Read-only; run before and after each D20 remediation chunk.
"""
import glob
import yaml

THRESHOLD_PCT = 3.0

rows = []
for fp in glob.glob(r"data\cards\**\*.yaml", recursive=True):
    d = yaml.safe_load(open(fp, encoding="utf-8"))
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
            rate = a.get("card_attributable_rate") or a.get("effective_rate")
            per = (a.get("card_attributable_per_inr") if a.get("card_attributable_rate") is not None
                   else a.get("effective_per_inr")) or b["per_inr"]
            if rate is None:
                continue
            pct = rate / per * uv * 100
            if pct >= THRESHOLD_PCT:
                ch = (a.get("channel") or {}).get("class") if isinstance(a.get("channel"), dict) else None
                rows.append((d["id"], a.get("category"), rate, round(pct, 1), cap, ch))

rows.sort(key=lambda r: -r[3])
print(f"{len(rows)} uncapped accelerators >= {THRESHOLD_PCT}% on active cards")
for r in rows:
    print(f"  {r[0]:35} {str(r[1])[:35]:37} rate={r[2]:>6} ~{r[3]:>5}% cap={r[4]} channel={r[5]}")
