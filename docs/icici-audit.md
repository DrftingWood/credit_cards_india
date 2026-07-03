# ICICI Bank — audit + PDF verification (2026-07-03)

Full review of the ICICI catalogue against the live `icici.bank.in` site (Playwright
crawl of all 22 retail cards) and the archived native PDFs in `docs/sources/icici/`.

## Method

Crawled the credit-card listing + every product page; reconciled against
`data/cards/icici/`; corrected existing cards and scaffolded missing ones from the
crawl; downloaded native PDFs (shared MITC/T&C/lounge/golf/insurance + card-specific
T&C); then cross-checked every card's YAML field-by-field against the PDF text.

## Reconciliation

- **Matched (11):** adani-one-signature, amazon-pay, coral, emeralde,
  emeralde-private-metal, hpcl-super-saver, mmt-signature, platinum-chip, rubyx,
  sapphiro, times-black.
- **Added (11):** adani-one-platinum, csk, expressions, hpcl-coral,
  emirates-emeralde, emirates-rubyx, emirates-sapphiro, mmt, mmt-platinum,
  parakram, parakram-select.
- **Discontinued (1):** manchester-united-signature — all MU URLs 404.

## Systematic findings

- **Finance charge 3.5 → 3.75%/mo (45% p.a.)**, w.e.f Nov-15-2024 (MITC §2) — every
  ICICI card in the dataset was stale.
- **Currency `PAYBACK Points` → `ICICI Reward Points`** — ICICI has migrated off
  PAYBACK; the points cards' currency_name was outdated.
- **Forex markup is card-specific** (MITC exception list), not a flat 3.5%:

  | Markup | Cards |
  | --- | --- |
  | 1.49% | times-black |
  | 1.99% | amazon-pay |
  | 2.0% | emeralde, emeralde-private-metal |
  | 3.5% | everyone else (default) |

- **Domestic-lounge ₹75,000/preceding-quarter spend gate** (MITC §8, w.e.f Jan-2025)
  applies to all eligible cards — added to coral, rubyx, expressions, sapphiro,
  hpcl-super-saver, emirates-sapphiro, etc. The super-premium cards
  (emeralde, emeralde-private-metal, times-black) are on the **exemption list**
  (unlimited, ungated).
- **Base reward rates were overstated** on the premium points cards — corrected to
  the live/PDF values: emeralde 4/₹100 intl (was 6), sapphiro 2/₹100 (was 4),
  rubyx 2/₹100 (was 4), times-black 2% + 2.5% intl (was 3%/6%).

## Per-card PDF-verified corrections (highlights)

- **emeralde / sapphiro:** air-accident 3cr → **1cr** (Comprehensive-Insurance Col A).
- **sapphiro / rubyx:** welcome values corrected to the actual PDF vouchers
  (sapphiro ₹13k→₹8.5k; rubyx ₹15k→₹5k) — the inflated figures weren't in the docs.
- **Emirates ×3:** resolved forex (3.5%), cash-advance (2.5%/₹500), late-fee slabs,
  overlimit (2.5%/₹550), reward exclusions, and welcome tiers — **Rubyx gets Blue
  tier (no welcome miles); Sapphiro Silver + 5k miles; Emeralde Silver + 10k miles**.
  Base earn dropped to 2 / 1.5 / 1 per ₹100 (w.e.f Jan-15-2026).
- **hpcl-coral:** added the missing 2.5% fuel cashback tier; utility earn scope fixed.
- **adani ×2:** added the 0.5 RP utility/insurance tier; fuel-waiver txn bounds fixed.
- **hpcl-super-saver / csk:** welcome condition corrected to "₹5,000 spend within 45
  days"; concierge is RuPay-variant-only.
- **mmt ×3:** exclusions trimmed to the actual non-earning set; welcome corrected
  (₹500 myCash + ₹3,000/₹2,500 holiday voucher); milestones re-dated to anniversary
  year; added movie + international tiers.
- **parakram ×2:** insurance ₹2L PA + ₹20L air (per Parakram insurance PDF); added
  grocery accelerator (5/10 RP capped 1,000/mo); exclusions fixed; ₹99 redemption fee;
  3 free add-on cards; parakram-select golf 1→4 rounds/mo, intl lounge 2→1/yr.

## PDF coverage

36 PDFs archived (`docs/sources/icici/`). ICICI shares generic docs (MITC, T&C,
lounge/golf/insurance lists) across cards — deduped into `_shared/` — plus
card-specific T&C for the co-brand cards. Every live ICICI card is backed by ≥1 PDF.
Unlike HDFC, ICICI keeps most **reward-rate** detail on the web page rather than in
PDFs, so those values are page-sourced; the PDFs authoritatively back
fees/finance/forex/lounge/golf/insurance and the co-brand T&C.

## Remaining follow-ups

- **Card network** is not stated in any ICICI PDF for several newly-added cards
  (hpcl-coral, adani-one-platinum, csk, mmt-platinum, parakram ×2, Emirates ×3) —
  left as `# TODO verify network`; needs a product-page/BIN check.
- `travel-medical` sums on the premium cards are page-sourced (not in the insurance
  PDF) — flagged in-file.
- A few reward specifics (CSK match-day multiplier, mmt dining %) aren't quantified
  in the PDFs — left as web-sourced.
