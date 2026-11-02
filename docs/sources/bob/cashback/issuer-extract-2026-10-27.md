# BOBCARD Cashback issuer comparison (27 Oct 2026)

Reviewed the [current BOBCARD Cashback product page](https://www.bobcard.co.in/credit-card-types/bobcard-cashback), BOBCARD's [Features and Rewards Important Terms, updated 1 Apr 2026](../_shared/features-and-rewards-important-terms-conditions-01042026.pdf), the [15 Jan 2026 MITC](https://media.bobcard.co.in/media/gaudahay/bob_mitc_a4-booklet_ver-19jan26_15jan2026.pdf), and the [current MITC index](https://www.bobcard.co.in/most-important-terms-and-condition). The live card page's structured eligibility text truncates after “Salaried: Minimum”; unpublished income figures and a score floor are left null.

## Compared and recorded

- Card network: Mastercard is stated on the current card page. No Mastercard tier is stated there, so `network_tier` is cleared to null.
- Fees: the product page and Jan 2026 MITC state the cardholder can choose a monthly INR 49 fee or INR 499 joining and annual fee, with no fee reversal. The fee plan can be changed once over the card's lifetime. The schema supports only one joining/annual pair; the record stores INR 499 for the annual plan and explains the alternative in notes.
- Other current fees: Jan 2026 MITC states 3.75% monthly finance charges (45% annualized), 2.5% cash withdrawal fee with INR 500 minimum, and 3.5% foreign currency fee for this card class. GST applies to applicable fees and charges.
- Cashback: 1% base on eligible domestic POS and international transactions; domestic e-commerce earns 1% base plus 4% accelerated cashback. The April 2026 terms cap accelerated cashback at INR 1,500 per statement and require four transactions in the statement cycle. The current card page markets 5% cashback “up to INR 1,500/month”; this wording does not clarify whether that cap is total cashback or the 4% bonus. The record retains the detailed terms' accelerator-cap interpretation and states the conflict.
- Exclusions: the April 2026 annexure supports the existing MCC list. Sub-INR 100 purchases, listed MCCs, fuel, ATM cash withdrawals and quasi-cash do not earn cashback. Cashback is computed on net eligible spend, posts to the following statement, and is reversed on returns/reversals. MCC and online/international flags come from merchant acquirers. Pending cashback may be forfeited on cancellation, conversion to another BOBCARD product, payment-related blockage or breach of card terms.
- Benefits: current page confirms 1% fuel surcharge waiver on INR 400–5,000 transactions, capped INR 250 per statement; no cashback on fuel. It also lists up to three free add-on cards for family members over 18, conditional zero liability on immediate loss reporting, and Smart EMI for purchases above INR 2,500 with 6–48 month tenures.
- Eligibility: the product page lists Indian residency and age 25–55, with possible lower/higher age cutoffs at issuer discretion. The page's income section is truncated in its accessible content; salaried/self-employed income minimums and credit-score floor remain unknown.

## Remaining representation limits

- Monthly and annual fee plans are mutually exclusive, but the fee schema has one joining/annual fee pair.
- The marketing page's INR 1,500 monthly cashback wording conflicts in precision with the feature table's explicit accelerated-cashback cap; encoded cap follows the detailed feature terms.
- The issuer's [1 Apr 2026 revision notice](https://media.bobcard.co.in/media/nfkmkemd/revision-in-product-features-charges-wef-1st-april-26.pdf) adds transaction-specific fees: 1% on third-party-app online education payments (max INR 5,000); 1% on toll/bus MCC 4784 transactions of INR 5,000 or more; and 1% on railway MCC 4112 transactions of INR 30,000 or more (max INR 5,000). These apply to this product. The card schema has no dedicated transaction-fee model, so they are described in the benefit-source notes rather than encoded as ordinary card fees.
- No exact launch date, income floor, or credit-score cutoff was verified from an accessible primary issuer source.

The archived April 2026 issuer PDF is in `docs/sources/bob/_shared/`. Validator, stamp audit and queue were rerun after the record edit; validation passes with zero errors or warnings.
