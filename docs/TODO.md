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
| B4 | P1 | Data quality | data | Blocked (needs web) | Replace stale source URLs (HDFC hdfcbank.com→hdfc.bank.in). Requires live verification that migrated URLs resolve; must not blind-swap 293 sources. |
| B5 | P2 | Data quality | data | Blocked (needs web) | Improve 7 low-confidence small-bank cards (BOI/Canara/IDBI/KVB/PNB/South Indian/Union). Requires fresh issuer-sourced evidence; do not fabricate. |
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

## Completed Recently

- Merged the latest audit branch into `main`.
- Preserved the local-only PDF archive.
- Added the local data/PDF review.
- Corrected SBI Cashback cap to Rs. 4,000 per statement cycle based on the
  archived SBI PDF.
- Cleaned documentation entry points and converted this file into the canonical
  agent task board.
