# Agent TODO

Last refreshed: 2026-07-06

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

- Dataset: 319 card YAMLs across 25 issuers. `validate.py` reports **0 errors,
  0 warnings** (the 6 standing co-brand/aurum warnings were cleared 2026-07-05, D6).
- Generated site data: `dist/*.json`, rebuilt by `site/scripts/prebuild.mjs`.
- Local PDF archive under `docs/sources/**/*.pdf`.
- Validation reproducibility (A0): resolved — `pip install -r scripts/requirements.txt`
  then `python scripts/validate.py` runs cleanly in a fresh env; matches CI.
- Site test suite: **122 passing**; `typecheck` + `prebuild` clean. (`npm run build`
  currently hits a pre-existing Windows `spawn UNKNOWN` worker error — env-only,
  builds fine with `experimental.cpus:1`; CI/Linux unaffected.)

**2026-07-05 — data & evidence remediation** (`docs/REMEDIATION_LOG.md`, merged PR #65):
closed D1, D2, D6, D7, D8, D14, D16, D20, D29, D30, D31; D3 partially advanced;
D4/D5/D11/D12/D15 still open. New scanners `scripts/audit_uncapped.py`,
`audit_stamps.py`, `crawl_diff.py`; rate-model flags in `docs/drift/D20-deferrals-2026-07.md`.

**2026-07-06 — site functional redesign** (merged): answer-first grouped `/recommend`
(pickHighlights, rank key sacred), facts-only best-pick card with an `Est.`-tagged
net-₹/yr, intent-routing home page (no card grid, no lead-gen), SVG icon set (no
emoji), tile hierarchy, compare winner-per-row, mobile filter collapse, verified-on
trust cues. Closed **D9, D25, C3**. Visual skin (palette/type/depth/dark mode)
deliberately deferred to a later Figma pass.

**2026-07-06 — per-card acceleration + cap breakdown** (merged): `explainCard()`
surfaces the engine's per-accelerator cap accounting (Realistic ⇄ Absolute, never
blended, reconciles with `scoreCard`); a shared localStorage-persisted spend profile
(`useSpendProfile`); the `AccelerationBreakdown` component (spend input + toggle +
full cap-story rows + base-rate spend with channel-cut notes) on the card page AND
`/calculator`. First phase of the value-capture roadmap.

## Execution Plans

- **Data & evidence remediation** (2026-07-05, mostly merged): `docs/superpowers/plans/2026-07-05-data-remediation.md`
- **Site functional redesign** (2026-07-06, merged): `docs/superpowers/plans/2026-07-06-site-functional-components.md` (spec: `…/specs/2026-07-06-site-functional-components-design.md`)
- **Card acceleration breakdown — Phase 1** (2026-07-06, merged): `docs/superpowers/plans/2026-07-06-card-acceleration-breakdown.md`
- **Calculators "truly capture value" — roadmap** (Phases 2–4, open): `docs/superpowers/specs/2026-07-06-calculators-value-capture-roadmap.md`
- **Site visual redesign — competitor-benchmarked (superseded)**: the original `…/plans/2026-07-05-site-visual-redesign.md` was reworked into the functional redesign above; final *visual* polish now lives in the Figma pass (see UI-1 below).

Fresh sessions: read the plan header, create the branch it names, and execute task-by-task.

## Open — site & calculators (as of 2026-07-06)

| ID | Priority | Area | Status | Task |
| --- | --- | --- | --- | --- |
| CALC-2 | P2 | Calculators | Open | **Value components** (roadmap Phase 2) — surface welcome + milestone + lounge as separate honest line items in the breakdown; the decoupled scorer already computes `first_year_bonus_inr`/`milestone_value_inr`/`lounge_visits`. Resolves `/calculator`'s "ignores welcome bonuses" disclaimer. Extend `CardExplanation` + `AccelerationBreakdown`; keep the decoupling (never blend into steady-state). |
| CALC-3 | P2 | Calculators | Open | **Usage inputs** (roadmap Phase 3) — channel/brand/ecosystem selectors feeding the Realistic layer; `ScoringContext` already carries `channelMix`/`tierMap`/`enabledEcosystems`. Mostly UI that populates the ctx (persist alongside the spend profile). |
| CALC-4 | P3 | Calculators | Open | **Redemption realism** (roadmap Phase 4) — transfer-partner routes, forex, per-redemption fees so points value the best real redemption (`transfer_partners` + `unit_value_inr_realized` are the starting point). |
| UI-1 | P2 | Site UX | Open | **Figma visual pass** — apply the premium "Ink & Warm" skin (palette/type/depth/dark mode) across the functionally-redesigned surfaces. Includes finalizing the best-pick card visuals (variant B), and merging `/calculator`'s two spend-input grids (it + `AccelerationBreakdown` each render one, both bound to the shared store). The functional layer was built as a clean restyle target. |
| UI-2 | P3 | Site UX | Open | `/calculator` (`calculator-client.tsx`) carries **pre-existing emoji** (🛍/✈️/⛽/🔒…) — replace with the SVG icon set (`@/components/icons`) during the Figma pass; no emoji in product UI. |
| CALC-5 | P3 | Calculators | Open | Optional cleanup: extract the card-wide cap tail into one `applyCardWideCaps()` helper shared by `scoreCard` + `explainCard`, so reconciliation is structural rather than test-enforced (tests currently guard it). |

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
| C3 | P2 | Site UX | frontend | Done | **Resolved 2026-07-06.** All 6 site-review issues fixed on `site-functional-2026-07` (detail-page tool-linking guard, bidirectional browse/compare URL sync, mobile results-before-filters, header flex-wrap, wizard skipped-step "not applicable" state, dev-only debug panel) and browser-QA'd at 3 viewports â€” see `docs/ui-benchmark/2026-07/QA.md`. Fix page/navigation issues from the site review. |

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
| D25 | Done | Site UX | **Resolved 2026-07-06.** Answer-first grouped presentation shipped on `site-functional-2026-07`: `/recommend` results lead with a highlights band ("Best overall for your spend" / "Best lifetime-free pick") above the full ranked list, each with a one-line reason, before the ranked `<ol>`. Browser-QA'd live at 390px (mobile) — see `docs/ui-benchmark/2026-07/QA.md` and `recommend-results-390.png`. **Learn from CardExpert's presentation:** recommend by spending-capacity tier (income + annual spend) AND spending pattern (dining/online/forex/utilities) with a one-line reason per card â€” not one universal pick. This matches the decoupled-scorer direction (category-aware, transparent line items). Consider tiered/pattern-based result grouping on the site. |
| D26 | P2 | Data quality | **Competitor-verify more high-traffic cards** (the HSBC TravelOne pass found 4 errors). Progress: Axis Atlas spot-checked = correct (2+5 EDGE Miles, tiered â‚¹3L/7.5L/15L milestones, 8+4 lounge). **Forex markups systematically verified SOUND** â€” of 65 sub-2% cards, all are genuinely low/zero-forex (Scapia 0%, IDFC WOW/Mayura 0%, IndusInd 1.5%, SBI Elite/Amazon-ICICI 1.99%); no stale cluster. Continue spot-checking reward rates/caps on remaining top cards. |

## Follow-up backlog (opened 2026-07-04, from the A0â€“C3 audit)

These emerged while completing the A/B/C board. Promote into the Pick-Up Board
when picked up.

| ID | Priority | Area | Task |
| --- | --- | --- | --- |
| D1 | Done | Data quality | **Resolved 2026-07-05.** BOI Select (AMC ₹800, joining ₹0) confirmed verbatim vs BOI's own brochure → confidence high; its unverified ₹2L fee-waiver removed (not issuer-documented). South Indian SBI Platinum ₹2,999/₹2,999 confirmed vs SBI Card page → confidence high (no fee waiver documented). KVB Honour fee verification folded into D2. Confirm the aggregator-sourced fees left at `confidence: medium` against issuer Schedule-of-Charges PDFs: BOI Select (â‚¹800/â‚¹2L waiver), South Indian SBI Platinum (â‚¹2,999), KVB Honour (whole card). Upgrade to high or correct. |
| D2 | Done | Data quality | **Resolved 2026-07-05 — withdrawal concern refuted.** KVB still actively offers the Honour card: a live dedicated product page exists at kvb.bank.in (Visa network, lounge + rewards). Status kept `active`, network Visa confirmed (high). The ₹1,299 fee + "Signature" sub-tier are not shown on the product page (they live on the separate charges schedule) — retained at medium confidence, noted in the card source. Verify `kvb-honour` status â€” the KVB `.bank.in` site no longer exposes an "Honour" page (only a generic card + KVB-SBI co-brands). Confirm rename/withdrawal; mark discontinued or re-model if needed. |
| D3 | P1 | Evidence | Scale the B1 machine-readable evidence fields (`source.type/confidence/local_refs/fields_verified`) across the archive, issuer by issuer. Only ~9 cards carry them today (2 exemplars + 7 PSU). |
| D4 | P1 | Data quality | Extend the B4 stale-URL / aggregator-primary sweep beyond HDFC: audit every issuer's `source.url` for redirects/404s and aggregator-primary sources (Playwright-verify replacements). |
| D5 | P2 | Portfolio | Expand the PSU catalogues into sourced YAML (see `docs/PSU-BANK-PORTFOLIOS-2026-07.md`). Start with PNB RuPay Platinum / Rakshak / LUXURA and Union premium tier (NEXTERIA / Unicorn / DIVAA). Source terms before adding. |
| D6 | Done | Data | **Resolved 2026-07-05.** All 6 warnings cleared: loyalty_program (+ value-neutral `card_attributable_rate`/`stacks_with_program:false` decomposition) on bob-irctc, sbi air-india signature/platinum, sbi tata-neu infinity/plus; aurumcreditcard.com added to the sbi apply_url allowlist (documented microsite). validate.py reports zero warnings. Resolve the 6 standing validator warnings â€” `co_brand.partner` â†” `loyalty_program` alias links (bob-irctc, sbi air-india Ã—2, sbi tata-neu Ã—2) and the sbi-aurum apply_url microsite. |
| D7 | P2 | Sources | Normalize the audit-note manifests (bob / idfc-first / rbl / standard-chartered) into per-card PDF maps, matching axis/hdfc/icici/sbi (LOCAL_DATA_PDF_REVIEW cleanup #1). |
| D8 | Done | Data | **Resolved 2026-07-05.** Added `scripts/audit_stamps.py` (read-only scanner). Only 6 of the original 31 remained (prior work reconciled the rest); all 6 carried a 2026-07-03 bulk-sweep `last_verified_on` with no source touched that day, so moved it to `last_swept_on` and restored `last_verified_on` to the newest `source.retrieved_on` (icici-manchester-united-signature, kotak-myntra-kaching, kotak-pvr-gold, rbl-zomato-edition, yes-premia → 2026-04-15; hdfc-6e-rewards → 2026-04-22). Scanner now reports 0. Reconcile the 31 `metadata.last_verified_on` vs nested `source.retrieved_on` mismatches (LOCAL_DATA_PDF_REVIEW issue #4); explain via `last_swept_on` or notes. |
| D9 | Done | Site UX | **Resolved 2026-07-06.** Browser-QA'd via Playwright MCP at 390×844 / 768×1024 / 1440×900 across `/`, `/browse`, `/card/hdfc/infinia`, `/compare`, `/recommend` (+ results) â€” no horizontal body scroll on any page/viewport (15/15 pass), mobile results-before-filters and header wrap both visually confirmed. See `docs/ui-benchmark/2026-07/QA.md`. Browser-QA the C3 responsive fixes (mobile results-before-filters, header wrap) on real viewports via Playwright/webapp-testing â€” they compile but weren't visually confirmed. |
| D10 | P2 | Schema/data | Execute the C2 (D-20) network-variant migrations: HDFC Tata Neu Infinity/Plus RuPay-UPI variants; verify whether ICICI Coral/Rubyx/Sapphiro Amex differ materially before splitting. |
| D11 | P2 | Portfolio | Verify open status of the 3 still-absent big-bank cards (Axis Burgundy Private, ICICI Mine, Kotak Mojo Platinum) and add if open + sourced (`docs/PORTFOLIO-GAPS.md`). |
| D12 | P3 | Recommender | Author `accelerated[].applicability_pct` from evidence for high-traffic co-brand cards (Amazon ICICI, Swiggy HDFC, Tata Neu, â€¦) so /recommend credits their real bucket slice instead of falling back to base (A2 / D-18). |
| D13 | ~~P1~~ Closed | Data quality | **FALSE ALARM â€” already correct.** On inspection, `kotak-indigo`, `kotak-indigo-xl`, `sbi-indigo`, `sbi-indigo-elite`, `idfc-first-indigo` all already carry `card_attributable_rate` (3/5/6/7) + `stacks_with_program`, so the calculator uses the card-side earn, not the receipt-total `effective_rate`. The original concern came from a red-team script that measured `effective_rate` directly. Fix applied instead to the *scorer's flag* (2026-07-05): don't flag channel-gated co-brand rates, and prefer `card_attributable_rate` â€” so these cards no longer mis-flag. (Verify HDFC 6E cards separately if not decomposed.) |
| D14 | Done | Data quality | **Resolved 2026-07-05.** Coin value corrected to ₹0.20 (5 Coins = ₹1; was ₹1.0, a 5× overstatement) and app-travel accelerators channel-gated in prior 2026-07-05 work; this pass independently verified the ₹0.20 rate against Scapia's own blog + multiple 2026 reviews (high confidence), confirmed realized≈face (up to 100% redeemable, 36-mo expiry, no coin markup — the erosion vector is app-vs-market fare variance), and confirmed no earn cap on app-travel (only utility/telecom/cable capped at ₹20k/mo). Added capping_rules no-cap notes to bob-scapia + federal-scapia (closes their D20 deferral). Engine replay (`engine_v2.py travel`): Scapia no longer tops travel (kotak-solitaire 8.6% leads; Scapia off the top-6). **`bob-scapia` travel accelerator is an outlier** â€” 20% "on travel" with `channel: null` and coins valued at â‚¹1. Scapia Coins are earned only on Scapia-app bookings and redeemable in-app; add a `scapia-app` cobrand-merchant channel and a realistic coin value so it doesn't top travel rankings for non-Scapia bookings. Cross-check `federal-scapia`. |
| D15 | P3 (iShop done) | Coverage | **iShop DONE 2026-07-05; Amex Travel deferred.** Authored ICICI iShop channel-gated accelerators (12X hotels / 6X flights, per-tier monthly caps 18k/15k from ICICI's capping PDF) on Emeralde Private Metal, Emeralde, Sapphiro, Rubyx, Coral — engine replay shows emeralde-private-metal at ₹163,901 in the absolute ceiling, closing the HDFC-only-portal bias. Amex Travel Online (flat +1 MR/₹100 on prepaid hotels+car-hire, no cap, uniform across MR cards) is researched but deferred: medium confidence (the /travel terms page is 403-blocked to fetch; needs a Playwright-rendered source before authoring the small delta). **Issuer-portal ecosystems ICICI iShop and Amex Travel are not modelled** â€” no accelerators exist for them, so travel/shopping comparisons silently omit ICICI/Amex portal value. Add the iShop and Amex Travel channels + accelerators (with caps) to the relevant cards. |
| D17 | Done | Recommender | **Brand preferences are inert** â€” RESOLVED in two stages. The described applicability collapse was already fixed (scorer runs optimistic-on-selected-brand, no `applyApplicability`; test locks brand-lift at real rate). 2026-07-05 (5b3acfb): the residual INVERSE found by audit â€” 54 merchant-only accelerators (merchants[] no channel) fired for every user regardless of picks â€” now gated by `merchantSatisfied()`; different brand picks produce different rankings (test-locked). Remaining honest gaps tracked in D34 (data channel blocks) and D12 (authored applicability for partial-share evidence). |
| D18 | Done | Recommender | **Unbounded benefit proxies dominate the rank** (F3/F4/F5). Milestones (â‚¹1.44L phantom on Amex Reserve), lounge (â‚¹96k for "unlimited"), and welcome (one-time Ã·2) routinely dwarf real rewards. Decouple: rank on steady-state spend value; show welcome/milestone/lounge as separate capped line items; bound each proxy (lounge by usage input, milestone by % of trigger). |
| D20 | Done | Data quality | **Resolved 2026-07-05.** Built `scripts/audit_uncapped.py` (baseline 50→39, now flags documented rows). Worked worst-first over 3 research rounds (issuer T&C only, no fabrication): applied sourced numeric caps to IDFC Gaj (15k RP/mo), Kotak Solitaire (100k miles/stmt), RBL IRCTC (1k RP/mo), Axis SpiceJet Voyage/Black (₹1L spend/mo), BOB Snapdeal (2k RP/stmt), HSBC Premier (18k RP/mo), SBI PhonePe Purple (750 RP/mo), AU Xcite (25k RP/stmt), AU ixigo (10k RP/stmt); documented genuine no-cap (capping_rules notes) on ~24 accelerators (SBI IRCTC/Air-India/KrisFlyer/Apollo/Paytm/Landmark-Select/Reliance, ICICI Amazon-Pay/Adani/MMT, Axis Shoppers-Stop/FreeCharge/Horizon/Flipkart/IndiGo, Equitas, SC, YES, BOB Etihad, IDFC Mayura, IndiGo-SBI). audit now: 39 uncapped, only 6 undocumented — all documented deferrals in `docs/drift/D20-deferrals-2026-07.md` (2 Scapia → D14/T5; rate-model flags on indusind-pinnacle/eazydiner, kotak-white-reserve, landmark-prime, au-ixigo rate). Card-attributable decomposition for the D13 co-brand inflation was handled under D6. **Uncapped high-rate accelerators â€” SYSTEMIC.** 66 of 304 active cards (22%) have an uncapped accelerator â‰¥3% effective (10 cards â‰¥10%: axis-airtel ~25%, bob-scapia ~20%, phonepe/hsbc/yes-byoc/idfc-gaj ~10%). Mix of genuinely-missing `cap_per_cycle` (add from issuer T&C) and the D13 BluChip decomposition inflation (idfc/kotak/sbi-indigo). This materially corrupts recommender rankings (F7). Audit all 66; add caps or `card_attributable_rate`. |
| D21 | Done | Data quality | **Co-brand accelerator not channel-gated.** `sbi-flipkart` earns its elevated online rate on *any* online spend (its accelerator has no `channel`), so it surfaces for an Amazon shopper. Gate co-brand accelerators to their merchant. **Done:** sbi-flipkart, bob-scapia, federal-scapia. |
| D22 | Done | Data quality | **13 more ungated co-brand accelerators** (same pattern as D21; `merchants[]` present but no `channel`, so the elevated rate fires on generic category spend). Gate each to its merchant (add tokens to `data/channels/known.yaml` under the right class): `amex-smartearn` (zomato/ajio/nykaa/bookmyshow/uber/flipkart/easemytrip), `au-ixigo` (ixigo/confirmtkt/abhibus), `axis-ace` (google-pay bills/recharges), `axis-airtel` (airtel-thanks-app), `axis-fibe` (swiggy/zomato), `axis-flipkart` (swiggy/pvr/uber/cult.fit), `axis-flipkart-super-elite` (flipkart), `axis-indianoil` (ioclâ†’fuel-network), `axis-shoppers-stop` (shoppers-stop), `axis-spicejet-voyage-black` (spicejet), `icici-mmt` (mmtâ†’third-party-ota), `indusind-eazydiner-platinum` (eazydiner), `sbi-landmark-prime`/`-select` (Landmark stores), `sbi-reliance-prime` (ajio/jiomart). |
| D19 | Done | Recommender | **No sanity/robustness guards** (F2/F6/F7/F10) â€” resolved 2026-07-05 (9edfe25) as warn-don't-fudge. The failure modes are covered by factual flags (implausible uncapped rate, category mismatch, implausible milestone) + the 2026-07 data remediation + this branch's engine fixes; red-team replay locks in `site/lib/red-team.test.ts` prove no adversarial single-bucket profile produces an absurd unflagged result on live data. Rate clips and category down-weights were considered and REJECTED â€” invented coefficients in the rank violate the no-invented-values principle. |
| D16 | Done | Data quality | **Resolved 2026-07-05.** Verified against HDFC's live (JS-rendered) SmartBuy T&C (offers.smartbuy.hdfcbank.com offer 15282, effective 2026-07-01). Monthly caps CONFIRMED unchanged (Infinia 15,000 RP, Diners Black 7,500 RP). Multiplier CHANGED: hotels stay 10X but **flights dropped to 5X** — close-and-appended both cards' reward records (old 10X flights+hotels closed 2026-06-30; new record 2026-07-01 splits smartbuy-hotels 10X / smartbuy-flights 5X). Noted the new 3,000 RP/month brand-voucher (Gyftr/Woohoo) sub-cap nested in the overall cap. **Verify HDFC SmartBuy multiplier/cap freshness.** Infinia/Diners Black SmartBuy is modelled at 10X (caps 15,000 / 7,500 RP per month). HDFC has revised SmartBuy multipliers, caps and category exclusions repeatedly â€” confirm the modelled 10X + monthly point caps against current live SmartBuy T&C for flights/hotels, and note the effective category rules. |

## Engine deep-dive backlog (opened 2026-07-05, from the graphify architecture dive)

These emerged from the knowledge-graph deep dive of database/logic/engines.
Worked by `/loop /cc-engine-dive` (code/logic lane) unless noted.

| ID | Priority | Area | Task |
| --- | --- | --- | --- |
| D27 | Done | Code quality | **Category rules already single-sourced** â€” verified 2026-07-05: `site/scripts/build.mjs` emits `dist/category_rules.json` from `scripts/category_rules.yaml` and `category-mapping.ts` imports it (commit 90794bb). The stale "mirrors these rules in code today" comment in the YAML header was the false signal; comment fixed. |
| D28 | Done | Booking engine | **engine_v2.py red-team flaws R1â€“R7** â€” engine-side items complete 2026-07-05. Cap/MCC scoping (D33, c8de69f); channel gating (c937ac6): `channel.required` accelerators count only in the absolute ceiling, never the realistic floor â€” routing optimism lives with value optimism, layers never blended (replay: realistic travel top is now a plausible 8.6%; Infinia SmartBuy shows in the ceiling column only). Ranking by the realized floor is the documented honest default, not an asymmetry bug. Portal-markup modelling (R1) is `booking-savings/holistic.py` + `site/lib/booking.ts` territory BY DESIGN (net-cost model with sourced markups) â€” not an engine_v2 defect. |
| D29 | Done | Automation | **Resolved 2026-07-05.** Built `scripts/crawl_diff.py` (+ network-free unit tests `scripts/test_crawl_diff.py`, `docs/drift/README.md`). Pure core `expectations_for`/`check_page` (Indian-comma-tolerant presence-check → MATCHED / NOT-FOUND / CONFLICTING-NUMBER-NEARBY); Playwright `--issuer` shell renders each active card's source.url, logs host redirects as DRIFT, network failures as SKIPPED, exits 1 only on conflicts. Live smoke on hsbc (7 cards) committed as the first report. **Crawl-diff drift detection** (proposed in `docs/hdfc-audit.md` Â§5). The audits proved `retrieved_on` stamps alone can't be trusted (provenance drift). Build a repeatable Playwright script that diffs each live card page against YAML key fields per issuer and reports drift as TODO rows. SCOPED DESIGN (2026-07-05): `scripts/crawl_diff.py --issuer <id>` â€” (1) read each card's open records + `source.url`; (2) render via Playwright (most issuer pages are JS-only per the audits); (3) regex-hunt the page text for the YAML's own literal values (annual fee â‚¹N, joining fee, base rate "X per â‚¹Y", cap numbers, forex %) â€” report MATCHED / NOT-FOUND / CONFLICTING-NUMBER-NEARBY per field, never parse the page into a schema; (4) emit `docs/drift/<issuer>-YYYY-MM-DD.md` with per-card rows; (5) exit nonzero on conflicts only. Run one issuer per invocation (rate-limit friendly); .bank.in redirects logged as drift. This is presence-checking, not scraping â€” cheap, robust to layout, and exactly what the manual audits did by hand. |
| D30 | Done | Data quality | **Resolved 2026-07-05.** Network=RuPay confirmed (high) from Axis's own press release ("Built on the RuPay network") + product page; it is a UPI-first "CC on UPI" card exclusive to the Google Pay app (already tagged `upi`). Data was already `network: rupay` + `upi` tag; bumped fee-source confidence to high and documented. No standard network_tier for a RuPay-CC-on-UPI product. **axis google-pay-flex network unresolved** (flagged AMBIGUOUS in the Axis audit follow-ups: "likely RuPay/UPI", network field unconfirmed). Confirm network + UPI capability from an issuer source and set it. |
| D31 | Done | Validation | **Resolved 2026-07-05.** Co-brand↔loyalty alias lint promoted warning→error now that D6 zeroed the offender count; verified clean run exits 0 and a removed loyalty_program exits 1 with `[lint]`. **Promote warn-tier lints to error at zero offenders** (promotion pattern, `docs/ROADMAP.md`). After D6 clears the 6 co-brand alias warnings, flip that lint to error so regressions fail CI; sweep for other warn-tier lints already at zero. |
| D32 | Done | Tests | **Regression locks for the three historical rate-pipeline bugs** â€” complete 2026-07-05 (6417f3b). A1 units-as-percent locked; per_inr<=0 locked across formatAcceleratedRate, ratesFlags, and computeHeadlineRatePct (extracted to site/lib/headline-rate.mjs since build.mjs runs main() at import); three-consumer consistency test (build badge = calculator = detail-derivations) added for points + cashback records. The per_inr denominator class (HDFC 150-vs-200) remains a data-verification concern (D16/D26 lane), not a code lock. |
| D33 | Done | Booking engine | **engine_v2.py diverges from the site engines** â€” complete 2026-07-05 (7bc1617 + c8de69f). Rate side: `effective_per_inr` honoured, `effective_rate: 0` semantics, `card_attributable_rate` preferred (D-8), cap_unit defaults to points. Cap side: cap-aware selection (realised value, not headline rate), base `cap_per_cycle` + `reward_cap` clamps, `mcc_exclusions` category zeroing. 9-test file added. Remaining booking-model gaps (portal-markup, forex fraction, locked flag) are R1â€“R7 scope â†’ D28. |
| D34 | Done | Data quality | **D22 expansion â€” ungated-accelerator sweep COMPLETE 2026-07-05** (54522c0, 99c66b6, 2aa903d, 29d9f7f): 52 accelerators gated across 36 cards in four chunks (D22 scope, fuel-network co-brands, high-severity partner lists, ecosystems, final stragglers). Residual scan reports ZERO accelerators with merchants[] and no channel across all 319 cards; 51 tokens added to known.yaml. NOT covered (no merchants[] to gate on â€” needs T&C-sourced authoring, cc-remediate lane): sbi-paytm, sbi-paytm-select, sbi-phonepe-purple app-ecosystem accelerators, and axis-spicejet-voyage's broad online-* 6% rates. Cap authoring for uncapped rates remains D20. |
| D35 | Done | Tests | **Cap-conversion test gaps** â€” complete 2026-07-05 (6417f3b + 3c0d358): miles/annual/"unlimited"/per-txn/points-base-cap all locked; cashback-cap-fallback bug fixed; the `spend-inr` base/reward_cap authoring trap closed with a warn-tier validator lint (verified firing; zero live offenders; accelerator spend-inr caps remain supported). |

## Recommender portfolio backlog (opened 2026-07-28, from the cap-stacking dive)

Opened while working a ₹1.5L/month single-category spend profile through the recommender.
The ranked list scored each card alone and so never surfaced that the correct answer was a
five-card stack; the items below are the modelling gaps that dive exposed. E1-E4 are built; E5 is
down to two records needing issuer T&C, and E6 came out of building E5.

| ID | Priority | Area | Task |
| --- | --- | --- | --- |
| E1 | Done | Engine | **Cap-aware portfolio allocation** — `site/lib/portfolio.ts` (new). `scoreDecoupled` ranks cards independently, which is the wrong question when spend in one bucket dwarfs that bucket's caps: the cards COMPOSE, each contributing its own cap. `allocatePortfolio()` greedily fills by marginal rate across tranches, honours `metadata.exclusive_group`, and re-scores each card against its routed spend via `scoreCard` so shared caps are never double-credited. Census over `dist/cards.json`: 1,498 card×bucket pairs are flat/uncapped, 151 are capped-then-lower-rate (need ≥2 tranches), 102 are capped-then-zero. |
| E2 | Done | Engine | **`metadata.exclusive_group` — issuer co-issue rules.** HDFC will not issue Swiggy BLCK to a Swiggy HDFC holder, but `hdfc-swiggy-hdfc` / `hdfc-swiggy-blck` are sibling ids, so `isVariantOf`'s prefix test never caught them and a stack could recommend both. Schema field added, HDFC Swiggy family tagged, enforced in `scoreDecoupled` (even when `dedupeVariants` is off, since this is a hard constraint not a similarity heuristic) and in `allocatePortfolio` (`heldCardIds` pre-claims groups). |
| E3 | Done | Schema | **`accelerated[].slabs[]` — marginal rate schedules.** Added 2026-07-28. Slabs are tax-bracket semantics over CUMULATIVE qualifying spend in the cycle (`upto_spend_inr` / `rate_pct` / optional `max_value_inr`), so rates may rise OR fall; `slabs` supersedes `effective_rate` for value math while `effective_rate` stays at the top slab for consumers that predate the field. Calculator threads a `spendUsage` map alongside `capUsage` so a schedule is cumulative across buckets rather than restarting per bucket. `axis-cashback` encoded (2/5/7%); tests reproduce both of the issuer T&C's own worked examples (₹67,950 → ₹3,806 and ₹8,930 → ₹296.5). `portfolio.ts` no longer assumes concavity: it samples the value curve and collapses a RISING schedule to the blended rate it actually delivers, since a top slab reachable only by first spending through the cheap ones is not an offer the allocator can accept alone. Still to audit for slab structure: `sbi-phonepe-purple`, `sbi-tata-neu-plus`, `hdfc-regalia-gold` (the census pairs where a 2-tranche fit was lossy). |
| E4 | Done | Schema | **`base.applies_to_categories` — scoped base earn.** Added 2026-07-28. When set, base is paid only on the listed buckets, so overflow past an accelerator cap earns nothing instead of silently dropping to base. `axis-cashback` scoped to `[travel]`: its T&C pays base only on "offline spends (POS/card present transactions) or spends on travel", and the canonical buckets carry no card-present axis, so `travel` is the only assertible member — the conservative reading, and the one that matters (₹1.5L/month of online spend now scores exactly the ₹4,000 cap, not ₹4,696). The bucket model still has no channel dimension; a fuller fix would add one and let base be channel-scoped directly. Only `axis-cashback` carries the field, locked by a test. |
| E5 | Mostly done | Data quality | **Hedged "up to N%" rate sweep.** The detector fires only when a note's "up to N%" EQUALS the encoded `effective_rate` (an unmodelled ceiling), which correctly cleared the four earlier suspects whose notes merely restate a rate in another unit — `idfc-first-wow-black`, `idfc-first-diamond-reserve`, `idfc-first-wow`, `idfc-first-lic-select` are NOT defects. Fixed: `axis-cashback` (slabs, 2026-07-28); `idfc-first-hello-cashback` (its 5% is INCREMENTAL above ₹10,000/month, now slabs `[1% to 10k, 5% above]` — a flat 5% overstated a ₹15,000/month online spender ₹750 vs ₹350 real). REMAINING, both needing an issuer T&C: (a) `sbi-irctc-platinum` — note says "up to 10% value back" but the encoding is 10 points per ₹125 at ₹1.00 = 8% value; either the note or the rate is wrong, and "up to" hints the rate varies by travel class (AC1/AC2/AC3/Chair Car). (b) `au-paytm` — note says "Up to 2% rewards" on Paytm UPI but the encoding is 2 points per ₹100 at ₹0.22 = 0.44% value; smells like the units-as-percent class of bug the A1 regression lock covers, so confirm whether 2% is the VALUE or the point count. |
| E6 | Open | Engine | **Accelerator caps do not cover over-cap base earn.** `idfc-first-hello-cashback`'s T&C caps TOTAL online cashback at ₹1,000/statement, but the engine pays the ₹1,000 accelerator cap and then base on the over-cap spend (~₹20 extra at ₹30,000/month). Generic over-cap-base fallback is right for most cards, so this needs a per-record opt-in (e.g. `cap_includes_base: true`) rather than a global behaviour change. Bounded and test-documented, not silent. |

## Recommender realism backlog (opened 2026-07-28, from running a real spend profile)

These came out of driving an actual profile (₹1.5L/mo in one category, reimbursed) through
`allocatePortfolio` and then checking every recommended card against its issuer T&C. The engine
was right; the DEFAULTS and the DATA were not. Each item below produced a materially wrong
recommendation before it was caught.

| ID | Priority | Area | Task |
| --- | --- | --- | --- |
| E7 | Open | Engine | **`allocatePortfolio` is silently optimistic without a `channelMix`.** `channelSatisfied` treats an absent `ctx.channelMix` as "the user always transacts on the right channel" (`calculator.ts:174`) — defensible for the `/calculator` sandbox, dangerous for a portfolio recommendation. With `ctx = {}` the allocator produced a 9-card stack worth ₹1,46,756 in which FOUR cards' rates did not apply to the user's spend at all: `axis-airtel` (Zomato/Blinkit/District, not Swiggy), `sbi-tata-neu-infinity` (closed-loop Tata brands), `axis-flipkart` (Myntra/Flipkart), `hdfc-phonepe-ultimo` (10% tier needs the PhonePe app). With a realistic mix the same profile yields 5 cards and ₹1,17,803. Fix: make the channel mix an explicit parameter, refuse to credit `channel.required` accelerators without one, or return an `assumed_channels[]` the caller must acknowledge. A recommender must not default to optimism. |
| E8 | Open | Data quality | **Remaining ungated app-ecosystem accelerators.** `sbi-paytm-select` FIXED 2026-07-28 — both rates are Paytm-app-only per the card's own copy ("via the Paytm App") yet were authored with no `merchants`/`channel`, so every user's entire travel bucket earned 5%. D34 named two more still ungated: `sbi-paytm` and `sbi-phonepe-purple`. Sweep for any accelerator whose `notes` name an app or portal ("via the X app", "booked on X") while `channel` is null. |
| E9 | Done (partial) | Data quality | **`yes-paisabazaar` 6% verified 2026-07-28 — it is an MCC ALLOWLIST, not a category.** The record carried no `mcc_list`, so the calculator treated the whole `dining` bucket as eligible. The issuer publishes an explicit 24-code allowlist (4511, 4582, 4722, 7011, 5812, 5813, 5814, 3020, 3501, 3509, 3513, 3520, 3530, 3543, 3553, 3583, 3637, 3640, 3642, 3649, 3657, 3659, 3690, 3812) and states the dining side covers "Dining, including Swiggy, Zomato, Dineout, restaurants, fast food joints, etc." — so food delivery DOES qualify, via 5812/5814. Both variants now carry the allowlist, the widened exclusion list (utilities, education, government, jewellery, hospitals, pharmacies, toll) and the UPI carve-out. STILL OPEN: the source is the Paisabazaar product page, not YES Bank's MITC (session-gated), so this stays web-tier confidence; and `kotak-cashback-plus`'s "5% on online food deliveries" is ungated and unverified in exactly the same way. |
| E12 | Open | Engine | **UPI-routed spend is not modelled as a distinct payment rail.** PaisaSave excludes UPI spends from its 6% dining/travel rate — a Swiggy order paid by UPI earns 1%, not 6%. That bites hardest on the RuPay variant, whose entire purpose is UPI. The canonical buckets have no payment-rail dimension, so the engine credits 6% regardless of how the user actually pays, overstating the card for anyone who pays food delivery by UPI (very common in India). Same class of gap as E4's missing card-present axis. Needs a rail dimension (card / upi) on the spend profile plus an accelerator-side exclusion; several RuPay-on-UPI co-brands will need re-auditing once it exists. |
| E13 | Done (partial) | Data quality | **`sbi-cashback` 5% retagged 2026-07-28 — channel-scoped, not category-scoped.** Same defect class as `axis-cashback`: it carried `canonical_categories: [online]`, so food delivery and online groceries scored ZERO on a card whose 5% covers any card-not-present spend (Amazon, Flipkart, Myntra, Ajio, Swiggy, Zomato, Blinkit, BigBasket are the named examples). Retagged to `[online, dining, groceries]`. Two further corrections found while verifying: the 1% base is ALSO capped at Rs 2,000/statement (the record had it uncapped), giving the hard Rs 4,000/cycle aggregate ceiling the repo's own archived T&C e-kit already documented in a `fields_verified` note; and the 1 Apr 2026 devaluation added MCC exclusions for digital gaming (7993/7994/5816), tolls (4784) and government (9222/9311/9402), none of which were recorded. An existing calculator test asserted the mis-tag as correct behaviour ("no accelerator on dining") and had to be inverted. STILL OPEN: SBI's MITC PDF is referenced at `docs/sources/sbi/cashback/cashback-tnc-ekit.pdf` but is gitignored and absent, so the channel definition rests on product/review-tier sources; re-verify against the e-kit when someone has it locally. |
| E14 | Mostly done | Data quality | **Ungated-accelerator sweep across all 319 cards (2026-07-28).** Swept every accelerator touching dining/online/groceries that carries NO `channel`, `merchants` or `mcc_list` and whose own notes imply a restriction: 15 hits. FIXED — the three whose notes name an app outright, matching the `sbi-paytm-select` pattern: `sbi-paytm` (2% "on the Paytm App", ungated AND uncapped), `sbi-phonepe-purple` (3 RP/₹100 on "eligible PhonePe App spends"), `hdfc-tata-neu-infinity` (5% "on Tata Neu app/partners" — the SBI Tata Neu twin was already gated, the HDFC one was not). NOT FIXABLE BLIND, needs T&C sourcing — 11 records whose notes say "select categories"/"select MCCs" without naming them: `au-cheq`, `au-laksya`, `au-tejas`, `au-xcite`, `au-zenith`, `axis-spicejet-voyage`, `axis-spicejet-voyage-black`, `federal-rupay-signet`, `yes-elite-plus`, `yes-reserv`, `yes-select`. Several are high-rate and uncapped (yes-reserv 24 RP/₹200, au-cheq 12%), so they will dominate any online-heavy recommendation until their real scope is authored. `sbi-cashback` also matched but is a true negative — its 5% genuinely is unrestricted across online merchants. |
| E15 | Done | Engine | **Greedy admitted cards that shrink the stack.** Fixed 2026-07-28. `dropFeeNegative` only removed a card whose fee exceeded its OWN earnings — but a card can clear its fee and still reduce the total, because the spend it takes would have earned more on a card already in the stack. Greedy fills by rate and never looks back. At ₹50k dining the unconstrained result was ₹63,120 where a smaller stack was worth ₹66,420. Added a drop-one-and-rebuild prune that runs each trial back through the solvency filter (without that, the rebuild simply re-admits a different fee-negative card — the first attempt left Kotak Cashback+ in at a NET of −₹153). Test asserts no slot loses money, that the reported net equals the sum of the parts, and that removing any single non-held card cannot improve the net. |
| E16 | Open | Data quality | **`yes-paisabazaar` dining removed — marketing copy contradicted by field reports.** Paisabazaar's product page states the 6% dining side covers "Dining, including Swiggy, Zomato, Dineout, restaurants, fast food joints, etc."; cardholders report aggregator spend posting at the 1% base instead. That page is lead-gen marketing, not YES Bank's MITC (session-gated, still unread), so the claim never had issuer backing and should not have been encoded as fact — it was, twice, and drove a recommendation worth ₹21,117-₹37,001/yr. `dining` is now removed from `canonical_categories` on both variants, leaving them TRAVEL earners; the MCC allowlist and UPI carve-out stay documented. This deliberately UNDER-credits genuine in-restaurant dining on 5812/5813/5814 — the canonical buckets cannot separate a restaurant swipe from an aggregator order, and over-crediting sends people to a card that will not pay them. Restore `dining` only against the MITC. Broader lesson for the lane: an issuer-adjacent marketing page is not a source for what POSTS; where a field report and marketing copy disagree, encode the conservative reading and mark it contested. |
| E17 | Open | Engine | **`sbi-cashback` base is offline-only and cannot be expressed.** Its T&C splits the card cleanly: 5% on online capped Rs 2,000/cycle, 1% on "Offline Spends (POS at Merchant Outlets)" capped Rs 2,000/cycle, Rs 4,000 aggregate. So online spend past the Rs 2,000 cap earns NOTHING. `base.applies_to_categories` (E4) can only name canonical buckets, and there is no bucket meaning "card-present" — for axis-cashback the T&C also allowed travel, which gave a legitimate single-member list, but SBI has no such escape hatch. The record therefore leaves base unscoped and the calculator credits 1% on online overflow, overstating the card above Rs 40,000/month (at Rs 1L/month it reports Rs 2,600 where the truth is Rs 2,000). Documented in `capping_rules`. Real fix is the payment-rail/channel dimension on the spend profile that E12 also needs. |
| E18 | Done | Data quality | **`indusind-legend` and `indusind-pinnacle` claimed a unit value no redemption pays.** Both carried `unit_value_inr: 0.75` AND `unit_value_inr_realized: 0.75`, while their own `redemption` blocks list catalog and statement credit at Rs 0.25 and airmiles transfers topping out at Rs 0.28 (Legend, KrisFlyer 4:1) and Rs 0.55 (Pinnacle, KrisFlyer 2:1) — both flagged "below floor — avoid" against a floor that did not exist. Every rate on both cards was inflated 3x: Legend read as 0.75% base / 1.5% weekend when it is 0.25% / 0.50%, and Pinnacle as 1.88% base / 3.75% travel-dining when it is 0.625% / 1.25%. Corrected to face 0.28/0.55 and realized 0.25. The generated constraint text ("realized Rs 0.75 = guaranteed non-transfer floor") was circular — derived from the same wrong field — so it corroborated nothing. LINT WORTH ADDING: `unit_value_inr_realized` must not exceed the best concrete `redemption[].rate_inr_per_unit`; a sweep found these two are the only offenders across the 15 IndusInd cards, but the check should run dataset-wide. |
| E10 | Open | Engine | **Nothing surfaces WHY a card is in a stack.** `PortfolioSlot` reports the rate and the rupees but not which accelerator fired or what gated it, so auditing a recommendation means hand-reading YAML — which is exactly how the E7 defects survived. Carry the winning `AcceleratedReward` (at minimum its `category`, `merchants`, `channel`) through to the slot so a stack can be checked from its own output. |
| E11 | Open | Engine | **Reward FORM is invisible in ranking.** Every card in the final stack happened to pay ₹1.00/unit as statement credit, but nothing in the scorer distinguishes that from closed-loop currency (Tata Neu's NeuCoins) or a partner-wallet credit (`axis-airtel`'s value-back is credited to a partner wallet, not cash). `redemption_scope: closed-loop` exists and the calculator honours it for VALUE, yet a ranked list still shows cash and non-cash side by side. Surface `redemption[0].type` and any `min_units` floor in recommender output. |

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
