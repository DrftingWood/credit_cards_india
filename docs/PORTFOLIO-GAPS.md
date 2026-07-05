# Portfolio gaps — big-bank coverage review (refreshed 2026-07-04)

Catalogue is **317 cards across 24 issuers** (304 active). This review flags
*currently-shipping cards from the major issuers that are absent* from the
dataset — candidates for a future verification sweep. Per the no-unsourced-data
rule, none should be added as a YAML file until its fee/reward/benefit terms are
sourced. Confidence is about whether the card exists and is open, not its terms.

The prior review (2026-06-13, 127 cards) has been almost entirely resolved by the
317-card July 2026 audit merge — see the reconciliation below.

## Resolved since the 2026-06 review (now in the dataset)

Every "high-value gap" the previous review listed has been added and is active:

| Previously flagged | Status now |
|---|---|
| SBI Miles / Miles Prime / Miles Elite | `sbi-miles`, `sbi-miles-prime`, `sbi-miles-elite` — all **active** |
| Kotak PVR INOX (successor to discontinued pvr-gold) | `kotak-pvr-inox` — **active** |
| Axis Samsung | `axis-samsung-signature` **active**; `axis-samsung-infinite` **on-hold** |
| HDFC Pixel Go | `hdfc-pixel-go` — **active** |
| HDFC Shoppers Stop | `hdfc-shoppers-stop`, `hdfc-shoppers-stop-black` — **active** |
| SBI Tata Neu Infinity / Plus | `sbi-tata-neu-infinity`, `sbi-tata-neu-plus` — **active** |
| ICICI Expressions | `icici-expressions` — **active** |
| Kotak Zen Signature | `kotak-zen-signature` — **active** |

## Still absent (missing products — verify status before sourcing)

| Candidate | Issuer | Notes | Confidence |
|---|---|---|---|
| **Axis Burgundy Private** | axis | Banking-tied flagship, distinct from Reserve/Olympus (`axis-reserve`/`axis-olympus` are held). | med — confirm still open |
| **ICICI Mine** | icici | Customisable card; may have been withdrawn post-2024. | low — confirm status first |
| **Kotak Mojo Platinum** | kotak | Likely a casualty of the 2024 RBI issuance pause. | low — likely discontinued |

These are the only mainstream candidates from the previous review that remain
absent. No new gap candidates are asserted here without a sourced basis.

## Non-actionable: network variants (modelling decision, not missing data)

These are not missing products — they are second networks on cards already held,
which the one-card-per-file schema does not yet model. This is a **schema
decision (task C2 / `docs/DECISIONS.md`)**, not a data gap:

| Variant | Base card(s) held | Variant-specific difference |
|---|---|---|
| HDFC Tata Neu Infinity / Plus — RuPay | `hdfc/tata-neu-infinity`, `tata-neu-plus` | RuPay-UPI earn rules (0.25% other-UPI / +0.75% via Tata Neu UPI id, cap 500 NeuCoins/mo, Aug-2024), noted in the Visa files but not modelled. |
| ICICI Coral / Rubyx / Sapphiro — Amex | those Visa/MC files | Amex-network variants may carry different lounge/MCC behaviour. |

Resolve the network-variant convention (C2) before adding any of these.

## Coverage by big bank (files held; open + all statuses)

Counts from `dist/index.json` (`by_issuer`):

- **SBI** (49): the previously-material Miles gap is closed; broad co-brand coverage.
- **Axis** (40): strong; Burgundy Private the notable open gap.
- **HDFC** (27): strong; RuPay variants remain a modelling decision, not a gap.
- **ICICI** (23): strong; ICICI Mine the one candidate to confirm.
- **Kotak** (19): PVR INOX and Zen Signature now held; Mojo Platinum likely discontinued.
- Long tail (yes 28, bob 23, indusind 23, au 21, idfc-first 18, …) rounds out 317.

## Recommended next action

The high-value sweep the previous review recommended is effectively complete. The
remaining work is small and status-first: **confirm whether Axis Burgundy Private,
ICICI Mine, and Kotak Mojo Platinum are still open**, and only then source and add
them. Defer network-variant additions until the one-card-per-network convention is
recorded in `docs/DECISIONS.md` (task C2).

## D5 candidates — sourced 2026-07-05, blocked on ONE missing value each

Researched from issuer evidence (2026-07-05). Both are active and mostly sourced,
but each is missing exactly one value that the no-fabrication rule forbids
guessing — so they stay documented candidates, not YAMLs, until that value is found.

### PNB RuPay Platinum Card (active) — blocked on the base earn rate
- Network RuPay Platinum. Joining ₹0; **annual ₹500**, waived if used ≥once/quarter
  in the preceding year (SOFC). Forex **3.50%** (Luxura metal is 0%). RP value
  **₹0.25/point** (creditcard.pnb.bank.in, w.e.f. 01/09/2024). Fuel: txn range
  ₹500–₹4,000 (rate/cap not issuer-stated). Lounge: "domestic + international"
  present, counts not issuer-stated.
- **BLOCKER:** PNB does not publish a per-₹ base earn rate on its issuer pages
  (only "300+ points on 1st usage"); the "1 RP/₹100" figure is aggregator-only.
  Author once an issuer source states the base rate.
- Sources: creditcard.pnb.bank.in/Documents/pnb_sofc.pdf, /index.html, /types5.html,
  /privileges6.html, /Documents/KeyFactStatement.pdf

### Union Bank NEXTERIA Credit Card (active) — blocked on the RP redemption value
- RuPay Ekaa metal, super-premium. Joining/annual **₹12,499** each; joining waived
  on ₹3L/90d, annual waived on ₹8L/12mo (MITC). Forex **3%**. Base **5 RP/₹125**
  (MITC "Rewards structure"). Accelerators: birthday-month 10X on online/electronics
  (max 10,000 RP), monthly-milestone 5X on ≥₹2L spend; **base cap 10,000 RP/month**,
  milestone cap 15,000 RP/yr; excluded MCCs jewellery/fuel/cash/wallet/insurance/
  alcohol. Lounge: unlimited domestic+international (individual), family 1+3 twice/
  quarter. Fuel waiver 1% up to ₹100/month.
- **BLOCKER:** Union Rewardz ₹/point redemption value is not published on issuer
  sources — `base.unit_value_inr` cannot be set without guessing. Author once the
  Union Rewardz point value is issuer-sourced (everything else is ready).
- Sources: unionbankofindia.bank.in/en/details/nexteria-credit-card; UBI cards MITC
  v1.4 PDF.
