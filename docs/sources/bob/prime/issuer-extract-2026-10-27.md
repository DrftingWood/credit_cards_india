# BOBCARD Prime issuer comparison (27 Oct 2026)

Compared the [current BOBCARD Prime product page](https://www.bobcard.co.in/credit-card-types/prime), BOBCARD's [Features and Rewards Important Terms, updated 1 Apr 2026](../_shared/features-and-rewards-important-terms-and-conditions-01042026.pdf), the issuer's [current FAQ](https://www.bobcard.co.in/faqs), the [Jan-2026 generic MITC](https://media.bobcard.co.in/media/gaudahay/bob_mitc_a4-booklet_ver-19jan26_15jan2026.pdf), and the locally archived July 2026 [product revision](../tiara/july-revision.pdf). Used the official [1-Apr-2026 fee revision notice](https://media.bobcard.co.in/media/nfkmkemd/revision-in-product-features-charges-wef-1st-april-26.pdf) for the general transaction charges.

## Confirmed and recorded

- Product page currently advertises zero joining and annual fees, guaranteed issuance against a fixed deposit of INR 30,000 or more without income proof (except CIBIL-delinquent applicants), age 18–85, and 2 Reward Points per INR 100 on other eligible categories.
- A previous BOBCARD blog says Prime may issue against INR 15,000 FD. The newer product page states INR 30,000 for guaranteed issuance. The record uses the live page's threshold and records the older-source conflict rather than treating the two thresholds as consistent.
- Current product page confirms 500 welcome points after INR 5,000 spend within 60 days, fuel surcharge waiver of 1% on INR 400–5,000 transactions capped at INR 250 per statement, and redemption at INR 0.20 per point. It says UPI gets core points only and no bonus rewards; issuer FAQ says UPI is not eligible for joining rewards.
- April 2026 feature terms confirm 2 core points per INR 100 for the product grouping that includes Prime, MCC exclusions, minimum transaction amount INR 100, and merchant-acquirer MCC coding. Points expire after 24 months per current issuer FAQ. The local dataset's MCC list matches the April annexure.
- Current Prime page advertises Smart EMI on purchases over INR 2,500 for 6–48 months, up to three free family add-on cards aged over 18, and lost-card zero liability subject to immediate reporting and applicable claim terms.
- The July 2026 revision lists Prime among cards whose air/non-air accidental-death cover was discontinued effective 25-Aug-2026; the old benefit is kept marked as discontinued without retaining a stale coverage amount.
- Mastercard is supported by BOBCARD's “Master Prime” designation in the issuer insurance schedule. A product-specific network tier is not published, so `network_tier` stays null.
- Jan-2026 MITC supports 3.75% monthly finance charge, 3.5% foreign currency fee and 2.5% cash advance fee with INR 500 minimum. The 1-Apr-2026 issuer tariff update also added specific fees on qualifying third-party-app education payments, toll/bus and railway bookings; the card schema cannot represent them as transaction-specific fees.
- No standalone Prime lounge benefit is listed on its current product page. Income thresholds and a credit-score floor are not published; because the page says no income proof is required against the FD, the record leaves them null.

## Record changes and limits

- Added the missing Smart EMI benefit; added the under-INR-100 reward threshold and UPI joining-benefit restriction; added current July revision evidence for accidental-cover discontinuation.
- The current page says the Prime rate is for “all other categories,” while the detailed issuer terms define multiple excluded MCCs and fuel. The detailed list remains explicit in `mcc_exclusions`.
- The data model cannot represent the newly applicable category-specific transaction fees. This constraint is documented in the record notes.
- No exact card launch date or standalone tier was established.

Validation and stamp audit were rerun after these edits; the full dataset validator passes without errors or warnings.
