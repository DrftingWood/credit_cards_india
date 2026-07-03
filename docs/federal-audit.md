# Federal Bank — audit + verification (2026-07-03)

Review of the Federal Bank India credit-card catalogue against the live
**federal.bank.in** site (Playwright + DOM extraction), 2026-07-03.

## Systematic findings

1. **Domain migration.** `federalbank.co.in` **redirects to `federal.bank.in`** — the
   9th `.bank.in` migration found this audit run (only HSBC did *not* migrate). Federal
   had **no** entry in the validator's `ISSUER_ALLOWED_DOMAINS` — added `federal`
   (federalbank.co.in + federal.bank.in + **scapia.cards** for the Scapia co-brand,
   which sources to the Scapia app site).
2. **Muddled comparison pages.** Federal card PDPs mix comparison content across the
   Signet/Imperio/Celesta family, so reward tiers and welcome offers had to be
   disambiguated per card by anchoring on each card's own welcome-voucher amount.

## Catalogue reconciliation

**3 existing — all verified/corrected:**
- **Celesta** — welcome corrected to Amazon Pay ₹600 (on ₹10,000 in 30 days), was a
  generic ₹3,000 gift. Super-premium: 8+8 lounge, golf, 5 RP/₹150 + 3x dining/intl.
- **Signet** — added the welcome (Amazon Pay ₹200 on ₹3,000/30d) and the quarterly
  ₹20,000-spend voucher milestone.
- **Scapia** — verified **active** (Federal-issued via the Scapia app; zero
  forex/joining/annual fees, Scapia coins on all travel bookings, unlimited lounge).
  Sources to scapia.cards.

**2 new cards added:**
- **Imperio** — premium: 3x Health-Care/Grocery + 2x Dining + 1x base, 2 domestic
  lounge visits/quarter (₹40k gate), Big Basket vouchers (₹50k/quarter), Amazon Pay
  ₹400 welcome.
- **RuPay Signet** — UPI-enabled RuPay variant of Signet: 3x Electronics/Apparel,
  1 domestic lounge visit/quarter (₹20k gate), Amazon Pay ₹200 welcome.

**Excluded (out of scope):**
- **RuPay Wave** — a **floater/companion card** linked to a primary Federal credit
  card and sharing its credit limit; non-standalone (companion-card precedent:
  SBI/IDFC/YES Virtual RuPay).
- Business cards — fed-starbiz-credit-card (Visa & RuPay).

**Follow-up (other issuer):** a **Scapia BOBCARD** variant now exists (BOB-issued
Scapia) — worth adding to the BoB catalogue if that issuer is revisited.

## MCC pass
Universal rent (MCC 6513) exclusion on all Federal cards. See
[`federal-mcc-map.md`](federal-mcc-map.md).

## Follow-ups
The muddled PDPs mean several new-card fields carry `# TODO verify` (exact fees, reward
caps, network tier, income) — close from each card's MITC / fees PDF in the final
TODO-cleanup wave.
