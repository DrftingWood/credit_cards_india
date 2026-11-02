# Flipkart Axis Bank Credit Card: issuer comparison (27 Oct 2026)

## Sources reviewed

- Current Axis product page: <https://www.axis.bank.in/cards/credit-card/flipkart-axisbank-credit-card>
- Current cashback terms, PDF version `b55a0e1a_5`: <https://www.axis.bank.in/docs/default-source/default-document-library/cashback-tncs---final.pdf?sfvrsn=b55a0e1a_5>
- Axis card terms effective 20 Jun 2025, local copy: `docs/sources/axis/flipkart/terms-and-conditions-flipkart-axis-bank-credit-card.pdf`.
- Preferred-partner PDF, visually reviewed: `docs/sources/axis/flipkart/flipkart-axis-bank-credit-card-preferred-merchants.pdf`.
- Axis/Flipkart launch announcement (11 Jul 2019): <https://www.axis.bank.in/docs/default-source/default-document-library/press-release/2019/july/flipkart-axis-bank-launch-co-branded-credit-card-powered-by-mastercard.pdf>.

## Field reconciliation

| Area | Database value/review | Issuer evidence and limits |
| --- | --- | --- |
| Launch, network | Launch date set to 11 Jul 2019, the official launch announcement; current network/tier cleared to unknown | Launch release says powered by Mastercard and cards were initially available to select users in July. This establishes historic launch network, not necessarily the network currently issued to all applicants. Product page gives no current network/tier. |
| Fees | Current displayed nil joining fee is a limited-period offer; annual fee INR 500 from year two | Product page states fee waived only for annual spend **greater than INR 350,000**, excluding rent MCC 6513 and wallet loads MCC 6540. Spend is measured by posting date; issuer advises meeting target 3 working days before card anniversary. Offer duration and eligibility for nil joining fee are not stated in the page text. |
| Charges | 3.75% monthly finance; cash advance 2.5%, min INR 500; FX 3.5%; DCC 3.5% | Product page. Other service/transaction fees are listed there; the card schema does not represent every thresholded service fee. |
| Cashback | Myntra 7.5%; Flipkart 5%; Cleartrip 5%, each capped at INR 4,000 per statement quarter per merchant; preferred merchants 4% unlimited; other eligible merchants 1% unlimited | Current cashback T&C. Quarter is based on individual card statement date. Cashback eligibility uses partner merchant IDs; unmatched IDs may require partner confirmation. Flipkart cashback excludes Flipkart Health. |
| Preferred merchants | Cult.fit, PVR, Swiggy and Uber | Verified from the current local issuer PDF by visual inspection. Issuer says merchant list can change. Swiggy 4% accelerator is for Food Delivery in the Swiggy app; Instamart and Genie do not qualify. |
| Reward exclusions and adjustments | Removed `other` from exclusions; retained schema-supported exclusions and categories in source notes | Cashback T&C excludes utility/telecom, education, rent, wallet loads, government services, insurance, gold/jewellery, fuel, financial institutions, cash advances, repayments, fees/charges, gift cards on Flipkart/Myntra, EMI and post-facto EMI. Same-cycle refunds and EMI conversions reduce cashback; later reversals debit it. Surplus handling and merchant-separated caps are detailed in the PDF. |
| Cashback posting | Retained statement-credit redemption | Earned cashback is credited shortly before the following statement. T&C describes MID confirmation and transaction adjustment timing; the schema cannot represent all surplus rollover/write-off mechanics. |
| Welcome benefits | INR 250 Flipkart voucher for qualifying paid cards after first non-cash transaction within 30 days; Swiggy offer for first-time users | Current product page. First-year-free cards are not eligible for the voucher; Swiggy welcome offer applies to both paid and first-year-free cards. Offers remain subject to current offer terms. |
| Fuel waiver | 1%, transaction INR 400-4,000, up to INR 400 per statement cycle | Current product page; GST on the fuel surcharge is not reversed, and fuel does not earn cashback. |
| Eligibility | Age 18-70, resident Indian; numeric income/score unknown | Current product page calls criteria indicative and reserves approval to the bank. |

## Model and evidence limits

- The official launch release establishes Mastercard at launch; current product materials reviewed do not establish current network or tier, so these fields are null.
- Preferred-partner membership is volatile and acceleration is MID-based. The dataset stores the current list but cannot guarantee a transaction will receive the accelerated rate.
- A statement quarter is card-statement-specific; the schema's quarterly cap cycle does not encode each account's individual statement boundary.
- The schema cannot fully represent cashback surplus handling, future EMI conversion adjustments, all statement credit timing, or threshold-based service fees.
- Nil joining fee is advertised as a limited-period offer without a displayed end date or full eligibility details; the value is a current offer snapshot.

## Validation result

Removed an exclusion that contradicted the stated 1% cashback on other eligible merchants; refreshed fee-waiver conditions and eligibility, source references, and source verification dates; confirmed the preferred-partner list visually; and cleared unsupported current network/tier values. These changes match currently available public issuer materials, but do not establish personalized legacy-account pricing or a dataset-wide factual-accuracy percentage.
