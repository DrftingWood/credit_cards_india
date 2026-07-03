# IndusInd Bank — MCC → reward map (2026-07-03)

IndusInd defines reward eligibility by category/weekday-weekend/merchant on the
product page, not by per-tier MCC accelerator tables, so `accelerated[].mcc_list`
is not applicable.

## Universal rule (all IndusInd cards)
- **Rent — MCC `6513`** is reward-excluded across all IndusInd cards (`mcc_exclusions`).

## Category-level rules (per-card `exclusions[]` / accelerators)
- Standard exclusions: fuel, wallet loads, rent, insurance premiums, EMI.
- Weekday/weekend split on the reward cards (Legend/Iconia/Crest earn 2× on weekends
  vs weekdays) — modelled via a weekend accelerator, not MCC.
- Co-brand earn is merchant/programme-gated (Jio-bp fuel → Smiles; InterMiles cards →
  InterMiles on intermiles.com/interbook + Amazon; Avios → Qatar/BA) — not MCC-gated.

## Reward-value note (IndusInd 2024 redemption changes)
IndusInd reset redemption values effective **1-Mar-2024** and capped cash redemption
**1-Sep-2024**, per card:
- Platinum: 1 RP = ₹0.60 non-cash / ₹0.40 cash; cash cap 2,500 RP/mo.
- Iconia: 1 RP = ₹0.75 non-cash / ₹0.50 cash; cash cap 5,000 RP/mo.
- Crest: cash cap 10,000 RP/mo.
Other points cards ~₹0.20-0.25. Miles cards use Avios (₹~0.40-0.50) / InterMiles
(₹~0.40) / Jio-bp Smiles (₹~0.25). Many new/co-brand cards carry `# TODO verify` on
exact rates (the tab-based site limits deep extraction).
