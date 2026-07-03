# Kotak Mahindra Bank — audit + verification (2026-07-03)

Full review of the Kotak credit-card catalogue against the live **`kotak.bank.in`**
site (Playwright crawl of `/en/personal-banking/cards/credit-cards/<slug>.html`;
fee detail from each card's `/fees-and-charges.html` subpage; reward detail from
the on-page reward sections), 2026-07-03.

## Systematic findings

1. **Domain migration.** `kotak.com` → **`kotak.bank.in`** (a `.bank.in` move like
   HDFC/Axis/ICICI/IDFC). All source URLs re-based; `kotak` added to the validator's
   `ISSUER_ALLOWED_DOMAINS`.
2. **Wrong stored source slugs.** Several existing cards cited URLs that 404 on the
   live site (e.g. `league-platinum-credit-card.html` → real is
   `league-platinum-card.html`; `811-dreamdifferent-…` → `kotak-811-credit-card.html`;
   `indian-oil-kotak-…` → `indian-oil-credit-card.html`). Fixed per card.
3. **Aggregator sources removed.** IndiGo/IndiGo-XL cited paisabazaar & cardinsider
   as primary sources → replaced with canonical Kotak pages (clears 2 standing
   validator warnings).
4. **Reward-point value overstated.** Kotak RP was recorded at ₹0.15; the live joining
   gifts imply **₹0.10** (e.g. 5,000 RP = ₹500 on League). Corrected across points
   cards. IndianOil is the exception (₹0.25); Air/Air+/Solitaire use Air Miles (₹1).
5. **Reward-rate drift.** League base 8→4 RP/₹150 (8 only above ₹2L annual); 811 base
   2→1 (offline) with 2 online; IndianOil fuel 6→24 RP/₹150 (cap 300/mo→1,200/stmt).
6. **MCC exclusions/caps** from Kotak's explicit T&C tables added: fuel MCCs
   (5172/5541/5542/5983) and utility ₹35k/statement cap. See
   [`kotak-mcc-map.md`](kotak-mcc-map.md).

## Catalogue reconciliation

**Existing 9 — all handled:** 7 corrected/verified (league-platinum, 811,
white-reserve, indianoil, indigo, indigo-xl→renamed "IndiGo Kotak Premium",
solitaire→rewritten to Air Miles) + **2 discontinued** (myntra-kaching, pvr-gold —
both marked "(Discontinued)" on live pages / off the grid).

**10 new cards added:** cashback-plus, cashback-plus-prime, air, air-plus,
air-plus-prime, white, upi-rupay, zen-signature (Kotak Zen), pvr-inox,
wealth-management-infinite (Kotak Infinite).

**Skipped — live page marked "(Discontinued)", not in dataset:** mojo-platinum,
royale-signature, privy-league-signature, urbane-gold, pvr-platinum.

**Excluded — business/commercial:** business-credit-card, solitaire-business,
purchase, corporate-platinum/gold/wealth-signature, biz-edge, biz.

**Follow-ups (inline `# TODO verify`):** exact monthly caps on Cashback+ category
earn, network on several new cards, Kotak Infinite base earn rate, Air+/Air+ Prime
lounge counts & welcome amounts. Close from MITC where published.
