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
- **D4** — `validate.py --check-urls` sweep of all 319 cards; 6 stale Axis
  apply_urls repointed to axis.bank.in (verified 200); the other 54 flags triaged
  (transient / discontinued / needs per-card research) in `docs/drift/url-sweep-2026-07.md`.
- **D15** — ICICI iShop DONE (5 cards, channel-gated 12X/6X + per-tier caps);
  Amex Travel Online researched but deferred (403-blocked source, small +1/₹100 delta).
- **D5** — PNB RuPay Platinum + Union NEXTERIA researched and teed up in
  PORTFOLIO-GAPS; each blocked on one issuer-unpublished value (no fabrication).

## Still open

- **D3** remainder (axis/icici/sbi evidence fields), **D4** per-card 404s,
  **D11** (Burgundy Private / ICICI Mine / Kotak Mojo status), **D12** (authored
  applicability — needs published spend-share data; D-18 forbids invented
  fractions, so likely stays at the optimistic-on-selected-brand default),
  **D15** Amex Travel leg.

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

## 2026-10-20 link-check remediation (claude/remediate-links)

2026-10-20 | link check: 20 host-moved URLs | issuer websites + HSBC card URLs moved to .bank.in; hsbc.bank.in allowlisted in validate.py | 59f6188
2026-10-20 | link check: 404s | IDFC first-private/power/power-plus/swyp, YES marquee, Kotak indigo-xl apply_url repointed; evidence comments on discontinued pvr-gold/zomato-edition/premia | 9f32a18
2026-10-20 | amex/mrcc fee waiver | full waiver ₹90,000 -> ₹1,50,000 (official page; ₹90k was the 50% tier) | 9e47a71
2026-10-20 | link check: axis/magnus archive, amex/centurion | Magnus repointed to a 2023-06-04 Wayback snapshot; Centurion annotated | 9e85771
2026-10-20 | link check: sbi/aurum historical sources | SKIPPED: aurum.page was never archived; the current page (aurum-sbi-card.html) cannot back pre-Nov-2024 records | user decision
2026-10-20 | link check: sbi/elite-business, sbi/prime-business | SKIPPED: no issuer page and no discontinuation notice found; status left active | user decision
2026-10-20 | rbl/zomato-edition discontinued_on | SKIPPED: evidence puts sunset ~2023-05-14 but launched_on is 2023-03-01 (inconsistent); date fix left for a dedicated pass | user decision

## 2026-10-20 TODO items D4 / D5 / D11 / D12 (remediate/d4-d5-d11-d12)

2026-10-20 | D11 axis/burgundy-private | still open (relationship-gated, already held); annual fee Rs 50k -> Rs 1 lakh + GST from 01-09-2026 (only if TRV < Rs 5 Cr), Priority Pass dropped for domestic lounges from 28-08-2026; records closed and appended from the Axis revision-notice PDF | d2c983e
2026-10-20 | D11 icici Mine, kotak Mojo Platinum | not added: Mine pages redirect and it is absent from ICICI's 09-10-2026 MITC; Kotak labels Mojo "(Discontinued)" | d2c983e
2026-10-20 | D4 source-URL audit | 379 URLs checked; 10 redirects + 7 issuer/network websites + 2 IndusInd soft 404s repointed; 6E Rewards (100 RP dining cap, discontinued_on 2025-11-01), Tata Neu Infinity (fuel cap Rs 500) and Aurum re-sourced from issuer pages; report docs/SOURCE-URL-AUDIT-2026-10-20.md | e7c249b
2026-10-20 | D4 idfc-first/indigo, yes/paisabazaar rate revisions | SKIPPED: issuer pages show new earn structures with no effective date or caps; logged as TODO P8/P9 | no fabrication
2026-10-20 | D4 axis/olympus, kotak/myntra-kaching, icici/manchester-united-signature status | SKIPPED: no issuer status notice; logged as TODO P10/P11 | needs decision
2026-10-20 | D5 PSU premium tier | added pnb-rupay-platinum, pnb-luxura-rupay, pnb-luxura-visa, union-nexteria, union-unicorn, union-divaa-icon (326 cards); RuPay `ekaa` tier; union-rupay-select fees corrected from MITC v1.4 | 0cca697
2026-10-20 | D5 PNB Rakshak Platinum/Select, Wave & Pay | SKIPPED: base earn rate not issuer-stated (Rakshak), fees unclear (Wave & Pay) | no fabrication
2026-10-20 | D12 applicability_pct | method DECISIONS D-25; Amazon Pay ICICI Amazon.in accelerators = 25, Swiggy HDFC Swiggy accelerator = 3; Tata Neu left unset (no published share) | 516ed16

Gates on every commit: `validate.py` OK; `npm --prefix site run prebuild` OK;
`npm --prefix site test` 234/234.
