# HDFC Bank Freedom Credit Card — issuer comparison (27 Oct 2026)

## Current primary sources

- [Current Freedom card page](https://www.hdfc.bank.in/credit-cards/freedom-credit-card): base 1 CashPoint per INR 200, 10X CashPoints at BigBasket, BookMyShow, OYO, Swiggy and Uber, 500 CashPoints when the joining fee is paid, INR 50,000 annual fee waiver threshold, 1% fuel waiver, redemption values, Dineout offer and card-page eligibility.
- [Current Freedom fees page](https://www.hdfc.bank.in/credit-cards/freedom-credit-card/fees-and-charges): INR 500 annual fee, INR 50,000 annual waiver threshold and cash advance fee.
- [Current Freedom T&Cs dated 15 May 2026](https://v.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/freedom-credit-card/freedom-tncs.pdf): updated earn bases, exclusions, category caps and redemption rules. Archived as `freedom-tncs.pdf`.
- [Freedom eligibility page](https://www.hdfc.bank.in/credit-cards/freedom-credit-card/eligibility): separately published age and income thresholds; conflicts with the card page are noted below.
- [Freedom RuPay listing](https://www.hdfc.bank.in/credit-cards/rupay-credit-card): HDFC lists a distinct “Freedom RuPay Credit Card” variant.
- [May 2026 HDFC card changes notice](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/generic-mailer-tnc.pdf): 1.75% DCC fee and INR 199 reissue fee for non-metal cards; archived under `docs/sources/hdfc/_shared/`.
- Current personal MITC v4.15, dated Oct 2026, archived under `docs/sources/hdfc/_shared/`.

## Record changes

- Cleared unsupported exact launch date (2014-01-01), single Visa network, Classic tier and resident-only status. HDFC currently advertises a Freedom RuPay variant; the main Freedom page does not specify the network for the generic product. Indian nationality is not equivalent to residence status.
- Updated the accelerated partner rate from 10 CashPoints per INR 150 to 10 per INR 200 based on the current 15-May-2026 T&Cs. The superseded 27-Feb-2026 terms said 10 per INR 150. The current terms and product page both support the 10X rate relative to 1 per INR 200 base.
- Retained 2,500 monthly partner cap, 15,000 statement-cycle cap, 2,000/month utility MCC 4900 cap, 2,000/month telecom/cable MCC cap, current exclusions and education-app distinction. Added cashback redemption minimum (3,334 points / INR 500), INR 50 fee and 0.15 AirMiles conversion.
- Confirmed INR 500 joining/renewal fee, INR 50,000 annual waiver threshold, 3.5% foreign-currency markup, 3.75% monthly finance charge, 2.5%/INR 500 cash advance charge, May-2026 DCC/reissue charges in notes, and 1% fuel surcharge waiver on INR 400–5,000 transactions capped at INR 250 per statement cycle.
- Kept 500 CashPoints welcome benefit conditional on joining membership fee payment; no renewal point bonus is currently advertised. Added the 10% Swiggy Dineout discount advertised on the card page, with terms/validity uncertainty documented.
- Modeled the main card page's income requirements: salaried net monthly income > INR 12,000; self-employed ITR > INR 6 lakh/year. The separate eligibility page says gross monthly income > INR 12,000 and self-employed ITR > INR 2 lakh/year; conflict remains unresolved.

## Remaining uncertainties / schema limits

- Exact official launch date not found.
- Generic Freedom card network is not identified on its page; HDFC separately lists a Freedom RuPay variant. Network and tier are null rather than asserting Visa/Classic.
- Main product page and eligibility subpage conflict on gross/net salary and self-employed income floor. The card page is used in structured fields.
- Current Dineout offer page advertises validity through 31-Dec-2026 but its detailed terms still refer to Jan–Dec 2025; exact active conditions remain uncertain.
- May-2026 DCC and reissue charges are recorded in notes because the schema has no dedicated fee keys.
