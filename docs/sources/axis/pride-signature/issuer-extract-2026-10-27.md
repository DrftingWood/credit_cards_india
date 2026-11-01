# Axis Bank Pride Signature — issuer-source comparison (2026-10-27)

## Sources reviewed

- Current [Pride Signature product page](https://www.axis.bank.in/cards/credit-card/pride-signature-credit-card), retrieved 2026-10-27.
- Axis Bank Key Fact Sheet / Schedule of Charges, updated 15 February 2026; archived locally.
- Axis Bank MITC; archived locally.
- Axis Bank domestic lounge access program; archived locally.
- Pride Signature EDGE Rewards exclusions PDF linked from the product page; archived locally.
- Axis Bank general terms revision effective 28 August 2026; archived locally.

## Field comparison

| Field area | Current issuer evidence | Dataset treatment |
| --- | --- | --- |
| Identity/network | Product page names Pride Signature and its benefits but does not identify Visa, Mastercard or RuPay. Lounge program accepts supported Axis card variants across networks; that does not establish a network for this record. | Removed the unsupported Visa value. `network` is null and `network-unverified` remains. `tier: mid` is a repository classification constrained by the schema, not an issuer-published tier; tagged `tier-unverified`. |
| Fees | Product page and current KFS/MITC: nil joining, nil first-year annual fee, ₹500 from year two, waived at ₹40,000 eligible spending in the preceding card-anniversary year. Product page excludes rent MCC 6513, wallet MCC 6540, gift cards MCC 5947 and toll/bridge MCC 4784 from waiver spending. | Structured standard fee and ₹40,000 annual waiver retained. First-year treatment and the fee-waiver exclusions are in the record notes. |
| Finance/transaction charges | Product page lists finance at 3.75% monthly (55.55% annual), cash advance 2.5% / ₹500 minimum, forex 3.5%, DCC 3.5%, rent and third-party education 1%, cumulative-cycle wallet/fuel/utility/skill-gaming fees, plus late/overlimit/payment-return charges. | Structured fees retained. Other charge categories are in notes because the schema has no dedicated fields. ₹500 late-fee boundary remains unspecified by the issuer's published slabs. |
| Rewards | Product page: 8 EDGE points per ₹200. Card-specific PDF excludes utilities, education, insurance, government institutions, wallet, rent and fuel. The 28-Aug-2026 general revision excludes gift cards and bridge/road fees/tolls from rewards. | Base earn retained. Exclusions include the card-specific categories plus current general exclusions. No fixed INR conversion value is published. |
| Domestic lounges | Current lounge program lists Pride Signature for two domestic visits per calendar quarter. Minimum ₹50,000 eligible settled spend in the prior three calendar months; newly issued card waived in issuance month and next three calendar months. Only cardholder gets complimentary entry; guests are paid. Visa/Mastercard/RuPay nominal authentication charges differ; participating lounge access is capacity-dependent. | Two visits/quarter, ₹50,000/quarter spend gate and zero complimentary guests retained. Notes specify calendar months, new-card waiver, paid guests and nominal swipe/lounges limits. |
| Dining | Product page: 15% off up to ₹500, minimum order ₹2,500, once per card per month at partner restaurants. | Structured terms retained. |
| Fuel waiver | Product page: 1% on domestic fuel transactions ₹400–₹4,000, cap ₹400 per statement cycle; fuel earns no points and surcharge GST is non-refundable. | Structured terms retained. |
| Other benefits | Product page supports zero lost-card liability from reporting, free add-on cards for listed family members over 18, personalised tricolour card and Wednesday offers. At retrieval it lists Goibibo/MakeMyTrip, Swiggy/Amazon Fresh and Tira; exact offer conditions can change. | Benefits retained and offer families named as time-sensitive. |
| Eligibility | Product page: Indian Defence personnel; primary applicant 18–70; Resident Indian or NRI; add-on over 18. Criteria are indicative and approval is discretionary. No numeric income or score threshold stated. | Age/residency and employer group retained; numerical income and score remain null. |

## Model limits and remaining uncertainty

- The record's `tier: mid` is only a schema-constrained local classification; the issuer page does not publish a tier. `tier-unverified` is added.
- Lounge visit quota and cardholder-only complimentary entry are representable, but availability depends on the current lounge roster and capacity. Network-specific swipe validation fees are not structured.
- Most transaction surcharge rules are descriptive notes because the schema does not model their category thresholds.
- Wednesday offers change; current page-listed merchants are a point-in-time snapshot.

## Review result

Cleared the unsupported Visa assertion; refreshed the product page and shared Axis references, reward exclusions and lounge evidence; confirmed the annual-fee waiver threshold and current benefits. This record-level comparison does not establish a database-wide factual accuracy percentage.
