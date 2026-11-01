# Swiggy HDFC Bank Credit Card ? issuer comparison (27 Oct 2026)

## Primary sources reviewed

- [HDFC product page](https://www.hdfc.bank.in/credit-cards/swiggy-hdfc-bank-credit-card): current reward summary, golf benefits and eligibility.
- [HDFC fees page](https://www.hdfc.bank.in/credit-cards/swiggy-hdfc-bank-credit-card/fees-and-charges): ?500 joining and renewal, ?2 lakh annual waiver, reissue fee and stated 3.5% DCC fee.
- [Card terms dated 18 Sep 2026](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/swiggy-hdfc-bank-credit-card/pdf/terms-and-conditions-swiggy-hdfc-bank-credit-card-18092026.pdf), archived locally as `terms-and-conditions-swiggy-hdfc-bank-credit-card-18092026.pdf`.
- [HDFC launch announcement dated 26 Jul 2023](https://www.hdfc.bank.in/press-release/2023/q3/hdfc-bank-launches-co-branded-credit-card-with-swiggy), PDF archived as `hdfc-swiggy-launch-2023-07-26.pdf`.
- HDFC Personal MITC v4.15 and co-branded MITC v3.9 archived in `../_shared/`.

## Field decisions

- Launch date set to 26-Jul-2023 based on the dated HDFC release. Mastercard World is stated in that release; the HDFC product page links to World golf benefits.
- 10% Swiggy cashback applies to Food Delivery, Instamart and Dineout, capped at ?1,500 per billing cycle, with ?249 minimum transaction and MID/TID eligibility. The latest terms specifically say other Swiggy platforms do not qualify, so Genie was removed. The 5% online-MCC and 1% other-spend caps are ?1,500 and ?500; eligible transactions require ?100 minimum. Total category caps sum to ?3,500 per statement cycle.
- 5% is limited to selected merchants under Table 1.2 MCCs. The terms separately say Cleartrip transactions earn 5% by merchant name from statements starting 17-Apr-2026. That exception is documented without broadening the MCC rule. A limited-period Cleartrip instant discount is separately advertised in the terms.
- Cashback is posted day to day and settled in the card account with the statement, based on settlement date (effective 18-Apr-2026). The record currency name is now `Cashback`, not Swiggy Money.
- Welcome benefit: three-month Swiggy One, existing membership extended, claim within 37 days of issuance activation. The product-page summary says 30 days, so the record follows the detailed terms and records the discrepancy. Qualifying Swiggy-app applications from 22-May-2025 have a limited-period extra nine months, credited within 14 days after claiming the first three months.
- Current card terms include a once-per-cardholder birthday-week Dineout discount of 10%, up to ?500 on ?3,000 minimum order, during the seven-day window and only after 30 days from card activation. Added as a separate benefit.
- Product page lists salaried applicants as Indian nationals; neither that wording nor address-document requirements establish a resident-only policy. `residency` is null. Eligibility remains subject to issuer assessment.
- Eligibility page states salaried 21?60 and monthly income ?15,000+, self-employed 21?65 and annual ITR above ?6 lakh.
- Current DCC conflict retained for follow-up: the product-specific FAQ states 3.5%; Personal MITC v4.15 states 1.75% effective 20-May-2026. DCC is distinct from foreign-currency markup (3.5%) and is not encoded in the forex field.
- Product page says 30-day activation for welcome benefit; detailed terms say 37 days. The detailed card-specific terms are modeled.

## Review limits

This comparison validates the listed fields against issuer materials; it is not evidence of dataset-wide accuracy. Product page and product terms can conflict or lag. Dynamic fees, application campaigns, merchant IDs/MCC mapping and offer availability can change.
