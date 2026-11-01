# Standard Chartered DigiSmart issuer evidence (reviewed 2026-10-27)

## Current issuer sources

- [DigiSmart product page](https://www.sc.bank.in/credit-cards/digismart-card/), retrieved 2026-10-27; archived as `product-page-retrieved-2026-10-27.html`.
- [DigiSmart Product Terms and Conditions](https://av.sc.bank.in/content/docs/in-digismart-product-terms-and-conditions.pdf), retrieved 2026-10-27; archived as `product-terms-retrieved-2026-10-27.pdf`.
- [SC Card Tariffs and Charges](https://www.sc.bank.in/credit-cards/tariffs-and-charges/), retrieved 2026-10-27; archived as `tariffs-and-charges-retrieved-2026-10-27.html`.

## Field comparison

| Field | Previous YAML | Current evidence / update |
|---|---|---|
| Network and tier | Visa / Platinum | Current product page explicitly says Visa network and does not state a Visa tier. Kept Visa; cleared unsupported Platinum tier. |
| Launch date | 2019-01-01 | No issuer launch date found; cleared. |
| Fee structure | INR49 joining; INR588 annualized | Product page and tariff page say INR49 monthly on primary and supplementary cards, not an annual price. It is reversed within 90 days when that card has INR5,000 spend in the next calendar month after fee levy. Schema lacks a monthly recurring fee field, so joining and annual values are null; amount/waiver conditions are in fee notes. |
| Forex, finance and cash advance | 3.5%; 3.75%; 2.5%, min INR500 | Current tariff page confirms 3.5% overseas fee, 3.75% monthly interest, and ATM cash advance 3%, minimum INR300. Updated cash advance. |
| Spend rewards | 1 point/INR150 and fixed INR value | DigiSmart T&C ?4 expressly says no reward points are awarded on card spends (campaigns may award points separately). Removed fabricated spend earn and redemption values; retained a zero-rate placeholder because schema requires one reward record. |
| Zomato | 10% with inconsistent benefit summary | Current card page and T&C: 10% instant discount, no minimum spend, five transactions per calendar month, maximum INR150 per transaction. |
| Blinkit | 10% and INR1,000 cap | Current card page and T&C: 10%, no minimum spend, five transactions per month, aggregate INR1,000 monthly cap. |
| Movies | BookMyShow free ticket, INR200 | Replaced with INOX BOGO on weekend shows; two transactions/calendar month, maximum discount INR200/transaction. |
| Yatra | International flight cap INR10,000 and domestic hotel cap INR4,000 were present but source text stale | Current page/T&C confirms domestic flights 20% max INR750; international flights 10% max INR10,000 with INR20,000 minimum transaction; domestic hotels 25% max INR4,000. One transaction per quarter per category. |
| Ola | 15%, max INR600/month | Current page/T&C confirms 15% cashback, joint primary/supplementary monthly cap INR600; excludes bike, auto, shared rides and NRE accounts. Processed within 60 days after transaction month. |
| Lounge/fuel | no lounge; 1% fuel waiver | Product page does not advertise lounge access or a fuel surcharge waiver; removed unsupported fuel waiver. |
| Eligibility | age/income unknown | Current card page says age 21?65, stable monthly income at least INR50,000, and applicant must be in bank card-sourcing locations; subject to credit/policy checks. Encoded annualized income as INR600,000 for schema compatibility. |

## Remaining limitations

- Schema has no monthly fee field; recurring INR49 and conditional reversal are in fee notes, with joining/annual figures null rather than misrepresented.
- The zero-rate reward record is a schema-required placeholder for a card with no spend-earned reward points.
- No numeric minimum credit score or card-specific launch date is published on the reviewed page.
