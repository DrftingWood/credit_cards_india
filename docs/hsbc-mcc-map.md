# HSBC — MCC map (2026-07-03)

MCC handling applied across the HSBC India catalogue during the 2026-07 audit.

## Universal rent exclusion
Every HSBC card carries `mcc_exclusions: ['6513']` (residential rent, MCC 6513).

## Category-MCC accelerators
- **Live+** — 10% cashback on **dining / food-delivery / grocery** MCCs (cap
  ₹1,000/month); 5% unlimited on **entertainment/movies**; 1.5% base elsewhere.
- **RuPay Cashback** — 10% cashback on **dining / food-delivery / grocery** (monthly
  caps); 1% on all other eligible spends.
- **Premier** — 12X Reward Points on **travel** (hotels/flights/car rentals) via HSBC
  Travel Edit; 3 RP/₹100 base.
- **TravelOne** — 4 RP/₹100 on **travel** (flights/hotels/aggregators, capped 50,000
  RP/year); 2 RP/₹100 elsewhere.
- **Taj** — flat 5 RP/₹100 (5 RP = ₹1 in the Taj Wallet).
- **Visa Platinum / RuPay Platinum** — 2 RP/₹150 base + accelerated travel via portal.

## Air-miles transfer
Premier, TravelOne, Visa Platinum and RuPay Platinum convert HSBC Reward Points to
airline & hotel loyalty partners at **1:1** (TravelOne lists 20+ partners) — captured
as a `redemption[].type: airmiles` entry per card.

## Common exclusions
Fuel, wallet-loads, insurance-premiums and EMI are excluded from base reward accrual
on most HSBC cards (in addition to rent).

See [`hsbc-audit.md`](hsbc-audit.md) for the full catalogue reconciliation.
