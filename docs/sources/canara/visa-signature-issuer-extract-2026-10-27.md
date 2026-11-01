# Canara Visa Signature — issuer evidence extract (27 Oct 2026)

Compared Canara Bank's current [Visa Signature Credit Card page](https://www.canarabank.bank.in/visa-signature-credit-card), retrieved 27 Oct 2026. The page footer displays 1 Apr 2026. Its MITC link is presented on the page; the page itself publishes its card-specific fee table and terms.

## Confirmed current issuer claims

- Nil joining and annual fees; card-year turnover below INR200,000 triggers an INR1,000 inactivity fee. The schema has no dedicated inactivity-fee field, so this is recorded in fee notes rather than as an annual fee or waiver threshold.
- Up to 3% forex markup, 2.5% monthly unsecured revolving rate, and cash withdrawal fee 3% with INR150 minimum at Canara ATMs.
- 2 Reward Points per INR100 on POS/e-commerce, redeemable for cashback or goods through Canara Rewardz. The linked issuer user manual gives INR0.25 nominal point value; the current Rewardz app did not expose redemption detail. Realized value remains unknown.
- Three domestic lounge visits per quarter. The page provides no guest quota or international lounge quota; these were left unspecified.
- Fuel surcharge reimbursement up to 1%, minimum fuel ticket INR400, INR100 cap per billing month, with INR2,500 minimum purchase spend in the month; reimbursement in the following month.
- Fraudulent charge cover INR500,000; purchase protection INR25,000; baggage insurance up to INR25,000; air accident cover INR800,000 self/INR400,000 spouse; other accident cover INR400,000 self/INR200,000 spouse. Detailed policy wording is not supplied.
- Minimum independent gross annual income INR10 lakh for individuals. Age, credit-score and residency criteria are not published.

## Corrections and limits

Cleared the unsupported 1 Jan 2020 launch date and INR2 lakh annual-fee waiver. The issuer separately calls INR2 lakh turnover an expected annual minimum and charges INR1,000 inactivity fee below that level; it is not a fee waiver because joining/annual fees are listed as nil. Removed the unsupported reward exclusions and MCC 6513, INR0.20 realized point value, zero guest quota, international lounge visit, fuel max-ticket INR4,000, and concierge=true. Effective dates are not stated; schema-required `effective_from` uses the observation date 2026-10-27. Lounge access mechanism and insurance claim conditions remain undocumented.
