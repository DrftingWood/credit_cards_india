# IDFC FIRST Bank — MCC → reward map (2026-07-03)

IDFC FIRST defines reward eligibility by category / spend-threshold on the product
page (and MITC), not by per-tier MCC accelerator tables, so `accelerated[].mcc_list`
is not applicable. The machine-readable MCC signal is the exclusion set.

## Universal rule (all IDFC FIRST cards)
- **Rent — MCC `6513`** is reward-excluded across all IDFC FIRST cards. Added to
  every active card's `rewards[].mcc_exclusions` (18 cards).

## Category-level reward rules (modelled via `exclusions[]` / accelerators, not MCC)
- **Standard Visa cards** (millennia, classic, select, wealth, first-private, swyp):
  base 3X per ₹150 up to ₹20,000/month spend; **10X** on incremental monthly spend
  above ₹20,000; **reduced 1X** on utility / insurance / railway / FASTag (modelled
  as a 1-RP accelerator, not an exclusion). Zero rewards on fuel / wallet / rent / EMI.
- **Metal cards** (ashva, mayura, gaj): per-₹100 (ashva/mayura) or per-₹150 (gaj)
  base with distinct accelerators; reward points redeem higher via the FIRST Rewards
  Gallery (₹0.40 / ₹0.50 / ₹1.00 on travel).
- **Cashback cards** (hello-cashback, secured-rupay): statement-cycle caps modelled
  via `reward_cap` (₹1,500 / ₹500) + `capping_rules`; third-party-UPI and fuel
  ineligible.
- **Co-brand** (indigo = BluChip via loyalty_program; power/power-plus = HPCL fuel
  cashback; lic-select = LIC premium 10X): merchant/brand-gated, not MCC-gated.

No positive-earn `mcc_list` was populated — all accelerators are category- or
channel-gated.
