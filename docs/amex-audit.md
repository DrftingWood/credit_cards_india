# American Express India — audit + verification (2026-07-03)

Review of the Amex India card catalogue against the live **americanexpress.com/in**
site (Playwright + DOM extraction; Amex serves 404 to non-browser fetchers, so
WebFetch is unusable here), 2026-07-03.

## Systematic findings

1. **Wrong stored source slugs (404s).** Several cards cited URLs that 404 on the
   live site — MRCC `membership-rewards-credit-card` → real `membership-rewards-card`;
   Platinum Card `credit-cards/platinum-card` → real **`charge-cards/platinum-card`**.
   Fixed per card.
2. **SmartEarn reward partners were backwards.** Amazon was recorded at 10X (live is
   **5X**) and Uber/BookMyShow at 5X (live is **10X**). Real structure: 10X per ₹50 on
   Zomato/Ajio/Nykaa/BookMyShow/Uber/Flipkart/EaseMyTrip; 5X on Amazon; ~1,250 MR/mo cap.
3. **Welcome/milestone mischaracterisations.** MRCC welcome 1,000→**4,000** MR;
   Platinum Travel milestones were generic "vouchers" but are **MR points** (7,500/
   10,000/22,500); Platinum Reserve welcome was a "Taj gift card" but is **11,000 MR
   points**, and its milestone is **₹12,000/yr vouchers on ₹50k monthly spend**.
4. **Fee corrections.** Platinum Travel joining 3,500→**5,000**; Platinum Reserve
   annual 5,000→**10,000**; Platinum Card 60,000→**66,000**.
5. **US-only benefit removed.** Platinum Card had a "5X MR on Fine Hotels & Resorts"
   accelerator — that is a US-Amex benefit; India's FHR gives elite perks (upgrades,
   breakfast, ₹44,300 value/booking), not 5X MR. Removed; FHR kept as a benefit.

## Catalogue reconciliation

**6 cards — all verified/corrected:** smartearn, mrcc, platinum-travel,
platinum-reserve, platinum-charge (the flagship Platinum charge card), centurion
(invite-only, no public page — dates refreshed, data retained).

**No Amex Gold Card** — it appears only as a text mention on category pages with no
live product link; not a current standalone card, so not added.

## Reward-value note

Membership Rewards realized values (sourced, per ROADMAP): MRCC ₹0.25, Platinum
Travel ₹0.30, Platinum Reserve / Platinum Charge / Centurion ₹0.40. Base earn is
1 MR per ₹50 (1 per ₹40 on the Platinum family). Utilities/insurance earn 0 MR
(exclusions). Rent (MCC 6513) excluded on all 6.

## Follow-ups
Exact Priority Pass per-visit terms, current Fine Hotels & Resorts partner list,
and Centurion's (unpublished) fee/benefit specifics remain best-effort.
