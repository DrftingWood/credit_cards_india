# AU Bank Altura Plus issuer comparison — 2026-10-27

Compared `data/cards/au/altura-plus.yaml` with AU's current [Altura Plus product page](https://www.au.bank.in/personal-banking/credit-cards/altura-plus-credit-card), [Key Fact Statement v1.9 dated 30 Sep 2026](https://www.au.bank.in/pdf/credit-card/Schedule-of-Charges-CC.pdf), [MITC v2.22 dated 30 Sep 2026](https://www.au.bank.in/credit-cards/mitc%28with-schedule-of-charges%29.pdf), [Card Member Agreement dated 16 May 2026](https://www.au.bank.in/pdf/credit-card/credit-card-member-agreement.pdf), and AU's [credit-card rewards FAQ](https://www.au.bank.in/personal-banking/credit-cards).

## Verified and recorded

- **Fees:** KFS v1.9 gives Altura Plus joining/annual fee as INR 499 excluding GST, foreign currency markup 3.49%, retail-card revolving interest 3.75% monthly, cash advance fee 2.5% or INR 500 minimum, and late charge 15% of total due with INR 10 minimum/INR 1,300 maximum. The product page gives the first-year waiver at INR 20,000 retail spend within 90 days and renewal waiver at INR 80,000 retail spend in the previous card anniversary year. The late-charge formula is retained in notes because the current schema cannot model it.
- **Rewards:** Product page says 2 points per INR 100 on online transactions and 1 point per INR 100 on utilities/telecom and insurance. Base earn scope is now only utilities, telecom and insurance; this prevents online spend from receiving an unintended additive base point. Utility/telecom is capped at 100 points per transaction. Cash, rent, education/government, EMI, fuel, BBPS and quasi-cash are ineligible; transportation MCC accrual ceased 1 Apr 2026. The schema cannot encode BBPS/quasi-cash as exclusion categories, so those restrictions remain explicit in notes.
- **Offline rewards:** The product page advertises 1.5% offline cashback up to an issuer maximum, then 1 point per INR 100 POS retail spend. The numeric maximum and precise transition behavior are not published in the evidence reviewed, so offline cashback and post-cap POS points remain unscored.
- **Reward cap/redemption:** Card Member Agreement dated 16 May 2026 sets 25,000 points per statement cycle and the utility/telecom cap. It states expiry two years after accrual, INR 99 + GST per successful redemption, and utility/telecom earn of 1 point per INR 100 up to 100 per transaction. AU's reward FAQ states catalogue value 0.25 paise/point and e-voucher value 0.20 paise/point; the data retains the 200-point minimum from that FAQ.
- **Benefits:** Product page confirms 500 bonus points on INR 20,000 retail spend in a calendar month and 8 complimentary railway lounge visits per year. Fuel surcharge waiver is 1% on INR 400–5,000 fuel transactions, capped at INR 100 per statement cycle from 1 Oct 2026.
- **Eligibility:** Product page lists salaried age 21–60, self-employed age 25–65, and resident Indian. It does not publish numeric income or credit-score cutoffs.

## Corrections and evidence limits

- Removed unsupported `launched_on: 2022-01-01`.
- Cleared `network: rupay`, `network_tier: platinum`, and the RuPay tag: current card-specific page and current card-wide documents reviewed do not identify a single network or tier. The page's generic RuPay FAQ is not evidence that this product is exclusively RuPay.
- Corrected reward base scope so online 2 points/INR 100 is not accidentally modeled as 2 accelerated points plus 1 base point. Removed the unsupported wallet-load exclusion.
- Corrected reward expiry from “two years from statement month” to two years after accrual, as stated in the current member agreement.
- Earlier KFS/MITC copies and the product-page headline showed a INR 150 fuel waiver cap. The current KFS v1.9 lists INR 100 for Altura Plus, and the card-specific page carries the dated INR 100 effective-1-Oct-2026 footnote; the old value is superseded.
- Device protection and card liability cover are advertised, but their coverage amounts, exclusions, and claim conditions were not established in this field review. The offline cashback cap/reset rules are also unpublished.
- `effective_from` is the comparison date where no issuer effective date was published; it does not assert historical commencement. Network, launch date, income floor, and score floor remain unknown rather than inferred.

## Validation

The record was marked verified on 2026-10-27 after field comparison. Repository validation, verification-stamp audit, and numeric evidence-path audit were rerun after the edit; their outputs are recorded in the current database overview/checklist.
