# Standard Chartered — MCC map (2026-07-03)

MCC handling applied across the Standard Chartered India catalogue during the
2026-07 audit.

## Universal rent exclusion
Every SC card carries `mcc_exclusions: ['6513']` (residential rent, MCC 6513) — none
of the SC reward/cashback programmes award points on rent.

## Category-MCC accelerators
- **Super Value Titanium** — 5% cashback on **fuel**, **telephone/phone bills**, and
  **utility bills**, each with a per-transaction cap (₹100/txn) and monthly caps
  (fuel ₹200/mo; phone ₹100/mo; utility ₹100/mo). Base 1 RP/₹150 elsewhere.
- **Platinum Rewards** — 5X Reward Points on **fine-dining** and **fuel** MCCs
  (no cap); 1X elsewhere.
- **Manhattan** — 5% cashback at **supermarkets/groceries**; 3X Reward Points on all
  other spends.
- **Smart** — 2% cashback on **online** MCCs (cap ₹1,000/mo); 1% other (cap ₹500/mo);
  fuel not eligible; total ≤ ₹18,000/yr.
- **Priority Visa Infinite** — 5 RP/₹100 on **overseas** + **retail-fashion**; 2 RP
  elsewhere.
- **Beyond** — 3% everyday / 2% select (utilities); 15% cashback on **duty-free**.
- **Ultimate** — flat 5 RP/₹150 (3.33%); cashback on **duty-free**; reduced 2% forex.

## Common exclusions
Fuel, wallet-loads, insurance-premiums, and EMI are excluded from base reward accrual
on most SC cards (in addition to rent). Utilities are excluded on the premium points
cards (Ultimate) but are a bonus category on the value cards (Super Value Titanium).

See [`standard-chartered-audit.md`](standard-chartered-audit.md) for the full
catalogue reconciliation.
