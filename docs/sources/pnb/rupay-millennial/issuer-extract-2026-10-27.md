# PNB RuPay Millennial issuer comparison (27 Oct 2026)

## Sources reviewed

- PNB current card page: https://creditcard.pnb.bank.in/types10.html
- PNB How to Apply eligibility guide: https://creditcard.pnb.bank.in/Documents/HowToApplyNew.pdf
- PNB Schedule of Fees: https://creditcard.pnb.bank.in/Documents/pnb_sofc.pdf
- PNB MITC: https://creditcard.pnb.bank.in/PDF/MITC.PDF
- PNB generic Rewardz page: https://creditcard.pnb.bank.in/rewards.html

## Record changes

- Removed the unsupported 2022-01-01 launch date; official sources reviewed do not provide an exact Millennial card launch date.
- Confirmed ₹399 joining fee (including add-on joining fee as listed), ₹999 annual fee, 3.5% forex markup and 2.95% monthly finance charge. Corrected cash advance fee from 3%/₹300 to 2%; minimum varies by channel: ₹150 PNB ATM, ₹200 other domestic ATM, ₹300 overseas.
- Kept ₹1 lakh annual waiver threshold but documented the period conflict: card page says previous financial year; MITC says annual waivers are calculated by calendar year. Waiver spend excludes cash withdrawals, reversals, fees and charges per MITC.
- Kept 2 points per ₹150 and card-specific ₹0.25 point value; removed unsupported realized ₹0.20 value and unverified exclusions. Generic Rewardz says ₹0.50, leaving a conflict. Redemption minimum is 1,000.
- Retained 300-point first-swipe benefit within 90 days from product page; generic Rewardz describes first retail or online transaction within 90 days. Recorded the wording discrepancy.
- Kept two domestic lounge visits per quarter and two international per year, ₹10 lakh personal accident cover. Captured health checkup, golf, spa and gym benefits; current issuer page does not detail entitlement limits or partners.
- Fuel terms from MITC: 1% on ₹500–₹4,000 RuPay fuel transactions, maximum ₹350 per statement cycle for Select and Millennial. This is more card-tier-specific than the general schedule and the generic fuel page.
- Added age 21–70 and minimum annual income ₹5 lakh from PNB's How to Apply guide. FD-backed cards may follow different age criteria; no bureau-score threshold is published.
- PNB portal announces revised service charges effective 1 November 2026; not applied before that date.

## Validation results

- `python scripts/validate.py`: 370 cards, 915 reward rules, 808 strict-scope, 800/808 strict-ready (99%), zero errors/warnings.
- `python scripts/audit_stamps.py`: zero stamp mismatches.
- `python scripts/audit_numeric_evidence.py`: fees 1,964/2,379 (83%); rewards 1,948/2,988 (65%); benefits 2,149/3,161 (68%); eligibility 770/849 (91%). These are traceability measures only, not factual-accuracy rates.
