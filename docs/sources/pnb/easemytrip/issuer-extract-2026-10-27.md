# PNB EaseMyTrip issuer comparison (27 Oct 2026)

## Primary sources reviewed

- PNB EMT card-specific product page: https://creditcard.pnb.bank.in/EMT.html
- PNB current Schedule of Fees and Charges: https://creditcard.pnb.bank.in/Documents/pnb_sofc.pdf
- PNB MITC: https://creditcard.pnb.bank.in/PDF/MITC.PDF
- PNB generic Rewardz page: https://creditcard.pnb.bank.in/rewards.html
- EaseMyTrip launch release, dated 4 March 2024: https://www.easemytrip.com/investor-pdf/2023/emt-PNB-Collaborate-to-Introduce-PNB-EMT-Co-branded-Credit-Card.pdf

## Record changes

- Set launch date to 2024-03-04 from the EaseMyTrip release.
- Updated fee provenance and clarified waiver terms. The EMT page lists ₹2,000 joining and annual fees and waiver when prior-year annual spend is more than ₹1 lakh. PNB MITC states waivers are calculated by calendar year and excludes cash withdrawals, reversals, fees and charges from qualifying spend.
- Corrected foreign markup to 3.5% (retained), monthly finance charge to 2.95% (retained), and cash advance fee to 2%. The published minimums vary by channel: ₹100 at PNB ATMs, ₹150 at other domestic ATMs, and ₹250 overseas. The schema stores the PNB ATM minimum and this limitation is noted on the record.
- Kept 1 point per ₹100 and the EMT-specific page's ₹0.25 point value; removed unverified realized value and exclusions. PNB's generic Rewardz page says ₹0.50 per point, so value remains a documented issuer-source conflict with medium confidence.
- Kept the ₹3,000 welcome voucher and separated the 300-point bonus condition: first retail or online transaction within 90 days, as stated on the generic RuPay Platinum Rewardz terms. Removed unsupported allocation of voucher value among travel categories.
- Retained two domestic lounge visits per quarter and two international visits per year from the EMT page.
- Updated fuel waiver to 1% on ₹400–₹4,000 transactions with a ₹350 cap per statement cycle per the current Schedule of Fees. PNB's generic fuel waiver page lists ₹500 as the lower bound for RuPay Platinum; the mismatch remains unresolved and is noted on the record.
- Added card-specific EaseMyTrip flight, hotel and bus discounts, including monthly transaction cap.
- Added PNB's published ₹2.50 lakh annual income requirement. The issuer does not segment it by occupation; the schema's salaried and self-employed values both copy this general threshold, documented as such.
- PNB's portal announces revised service charges effective 1 November 2026. This review is dated 27 October; future charges were not applied.

## Validation outcome

- `python scripts/validate.py`: 370 cards, 916 reward rules, 809 strict-scope, 801/809 strict-ready (99%), zero errors and warnings.
- `python scripts/audit_stamps.py`: zero records where last verification is later than the newest nested source retrieval date.
- Numeric evidence paths after this review: fees 1,951/2,379 (82%); rewards 1,938/2,991 (65%); benefits 2,131/3,161 (67%); eligibility 766/845 (91%). These are traceability measures, not factual accuracy.

## Remaining uncertainty

- EMT-specific point realization: ₹0.25 on the card page versus ₹0.50 on generic Rewardz page.
- Fuel waiver lower transaction boundary: ₹400 in current schedule versus ₹500 on the generic Platinum fuel page.
- Cash advance minimum varies by ATM channel; the schema only stores one minimum.
- The page states an income criterion but does not publish age or bureau-score cutoffs.
