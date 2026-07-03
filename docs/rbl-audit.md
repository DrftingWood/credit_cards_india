# RBL Bank — audit + verification (2026-07-03)

Review of the RBL Bank credit-card catalogue against the live **rbl.bank.in** site
(Playwright + DOM extraction; the site is tab-based via `?tabName=` and redirects to
canonical slugs), 2026-07-03.

## Systematic findings

1. **Domain migration.** `rblbank.com` → **`rbl.bank.in`** (a `.bank.in` move like
   HDFC/Axis/ICICI/IDFC/Kotak). Added `rbl.bank.in` to the validator's
   `ISSUER_ALLOWED_DOMAINS` (kept rblbank.com + irctc.co.in for the IRCTC co-brand).
2. **Wrong stored URL path on ALL 6 cards.** Sources used
   `/category/credit-cards/<slug>` (404) instead of the live
   `/personal-banking/cards/credit-cards/<slug>`. Fixed across all.
3. **Zomato Edition discontinued.** `zomato-rbl-edition-credit-card` 404s and is off
   the live catalogue (Zomato ended its RBL co-brand) → marked discontinued, records
   closed.
4. **Canonical slug fix.** Play card's live slug is `rbl-bank-play-credit-card`
   (`play-credit-card` redirects) — corrected.

## Catalogue reconciliation

**6 existing — all handled:** world-safari (verified: 0% forex, ₹3k fee, MMT ₹3k
welcome, 8+8 lounge, 5X intl), shoprite (verified: ₹500, 20 RP/₹100 grocery,
2,000 RP welcome), play (verified, slug fixed), irctc (verified active), insignia
(invite-only, light touch), zomato-edition (**discontinued**).

**3 new cards added:** icon (premium — 20,000 RP welcome, 6% weekend-dining/intl,
golf + concierge), platinum-maxima-plus (mid — 10,000 RP welcome, 2.8% grocery/
dining, 2 lounge/qtr), cookies (entry — 10% brand cashback ≤₹300/brand/mo,
unlimited 5X online RP).

**Not resolved (skipped):** `rbl-bank-rupay-credit-card`, `samsung-pay` — the slugs
seen in the nav menu 404 at the obvious paths (likely UPI variants / nav artifacts,
not standalone consumer cards). Revisit if a canonical slug surfaces.

## MCC pass
Universal rent (MCC 6513) exclusion on all RBL cards. See
[`rbl-mcc-map.md`](rbl-mcc-map.md).

## Follow-ups
RBL's tab-based site resists deep extraction, so several new-card fields (exact fees,
RP/₹100 rates and caps, lounge counts, income) carry `# TODO verify` markers — close
from each card's MITC / rate-card PDF.
