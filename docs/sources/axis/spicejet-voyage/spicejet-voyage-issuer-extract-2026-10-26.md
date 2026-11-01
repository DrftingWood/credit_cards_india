# SpiceJet Axis Bank Voyage issuer evidence extract (26 Oct 2026)

Reviewed the [current Axis Voyage product page](https://www.axis.bank.in/cards/credit-card/spicejet-axis-bank-voyage-credit-card), [12-May-2022 launch announcement](https://www.axis.bank.in/about-us/press-releases/spicejet-and-axis-bank-launch-co-branded-credit-card), current MITC and 28-Aug-2026 issuer terms update, SpiceClub points-earning terms, 20-Jun-2025 reward-exclusion notice, activation and membership terms, milestone/renewal terms, and current domestic lounge program. Retrieved issuer PDFs and HTML page captures are archived in this directory.

## Modeled facts

- Visa is supported by the launch announcement; a Visa tier is not established. The launch announcement dates the launch to 12-May-2022.
- Joining fee is INR750. The current product page lists the first-year annual fee as NIL and INR750 from year two onward. The current page and MITC list monthly finance at 3.75%, forex markup at 3.5%, cash withdrawal fee at 2.5% (minimum INR500), and DCC markup at 3.5%.
- Other retail earns 3 SpiceClub Points per INR200; online utility payments, online food orders and online entertainment each earn 6 per INR200, subject to online MCCs: 4900, 5499, 5812, 5814, 7829 and 7832. SpiceJet app/website bookings earn 6 card-benefit points plus 12 SpiceClub Silver membership points per INR200 while active Silver tier applies. The card-benefit earn is capped at INR100,000 of monthly app/web spend; membership earn continues after the cap. Complimentary Silver membership lasts one year, and later membership points depend on attained tier. Points round down to the lower multiple of INR200.
- The current card page value chart indicates INR0.50 per point and states points can be redeemed for SpiceJet flight tickets, meal vouchers and other eligible app/web bookings.
- Reward exclusions are category-based, including wallet loads, fuel, financial institutions, cash withdrawals, gold/jewellery, gift cards, EMI/post-facto EMI, insurance, education, government, rent, outstanding payments and fees/charges. The 2025 notice says exclusions are identified by spend category rather than exact MCC; no unsupported `mcc_exclusions` are asserted.
- Current lounge program gives one domestic lounge visit per quarter in Set A, after INR50,000 eligible spend in the previous three calendar months. The product page describes four visits/year and says previous quarter; the quota is consistent, while the qualifying-period wording is recorded as a source distinction.
- The INR1,500 activation voucher requires two POS, online or contactless transactions within 30 days of issuance and is available only when the INR750 joining fee plus tax was charged. It is delivered within 30 working days and expires after one year. Card issuance also includes complimentary SpiceClub Silver membership for one year.
- Anniversary-year milestones award 2,000 points at INR100,000 spend and 3,000 points at INR200,000 spend. Renewal awards 1,000 points after successful annual-fee payment. Fuel waiver is 1% for INR400-INR4,000 transactions, capped at INR400/month; GST on the surcharge is non-refundable.
- Issuer-published eligibility: primary cardholder age 18-70 and resident of India. No numerical income or bureau-score threshold is published, though proof of income is requested.

## Limits and conflicts

- The product page and launch release present the lounge gate as spend in the previous quarter; the linked current program says INR50,000 in the previous three calendar months. The record follows the detailed lounge program period.
- The 18-point SpiceJet booking rate is conditional on active Silver membership (6 card + 12 membership points per INR200), not a permanent card-only rate. The free membership is one year; future membership earn depends on SpiceClub tier.
- Wednesday and Dining Delights offers are dynamic promotions and are not modeled as permanent benefits.
