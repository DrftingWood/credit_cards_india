# Kotak Cashback+ Prime ? issuer evidence extract (27 Oct 2026)

Reviewed the current [product page](https://www.kotak.bank.in/en/personal-banking/cards/credit-cards/kotak-cashback-plus-prime-credit-card.html), card-specific [Cashback+ Prime terms](https://www.kotak.bank.in/content/dam/Kotak/files/t-and-c-cb-plus-prime.pdf), and current [KFS](https://www.kotak.bank.in/content/dam/Kotak/files/key-fact-statement/kfs-cashback-plus-prime-credit-card.pdf). Archived two PDFs and the product-page HTML in this directory. The KFS is version KCB+PKFS04062026.

## Confirmed and corrected claims

- Fees: ?750 joining and annual, plus applicable GST; annual fee waiver after ?200,000 retail spend per annum. Forex markup and DCC are 3.50%. Finance charge is 3.75% monthly (45% APR). Cash advance facility is unavailable, so the former percentage/minimum cash-advance fee was removed.
- KFS transaction fees: 1% fuel fee on cumulative fuel spend above ?25,000 per statement cycle; 1% education fee for all education paid through third-party apps; 1% utility fee above ?35,000/cycle; 1% wallet loading above ?10,000/cycle; 1% rent fee per transaction; and 1% skill-based gaming fee above ?10,000/cycle. GST applies to fees and charges.
- Earn: 5% on eligible online food/grocery delivery and entertainment MCCs, 5% on auto-dealer MCCs and 3% on eligible fuel MCCs. All accelerated categories share a cap of 750 reward points per billing cycle; accelerated spend earns zero after the cap. Some fuel MCCs are expressly 0%.
- Other eligible spend earns uncapped 0.5%. Insurance MCC 6300 earns 0.5% only on the first ?25,000 insurance spend per billing cycle. The current product page explicitly lists a RuPay variant with uncapped 0.5% UPI earn on eligible UPI credit-card spend, including accelerated categories, subject to exclusions. Network is therefore left unspecified for this aggregate card record.
- Restricted reward categories are rent, B2B, utilities, education/government, wallet, online skill-based gaming and EMI. The terms' MCC annexure names codes 4812, 4814, 4900, 8211, 8220, 8241, 8299, 9311, 9399, 6540, 7311, 7399, 6513 and 5816. Categories/MCC classification govern eligibility.
- Points accrue monthly in whole-rupee multiples, expire one year after accrual and redeem only as cashback against statement outstanding, in multiples of 400 points, at ?1/point.
- Fuel surcharge waiver: 1% on ?500??4,000 transactions, up to ?3,500 in an anniversary year. No lounge access; ATM cash withdrawal is not allowed. Up to three free add-on cards; age 18+; shared primary limit.

## Remaining uncertainty and representation limits

- Issuer pages describe both Visa offers and a RuPay variant; this record aggregates variants and the schema cannot precisely represent the RuPay UPI override without potentially conflating it with category earn. Network and network tier are left null.
- No card-specific launch date or numerical age, income or credit-score cutoff was established from the current product/KFS material reviewed. Launch date is cleared; eligibility thresholds remain null. The existing broad residency claim was not independently substantiated in this pass.
- Cashback exclusions are represented using the schema's canonical `other` category for B2B and skill-based gaming; exact terms are also stated in the capping notes and MCC exclusions.
- The card-specific terms rely on MCC assignment, so merchant names alone do not guarantee accelerated cashback.

This is a record-level source comparison. It does not estimate accuracy for the rest of the library.
