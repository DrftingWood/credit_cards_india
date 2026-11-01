# Axis IndianOil Credit Card issuer extract (reviewed 2026-10-26)

Primary source: [current IndianOil Axis Bank product page](https://www.axis.bank.in/cards/credit-card/indianoil-axis-bank-credit-card).

Archived issuer sources in this folder:

- `terms-and-conditions-for-iocl-credit-card-retrieved-2026-10-26.pdf` (current card-specific T&C linked from product page)
- `indianoil-terms-update-effective-2026-08-28.pdf` (card-specific revision notice)
- `indianoil-activation-benefit-terms.pdf`
- `bookmyshow-offer-terms-retrieved-2026-10-26.pdf`
- `iocl-fuel-outlet-list-retrieved-2026-10-26.pdf`
- `indianoil-reward-exclusions-update-effective-2025-06-20.pdf`
- `indianoil-axis-co-brand-launch-2019-12-17.pdf`

## Current terms encoded

- The current product page says ₹500 joining fee, first-year annual fee nil, ₹500 annual fee from year two, and spend-based annual-fee waiver after more than ₹3.5 lakh eligible spend during the card anniversary year. Card-specific T&C state ₹500 joining and annual fees plus a waiver at ₹3.5 lakh. Rent and wallet spends are excluded from the fee-waiver calculation.
- Base earning: 1 EDGE Reward Point per ₹100 eligible retail spend.
- IndianOil fuel: 20 points per ₹100, on up to ₹5,000 eligible fuel spend per calendar month (1,000-point cap). Product page requires ₹400–₹4,000 settlement; eligibility depends on issuer recognition of the outlet/transaction. Card-specific T&C state fuel spend over the monthly cap earns no rewards; base points do not backstop capped fuel.
- Online: 5 points per ₹100; per-transaction range ₹100–₹5,000; up to ₹5,000 eligible spend / 250 accelerated points per calendar month.
- Reward exclusions are category-based per the 2025-06-20 revision, not a reliable static MCC list. Current T&C additionally list gift cards and bridge/road fees/tolls. The product page and 2025 change notice identify insurance, gold/jewellery, wallet, rent, utilities/telecom, government, education, financial institutions, cash advances and repayments as excluded categories.
- Welcome offer: up to 1,250 points (₹250 equivalent), 100% value-back on the first eligible fuel transaction within 30 days; primary card only. The current activation T&C exclude migrated, swapped and replacement cards unless Axis communicates otherwise.
- Fuel surcharge waiver: 1% for eligible IndianOil fuel purchases with ₹400–₹4,000 settlement; max ₹50. GST on surcharge is not refunded.
- BookMyShow: 10%, maximum ₹100 per card per month. The August 2026 revision makes ₹25,000 eligible settled spend in the previous three months a condition from 2026-11-01. Newly issued cards get the issue month and next three calendar months exempt from the spend gate. The previously linked detailed BMS PDF says the offer expired 2025-03-31, while the product page still advertises the offer. Therefore the current offer mechanics through 2026-10-31 are not fully supported by a valid detailed offer PDF.
- Current fees on the product page include 3.75% monthly finance rate, 2.5% cash advance fee (minimum ₹500), 3.5% foreign currency markup, and ₹99 per EDGE Rewards platform redemption. The 2026-08-28 notice raises DCC markup from 1.5% to 3.5%, updates the late-payment fee at ₹50,000+ balance to ₹1,300, and adds reward exclusions for gift cards and bridge/road fees/tolls.
- Eligibility: primary applicant 18–70; add-on applicant over 15; resident Indian or NRI. Card-specific income and bureau-score thresholds are not published on the accessed page.
- No lounge access is advertised on the current card page. Dynamic Wednesday and Dining Delights offers have no stable, card-specific cash value in the page reviewed.
- The 2019-12-17 release is the original co-brand announcement; a [2022-06-07 issuer release](https://www.axis.bank.in/about-us/press-releases/axis-bank-and-indian-oil-launch-co-branded-rupay-contactless-credit-card) announces the RuPay card variant. This record identifies the RuPay variant. Network tier remains unknown.

## Source conflicts and limitations

1. **Fuel-waiver cycle:** current product page says ₹50 per statement cycle, while linked card-specific T&C say ₹50 per calendar cycle. The YAML captures the ₹50 amount and transaction range but flags the cycle ambiguity.
2. **Movie offer:** current page advertises 10% off without a cap/eligibility gate; the old linked detailed T&C expired March 2025; the Aug-2026 revision states ₹100 monthly cap and a future ₹25,000 spend condition effective Nov 1, 2026. The YAML records the scheduled condition and flags the pre-November mechanics as unverified.
3. **Fee schedule:** product page says first-year annual fee NIL, whereas card-specific T&C give a standard ₹500 annual fee subject to spend waiver. Record retains ₹500 standard fee and discloses the page's first-year promotion.
4. **Redemption value:** no single point-to-rupee value is asserted. Redemption channels have different conversions; the current public materials accessed do not establish a universal value for the standard IndianOil Axis card.
5. **Issuance variant:** the official RuPay launch release establishes a RuPay product, but does not rule out other card network variants across existing accounts. This YAML represents the RuPay variant and keeps network tier unknown.

This is a field comparison for this card, not a dataset-wide accuracy estimate or regulatory compliance review.
