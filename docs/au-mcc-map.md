# AU Small Finance Bank — MCC map (2026-07-03)

MCC handling applied across the AU Small Finance Bank catalogue during the 2026-07
audit.

## Universal rent exclusion
Every AU card carries `mcc_exclusions: ['6513']` (residential rent, MCC 6513).

## Category-MCC accelerators
- **Altura** — 2% cashback on groceries/departmental/utility; 1% other.
- **Altura Plus** — Reward Points on online spends + 1.5% offline cashback.
- **Vetta** — up to 4 RP/₹100; birthday bonus; golf.
- **Zenith / Zenith+** — 5X (Zenith) / 2x (Zenith+) on dining/grocery/travel/international.
- **Ananta** — 5 RP/₹100 on Shopping, Dining & Travel.
- **Laksya / Tejas** — up to 5 RP/₹100 (grocery/departmental / select) + partner discounts
  (Tejas: flat 10% on movies/grocery/food-delivery).
- **Xcite** — 15X on select; **Xcite Ace** — up to 3% milestone cashback; **Xcite Ultra**
  — points + first-5-days-of-month bonus.
- **CA Metal** — 8 RP/₹100 on Dining, Travel, Tax Payments & Software; 25% ICAI cashback.
- **CheQ AU** — 12% on favourite brands, 2.5% on CheQ UPI.
- **Paytm AU** — 5% on Paytm Travel/Gold, 2% on Paytm UPI.
- **NoMo** — 2 RP/₹100 retail, 1 RP on utility & insurance (secured/FD-backed).

## AU-specific benefit patterns
- **Railway Lounge** access is common on the entry cards (Altura, Xcite, NoMo, Spont) —
  distinct from airport lounge.
- **Spend-gated airport lounge** — many cards unlock domestic airport lounge only on
  hitting a quarterly spend (₹40k–₹50k) — captured in each card's lounge `notes`.
- **Milestone-heavy** — monthly/quarterly reward-point milestones are pervasive; modelled
  under `benefits[].milestones` with `trigger_window: rolling`.

## Common exclusions
Fuel, wallet-loads, insurance-premiums and EMI are excluded from base reward accrual on
most AU cards (in addition to rent).

See [`au-audit.md`](au-audit.md) for the full catalogue reconciliation.
