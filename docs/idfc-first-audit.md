# IDFC FIRST Bank — audit + verification (2026-07-03)

Full review of the IDFC FIRST Bank credit-card catalogue against the live
**`idfcfirst.bank.in`** site (Playwright crawl of every `/credit-card/<slug>`
product page; reward/fee detail read from the on-page Fees/Rewards tabs), 2026-07-03.

## Systematic findings

1. **Domain migration.** `idfcfirstbank.com` → **`idfcfirst.bank.in`** (a `.bank.in`
   move like HDFC/Axis/ICICI). Every source URL was re-based. The validator's
   `ISSUER_ALLOWED_DOMAINS` already included the new host.
2. **Fabricated "6X" reward tier.** Every standard Visa card (millennia, classic,
   select, wealth, swyp) carried an `online-spend-under-20k … effective_rate: 6`
   accelerator that does not exist. IDFC's real model is **3X base (per ₹150) up to
   ₹20,000/month, 10X on incremental spend above ₹20,000, and a reduced 1X on
   utility / insurance / railway / FASTag.** Removed the phantom 6X everywhere and
   modelled the real tiering. This silently overstated earn on the most common
   everyday-spend band.
3. **Utilities/insurance were zeroed.** These were in `exclusions[]` (0 rewards) but
   actually earn a reduced **1X** — moved to a 1-RP accelerator.
4. **Movies BOGO → 25% off.** Every card claimed a Paytm-Movies buy-one-get-one; the
   live pages offer a flat **25% off (up to ₹100–₹250)**. Corrected.
5. **Metal-card redemption value.** Ashva/Mayura/Gaj reward points redeem at up to
   **₹0.40 / ₹0.50 / ₹1.00** via the FIRST Rewards Gallery (travel) vs ₹0.25 base —
   captured in `unit_value_inr` + redemption constraints. Also corrected metal-card
   forex (ashva 1.5→1%, mayura 0.99→0%) and lounge counts (were understated /
   "unlimited"; live = 4+2 or 4+4 per quarter).

## Catalogue reconciliation

**11 existing cards — all corrected:** millennia, classic, select, wealth,
first-private, ashva, mayura, indigo, power, power-plus, swyp.

**7 new cards added:**
- FD-backed/secured: **hello-cashback**, **wow** (FIRST WOW!, LTF zero-forex),
  **secured-rupay** (FIRST EA₹N virtual RuPay UPI), **wow-black** (₹750 premium).
- Co-brand: **lic-select** (LIC, 10X on premiums).
- Metal/premium: **gaj** (invite-only ₹12,500), **diamond-reserve** (₹3,000 zero-forex).

**Excluded — companion/add-on:** `rupay-credit-card` (FIRST Digital RuPay) — a
digital UPI card linked to an existing IDFC card (shared credit limit + common
rewards account), not a standalone product.
**Excluded — business/commercial:** business-max, business-multiplier, corporate,
purchase, business-credit-card-sme, micro-enterprise.

**Follow-ups:** LIC **Classic** variant (2nd card on the LIC page) still to add;
inline `# TODO verify` markers remain for unpublished fields (network on several
cards, incomes, launch dates, exact WOW-Black lounge count, WOW fee footnote) — to
close from the MITC / Key Fact Statement PDFs.

## MCC pass

Universal **rent (MCC 6513)** exclusion applied to all 18 cards' `mcc_exclusions`.
See [`idfc-first-mcc-map.md`](idfc-first-mcc-map.md).
