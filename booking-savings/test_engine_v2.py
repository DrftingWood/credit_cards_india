#!/usr/bin/env python3
"""Tests for engine_v2.compute() rate derivation and cap handling.

Run:  PYTHONIOENCODING=utf-8 PYTHONUTF8=1 python booking-savings/test_engine_v2.py
Plain asserts (no pytest) so the file runs in any environment that runs the engine.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from engine_v2 import compute  # noqa: E402


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

print("OK: engine_v2 tests passed (11)")
