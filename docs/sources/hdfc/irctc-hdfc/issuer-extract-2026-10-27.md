# IRCTC HDFC Bank Credit Card — issuer comparison (27 Oct 2026)

## Sources checked

- HDFC current [card page](https://www.hdfc.bank.in/credit-cards/irctc-credit-card), [fees and charges](https://www.hdfc.bank.in/credit-cards/irctc-credit-card/fees-and-charges), [eligibility page](https://www.hdfc.bank.in/credit-cards/irctc-credit-card/eligibility), and [reward redemption page](https://www.hdfc.bank.in/credit-cards/irctc-credit-card/redemption), retrieved 27 Oct 2026.
- HDFC product terms linked from the live card page; downloaded copy archived as `terms-and-conditions-current-2026-10-27.pdf`. The PDF itself says updated 29 May 2025; it is byte-identical to the previously archived `terms-and-conditions.pdf` (SHA-256 `819D95F6A4A14C31745875D9F4223DB81D754C425D1BC96E46F836AF4F65CB1D`).
- HDFC [launch announcement](https://www.hdfc.bank.in/press-release/2023/q1/irctc-partners-with-hdfc-bank-to-launch-indias-most-rewarding-co-branded-travel-credit-card), dated 1 Mar 2023; archived as `launch-release-2023-03-01.pdf`.
- HDFC MITC v4.15 retrieved 27 Oct 2026, plus previously archived Oct-2025 IRCTC card terms and lounge document.

## Corrections made

- Corrected launch date to 1 Mar 2023 from the issuer's dated launch announcement. The announcement supports RuPay and a single card variant; it does not identify a RuPay Select network tier, so `network_tier` is now null.
- Rebased fee, rewards and benefit effective dates from the erroneous pre-launch 1 Aug 2022 to the documented launch date. This is a schema date anchor, not a claim that all current terms began on launch.
- Changed the milestone trigger to calendar-year. The current product terms say cards issued through 30 Sep 2025 originally had rolling 90-day windows; from 1 Jan 2026, calendar-quarter milestones apply to all customers.
- Removed the unsupported blanket EMI exclusion: merchant EMI principal earns points, while Smart EMI/Dial-an-EMI transactions and merchant EMI interest, fees and GST do not. Removed insurance from the exclusion list because issuer terms say it earns under caps.
- Kept the insurance cap at INR 2,000/month as the terms' category table specifies, but documented the same PDF's conflicting INR 2,000/day line.

## Current values checked

The live card page and card-specific terms support 5 reward points per INR 100 on IRCTC bookings, 1 point per INR 100 on other eligible retail transactions, and 5% SmartBuy cashback. Product terms cap accelerated points and SmartBuy cashback at 1,000 points / INR 1,000 monthly and 12,000 annually; additional category caps apply to grocery, insurance, UPI, utilities and telecom. The card page currently says points expire two years after earning, while the product PDF says two years after the last eligible earn/use transaction. The record retains that conflict in its capping notes.

Current redemption terms: SmartBuy train tickets only, INR 1 per point, minimum 100 points, maximum 70% of fare inclusive of service charges, and INR 99 + GST per redemption. Current card page says INR 500 welcome voucher after first transaction within 37 days, while archived Oct-2025 terms limit eligibility by issuance/LTF cohort; the record preserves the unresolved eligibility gap. Current quarterly INR 30,000 milestone offers INR 500 voucher. Lounge allowance is eight annual IRCTC Executive Lounge visits, maximum two per quarter, with INR 2 validation charge. Fuel waiver is 1% on INR 400–5,000 transactions, capped INR 250 per statement cycle. Annual fee is INR 500, waived at INR 150,000 spend before renewal.

## Conflicts and limits retained

- Main card page shows salaried income INR 12,000/month without a comparator; the dedicated eligibility page says gross monthly income greater than INR 25,000. The structured field retains the main product-page figure, and the discrepancy is in eligibility notes. Both sources list age 21–60 salaried / 21–65 self-employed; self-employed ITR is greater than INR 6 lakh. Dedicated FAQ says NRIs cannot apply and publishes no numeric credit-score floor.
- Current fee FAQ gives lost/damaged reissue fee INR 100; HDFC's general May-2026 non-metal notice states INR 199. There is no dedicated reissue-fee field, so this remains a documented unresolved fee conflict.
- Monthly versus daily insurance reward cap and the point-expiry rule differ within issuer materials as above.
- The currently linked product PDF is dated May 2025, although the live page contains later FAQs. Changes advertised by the page may not all be reflected in that PDF.

Validation methodology follows the UK Government Data Quality Framework: assess accuracy separately from validity, completeness, consistency and timeliness. This issuer comparison is one record-level review; it does not estimate dataset-wide factual accuracy.
