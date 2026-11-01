# HDFC Diners Club Rewardz — issuer comparison (27 Oct 2026)

## Current primary sources

- [HDFC Diners Club Rewardz card page](https://www.hdfc.bank.in/credit-cards/diners-club-rewardz-credit-card): 3 points per INR 200, 1,000 activation/renewal points, 3% foreign currency markup, concierge, SmartBuy values/cap, lounge access, and closed new applications.
- [HDFC Diners Club Rewardz fee page](https://www.hdfc.bank.in/credit-cards/diners-club-rewardz-credit-card/fees-and-charges): INR 1,000 joining/renewal, waiver at INR 1 lakh annual spend, 2.5%/INR 500 cash advance minimum, 3.6% monthly interest.
- [HDFC notice effective 15 May 2026](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/generic-mailer-tnc.pdf): lists “Diners Rewards” at 3 points per INR 200; DCC markup 1.75% for INR transactions at international locations or INR transactions with foreign-registered merchants in India; reissue fee INR 199 for non-metal cards.
- Archived card-specific tariff: `fees-and-charges-june-2025.pdf`.
- Archived card-specific T&C: `terms-and-conditions.pdf`.
- Archived May 2026 notice: `hdfc-card-changes-effective-2026-05-15.pdf`.

## Record changes

- Cleared unsupported exact 1 Jan 2017 launch date and resident-only eligibility assertion. Current product page states that new applications are not being accepted; the card remains listed with benefits for existing holders.
- Updated base accrual to 3 Reward Points per INR 200, effective 15 May 2026; verified against the card page and the linked issuer notice. Retained 15,000 points per statement cycle cap, route-specific redemption values, and up-to-70% booking value limit from the issuer page.
- Used the current live product page's 3% foreign-currency markup in the structured fee field. The archived June 2025 tariff implies 3.5%; this source conflict is retained in fee notes rather than silently erased.
- Retained the current fee page's INR 1,000 annual fee, INR 1 lakh annual waiver threshold, 2.5%/INR 500 cash advance minimum and 3.6% monthly interest. Added the May 2026 DCC and non-metal reissue fees to notes because the schema has no dedicated fields for them.
- Current product page says unlimited lounge access in India for primary and add-on cardholders and 24x7 concierge; the lounge operator/quota details are not independently stated on that page. Current application status is closed to new applicants.
- Kept fuel surcharge waiver based on the card-specific tariff: 1% for INR 400–5,000 fuel transactions, capped at INR 499 per billing cycle. Exact effective date is not stated.
- Preserved variable realized point value as unknown; displayed redemption values vary by channel and offer.

## Remaining uncertainties / schema limits

- No exact official launch date found.
- Product page's 3% forex figure conflicts with the older 3.5% card-specific tariff; no newer card-specific tariff located.
- DCC and reissue charges are represented in notes only; the schema has no dedicated fee keys.
- Product page's lounge claim gives no operator list or visit-count details beyond “unlimited” in India.
- Issuer does not publish a Rewardz-specific minimum income, age range or credit score in the reviewed current sources.
