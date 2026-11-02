# PhonePe HDFC Bank Ultimo ? issuer evidence extract (2026-10-26)

## Current issuer sources checked

- [HDFC PhonePe Ultimo product page](https://www.hdfc.bank.in/credit-cards/phonepe-hdfc-bank-ultimo-credit-card) ? currently shows the post-2026-08-01 welcome offer, rewards, lounge threshold and fuel waiver.
- [HDFC card-specific FAQ, v1.1.3 dated 2026-04-28](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/phonepe-hdfc-bank-ultimo-credit-card/ultimo-faqs.pdf) ? current downloaded copy: `ultimo-faqs-retrieved-2026-10-26.pdf`.
- [HDFC card-specific Reward Points T&Cs, v3](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/phonepe-hdfc-bank-ultimo-credit-card/phonepe-ultimo-cc-reward-points-t-cs-v-3.pdf) ? current downloaded copy: `phonepe-ultimo-cc-reward-points-t-cs-v-3-retrieved-2026-10-26.pdf`.
- HDFC co-branded MITC v3.9 (April 2026, updated 2026-05-08): archived at `../_shared/co-branded-mitc-v3.9-retrieved-2026-10-26.pdf`.
- [HDFC launch announcement](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/pdf/press-release/2025/q2-apr-jun/june/hdfc%20bank%20phonepe.pdf), 2025-06-26: archived as `phonepe-hdfc-launch-release-2025-06-26.pdf`.
- HDFC's [co-branded card offers listing](https://www.hdfc.bank.in/ps/credit-cards-in-india/co-branded-credit-card-offers) publishes minimum monthly salary of INR20,000; the schema stores INR240,000 annualized.

## Current terms encoded

- Launched 2025-06-26; RuPay network. Current issuer pages do not identify a RuPay tier, so `network_tier` is unknown.
- Joining and annual fees INR999 + tax; no joining-fee waiver. Renewal fee waived on INR200,000 eligible annual spend. The MITC/FAQ exclude cash advances, card fees/charges and EMI spends from the waiver threshold.
- Foreign currency markup 3.5%; finance charge 3.75% monthly; cash advance transaction fee 2.5% or INR500, whichever is higher.
- Earn structure: 10% Reward Points on select PhonePe categories (up to 1,000 points/calendar month); 5% on eligible online brands (up to 500/month); 1% on RuPay UPI Scan & Pay (up to 500/month). Issuer advertises an aggregate maximum of 2,000 points/month. Reward posting is by the 15th of the following month for eligible prior-month settled spend.
- Listed selected category and online-brand MCCs are preserved in the card YAML and follow the current card-specific T&Cs. PhonePe Pincode is not included as current: the issuer page still says its offer was valid only through 2025-12-05.
- Reward exclusions include EMI, fuel, wallet loads, gift cards, cash advances, card bill payments, fees/charges, government payments, rent, education, insurance, investments and jewellery. The schema maps the published exclusions as closely as its allowed categories permit; remaining wording is retained here and in YAML notes.
- Statement-credit redemption: INR1/point, 500-point minimum, maximum INR7,500/calendar month, no cashback redemption fee. SmartBuy redemptions are INR0.30/point.
- Lounge benefit: 8 domestic visits/year (2/calendar quarter) after INR75,000 qualifying spend in the previous calendar quarter; fuel waiver is 1% for INR400?5,000 transactions, capped at INR250/statement.
- For applications on or after 2026-08-01, welcome offer is five PhonePe scratch cards worth INR200 each on the first five PhonePe UPI-on-credit-card transactions (minimum INR100 each), and only where the joining fee is applicable. Earlier applications had a different ?499 + 10??50 structure; the current YAML models the live offer.
- Applications are exclusively through the PhonePe app. Exact age, self-employed income and minimum credit-score thresholds are not published.

## Unresolved issuer conflict

The April 2026 card-specific FAQ and card-specific reward T&Cs say unredeemed Reward Points expire after two years. HDFC's consolidated MITC v3.9 updated 2026-05-08 says Ultimo Reward Points are valid for one year. The card record does not model an expiry duration pending issuer reconciliation. Product-page copy also carries the expired Pincode date while its current category list omits Pincode; Pincode is therefore excluded from the current earn model.
