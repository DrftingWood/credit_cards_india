#!/usr/bin/env python3
"""List cards whose metadata.last_verified_on is later than the newest nested
source.retrieved_on (docs/TODO.md D8). Such a card claims a verification date no
underlying source backs — usually a bulk sweep moved the stamp without a field
diff. Read-only.
"""
import datetime
import glob
import yaml


def _as_date(v):
    if isinstance(v, datetime.date):
        return v
    if isinstance(v, str):
        try:
            return datetime.date.fromisoformat(v[:10])
        except ValueError:
            return None
    return None


def newest_retrieved(d):
    best = None
    stack = [d]
    while stack:
        cur = stack.pop()
        if isinstance(cur, dict):
            for k, v in cur.items():
                if k == "retrieved_on":
                    dt = _as_date(v)
                    if dt and (best is None or dt > best):
                        best = dt
                else:
                    stack.append(v)
        elif isinstance(cur, list):
            stack.extend(cur)
    return best


rows = []
for fp in glob.glob(r"data\cards\**\*.yaml", recursive=True):
    d = yaml.safe_load(open(fp, encoding="utf-8"))
    if not d:
        continue
    lv = _as_date((d.get("metadata") or {}).get("last_verified_on"))
    nr = newest_retrieved(d)
    if lv and nr and lv > nr:
        rows.append((d["id"], lv, nr, (lv - nr).days))

rows.sort(key=lambda r: -r[3])
print(f"{len(rows)} cards where last_verified_on > newest source.retrieved_on")
for cid, lv, nr, gap in rows:
    print(f"  {cid:35} verified={lv}  newest_retrieved={nr}  (+{gap}d)")
