# BOBCARD Uni GoldX issuer-source extract (2026-10-26)

## Current issuer materials reviewed

- BOBCARD product page: <https://www.bobcard.co.in/credit-card-types/bobcard-uni-goldx> (captured locally as `uni-goldx-product-page-retrieved-2026-10-26.html`).
- BOBCARD Uni GoldX MITC v9: <https://media.bobcard.co.in/media/ssacgcjz/bobcard-uni-goldx-mitc-9.pdf> (local PDF `uni-goldx-mitc-retrieved-2026-10-26.pdf`).
- BOBCARD Uni GoldX KFS: <https://media.bobcard.co.in/media/1qdnjbu5/bobcard-uni-goldx-key-fact-statement-4.pdf> (local PDF `uni-goldx-kfs-retrieved-2026-10-26.pdf`).
- Uni BOB reward MITC: <https://webcdn.uni.club/nxwave/docs/CC_BOB_MITC.pdf> (local PDF `uni-bob-reward-mitc.pdf`).
- BOBCARD Uni cardholder terms: <https://media.bobcard.co.in/media/3oon55vh/bobcard-uni-tc.pdf> (local PDF `uni-goldx-cardholder-terms-retrieved-2026-10-26.pdf`).
- BOBCARD terms index: <https://www.bobcard.co.in/most-important-terms-and-condition> (local capture `bobcard-terms-index-retrieved-2026-10-26.html`).
- Uni's current app-facing product content describes digital-gold redemption: <https://www.uni.cards/insights/credit-card-digital-gold/>. This is partner material, not the BOBCARD reward MITC.

## Confirmed data and corrections

- BOBCARD product page and card-specific KFS/MITC: zero joining/annual fee, 0% forex markup, 3.99% monthly revolving/cash-advance interest, and 2.5% cash withdrawal fee with INR300 minimum.
- BOBCARD product page: 1% value back in Uni Coins for eligible transactions; 5% value back on voucher purchases through Uni Store. Product page states the rewards do not expire.
- Uni BOB MITC: 1 Uni Coin per INR1 and each coin valued at INR0.01 (100 coins = INR1). It describes redemption for cashback into the card account, Reward Store purchases and other app offers. There is no automatic conversion to gold in this card-specific terms section.
- KFS: 1% reward terms explicitly say rewards apply only to GoldX UPI transactions of INR100 or more. The public BOBCARD page describes 1% more broadly across eligible transactions. The KFS condition is retained as a variant-specific minimum; the generic GoldX threshold remains unpublished in the reviewed materials.
- Uni BOB MITC exclusions include money transfers, rent, fuel, cash withdrawals, digital-wallet loading/top-ups, international transactions, EMI, utilities and government-services categories. Fuel transactions that qualify for the surcharge waiver do not earn reward points. The KFS gives the GoldX UPI INR100 threshold; rewards on GoldX UPI transactions below INR100 might not accrue under the Uni terms.
- Fuel surcharge waiver: 1% on fuel transactions up to INR7,500; max INR500 per statement. GST on the surcharge is not reversed. No qualifying transaction minimum is published in current card materials.
- Product page eligibility: Indian resident, age 21–60, salaried or self-employed. No numerical income or credit-score threshold is published.
- Card-specific Uni reward MITC says Uni Coins have lifetime validity, except accrued coins are nullified if the card is unused for more than 365 days, as well as stated closure/default/fraud conditions.

## Unresolved or unmodeled details

- Current BOBCARD and Uni KFS materials identify GoldX and GoldX UPI, but the reviewed sources do not establish one network/tier for all variants. The scalar network/tier and exact launch date are left unknown.
- The base reward record uses 1 coin per INR1 and INR0.01 per coin, consistent with the Uni BOB MITC. This represents 1% face value for eligible transactions; actual gold value, when redeemed through a currently available Uni app flow, depends on conversion terms and gold price.
- The Uni partner currently advertises 24K digital-gold redemption. BOBCARD's card-specific MITC instead enumerates account cashback, Reward Store purchases and other app offers. Gold is therefore noted as a partner/app redemption route, not encoded as automatic conversion or a guaranteed realized value.
- The product page says rewards do not expire, while card-specific Uni MITC nullifies balances after over 365 days of card inactivity and specifies other forfeiture events. The terms-based inactivity/forfeiture exception is recorded.
- 5% Uni Store value back is modeled as 500 coins per INR100 (= 5% at INR0.01/coin); no numerical cap was found on the product page or reviewed KFS/MITC.
- MITC/KFS do not state the effective date of all current fee details; the YAML uses the 2026-10-26 verification snapshot, not an asserted effective date.

## Source capture inventory

The product page, current card-specific MITC, KFS, cardholder terms, Uni BOB reward MITC and BOBCARD terms index are saved beside this extract. PDFs were inspected with text extraction; page wording and the UPI-specific reward condition were checked against the rendered text.
