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
