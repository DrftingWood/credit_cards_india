# Apollo SBI Card SELECT: issuer comparison (27 Oct 2026)

## Primary issuer sources compared

- [Current SBI Apollo SELECT product page](https://www.sbicard.com/en/personal/credit-cards/apollo-sbi-card-select.html): current product positioning, fees, rewards, health benefits, milestones, lounge entitlement and fuel waiver.
- [Apollo SELECT card FAQ](https://www.sbicard.com/sbi-card-en/assets/docs/pdf/tnc/Apollo-SBI-Card-SELECT-FAQ.pdf): reward point rate and cap, Apollo-only redemption, annual anniversary health check, network variants and UPI eligibility.
- [Apollo SELECT card terms](https://www.sbicard.com/sbi-card-en/assets/docs/pdf/tnc/Apollo-SBI-Card-SELECT-tnc-Booklet.pdf): category MCCs, reward calculation, exclusions, 24-month points expiry, fuel transaction band and eligible fuel MCCs.
- [Health Check-Up and FITPASS terms](https://www.sbicard.com/sbi-card-en/assets/docs/pdf/tnc/B-Health-Check-Up-Fitpass.pdf): check-up value INR1,999 and spend window from account opening/card anniversary.
- [SBI launch filing (May 2025)](https://www.sbicard.com/sbi-card-en/assets/docs/pdf/who-we-are/notices/SEFilingProductLaunch-may25.pdf): exact 15-May-2025 launch date.
- [Current SBI MITC](https://www.sbicard.com/en/most-important-terms-and-conditions.page): joining/renewal fee INR1,499, annual spend waiver INR3 lakh, standard finance/forex/cash-advance charges.

Local PDF copies are archived in this directory. The current product page and MITC are also represented by their source URLs; fees remain dated to the existing record's 2026-07 effective period because the issuer does not publish a newer effective date.

## Corrections and substantiated details

- Corrected launch date from 1-May to 15-May-2025.
- Cleared Visa Signature: the card is issued on RuPay or Mastercard, and the schema has one selected network slot. Set network and tier to null and recorded both supported options in tags. RuPay can link to UPI; Mastercard cannot.
- Kept fees at INR1,499 joining/annual, INR3 lakh annual-fee waiver threshold, nil add-on fee, 3.5% forex, 3.75% monthly finance charge, and 2.5% cash advance fee (minimum INR500), per current product page/MITC.
- Confirmed earn rates of 10 RP/INR100 at Apollo 24|7/Pharmacy, 2 RP/INR100 on eligible dining, movie/entertainment and travel MCCs, and 1 RP/INR200 on other eligible purchases. Each accelerated category has a separate 5,000 RP statement-cycle cap; after cap, other-purchase rate applies. Apollo UPI transactions earn only 1 RP/INR200. Point calculation rounds down by eligible denomination.
- Removed false statement-credit and SBI rewards catalogue redemption. RP convert only to Apollo Health Credits at 1:1; issuer values each Health Credit at INR1. RP expire 24 months after accrual.
- Replaced generic unsupported exclusions with T&C-backed fuel (5172, 5541, 5542, 5983), wallet loads (6540, 6541), rent (6513), government (9399, 9311) and digital gaming (5816, 7993, 7994) MCC exclusions. The issuer identifies merchant eligibility on a best-effort basis. Dining MCCs are 5812/5814, entertainment 7832/7922, and travel 4511/3020/7011/4112/4722.
- Added the second-year-and-later anniversary health check trigger: INR50,000 spend within 90 days of each card anniversary; dedicated issuer terms value the check-up at INR1,999. Kept the separate first-90-days-from-joining offer.
- Confirmed welcome voucher INR1,500 after joining fee; FITPASS PRO one year after fee plus at least one retail transaction; Apollo Circle benefits; Noise smartwatch INR7,999 after INR6 lakh annual spend; domestic lounge 4/year, max 1/quarter; complimentary Priority Pass membership for two years (visits chargeable).
- Filled fuel-waiver transaction band INR500–4,000 and cap INR100 per statement cycle/card account; eligible fuel MCCs 5172, 5541, 5542 and 5983. The issuer page itself advertises the 1% waiver, while the booklet supplies the transaction band and cap.
- Retained no fixed card-specific income or credit-score minimum: the issuer policy provides age criteria but does not publish those thresholds.

## Remaining limitations

Issuer terms state the Apollo Circle percentage varies by offer/product; the database keeps the page's “up to 25% value back” claim without assigning a cash value. The database's single network field cannot represent the two offered network variants, so it is null and the options are documented here and tagged in the record. Network-specific variant details should not be inferred from this parent record.
