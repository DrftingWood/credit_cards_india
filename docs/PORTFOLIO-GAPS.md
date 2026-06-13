# Portfolio gaps — big-bank coverage review (2026-06-13)

Catalogue is 127 cards across 24 issuers. This review flags **currently-shipping
cards from the major issuers that are absent** from the dataset. These are
*candidates for the next verification sweep* — none should be added as a YAML
file until its fee/reward/benefit terms are sourced (the no-unsourced-data rule
that the rest of this dataset holds to). Confidence below is about whether the
card exists and is open, not about its terms.

## High-value gaps (open, mainstream, big-bank)

| Candidate | Issuer | Why it matters | Confidence |
|---|---|---|---|
| **SBI Miles** (base) | sbi | The SBI Miles travel family (Miles / Miles Prime / Miles Elite) launched 2024; we hold only `miles-elite`. The base and Prime tiers are mainstream travel cards. | high (exists), needs terms |
| **SBI Miles Prime** | sbi | Mid tier of the same family — common recommendation target. | high (exists), needs terms |
| **Kotak PVR INOX** | kotak | Successor to the discontinued `pvr-gold` (₹499, 2023). Already flagged in ROADMAP; the discontinued card points users at a product we don't list. | high |
| **Axis Samsung** | axis | 2024 co-brand (Axis × Samsung / OneCard stack); actively marketed, no entry. | med |
| **HDFC Pixel Go** | hdfc | Entry sibling of `pixel-play` in HDFC's digital "Pixel" line. | med |
| **HDFC Shoppers Stop** | hdfc | Long-running retail co-brand, still issued. | med |

## Network-variant gaps (modelling decision, not just missing data)

These exist as a second network on a card we already hold. The schema models
one card per file, so each needs either its own file or an explicit
"also issued on RuPay/Amex" note. Decide the convention before adding.

| Candidate | Base card we hold | Variant-specific difference |
|---|---|---|
| **HDFC Tata Neu Infinity / Plus — RuPay** | `hdfc/tata-neu-infinity`, `tata-neu-plus` | RuPay-UPI earn rules (0.25% other-UPI / +0.75% via Tata Neu UPI id, cap 500 NeuCoins/mo, Aug-2024) — already noted in the Visa files but not modelled. |
| **ICICI Coral / Rubyx / Sapphiro — Amex** | those Visa/MC files | Amex-network variants carry different lounge/MCC behaviour. |
| **SBI Tata Neu Infinity / Plus** | (none) | SBI's own Tata Neu co-brand, distinct from HDFC's. |

## Lower-priority / niche (verify status first — several may be discontinued)

- **Axis Burgundy Private** (the banking-tied flagship, distinct from Reserve/Olympus).
- **ICICI Mine** / **ICICI Expressions** (customisable) — confirm still open.
- **Kotak Zen Signature** / **Mojo Platinum** — likely casualties of the 2024 RBI issuance pause; confirm before adding.
- **HDFC Biz** family (Biz Black/Power/Grow) — **business cards; out of current consumer scope** unless scope expands.
- Airline co-brands tied to merged carriers (**Club Vistara** SBI/Axis/IDFC, **Axis Vistara**) — Vistara folded into Air India; most discontinued. Track as historical, not gaps.

## Coverage by big bank (consumer cards, open for application)

- **HDFC** (18 files): strong. Gaps are Pixel Go, Shoppers Stop, RuPay variants.
- **SBI** (14): the **Miles base/Prime** gap is the most material in the dataset — a whole open sub-family missing.
- **ICICI** (12): strong; gaps are network/co-brand variants.
- **Axis** (16): strong; Samsung + Burgundy Private the notable open gaps.
- **Kotak** (9): PVR INOX is the one concrete successor gap.

## Recommended next action

One verification sweep (same harness as the 2026-06 audit) covering the
**High-value** table + the **Kotak PVR INOX** successor file, producing sourced
fee/reward/benefit facts → then create files. Defer network-variant modelling
until the one-card-per-network convention is decided (see `docs/DECISIONS.md`).
