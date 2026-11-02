# Axis Bank FreeCharge Plus Credit Card: issuer comparison (27 Oct 2026)

## Sources reviewed

- Current Axis product page: <https://www.axis.bank.in/cards/credit-card/axis-bank-freecharge-plus-credit-card>
- Current cashback terms, PDF version `b270fe86_2`: <https://www.axis.bank.in/docs/default-source/default-document-library/cashback-tandc.pdf?sfvrsn=b270fe86_2>
- Axis general card-terms revision effective 28 Aug 2026: <https://campaign.axis.bank.in/generic/terms-and-conditions-generic-all.pdf>
- Axis card-specific rewards/exclusion revision effective 20 Jun 2025 (local archive): `docs/sources/axis/freecharge-plus/terms-and-conditions-axis-bank-freecharge-plus-credit-card.pdf`.
- Archived current cashback terms: `docs/sources/axis/freecharge-plus/cashback-terms-2026-10-27.pdf`.

## Field reconciliation

| Area | Database value/review | Issuer evidence and limits |
| --- | --- | --- |
| Status and network | Invite-only active card; network/tier cleared to null | Current product page says eligible customers see an offer banner in Freecharge. It does not identify the payment network or tier. No exact launch date found. |
| Fees | INR 350 joining; first-year annual fee nil; INR 350 annual renewal from year two; waiver after INR 50,000 spend in preceding card-anniversary year | Rent and wallet-load transactions do not count toward fee waiver. Current product page; no contradictory fee terms found. |
| Charges | Finance 3.75% monthly; cash advance 2.5%, min INR 500; forex 3.5%; DCC 3.5% | Product page plus general Axis terms effective 28 Aug 2026. The page also lists service fees for rent, wallet, fuel, education, utility and online gaming transactions; thresholds/fee schedule are preserved as notes because the card model has no dedicated fields for each. |
| Cashback | 5% on Freecharge on-deck purchases; 2% local commute; 1% other eligible spend | Current card-specific cashback PDF. Freecharge accelerator applies only to purchases through Freecharge app/on-deck merchant IDs. Local commute MCCs are 4121, 4131, 4111 and 7512. “Other” is an earn category and has been removed from exclusions. |
| Exclusions | Wallet load, fuel, cash withdrawal, gold/jewellery, government, insurance, education, gift cards, EMI/post-facto EMI, rent, repayments and fees; utility payments are excluded outside Freecharge | Card T&C and cashback PDF. Axis generic terms effective Aug 2026 also exclude bridge fees, road fees and tolls. Category exclusions are not all represented as individual MCC codes. |
| Cashback handling | No published per-cycle cap; transaction minimum INR 100; rounds down per transaction | Credited by the 8th of the month after statement generation. Same-period refunds and later reversals reduce/reverse cashback; EMI transactions do not earn cashback. Unredeemed cashback can be forfeited on card closure/conversion or delinquency. |
| Welcome | INR 700 vouchers only for cards issued before 4 Jan 2023 | Current issuer page says the voucher offer is not applicable to cards issued on or after 4 Jan 2023. The card is invite-only; no current general welcome voucher is advertised. |
| Other benefits | Current Wednesday Delight and Dining Delights program entries retained with offer terms/discount amount unknown | Current page lists up to 15% on MakeMyTrip flights/hotels, 10% off Swiggy, and 10% off Tira up to INR 1,000; offers have their own terms. Dining discounts depend on program/participating restaurants. |
| Eligibility | Invite-only; numeric age, income, credit score and residency thresholds unknown | Current product page provides no such numeric/person criteria. Eligibility is surfaced to customers in the Freecharge app. |

## Model and evidence limits

- The Freecharge 5% accelerator depends on Freecharge app on-deck MIDs; it is not a blanket rate for any card payment or wallet load. The schema does not represent partner MID assignment.
- Utilities can earn 1% when paid through Freecharge but not outside the app; this channel-specific exception is documented in notes rather than modeled as a channel rule.
- Product materials state cashback by category without a cycle cap; settlement and reversal timing depend on the issuer's statement cycle.
- The schema does not encode each separately thresholded service fee shown on the product page.
- No current primary issuer source reviewed confirms RuPay/Platinum, exact launch date, or numerical eligibility cutoffs; those remain unknown.

## Validation result

Cleared unsupported network/tier claims, removed the contradictory `other` exclusion, refreshed issuer source references/dates, and reconciled fees, cashback terms, exclusions and current listed offers. Current issuer materials do not provide a dataset-wide accuracy percentage.
