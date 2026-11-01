# Priority Banking Visa Infinite ? cash-advance fee source reconciliation (2026-11-01)

## Current issuer sources

- [Priority Banking Visa Infinite product page](https://www.sc.bank.in/credit-cards/priority-banking-visa-infinite/)
- [Current Standard Chartered credit-card tariff](https://www.sc.bank.in/credit-cards/tariffs-and-charges/)

## Evidence and record treatment

The current card-specific product page lists ATM withdrawals at INR 100 when statement outstanding is up to INR 500; INR 350 for INR 501?2,000; INR 500 for INR 2,001?4,000; INR 700 for INR 4,001?20,000; and INR 800 above INR 20,000. The current general tariff lists a cash-advance fee of 3% of the withdrawal amount, minimum INR 300. The card page links to the tariff, but neither source states whether the card-specific statement-balance tiers supersede or supplement the percentage/minimum fee.

The YAML keeps `fees.cash_advance_fee` null and records both published formulas in the notes. This avoids incorrectly choosing a general rate or conflating a statement-balance-dependent ATM charge with a transaction-percentage fee. The schema also cannot model the card-page tier schedule. No claim is made that the user would pay both charges.

Only the unresolved cash-advance pricing field was revisited; other details retain their 2026-10-25 issuer review.
