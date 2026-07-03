# HSBC — audit + verification (2026-07-03)

Review of the HSBC India credit-card catalogue against the live **hsbc.co.in** site
(Playwright + DOM extraction), 2026-07-03.

## Systematic findings

1. **No `.bank.in` migration.** HSBC India **stays on `hsbc.co.in`** — the first
   issuer this audit run *not* to migrate to a `.bank.in` domain (breaking an
   8-issuer streak: hdfc/axis/icici/idfcfirst/kotak/rbl/indusind/yes/sc all moved).
   HSBC had **no** entry in the validator's `ISSUER_ALLOWED_DOMAINS` — added
   `hsbc` (hsbc.co.in + www).
2. **Air-miles transfer at 1:1.** HSBC India Rewards transfer to airline & hotel
   loyalty partners at **1:1** (the dataset previously recorded 2:1 on Premier) —
   corrected across Premier, TravelOne, Visa Platinum, RuPay Platinum.

## Catalogue reconciliation

**3 existing — all verified/corrected:**
- **Live+** — split the reward tiers: 10% on dining/food-delivery/**grocery** (cap
  ₹1,000/month) is distinct from the separate **5% unlimited entertainment** tier
  (previously wrongly merged into one 10% dining/entertainment bucket); welcome is
  ₹1,000 cashback on app-login (was recorded as an Amazon voucher).
- **Premier** — source slug `premier-mastercard` → `premier`; replaced a generic 2X
  international accelerator with the real **12X on travel** (hotels/flights/car
  rentals); air-miles transfer **2:1 → 1:1**; +8 international guest lounge visits;
  EazyDiner 25% → **30%** (up to ₹1,500).
- **Visa Platinum** — added the 2,000-RP welcome, 1:1 air-miles redemption, District
  10% dining, MakeMyTrip 15% wallet cashback.

**4 new cards added:**
- **TravelOne** — travel card: 4 RP/₹100 on travel (capped 50,000 RP/yr) + 2 base,
  1:1 air-miles to 20+ partners, 4 international lounge visits/yr.
- **Taj** — ultra-premium IHCL co-brand ("The Rarest Key"): 5 RP/₹100 (5 RP = ₹1 in
  the Taj Wallet), Taj InnerCircle Platinum Tier, complimentary nights, Taj Club
  Lounge (12×/yr) + unlimited international lounge, IHCL concierge.
- **RuPay Platinum** — lifetime-free UPI RuPay card, 2 RP/₹150, air-miles transfer.
- **RuPay Cashback** — ₹499 UPI RuPay card, 10% dining/food/grocery + 1% base, 0% FX
  markup (promotional), 2 lounge visits/quarter.

**Excluded (out of scope):** EMI/facility pages — instant-emi, cash-on-emi,
loan-on-phone, balance-conversion.

## MCC pass
Universal rent (MCC 6513) exclusion on all HSBC cards. See
[`hsbc-mcc-map.md`](hsbc-mcc-map.md).

## Follow-ups
The premium PDPs (Premier, Taj, TravelOne) load fee tables and exact caps dynamically,
so several fields carry `# TODO verify` (exact annual fees, reward caps, network tier,
income thresholds) — close from each card's MITC / fees PDF in the final TODO-cleanup
wave.
