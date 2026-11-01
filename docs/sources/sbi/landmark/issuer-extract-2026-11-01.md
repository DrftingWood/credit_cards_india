# Landmark SBI Card — issuer source review (2026-11-01)

## Sources compared

- [Current Landmark SBI Card product page](https://www.sbicard.com/en/personal/credit-cards/landmark-sbi-card.html)
- [Landmark SBI Card booklet](https://www.sbicard.com/sbi-card-en/assets/media/images/personal/credit-cards/value-savings/landmark/landmark-product-page/landmark-tncs/Landmark-SBI-Card-Booklet.pdf), issuer T&C clauses 11.4–11.5
- [Current SBI Cardholder Agreement](https://www.sbicard.com/en/cardholder-agreement.page)
- [Current SBI MITC](https://www.sbicard.com/en/most-important-terms-and-conditions.page)
- [Current SBI domestic lounge list](https://www.sbicard.com/en/personal/benefits/airport-lounge-access.page)
- [SBI Card issuance policy](https://www.sbicard.com/sbi-card-en/assets/docs/pdf/who-we-are/notices/policy-for-the-issuance-and-conduct-of-credit-cards-2023.pdf)

## Verified and corrected

- Fees: INR 499 joining/annual/renewal plus taxes, no published fee-waiver threshold; current MITC and product page agree. Forex markup 3.5%, monthly finance charge up to 3.75%, and cash advance 2.5% or INR 500, whichever is higher.
- Earn: 10 points/INR 100 at named online/retail Landmark stores; 5/INR 100 dining, movies and international; 1/INR 100 other retail. The product page additionally names fuel, rent, government, gaming, wallet and EMI exclusions. Removed the overly broad `other` exclusion mapping and unsubstantiated insurance-premium exclusion from the structured list; gaming remains in notes because it has no dedicated schema enum.
- Redemption: closed-loop Landmark Rewards only; 4 SBI points = INR 1 and 1 Landmark Reward = INR 0.60. INR 99 + GST applies below 1,000-point transfers. There is no published statement-credit conversion for this product.
- Cap: the current SBI agreement states a 7,500-point monthly cap for cumulative 5X PRIME categories (dining, movies, departmental stores and grocery) and says the cap applies to corresponding co-brand variants. Applied the cap to the 5-point dining/movie tier, which is 5X of the base rate; after the cap, base points continue. International is not in the named cap category list. Landmark stores earn 10X, and neither the card booklet nor generic cap text explicitly resolves that separate tier; its cap is left unmodeled and the uncertainty is stated in the record.
- Welcome/milestone: 2,000 points on annual fee payment; 8,000 points at INR 2 lakh annual retail spend. Point-to-rupee value on the product page is INR 0.25 per point.
- Lounge: the current SBI lounge page lists Landmark SELECT and PRIME, not the standard Landmark card. No complimentary standard-card lounge quota is published; lounge access remains null.
- Fuel waiver: 1% on INR 500–3,000 transactions, maximum INR 100/statement cycle.
- Eligibility: issuer policy states salaried ages 21–65 and self-employed ages 25–70. No card-specific income minimum or fixed score cutoff was found. Removed aggregator-derived INR 3 lakh income claim.
- SBI's current general policy states points expire after 24 months.

## Remaining source limits

The product page says its information is subject to change, and the card booklet does not date every reward rule. The 7,500 cap mapping to the standard card's 5X dining/movie categories follows SBI's co-brand extension language; Landmark-specific application of a cap to the 10X store rate is unresolved. Exact merchant MCC matching and any fixed income/score underwriting threshold are unpublished.
