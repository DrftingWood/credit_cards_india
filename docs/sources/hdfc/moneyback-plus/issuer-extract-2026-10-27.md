# HDFC Bank MoneyBack+ Credit Card — issuer comparison (27 Oct 2026)

## Sources checked and archived

- HDFC's current [product page](https://www.hdfc.bank.in/credit-cards/moneyback-plus-credit-card), [fees page](https://www.hdfc.bank.in/credit-cards/moneyback-plus-credit-card/fees-and-charges), and [eligibility page](https://www.hdfc.bank.in/credit-cards/moneyback-plus-credit-card/eligibility), retrieved 27-Oct-2026.
- Current card-specific terms published 15-May-2026 (`MBPlus-TnCs.pdf`), current FAQ dated 25-Sep-2025, current HDFC personal MITC, May-2026 card changes notice, and the older fees schedule.
- HDFC press release dated 29-Sep-2021 announcing the MoneyBack+ relaunch is archived. It establishes a relaunch, not the first launch date.
- Validation method follows the [UK Government Data Quality Framework](https://www.gov.uk/government/publications/the-government-data-quality-framework/the-data-quality-framework), separating factual accuracy from validity, completeness, consistency, and timeliness. This is review guidance, not issuer evidence.

## Corrections and current terms

- Cleared `launched_on`: HDFC's dated release confirms a 2021 relaunch, while the originally asserted 1-Jul-2020 date was unsupported. Cleared `network` and `network_tier` because the reviewed MoneyBack+ sources do not establish one current network variant/tier; the current card terms describe distinct RuPay UPI treatment, implying network-specific variants.
- Current fees: INR 500 joining/renewal, renewal waiver at INR 50,000 annual spend, forex 3.5%, finance 3.75% monthly per HDFC personal MITC, and cash-advance fee 2.5% or INR 500 minimum. The MoneyBack+ fees-page FAQ says 3.6% but labels it “MoneyBack” without “Plus”; this is retained as a page-label conflict. HDFC's May-2026 notice sets DCC markup at 1.75% and non-metal reissue at INR 199; no dedicated schema fields exist. Fees page publishes no effective date, so the row uses the audit date as a snapshot anchor.
- Current base reward: 2 CashPoints per INR 200 on eligible other spend. Eligible non-EMI transactions at Amazon, BigBasket, Flipkart, Reliance Smart SuperStore and Swiggy earn 20 CashPoints per INR 200, capped at 2,500 points per calendar month. Merchant TID/MID and settlement determine eligibility; spend beyond the cap does not post points. Statement-cycle overall points cap is 15,000; grocery is separately capped at 1,000 points/month, with interaction against the partner cap not described.
- Fuel, rent, government, cash advances, fees, wallet/gift/prepaid-card/voucher transactions and all EMI transactions do not earn under the current terms. Wallet MCC 6540 is excluded. Direct school/college website or POS education payments earn; third-party education apps do not. For RuPay variants, eligible UPI earns 2 points per INR 200 with a 500-point monthly cap; the schema cannot express this conditional network-specific rule cleanly.
- Current terms say CashPoints can be worth up to INR 0.25 through statement/catalogue/SmartBuy redemption; current product page states INR 0.20 for cashback and up to INR 0.25 for catalogue/travel, and 0.25 AirMiles per point. Statement redemption requires 2,000 points (INR 500 equivalent), charges INR 50, and the May-2026 T&C caps monthly cashback redemption at 50,000 points. Product page still says 3,000/month; the newer linked T&C is modeled and the conflict preserved. Catalogue redemption costs INR 99 plus taxes, can cover up to 70% of selected product/voucher value; travel covers up to 50% of booking value and 50,000 points/month. Points expire after two years.
- Quarterly milestone: INR 50,000 net spend per calendar quarter earns one INR 500 Gyftr voucher. EMI principal counts toward the milestone; SmartEMI/Dial-an-EMI does not. HDFC sends the message within 60 working days, and the claim window is 120 days. Welcome and renewal award 500 points when the respective membership fee is paid. Fuel waiver is 1% on INR 400–5,000 fuel transactions, up to INR 250 per statement cycle.
- Eligibility: current product page says Indian nationals, salaried age 21–60 with net monthly income > INR 20,000, and self-employed age 21–65 with ITR > INR 6 lakh. The dedicated eligibility page says gross monthly income > INR 20,000 for salaried applicants. Kept the product-page net threshold and documented the discrepancy. The bank does not publish a product-specific minimum score. Residency status is unspecified and remains null.

## Unresolved facts and modeling limits

- The current product page still lists 3,000 points as the cashback redemption monthly cap, versus 50,000 in the latest linked card T&C. The database follows the specific May-2026 terms and retains the web-page conflict.
- HDFC gives different salaried income wording across product and eligibility pages (net versus gross). The lower threshold amount is the same; the metric basis is not.
- A specific page FAQ says 3.6% monthly finance while calling the card “MoneyBack”; personal MITC gives 3.75%. The MITC value is modeled, with the page text documented.
- HDFC sources reviewed do not settle the original launch date or identify one exclusive current network/tier; both remain unknown. Effective date for current fees is also unpublished.
- INR 100 `value_inr` for the 500-point welcome/renewal benefit reflects the current product page's INR 0.20 statement-cashback rate. Other redemption routes can yield up to INR 0.25/point, so value depends on redemption choice.

## Accuracy boundary

This is one record-level issuer comparison. Structural validation, provenance metadata, and numeric evidence-path coverage do not establish factual accuracy across the full card library.
