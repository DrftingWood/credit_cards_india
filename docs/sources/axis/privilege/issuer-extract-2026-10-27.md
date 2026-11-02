# Axis Bank Privilege Credit Card — issuer-source comparison (2026-10-27)

## Sources reviewed

- Current [Privilege Credit Card page](https://www.axis.bank.in/cards/credit-card/privilege-credit-card-with-unlimited-benefits).
- Axis Bank Key Fact Sheet/Schedule of Charges (updated 15-Feb-2026) and MITC, archived locally.
- Privilege-specific terms revision effective 28-Aug-2026; archived locally.
- Privilege-specific terms revision effective 20-Jun-2025 (reward, fee-waiver, milestone, lounge and movie revisions); archived locally.
- Axis current domestic lounge program, card-linked older Mastercard lounge program, activation and milestone terms, insurance terms, and Amex-network offer PDF; archived locally.

## Field-by-field comparison

| Field area | Issuer evidence | Record treatment |
| --- | --- | --- |
| Network/tier | Current product page publishes an Amex-network limited-period free-fee offer and has a separate “Amex Privilege specific offers” section. Standard Axis lounge-program terms define eligible card platforms as Visa, Mastercard or RuPay and list Privilege for 2 quarterly visits. No current source assigns one network or a single network tier to all Privilege cards. | Cleared unsupported Visa and Signature network-tier assertions; `network` and `network_tier` are null. Network-unverified tags retained. The card record combines network-specific variants and their applicable terms are not always identical. |
| Fees | Current KFS lists standard joining ₹1,500 (waived for Priority Account holders), annual ₹1,500, waiver at ₹5 lakh eligible preceding-year spend, and 55.55% annual interest. Current product page advertises a limited-period ₹0 joining/renewal offer on the Amex network. | Structured standard joining/annual ₹1,500 and annual waiver retained. Priority joining-fee waiver and Amex limited-period fee offer are explicit notes. |
| Charges | Current product page and 28-Aug-2026 revision support 3.75% monthly finance, 2.5% cash advance with ₹500 minimum, 3.5% forex, 3.5% DCC (revision effective 28-Aug-2026), late fee slabs, overlimit, returned-payment, rent/wallet/fuel/education/utility/gaming charges and waived EDGE redemption not stated as free (page says “Yes”). | Structured fee values retained; other category charges remain in notes because the schema lacks dedicated fields. Exact ₹500 late-fee boundary is unpublished. |
| Base rewards | Current page: 10 EDGE points per ₹200. It expressly excludes insurance, rent, fuel, education, utilities, government MCCs, wallet, gold/jewellery, gift cards, bridge fees, road fees and tolls. 2025 revision identifies Utility & Telecom as category-based exclusion and adds gold/jewellery. 2026 notice confirms gift cards and bridge/road/toll exclusions. EMI-converted transactions have points debited and not restored if cancelled. | Base rate retained; added explicit telecom exclusion. Other categories, gift-card/toll exclusions, and EMI treatment retained. No universal redemption value asserted. |
| Annual-fee waiver | ₹5 lakh anniversary-year threshold. Current page excludes Utility & Telecom, Rent, Wallet, Government services, Insurance, Gold & Jewellery, Fuel, Education, Gift Card, Bridge Fees, Road Fees and Tolls. | ₹5 lakh structured threshold retained; full exclusions remain in notes. |
| Milestone | Current page: 10,000 points worth ₹2,000 after ₹2.5 lakh in card-anniversary-year spend. Linked milestone T&Cs apply to Privilege, count primary/add-on spend, and exclude Utility & Telecom, Rent, Wallet, Government, Insurance, Gold & Jewellery, Fuel, Education, Gift Card, Bridge Fees, Road Fees and Tolls. | Benefit now records milestone eligibility and exclusions as well as points/value. |
| Domestic lounge | Current general Axis lounge program lists Privilege (Set A) for two domestic visits per quarter, ₹50,000 eligible spend in previous three calendar months, with a new-card issuance waiver for issue month plus next three months. Only cardholder receives complimentary entry; accompanying guests are paid. The product-linked Mastercard-specific program PDF says validity only through 31-Aug-2025. General current program supports Visa/Mastercard/RuPay, not Amex. | Quota and spend gate retained and source refreshed. No single network/provider is encoded; notes explain expired linked variant PDF and variant uncertainty. |
| Movies | Current page: District BOGO, second ticket 100% off up to ₹250, once per month. 28-Aug-2026 revision adds ₹25,000 eligible spend in preceding three months effective 1-Nov-2026, account-level settled/billed spend; new-card waiver issue month plus next three calendar months; refunds/reversals/fees excluded and EMI count only as billed installment. | Benefit retained with future-effective spend gate documented. |
| Welcome | Current product page and activation PDF: 12,500 points redeemable against ₹2,500 vouchers after full joining fee is levied and first transaction within 30 days; Priority, free and first-year-free cards excluded. PDF says points may take up to 10 working days to post and customer receives welcome benefit once across Axis card products. | Core eligibility and variant exceptions retained. |
| Fuel waiver | Current product page: 1% on fuel MCC transactions ₹400–₹4,000, maximum ₹400 per statement cycle; no points on fuel, surcharge GST non-refundable. | Structured terms retained. |
| Other benefits | Product page lists purchase protection/credit shield ₹1 lakh, lost travel documents USD 300, delayed baggage USD 300, lost baggage USD 500; Wednesday offers change; Dining Delights has no card-specific discount/cap on this page. Amex campaign PDF contains network-specific merchant offers with mixed validity dates and is not treated as an evergreen card benefit. | Protection values and unquantified dining/deal claims retained. Limited-period Amex campaign material is archived and identified as variant-specific/time-sensitive. |
| Eligibility | Current product page: primary age 18–70, Indian resident; add-on cardholders over 18. Criteria indicative; bank may approve or decline. No numeric income or bureau-score threshold published. | Existing fields retained. |

## Remaining uncertainty and modeling limits

- There are standard Visa/Mastercard/RuPay program terms and a distinct Amex offer variant. No single network is asserted for a record that covers the product variants together; Amex lounge eligibility/route is not established by the standard lounge program.
- The product-linked Mastercard lounge PDF is expired; current general Axis lounge-program PDF lists Privilege and gives current quota/spend-gate terms for listed platform cards.
- Current product page and KFS/MITC vary by Priority account status and Amex campaign. The structured fee fields show standard published fees; exceptions are recorded in notes.
- Several fees and spend exclusions remain free-text because the schema does not structure every charge or category gate.
- Wednesday and Amex merchant offers are time-sensitive and may change or expire.

## Review result

Removed the unsupported Visa and Signature network-tier assignments, added the current reward-category exclusions, restored the current lounge source/quota/spend gate, and documented the per-network, Priority and campaign exceptions. Validator and source-stamp audit should be rerun after the record change. This record review does not establish database-wide factual accuracy.
