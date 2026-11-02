# IndiGo Kotak Credit Card issuer comparison — 2026-10-27

## Sources reviewed and archived

- Current Kotak [product and benefits page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/indigo-credit-card.html), captured as `product-page-2026-10-27.html`.
- Current [fees and charges page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/indigo-credit-card/fees-and-charges.html), captured as `fees-page-2026-10-27.html`.
- Kotak's current [retail MITC and cardholder agreement](https://www.kotak.bank.in/content/dam/Kotak/files/english-rcas.pdf), archived as `mitc-2026-10-27.pdf`.
- The current shared [IndiGo co-brand terms](https://images.kotak.bank.in/bank/mailers/2025/files/Kotak%20IndiGo%20Credit%20Card%20TnC.pdf) were retrieved from the issuer but direct local download returned HTTP 403. The identical shared PDF is archived in `../indigo-xl/indigo-kotak-card-terms-2026-10-27.pdf` and covers both base and premium card tables.
- Current Kotak rewards [MCC schedule](https://www.kotak.bank.in/content/dam/Kotak/gsfcfiles/credit-cards/list-of-mccs-with-respect-to-revised-fees-and-rewards_june_01_2025.pdf) is archived in `../indigo-xl/kotak-reward-mcc-schedule-2025-06-01.pdf`.
- The [2025 relaunch announcement](https://www.kotak.bank.in/content/dam/Kotak/others/kotak-indigo-consumer-release-final-09-07-2025.pdf) is also archived locally as `indigo-kotak-relaunch-2025-07-10.pdf`.

## Corrections made

- Set network and network tier to null because the issuer page explicitly mentions RuPay UPI variant terms and does not establish one network for all cards in the aggregate record. The relaunch date is 2025-07-10.
- Standard current issue fees remain INR1,500 joining and annual, with no fee waiver. Current MITC terms support 3.75% monthly finance, 3.5% forex/DCC and 2.5% cash advance fee with INR500 minimum. Fee notes include current transaction-fee thresholds for fuel and utilities and identify that migrated legacy base cards may retain INR700 fee and lack welcome/renewal benefits.
- Corrected direct-flight reward composition to 3 card-side BluChips/INR100 (not the previously copied XL value of 5), plus 8 Blu member base, 4 direct-channel and up to 4 member-tier BluChips. Total is 15/17/19 by member tier. Third-party, group, corporate, SME and agent bookings are excluded; cardholder must fly and match PNR.
- Current general spend rate is 1 BluChip/INR100; dining/entertainment is 2/INR100. RuPay UPI card transactions also earn 1/INR100 subject to excluded MCCs. No annual earn cap is stated.
- Replaced inherited XL milestone thresholds with three current base-card milestones: INR125,000, INR250,000 and INR600,000 in the anniversary year; each earns a 2,500-BluChip voucher. Voucher benefit is not recorded as a fixed INR value.
- Welcome voucher is 2,500 BluChips; renewal voucher is 2,500 BluChips on annual fee payment. Voucher validity is six months. No complimentary lounge access is provided on the base card; issuer says lounge is an additional Premium variant benefit. Removed unsupported fuel surcharge waiver and priority check-in/preferred-seat claims.
- BluChip redemption value is set at IndiGo's discretion. Voucher terms limit use to IndiGo web/app, base fare and one one-way journey; vouchers cannot combine with another BluChip voucher and expire in six months. Project global program values are modeled estimates, not issuer guarantees.
- Cleared unsupported card-specific residency, age, income and credit-score claims.

## Unresolved issuer evidence

1. The current product page advertises a 2,500-BluChip welcome voucher and says migrated base 6E Rewards cardholders are ineligible for joining/renewal benefits. Shared co-brand terms generically mention a 6E Meals add-on alongside the welcome BluChip voucher; current base-card page does not clearly confirm a meal voucher, so it is not encoded.
2. Legacy migrated cardholders may retain a INR700 fee until card expiry; the YAML describes current standard issue pricing (INR1,500) and documents the legacy exception in notes.
3. The issuer page describes RuPay UPI earn, but does not provide a complete network-variant matrix; network scalar remains null.
4. BluChip redemption rupee value is not fixed by issuer terms; reward catalog model estimates are not an issuer commitment.
5. Numeric eligibility and exact card-specific launch eligibility details were not found.

The review uses the project's [database accuracy overview](../../DATABASE_ACCURACY_OVERVIEW_2026-10-27.md) and the [UK Government Data Quality Framework](https://www.gov.uk/government/publications/the-government-data-quality-framework/the-government-data-quality-framework), which separates accuracy from validity and completeness.
