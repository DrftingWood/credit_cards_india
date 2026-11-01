# KVB Honour issuer comparison — 2026-10-27

## Sources reviewed and archived

- Current KVB [Honour product page](https://www.kvb.bank.in/personal/cards/kvb-credit-cards/kvb-credit-card/kvb-honour-credit-card/), captured as `product-page-2026-10-27.html`.
- Current KVB [reward-points redemption page](https://www.kvb.bank.in/reward-points-redemption/), captured as `rewards-redemption-2026-10-27.html`.
- Current available retail [MITC, version 2.0 dated 4-Mar-2025](https://www.kvb.bank.in/docs/retail-credit-card-mitc.pdf), archived as `retail-credit-card-mitc-2025-03-04.pdf`.
- KVB's [premium portfolio launch announcement dated 29-May-2026](https://www.kvb.bank.in/docs/press-release-kvb-elevates-premium-banking-experience-with-visa-credit-card-portfolio.pdf), archived as `premium-portfolio-launch-2026-05-29.pdf`. It lists Aura, Samara, Altura and Eternis, not Honour, so it does not substantiate Honour's launch date.

## Corrections made

- Removed unsupported 2022-01-01 launch date. Retained Visa network and Visa Signature tier: current card-specific Honour page describes the product and the available retail MITC provides a Signature category; exact product-to-tier mapping is not stated directly in a single current card-specific table.
- Corrected standard joining fee to NIL, annual fee INR999, annual fee waiver at INR300,000 previous-year retail spend, monthly finance charge 3.25%, cash withdrawal charge 2% or INR300 (whichever higher), forex markup 3.5%. Current card page and March-2025 MITC agree on the Signature fee and rate schedule.
- Corrected base earn to 3 points per INR150. Current page says 2x points on restaurants, medical, books, insurance, rail tickets, movie tickets and car rentals; encoded as 6 points per INR150 as the schema's multiplier representation. The page's headline also says 4x on domestic/international travel, hotels and air tickets; encoded as 12 per INR150, with the underspecified issuer method noted.
- Removed unsupported rupee conversion values and unsupported exclusions/MCC 6513. KVB's generic redemption page describes channels, not a point conversion value. Card page specifies INR99 per redemption request, minimum 2,000 points on first redemption then 250 for subsequent requests, and lapse every three years or if MAD remains unpaid more than 60 days.
- Replaced aggregator-derived 2 lounge accesses per quarter with the issuer's current statement of four complimentary domestic visits. The issuer does not say whether that is annual, quarterly or another period; cadence and guest access are left unknown.
- Corrected fuel waiver to 1% for single transactions from INR500 to INR4,000, capped at INR200 per billing cycle.
- Added 700 activation bonus reward points. Rupee value is not published.
- Cleared unsupported numeric applicant age/income/score and India residency claims.

## Unresolved details

1. The product page advertises “4x” travel/hotel/air rewards but does not publish its calculation or eligible MCCs. The value is retained as a multiplier representation at medium confidence.
2. Product page advertises four domestic lounge visits without cadence, spend gate or guest rules.
3. No current issuer value-per-point is disclosed; redemption fee/minimums and lapse terms are published.
4. Honour-to-Visa-Signature mapping follows the current retail Signature fee schedule and issuer's Honour references in Visa offer material; the card page itself does not label the tier in its feature text.
5. No exact launch date or numerical underwriting/residency requirement was found.

This review follows the [UK Government Data Quality Framework](https://www.gov.uk/government/publications/the-government-data-quality-framework/the-government-data-quality-framework): structural validity and provenance coverage do not prove factual accuracy.
