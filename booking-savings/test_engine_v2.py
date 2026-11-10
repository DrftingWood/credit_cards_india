#!/usr/bin/env python3
"""Tests for engine_v2.compute() rate derivation and cap handling.

Run:  PYTHONIOENCODING=utf-8 PYTHONUTF8=1 python booking-savings/test_engine_v2.py
Plain asserts (no pytest) so the file runs in any environment that runs the engine.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from engine_v2 import card_from_doc, compute, load_cards, slab_earn  # noqa: E402


def card(base_rate=0.01, per_inr=100, val=1.0, accel=None, excl=None,
         fee=0, forex=0, mccx=None, base_cap=None, reward_cap=None):
    """Synthetic card matching load_cards() output shape."""
    return dict(
        slug="test/test-card", name="Test Card", tier="mid",
        base_rate=base_rate, per_inr=per_inr, val=val, face=val,
        accel=accel or [], excl=set(excl or []), mccx=set(mccx or []),
        base_cap=base_cap, reward_cap=reward_cap,
        fee=fee, fee_waiver=None, forex=forex,
    )


def profile(**kw):
    d = {c: 0 for c in
         ["online", "groceries", "dining", "fuel", "travel", "utilities", "rent", "international"]}
    d.update(kw)
    return d


def approx(a, b, tol=0.01):
    assert abs(a - b) <= tol, f"expected {b}, got {a}"


# 1. effective_per_inr must be honoured (E1 violation: a Magnus-shaped record
#    "35 units per Rs200" was divided by the BASE per_inr and scored 2x rich).
c = card(base_rate=0.0, per_inr=100, val=1.0, accel=[
    {"canonical_categories": ["dining"], "effective_rate": 35, "effective_per_inr": 200},
])
r = compute(c, profile(dining=10000))
approx(r["gross"], 10000 * (35 / 200) * 12)  # 21,000/yr — NOT 42,000


# 2. effective_rate: 0 must mean zero accelerated earn, not fall through
#    `or` to the multiplier path; and an accelerator worse than base must not
#    drag the category below base earn.
c = card(base_rate=0.02, per_inr=100, val=1.0, accel=[
    {"canonical_categories": ["online"], "effective_rate": 0},
])
r = compute(c, profile(online=10000))
approx(r["gross"], 10000 * 0.02 * 12)  # category earns base, not 0, not multiplier-path


# 3. card_attributable_rate is preferred over the receipt-visible
#    effective_rate (D-8: effective_rate double-counts programme earn).
c = card(base_rate=0.0, per_inr=100, val=1.0, accel=[
    {"canonical_categories": ["travel"], "effective_rate": 6,
     "card_attributable_rate": 3, "card_attributable_per_inr": 100},
])
r = compute(c, profile(travel=10000))
approx(r["gross"], 10000 * 0.03 * 12)  # 3,600/yr — NOT 7,200


# 4. Missing cap_unit defaults to "points" (schema default) — it must NOT
#    silently mean uncapped.
c = card(base_rate=0.0, per_inr=100, val=0.25, accel=[
    {"canonical_categories": ["groceries"], "effective_rate": 5,
     "cap_per_cycle": 1000, "cycle": "monthly"},  # 1000 points/mo, unit omitted
])
r = compute(c, profile(groceries=50000))
# 5 units/Rs100 = 0.05 units/Rs; cap 1000 units covers Rs20k; rest earns base 0.
approx(r["gross"], (20000 * 0.05 * 0.25) * 12)  # 3,000/yr — NOT 7,500


# 5. Regression guard: the existing over-cap-earns-base behaviour still holds.
c = card(base_rate=0.01, per_inr=100, val=1.0, accel=[
    {"canonical_categories": ["dining"], "effective_rate": 10,
     "cap_per_cycle": 500, "cap_unit": "cashback-inr", "cycle": "monthly"},
])
r = compute(c, profile(dining=50000))
approx(r["gross"], (500 + 45000 * 0.01) * 12)  # cap Rs500 + base on the Rs45k over-cap


# 6. Base cap_per_cycle must clamp base-earned value (site parity, E2 D5).
c = card(base_rate=0.01, per_inr=100, val=1.0,
         base_cap={"cap": 300, "unit": "cashback-inr", "cycle": "monthly"})
r = compute(c, profile(online=50000))
approx(r["gross"], 300 * 12)  # 1% of Rs50k = Rs500, clamped to Rs300/mo


# 7. Card-wide reward_cap must clamp the monthly total (site parity, E2 D5).
c = card(base_rate=0.01, per_inr=100, val=1.0,
         reward_cap={"max_units": 400, "cap_unit": "cashback-inr", "cycle": "monthly"})
r = compute(c, profile(online=50000))
approx(r["gross"], 400 * 12)


# 8. mcc_exclusions zero the mapped category (6513 = rent), like the site.
c = card(base_rate=0.01, per_inr=100, val=1.0, mccx=["6513"])
r = compute(c, profile(rent=10000, online=10000))
approx(r["gross"], 10000 * 0.01 * 12)  # online earns, rent earns nothing


# 9. Accelerator selection must be cap-aware: a 10% capped at Rs100/mo must
#    not beat an uncapped 3% on Rs20k spend (E2 D4 — was a 5x understatement).
c = card(base_rate=0.0, per_inr=100, val=1.0, accel=[
    {"canonical_categories": ["dining"], "effective_rate": 10,
     "cap_per_cycle": 100, "cap_unit": "cashback-inr", "cycle": "monthly"},
    {"canonical_categories": ["dining"], "effective_rate": 3},
])
r = compute(c, profile(dining=20000))
approx(r["gross"], 20000 * 0.03 * 12)  # 7,200/yr via the uncapped 3%, not Rs1,200


# 10. Channel-gated accelerators (SmartBuy-class, channel.required) belong to
#     the ABSOLUTE ceiling, not the realistic floor: the floor must not assume
#     the whole bucket routes through a portal (R3). Layers stay separate.
c = card(base_rate=0.01, per_inr=100, val=1.0, accel=[
    {"canonical_categories": ["travel"], "effective_rate": 10,
     "channel": {"class": "issuer-portal", "merchants": ["smartbuy"], "required": True}},
])
r_floor = compute(c, profile(travel=10000), basis="realized")
r_ceil = compute(c, profile(travel=10000), basis="face")
approx(r_floor["gross"], 10000 * 0.01 * 12)  # floor: base only, 1,200/yr
approx(r_ceil["gross"], 10000 * 0.10 * 12)   # ceiling: portal-routed, 12,000/yr


# 11. channel.required: false is decorative — the rate counts in both layers.
c = card(base_rate=0.01, per_inr=100, val=1.0, accel=[
    {"canonical_categories": ["travel"], "effective_rate": 5,
     "channel": {"class": "issuer-portal", "merchants": ["smartbuy"], "required": False}},
])
r_floor = compute(c, profile(travel=10000), basis="realized")
approx(r_floor["gross"], 10000 * 0.05 * 12)

def doc(base=None, fees=None, **rec):
    """Inline card YAML (one open rewards record, one open fee record), so a data
    edit can never change what these tests assert."""
    r = dict(effective_until=None, currency="points",
             base=dict(rate=2, per_inr=100, **(base or {})), accelerated=[])
    r.update(rec)
    f = dict(effective_until=None, annual_fee_inr=500)
    f.update(fees or {})
    return dict(name="Inline Card", tier="mid", rewards=[r], fees=[f])


PROGRAMS = {"prog-x": {"id": "prog-x", "unit_value_inr": {"face": 0.8, "realized": 0.5}},
            "prog-face-only": {"id": "prog-face-only", "unit_value_inr": {"face": 0.9}}}


# 12. A null annual_fee_inr counts as 0 for arithmetic and is flagged, like the
#     calculator (it crashed compute() with float - None before).
c, why = card_from_doc(doc(base={"unit_value_inr": 1.0}, fees={"annual_fee_inr": None}),
                       "t/null-fee", PROGRAMS)
assert c is not None and c["fee"] == 0 and c["fee_unknown"] is True, (c, why)
r = compute(c, profile(online=10000))
assert r["fee_unknown"] is True
approx(r["net"], r["gross"])
c, _ = card_from_doc(doc(base={"unit_value_inr": 1.0}), "t/fee", PROGRAMS)
assert c["fee"] == 500 and c["fee_unknown"] is False


# 13. Loyalty-programme cards take the unit value from the programme file, per
#     basis, exactly like unitValueFor (programme beats the card's own base value).
c, _ = card_from_doc(doc(loyalty_program="prog-x"), "t/lp", PROGRAMS)
assert c is not None and c["val"] == 0.5 and c["face"] == 0.8, c
c, _ = card_from_doc(doc(base={"unit_value_inr": 0.25}, loyalty_program="prog-x"), "t/lp2", PROGRAMS)
assert c["val"] == 0.5 and c["face"] == 0.8, c
c, _ = card_from_doc(doc(loyalty_program="prog-face-only"), "t/lp3", PROGRAMS)
assert c["val"] == 0.9 and c["face"] == 0.9, c
# unit_value_from_program: false (D-27) keeps the card's own base values.
c, _ = card_from_doc(doc(base={"unit_value_inr": 0.25, "unit_value_inr_realized": 0.2},
                         loyalty_program="prog-x", unit_value_from_program=False), "t/lp4", PROGRAMS)
assert c["val"] == 0.2 and c["face"] == 0.25, c


# 14. A cashback card with no unit value is worth Rs1 per unit (calculator
#     fallback); a points card with none is skipped with a stated reason.
c, _ = card_from_doc(doc(currency="cashback"), "t/cb", PROGRAMS)
assert c is not None and c["val"] == 1 and c["face"] == 1, c
c, why = card_from_doc(doc(), "t/pts", PROGRAMS)
assert c is None and "unit value" in why, why


# 15. Live data: every ranked card computes without error, and every card the
#     engine cannot rank is reported, not dropped silently.
live, skipped = load_cards()
for lc in live:
    compute(lc, profile(online=10000, international=5000), "realized")
    compute(lc, profile(online=10000, international=5000), "face")
assert skipped and all(s.get("slug") and s.get("reason") for s in skipped), skipped[:3]
assert not {s["slug"] for s in skipped} & {lc["slug"] for lc in live}

# 16. Marginal slab schedule (port of slabEarn): the issuer's own Axis Cashback
#     worked examples, then the same schedule through compute().
AXIS_SLABS = [
    {"upto_spend_inr": 5000, "rate_pct": 2, "max_value_inr": 100},
    {"upto_spend_inr": 40000, "rate_pct": 5, "max_value_inr": 1750},
    {"upto_spend_inr": None, "rate_pct": 7, "max_value_inr": 2150},
]
approx(slab_earn(AXIS_SLABS, 67950)[0], 3806.5, tol=0.5)
approx(slab_earn(AXIS_SLABS, 8930)[0], 296.5, tol=0.5)
approx(slab_earn(AXIS_SLABS, 5000, 5000)[0], 250)  # resumes in the 5% slab
slab_card = card(base_rate=0.0, per_inr=100, val=1.0, accel=[
    {"canonical_categories": ["online", "dining"], "effective_rate": 7, "slabs": AXIS_SLABS},
])
approx(compute(slab_card, profile(online=67950))["gross"], 3806.5 * 12, tol=6)
# One schedule across two categories is cumulative, not restarted per category.
approx(compute(slab_card, profile(online=35000, dining=35000))["gross"],
       slab_earn(AXIS_SLABS, 70000)[0] * 12)


# 17. Base rate is 0 on a category the base excludes or is scoped away from
#     (port of baseRateForBucket).
c = card(base_rate=0.01, per_inr=100, val=1.0)
c["base_excl"] = {"utilities"}
approx(compute(c, profile(online=10000, utilities=10000))["gross"], 100 * 12)
c = card(base_rate=0.01, per_inr=100, val=1.0, accel=[
    {"canonical_categories": ["online"], "effective_rate": 10,
     "cap_per_cycle": 100, "cap_unit": "cashback-inr", "cycle": "monthly"},
])
c["base_scope"] = {"travel"}
# online: Rs100 cap and no base overflow (out of scope); travel: 1% of 10k.
approx(compute(c, profile(online=10000, travel=10000))["gross"], (100 + 100) * 12)


# 18. over_cap_earns_base: false — spend past the cap earns nothing.
c = card(base_rate=0.01, per_inr=100, val=1.0, accel=[
    {"canonical_categories": ["dining"], "effective_rate": 10, "over_cap_earns_base": False,
     "cap_per_cycle": 500, "cap_unit": "cashback-inr", "cycle": "monthly"},
])
approx(compute(c, profile(dining=50000))["gross"], 500 * 12)


# 19. cap_group: accelerators sharing one cap pool draw it down together; without
#     a group each keeps its own cap.
def grouped(group):
    extra = {"cap_group": group} if group else {}
    return card(base_rate=0.0, per_inr=100, val=1.0, accel=[
        {"canonical_categories": ["dining"], "effective_rate": 10,
         "cap_per_cycle": 500, "cap_unit": "cashback-inr", "cycle": "monthly", **extra},
        {"canonical_categories": ["online"], "effective_rate": 10,
         "cap_per_cycle": 500, "cap_unit": "cashback-inr", "cycle": "monthly", **extra},
    ])
approx(compute(grouped("g"), profile(dining=10000, online=10000))["gross"], 500 * 12)
approx(compute(grouped(None), profile(dining=10000, online=10000))["gross"], 1000 * 12)

print("OK: engine_v2 tests passed (19)")
