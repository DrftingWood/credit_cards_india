# Canara Mastercard World — issuer evidence extract (27 Oct 2026)

Compared the current [Canara Mastercard World Credit Card page](https://www.canarabank.bank.in/mastercard-world-credit-card), which shows a 1 Apr 2026 page date, with Canara's linked [credit card user manual](https://canarabank.bank.in/documents/d/guest/credit-card-manual). The issuer's linked MITC PDF returned 404 during review; the current product page publishes its own fee table and product summary.

## Confirmed from the current product page

- Product is Mastercard World. Joining and annual fees are nil. Forex markup is up to 3%; unsecured revolving interest is 2.5% monthly/30% annually. Cash withdrawal at Canara ATMs is 3%, minimum INR150; other-bank ATM charges may apply separately.
- An INR300 inactivity fee applies when card-year turnover is below INR100,000. The database schema has no dedicated field for this fee; it is retained in notes.
- The page gives 2 Reward Points per INR100 on POS/e-commerce. Rewards can be redeemed for cashback or goods via Canara Rewardz. The issuer manual gives a nominal INR0.25 per point but the current Rewardz application requires JavaScript and did not expose the current redemption terms; realized value is unknown and the nominal value is marked medium confidence pending confirmation.
- Lounge quotas are 3 self + 2 guest visits per quarter domestically and 2 self + 2 guest visits per year internationally. The current card page does not specify the participating lounge list or the international access mechanism. The prior LoungeKey claim was removed as unverified.
- Fuel surcharge reimbursement is 1% on transactions of at least INR400, capped at INR100 per billing month. The card must have at least INR2,500 in purchase transactions that month, and reimbursement posts the next billing month. No maximum eligible fuel ticket is published.
- Product summary lists purchase protection up to INR25,000, baggage insurance up to INR25,000, air accident cover INR8 lakh self/INR4 lakh spouse, and non-air accident cover INR4 lakh self/INR2 lakh spouse. Detailed policy wording is not available on the card page.
- Independent gross annual income of at least INR10 lakh is stated for individuals. Age, credit-score and residency requirements are not published.

## Corrected or unresolved fields

Removed unsupported launch date 1 Jan 2020, online-only accelerated earning model, unsupported fuel/wallet/rent/EMI/MCC exclusions, INR0.20 realized point value, domestic guest count zero, LoungeKey route, resident-Indian default and concierge=true. `effective_from` remains null because the issuer does not state the effective date of these card terms. Current product text says points apply to POS/e-commerce, not only online purchases. The product page supports guest lounge quotas but not the earlier fuel cap/range. The linked MITC PDF could not be fetched (404), and Rewardz redemption detail could not be inspected, so those gaps remain explicit.
