# OneCard Metal issuer comparison — 2026-10-27

## Sources reviewed and archived

- Current OneCard [FAQ](https://www.getonecard.app/faq/), captured as `faq-2026-10-27.html`.
- Current OneCard [fees and charges](https://www.getonecard.app/metal-credit-card/fees-and-charges/), captured as `fees-page-2026-10-27.html`.
- Current partner-bank terms linked from OneCard: BOBCARD MITC effective 11-Sep-2026 and BOBCARD terms, CSB terms effective 11-Jul-2026, Federal terms and South Indian Bank terms. PDFs are archived in this directory.
- Current pages also link SBM Bank and Indian Bank partner terms, but these were not read field by field for this review.

## Corrections made

- Cleared the unsupported 2020-07-01 launch date. OneCard's current FAQ lists six issuing partners (BOBCARD, CSB Bank, Federal Bank, SBM Bank, South Indian Bank and Indian Bank) and three network types (Visa, Mastercard and RuPay), so network and network tier are null in this aggregate OneCard record.
- Retained zero joining and annual fee from current generic FAQ. Updated forex markup to the advertised 1%; current fees page says Forex Pass can reduce this to 0%. Monthly finance and cash-advance charges remain null because they depend on the issuing bank/card agreement.
- Kept the shared 1 Reward Point per INR50 base as supported by current BOBCARD, CSB, Federal and South Indian Bank OneCard terms. Kept 5x top-two monthly-category rewards, with MCC categories dynamically selected. Reviewed bank terms specify qualifying spends across at least three categories and an INR750 threshold in each; bonus points post on the 10th of the next month.
- Removed static online/dining category assignment, unsupported MCC 6513, EMI exclusion and fixed INR0.10 redemption value. Current public generic FAQ promises instant in-app redemption with no fee or minimum threshold but does not publish a universal rupee conversion value. Partner terms permit Pay with Points for recent transactions and catalogue/offers, subject to partner-specific rules.
- Removed prior unsupported lounge access quota and INR50,000 quarterly threshold. Current generic OneCard pages do not advertise airport lounge access.
- Retained OneCard fuel surcharge waiver at 1% up to INR400/month. Current BOBCARD MITC specifies the lower of 1% or the actual surcharge excluding GST, capped at INR400 per calendar month.
- Removed current eligibility claims for resident-indian and unknown app-inferred credit card issuance; the FAQ says applications are offered in 66 cities and issuing banks determine underwriting. Exact age, income and score thresholds are not published in the reviewed generic material.

## Unresolved partner differences

1. OneCard is an aggregate co-branded product rather than a single issuer/network. The data model has one issuer field, so issuer is kept as OneCard and the six bank partners/three network types are explained in notes.
2. Fees and terms such as interest, cash advance, late fees, issuance and cancellation differ by bank, plastic/metal form and partner-bank version. This generic record only stores shared published terms where identifiable.
3. Only BOBCARD, CSB, Federal and South Indian Bank terms were read in this pass. SBM Bank and Indian Bank terms remain to be checked for differences before treating any term as common to every partner.
4. The generic page does not publish an exact launch date, shared point-to-rupee conversion, or numeric underwriting criteria.

This review follows the [UK Government Data Quality Framework](https://www.gov.uk/government/publications/the-government-data-quality-framework/the-government-data-quality-framework), which separates accuracy from validity and completeness.
