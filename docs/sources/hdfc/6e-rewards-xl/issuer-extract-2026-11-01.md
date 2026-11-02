# 6E Rewards XL IndiGo HDFC Bank Credit Card — issuer review (2026-11-01)

## Sources compared

- HDFC [6E Rewards XL card page](https://www.hdfc.bank.in/credit-cards/6e-rewards-xl-indigo-credit-card)
- HDFC card-specific [fees and charges / KFS](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/6e-rewards-xl-indigo-credit-card/fees-and-charges/pdf/fees-and-charges.pdf), v2.3 Nov-2024
- HDFC [migration FAQ](https://v.hdfc.bank.in/content/dam/hdfc-aem-microsites/htdocs/common/pdf/Migration_FAQ_08_08_25.pdf)
- HDFC later shared MITC (Dec-2025)

## Verified and corrected

- HDFC states card benefits ended by 31-Oct-2025 or earlier upon migration; unused 6E Rewards converted 1:1 to IndiGo BluChips on 1-Nov-2025. BluChip value is dynamic.
- HDFC card page and XL fee page confirm INR 1,500 joining/renewal, 2.5% forex, INR 99 + tax redemption fee, 2% on grocery/dining/entertainment, 1% on other spends, 8 domestic lounge visits/year and 1 6E Reward = INR 1 in the historic program.
- Card-specific KFS confirms no annual fee waiver spend threshold and no fuel surcharge waiver in v2.3 (Nov-2024); removed the unsupported INR 4 lakh annual waiver and INR 250 fuel waiver from the record.
- Card-specific KFS states a 3.75% monthly finance charge. HDFC's issuer eligibility page lists salaried age 21–60/monthly income INR 120,000 and self-employed age 21–65/annual ITR above INR 1,440,000. YAML stores one combined age range.
- Corrected the welcome ticket voucher from INR 3,000 to INR 1,500 and recorded the separate 6E Prime add-on. Updated the historical redemption value while distinguishing migrated BluChips.
- HDFC MITC caps XL grocery points at 2,000/month, utilities at 2,000/month, telecom at 2,000/month, and insurance at 2,000/day; it excludes rent, wallet loads, EMI and government transactions.

## Open or conflicting items

- Later HDFC shared MITC (Dec-2025) lists a fuel surcharge waiver up to INR 500 for XL, while the card-specific Nov-2024 KFS says none and the product page says XL card benefits ended by 31-Oct-2025. The historical period/transition is not resolved; the structured fuel-waiver field is removed.
- Product page does not publish a grocery-category cap in its marketing summary; detailed card-specific KFS does. Dining/entertainment-specific cap and exact MCC/category definitions remain unclear.
- INR 1 lakh quarterly milestone points and welcome-trigger conditions remain in the YAML from prior material but are not confirmed in the current accessible card page; the card-specific terms link has been replaced by a fees document, so these details need historic booklet confirmation.
- No card-specific numeric IndiGo-flight earn rate or international lounge entitlement was established from accessible issuer evidence.
- This is a historical discontinued-card record, not verification of the replacement product for migrated customers.