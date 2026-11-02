# BOBCARD (Bank of Baroda) — source verification (2026-07-04)

BOBCARD **does** publish authoritative PDFs. The central **"BOBCARD Product Features
& Important Terms & Conditions"** (`features-and-rewards-important-terms-conditions-01042026.pdf`,
14 pp, effective 01-Apr-2026) carries the core + accelerated reward-rate tables and
per-cycle caps for **all** BOBCARD products. Archived under `_shared/`; per-card
milestone PDFs under `<card>/`.

## Verified against the T&C PDF — all match the YAML (0 corrections)
| Card | Core RP | Accelerated (cap/cycle) | Forex | Result |
| --- | --- | --- | --- | --- |
| Eterna / Eterna FD | 3 / ₹100 | 5X on ecom/intl/dining/travel, cap 5,000 RP | 2% | ✓ |
| Tiara / Varunah Premium | 3 / ₹100 | 5X, cap 5,000 RP | — | ✓ |
| Premier / Prime | 2 / ₹100 | 5X on intl/dining/travel, cap 2,000 RP | — | ✓ |
| Select / Select FD | 1 / ₹100 | 5X on online/dining, cap 1,000 RP | — | ✓ |
| Easy / Easy FD | 1 / ₹100 | 5X on dept-store/movies, cap 1,000 RP | — | ✓ |
| Snapdeal | 4 / ₹100 | ecom/dept-store, cap 2,000 RP | — | ✓ |
| HPCL Energie | 2 / ₹150 | utilities/dept-store, cap 1,000 RP | — | ✓ |

The BoB audit (PR #40) already used these T&C, so the modelled rates/caps/forex are
confirmed correct against the source PDF. Fuel earns no RP (except HPCL); UPI &
utilities (MCC 4900) excluded from accelerated RP — matches the dataset's rent-MCC +
exclusions.


## BOBCARD Tiara review (2026-10-26)

Reviewed the current [Tiara product page](https://www.bobcard.co.in/credit-card-types/tiara), the official [15-Jul-2026 revision notice](https://media.bobcard.co.in/media/0aqczg5p/final-revision-in-charges-benefits-effective-july-202615.pdf), the issuer's shared [Features and Rewards T&C](https://media.bobcard.co.in/media/0h5cim12/features-and-rewards-important-terms-conditions-01042026.pdf), and the official [2024-25 annual report](https://media.bobcard.co.in/media/1hegl5dl/annual-report_2024-25.pdf). Archived July notice and annual report under `tiara/`; shared April T&C remains in `_shared/`.

- Current issuer page confirms annual and joining fees, waivers, 2% forex, reward rates/caps/value, fuel waiver, women-only eligibility, age range, current quarterly benefits and FITPASS eligibility.
- July notice confirms finance charges increased to 3.75% monthly from 15-Jul-2026. It proposed raising lounge qualifying spend from INR40,000 to INR75,000; current product page now states INR75,000. The change's exact effective date is not established from the issuer materials directly retrieved; a secondary source reports it was deferred to 01-Oct-2026.
- The official annual report says TIARA launched on 29-Sep-2024 on RuPay. No network tier was confirmed.
- Cash-advance terms remain at the last locally verifiable official generic MITC (v1.6, Jul-2025): 2.5% or INR500 minimum. The issuer's Terms page lists a newer 2026 MITC, but its download was not retrievable in this review.
- The current card page's annual-income text was incomplete in its accessible version; income and credit-score cutoffs remain unknown.


## BOBCARD Scapia review (2026-10-26)

Reviewed the current BOBCARD product page, Scapia-specific MITC/KFS and linked cardholder agreement. Corrected monthly finance to 3.75%, preserved the zero-fee/zero-forex terms, set fuel-waiver cap to INR500/month, and updated lounge access to unlimited after INR20,000 billing-cycle spend plus monthly activity. Modeled Scapia Coins as closed-loop app travel points, corrected value to 5 coins = INR1 and validity to 36 months, and recorded Visa/RuPay earning differences. Since the single record cannot encode both base rates and minimum transaction amounts, the conservative RuPay rate is structured and Visa rates are documented in notes. Cleared unsupported 2024 launch date, Visa Signature tier and MCC 6513. Full evidence: `scapia/scapia-issuer-extract-2026-10-26.md`; cardholder agreement, MITC and KFS are archived under `scapia/`.


## BOBCARD Uni GoldX review (2026-10-26)

Reviewed the current BOBCARD product page, Uni GoldX MITC v9 and KFS, Uni BOB reward MITC and current Uni partner materials. Updated finance/cash-advance charges and fuel surcharge waiver, corrected the Uni Coin rate/value, added current age and residency eligibility, and cleared unsupported network/tier, launch date and MCC 6513. Captured the KFS's INR100 GoldX UPI reward minimum versus broader product-page language and documented that digital gold is a partner-app redemption option, not automatic conversion in the BOBCARD reward MITC. See `uni-goldx/uni-goldx-issuer-extract-2026-10-26.md` and archived PDFs in `uni-goldx/`.

- **The SENTINEL BOBCARD (2026-10-26):** archived the existing product page, January 2026 MITC, 1-Apr-2026 reward terms, lounge and Prime terms, and application-form review; details were not rechecked under the one-month freshness rule. Reward cap/movie discrepancy and full insurance wording remain open. See [assam-rifles-the-sentinel/issuer-review-2026-10-26.md](assam-rifles-the-sentinel/issuer-review-2026-10-26.md).

- **CMA One BOBCARD (RuPay, 2026-10-26):** archived the existing card page, MITC, shared reward terms, lounge/insurance schedules and application-form review without reopening details within the one-month window. Full policy and variant caveats remain in the YAML. See [cma-one/issuer-review-2026-10-26.md](cma-one/issuer-review-2026-10-26.md).

- **BOBCARD Etihad Guest Premium (2026-10-26):** archived the recent product-page, Etihad MITC, lounge/feature terms and Etihad partner review without rechecking verified details inside the one-month window. The 5-Aug-2026 revision, tier-status trigger and offer conditions remain open. See [etihad-guest-premium/issuer-review-2026-10-26.md](etihad-guest-premium/issuer-review-2026-10-26.md).

- **BOBCARD Etihad Guest (2026-10-26):** archived the recent product-page, Etihad MITC 2.0, lounge/feature terms and partner-page review; verified details were not reopened inside the one-month window. Welcome, status and lounge-guest terms remain open. See [etihad-guest/issuer-review-2026-10-26.md](etihad-guest/issuer-review-2026-10-26.md).

## BOBCARD Easy review (2026-10-26)

Formalized current Easy product page, shared 1-Apr-2026 Product Features/Rewards T&C and issuer MITC/application-form evidence. Fee offer, base/accelerated earn and cap, redemption threshold/value, welcome and fuel terms, MCC exclusions and eligibility are mapped in YAML. Offer end date and current Easy-specific lounge access remain unpublished. See `easy/issuer-extract-2026-10-26.md`.

## BOBCARD Eterna review (2026-10-26)

Formalized current Eterna product page, shared 1-Apr-2026 Product Features/Rewards T&C, Eterna milestone terms, July revision, lounge terms and issuer MITC/application form. Captured fees, 3/15 earn structure and cap, reward value, welcome/milestones, spend-gated lounges, fuel/movies and current insurance status. First-year fee-offer end date, lounge guest entitlement and numeric bureau score remain unpublished; network variants cannot all be represented in one row. See `eterna/issuer-extract-2026-10-26.md`.