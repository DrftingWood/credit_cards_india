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
- `standard-chartered/rewards` — **RESOLVED (2026-07-05, flaw #6)**: verified it's the generic SC
  Rewards card — 1 RP = ₹0.25 voucher / ₹0.20 statement credit (the ₹1.0 floor was the bug, same
  pattern as the others). Fixed to face 0.25 / realized 0.22.

Borderline (small gap, left as-is): `hdfc/tata-neu-plus` (0.9 vs 1.0), `tata-neu-infinity` (0.95 vs 1.0).

### C. Missing `realized` — POPULATED (2026-07-05, all 22)
`realized` filled per currency type: cashback/PhonePe ~0.90–0.95; standard points 0.22; Axis EDGE
Reward Points 0.18; retail co-brand (Flipkart SuperCoins, Shoppers Stop First Citizen) 0.22–0.40;
co-brand airline (SpiceClub 0.40, Lufthansa Miles & More 0.50) per programme value; Adani One 0.20.
**`axis/vistara`, `vistara-infinite`, `vistara-signature` marked `status: discontinued`**
(discontinued_on 2024-11-12 — Vistara merged into Air India; Club Vistara points became Maharaja).
Re-audit confirms NO_REALIZED count is now 0.

## Corrected convention (supersedes REMEDIATION_GOAL flaw #1)

`realized` = realistic value net of friction. A `statement-credit`/`cashback` rate is a **hard floor
only if friction-free and uncapped**. Flag a card only when `realized` is **materially (≥~25%) below a
friction-free guaranteed floor** (portals at ₹1, direct cashback). Small haircuts below a
catalogue/soft rate are expected and correct.

## Next actions
1. Verify true per-point value for the 5 Category-B outliers, then fix `realized` or the floor rate.
2. Populate Category-C missing `realized` per card.
3. Leave Category-A untouched.
