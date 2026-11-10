#!/usr/bin/env python3
"""implied_accelerator_pct: the percent of spend an accelerator returns as authored.

Run as a plain script (python scripts/test_rate_plausibility.py), like the other tests.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from validate_extras import IMPOSSIBLE_RATE_PCT, implied_accelerator_pct  # noqa: E402

POINTS = {"currency": "points", "base": {"rate": 1, "per_inr": 1, "unit_value_inr": 0.01}}
CASES = [
    # (label, record, accelerator, programme, expected percent or None)
    ("units per Rs 100 authored against a per-Rs-1 base (the bob-uni-goldx slip)",
     POINTS, {"effective_rate": 500}, None, 500.0),
    ("the same rate with its denominator stated", POINTS, {"effective_rate": 500, "effective_per_inr": 100}, None, 5.0),
    ("card_attributable_rate defaults to per Rs 100", POINTS, {"card_attributable_rate": 300, "effective_rate": 900}, None, 3.0),
    ("cashback with no unit value is Rs 1 a unit",
     {"currency": "cashback", "base": {"rate": 1, "per_inr": 100}}, {"effective_rate": 5}, None, 5.0),
    ("programme unit value wins",
     {**POINTS, "loyalty_program": "p"}, {"effective_rate": 10, "effective_per_inr": 100}, {"unit_value_inr": {"realized": 0.5}}, 5.0),
    ("unless the record opts out (D-27)",
     {**POINTS, "loyalty_program": "p", "unit_value_from_program": False},
     {"effective_rate": 10, "effective_per_inr": 100}, {"unit_value_inr": {"realized": 0.5}}, 0.1),
    ("multiplier-only accelerators have no implied rate here", POINTS, {"multiplier": 5}, None, None),
    ("points with no unit value cannot be judged",
     {"currency": "points", "base": {"rate": 1, "per_inr": 100}}, {"effective_rate": 5}, None, None),
    ("per_inr 0 is not a rate", POINTS, {"effective_rate": 5, "effective_per_inr": 0}, None, None),
]


def main() -> int:
    for label, rec, acc, program, expected in CASES:
        got = implied_accelerator_pct(rec, acc, program)
        ok = got is None if expected is None else got is not None and abs(got - expected) < 1e-9
        assert ok, f"{label}: expected {expected}, got {got}"
    assert implied_accelerator_pct(*CASES[0][1:4]) > IMPOSSIBLE_RATE_PCT
    assert implied_accelerator_pct(*CASES[1][1:4]) < IMPOSSIBLE_RATE_PCT
    print("OK: rate plausibility tests passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
