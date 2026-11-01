# Standard Chartered Super Value Titanium — issuer evidence comparison (2026-10-27)

## Sources archived

- Current product page: <https://www.sc.bank.in/credit-cards/super-value-titanium/> — `product-page-retrieved-2026-10-27.html`.
- Current SC tariffs: <https://www.sc.bank.in/credit-cards/tariffs-and-charges/> — `tariffs-and-charges-retrieved-2026-10-27.html`.
- Linked card-specific T&Cs: <https://av.sc.com/in/content/docs/SCB-IN-Supervalue-Titanium-Terms-Condition_Ver_300819_Final.pdf> — `product-terms-retrieved-2026-10-27.pdf`.
- Current product MID: <https://av.sc.com/in/content/docs/in-supervaluetitanium-most-important-terms-and-conditions.pdf> — `most-important-document-retrieved-2026-10-27.pdf`.
- Current cashback redemption FAQ: <https://www.sc.bank.in/credit-cards/svt-manhattan-changes-faqs/> — `cashback-redemption-faq-retrieved-2026-10-27.html`.

## Field comparison and disposition

| Field | Prior record | Current evidence | Disposition |
|---|---|---|---|
| Network/tier | Visa / Platinum | Current product page says Mastercard Network; no network tier specified | Set Mastercard; clear tier |
| Launch date | 2018-01-01 | No issuer launch date found | Clear date |
| Fee/waiver | INR750/750, waiver at INR60,000 | Current product page/tariff show INR750 first year and renewals; no current waiver on main product page. A separate pre-approved application lead page claims annual waiver at INR90,000, conflicting with card product page/tariff. | Keep INR750 fees, clear general waiver, document conflicting lead page |
| Cash advance | 2.5%, minimum INR500 | Current tariff: 3%, minimum INR300 | Correct |
| Forex/finance | 3.5% / 3.75% monthly | Current tariff and card FAQ confirm 3.5% overseas transaction fee; generic SC current tariff: 3.75% monthly | Keep values |
| Cashback earn/caps | Fuel/utility/telephone each at 5%; per-transaction/statement caps partly misrepresented | Current page: Fuel transaction <= INR2,000, max INR100 per transaction and INR200 per statement cycle; telephone bill > INR750, max INR100 per transaction and INR200 per statement cycle; utility bill >= INR750, max INR100 per transaction and INR100 per statement cycle. Utilities are electricity, water and gas; utility and phone bills must use SC Billpay. Terms state an aggregate INR500 per statement cycle over all customer's SC cards, including supplementary cards. | Correct fields and explain combined cap |
| Older T&C cap conflict | — | Linked 2019 T&Cs state maximum INR200 per fuel/telecom transaction, INR100 utility transaction and total INR500 per statement cycle across cards; current page now states INR100 per transaction for all three. | Follow current product page transaction limits and state older terms conflict |
| Reward points | 1 point/INR150; catalogue ₹0.25; realized ₹0.22 | Current product page confirms 1 point/INR150 on other spend; card T&C says minimum 500 points to redeem for catalog items/vouchers/services but no fixed INR conversion. | Keep earn rate; clear fixed and realized rupee value |
| Cashback redemption | Omitted | Current FAQ effective 16-Mar-2024: minimum INR1,000, redemption multiples INR500; no maximum redemption value cap. | Add redemption constraints in notes |
| Cashback/points exclusions | Wallet, rent, insurance, EMI, MCC6513 | T&Cs exclude returns, disputed, unauthorized/fraudulent, charged-back transactions, finance charges and account fees; cash advances/loans are excluded from eligible cashback | Remove unsupported category/MCC restrictions; document exclusions |
| Fuel surcharge waiver | 1% | Card T&C says discontinued effective 21-Aug-2024; page FAQ says 25-Aug-2024, while cashback increased to 5%. | Remove waiver; record date mismatch only |
| Lounge | Null | Standard card has no lounge access. Premium Banking variants may have Priority Pass membership and conditional international visits, requiring specified relationship/spend or salary criteria. | Keep standard access null; note premium exception |
| Eligibility | Unknown age | Current page: applicant age 21–65, stable monthly income, bank sourcing cities, credit/policy checks | Add age; retain unknown income/score thresholds |

## Limitations and conflicts

- A pre-approved lead-generation page gives a different annual-fee waiver threshold (INR90,000) from the main current product page/tariff. It is not treated as a universal card waiver.
- Current product page transaction caps conflict with the linked older product T&Cs, while the overall cap INR500 is consistent. Stored per-transaction limits follow the current card page.
- Current card page/T&Cs mention both Visa and Mastercard MCC definitions; the live product page identifies Mastercard as the offered network. Visa is removed from the record.
- The MID PDF is archived but image/scanned and did not provide usable extracted text. Product page and card T&Cs supply the modeled values.
- Schema combines points and cashback under one reward record and lacks direct fields for statement-cycle aggregation across categories and account-level supplementary-card pooling. Those conditions are in notes.
- Premium Banking Priority Pass/lounge terms are conditional and variant-specific and are not modeled as standard card access.

Updated record: `data/cards/standard-chartered/super-value-titanium.yaml`.
