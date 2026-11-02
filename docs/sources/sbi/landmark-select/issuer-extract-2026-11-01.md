# Landmark Rewards SBI Card SELECT ? issuer source review (2026-11-01)

## Sources compared

- [Current Landmark SELECT product page](https://www.sbicard.com/en/personal/credit-cards/landmark-sbi-card-select.html)
- [Landmark SELECT cardholder booklet](https://www.sbicard.com/sbi-card-en/assets/media/images/personal/credit-cards/value-savings/landmark/landmark-product-page/landmark-tncs/Landmark-SBI-Card-Select-Booklet.pdf), locally archived under `../_shared/`
- [Current SBI Cardholder Agreement](https://www.sbicard.com/en/cardholder-agreement.page)
- [Current SBI MITC](https://www.sbicard.com/en/most-important-terms-and-conditions.page)
- [SBI lounge access page](https://www.sbicard.com/en/personal/benefits/airport-lounge-access.page) and [January 2026 lounge revision](https://www.sbicard.com/sbi-card-en/assets/docs/pdf/loungebenefits.pdf)
- [SBI KFS (May 2026)](https://www.sbicard.com/sbi-card-en/assets/docs/pdf/kfs/key-fact-statement.pdf)
- [SBI credit-card issuance policy](https://www.sbicard.com/sbi-card-en/assets/docs/pdf/who-we-are/notices/policy-for-the-issuance-and-conduct-of-credit-cards-2023.pdf)

## Verified details and modeling

- The current issuer product page and fee terms support the INR 1,499 annual fee, welcome points, annual-spend milestone, fuel waiver and product features recorded in `data/cards/sbi/landmark-select.yaml`.
- SELECT booklet clauses 11.4?11.5 specify 15 points/INR 100 at named Landmark stores (Lifestyle, Home Centre, Max, Spar, Baby Shop and EasyBuy), 10/INR 100 on dining, movies and international spends, and 2/INR 100 on other retail. Conversion is 4 points = INR 1; redemption is through Landmark Rewards, where one Landmark reward is INR 0.60. Redemption below 1,000 points costs INR 99 plus GST.
- SBI's current Cardholder Agreement states a 7,500-point monthly cap for cumulative 5X dining, movie, departmental-store and grocery points on PRIME and extends caps to corresponding co-brand variants. The 10-point dining/movie SELECT tier is modeled with this monthly cap; the 2-point base continues. The distinct 15-point (7.5X) Landmark-store rate is not clearly addressed by the 5X wording. Its cap is left unresolved; no uncapped claim is made.
- SBI's current lounge page places SELECT in Set A. The January 2026 notice reduces annual quotas for certain named cards; SELECT is not among them. The record therefore retains eight domestic visits/year, maximum two per quarter.
- Fuel waiver is recorded as 1% on INR 500?3,000 transactions, capped at INR 100 per statement cycle. SBI issuance policy gives age ranges of 21?65 for salaried applicants and 25?70 for self-employed applicants. No fixed card-specific income or credit-score cutoff is published.

## Source limitations

The SBI product page's dynamically rendered benefit text was not fully extractable during this review. Its cited current details remain represented in the card record; the separate booklet and current general SBI terms support the reward mechanics, cap context, lounge participation, fees and policy details. SBI does not explicitly resolve the cap on the SELECT 7.5X Landmark-store tier.
