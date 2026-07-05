# Data-quality remediation & engine red-team — July 2026

Consolidated record of the 2026-07 dataset remediation and the engine red-team. **Replaces** the
earlier separate notes (`REMEDIATION_GOAL`, `FLOOR_AUDIT`, `REMEDIATION_LOG`, `ENGINE_REVIEW`). The
per-partner value matrix stays in [`TRANSFER_PARTNERS.md`](TRANSFER_PARTNERS.md); open work is in
[`../booking-savings/TODO.md`](../booking-savings/TODO.md).

## TL;DR
- **~73 cards corrected across ~40 commits** (branch `todo-board-2026-07`), all `validate.py`-clean.
- Fixed a **systematic co-brand-airline undervaluation** and a class of **"nominal inflation"** errors
  (Uni Coins 100×, Scapia 5×, OneCard 10×, and more).
- The **data is now sound**; a 4-stream red team found the **₹5L engine is systematically optimistic**
  (portal-markup & forex blind, channel-routing fantasy) — see §5. Fix the engine before trusting rankings.

## 1. Valuation conventions
- `unit_value_inr_realized` = **realistic value net of friction**. A friction-free guaranteed floor
  (₹1 travel portal, direct cashback) ⇒ realized ≈ floor; a friction-heavy catalogue ⇒ a modest haircut.
- `unit_value_inr` (**face**) = best documented redemption (ceiling).
- **Full visibility, no blending:** `redemption[].transfer_partners[]` carry every partner's ratio and
  ₹/point; the two scalars are just the floor→ceiling endpoints. Never collapse to a single "best" number.
- Every touched value carries `source.url` + `retrieved_on` + `confidence`.

## 2. Method & gotchas (for future passes)
- Research **≥3 independent 2026 sources**; distinguish pre/post-devaluation; **never fabricate** — flag
  low-confidence or skip instead of guessing.
- Edit with **ruamel.yaml round-trip** (preserves comments): `preserve_quotes`; register a `None`→`'null'`
  representer; **wrap every `ratio`/`transfer_ratio` in `DoubleQuotedScalarString`** — an unquoted `1:1`
  parses as the base-60 integer `61` and fails schema validation.
- `validate.py` must pass before every commit; stage only changed files; feature branch only; run Python
  with `PYTHONIOENCODING=utf-8 PYTHONUTF8=1` (₹ symbol on Windows).

## 3. Remediation results (by class)

| Class | What was wrong | Fix |
|---|---|---|
| **Floor outliers** | `realized` far below a friction-free floor, or a wrong ₹1 nominal | OneCard ₹1→**0.10**, EazyDiner ₹0.20, SC EaseMyTrip ₹0.25, ICICI Times Black statement ₹0.40 |
| **Nominal inflation** | closed-loop/obscure currency valued at ₹1 | **Uni Coins 100× (₹1→0.01)**, **Scapia 5× (₹1→₹0.20/coin)**, ixigo ₹0.50, cheq ₹0.50, kosmo/paytm ₹0.25 |
| **Co-brand airlines (systematic)** | real airline miles valued as generic ₹0.2 points | KrisFlyer ₹1.0, Emirates ₹0.65, Etihad ₹0.60, Air India (Maharaja) ₹0.55 |
| **Over-valuation** | ₹1 where the currency floats/caps lower | IndiGo BluChip ₹1→**0.45**; SC 360 lineup (4 cards →₹0.25, Priority VI →₹1.0) |
| **EDGE currencies** | inconsistent EDGE Miles/Reward-Points values & inverted ratios | EDGE Miles 1:2 (Atlas)/1:1 (Horizon) + per-partner; EDGE Reward Points uniform ₹0.18 |
| **Earn-rate / internal** | wrong base rate; face below a listed redemption | SC Rewards 4/₹150; IndiGo voucher rates 1.0→0.6; face raised to ceiling on 3 cards |
| **Discontinuations** | defunct programmes still active | Vistara ×5 (merged into Air India), InterMiles ×4 (migrated) |

## 4. Floor audit — the dataset was NOT broadly broken
An audit of all 319 cards flagged 89 "high" items, but the real defect set was narrow:
- **A — small friction haircuts (~70 cards):** realized ~10–20% below a nominal catalogue rate — the
  *intended* convention. **Left untouched** (mass-changing them would have degraded the data).
- **B — large-gap outliers (~5):** verified & fixed (the ₹1 nominal was usually the bug, not `realized`).
- **C — missing `realized` (~22):** populated per currency type; 3 Vistara cards discontinued.
- **Cross-card / sibling / nominal-inflation** sweeps then caught the ~30 remaining value errors above.
- Final state: scenarios A–I (floor, nominal, internal, cross-card, sibling, transfer-ratio, provenance,
  earn-rate) all **clean**; 0 base-60 ratio bugs; 319/319 have complete provenance.

## 5. Red-team — the ₹5L engine is systematically OPTIMISTIC

Four streams (own analysis + 3 agents, internet-verified) converged: the ₹5L numbers are **theoretical
ceilings, not realistic net returns.** The engine discards fields the repo already stores.

| # | Flaw | Effect | Fix |
|---|---|---|---|
| R1 | **Portal-markup blind** | HDFC Diners "17.5%" → **real ~7–12%** (SmartBuy is 0–5% pricier on flights, 5–34% on hotels) | net portal markup vs reward; reconcile with `holistic.py` |
| R2 | **Forex — only on FX-charged spend** | forex hits only foreign-currency transactions (POS/ATM abroad, foreign OTA/hotel sites); **international trips booked in INR via Indian aggregators incur ZERO forex.** The Atlas→~0.87%/Scapia-inversion holds only for the FX fraction | model 3 contexts: domestic-INR, intl-booked-in-INR (no forex), FX-spend; subtract forex on the FX fraction only |
| R3 | **Accelerator not channel/MCC-scoped** | applies the best rate to all ₹5L; Atlas 5x is portal/direct-only and not abroad; MMT 6% is MMT-only | apply boosted rate only to the eligible fraction |
| R4 | **Channel-routing fantasy** | `locked` flag computed but never used; monthly cap + lumpy travel → most spend earns base | use `locked`; model caps against a monthly profile |
| R5 | **realized-vs-face asymmetry** | under-ranks cashback, over-ranks transfer points | rank on one basis; show floor→ceiling range |
| R6 | **"Pure travel" best-case** | ignores excluded categories (fuel/rent/utilities) | realistic spend mix |
| R7 | **DATA: Diners "10X flights+hotels"** | 10X is **hotels only; flights are 5X** | split the accelerator |

**Value verification:** 7 of 8 top values survived adversarial refutation; only **KrisFlyer ₹0.85→₹1.0**
was materially wrong (fixed — also resolves an inconsistency with Atlas's ₹2.2 face). Note Atlas's ₹2.2
face is now a transfer *best-case*, not a guaranteed floor (the Accor hotel floor was removed 2026-04-02).

## 6. Transfer-partner model
Every transferable-points card carries `redemption[].transfer_partners[]` (per-partner ratio + ₹/point,
`last_verified_on`). Full card-currency → partner → ratio → ₹/point matrix, plus the two break-even rules
(redeem effective value = `r/(1+markup)`; accelerated-earn tolerance = `(k_portal−k_alt)/(1−k_portal)`),
is in [`TRANSFER_PARTNERS.md`](TRANSFER_PARTNERS.md).

## 7. Roadmap
See [`../booking-savings/TODO.md`](../booking-savings/TODO.md). **P0 = Engine v2** (consume forex/cap/
channel/realized fields) + the Diners flights=5X data fix + re-running the ₹5L verdict split by
domestic / international-INR / FX-spend context.
