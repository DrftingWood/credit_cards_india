# Floor audit — realized-value vs guaranteed-floor (2026-07-05)

Scanned all 319 cards for `unit_value_inr_realized` sitting below a guaranteed redemption
floor. **Key conclusion: the dataset is NOT broadly broken.** `realized` follows a consistent
convention — *realistic value net of redemption friction* — so a modest haircut below the nominal
rate is correct, not a bug. Only a large gap below a genuinely **friction-free** floor is a defect.

## Categories

### A. Small friction haircuts — NO ACTION (~70 cards)
`realized` ~10–20% below a nominal ₹0.20–0.25 point (e.g. SBI/BOB/IDFC/ICICI-Coral families:
realized 0.22 vs 0.25). This is the intended "midpoint after friction" convention. Also note some
`statement-credit` rates in the data equal the catalogue rate and may themselves be optimistic, so
the "floor" is soft. **Do not mass-change these** — it would remove realistic friction.

### B. Large-gap outliers — VERIFIED & FIXED (2026-07-05)
Verification showed that for most, **the ₹1.0 floor rate was the bug** (the point is structurally
worth far less), not `realized`:
- `onecard/metal` — **FIXED**: 1 pt = ₹0.10 fixed (was face 1.0 / realized 0.4, 10x overstated).
- `indusind/eazydiner-platinum` — **FIXED**: ₹0.20, dining-locked voucher (was 1.0 / 0.5; type also
  corrected cashback-bank → voucher).
- `standard-chartered/easemytrip` — **FIXED**: 1 RP = ₹0.25 voucher-only (was 1.0 statement-credit /
  0.5; card's real value is its direct discounts, not points).
- `icici/times-black` — **FIXED**: statement-credit rate 1.0 → ₹0.40 (₹1.0 only holds for
  travel/vouchers); face 1.0 / realized 0.5 kept as the travel-best / blend.
- `standard-chartered/rewards` — **DEFERRED**: ambiguous whether this row is the Ultimate card
  (₹1.0 voucher) or the generic SC Rewards point (₹0.25). Left unchanged pending card-identity check.

Borderline (small gap, left as-is): `hdfc/tata-neu-plus` (0.9 vs 1.0), `tata-neu-infinity` (0.95 vs 1.0).

### C. Missing `realized` — POPULATE (~22 cards)
`realized` absent (heterogeneous — needs per-card judgement, not a batch default):
axis/flipkart-super-elite, axis/google-pay-flex, axis/miles-more, axis/rupay, axis/samsung-infinite,
axis/samsung-signature, axis/shoppers-stop, axis/spicejet-voyage-black, axis/vistara(+infinite,
+signature — note Vistara is defunct/merged, may be stale cards), hdfc/phonepe-uno, hdfc/pine-labs-pro,
hdfc/shoppers-stop(+-black), hdfc/upi-rupay, icici/adani-one-platinum, icici/parakram(+-select),
sbi/landmark, sbi/phonepe-purple, sbi/phonepe-select-black.

## Corrected convention (supersedes REMEDIATION_GOAL flaw #1)

`realized` = realistic value net of friction. A `statement-credit`/`cashback` rate is a **hard floor
only if friction-free and uncapped**. Flag a card only when `realized` is **materially (≥~25%) below a
friction-free guaranteed floor** (portals at ₹1, direct cashback). Small haircuts below a
catalogue/soft rate are expected and correct.

## Next actions
1. Verify true per-point value for the 5 Category-B outliers, then fix `realized` or the floor rate.
2. Populate Category-C missing `realized` per card.
3. Leave Category-A untouched.
