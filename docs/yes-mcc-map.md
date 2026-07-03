# YES Bank — MCC map (2026-07-03)

Merchant-category-code handling applied across the YES Bank catalogue during the
2026-07 audit.

## Universal rent exclusion
Every YES Bank card carries `mcc_exclusions: ['6513']` (residential/real-estate
rent, MCC 6513). YES Bank's reward terms explicitly exclude rent from points/
cashback accrual, and the June-2026 T&C refresh reinforced this across the range.

## Reward-eligibility MCC notes (from live "Effective 15-Jun-2026" terms)
Points/cashback are **not** awarded on the following on most YES Bank cards
(captured in each card's `rewards[].notes` / `exclusions`):
- Rent (6513), Wallet loads, Fuel, Government, Marketing/Advertising
- Cash withdrawals, EMI conversions (Post-Purchase / On-Call / Instant)
- Insurance, Education, Railways, Toll & Ferry, Jewellery (card-dependent)

Note: `upi` and `railways` are not tokens in the validator's exclusion enum, so
those are documented in free-text `notes` rather than the structured
`exclusions` list.

## Category-MCC accelerators
- **Wellness / Wellness Plus** — accelerated points on Chemist / Pharmaceutical
  stores, defined by the card terms as **MCC 5912** (5× the base rate: 20/₹200 and
  30/₹200 respectively). Modelled with `canonical_categories: [other]` because the
  schema enum has no health/pharmacy bucket.
- **Prosperity Cashback / Cashback Plus** — 5% on Movies, Grocery & Utility Bill
  Payments (Auto-Pay only); utility cashback is subject to a monthly cap.
- **PaisaSave (Paisabazaar)** — 6% (12 RP/₹200) on Dining & Travel MCCs.

See [`yes-audit.md`](yes-audit.md) for the full catalogue reconciliation.
