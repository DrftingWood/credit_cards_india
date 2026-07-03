# RBL Bank — MCC → reward map (2026-07-03)

RBL defines reward eligibility by category/merchant on the product page, not by
per-tier MCC accelerator tables, so `accelerated[].mcc_list` is not applicable.

## Universal rule (all RBL cards)
- **Rent — MCC `6513`** is reward-excluded across all RBL cards (`mcc_exclusions`).

## Category-level rules (modelled via `exclusions[]` / accelerators)
- Standard RBL earn-exclusions: fuel, wallet loads, rent, EMI (per-card `exclusions[]`).
- Accelerated tiers are category/merchant-gated (grocery/supermarket on ShopRite &
  Platinum Maxima Plus; weekend-dining + international on Icon; online on Cookies;
  international on World Safari) — not MCC-gated, so no `mcc_list` populated.
- Cookies' "10% on favourite brands" is a brand-list benefit (capped ₹300/brand/mo),
  modelled via `capping_rules` + `benefits.other`.

## Reward-value note
RBL Reward Points redeem at ~₹0.25 face (rblrewards.rbl.bank.in), lower realized on
catalogue. World Safari uses "Travel Points" transferable to airline/hotel partners.
