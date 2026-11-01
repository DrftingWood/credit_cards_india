# Samsung Axis Bank Signature issuer evidence extract (2026-10-26)

## Current product page and card terms

Sources: [Axis product page](https://www.axis.bank.in/cards/credit-card/samsung-axis-bank-signature-credit-card), retrieved 2026-10-26; current [Samsung Signature card terms](https://www.axis.bank.in/docs/default-source/default-document-library/credit-cards/tnc-for-samsung-signature.pdf?sfvrsn=c7d860d1_7).

- Visa Signature variant; Axis and Samsung launch announcement is dated 2022-09-26.
- Joining fee INR500; annual fee INR500 from year two, waived when annual spend is greater than INR200,000 in the preceding card anniversary year.
- Finance charge 3.75% per month; cash advance fee 2.5%, minimum INR500; forex markup 3.5%. Current DCC is 3.5% under the issuer update effective 2026-08-28.
- Base EDGE earn: 5 points per INR100 on other domestic/international spend. Preferred merchants earn 10 points per INR100: BigBasket, Tata 1mg, Urban Company, Myntra and Zomato. Identification uses merchant IDs supplied to Axis; no numeric accelerator cap is published.
- EDGE point face value INR0.20 is supported by issuer value chart (2,500 welcome points shown as INR500). No realized value estimate is asserted. EDGE redemption fee is INR99/transaction; transfer to a partner loyalty program costs INR199/transaction.
- Welcome offer: 2,500 EDGE points after three transactions of any value within 30 days of issuance; points may take 60 days to post and the benefit is once per Axis cardholder.
- Samsung cashback: 10% on eligible Samsung product/service purchases, capped at INR2,500/month and INR10,000/year from issuance. Eligible channels include Samsung eStore/Shop App, specified physical retail terminal transactions and authorized service centers. Flipkart excluded from 2024-12-20; Amazon excluded from 2026-01-01. Cashback may take 60 days and is reversed on returns.
- Lounge access: four domestic visits per calendar year; Axis lounge program requires at least INR50,000 eligible spend in the previous three calendar months.
- Fuel surcharge waiver: 1%, capped at INR500/statement. The detailed page says eligible fuel transactions INR400–INR4,000, while a summary heading says INR400–INR5,000. GST on surcharge is not refunded; fuel earns no cashback.
- EMI conversion is available for purchases of INR2,500 or more.
- Eligibility: primary cardholder age 18–70 and resident in India. Specific income and bureau-score cutoffs are not stated.

## Exclusions and remaining uncertainties

Current card terms exclude EDGE earning on fuel, wallet loads, gold/jewellery, government, education, telecom/utilities, rent, insurance, financial institutions, cash advances/repayments, Samsung purchases, non-Samsung EMI, fees/charges, gift cards, and bridge/road/toll spend. No exact numeric MCC list is published, although the terms call them MCC exclusions; the record therefore leaves `mcc_exclusions` empty and encodes the documented categories.

The fee-waiver language says spends “greater than” INR200,000; the structured threshold stores INR200,000 and the notes preserve the strict wording. The product page summary gives an inconsistent fuel maximum (INR5,000 vs INR4,000 in the detailed section). Dynamic portfolio dining and Wednesday offers are omitted as evergreen benefits.

## Archived sources

- `tnc-for-samsung-signature-retrieved-2026-10-26.pdf`
- `tnc-for-samsung-signature.pdf` (older retained copy)
- `../_shared/axis-bank-airport-lounge-access-program-retrieved-2026-10-26.pdf`
- `../_shared/mitc-credit-cards-retrieved-2026-10-26.pdf`
- `../lic-platinum/axis-credit-card-terms-update-effective-2026-08-28.pdf`
- [Issuer launch announcement dated 2022-09-26](https://www.axis.bank.in/about-us/press-releases/samsung-india-axis-bank-launch-co-branded-credit-card-powered-by-visa-now-get-10-cashback-on-samsung-products-services)
