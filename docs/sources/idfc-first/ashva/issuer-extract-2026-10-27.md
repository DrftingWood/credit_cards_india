# IDFC FIRST Ashva ? issuer comparison (2026-10-27)

## Sources reviewed

Compared the [current Ashva product page](https://www.idfcfirst.bank.in/credit-card/metal-credit-card/ashva), [card launch release](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/news-media/press-release/Press-Release-IDFC-FIRST-Bank-Introduces-Ashva-Credit-Card-The-Ultimate-Metal-Card-for-the-Smart-Traveller-FINAL-Visa11thSept78.pdf), [current Ashva reward terms](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/Ashva-CC-Rewards-Structure-TnC-28-05-25-copy.pdf), joining/annual-fee offer terms, lounge/railway/golf/movie benefits, trip-cancellation policy, roadside assistance, the [2026 shared insurance schedule](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/Insurance-Privileges-Documents-24-06-24-V2.pdf), the [17-Sep-2026 zero-forex announcement](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/news-media/press-release/Press-Release-IDFC-FIRST-Bank-introduces-Zero-Forex-Markup-across-all-its-Credit-Cards-existing-and-new-1709.pdf), and the general credit-card eligibility page. PDFs and dated HTML captures are indexed in `../_manifest.json`.

## Corrections made

- Set the network tier to Visa Infinite and launch date to 19-Sep-2024 from the launch release.
- Set standard joining and annual fees to INR2,999; modeled 0% purchase forex from 17-Sep-2026. Retained the separate overseas ATM 1% markup claim from the Ashva FAQ as an unresolved conflict with the bank-wide zero-forex announcement; flat cash-advance fee is INR199 + GST per transaction.
- Corrected the reward base to 5 points per INR150 up to INR20,000 eligible spend per statement cycle and 10 points per INR150 on incremental eligible spend above that threshold. Added the 3X and 1X special-category rates and exclusions. The schema does not encode the cumulative threshold, so notes warn that the total 10X is not a blanket rate.
- Applied 2 points per INR150 for international purchases from 26-Oct-2026. The issuer page is unclear whether this category still counts toward the INR20,000 threshold.
- Refreshed airport and railway lounge quotas and next-month spend activation, golf session thresholds, District movie offer, joining-fee points, annual-fee points, insurance limits/conditions, and roadside assistance.
- Set minimum age to 21 from the general eligibility page. Residence is null because the page states Indian citizenship, not residence; no Ashva-specific income or numeric score minimum was found.

## Unresolved issuer conflicts and model limits

- Current product copy and detailed reward T&Cs disagree with the May-2026 cardmember communication on app hotel/flight booking bonuses; the detailed T&Cs also contain a conflicting flight example. Bonus rates are not modeled.
- Golf terms grant up to two rounds or lessons from spend tiers as a shared pool. The schema now permits null for separate round/lesson counts so the record does not imply two of each.
- General issuer eligibility guidance gives a minimum age and citizenship requirement, but does not publish an Ashva-specific income or numeric bureau-score threshold.

Numeric evidence-path coverage is bookkeeping for traceability; it is not a factual-accuracy percentage.
