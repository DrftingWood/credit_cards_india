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
