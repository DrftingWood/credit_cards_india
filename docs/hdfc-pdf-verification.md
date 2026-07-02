# HDFC — PDF verification (2026-07-03)

Every HDFC card's YAML was cross-checked field-by-field against the **archived
native PDFs** in `docs/sources/hdfc/` (card T&C, rewards, lounge, golf, insurance
docs + the shared MITC v4.3 Jul-2026). Text was extracted with `pdftotext` and
each card verified by a dedicated pass. ✅ = confirmed by a PDF, ❌ = PDF
contradicts the YAML, 🔧 = a scaffold `# TODO` now resolvable from a PDF.

## Cross-cutting / systematic

- **Reward denominator confirmed.** MITC: *"Reward Points earned in multiples of
  **200**… for Infinia / Diners Black / Biz Black in multiple of **150**… for
  IRCTC in multiple of **100**."* → validates the ₹150→₹200 corrections already
  applied to regalia-gold, regalia, diners-privilege, moneyback-plus.
- **Finance charge is wrong on every card.** YAML says `3.6`; MITC v4.3 states
  **3.75%/month (45% p.a.)** for standard cards and **1.99%/month (23.88% p.a.)**
  for Infinia / Infinia Metal / Diners Black / Diners Black Metal / Biz Black.
  Exception: **pine-labs-pro** — its own KFS states 3.6%, so leave it.
- **Eligibility is never in the PDFs.** Income, age, and credit-score come from
  product pages, not T&C/MITC — treat those YAML fields as page-sourced, unverifiable here.
- **Base earn *rate* for super-premium cards isn't in the PDFs.** Infinia, Diners
  Black, Regalia, Regalia Gold rewards-T&C PDFs describe redemption/accelerators
  but not the base points-per-₹ table — those rates are page-sourced.

## Confirmed mismatches to fix

### Cards already corrected this PR — further fixes the PDFs revealed
| Card | Field | YAML | PDF says |
| --- | --- | --- | --- |
| **freedom** | base rate | 2 / ₹200 | **1 / ₹200** (`freedom-tncs`: "1 CashPoint per 200") — my earlier edit over-corrected (marketing page said 2, T&C says 1) |
| freedom | accel effective_rate | 20 | **10** ("10X = 10 CashPoints per 200") |
| freedom | unit_value / redemption | 0.25 | **0.15** ("1 CashPoint = 0.15 for Freedom") |
| **diners-privilege** | insurance air-accident | ₹2 cr | **₹1 cr** (USD 125,000 — Privilege column; ₹2cr was the Black value) |
| diners-privilege | fuel_surcharge_waiver | present | **not applicable** (MITC + fuel excluded from RP) |
| diners-privilege | golf | 4/qtr | **unsupported** — no golf in any Privilege PDF (remove) |
| **regalia-gold** | milestone annual | ₹5L → voucher | **₹7.5L → SmartBuy flight voucher ₹5,000** |
| regalia-gold | domestic lounge `via` | priority-pass | **card-swipe** (Priority Pass is international-only) |
| regalia-gold | welcome condition | "Card issued" | **₹1L net spend in 90 days** |
| **regalia** | domestic lounge `via` | priority-pass | **voucher-based** (Priority Pass international-only) |
| **diners-black** | finance charge | 3.6 | **1.99** |
| **infinia** | finance charge | 3.6 | **1.99** |
| infinia | fuel max_txn | ₹5,000 | **₹1,00,000** |
| infinia | golf lessons_per_cycle | 0 | **unlimited** |
| infinia | cash-advance / late fees | present | **Infinia is exempt** (MITC excludes it) |
| infinia | insurance | air + medical | **+ credit-shield ₹9L + lost-card ₹9L** |

### New scaffolded cards — resolve TODOs / fix
| Card | Field | Was | PDF says |
| --- | --- | --- | --- |
| **upi-rupay** | unit_value / redemption | 1.0 | **₹0.25** (1 CP = ₹0.25) — 4× overstatement, biggest error |
| upi-rupay | tier caps | TODO | **500 CP/month each** (3%/2%/1% tiers) |
| **pixel-go** | joining/annual fee | 0 | **₹250 + GST** |
| pixel-go | finance charge | 3.6 | **3.75** |
| pixel-go | dining | Swiggy Dineout 10% | **Dineout Pay 25%, ₹300/mo cap** (offer may be expired) |
| pixel-go | SmartBuy / UPI caps | TODO | **500 CP/month each** |
| **phonepe-uno** | joining/annual fee | 0 | **₹499 + taxes**, waiver ₹1L |
| **phonepe-ultimo** | joining/annual fee | 1000 | **₹999 + taxes**, waiver ₹2L |
| phonepe-ultimo | lounge `via` | issuer-direct | **Gyftr voucher** (2/qtr, ₹75k gate, 8/yr) |
| **swiggy-ornge** | golf | 4 rounds/12 lessons | **unsupported** — no golf in any Swiggy PDF (remove) |
| swiggy-ornge | caps / cash-advance | TODO | **₹1,500/cycle; 2.5% or ₹500** |
| **swiggy-blck** | golf | 4 rounds/12 lessons | **unsupported** (remove) |
| swiggy-blck | welcome window | 90 days | **37 days** (90 is the fee-waiver window) |
| swiggy-blck | caps | TODO | **10%→₹1500, 5%→₹1500, 1%→₹1000 per cycle** |
| **shoppers-stop** | joining/annual fee | 0 | **₹299** (from Mar-2024; existing customers LTF) |
| shoppers-stop | caps / redemption | TODO | **3%→500RP, 1%→1000RP, min ₹150; 1 RP=₹1 vs SS voucher** |
| shoppers-stop | network | visa | **likely RuPay** (FAQ: Mass variant links to UPI) — verify |
| **shoppers-stop-black** | forex markup | 2.0 | **3.5** |
| shoppers-stop-black | insurance ₹3cr air | claimed | **✅ confirmed** (§2.8) |
| **pine-labs-pro** | cash-advance fee | null | **2.5% or ₹500** (KFS) |
| pine-labs-pro | insurance | none | **HDFC Ergo accidental death/PTD up to ₹30L, tiered** |
| pine-labs-pro | finance charge | 3.6 | **3.6 ✅** (KFS confirms — do NOT change) |

### Pre-existing cards (not previously edited)
| Card | Field | YAML | PDF says |
| --- | --- | --- | --- |
| **swiggy-hdfc** | network_tier | platinum | **World** (Mastercard World) |
| swiggy-hdfc | fuel_surcharge_waiver | present | **not applicable** |
| **millennia** | lounge_access | 8/yr DreamFolks | **discontinued 01-Dec-2023** (now a quarterly-milestone voucher choice) |
| **moneyback-plus** | accel effective_rate | 10 | **20** (10X = 20 CashPoints/₹200) |
| moneyback-plus | accel merchants | (list) | **+ BigBasket** missing |
| moneyback-plus | emi-spends accel | present | **removed 01-Sep-2024** |
| **irctc-hdfc** | rail accel cap | unlimited | **1,000/mo & 12,000/yr** |
| irctc-hdfc | grocery 3× tier | present | **unsupported** (base 1× with a monthly cap, not 3×) |
| irctc-hdfc | fuel max_txn | ₹4,000 | **₹5,000** |
| **tata-neu-plus** | Tata-brand accel cap | unlimited | **category-capped** (₹1L others / ₹3L electronics per yr) |
| tata-neu-plus | welcome window | 90 days | **30 days** |
| **diners-rewardz** | fee_waiver | ₹2L | **possibly ₹1L** (MITC table garbled — verify) |
| + finance-charge 3.6→3.75 on all of the above (see systematic) | | | |

## What the PDFs DO show (visible)

Reward rates/caps/merchant MCC lists, welcome & milestone mechanics, lounge
counts + spend-gates + access method (swipe vs voucher vs Priority Pass),
golf terms, insurance sum-insured tables (HDFC Ergo), the MITC fee table
(joining/annual/waiver per card), forex markup, finance charge, cash-advance
fee, fuel-surcharge waiver, redemption values (statement/catalogue/airmiles),
reward exclusions & validity.

## What the PDFs do NOT show (not verifiable here)

Eligibility (income, age, credit score) — always page-sourced. Base earn *rate*
for super-premium cards (rewards T&C omit the points-per-₹ table). `launched_on`,
`network_tier`, and `status` dates. SmartBuy accelerator caps for some cards
(governed by a separate T&C not in the archived pack). The MITC per-card fee
**table** flattens badly under text extraction — fee *amounts* read there should
be treated as indicative unless a card-specific KFS/T&C corroborates.

## Notable judgment calls

- **freedom base rate**: marketing page said "2 RP/₹200", the T&C PDF says
  "1 CashPoint/₹200". The T&C is authoritative → 1/₹200.
- **shoppers-stop network**: page implied Visa but the FAQ implies the Mass
  variant is RuPay — needs a definitive check.
- **finance charge on discontinued 6E cards**: not re-checked (pages 404).
