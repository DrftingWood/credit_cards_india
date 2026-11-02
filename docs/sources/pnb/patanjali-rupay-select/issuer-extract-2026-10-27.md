# PNB Patanjali RuPay Select issuer comparison (27 Oct 2026)

## Sources reviewed

- PNB current card page: https://creditcard.pnb.bank.in/types11.html
- PNB generic RuPay fuel waiver page: https://creditcard.pnb.bank.in/privileges6.html
- PNB Schedule of Fees: https://creditcard.pnb.bank.in/Documents/pnb_sofc.pdf
- PNB generic Rewardz page: https://creditcard.pnb.bank.in/rewards.html
- NPCI launch release, dated 31 January 2022: https://www.npci.org.in/PDF/npci/press-releases/2022/NPCI-Press-Release-PNB-launches-co-branded-contactless-credit-cards-with-Patanjali-in-partnership-with-RuPay.pdf

## Record changes

- Corrected launch date to 2022-01-31 from NPCI's release.
- Current fees: ₹500 joining, ₹750 annual, waived for at least one use each quarter in the preceding year; PNB computes waivers by calendar year. Finance charge is 2.95% monthly, forex markup 3.5%, cash advance fee 2%. Cash-advance minimum varies: ₹150 PNB ATM, ₹200 other domestic ATM, ₹300 overseas; schema stores the PNB ATM minimum.
- Base earn is 2 points per ₹150. Kept card page point valuation ₹0.25 but removed unsupported realized value and reward exclusions. Generic Rewardz says ₹0.50, leaving a source conflict. The page states redemption minimum 1,000.
- Removed a malformed modeled accelerator which asserted a ₹250 monthly cap. Current card page states 2% Patanjali cashback on transactions above ₹2,500, maximum ₹50 per transaction at authorized stores/website; now recorded as a described card benefit, retaining the exact issuer wording.
- Welcome points are published as 300+ on first usage. Retained ₹10 lakh accidental death/permanent total disability cover and 2 domestic/quarter plus 2 international/year lounges. Captured health checkup, golf, spa and gym perks; current conditions/availability are not detailed on the product page.
- Fuel waiver is 1% on ₹400–₹4,000 transactions, up to ₹350 per statement cycle in the Schedule of Fees. Generic RuPay Select fuel page says ₹500–₹4,000 and does not state the cap; the discrepancy is documented.
- Added published annual income criterion of ₹5 lakh. PNB does not separate thresholds by employment type; the general threshold is copied to both schema categories.
- PNB portal announces revised service charges effective 1 November 2026; they are not applied before that date.

## Validation

Validation is rerun after updating the card. Evidence-path coverage is traceability only and does not itself establish factual accuracy.
