# Agent TODO

Last refreshed: 2026-07-04

This is the canonical work queue for agents. Historical audit docs are evidence,
not task lists. If an item from an old audit still matters, promote it here
before starting work.

## Ground Rules

- Do not delete, move, compress, or rename PDFs under `docs/sources/**/*.pdf`.
- Work one task ID at a time unless the tasks explicitly say they should be
  bundled.
- Read the listed files before editing. Most tasks touch data contracts and can
  create subtle ranking changes.
- Preserve history: update `docs/MAINTENANCE_HISTORY.md` for repo cleanup,
  source archive changes, branch/GitHub cleanup, or broad data migrations.
- Validation is part of the task. If a command cannot run locally, record the
  blocker and why.

## Current State

- Dataset: 317 card YAML files across 24 issuers.
- Generated site data: `dist/*.json`, rebuilt by `site/scripts/prebuild.mjs`.
- Local PDF archive: 261 PDFs under `docs/sources/**/*.pdf`.
- Validation reproducibility (A0): resolved. `scripts/requirements.txt` now pins
  `attrs` explicitly, so `pip install -r scripts/requirements.txt` followed by
  `python scripts/validate.py` runs cleanly in a fresh environment (317 cards,
  0 errors). Local command sequence matches CI; documented in README + CONTRIBUTING.
- Last known passing checks:
  - `npm.cmd --prefix site run prebuild`
  - `npm.cmd --prefix site test -- --run`
  - `npm.cmd --prefix site run typecheck`
  - `npm.cmd --prefix site run build`

## Execution Plans (2026-07-05)

Every open item below is decomposed into ready-to-execute plans:

- **Data & evidence remediation** (D1–D16, D20, D29–D31): `docs/superpowers/plans/2026-07-05-data-remediation.md`
- **Site visual redesign after competitor benchmarking** (D25, D9, C3 residuals): `docs/superpowers/plans/2026-07-05-site-visual-redesign.md`

Fresh sessions: read the plan header, create the branch it names, and execute task-by-task.

## Pick-Up Board

| ID | Priority | Area | Suggested Agent | Status | Task |
| --- | --- | --- | --- | --- | --- |
| A0 | P0 | Validation | backend/data | Done | Pinned `attrs`; validate.py reproducible + documented (README/CONTRIBUTING); matches CI. |
| A1 | P0 | Recommender | backend/product | Done | Empty channel selection now blocks channel-locked accelerators (calculator stays optimistic). |
| A2 | P0 | Calculator | backend/product | Done | Applicability model (authored, never fabricated) + mcc_exclusions reduce score. See DECISIONS D-18/D-19. |
| A3 | P1 | Recommender | backend/product | Done | Lounge value gated by `spend_threshold_inr`/`_cycle` with caveats. |
| A4 | P1 | Recommender | backend/product | Done | Milestone valuation uses `trigger_window`/`is_repeatable`/`max_awards_per_cycle`; types synced. |
| B1 | P1 | Evidence | data/schema | Done | Source.type/confidence/local_refs/fields_verified added; validate.py checks refs; sbi-cashback + hdfc-swiggy migrated. |
| B2 | P1 | Sources | data/docs | Done | Every source dir now has both INDEX.md and _manifest.json (axis/icici/sbi + indusind/kotak). |
| B3 | P1 | Sources | data/docs | Done | Two low-text PDFs (axis flipkart, icici voucher-manual) marked in INDEX.md + _manifest.json for OCR. |
| B4 | P1 | Data quality | data | Done | 11 HDFC card URLs migrated to hdfc.bank.in (each Playwright-verified; 2 stale manifest 404s fixed); marriott-bonvoy aggregator source replaced. |
| B5 | P2 | Data quality | data | Done | All 7 small-bank cards verified vs issuer PDFs/pages (major corrections found); full catalogues surveyed in docs/PSU-BANK-PORTFOLIOS-2026-07.md. |
| C1 | P2 | Portfolio | data/product | Done | PORTFOLIO-GAPS.md refreshed to 317 cards; prior high-value gaps reconciled/closed. |
| C2 | P2 | Schema | data/schema | Done | Recorded DECISIONS D-20: split network variant to its own file only on material term difference. |
| C3 | P2 | Site UX | frontend | Open | Fix page/navigation issues from the site review. |

## Task Cards

### A0 - Make Validation Reproducible

Goal: every agent can run the same database-level validation locally before
opening a PR.

Start with:

- `scripts/validate.py`
- `scripts/requirements.txt`
- `site/scripts/validate-schema.mjs`
- `.github/workflows/validate.yml`
- `docs/SCHEMA.md`

Steps:

1. Fix the Python dependency path or port cross-file lints into Node.
2. Ensure local validation checks issuer/network joins, dated-record overlap,
   channel tokens, replaces-card references, source date ordering, and category
   tagging.
3. Document the exact local command in `README.md` and `docs/CONTRIBUTING.md`.

Done when:

- Fresh environment setup can run the validation command.
- The command catches cross-file mistakes before `dist/*.json` is generated.
- CI and local instructions match.

Validation:

- `python scripts/validate.py` or the replacement Node command
- `npm.cmd --prefix site run prebuild`
- `npm.cmd --prefix site test -- --run`

### A1 - Fix No-Channel Recommender Optimism

Goal: `/recommend` should be realistic by default. If the user does not opt into
a partner, issuer portal, airline, food, fuel, or shopping channel, channel-
locked accelerators should not be used for ranking.

Start with:

- `site/lib/recommender.ts`
- `site/lib/calculator.ts`
- `site/lib/recommender.test.ts`
- `site/lib/calculator.test.ts`

Steps:

1. Pass an empty `channelMix` from recommender when no channel is selected.
2. Keep `/calculator` optimistic only if that is still intentional.
3. Add tests proving no selected channel does not unlock SmartBuy, Travel EDGE,
   co-brand direct, or similar accelerators.

Done when:

- Recommendation rankings do not use channel-locked rates without user signal.
- Result caveats still explain channel usage when channel rates are used.

Validation:

- `npm.cmd --prefix site test -- --run lib/calculator.test.ts lib/recommender.test.ts`
- `npm.cmd --prefix site run typecheck`

### A2 - Model Merchant And MCC Applicability

Goal: broad category spend should not be treated as 100% eligible for a narrow
merchant, MCC, or co-brand accelerator.

Start with:

- `schema/card.schema.json`
- `site/lib/calculator.ts`
- `site/lib/recommender.ts`
- `site/lib/category-mapping.ts`
- `data/channels/known.yaml`
- issuer MCC map docs under `docs/*-mcc-map.md`

Steps:

1. Define an applicability model for `merchant`, `mcc_list`, and `channel`.
2. Decide conservative defaults when a user only enters broad bucket spend.
3. Add tests for co-brand online spend, issuer portal travel, fuel networks,
   and MCC-excluded categories.

Done when:

- Merchant-only rates are not applied to the entire online/dining/travel bucket.
- MCC exclusions affect scoring, not only result disclaimers.
- Existing cards still build without schema churn beyond the intended migration.

Validation:

- `npm.cmd --prefix site test -- --run`
- `npm.cmd --prefix site run prebuild`
- `npm.cmd --prefix site run typecheck`

### A3 - Gate Lounge Value By Spend Thresholds

Goal: lounge access with prior-cycle spend requirements should only be valued
when the modeled user spend can plausibly unlock it.

Start with:

- `schema/card.schema.json`
- `site/lib/recommender.ts`
- `site/lib/recommender.test.ts`
- `docs/LOCAL_DATA_PDF_REVIEW_2026-07-04.md`

Steps:

1. Use `spend_threshold_inr` and `spend_threshold_cycle` in lounge valuation.
2. Decide how to handle first-card grace periods and unknown prior spend.
3. Add tests for Axis/HDFC-style quarterly thresholds.

Done when:

- Lounge-heavy cards are not overvalued for users below the unlock threshold.
- Result caveats explain threshold assumptions.

Validation:

- `npm.cmd --prefix site test -- --run lib/recommender.test.ts`
- `npm.cmd --prefix site run typecheck`

### A4 - Use Rich Milestone Metadata

Goal: milestone valuation should respect first-year, anniversary-year, rolling,
repeatable, and capped awards.

Start with:

- `schema/card.schema.json`
- `site/lib/types.ts`
- `site/lib/recommender.ts`
- `site/lib/recommender.test.ts`
- cards with rich milestones such as Amex MRCC and Platinum Travel

Steps:

1. Bring consumer types in line with generated schema fields.
2. Update milestone valuation to use `trigger_window`, `is_repeatable`, and
   `max_awards_per_cycle`.
3. Add tests for repeatable monthly milestones and tiered annual ladders.

Done when:

- Rich milestone fields materially affect valuation.
- Hand-authored types no longer hide schema-supported milestone fields.

Validation:

- `npm.cmd --prefix site test -- --run lib/recommender.test.ts`
- `npm.cmd --prefix site run typecheck`

### B1 - Add Machine-Readable Evidence References

Goal: card fields should be traceable to issuer pages, PDFs, and local evidence
without reading prose audit notes.

Start with:

- `schema/card.schema.json`
- `docs/SCHEMA.md`
- `docs/PROVENANCE.md`
- `docs/sources/*/_manifest.json`
- `docs/LOCAL_DATA_PDF_REVIEW_2026-07-04.md`

Steps:

1. Propose fields such as `source.type`, `source.confidence`,
   `source.local_refs`, and `source.fields_verified`.
2. Migrate a small issuer first, preferably one with local PDFs.
3. Add validation for broken local refs.

Done when:

- At least one issuer's key card fields link to local source evidence.
- The model can scale to the rest of the archive.

Validation:

- Schema validation
- Cross-file validation from A0
- Manual check that referenced local files exist

### B2 - Normalize Source Manifests And Indexes

Goal: all source archive directories should have the same manifest/index shape.

Start with:

- `docs/sources/*/_manifest.json`
- `docs/sources/*/INDEX.md`
- `docs/PROVENANCE.md`
- `docs/LOCAL_DATA_PDF_REVIEW_2026-07-04.md`

Known gaps from the docs inventory:

- `axis`, `icici`, and `sbi` have manifests and PDFs but no `INDEX.md`.
- `indusind` and `kotak` have `INDEX.md` but no `_manifest.json`.

Done when:

- Every issuer under `docs/sources/` has a tracked `INDEX.md`.
- Every issuer under `docs/sources/` has a tracked `_manifest.json`.
- No PDFs are deleted or moved.

Validation:

- Script or shell inventory showing all source dirs have both files.
- `git status --short` confirms PDFs remain untracked/ignored.

### B3 - Mark Low-Text PDFs For OCR Or Manual Review

Goal: preserve PDFs while identifying which files cannot be trusted for text
extraction.

Start with:

- `docs/LOCAL_DATA_PDF_REVIEW_2026-07-04.md`
- `docs/sources/**/INDEX.md`
- `docs/sources/**/_manifest.json`

Done when:

- Low-text PDFs are marked in source indexes/manifests.
- Follow-up owners know whether to use OCR, manual reading, or alternate URLs.
- No PDF files are modified.

### B4 - Replace Stale Or Migrated Source URLs

Goal: prefer current issuer-owned URLs over stale domains or aggregators.

Start with:

- `data/cards/**/*.yaml`
- `docs/PROVENANCE.md`
- issuer audit files, especially HDFC notes

Suggested first pass:

- HDFC `hdfcbank.com` to `hdfc.bank.in` where archived evidence supports it.
- Cards whose primary source is an aggregator while issuer evidence exists.

Done when:

- Source URLs are current or explicitly noted as historical.
- `metadata.last_verified_on` and nested `source.retrieved_on` remain coherent.

Validation:

- Cross-file validation from A0
- `npm.cmd --prefix site run prebuild`

### B5 - Improve Low-Confidence Small-Bank Cards

Goal: raise low-confidence issuer records before treating them as verified.

Start with:

- BOI, Canara, IDBI, KVB, PNB, South Indian, Union card YAML
- `docs/PROVENANCE.md`
- corresponding source indexes/manifests

Done when:

- Each touched card has issuer-owned source evidence or a clear low-confidence
  note explaining the gap.
- Any guessed fields are either sourced, removed, or explicitly marked.

### C1 - Refresh Portfolio Gap Analysis

Goal: make `docs/PORTFOLIO-GAPS.md` reflect the 317-card dataset.

Start with:

- `docs/PORTFOLIO-GAPS.md`
- `dist/cards.json`
- `data/cards/**/*.yaml`

Done when:

- The document no longer references the old 127-card catalogue as current.
- Missing products and non-actionable variants are separated.

### C2 - Decide Network-Variant Modelling

Goal: decide when Visa/Mastercard/RuPay/Amex variants are separate cards versus
one card with variant fields.

Start with:

- `schema/card.schema.json`
- `docs/SCHEMA.md`
- `docs/DECISIONS.md`
- issuer audit notes that mention network uncertainty

Done when:

- A decision is recorded in `docs/DECISIONS.md`.
- Follow-up migrations are listed here or closed.

### C3 - Fix Site Navigation Issues

Goal: resolve the UX/navigation issues found in the site review.

Start with:

- `site/app/layout.tsx`
- `site/app/browse/browse-client.tsx`
- `site/app/compare/compare-client.tsx`
- `site/app/recommend/recommend-client.tsx`
- `site/app/card/[issuer]/[slug]/page.tsx`

Issues to address:

- Detail pages can link discontinued/on-hold/invite-only cards into tools where
  the selected card disappears.
- Browse and compare read URL params only on first mount.
- Mobile browse puts a long filter list before results.
- Header navigation likely overflows on narrow screens.
- Recommend wizard marks skipped steps as completed.
- Public recommend results expose a debug payload panel.

Validation:

- `npm.cmd --prefix site run build`
- Browser/manual checks for desktop and mobile navigation

## Competitor review (cardexpert.in best-cards-2026, 2026-07-04)

Cross-checked CardExpert's recommended cards against our DB. We hold most; gaps
and learnings:

| ID | Priority | Area | Task |
| --- | --- | --- | --- |
| D23 | Done | Portfolio | **Added Equitas Bank** (25th issuer) + `equitas-powermiles` and `equitas-selfe`, both issuer-sourced (equitas.bank.in via Playwright). Tiga + HDFC-Equitas co-brands not added (CardExpert didn't recommend). |
| D24 | Done | Portfolio | **HSBC TravelOne was NOT missing** (id `hsbc-travelone`; my cross-check used the wrong id). Competitor-verify instead found + fixed errors: Mastercard/World (was Visa), forex 3.5% (was 2%), waiver â‚¹8L (was â‚¹12L), added 6 domestic lounge visits. (HDFC Diners BizBlack = business card, out of scope.) |
| D25 | P2 | Site UX | **Learn from CardExpert's presentation:** recommend by spending-capacity tier (income + annual spend) AND spending pattern (dining/online/forex/utilities) with a one-line reason per card â€” not one universal pick. This matches the decoupled-scorer direction (category-aware, transparent line items). Consider tiered/pattern-based result grouping on the site. |
| D26 | P2 | Data quality | **Competitor-verify more high-traffic cards** (the HSBC TravelOne pass found 4 errors). Progress: Axis Atlas spot-checked = correct (2+5 EDGE Miles, tiered â‚¹3L/7.5L/15L milestones, 8+4 lounge). **Forex markups systematically verified SOUND** â€” of 65 sub-2% cards, all are genuinely low/zero-forex (Scapia 0%, IDFC WOW/Mayura 0%, IndusInd 1.5%, SBI Elite/Amazon-ICICI 1.99%); no stale cluster. Continue spot-checking reward rates/caps on remaining top cards. |

## Follow-up backlog (opened 2026-07-04, from the A0â€“C3 audit)

These emerged while completing the A/B/C board. Promote into the Pick-Up Board
when picked up.

| ID | Priority | Area | Task |
| --- | --- | --- | --- |
| D1 | P1 | Data quality | Confirm the aggregator-sourced fees left at `confidence: medium` against issuer Schedule-of-Charges PDFs: BOI Select (â‚¹800/â‚¹2L waiver), South Indian SBI Platinum (â‚¹2,999), KVB Honour (whole card). Upgrade to high or correct. |
| D2 | P1 | Data quality | Verify `kvb-honour` status â€” the KVB `.bank.in` site no longer exposes an "Honour" page (only a generic card + KVB-SBI co-brands). Confirm rename/withdrawal; mark discontinued or re-model if needed. |
| D3 | P1 | Evidence | Scale the B1 machine-readable evidence fields (`source.type/confidence/local_refs/fields_verified`) across the archive, issuer by issuer. Only ~9 cards carry them today (2 exemplars + 7 PSU). |
| D4 | P1 | Data quality | Extend the B4 stale-URL / aggregator-primary sweep beyond HDFC: audit every issuer's `source.url` for redirects/404s and aggregator-primary sources (Playwright-verify replacements). |
| D5 | P2 | Portfolio | Expand the PSU catalogues into sourced YAML (see `docs/PSU-BANK-PORTFOLIOS-2026-07.md`). Start with PNB RuPay Platinum / Rakshak / LUXURA and Union premium tier (NEXTERIA / Unicorn / DIVAA). Source terms before adding. |
| D6 | P2 | Data | Resolve the 6 standing validator warnings â€” `co_brand.partner` â†” `loyalty_program` alias links (bob-irctc, sbi air-india Ã—2, sbi tata-neu Ã—2) and the sbi-aurum apply_url microsite. |
| D7 | P2 | Sources | Normalize the audit-note manifests (bob / idfc-first / rbl / standard-chartered) into per-card PDF maps, matching axis/hdfc/icici/sbi (LOCAL_DATA_PDF_REVIEW cleanup #1). |
| D8 | P2 | Data | Reconcile the 31 `metadata.last_verified_on` vs nested `source.retrieved_on` mismatches (LOCAL_DATA_PDF_REVIEW issue #4); explain via `last_swept_on` or notes. |
| D9 | P2 | Site UX | Browser-QA the C3 responsive fixes (mobile results-before-filters, header wrap) on real viewports via Playwright/webapp-testing â€” they compile but weren't visually confirmed. |
| D10 | P2 | Schema/data | Execute the C2 (D-20) network-variant migrations: HDFC Tata Neu Infinity/Plus RuPay-UPI variants; verify whether ICICI Coral/Rubyx/Sapphiro Amex differ materially before splitting. |
| D11 | P2 | Portfolio | Verify open status of the 3 still-absent big-bank cards (Axis Burgundy Private, ICICI Mine, Kotak Mojo Platinum) and add if open + sourced (`docs/PORTFOLIO-GAPS.md`). |
| D12 | P3 | Recommender | Author `accelerated[].applicability_pct` from evidence for high-traffic co-brand cards (Amazon ICICI, Swiggy HDFC, Tata Neu, â€¦) so /recommend credits their real bucket slice instead of falling back to base (A2 / D-18). |
| D13 | ~~P1~~ Closed | Data quality | **FALSE ALARM â€” already correct.** On inspection, `kotak-indigo`, `kotak-indigo-xl`, `sbi-indigo`, `sbi-indigo-elite`, `idfc-first-indigo` all already carry `card_attributable_rate` (3/5/6/7) + `stacks_with_program`, so the calculator uses the card-side earn, not the receipt-total `effective_rate`. The original concern came from a red-team script that measured `effective_rate` directly. Fix applied instead to the *scorer's flag* (2026-07-05): don't flag channel-gated co-brand rates, and prefer `card_attributable_rate` â€” so these cards no longer mis-flag. (Verify HDFC 6E cards separately if not decomposed.) |
| D14 | P2 | Data quality | **`bob-scapia` travel accelerator is an outlier** â€” 20% "on travel" with `channel: null` and coins valued at â‚¹1. Scapia Coins are earned only on Scapia-app bookings and redeemable in-app; add a `scapia-app` cobrand-merchant channel and a realistic coin value so it doesn't top travel rankings for non-Scapia bookings. Cross-check `federal-scapia`. |
| D15 | P2 | Coverage | **Issuer-portal ecosystems ICICI iShop and Amex Travel are not modelled** â€” no accelerators exist for them, so travel/shopping comparisons silently omit ICICI/Amex portal value. Add the iShop and Amex Travel channels + accelerators (with caps) to the relevant cards. |
| D17 | Done | Recommender | **Brand preferences are inert** â€” RESOLVED in two stages. The described applicability collapse was already fixed (scorer runs optimistic-on-selected-brand, no `applyApplicability`; test locks brand-lift at real rate). 2026-07-05 (5b3acfb): the residual INVERSE found by audit â€” 54 merchant-only accelerators (merchants[] no channel) fired for every user regardless of picks â€” now gated by `merchantSatisfied()`; different brand picks produce different rankings (test-locked). Remaining honest gaps tracked in D34 (data channel blocks) and D12 (authored applicability for partial-share evidence). |
| D18 | Done | Recommender | **Unbounded benefit proxies dominate the rank** (F3/F4/F5). Milestones (â‚¹1.44L phantom on Amex Reserve), lounge (â‚¹96k for "unlimited"), and welcome (one-time Ã·2) routinely dwarf real rewards. Decouple: rank on steady-state spend value; show welcome/milestone/lounge as separate capped line items; bound each proxy (lounge by usage input, milestone by % of trigger). |
| D20 | P1 | Data quality | **Uncapped high-rate accelerators â€” SYSTEMIC.** 66 of 304 active cards (22%) have an uncapped accelerator â‰¥3% effective (10 cards â‰¥10%: axis-airtel ~25%, bob-scapia ~20%, phonepe/hsbc/yes-byoc/idfc-gaj ~10%). Mix of genuinely-missing `cap_per_cycle` (add from issuer T&C) and the D13 BluChip decomposition inflation (idfc/kotak/sbi-indigo). This materially corrupts recommender rankings (F7). Audit all 66; add caps or `card_attributable_rate`. |
| D21 | Done | Data quality | **Co-brand accelerator not channel-gated.** `sbi-flipkart` earns its elevated online rate on *any* online spend (its accelerator has no `channel`), so it surfaces for an Amazon shopper. Gate co-brand accelerators to their merchant. **Done:** sbi-flipkart, bob-scapia, federal-scapia. |
| D22 | Done | Data quality | **13 more ungated co-brand accelerators** (same pattern as D21; `merchants[]` present but no `channel`, so the elevated rate fires on generic category spend). Gate each to its merchant (add tokens to `data/channels/known.yaml` under the right class): `amex-smartearn` (zomato/ajio/nykaa/bookmyshow/uber/flipkart/easemytrip), `au-ixigo` (ixigo/confirmtkt/abhibus), `axis-ace` (google-pay bills/recharges), `axis-airtel` (airtel-thanks-app), `axis-fibe` (swiggy/zomato), `axis-flipkart` (swiggy/pvr/uber/cult.fit), `axis-flipkart-super-elite` (flipkart), `axis-indianoil` (ioclâ†’fuel-network), `axis-shoppers-stop` (shoppers-stop), `axis-spicejet-voyage-black` (spicejet), `icici-mmt` (mmtâ†’third-party-ota), `indusind-eazydiner-platinum` (eazydiner), `sbi-landmark-prime`/`-select` (Landmark stores), `sbi-reliance-prime` (ajio/jiomart). |
| D19 | Done | Recommender | **No sanity/robustness guards** (F2/F6/F7/F10) â€” resolved 2026-07-05 (9edfe25) as warn-don't-fudge. The failure modes are covered by factual flags (implausible uncapped rate, category mismatch, implausible milestone) + the 2026-07 data remediation + this branch's engine fixes; red-team replay locks in `site/lib/red-team.test.ts` prove no adversarial single-bucket profile produces an absurd unflagged result on live data. Rate clips and category down-weights were considered and REJECTED â€” invented coefficients in the rank violate the no-invented-values principle. |
| D16 | P2 | Data quality | **Verify HDFC SmartBuy multiplier/cap freshness.** Infinia/Diners Black SmartBuy is modelled at 10X (caps 15,000 / 7,500 RP per month). HDFC has revised SmartBuy multipliers, caps and category exclusions repeatedly â€” confirm the modelled 10X + monthly point caps against current live SmartBuy T&C for flights/hotels, and note the effective category rules. |

## Engine deep-dive backlog (opened 2026-07-05, from the graphify architecture dive)

These emerged from the knowledge-graph deep dive of database/logic/engines.
Worked by `/loop /cc-engine-dive` (code/logic lane) unless noted.

| ID | Priority | Area | Task |
| --- | --- | --- | --- |
| D27 | Done | Code quality | **Category rules already single-sourced** â€” verified 2026-07-05: `site/scripts/build.mjs` emits `dist/category_rules.json` from `scripts/category_rules.yaml` and `category-mapping.ts` imports it (commit 90794bb). The stale "mirrors these rules in code today" comment in the YAML header was the false signal; comment fixed. |
| D28 | Done | Booking engine | **engine_v2.py red-team flaws R1â€“R7** â€” engine-side items complete 2026-07-05. Cap/MCC scoping (D33, c8de69f); channel gating (c937ac6): `channel.required` accelerators count only in the absolute ceiling, never the realistic floor â€” routing optimism lives with value optimism, layers never blended (replay: realistic travel top is now a plausible 8.6%; Infinia SmartBuy shows in the ceiling column only). Ranking by the realized floor is the documented honest default, not an asymmetry bug. Portal-markup modelling (R1) is `booking-savings/holistic.py` + `site/lib/booking.ts` territory BY DESIGN (net-cost model with sourced markups) â€” not an engine_v2 defect. |
| D29 | P2 | Automation | **Crawl-diff drift detection** (proposed in `docs/hdfc-audit.md` Â§5). The audits proved `retrieved_on` stamps alone can't be trusted (provenance drift). Build a repeatable Playwright script that diffs each live card page against YAML key fields per issuer and reports drift as TODO rows. SCOPED DESIGN (2026-07-05): `scripts/crawl_diff.py --issuer <id>` â€” (1) read each card's open records + `source.url`; (2) render via Playwright (most issuer pages are JS-only per the audits); (3) regex-hunt the page text for the YAML's own literal values (annual fee â‚¹N, joining fee, base rate "X per â‚¹Y", cap numbers, forex %) â€” report MATCHED / NOT-FOUND / CONFLICTING-NUMBER-NEARBY per field, never parse the page into a schema; (4) emit `docs/drift/<issuer>-YYYY-MM-DD.md` with per-card rows; (5) exit nonzero on conflicts only. Run one issuer per invocation (rate-limit friendly); .bank.in redirects logged as drift. This is presence-checking, not scraping â€” cheap, robust to layout, and exactly what the manual audits did by hand. |
| D30 | P3 | Data quality | **axis google-pay-flex network unresolved** (flagged AMBIGUOUS in the Axis audit follow-ups: "likely RuPay/UPI", network field unconfirmed). Confirm network + UPI capability from an issuer source and set it. |
| D31 | P3 | Validation | **Promote warn-tier lints to error at zero offenders** (promotion pattern, `docs/ROADMAP.md`). After D6 clears the 6 co-brand alias warnings, flip that lint to error so regressions fail CI; sweep for other warn-tier lints already at zero. |
| D32 | Done | Tests | **Regression locks for the three historical rate-pipeline bugs** â€” complete 2026-07-05 (6417f3b). A1 units-as-percent locked; per_inr<=0 locked across formatAcceleratedRate, ratesFlags, and computeHeadlineRatePct (extracted to site/lib/headline-rate.mjs since build.mjs runs main() at import); three-consumer consistency test (build badge = calculator = detail-derivations) added for points + cashback records. The per_inr denominator class (HDFC 150-vs-200) remains a data-verification concern (D16/D26 lane), not a code lock. |
| D33 | Done | Booking engine | **engine_v2.py diverges from the site engines** â€” complete 2026-07-05 (7bc1617 + c8de69f). Rate side: `effective_per_inr` honoured, `effective_rate: 0` semantics, `card_attributable_rate` preferred (D-8), cap_unit defaults to points. Cap side: cap-aware selection (realised value, not headline rate), base `cap_per_cycle` + `reward_cap` clamps, `mcc_exclusions` category zeroing. 9-test file added. Remaining booking-model gaps (portal-markup, forex fraction, locked flag) are R1â€“R7 scope â†’ D28. |
| D34 | Done | Data quality | **D22 expansion â€” ungated-accelerator sweep COMPLETE 2026-07-05** (54522c0, 99c66b6, 2aa903d, 29d9f7f): 52 accelerators gated across 36 cards in four chunks (D22 scope, fuel-network co-brands, high-severity partner lists, ecosystems, final stragglers). Residual scan reports ZERO accelerators with merchants[] and no channel across all 319 cards; 51 tokens added to known.yaml. NOT covered (no merchants[] to gate on â€” needs T&C-sourced authoring, cc-remediate lane): sbi-paytm, sbi-paytm-select, sbi-phonepe-purple app-ecosystem accelerators, and axis-spicejet-voyage's broad online-* 6% rates. Cap authoring for uncapped rates remains D20. |
| D35 | Done | Tests | **Cap-conversion test gaps** â€” complete 2026-07-05 (6417f3b + 3c0d358): miles/annual/"unlimited"/per-txn/points-base-cap all locked; cashback-cap-fallback bug fixed; the `spend-inr` base/reward_cap authoring trap closed with a warn-tier validator lint (verified firing; zero live offenders; accelerator spend-inr caps remain supported). |

## Completed Recently

- **2026-07-04 audit board (A0â€“C3 + B1â€“B5):** all 12 tasks done on branch
  `todo-board-2026-07`. Recommender/calculator correctness (A1â€“A4), applicability
  model without fabricated numbers (A2, DECISIONS D-18/D-19), reproducible
  validation (A0), machine-readable evidence schema (B1), source manifest/index
  normalization + low-text PDF marking (B2/B3), HDFC stale-URL migration
  (B4, Playwright-verified), 7 PSU cards verified vs issuer PDFs with real
  corrections (B5), portfolio refresh + network-variant decision + 6 site UX
  fixes (C1â€“C3). 87 site tests pass; validate.py clean.
- Merged the latest audit branch into `main`.
- Preserved the local-only PDF archive.
- Added the local data/PDF review.
- Corrected SBI Cashback cap to Rs. 4,000 per statement cycle based on the
  archived SBI PDF.
- Cleaned documentation entry points and converted this file into the canonical
  agent task board.
