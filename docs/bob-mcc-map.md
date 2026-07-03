# BOBCARD (Bank of Baroda) — MCC → reward map (2026-07-03)

BOBCARD defines reward eligibility by category/merchant on the product page and in
the MITC, not by per-tier MCC accelerator tables, so `accelerated[].mcc_list` is
largely not applicable. The machine-readable MCC signal is the exclusion set.

## Universal rule (all BOBCARD cards)
- **Rent — MCC `6513`** is reward-excluded across all BoB cards (MITC standard
  exclusion). Added to every active card's `rewards[].mcc_exclusions` (23 cards).

## Card-specific MCC signals seen on pages / MITC
- **HPCL ENERGIE** accelerated fuel earn is scoped to HPCL outlets & HP Pay
  (MCC-driven at the network level); modelled via the `fuel-network` channel with
  merchant `hpcl` rather than an `mcc_list`.
- **IRCTC BOBCARD** train-booking earn is IRCTC-gated (utility-rail channel,
  merchant `irctc-rail`), not a generic travel MCC.
- **Cashback** card: transactions below ₹100 and "select MCCs" are cashback-
  ineligible — captured as a `capping_rules` note (exact MCC list not published).
- Standard BoB earn-exclusions (fuel, wallet loads, rent, insurance, EMI) are
  modelled per-card via category `exclusions[]`.

Positive earn tiers (Snapdeal 20 RP, Eterna/Tiara 15 RP, defense 10 RP on
departmental, etc.) are merchant/brand- or category-gated, not MCC-gated, so no
`mcc_list` was populated.
