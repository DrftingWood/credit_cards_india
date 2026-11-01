# Kotak Zen Signature issuer comparison — 2026-10-27

## Sources reviewed and archived

- Kotak current [Zen product page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/zen-signature-credit-card.html): `product-page-2026-10-27.html`.
- Current [fees page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/zen-signature-credit-card/fees-and-charges.html): `fees-page-2026-10-27.html`.
- Current [reward redemption page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/zen-signature-credit-card/rewards-redemption.html): `rewards-page-2026-10-27.html`.
- Current [milestone page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/zen-signature-credit-card/milestone-program.html): `milestone-page-2026-10-27.html`.
- Card-specific KFS, version KFSZS12032026: `kfs-zen-signature-2026-10-27.pdf`.
- Consolidated retail MITC downloaded from issuer page: `mitc-wealth-and-white-reserve-2026-10-27.pdf`.
- Issuer reward MCC schedule reused from `../indigo-xl/kotak-reward-mcc-schedule-2025-06-01.pdf`.
- Current card-specific [eligibility page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/zen-signature-credit-card/eligibility-criteria.html).

## Corrections made

- Removed unsupported 2023-01-01 launch date and Visa Signature network tier. Current product material identifies Zen card features but does not establish exact launch date or current network tier; Visa privileges alone do not prove tier.
- Kept joining/annual fee INR1,500; annual fee waived on INR150,000 anniversary-year retail spends. Corrected monthly finance charge to 3.75% and cash advance fee minimum to INR500 (2.5% of amount), based on the current KFS. Forex markup remains 3.5%.
- Confirmed 5 Zen Points per INR150 on other eligible purchases and 10 per INR150 on shopping (apparel, lifestyle goods, departmental stores and jewellery), with overall 6,500-point statement-cycle cap. Education/insurance earn only up to INR70,000, utility INR50,000 and government INR40,000 per statement cycle. No points on wallet loads, fuel, rent and online skill-based gaming; EMI purchases also excluded.
- Corrected redemption values: catalogue categories such as recharge, shopping, e-vouchers, movies and travel are listed at INR0.25/point; cash value is INR0.20/point from 2025-06-01 with a 2,000-point minimum. Removed prior INR0.15 value.
- Corrected milestone values to INR300,000 anniversary-year eligible spend for 7,500 points or INR600,000 for 15,000 points. The issuer says only one of these tiers is paid at the end of the anniversary period. Listed excluded MCC categories separately; these also do not count toward milestone spend.
- Corrected domestic lounge access: 2 visits in the next calendar quarter after at least INR75,000 spend in the preceding calendar quarter. International lounge access is 3 visits per calendar year outside India for the primary cardholder only. Guests are USD35 per visit; international validation charge USD1 is credited within seven working days.
- Corrected fuel surcharge waiver to 1% on INR500-INR5,000 transactions, capped at INR3,500 per anniversary year. KFS says points do not accrue on transactions where fuel/railway surcharge waiver is given.
- Added current issuer eligibility: primary applicant age 21-60, resident in India, net income at least INR480,000 annually, and specified application cities. The issuer page does not split income minimum by employment type or provide a bureau-score threshold.
- Recorded 1,500 welcome points conditional on paying the INR1,500 joining fee; unavailable on a free card.

## Unresolved and schema limitations

1. No exact launch date or current Visa tier was found in the card-specific issuer evidence; both are null.
2. The product page's domestic lounge text does not specify guest entitlement. The record leaves no guest entitlement stated and includes the INR75,000 quarterly spend gate in notes.
3. Eligibility publishes a single net-income threshold, not salaried/self-employed breakouts; the schema has separate fields, so those remain null and the published threshold is in notes.
4. Redemption value varies by redemption route. Both catalog and cash values are kept separately; merchant-specific catalogue restrictions may apply.
5. The product page uses both “anniversary year” and calendar-year examples for milestone settlement. The card data uses anniversary year and notes the issuer's settlement description.

This source review follows the project's [accuracy overview](../../DATABASE_ACCURACY_OVERVIEW_2026-10-27.md) and the [UK Government Data Quality Framework](https://www.gov.uk/government/publications/the-government-data-quality-framework/the-government-data-quality-framework), which treats accuracy separately from validity and completeness.
