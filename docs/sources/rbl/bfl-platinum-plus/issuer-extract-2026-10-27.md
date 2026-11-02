# RBL Bank Platinum Plus SuperCard issuer comparison (27 Oct 2026)

## Sources reviewed

- RBL Platinum Plus product page: https://www.rbl.bank.in/personal-banking/cards/credit-cards/platinum-plus-credit-card
- RBL current MITC/KFS: https://webassets.rbl.bank.in/document/Credit%20Cards/RBL-MITC-final.pdf
- RBL Platinum Plus SuperCard guide: https://webassets.rbl.bank.in/document/Credit%20Cards/platinumplusguide.pdf
- RBL SuperCard Additional Terms: https://webassets.rbl.bank.in/pdfs/CreditCard/SUPERCARD-ADDITIONAL-TERMS%20-AND-CONDITIONS.pdf
- RBL current Rewardz Terms: https://rblrewards.rbl.bank.in/tnc

## Record changes

- Removed unsubstantiated 2019-01-01 launch date; no exact launch date was found in reviewed issuer sources.
- Current annual fee is ₹999 from first year, with waiver on eligible annual spends of ₹1 lakh or more. Add-on fee is ₹200. Foreign markup is 3.5%, cash advance fee 2.5%/₹500 minimum. Current MITC interest varies by bureau category (3.35%, 3.85% or 3.99% monthly); the schema stores the upper rate and notes this limit.
- Kept 1 point per ₹100 base and 2 points per ₹100 online, corrected the online cap from unlimited to 1,000 points monthly. Removed the unsupported fixed ₹0.20 realized point value. RBL says value varies by redemption category from ₹0.11 to ₹0.25, so no single value is asserted.
- Replaced stale/unsupported reward exclusions with the current card-page category exclusions. Normalized to the schema's available categories; finer distinctions remain in source notes.
- Updated welcome offer to 4,000 points after annual fee payment and ₹2,000 spend within 30 days; first-year-free cards do not receive welcome points. Retained annual ₹1.5 lakh milestone of 10,000 points from RBL's SuperCard Additional Terms.
- Removed lounge access: the current Platinum Plus page explicitly states lounge benefits were discontinued effective 1 July 2025, despite a stale description elsewhere on that same page.
- Retained current BookMyShow 1+1 (up to ₹200, one day per month, Monday-Friday) and fuel waiver (up to ₹100/month; ₹500–₹4,000 transaction range).
- No current product-specific numeric age or income threshold was established; these remain unknown.

## Validation results

- `python scripts/validate.py`: 370 cards, 915 reward rules, 808 strict-scope, 800/808 strict-ready (99%), zero errors/warnings.
- `python scripts/audit_stamps.py`: zero mismatches.
- `python scripts/audit_numeric_evidence.py`: fees 1,970/2,379 (83%); rewards 1,952/2,986 (65%); benefits 2,159/3,158 (68%); eligibility 770/849 (91%). These are evidence-path coverage measures, not factual-accuracy rates.
