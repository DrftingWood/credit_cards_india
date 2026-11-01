# Flipkart Axis Bank Super Elite Credit Card: issuer comparison (27 Oct 2026)

## Sources reviewed

- Current Axis product page: <https://www.axis.bank.in/cards/credit-card/flipkart-axis-bank-super-elite-credit-card>
- Current card-specific SuperCoins terms: <https://www.axis.bank.in/docs/default-source/default-document-library/credit-cards/terms-and-conditions-for-flipkart-superelite-axis-bank-credit-card.pdf?sfvrsn=949a2028_1>
- Axis generic card terms updated effective 28 Aug 2026: <https://campaign.axis.bank.in/generic/terms-and-conditions-generic-all.pdf>
- Axis/Flipkart launch announcement (22 Nov 2022): <https://www.axis.bank.in/about-us/press-releases/axis-bank-and-flipkart-partner-to-launch-flipkart-axis-bank-super-elite-credit-card>
- Local card-specific PDF: `docs/sources/axis/flipkart-super-elite/terms-and-conditions-for-flipkart-superelite-axis-bank-credit-card.pdf`.

## Field reconciliation

| Area | Database value/review | Issuer evidence and limits |
| --- | --- | --- |
| Status, identity, launch | Active; launch date 2022-11-22 | Axis launch release is dated 22 Nov 2022. Current product page identifies SuperElite. |
| Network and tier | Both cleared to null | Current card product page and reviewed card terms do not identify the payment network or network tier. “Super Elite” is a product name, not evidence of a network tier. |
| Joining/annual fees | INR 500 / INR 500 | Current product page. Annual fee is waived only when annual eligible spend is **greater than** INR 200,000. Rent MCC 6513 and wallet-load MCC 6540 do not count. The page's displayed text does not itself define the annual period; current Axis fee terms describe anniversary-year measurement. |
| Finance, cash and FX | 3.75% monthly; cash advance 2.5%, min INR 500; forex 3.5% | Current product page and current Axis charge terms. Axis generic terms effective 28 Aug 2026 list DCC at 3.5% and late fee INR 1,300 for dues above INR 50,000. The schema has no dedicated DCC or late-fee field; these remain in source notes. |
| Base SuperCoins | 2 SuperCoins per INR 100 on other eligible spends | Card-specific terms and product page. SuperCoins are not assigned a fixed INR value because the redemption value varies by item/offer and no fixed issuer conversion is established. |
| Flipkart earn | Additional 12 SuperCoins/INR 100 for Plus; 6/INR 100 for non-Plus | Card-specific terms cap the card-issued coins at 300/150 per transaction, respectively. Plus status is provided by Flipkart, not an input in this card schema; a calculator cannot select the correct tier. Separate platform SuperCoins, if awarded, are not card-issued rewards. |
| Reward exclusions | Fuel, Flipkart gift cards, EMI/post-facto EMI, wallet loads, jewellery, cash advance, outstanding-balance repayment, fees/charges, Flipkart Health integrated third-party purchases, rent MCC 6513 and the listed excluded MCCs | Card-specific terms support the stated exclusions, including MCCs 6012, 6051, 5541, 5983, 5542, 5944, 6011 and 6540. The generic/product-page statements also exclude rent from rewards/fee-waiver spend. “Other eligible spend” is not itself an exclusion. |
| Reward timing/account state | Pending SuperCoins become credited 30 days after Flipkart moves them to pending; account must be in good standing | Card-specific terms describe net statement spends after same-cycle refunds, later reversal debits, EMI reversal and negative issuance adjustment against existing/future balance. Flipkart account must be linked using the same mobile number as the card for activation/monthly coins. |
| Welcome/offers | 500 SuperCoins on activation; 2-month YouTube Premium, 3-month Gaana Plus, 1-year Lenskart Gold; Myntra INR 500 off (max 3 qualifying orders above INR 2,999); Flipkart Flights 15% off (max INR 1,500); first Flipkart Health medicine order 30% off | Current product page lists these offers; individual offer terms apply and may change independently. The 500 activation coins and monthly card coins require same-mobile Flipkart account linkage under card terms. |
| Fuel waiver | 1%, transaction INR 400–4,000, maximum INR 400 per statement cycle | Current Axis product page. |
| Eligibility | Age 18–70; Indian resident or NRI; numeric income/score unknown | Current product page says these criteria are indicative and subject to bank approval. |
| Effective dates | Verification snapshot 27 Oct 2026; SuperCoins terms have no stated effective date in the linked PDF | Product page states the Axis card terms update effective 28 Aug 2026. Existing schema dates for fee/benefit snapshots are not issuer-declared effective dates; do not interpret them as such. |

## Modeling and remaining limits

- The source distinguishes Flipkart Plus and non-Plus card rewards, but the dataset has no user-selectable Flipkart membership input. Both rates are documented; calculator output cannot choose between them.
- The general two-coins-per-INR-100 rate applies to other eligible spend while Flipkart has separate card rates. Because SuperCoins have no supported fixed INR value, this does not create a cash-equivalent calculator estimate.
- Product-page promotions can change or have separate terms; this review records the current display and does not assume each offer will persist for the life of an issued card.
- No current primary source reviewed established Visa/other network or network tier, a fixed SuperCoin cash value, or numeric income/credit-score thresholds; these remain null/unknown.

## Validation result

Updated the record's unsupported network/tier claims, strict fee-waiver boundary, product terms, source dates and evidence paths. The current source comparison is an issuer-evidence review, not a guarantee that every value applies to an individual legacy account. Project validator, source-stamp audit, numeric evidence audit and current queue are rerun and tracked in the overview/checklist.
