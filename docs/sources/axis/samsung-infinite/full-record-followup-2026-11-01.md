# Samsung Axis Bank Infinite full-record follow-up (2026-11-01)

This follow-up audits the full card record against current issuer material. The initial same-day extract covered the application pause and Samsung cashback campaign only; the remaining record fields are reconciled here.

## Official evidence

- Current Samsung Infinite product page, opened 1-Nov-2026: https://www.axis.bank.in/cards/credit-card/samsung-axis-bank-infinite-credit-card
- Card-specific Samsung cashback and EDGE Rewards T&C: https://www.axisbank.com/docs/default-source/default-document-library/credit-cards/tnc-for-samsung-infinite.pdf (local copy in this folder)
- Card-linked Priority Pass membership terms: local `priority-pass-membership-on-samsung.pdf`
- Current Axis MITC and Schedule of Charges: https://www.axisbank.com/docs/default-source/default-document-library/mitc-credit-cards.pdf (local copy under `../_shared/`)
- The product page says its card terms changed effective 28-Aug-2026, but the linked campaign PDF could not be fetched (HTTP 403); current page and currently retrievable card-specific campaign terms are used, with that limit retained.

## Corrections from current issuer evidence

- **Finance charge:** the current Infinite product page states 3.75% per month (55.55% p.a.). The older MITC excerpt in the prior record stated 3.0%; changed the data to the current product-page rate.
- **Annual fee waiver:** the live page requires annual spends greater than INR 7,00,000 in the preceding card anniversary year. The record now preserves the strict `greater than` condition; exactly INR 7,00,000 does not meet it.
- **Domestic lounges:** current page states eight visits per calendar year, gated by INR 50,000 eligible spend in the previous three months from 1-May-2024. Added the threshold. The data model's `quarterly` cycle is only an approximation of the issuer's previous-three-month window.
- **International lounges:** current product page says six complimentary visits per year. The linked card-specific Priority Pass terms say six complimentary visits plus an additional six visits per year, automatically renewed for active Infinite cardholders. The record retains twelve based on the detailed linked terms but explicitly flags this unresolved page/PDF mismatch.
- **Rewards:** current product page confirms 5 EDGE points/INR 100 on other domestic spend and 15/INR 100 for preferred partners and international transactions. It lists 10% Samsung cashback capped at INR 5,000/month and INR 20,000/year; card-specific campaign T&C include Amazon and exclude Flipkart from 20-Dec-2024. Card T&C also exclude Samsung purchases/services from EDGE rewards; those purchases qualify for the separate Samsung cashback. Rental payments are excluded from reward earn, but MCC 6513 is explicitly identified only for rent transaction fees/annual-waiver spend, so the reward MCC code was removed rather than inferred.
- **Point value and redemption charge:** the product value chart implies INR 0.20 per EDGE point. The current card fee table lists INR 99 for EDGE redemption, while the reviewed MITC lists Infinite among cards with redemption-fee waiver. Kept the nominal unit value at INR 0.20 and cleared realized value pending resolution of this issuer conflict; removed the unsupported INR 0.18 estimate.
- **Eligibility:** current product page states resident Indian, age 18–70. Numeric income and credit-score floors are not published. Set age range and retained other thresholds as null.
- **Other benefits:** current page confirms INR 400–5,000 fuel transaction range and INR 500 statement cap, one-year EazyDiner Prime membership if activated within 30 days, and 30,000 welcome points after three transactions within 30 days. Concierge is not established, so the boolean was cleared to null. Priority Pass' USD 99 stated membership value is not converted to INR.

## Remaining uncertainties

New applications are currently not accepted; `on-hold` is retained. The current product page conflicts with the linked Priority Pass PDF on the international quota and with the MITC on EDGE redemption charges. The linked 28-Aug-2026 terms file is inaccessible to retrieval. Current issuer materials reviewed do not explicitly establish the network or network tier, so both fields and the unsupported exact launch date remain null. Numeric income and credit-score floors and guest access remain unpublished or unverified.
