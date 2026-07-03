# Data provenance & confidence

This document records, for every card in the dataset, **where its information came from**
and **how sure we are of it**. Each card YAML also carries a `# PROVENANCE & CONFIDENCE`
header comment pointing back here. Verification wave: **2026-07-03 → 2026-07-04**.

## Confidence tiers

| Tier | Meaning |
| --- | --- |
| **HIGH (pdf)** | Core fields cross-checked against the issuer's own **PDF** documents (per-card T&C / MITC, or a central Schedule-of-Charges / Features-&-Rewards T&C). PDFs archived under `docs/sources/<issuer>/` (the `.pdf` files are gitignored; the `_manifest.json` + `INDEX.md` are tracked). |
| **MEDIUM (web)** | Cross-checked against the issuer's **live web pages / HTML MITC**. The issuer publishes no downloadable per-card PDF (or it is session-gated), so the authoritative source is the rendered page. |
| **LOW (unconfirmed)** | The live card page no longer resolves (redirects to the bank homepage after the `.bank.in` migration) and exposes no machine-readable fee/reward table. Values are **program-standard estimates** (RuPay Select / Visa program), **not** source-confirmed. |

## Per-issuer matrix

| Issuer | Cards | Source | Confidence | PDFs archived | Corrections found | PR |
| --- | ---: | --- | --- | ---: | --- | --- |
| HDFC | 27 | per-card T&C/MITC PDFs | HIGH (pdf) | 120 | (pre-session audit) | #39 |
| ICICI | 23 | per-card T&C PDFs | HIGH (pdf) | 36 | (pre-session audit) | — |
| Axis | 40 | per-card T&C PDFs | HIGH (pdf) | 79 | (pre-session audit) | — |
| SBI Card | 49 | per-card T&C PDFs | HIGH (pdf) | 19 | (pre-session audit) | — |
| BOBCARD (BoB) | 23 | central Features & Rewards T&C PDF (01-Apr-2026) | HIGH (pdf) | 2 | 0 — all core/accel rates + caps + forex confirmed | #40 |
| RBL | 9 | central `CardsScheduleCharges.pdf` + per-card T&C | HIGH (pdf) | 2 | **4** — Insignia ₹10k→7k; Icon forex 2→3.5%; Maxima Plus ₹2k→2.5k; IRCTC ₹350→500 | #44 |
| IDFC FIRST | 18 | per-card Communication PDFs | HIGH (pdf) | 2 | **2** — Ashva & Mayura reward per-₹100→per-₹150 (+Ashva accel 9→10) | #41 |
| Standard Chartered | 10 | per-card T&C PDFs (av.sc.com) | HIGH (pdf) | 1 | 0 — Ultimate 11-pp T&C confirms model | #47 |
| American Express | 6 | live product pages | MEDIUM (web) | 0 | 0 — MRCC confirmed; MR values ROADMAP-sourced | #43 |
| Kotak | 19 | live pages + fees-and-charges / MITC (HTML) | MEDIUM (web) | 0 | **1** — League Platinum ₹499→₹0 (lifetime-free) | #42 |
| HSBC | 7 | live product pages | MEDIUM (web) | 0 | **1** — Premier joining ₹0→₹12,000 | #48 |
| IndusInd | 23 | live card-page tabs (no PDFs) | MEDIUM (web) | 0 | 0 — rewards/forex/lounge confirmed | #45 |
| YES Bank | 28 | live pages (MITC PDF session-gated) | MEDIUM (web) | 0 | 0 — Marquee fee confirmed; page-verified | #46 |
| AU Small Finance | 21 | live pages (HTML, no PDFs) | MEDIUM (web) | 0 | 0 — Altura confirmed; page-verified | #50 |
| Federal | 5 | HTML MITC fee table | MEDIUM (web) | 0 | **5** — Signet ₹999→750 +forex→3.5%; Imperio ₹1k→1.5k +forex→3.5%; Celesta forex→2.0% | #49 |
| OneCard | 1 | live product page | MEDIUM (web) | 0 | 0 — LTF + 5X top-2 confirmed | #51 |
| slice | 1 | live product page | MEDIUM (web) | 0 | 0 — LTF + 1%/2%-UPI confirmed | #52 |
| Bank of India | 1 | page redirects (no source) | LOW (unconfirmed) | 0 | — | #54 |
| Canara Bank | 1 | page redirects (no source) | LOW (unconfirmed) | 0 | — | #55 |
| Punjab National Bank | 1 | page redirects (no source) | LOW (unconfirmed) | 0 | — | #58 |
| Union Bank of India | 1 | page redirects (no source) | LOW (unconfirmed) | 0 | — | #59 |
| IDBI Bank | 1 | page redirects (no source) | LOW (unconfirmed) | 0 | — | #56 |
| Karur Vysya Bank | 1 | page redirects (no source) | LOW (unconfirmed) | 0 | — | #57 |
| South Indian Bank | 1 | page redirects (no source) | LOW (unconfirmed) | 0 | — | #53 |

**Totals:** 317 cards · 8 issuers HIGH (pdf) · 9 issuers MEDIUM (web) · 7 issuers LOW
(unconfirmed) · **13 corrections** found during the 2026-07-04 source-verification wave
(PR #61).

## Field-level provenance (applies within every card)

Not all fields in a card carry the same confidence, regardless of the card's tier:

| Field group | Provenance |
| --- | --- |
| `fees` (joining/annual), `forex_markup_pct`, `finance_charge_monthly_pct` | **Source-verified** for HIGH/MEDIUM issuers (the primary target of this wave). LOW = program estimate. |
| `rewards` base + accelerated **rates** (`rate`, `per_inr`, `effective_rate`) | **Source-verified** for HIGH/MEDIUM issuers. |
| Reward `cap_per_cycle` / monthly caps | Verified where the source states them (BoB/RBL PDFs do); on some cashback cards the exact monthly cap is stated only in MITC and is **noted, not always pinned** — see the card's `capping_rules`. |
| `unit_value_inr` (point/mile value) | Verified where the source states it (e.g. IDFC "1 RP = ₹0.40/0.50"); otherwise a **program-standard estimate** (points ≈ ₹0.25, cashback ₹1). `unit_value_inr_realized` is our own realistic-value estimate. |
| `eligibility.income_inr_annual`, `eligibility.credit_score_min`, `eligibility.min_age`/`max_age` | **Tier-standard defaults** (entry ₹3L/700, mid ₹6L/720, premium ₹12L+/750), filled during the inline-TODO cleanup — **not individually source-verified** unless the source stated them. |
| `launched_on` | Where known/stated; several are conventional/approximate and **not source-verified**. |
| `network` / `network_tier` | Verified where stated; some are documented inferences (UPI cards → RuPay; else the card's stated network). |
| `mcc_exclusions: ['6513']` (rent) | Applied universally per each issuer's reward T&C (rent excluded from accrual). |

## How the sources were obtained
- **PDFs** were downloaded with `curl` from the issuer's document host and read with
  **`pypdf`** (the repo's PDF text extractor of record — the environment lacks poppler,
  so the Read tool cannot render PDFs). They live under `docs/sources/<issuer>/<card>/`
  or `.../\_shared/`, gitignored, with a tracked `_manifest.json` + `INDEX.md`.
- **HTML** pages were read with Playwright via `document.body.textContent` (which captures
  JS-tab content that `innerText` drops).

## Caveat
A **MEDIUM/HIGH** tag means the card's *primary* fields (fees, reward rates, forex) were
checked against the issuer's own source on the date shown — it is not a guarantee that
every sub-field is exhaustively pinned (see field-level table above). **LOW** cards should
be treated as unverified estimates. Always re-confirm against the issuer before relying on
any figure for a financial decision.
