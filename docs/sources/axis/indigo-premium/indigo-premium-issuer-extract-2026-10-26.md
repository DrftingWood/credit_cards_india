# IndiGo Axis Bank Premium Credit Card issuer extract (reviewed 2026-10-26)

Primary source: [current Axis product page](https://www.axis.bank.in/cards/credit-card/indigo-axis-bank-premium-credit-card).

Archived current sources:

- `indigo-premium-card-terms-retrieved-2026-10-26.pdf` (14-page current card terms linked by the live issuer page)
- `indigo-premium-terms-update-effective-2026-08-28.pdf` (card-specific change notice)
- `double-welcome-campaign-terms-retrieved-2026-10-26.pdf`
- `indigo-axis-card-launch-2026-02-18.pdf`
- Current lounge program in `docs/sources/axis/_shared/axis-bank-airport-lounge-access-program-retrieved-2026-10-26.pdf`
- Current MITC in `docs/sources/axis/_shared/mitc-credit-cards-retrieved-2026-10-26.pdf`

## Current terms encoded

- Joining and annual fees: INR 5,000 + GST each. No annual spend waiver is listed in card-specific terms. Welcome/renewal/milestone offers require the relevant fee to be paid; free/first-year-free accounts do not earn under these terms.
- Base: 2 IndiGo BluChips per INR 100 on eligible non-accelerated spend. Accelerated: 7 per INR 100 on IndiGo channel purchases; 3 per INR 100 on listed grocery MCCs and hotel MCCs 3501-3838/7011. No overall cap is stated. EMI, cash withdrawal, fees/taxes, reversals, fraud/dispute credits, and specified merchant categories do not earn. Points credit within 30 working days after statement generation.
- BluChips are loyalty points with no monetary value, cannot be cashed out, and are governed by IndiGo's rules. The prior INR 0.60/0.45 estimates were not issuer-supported and are cleared from the record.
- Standard welcome: 5,000 BluChip voucher and one 6E Eats voucher on joining-fee payment; voucher issued within 30 days, payment must be made within 120 days of fee charge, vouchers valid six months. Renewal: same 5,000 BluChips + 6E Eats voucher on annual-fee payment.
- Temporary double-welcome offer: card-specific PDF says applications from 2026-06-01 to 2026-10-31 and adds one further 5,000 BluChip voucher; live product page says 2026-09-01 to 2026-10-31. Joining fee must be paid. The standard 6E Eats voucher remains one voucher. Offer vouchers are issued separately within 30/60 days and valid six months.
- Milestones: 5,000 BluChip voucher at each of INR 200,000, 500,000, 800,000 and 1,200,000 eligible spend in the card anniversary year. Net reversals apply; excluded categories don't qualify; fee must be paid. Voucher issues within 30 days after the next statement and is valid six months.
- Domestic lounge: 2 visits per quarter after at least INR 50,000 eligible spend in the preceding three calendar months. New issuance waives this gate for issue month plus the next three calendar months. Cardholder only; guests are not complimentary.
- International lounge: 2 visits per calendar year through Priority Pass. A USD 1 validation authorization must be made and is reversed after successful authorization; no free guest access.
- BookMyShow: Buy-one-get-one, once monthly, maximum discount INR 250/month. The August notice adds an INR 25,000 spend gate over the previous three months from 2026-11-01; new issuance is exempt for issue month and the next three calendar months.
- Current standard charges include 3.75% monthly finance, cash advance 2.5%/INR 500 minimum, 2.5% foreign markup, and 2.5% DCC effective 2026-08-28. The current page also lists late-fee slabs, INR 99 reward-redemption fee, rent/education-app fees, and statement-threshold wallet/fuel/utility fees; the schema has no dedicated field for all such charges.
- Eligibility: age 18-70, minimum net income INR 600,000 per annum, resident India. The page does not divide the income cutoff by employment type; no card-specific score cutoff is published.
- Network: launch release says both RuPay and Visa networks. It does not state a tier; the record leaves both scalar network and network tier unknown because the YAML schema cannot represent both variants.
- No fuel-surcharge waiver is published for this card. The former 1%/INR 400 waiver was unsupported. Dining Delights and Wednesday Delight are current dynamic programs without a fixed card-specific value in reviewed material.

## Conflicts and limitations

1. **Double welcome window:** campaign PDF eligibility starts June 1; product page says September 1. Both end October 31, 2026. The record follows the specific offer PDF and preserves the discrepancy.
2. **BookMyShow:** core terms and page describe BOGO once monthly; August change notice adds the INR 25,000 preceding-three-month spend gate beginning November 1. The current record reflects both timing and existing monthly INR 250 cap.
3. **Network variant:** official launch material says the cards are launching on RuPay and Visa; current product material does not identify the specific network issued to a given applicant. Network and network tier are null.
4. **Reward value:** the card terms explicitly say BluChips have no monetary value; no rupee-per-point estimate is asserted.

This is a field-level issuer comparison for this card; it does not establish a dataset-wide accuracy rate.
