#!/usr/bin/env python3
"""
Engine v2 — category-aware reward calculator WITH cap enforcement.
Fixes the "3-crore" bug: applies each category's best accelerator, enforces per-cycle
caps, respects exclusions, and nets forex on the international (FX) category.

Spend profile = monthly Rs per category. Reward valued at realized (floor) unit value.
Semantics follow the site calculator (site/lib/accelerators.ts, slabs.ts, calculator.ts).
"""
import sys
from collections import Counter, defaultdict
from pathlib import Path

import yaml

# Resolved from this file, not the CWD, so the engine finds the data from any directory.
REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = REPO_ROOT / "data"

CATS = ["online","groceries","dining","fuel","travel","utilities","rent","international"]
# spend category -> exclusion token that zeroes it out on a card
EXCL = {"fuel":"fuel","rent":"rent","utilities":"utilities"}
# MCCs that zero a whole single-MCC-family category (mirrors site/lib/calculator.ts)
EXCL_MCC = {"5541":"fuel","5542":"fuel","5983":"fuel","5172":"fuel","6513":"rent","4900":"utilities"}
CYCLE_DIV = {"monthly":1,"statement":1,"quarterly":3,"annual":12}

def act(recs):
    for r in recs:
        if r.get("effective_until") in (None,): return r
    return recs[-1]

def cap_value_monthly(cap, unit, cycle, val, brate):
    """Cap (units per cycle) as a monthly INR value ceiling; None = uncapped.
    Used for base cap_per_cycle and card-wide reward_cap (site parity)."""
    if cap in (None,"unlimited") or not isinstance(cap,(int,float)): return None
    cap_m = cap / CYCLE_DIV.get(cycle,1)
    unit = unit or "points"
    if unit == "cashback-inr": return cap_m
    if unit == "spend-inr": return cap_m*brate*val
    if unit in ("points","miles"): return cap_m*val
    return None

def accel_cap_inr(a, rate_inr, val):
    """An accelerator's cap as monthly INR (None = uncapped). A spend-inr cap is converted
    at the rate this bucket actually earns, so a slab schedule's blended rate counts."""
    cap = a.get("cap_per_cycle")
    if cap in (None,"unlimited") or not isinstance(cap,(int,float)): return None
    unit = a.get("cap_unit") or "points"   # schema default — a missing cap_unit is NOT uncapped
    if unit == "cashback-inr": inr = cap
    elif unit == "spend-inr": inr = cap*rate_inr
    elif unit in ("points","miles"): inr = cap*val
    else: return None
    return inr / CYCLE_DIV.get(a.get("cycle","monthly"),1)

def accel_rate(a, brate, per):
    """Card-side accelerated earn in units/Rs. Prefers card_attributable_rate —
    effective_rate is the receipt-visible stacked total and double-counts the
    loyalty programme's own earn, which this engine has no programme table to
    add back (DECISIONS D-8). Honours effective_per_inr (a "35 per Rs200"
    record must not be divided by the base per_inr). `is not None` so an
    authored 0 means zero, not a fall-through to the multiplier path."""
    if a.get("card_attributable_rate") is not None:
        return a["card_attributable_rate"]/(a.get("card_attributable_per_inr") or 100)
    if a.get("effective_rate") is not None:
        return a["effective_rate"]/(a.get("effective_per_inr") or per)
    return (a.get("multiplier") or 1)*brate

# --- marginal slab schedules (port of site/lib/slabs.ts) -----------------------------
# Slabs are tax brackets over CUMULATIVE qualifying spend in the cycle, and rate_pct is a
# percent of spend in INR (not reward units), so slab value never goes through unit value.

def _slab_floor(slabs, target):
    floor = 0
    for s in slabs:
        if s is target: return floor
        floor = s.get("upto_spend_inr") if s.get("upto_spend_inr") is not None else floor
    return floor

def slab_earn(slabs, amount, consumed=0.0):
    """(value INR, spend consumed) for spend [consumed, consumed+amount]."""
    value = spend = 0.0; cursor = consumed; left = amount
    for s in slabs:
        if left <= 0: break
        ceiling = s.get("upto_spend_inr")
        ceiling = float("inf") if ceiling is None else ceiling
        if cursor >= ceiling: continue
        width = min(left, ceiling - cursor)
        earned = width*s["rate_pct"]/100
        if s.get("max_value_inr") is not None:
            # This slab's own ceiling may already be partly spent by earlier buckets.
            prior = max(0.0, min(cursor, ceiling) - _slab_floor(slabs, s))
            earned = max(0.0, min(earned, s["max_value_inr"] - prior*s["rate_pct"]/100))
        value += earned; spend += width; cursor += width; left -= width
    return value, spend

def slab_spend_for_value(slabs, target, consumed=0.0):
    """Spend needed to earn `target` INR under the schedule, starting from `consumed`."""
    spend = 0.0; remaining = target; cursor = consumed
    for s in slabs:
        if remaining <= 0: break
        ceiling = s.get("upto_spend_inr")
        ceiling = float("inf") if ceiling is None else ceiling
        if cursor >= ceiling: continue
        width = ceiling - cursor
        if s["rate_pct"] <= 0:
            # A 0% slab buys no value; it still consumes spend before the next slab.
            if width == float("inf"): break
            spend += width; cursor += width; continue
        here = min(remaining, width*s["rate_pct"]/100)
        sp = here*100/s["rate_pct"]
        spend += sp; cursor += sp; remaining -= here
    return spend

# --- loading ------------------------------------------------------------------------

def load_programs(data_dir=None):
    out = {}
    for fp in sorted(Path(data_dir or DATA_DIR).joinpath("loyalty_programs").rglob("*.yaml")):
        p = yaml.safe_load(fp.read_text(encoding="utf-8"))
        if p and p.get("id"): out[p["id"]] = p
    return out

def unit_values(rec, programs):
    """(realized, face) unit value, same precedence as unitValueFor: the loyalty programme's
    values win unless unit_value_from_program is false (D-27). A cashback card with none
    authored is worth Rs1 per unit (the calculator's fallback). None = no sourced value."""
    b = rec.get("base") or {}
    pid = rec.get("loyalty_program")
    if pid and rec.get("unit_value_from_program") is not False and pid in programs:
        uv = programs[pid].get("unit_value_inr") or {}
        face, real = uv.get("face"), uv.get("realized")
    else:
        face, real = b.get("unit_value_inr"), b.get("unit_value_inr_realized")
    face = face if isinstance(face,(int,float)) else None
    real = real if isinstance(real,(int,float)) else None
    realized = real if real is not None else face
    face = face if face is not None else real
    if realized is None and rec.get("currency") == "cashback": return 1, 1
    return realized, face

def card_from_doc(d, slug, programs):
    """(card, None) for a rankable card, else (None, reason)."""
    rec = act(d["rewards"]); b = rec.get("base") or {}
    if not b.get("per_inr") or not isinstance(b.get("rate"),(int,float)):
        return None, "no base rate/per_inr"
    pid = rec.get("loyalty_program")
    if pid and rec.get("unit_value_from_program") is not False and pid not in programs:
        return None, f"loyalty programme {pid} not found"
    val, face = unit_values(rec, programs)
    if val is None:
        return None, f"no unit value ({rec.get('currency') or 'unknown'} currency)"
    fees = act(d.get("fees") or [{}])
    stated_fee = fees.get("annual_fee_inr")
    return dict(
        slug=slug, name=d.get("name"), tier=d.get("tier"),
        base_rate=b["rate"]/b["per_inr"], per_inr=b["per_inr"], val=val, face=face,
        accel=rec.get("accelerated") or [], excl=set(rec.get("exclusions") or []),
        mccx=set(rec.get("mcc_exclusions") or []),
        base_excl=set(b.get("excluded_categories") or []),
        base_scope=set(b.get("applies_to_categories") or []),
        base_cap=(dict(cap=b["cap_per_cycle"], unit=b.get("cap_unit"), cycle=b.get("cycle"))
                  if isinstance(b.get("cap_per_cycle"),(int,float)) else None),
        reward_cap=rec.get("reward_cap"),
        # A null fee is counted as 0 and flagged, never silently shown as "free" (calculator parity).
        fee=stated_fee if isinstance(stated_fee,(int,float)) else 0,
        fee_unknown=not isinstance(stated_fee,(int,float)),
        fee_waiver=fees.get("fee_waiver"),
        forex=fees.get("forex_markup_pct",0) or 0), None

def load_cards(data_dir=None):
    """(cards, skipped): skipped lists {slug, reason} for every live card the engine cannot
    rank, so a missing unit value shows up in the output instead of the card vanishing."""
    data_dir = Path(data_dir or DATA_DIR)
    programs = load_programs(data_dir)
    cards_dir = data_dir / "cards"
    out = []; skipped = []
    for fp in sorted(cards_dir.rglob("*.yaml")):
        d = yaml.safe_load(fp.read_text(encoding="utf-8"))
        if not d or "rewards" not in d or d.get("status")=="discontinued": continue
        slug = fp.relative_to(cards_dir).with_suffix("").as_posix()
        card, why = card_from_doc(d, slug, programs)
        if card: out.append(card)
        else: skipped.append(dict(slug=slug, reason=why))
    return out, skipped

def skipped_summary(skipped):
    if not skipped: return "all cards ranked"
    by = Counter(s["reason"] for s in skipped)
    return f"{len(skipped)} cards not ranked: " + "; ".join(f"{n} {r}" for r,n in by.most_common())

# --- scoring ------------------------------------------------------------------------

def bucket_base_rate(card, cat):
    """Base rate on one category: 0 when the base excludes it or is scoped away from it
    (port of baseRateForBucket)."""
    if cat in card.get("base_excl", ()): return 0.0
    scope = card.get("base_scope")
    if scope and cat not in scope: return 0.0
    return card["base_rate"]

def compute(card, profile, basis="realized"):
    """Two layers = two SOURCED unit values, nothing invented:
      basis="realized" -> unit_value_inr_realized (the researched floor, e.g. Adani's 0.90).
      basis="face"     -> unit_value_inr          (the best documented redemption, the ceiling).
    Caps, exclusions and forex are real product terms and apply in BOTH. There are NO made-up
    friction coefficients (portal markup / routability) — those were removed 2026-07-05.
    Channel-gated accelerators (channel.required, e.g. SmartBuy 10X) count only in the
    ABSOLUTE ceiling: the realistic floor must not assume the whole bucket routes through
    a portal (R3). The layers stay separate — routing optimism lives with value optimism."""
    per=card["per_inr"]; val=(card["face"] if basis=="face" else card["val"]); brate=card["base_rate"]
    def channel_locked(a):
        ch=a.get("channel")
        return bool(ch) and ch.get("required",True)
    # Categories are scored in order against shared usage, like the calculator: a cap pool
    # (one accelerator, or every accelerator in a cap_group) and a slab schedule's position
    # carry from one category to the next instead of restarting per category.
    cap_used=defaultdict(float); spend_used=defaultdict(float)
    mccx_cats={EXCL_MCC[m] for m in card.get("mccx") or set() if m in EXCL_MCC}
    base_value=0.0; accel_value=0.0
    for cat in CATS:
        sp=profile.get(cat,0)
        if sp<=0: continue
        if EXCL.get(cat) in card["excl"] or cat in mccx_cats: continue   # excluded -> zero reward
        bbr=bucket_base_rate(card,cat)
        best=None
        for idx,a in enumerate(card["accel"]):
            if cat not in (a.get("canonical_categories") or []): continue
            if basis!="face" and channel_locked(a): continue  # floor: no portal assumption
            slabs=a.get("slabs")
            consumed=spend_used[idx]
            gross=slab_earn(slabs,sp,consumed)[0] if slabs else sp*accel_rate(a,brate,per)*val
            rate_inr=gross/sp
            key=f"group:{a['cap_group']}" if a.get("cap_group") else idx
            cap=accel_cap_inr(a,rate_inr,val)
            remaining=None if cap is None else max(0.0,cap-cap_used[key])
            bound=remaining is not None and gross>remaining
            acc=remaining if bound else gross
            over=0.0
            if bound:
                if slabs: over=max(0.0,sp-slab_spend_for_value(slabs,remaining,consumed))
                elif rate_inr>0: over=sp-remaining/rate_inr
            # Over-cap spend falls back to this category's base rate unless the issuer
            # says it earns nothing (over_cap_earns_base: false).
            over_base=0.0 if a.get("over_cap_earns_base") is False else over*bbr*val
            # Cap-aware selection: rank by realised value on THIS category's spend, not
            # headline rate — a 10% capped at Rs100/mo must not beat an uncapped 3%.
            v=acc+over_base
            if best is None or v>best[0]: best=(v,acc,over_base,idx,key)
        # An accelerator whose realised value beats plain base wins the category.
        if best and best[0]>sp*bbr*val:
            _,acc,over_base,idx,key=best
            cap_used[key]+=acc; spend_used[idx]+=sp
            accel_value+=acc; base_value+=over_base
        else: base_value+=sp*bbr*val
    # base cap_per_cycle clamps everything earned at the base rate;
    # reward_cap clamps the whole monthly total (site-engine parity).
    bc=card.get("base_cap")
    if bc:
        ci=cap_value_monthly(bc.get("cap"),bc.get("unit"),bc.get("cycle"),val,brate)
        if ci is not None: base_value=min(base_value,ci)
    monthly=base_value+accel_value
    rc=card.get("reward_cap")
    if rc:
        ci=cap_value_monthly(rc.get("max_units"),rc.get("cap_unit"),rc.get("cycle"),val,brate)
        if ci is not None: monthly=min(monthly,ci)
    annual=monthly*12
    # forex is a real, per-card charged fee (forex_markup_pct + 18% GST) on FX-charged spend only
    fx=0
    if profile.get("international",0)>0 and card["forex"]>0:
        fx=profile["international"]*12*card["forex"]/100*1.18
        annual-=fx
    fw=card["fee_waiver"]; annual_spend=sum(profile.values())*12
    waived=bool(fw and isinstance(fw.get("spend_inr"),(int,float)) and fw["spend_inr"]<=annual_spend)
    fee=0 if waived else card["fee"]
    net=annual-fee
    return dict(net=net, gross=monthly*12, fx=fx, fee=fee, waived=waived,
                fee_unknown=bool(card.get("fee_unknown")))

def run(profile, title, topn=12, cards=None):
    if cards is None: cards,_=load_cards()
    # TWO LAYERS from the two SOURCED unit values (no invented friction):
    #   realistic = unit_value_inr_realized (researched floor)  -> ranked on this
    #   absolute  = unit_value_inr          (documented ceiling)
    rows=[(compute(c,profile,"realized"),
           compute(c,profile,"face"), c) for c in cards]
    rows.sort(key=lambda x:-x[0]["net"])          # rank by realized (honest floor)
    tot=sum(profile.values()); ann=tot*12
    print("\n"+"="*100)
    print(f"{title}   monthly Rs{tot:,} / annual Rs{ann:,}")
    print("  "+"  ".join(f"{k}:{v//1000}k" for k,v in profile.items() if v>0))
    print("="*100)
    print(f"{'#':>2} {'card':32} {'tier':12} {'realistic/yr':>16} {'absolute/yr':>16} {'fee':>7}")
    for i,(rr,rf,c) in enumerate(rows[:topn],1):
        fee=f"Rs{rr['fee']:>5,}"+(" (fee not stated)" if rr["fee_unknown"] else "")
        print(f"{i:>2} {c['slug'][:31]:32} {str(c['tier'])[:11]:12} Rs{rr['net']:>8,.0f}({rr['net']/ann*100:4.1f}%) Rs{rf['net']:>8,.0f}({rf['net']/ann*100:4.1f}%) {fee}")
    tx=sorted(rows,key=lambda x:-x[1]["net"])[:5]
    print("  absolute-value top5 (ceiling): "+", ".join(f"{c['slug'].split('/')[-1]}=Rs{rf['net']:,.0f}" for rr,rf,c in tx))
    return rows

def P(**kw):
    d={c:0 for c in CATS}; d.update(kw); return d

STRESS = {
 "USER (balanced, online-heavy)": P(online=20000,groceries=10000,dining=8000,fuel=4000,travel=5000,utilities=3000),
 "TRAVEL-heavy":                   P(travel=40000,dining=5000,online=5000),
 "INTERNATIONAL/FX-heavy":         P(international=40000,dining=5000,online=5000),
 "FUEL-heavy":                     P(fuel=30000,groceries=10000,utilities=10000),
 "DINING+ONLINE (foodie)":         P(dining=20000,online=25000,groceries=5000),
 "BIG SPENDER":                    P(online=100000,travel=50000,dining=30000,groceries=20000),
 "LOW spender":                    P(online=3000,groceries=2000,dining=2000),
}
if __name__=="__main__":
    which = sys.argv[1] if len(sys.argv)>1 else None
    cards, skipped = load_cards()
    print(f"engine_v2: {len(cards)} cards ranked; {skipped_summary(skipped)}")
    for title,prof in STRESS.items():
        if which and which.lower() not in title.lower(): continue
        rows=run(prof, title, topn=6, cards=cards)
        # sanity flag: only the genuinely absurd. A high category % can be real (SmartBuy 10X is
        # ~33% on the capped slice) — the earlier >12% flag was an artifact of the removed friction.
        rr,rf,c=rows[0]; ann=sum(prof.values())*12
        if ann>0 and rr["net"]>ann:
            print(f"  !! SANITY: net > annual spend (absurd, likely a missing cap) — {c['slug']}")
