# Axis Bank RuPay Credit Card ? issuer source review (2026-11-01)

## Sources compared

- [Current Axis RuPay landing page](https://www.axis.bank.in/cards/credit-card/rupay-credit-card)
- [Axis Bank MITC](https://www.axis.bank.in/mitnc), locally archived as `../_shared/mitc-credit-cards-retrieved-2026-10-26.pdf`
- [Axis Bank terms revision effective 28-Aug-2026](https://www.axis.bank.in/cards/credit-card/rupay-credit-card), locally archived as `../lic-platinum/axis-credit-card-terms-update-effective-2026-08-28.pdf`

## Verified scope and fee clarification

This dataset record represents Axis's generic RuPay application/marketing page, not one fee-bearing card SKU. The issuer directs applicants to choose an underlying RuPay card. Fees, rewards, lounge access and eligibility vary by that selected card, so the wrapper keeps card-specific joining/annual fees, reward schedule, lounge access and numeric eligibility unknown. Current issuer page lists generic cash advance at 2.5% or INR 500 minimum, 3.5% foreign-currency markup for non-DCC international transactions, and a separate DCC charge.

The Axis issuer revision effective 28-Aug-2026 states DCC markup rises from 1.5% to 3.5%. The generic landing page still displays the old 1.5% DCC figure. The YAML therefore distinguishes the 3.5% non-DCC forex markup from the separate 3.5% DCC markup in its notes; the schema has no separate DCC fee field. These are separate charges and the forex field is not being used to represent DCC.

UPI linking is available for eligible Axis RuPay cards and supports only RuPay-permitted person-to-merchant transactions; selected card rewards remain variant-specific. No single common UPI earn rate is claimed.
