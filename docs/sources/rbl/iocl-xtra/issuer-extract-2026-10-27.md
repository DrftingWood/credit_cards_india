# RBL IndianOil XTRA issuer comparison (27 Oct 2026)

## Sources reviewed

- RBL current IndianOil XTRA page: https://www.rbl.bank.in/personal-banking/cards/credit-cards/indianoil-rbl-bank-xtra-credit-card
- RBL XTRA product terms: https://webassets.rbl.bank.in/document/credit-cards/tnc-indianoil-rbl-bank-extra-credit-card.pdf
- RBL IndianOil card FAQ (covers XTRA variant): https://webassets.rbl.bank.in/document/credit-cards/indianoil-rbl-bank-credit-card-faqs.pdf
- RBL MITC/KFS: https://webassets.rbl.bank.in/document/Credit%20Cards/RBL-MITC-final.pdf
- RBL current Rewardz terms: https://rblrewards.rbl.bank.in/tnc

## Record changes

- Removed the unsupported 2023-01-01 launch date; exact product launch date was not established in current issuer sources.
- Current fee remains ₹1,500 + GST, with waiver at ₹2.75 lakh eligible annual spends; add-on fee ₹200. Forex markup 3.5%, cash advance fee 2.5%/₹500 minimum. Finance rate depends on bureau category (3.35%, 3.85% or 3.99% monthly); schema stores the maximum and notes the actual customer-specific rate.
- Confirmed 2 Fuel Points/₹100 on other eligible spend, 15 points/₹100 at eligible IndianOil stations, capped at 2,000 accelerated points monthly. Point redemption value is ₹0.50 for XTRA Rewards redeemable at IndianOil stations, not general statement credit.
- Updated exclusions to current issuer-listed categories, normalized to schema values; exact exclusions remain listed in source notes.
- Confirmed 3,000 Fuel Points on a transaction above ₹500 within 30 days, 1,000 points on ₹75,000 spend per calendar quarter, and fuel-surcharge refund of up to ₹200/month on ₹500–₹4,000 fuel transactions.
- Added general eligibility age 21–70, subject to bank internal policy; income and credit-score thresholds are not published in the reviewed card FAQ.
- Recorded RBL MITC exception for RuPay offline UPI transactions below ₹2,000 at small merchants: product benefits do not accrue under the general MITC rule.

## Validation results

- `python scripts/validate.py`: 370 cards, 915 reward rules, 808 strict-scope, 800/808 strict-ready (99%), zero errors/warnings.
- `python scripts/audit_stamps.py`: zero mismatches.
- `python scripts/audit_numeric_evidence.py`: fees 1,977/2,379 (83%); rewards 1,958/2,986 (66%); benefits 2,167/3,158 (69%); eligibility 772/851 (91%). These are traceability measures only, not factual-accuracy rates.
