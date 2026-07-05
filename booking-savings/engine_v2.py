#!/usr/bin/env python3
"""
Engine v2 — category-aware reward calculator WITH cap enforcement.
Fixes the "3-crore" bug: applies each category's best accelerator, enforces per-cycle
caps, respects exclusions, and nets forex on the international (FX) category.

Spend profile = monthly Rs per category. Reward valued at realized (floor) unit value.
"""
import glob, yaml, sys

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

def cap_accel_spend(cap, unit, cycle, arate, value):
    """Monthly spend that still earns the accelerated rate, given the cap."""
    if cap in (None,"unlimited") or not isinstance(cap,(int,float)): return float("inf")
    cap_m = cap / CYCLE_DIV.get(cycle,1)
    unit = unit or "points"   # schema default — a missing cap_unit is NOT uncapped
    if unit == "spend-inr": return cap_m
    if unit == "cashback-inr": return cap_m/(arate*value) if arate*value>0 else float("inf")
    if unit in ("points","miles"): return cap_m/arate if arate>0 else float("inf")  # cap_m = units; spend = units/rate
    return float("inf")

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

def load_cards():
    out=[]
    for fp in glob.glob("data/cards/**/*.yaml", recursive=True):
        d=yaml.safe_load(open(fp,encoding="utf-8"))
        if not d or "rewards" not in d or d.get("status")=="discontinued": continue
        rec=act(d["rewards"]); b=rec.get("base",{})
        val=b.get("unit_value_inr_realized") or b.get("unit_value_inr")
        if not isinstance(val,(int,float)) or not b.get("per_inr"): continue
        out.append(dict(
            slug=fp.replace("\\","/").split("data/cards/")[1][:-5],
            name=d.get("name"), tier=d.get("tier"),
            base_rate=b["rate"]/b["per_inr"], per_inr=b["per_inr"], val=val, face=b.get("unit_value_inr") or val,
            accel=rec.get("accelerated") or [], excl=set(rec.get("exclusions") or []),
            mccx=set(rec.get("mcc_exclusions") or []),
            base_cap=(dict(cap=b["cap_per_cycle"], unit=b.get("cap_unit"), cycle=b.get("cycle"))
                      if isinstance(b.get("cap_per_cycle"),(int,float)) else None),
            reward_cap=rec.get("reward_cap"),
            fee=act(d["fees"]).get("annual_fee_inr",0),
            fee_waiver=act(d["fees"]).get("fee_waiver"),
            forex=act(d["fees"]).get("forex_markup_pct",0) or 0))
    return out

def compute(card, profile, basis="realized"):
    """Two layers = two SOURCED unit values, nothing invented:
      basis="realized" -> unit_value_inr_realized (the researched floor, e.g. Adani's 0.90).
      basis="face"     -> unit_value_inr          (the best documented redemption, the ceiling).
    Caps, exclusions and forex are real product terms and apply in BOTH. There are NO made-up
    friction coefficients (portal markup / routability) — those were removed 2026-07-05.
    Channel-gated accelerators (channel.required, e.g. SmartBuy 10X) count only in the
    ABSOLUTE ceiling: the realistic floor must not assume the whole bucket routes through
    a portal (R3). The layers stay separate — routing optimism lives with value optimism."""
    from collections import defaultdict
    per=card["per_inr"]; val=(card["face"] if basis=="face" else card["val"]); brate=card["base_rate"]
    def channel_locked(a):
        ch=a.get("channel")
        return bool(ch) and ch.get("required",True)
    # 1) assign each spending category to its BEST accelerator (else base). Group by accelerator
    #    so a shared per-cycle cap is enforced across all the categories it covers.
    mccx_cats={EXCL_MCC[m] for m in card.get("mccx") or set() if m in EXCL_MCC}
    groups=defaultdict(float); accel_of={}; base_spend=0.0
    for cat in CATS:
        sp=profile.get(cat,0)
        if sp<=0: continue
        if EXCL.get(cat) in card["excl"] or cat in mccx_cats: continue   # excluded -> zero reward
        best=None
        for idx,a in enumerate(card["accel"]):
            if cat in (a.get("canonical_categories") or []):
                if basis!="face" and channel_locked(a): continue  # floor: no portal assumption
                arate=accel_rate(a,brate,per)
                # Cap-aware selection: rank by realised value on THIS category's
                # spend, not headline rate — a 10% capped at Rs100/mo must not
                # beat an uncapped 3% on Rs20k spend.
                cs=cap_accel_spend(a.get("cap_per_cycle"),a.get("cap_unit"),a.get("cycle","monthly"),arate,val)
                acc=min(sp,cs)
                v=acc*arate*val+max(0.0,sp-acc)*brate*val
                if best is None or v>best[0]: best=(v,arate,idx,a)
        # An accelerator whose realised value beats plain base wins the category.
        if best and best[0]>sp*brate*val: groups[best[2]]+=sp; accel_of[best[2]]=(best[1],best[3])
        else: base_spend+=sp
    # 2) base earn on unaccelerated spend
    base_value=base_spend*brate*val; accel_value=0.0
    # 3) each accelerator: enforce its shared per-cycle cap (a real product limit)
    for idx,spend in groups.items():
        arate,a=accel_of[idx]
        cs=cap_accel_spend(a.get("cap_per_cycle"),a.get("cap_unit"),a.get("cycle","monthly"),arate,val)
        acc=min(spend,cs)
        accel_value += acc*arate*val
        base_value  += (spend-acc)*brate*val   # over-cap spend earns base
    # 4) base cap_per_cycle clamps everything earned at the base rate;
    #    reward_cap clamps the whole monthly total (site-engine parity).
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
    return dict(net=net, gross=monthly*12, fx=fx, fee=fee, waived=waived)

def run(profile, title, topn=12):
    cards=load_cards()
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
        print(f"{i:>2} {c['slug'][:31]:32} {str(c['tier'])[:11]:12} Rs{rr['net']:>8,.0f}({rr['net']/ann*100:4.1f}%) Rs{rf['net']:>8,.0f}({rf['net']/ann*100:4.1f}%) Rs{rr['fee']:>5,}")
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
    import sys
    which = sys.argv[1] if len(sys.argv)>1 else None
    for title,prof in STRESS.items():
        if which and which.lower() not in title.lower(): continue
        rows=run(prof, title, topn=6)
        # sanity flag: only the genuinely absurd. A high category % can be real (SmartBuy 10X is
        # ~33% on the capped slice) — the earlier >12% flag was an artifact of the removed friction.
        rr,rf,c=rows[0]; ann=sum(prof.values())*12
        if ann>0 and rr["net"]>ann:
            print(f"  !! SANITY: net > annual spend (absurd, likely a missing cap) — {c['slug']}")
