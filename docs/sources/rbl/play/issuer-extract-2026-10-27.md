# RBL Bank Play Credit Card issuer evidence (reviewed 2026-10-27)

Primary issuer sources checked:

- [Current Play card product page](https://www.rbl.bank.in/personal-banking/cards/credit-cards/rbl-bank-play-credit-card)
- [Play card-specific Terms and Conditions](https://webassets.rbl.bank.in/document/credit-cards/play-credit-card-terms-and-conditions.pdf)
- [Current BookMyShow offer guide](https://www.rbl.bank.in/bmsoffers)
- [Current Schedule of Charges](https://webassets.rbl.bank.in/document/Credit%20Cards/CardsScheduleCharges.pdf)
- [Current RBL MITC](https://webassets.rbl.bank.in/document/Credit%20Cards/RBL-MITC-final.pdf)
- [Network guide](https://www.rbl.bank.in/personal-banking/cards/credit-cards/network-guide)
- [RBL RuPay/NCMC FAQ](https://webassets.rbl.bank.in/document/credit-cards/faqs-rupay-ncmc-credit-card.pdf)

Captured product page, card T&Cs, BMS offer guide and generic charge documents are in this directory.

| Field | Current evidence and encoding |
|---|---|
| Network | Mastercard and Visa listed; scalar network and tier cleared. Product T&Cs include RuPay-only UPI/NCMC conditions, creating a variant conflict because the current product/network pages only list Mastercard and Visa. |
| Launch date | Cleared; not found in current issuer sources. |
| Fee | INR500 joining/first-year and renewal fee plus GST. Annual fee waiver at INR150,000 eligible anniversary-year spend; BMS-sourced Superstar status after 10 BMS transactions/year also waives fee. Generic MITC: 3.99% monthly finance max, cash advance 2.5% min INR500, forex up to 3.5%. |
| Point rewards | No point or cashback earn published in current product page, card T&Cs or current BMS guide. Schema requires one rewards record, so YAML has null earn fields with explicit note; BMS discounts are benefits, not points. |
| Welcome offer | Up to INR500 BookMyShow discount across movies/events/plays/streams/activities/sports; first card purchase within 30 days; activates after 6 PM on day after first statement and lasts 90 days from first statement. Paid/full-fee cards only. |
| Monthly BMS offer | Requires INR5,000 eligible settled billing-cycle spend, excluding listed merchant categories, EMI, fees/charges/GST. Single transaction, two movie tickets minimum; up to INR500 or value of two tickets, whichever lower. Stream category can receive up to INR500. Activates after 6 PM day after billing cycle begins; lasts through cycle end. |
| BMS food & beverage | Up to INR100 once per month on BookMyShow when booking at least two movie tickets. |
| Fuel surcharge waiver | 1% reversal on fuel transactions INR500–4,000 inclusive, surcharge up to INR100/month; GST is not reversed. Not for delinquent, over-limit or closed cards. |
| UPI/NCMC | Product terms describe RuPay-only UPI/NCMC, with small-merchant offline UPI spends below INR2,000 excluded from product benefits. Current product/network guide does not list RuPay for Play; logged as issuer source conflict and left variant-specific. |
| Lounge | No current Play lounge entitlement found; stale domestic lounge quota removed. |
| Eligibility | No card-specific numeric age, income, bureau-score or residency thresholds located. |

## Current MCC and qualifying-spend exclusions

The issuer publishes: Fuel/Auto (`0032`,`2541`,`4001`,`5542`,`5541`,`5172`); utilities (`4900`); insurance (`6300`,`6310`); quasi-cash (`6050`,`6051`,`4829`); railways (`0066`,`4011`,`4112`); rental (`6513`); education (`8220`,`8244`,`8249`,`8211`,`8241`,`8299`); wallet/services (`6540`); government (`9400`,`1490`,`2490`,`2995`,`7800`,`9406`,`9222`,`9405`,`9399`,`9211`,`9402`,`9401`,`9311`,`9223`); contracted services (`1711`,`1740`,`0763`,`1520`,`0742`,`1761`,`1799`,`1750`,`1731`,`1771`,`0780`); cash (`6011`,`6010`); miscellaneous (`5960`); Bills2Pay; and EMI conversions. Most are conditions on qualifying spend for the monthly/annual fee benefit, not general point exclusions because no point earn program is stated.

## Open schema and source issues

- Dual Mastercard/Visa variants cannot be represented by scalar network fields.
- Current product/network pages show Mastercard and Visa, but the linked terms and generic RuPay pages specify RuPay-only offers. Confirm whether a RuPay Play variant remains issued; no such availability appears in the current network guide.
- Schema forces a rewards object. Null rates plus explanatory note avoid inventing a points program.
- No current launch date or card-specific numeric applicant criteria found.
