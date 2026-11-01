# HDFC Shoppers Stop Black — issuer evidence extract (2026-10-26)

## Sources checked

- [Current HDFC product page](https://www.hdfc.bank.in/credit-cards/shoppers-stop-black-credit-card), retrieved 2026-10-26.
- [Current HDFC fees and charges page](https://www.hdfc.bank.in/credit-cards/shoppers-stop-black-credit-card/fees-and-charges), retrieved 2026-10-26.
- [Current HDFC co-branded MITC v3.9](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/co-branded-most-important-terms-and-conditions-for-credit-cards.pdf), updated 2026-05-08; archived as `../_shared/co-branded-mitc-v3.9-retrieved-2026-10-26.pdf`.
- [Current linked Shoppers Stop Black T&Cs](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/shoppers-stop-black-credit-card/pdfs/SS-Black-T-and-C-latest.pdf), retrieved 2026-10-26; archived as `shoppers-stop-black-terms-retrieved-2026-10-26.pdf`.
- HDFC [2022 launch announcement](https://www.hdfc.bank.in/press-release/2022/q1/hdfc-bank-shoppers-stop-launch-co-branded-credit-cards), dated March 30, 2022; archived as `hdfc-shoppers-stop-launch-2022-03-30.pdf`.
- HDFC product eligibility is listed on the current product page; the ₹70,000 monthly salaried floor is also corroborated by [HDFC's ₹70K salary card listing](https://www.hdfc.bank.in/ps/credit-cards-in-india/credit-cards-for-seventy-thousand-salary).

## Current issuer terms encoded

- Announcement/launch proxy date: March 30, 2022. Current product page and release do not name a payment network or tier, so both fields are unknown. The archived member agreement contains Visa privilege-program boilerplate, which is not sufficient to establish the current issued network.
- Joining and renewal fees: ₹4,500 + taxes; no current waiver identified. Foreign currency markup is 3.5%, monthly finance charge is 3.75%, cash advance fee is 2.5% (minimum ₹500). The product-specific fees page also lists 1% DCC markup and a 1% rent transaction charge from the second rent payment in a calendar month.
- Rewards: 7% on Shoppers Stop spend and 2% on non-Shoppers Stop spend; monthly caps 2,000 points in each category; minimum eligible transaction ₹150. The 7% category depends on merchant TID/MID configuration. Points expire after two years. Rewards can be redeemed at ₹1/point against Shoppers Stop vouchers, ₹0.20/point as statement credit, ₹0.35/point for catalogue, up to ₹0.50/point for airmiles, or ₹0.50/point on SmartBuy flights/hotels (subject to limits).
- Current issuer exclusions include wallet, rent, government, fuel, supermarkets, tax, EMI, miscellaneous vending food, package stores/liquor, bakeries, cash advances/travellers' cheques, insurance and jewellery. The schema captures categories it supports and retains the rest in the record's capping/exclusion notes.
- Welcome benefit: ₹1,500 Shoppers Stop voucher for any Shoppers Stop transaction; issuer says welcome message arrives within three working days of onboarding. Free Shoppers Stop Black membership is advertised at ₹4,500.
- Lounge access: 16 domestic entries/year (4/quarter) and 8 international entries/year (2/quarter). Fuel surcharge waiver: 1% on ₹400–₹5,000 transactions, capped at ₹500/statement.
- Eligibility: Indian nationality; salaried age 21–60 and monthly income ₹70,000; self-employed age 21–65 and annual income greater than ₹8,40,000.

## Conflicts and limitations

- The live product page states a weekend reward of 2,000 Reward Points monthly for a single Shoppers Stop purchase of ₹50,000 or more on weekends. The currently linked detailed T&C says ₹1,500 per qualifying purchase and at most five awards/year. Its worked example does not cleanly reconcile with that statement. The record uses the live product-page amount and retains the frequency/amount conflict here and in YAML source notes.
- The current product page/table/example state 2% for non-Shoppers Stop spend, but one heading in the linked detailed T&C says 1%. The 2% value is modeled from the live page and T&C table/example.
- HDFC's fees page says reward redemption handling is ₹99 + tax; the card-specific T&C says ₹50 + tax for statement-credit redemptions and ₹99 + tax for catalogue handling. The model leaves per-method fee unresolved and records the discrepancy.
- No current issuer source located in this review confirms a Visa tier/network. The existing card-member agreement's Visa program section is generic and does not prove current card network.
