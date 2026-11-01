# KVB Dhanam / Platinum current issuer review (27 Oct 2026)

## Product identity

The current KVB retail card catalogue lists KVB Platinum Credit Card and no product named Dhanam. The record ID `kvb-dhanam` is retained for dataset compatibility, but the record's display name and product URL now identify the issuer-listed KVB Platinum card. This name mapping is inferred from the existing card source path and matching stored 2 points/₹150 rate; the bank does not explicitly say that “Dhanam” was renamed Platinum. Treat legacy name/product identity as a residual uncertainty.

## Sources checked

- [Current KVB Platinum product page](https://www.kvb.bank.in/personal/cards/kvb-credit-cards/kvb-credit-card/kvb-platinum-credit-card/): fee and waiver, points, fuel surcharge waiver, activation points, redemption fee and conditions.
- [KVB Interest Rates & Charges Quick Glance](https://www.kvb.bank.in/interest-rates-charges-quick-glance/): retail Platinum interest and cash withdrawal charges.
- [KVB MITC, English](https://www.kvb.bank.in/docs/mitc-english.pdf): fee schedule and first-year waiver language.
- [KVB reward-points redemption](https://www.kvb.bank.in/reward-points-redemption/): available redemption channels; current page does not provide a point-to-INR rate.

## Changes applied

- Corrected display name to KVB Platinum Credit Card and cleared exact launch date. Current issuer says nil joining fee, ₹599 annual fee, first-year fee waived in MITC, annual waiver tied to prior-year retail spends above ₹1,00,000 on product page. Forex 3.5%, finance 3.25% monthly, cash withdrawal 2% or ₹300 whichever higher.
- Retained base earn at 2 points/₹150 and modelled 2x travel/hotel/air-ticket as 4 points/₹150 and 1.5x on restaurants, medical, books, insurance, rail, movies and car rentals as 3 points/₹150. Removed unsupported ₹0.25/₹0.20 point values, fuel/rent/wallet/EMI exclusions and MCC 6513.
- Added current product page redemption details: ₹99 fee/request, 2,000-point first redemption minimum, 250 subsequent minimum. No INR value or redemption rate was asserted.
- Corrected fuel waiver from ₹100/month and unsupported transaction ambiguity to 1% on single transactions ₹500–₹4,000, capped at ₹200 per billing cycle.
- Added 500 activation Reward Points. No current published product-specific age, income or score criteria found.

## Residual uncertainty

- The current KVB page does not explicitly map the legacy “Dhanam” name to the currently listed KVB Platinum card, although the stored rate and official product data align.
- Card page and MITC differ in how they phrase annual fee waiver: the product page refers to previous-year retail spends above ₹1 lakh, while MITC says the first-year annual fee is waived and describes a ₹1 lakh spend condition for later years. The record retains both conditions in fee notes.
- The source page publishes accelerated multipliers but does not give exact separate raw point arithmetic; effective rates are calculated by applying those multipliers to the stated 2 points/₹150 base.
- Current INR value per Reward Point remains unpublished in the reviewed current issuer sources.

