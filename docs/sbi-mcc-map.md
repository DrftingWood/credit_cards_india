# SBI Card — MCC → reward map (2026-07-03)

SBI defines reward eligibility mostly by category/merchant on the web page (and in
card-specific T&C booklets), not by per-tier MCC accelerator tables, so
`accelerated[].mcc_list` is largely not applicable. The machine-readable MCC signal
is the exclusion set.

## Universal rule (all SBI cards)
- **Rent — MCC `6513`** is reward-excluded (and rent-surcharged) across SBI cards
  (MITC). Added to every active card's `rewards[].mcc_exclusions`.

## Card-specific MCC exclusions seen in T&C
- **Government spends — MCC `9399`, `9311`** discontinued from reward accrual w.e.f
  15-Jun/Jul-2024 on Air India, SimplyClick, Apollo SELECT and others → captured
  per-card via the `government` category in `exclusions[]` (added during verification).
- Standard SBI earn-exclusions (fuel, wallet loads, rent, EMI, cash advance) are
  modelled per-card via category `exclusions[]`.

Positive earn tiers (Apollo 10X, SimplyClick 10X partners, Landmark 25X, etc.) are
merchant/brand-gated, not MCC-gated, so no `mcc_list` was populated.
