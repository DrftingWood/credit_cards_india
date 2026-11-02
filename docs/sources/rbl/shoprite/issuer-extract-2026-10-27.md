# RBL Bank ShopRite issuer evidence (reviewed 2026-10-27)

Primary issuer sources checked:

- [Current ShopRite product page](https://www.rbl.bank.in/personal-banking/cards/credit-cards/shoprite-credit-card)
- [ShopRite card-specific Terms and Conditions](https://webassets.rbl.bank.in/document/credit-cards/tnc-shoprite-credit-card.pdf)
- [Current RBL Schedule of Charges](https://webassets.rbl.bank.in/document/Credit%20Cards/CardsScheduleCharges.pdf)
- [Current RBL MITC](https://webassets.rbl.bank.in/document/Credit%20Cards/RBL-MITC-final.pdf)
- [Current network availability guide](https://www.rbl.bank.in/personal-banking/cards/credit-cards/network-guide)
- [Current RBL Rewards program terms](https://rblrewards.rbl.bank.in/tnc)

The product page HTML and linked issuer PDFs are archived in this directory.

| Field | Current evidence and encoding |
|---|---|
| Network and launch | Product page says Mastercard, Visa and RuPay; current network guide lists only Mastercard and Visa. RuPay-only UPI clauses appear on the page. Scalar network/tier and unsupported 2016 launch date cleared; variant conflict remains open. |
| Fees | INR500 joining and annual fee plus GST; INR150,000 eligible membership-year spend waives following year's annual fee. Exclusions include issuer-listed categories, EMI, fees, charges and GST. MITC maximum finance charge 3.99% monthly, cash advance 2.5% (minimum INR500), forex up to 3.5%. |
| Rewards | 1 point/INR100 base; 20 points/INR100 grocery, capped at 1,000 points; over-cap grocery earns at base rate. Product terms say cap month is a billing cycle, while product page uses month/calendar-month language. Product T&Cs say credit within 60 days after settlement; page says within 45 days. These two timing differences remain unresolved. |
| Exclusions | Fuel/auto, utilities, insurance, railways, rent/real estate, wallets/service providers, quasi-cash, education, government, contracted services, cash, Bills2Pay, miscellaneous, EMI conversion, fees/charges/GST. MCC list encoded in YAML. |
| Point redemption | Product page says up to INR0.25/point. Generic rewards terms apply INR99 + GST per redemption request and points expire after 24 months. Redemption values depend on available catalogue option. |
| Welcome | 2,000 points after an eligible retail transaction within 30 days of issuance and payment of first annual fee by its due date; credited within 60 days of issuance. |
| Movies | BookMyShow 10% discount up to INR100, 15 times/calendar year; primary card only; not combinable with other offers. |
| Fuel | 1% fuel surcharge reversal for transactions INR500–4,000 inclusive, capped INR100/calendar month; GST is not reversed. |
| Eligibility and lounges | No card-specific numeric applicant criteria or current lounge entitlement found. |

## Unresolved evidence conflicts

- Product page advertises 45-day reward credit; card-specific PDF says within 60 days from settlement.
- Product page and PDF phrase the grocery cap period differently (monthly vs. assigned billing cycle).
- Current product page includes RuPay, but the live network availability guide does not list ShopRite RuPay; generic RuPay conditions are present.
- T&Cs welcome/points terms refer to calendar month in some places and billing cycle in another. Benefits are encoded according to the card-specific terms and product-page caveat retained.
