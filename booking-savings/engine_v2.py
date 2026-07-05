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
CYCLE_DIV = {"monthly":1,"statement":1,"quarterly":3,"annual":12}

def act(recs):
    for r in recs:
        if r.get("effective_until") in (None,): return r
    return recs[-1]

def cap_accel_spend(cap, unit, cycle, arate, value):
    """Monthly spend that still earns the accelerated rate, given the cap."""
    if cap in (None,"unlimited") or not isinstance(cap,(int,float)): return float("inf")
    cap_m = cap / CYCLE_DIV.get(cycle,1)
    if unit == "spend-inr": return cap_m
    if unit == "cashback-inr": return cap_m/(arate*value) if arate*value>0 else float("inf")
    if unit in ("points","miles"): return cap_m/arate if arate>0 else float("inf")  # cap_m = units; spend = units/rate
    return float("inf")

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
            fee=act(d["fees"]).get("annual_fee_inr",0),
            fee_waiver=act(d["fees"]).get("fee_waiver"),
            forex=act(d["fees"]).get("forex_markup_pct",0) or 0))
    return out

# --- Friction layer (SEPARATE track — NOT blended into the reward) -----------------------------
# The reward engine computes the card's structural value. This layer models the real-world haircut
# (portal price premium, routability, channel scoping, forex). It is applied ONLY to the realistic
# lens; the absolute lens leaves the card's on-paper value untouched. The two are shown side by side.
PORTAL_MARKUP={"smartbuy":0.10,"edge-travel":0.12,"ishop":0.10}  # hotel-weighted blended premium
PORTALS=set(PORTAL_MARKUP)

def eligibility_fraction(a, mer):
    """Fraction of a category's spend that realistically routes to this accelerator (realistic lens).
    Portal (SmartBuy/EDGE) ~65% routable (inventory/price); merchant co-brand ~50% (you don't put a
    whole broad category at one merchant); broad category accelerator 100%. Absolute lens uses 1.0."""
    if any(m in PORTALS for m in mer): return 0.65
    if bool((a.get("channel") or {}).get("required")) or bool(mer): return 0.50
    return 1.0

def compute(card, profile, basis="realized", realistic=True):
    """Two independent lenses on the same card:
      realistic=False  -> ABSOLUTE: on-paper value, full eligibility, no friction (ceiling).
      realistic=True   -> REALISTIC: friction applied (routability, portal markup, forex) (floor).
    Caps are enforced in BOTH (a per-cycle cap is a hard product limit, not friction)."""
    from collections import defaultdict
    per=card["per_inr"]; val=(card["face"] if basis=="face" else card["val"]); brate=card["base_rate"]
    # 1) assign each spending category to its BEST accelerator (else base). Group by accelerator
    #    so a shared per-cycle cap is enforced across all the categories it covers.
    groups=defaultdict(float); accel_of={}; base_spend=0.0
    for cat in CATS:
        sp=profile.get(cat,0)
        if sp<=0: continue
        if EXCL.get(cat) in card["excl"]: continue   # excluded -> zero reward
        best=None
        for idx,a in enumerate(card["accel"]):
            if cat in (a.get("canonical_categories") or []):
                er=a.get("effective_rate") or (a.get("multiplier") or 1)*brate*per
                arate=er/per
                if best is None or arate>best[0]: best=(arate,idx,a)
        if best: groups[best[1]]+=sp; accel_of[best[1]]=(best[0],best[2])
        else: base_spend+=sp
    # 2) base earn on unaccelerated spend
    monthly=base_spend*brate*val
    # 3) each accelerator: shared cap (always) + friction (realistic lens only)
    portal_pen=0.0
    for idx,spend in groups.items():
        arate,a=accel_of[idx]
        mer=(a.get("channel") or {}).get("merchants") or a.get("merchants") or []
        frac = eligibility_fraction(a, mer) if realistic else 1.0
        mk   = max([PORTAL_MARKUP[m] for m in mer if m in PORTAL_MARKUP], default=0) if realistic else 0.0
        elig = spend*frac
        cs=cap_accel_spend(a.get("cap_per_cycle"),a.get("cap_unit"),a.get("cycle","monthly"),arate,val)
        acc=min(elig,cs)
        monthly += acc*arate*val + (spend-acc)*brate*val   # non-eligible + over-cap earns base
        portal_pen += mk*acc
    monthly-=portal_pen
    annual=monthly*12
    # forex cost on the international (FX-charged) category — friction, realistic lens only
    fx=0
    if realistic and profile.get("international",0)>0 and card["forex"]>0:
        fx=profile["international"]*12*card["forex"]/100*1.18
        annual-=fx
    fw=card["fee_waiver"]; annual_spend=sum(profile.values())*12
    waived=bool(fw and isinstance(fw.get("spend_inr"),(int,float)) and fw["spend_inr"]<=annual_spend)
    fee=0 if waived else card["fee"]
    net=annual-fee
    return dict(net=net, gross=monthly*12, fx=fx, fee=fee, waived=waived)

def run(profile, title, topn=12):
    cards=load_cards()
    # TWO SEPARATE LAYERS shown side by side (never blended):
    #   realistic = realized value + friction (routability/markup/forex)  -> the floor you actually net
    #   absolute  = face value, full eligibility, no friction             -> the on-paper ceiling
    rows=[(compute(c,profile,"realized",realistic=True),
           compute(c,profile,"face",realistic=False), c) for c in cards]
    rows.sort(key=lambda x:-x[0]["net"])          # rank by realistic (honest floor)
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
        # sanity flags
        rr,rf,c=rows[0]; ann=sum(prof.values())*12
        if ann>0:
            toppct=rr["net"]/ann*100
            if toppct>12: print(f"  !! SANITY: top realized return {toppct:.0f}% > 12% — recheck: {c['slug']}")
            if rr["net"]>ann: print(f"  !! SANITY: net > annual spend (absurd) — {c['slug']}")
