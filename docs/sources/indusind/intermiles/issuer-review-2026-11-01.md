# IndusInd InterMiles variants: issuer review (2026-11-01)

Reviewed the four issuer reference pages, the bank's customer migration FAQ, current important updates, and card-specific reward tables: Odyssey Amex, Odyssey Visa, Voyage Amex and Voyage Visa.

## Status and migration

- The bank's Important Updates page says the InterMiles co-brand relationship concluded effective August 2024 for all four named variants. The card pages now state the products are discontinued for new sourcing and existing cards and remain online only for reference.
- The migration FAQ says upgraded cards were to be issued in August/September 2024; each old card remained usable until 90 days after that customer's transfer or the old card's expiry, whichever came first, and use of the new card deactivated the old one. The issuer therefore does not supply one universal existing-account closure date. `2025-01-21` is the end date for InterMiles reward redemption, not a universal card-discontinuation date.
- Pre-upgrade InterMiles were transferred to the member's InterMiles account. Miles earned in statement cycles after upgrade were transferred to the replacement card as reward points of similar value. InterMiles redemption on IndusInd cards ended effective 21-Jan-2025.

## Issuer-published earn tables

| Variant | Other weekday / weekend | Flights and hotels booked via InterMiles weekday / weekend | Annual cap |
|---|---:|---:|---:|
| Odyssey Amex | 4 / 6 per INR 100 | 8 / 12 per INR 100 | 75,000; uncapping fee INR 10,000 + GST |
| Odyssey Visa | 3 / 4 per INR 100 | 6 / 8 per INR 100 | 75,000; uncapping fee INR 10,000 + GST |
| Voyage Amex | 3 / 4 per INR 100 | 6 / 8 per INR 100 | 50,000; uncapping fee INR 7,500 + GST |
| Voyage Visa | 2 / 3 per INR 100 | 4 / 6 per INR 100 | 50,000; uncapping fee INR 7,500 + GST |

Weekend transactions are those dated Saturday or Sunday. The portal rates are for the named flight/hotel booking channels; they are not general travel spend. Current archived pages list welcome/renewal miles and historic travel/movie/lounge/insurance offers, but do not establish that these benefits continued after account-specific migration.

## Record corrections and limits

- Cleared the 1-Jan-2021 launch dates: the reviewed issuer pages and migration sources do not substantiate that exact date.
- Set `discontinued_on` to 24-Aug-2024, the issuer-stated conclusion of the co-brand relationship. Account-level old-card disablement varied with transfer and expiry; 21-Jan-2025 is the InterMiles redemption cutoff, not a universal card closure date. Status remains `discontinued`.
- Set point INR valuations to unknown; the reviewed issuer sources provide no current fixed cash-equivalent value, and InterMiles redemption ended. Removed MCC 6513 as a specific reward exclusion because issuer evidence reviewed here does not tie that code to the category exclusions.
- Existing historical fee/benefit terms and structured weekday earn remain as legacy data. Weekend rates are added to notes because the schema cannot encode day-of-week tiers. `effective_from` values of 1-Jan-2021 are dataset baseline dates and were not confirmed as issuer-published start dates.

## Primary issuer sources

- [Odyssey Amex](https://www.indusind.bank.in/in/en/personal/cards/credit-card/intermiles-odyssey-amex-credit-card.html)
- [Odyssey Visa](https://www.indusind.bank.in/in/en/personal/cards/credit-card/intermiles-odyssey-visa-credit-card.html)
- [Voyage Amex](https://www.indusind.bank.in/in/en/personal/cards/credit-card/intermiles-voyage-amex-credit-card.html)
- [Voyage Visa](https://www.indusind.bank.in/in/en/personal/cards/credit-card/intermiles-voyage-visa-credit-card.html)
- [IndusInd Important Updates](https://www.indusind.bank.in/in/en/personal/credit-card-related/important-updates.html)
- [Migration FAQ](https://www.indusind.bank.in/content/dam/indusind-corporate/Other/faqs-migration-legend-sq.pdf)
- [IndusInd legacy reward terms](https://www.indusind.bank.in/in/en/personal/legacy-cc-tnc.html)
