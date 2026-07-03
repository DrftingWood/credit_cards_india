# Kotak Mahindra Bank — MCC → reward map (2026-07-03)

Kotak publishes explicit MCC exclusion/cap tables in its card T&Cs, so the
machine-readable MCC signal is richer here than most issuers.

## Universal rule (all Kotak cards)
- **Rent — MCC `6513`** is reward-excluded across all Kotak cards (`mcc_exclusions`).

## Standard Kotak reward-earn MCC rules (per card T&Cs)
- **Fuel — MCC `5172`, `5541`, `5542`, `5983`**: no reward points on most Kotak
  cards → added to `mcc_exclusions` on points cards (league-platinum, 811, zen,
  upi-rupay, wealth-infinite). (Fuel co-brands IndianOil/Cashback+ instead *earn*
  on fuel and do not exclude these.)
- **Utility / Telecom — MCC `4812`, `4814`, `4899`, `4900`**: reward points earned
  only up to **₹35,000/statement** (₹50,000 on Zen) — modelled via `capping_rules`.
- **Education & Insurance**: capped ~₹70,000/statement on some cards (Zen, Royale)
  — `capping_rules`.
- **IndianOil grocery/dining accelerator** is MCC-scoped (`mcc_list`:
  5812/5814/5813/5411/5311/5399/5422/5451/5499/5441).
- **Air+ Prime auto-dealer accelerator** is MCC-scoped (`mcc_list`:
  5013/5511/5521/5533).

## Reward-value note
Kotak Reward Points are worth **~₹0.10** (1,000 RP ≈ ₹100), corrected from a stale
₹0.15 across the dataset — EXCEPT the IndianOil fuel card (₹0.25) and the Air /
Air+ / Solitaire **Air Miles** cards (1 Air Mile = ₹1 on Kotak Unbox travel). Zen
Points ~₹0.15. Milestone-value cards (White, White Reserve) deliver value directly
as "White Pass" vouchers, not per-spend points.
