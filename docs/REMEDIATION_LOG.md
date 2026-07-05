# Data & Evidence Remediation Log — 2026-07-05

Execution of `docs/superpowers/plans/2026-07-05-data-remediation.md` on branch
`data-remediation-2026-07`. Every commit gated on `validate.py` (0 errors),
`npm --prefix site test` (86/86), and `prebuild`.

## Board items closed

| Item | What shipped |
| --- | --- |
| **D1** | BOI Select (₹800/₹0) + SIB Platinum (₹2,999/₹2,999) fees confirmed vs issuer sources → confidence high; BOI's unverified ₹2L fee-waiver removed (not issuer-documented). |
| **D2** | KVB Honour withdrawal concern **refuted** — live KVB product page (Visa); kept active, documented. |
| **D6** | All 5 co-brand `loyalty_program` alias warnings cleared (bob-irctc, sbi air-india ×2, sbi tata-neu ×2) with value-neutral `card_attributable_rate` decomposition; sbi-aurum microsite added to the allowlist. validate.py → 0 warnings. |
| **D7** | bob/idfc-first/rbl/standard-chartered manifests normalized to the per-card PDF-map shape. |
| **D8** | `scripts/audit_stamps.py` added; 6 stamp mismatches reconciled (bulk-sweep date → `last_swept_on`, `last_verified_on` restored to newest source). |
| **D14** | Scapia coin value (₹0.20, 5 Coins = ₹1) independently verified vs Scapia's own blog; realized≈face confirmed; no-cap notes added (closes Scapia's D20 deferral); engine replay confirms Scapia no longer tops travel. |
| **D16** | HDFC SmartBuy verified vs the live JS-rendered T&C: caps unchanged (15k/7.5k), **flights 10X→5X** (hotels stay 10X) — close-and-appended infinia + diners-black (split hotels/flights); new 3,000 RP brand-voucher sub-cap noted. |
| **D20** | `scripts/audit_uncapped.py` (baseline 50, now flags documented rows). Over 3 research rounds: sourced numeric caps on 11 accelerators, genuine-no-cap `capping_rules` notes on ~35, and 5 rate-model errors surfaced + logged (not fabricated into caps). |
| **D29** | `scripts/crawl_diff.py` drift tool — TDD presence-checker core + Playwright shell + `docs/drift/README.md` + first hsbc report. |
| **D30** | axis-google-pay-flex network=RuPay confirmed (high); UPI-first CC-on-UPI documented. |
| **D31** | Co-brand↔loyalty alias lint promoted warning→error (verified fires on regression). |

## Partially advanced (open)

- **D3** — machine-readable evidence refs (`type/confidence/local_refs/fields_verified`)
  added for 4 HDFC PDF-backed cards (freedom, upi-rupay, phonepe-uno/ultimo) from
  the 2026-07-03 PDF-verification pass. Remaining HDFC cards + axis/icici/sbi to follow.

## Still open (not started this session)

- **D4** (stale-URL sweep beyond HDFC), **D5/D11** (PSU/coverage expansion),
  **D12** (authored applicability), **D15** (iShop/Amex Travel portals).

## Rate-model flags for a dedicated audit (`docs/drift/D20-deferrals-2026-07.md`)

Research surfaced modelled accelerators unsupported by issuer evidence (no cap
applied — can't cap a rate the issuer doesn't document): `indusind-pinnacle`,
`indusind-eazydiner-platinum`, `kotak-white-reserve`, `sbi-landmark-prime` (25-RP
variant), `au-ixigo` (rate), `rbl-irctc` (rail earn model).

## Final state (2026-07-05)

- `validate.py`: 319 cards, **0 errors, 0 warnings**.
- `audit_uncapped.py`: 39 uncapped ≥3% — **4 undocumented, all logged deferrals**.
- `audit_stamps.py`: 0 mismatches.
- Site: 86/86 tests, prebuild + typecheck clean.
