# Standard Chartered Manhattan issuer evidence (reviewed 2026-10-27)

## Current primary issuer sources

- [Current Manhattan product page](https://www.sc.bank.in/credit-cards/manhattan-platinum/), retrieved 2026-10-27; archived as `product-page-retrieved-2026-10-27.html`.
- [Current SC tariff schedule](https://www.sc.bank.in/credit-cards/tariffs-and-charges/), retrieved 2026-10-27; archived as `tariffs-and-charges-retrieved-2026-10-27.html`.
- The product page's ?Manhattan Platinum Terms and Conditions? link currently points to [`in-rewardscard-product-terms-and-conditions.pdf`](https://av.sc.bank.in/content/docs/in-rewardscard-product-terms-and-conditions.pdf), titled ?Standard Chartered Rewards Credit Card Terms and Conditions? (dated 30-Sep-2024). Archived as `linked-terms-rewards-card-retrieved-2026-10-27.pdf` to document the mismatch. This is not treated as Manhattan card terms because its fees/reward rates conflict with the Manhattan page.

## Field comparison

| Field | Previous YAML | Current evidence / disposition |
|---|---|---|
| Network / tier | Visa / Platinum | Current product page states Visa network. It contains a contradictory ?Visa Infinite Credit Card? subheading within Card Network, likely a template error. No Manhattan network tier established; kept Visa and cleared tier. |
| Launch date | 2015-01-01 | No current primary launch date found; cleared. |
| Fees | INR999 joining/annual; INR120,000 annual waiver | Current page states INR999 + GST joining and annual fees; renewal reversed on prior-year spend greater than INR120,000. Fee data retained; stored threshold INR120,001 because schema implies >=. |
| Other fee terms | 3.5% forex, 3.75% monthly interest, 2.5% cash advance/min INR500 | Current tariff page confirms 3.5% overseas transaction fee, 3.75% monthly interest and ATM cash advance fee 3%, minimum INR300. Corrected cash advance. |
| Joining reward | Missing | Current product page states 5,000 Reward Points on payment of joining fees; added. |
| Base points | 3 points/INR150 | Current product page says 3x points on all other expenses; value chart specifies 3 points per INR150. Kept. Value chart implies INR0.25 per point; removed prior unsupported realized INR0.22 value. |
| Supermarket cashback | 5%, existing record said subject to caps but encoded unlimited | Current page states 5% cashback on supermarkets and value chart includes grocery, supermarkets and departmental stores. Chart assumes INR150,000 annual spend and reports INR6,000 annual cashback; this implies (but does not explicitly state) INR500/month. Stored INR500/month as a medium-confidence inference, explicitly noted in YAML. Minimum transaction and per-transaction cap not stated on current page and not encoded. |
| Linked terms mismatch | N/A | The T&C linked from Manhattan page is for the different Standard Chartered Rewards card. That PDF says no joining fee, 4 base points/INR150 and a fuel waiver, all inconsistent with Manhattan page's INR999 joining fee and 3 points/INR150. It was not used to populate Manhattan terms. |
| Lounge / fuel surcharge waiver | no lounge; 1% fuel waiver | Current Manhattan page does not list lounge or fuel-waiver benefits. Removed unsupported fuel waiver; no lounge quota encoded. The mismatched linked PDF's Mastercard lounge and 1% fuel terms belong to its Rewards card and were excluded. |
| Eligibility | age/income/score unknown | Current product page: age 18-65, stable monthly income, sourcing city/location requirement, subject to credit policy. No numeric income/score threshold. |

## Open issues

- Obtain correct Manhattan-specific T&Cs to verify supermarket cashback cap, transaction minimum, exclusions, redemption conditions and whether page has a current Visa-tier label.
- The INR500 monthly cashback cap is inferred from the issuer value chart, not directly stated. It remains explicitly medium confidence in the data.
- No issuer launch date or numerical income/credit-score cutoff found.
