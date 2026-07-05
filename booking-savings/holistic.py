#!/usr/bin/env python3
"""
Holistic travel-booking savings model  (booking-savings/ — lives in this repo but is
independent of the card dataset and its validate/build pipeline).

Net effective cost = price*(1-capped_discount) - value of rewards earned    [pay cash]
                   = points_used * point's_best_alternative_value           [pay with points]

Markups/discounts below are GROUNDED in 2025-26 research (see MARKUPS.md), split by route
type. They are central estimates — dynamic pricing means any single booking varies.
"""
from dataclasses import dataclass
from typing import Optional, Callable

PT = {"cashback":1.00, "atlas_floor":1.00, "atlas_xfer":2.00, "infinia_sb":1.00, "mmt_mycash":1.00}

# ---- grounded route profiles: markups vs cheapest channel + bank instant-discount caps ----
# Values calibrated to the 2026-07 channel-pricing research (see MARKUPS.md for the sourced
# table + confidence per cell). KEY CAVEATS the numbers can't fully capture:
#  - Bank instant discounts are mostly SALE-ONLY (live a few days/month); the always-on
#    exception is ICICI x ixigo domestic flights (12%/Rs1,500, Wednesdays). This model assumes
#    an active sale — net savings without one are lower.
#  - SmartBuy/EDGE BLOCK stackable bank coupons, so their smaller disc caps below are deliberate.
#  - OTA convenience fee is fare-size dependent (bigger % gap on cheap fares) — `ota` is a central estimate.
PROFILES = {
 # P=typical price; sb/edge=portal markup; ota=priciest-OTA(MMT) sticker premium;
 # inst_pct/inst_cap = bank instant discount on OTAs; mmt_earn = MMT-ICICI myCash %
 "Domestic flight": dict(P=8000,  sb=0.03, edge=0.055, ota=0.04, inst=0.10, cap=1750, mmt_earn=0.03, direct=True),
 "Intl flight":     dict(P=45000, sb=0.08, edge=0.12, ota=0.04, inst=0.10, cap=5000, mmt_earn=0.03, direct=True),
 "Domestic hotel":  dict(P=12000, sb=0.10, edge=0.30, ota=0.12, inst=0.10, cap=3000, mmt_earn=0.06, direct=False),
 "Intl hotel":      dict(P=60000, sb=0.20, edge=0.32, ota=0.15, inst=0.10, cap=10000, mmt_earn=0.06, direct=False),
}

@dataclass
class Method:
    name: str; markup: float=0.0; disc_pct: float=0.0; disc_cap: float=0.0
    mode: str="cash"; earn: Optional[Callable]=None; redeem_rate: float=1.0; point_alt: float=1.0; note: str=""
    def net(self, P):
        price = P*(1+self.markup)
        disc = min(price*self.disc_pct, self.disc_cap) if self.disc_pct else 0.0
        price -= disc
        if self.mode=="cash":
            reward = self.earn(price) if self.earn else 0.0
            return price-reward, price, reward, 0.0
        pts = price/self.redeem_rate
        return pts*self.point_alt, price, 0.0, pts

def flat(pct, ptval=1.0): return lambda s: s*pct*ptval
def capped(acc, cap_spend, base, ptval=1.0):
    return lambda s: (min(s,cap_spend)*acc + max(0,s-cap_spend)*base)*ptval

def methods_for(pr):
    ms = [
      Method("Cheapest OTA (EMT/Ixigo) + 1.5% cashback + bank 10%-off",
             disc_pct=pr["inst"], disc_cap=pr["cap"], earn=flat(0.015)),
      Method("Cheapest OTA + Atlas base (mi@Rs1) + bank 10%-off",
             disc_pct=pr["inst"], disc_cap=pr["cap"], earn=flat(0.02, PT["atlas_floor"])),
      Method("MakeMyTrip + MMT-ICICI myCash + MMT 10%-off",
             markup=pr["ota"], disc_pct=pr["inst"], disc_cap=pr["cap"], earn=flat(pr["mmt_earn"], PT["mmt_mycash"]),
             note="myCash closed-loop (MMT only)"),
      Method("SmartBuy + Infinia 10X + SmartBuy 10%-off (cap Rs500)",
             markup=pr["sb"], disc_pct=0.10, disc_cap=500, earn=capped(0.3333,22500,0.0333,PT["infinia_sb"]),
             note="10X=33% up to Rs22.5k/mo then 3.33%"),
      Method("SmartBuy + PAY WITH POINTS (Infinia)",
             markup=pr["sb"], disc_pct=0.10, disc_cap=500, mode="points", point_alt=PT["infinia_sb"],
             note="burns RP@Rs1, forgoes earn"),
      Method("Axis Travel EDGE + Atlas 5X (mi@Rs1 floor)", markup=pr["edge"], earn=flat(0.05, PT["atlas_floor"])),
      Method("Axis Travel EDGE + Atlas 5X (mi@Rs2 transfer)", markup=pr["edge"], earn=flat(0.05, PT["atlas_xfer"]),
             note="if you'll transfer EDGE Miles 1:2 to KrisFlyer/Turkish"),
    ]
    if pr["direct"]:
        ms.append(Method("Direct airline (at par) + Atlas base (mi@Rs1)", earn=flat(0.02, PT["atlas_floor"]),
                         note="no OTA coupon, but no markup/fee"))
    return ms

for title, pr in PROFILES.items():
    rows = sorted(((m.net(pr["P"]), m) for m in methods_for(pr)), key=lambda r: r[0][0])
    best = rows[0][0][0]
    print("\n"+"="*100)
    print(f"{title}  (P = Rs {pr['P']:,})   portal markups: SmartBuy +{pr['sb']*100:.0f}%  EDGE +{pr['edge']*100:.0f}%   "
          f"bank offer: {pr['inst']*100:.0f}% cap Rs{pr['cap']:,}")
    print("="*100)
    for i,((net,price,rew,pts),m) in enumerate(rows,1):
        rv = f"+Rs{rew:,.0f}" if m.mode=="cash" else f"{pts:,.0f}pts"
        d = "" if i==1 else f"+Rs{net-best:,.0f}"
        star = "  <== cheapest" if i==1 else ""
        print(f"{i:>2}. {m.name:52} price Rs{price:>8,.0f}  {rv:>11}  NET Rs{net:>8,.0f} {d:>9}{star}")
