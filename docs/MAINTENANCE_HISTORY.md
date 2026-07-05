# Maintenance History

Durable record of repository maintenance actions that affect local/GitHub
state beyond ordinary feature commits.

## 2026-07-04 - Documentation cleanup

- Reworked `docs/TODO.md` into the canonical agent pick-up board with task IDs,
  suggested agent types, scope, done criteria, and validation commands.
- Reworked `docs/README.md` into a status-aware documentation index separating
  current operating docs from historical audit evidence.
- Reworked `docs/ROADMAP.md` into a short thematic roadmap that points all
  active work back to `docs/TODO.md`.
- Refreshed root and site README instructions so they describe the current Node
  prebuild pipeline rather than the old planned/Python build path.
- Recorded source-document cleanup targets without deleting or moving PDFs.
- Deleted completed historical implementation artifacts under `docs/superpowers/`
  after their rate-math primitive work had already landed and current follow-up
  work had been moved to `docs/TODO.md`.

Earlier cleanup in the same wave:

- Added `docs/README.md` as the local documentation index.
- Added `docs/TODO.md` as the canonical agent work queue for remaining data,
  source, schema, calculator, and recommender work.
- Replaced the stale 127-card-era `docs/ROADMAP.md` with a short roadmap that
  points to `docs/TODO.md`.
- Refreshed the root `README.md` status section to describe the current
  317-card dataset and local-only PDF archive.
- Preserved all files under `docs/sources/`; no PDFs were deleted or moved.

## 2026-07-04 - Local data/PDF review

- Added `docs/LOCAL_DATA_PDF_REVIEW_2026-07-04.md`, a holistic local review of
  the 317-card dataset, PDF archive, source manifests, validation status, and
  schema suitability.
- Parsed the local PDF archive without deleting or moving PDFs: 261 PDFs,
  2,888 pages, 0 parse failures, and 0 encrypted PDFs.
- Corrected `data/cards/sbi/cashback.yaml` after comparing against the archived
  SBI Cashback PDF: aggregate online plus offline cashback cap is Rs. 4,000 per
  statement cycle, not Rs. 5,000/month.
- Re-ran `npm.cmd --prefix site run prebuild` and
  `npm.cmd --prefix site test -- --run`; both passed after the correction.

## 2026-07-04 - Merge latest audit branch and cleanup

### Merge to `main`

- Merged `origin/pdf-verify-2026-07` into `main`.
- Pushed merge commit `0b6a635` to GitHub `main`.
- Resulting dataset contains 317 card YAML files.
- Preserved local-only PDF archive under `docs/sources/**/*.pdf`; `.gitignore`
  keeps PDFs untracked while allowing source `INDEX.md` and `_manifest.json`
  files to be tracked.

### Schema decision

The merge kept a hybrid card schema:

- From the audit branch: structured `mcc_exclusions`, `reward_cap`, and base
  reward cap fields used heavily by the 317-card dataset.
- From current `main`: accelerator semantics where `multiplier` is not required
  if `effective_rate` or `earn_components` exists, plus `effective_per_inr` and
  `metadata.last_swept_on`.

Validation after merge:

- `node site/scripts/prebuild.mjs`: passed, 351 YAML files valid, 317 cards generated.
- `npm.cmd test -- --run`: passed, 67 tests.
- `npm.cmd run typecheck`: passed.
- `npm.cmd run build`: passed, 327 static pages.

### Cleanup scope

Local-only generated/tooling directories removed:

- `.local-pdf-sources-backup/` - empty directory skeleton left after PDF restore.
- `.claude/` - local tool settings, not part of the project.
- `.planning/reviews/` - stale local review artifact.
- `graphify-out/` - generated graph analysis output.

Local audit branches pruned after `git branch --merged main` listed them as
merged/safe to delete. Git printed an additional warning for
`hdfc-audit-2026-07` because its local ref was also related to the remote ref;
the branch was already superseded by the 317-card `main` merge.

- `amex-audit-2026-07`
- `au-audit-2026-07`
- `axis-audit-2026-07`
- `bob-audit-2026-07`
- `boi-audit-2026-07`
- `canara-audit-2026-07`
- `federal-audit-2026-07`
- `hdfc-audit-2026-07`
- `hsbc-audit-2026-07`
- `icici-audit-2026-07`
- `idbi-audit-2026-07`
- `idfc-first-audit-2026-07`
- `indusind-audit-2026-07`
- `kotak-audit-2026-07`
- `kvb-audit-2026-07`
- `onecard-audit-2026-07`
- `pdf-verify-2026-07`
- `pnb-audit-2026-07`
- `rbl-audit-2026-07`
- `sbi-audit-2026-07`
- `slice-audit-2026-07`
- `south-indian-audit-2026-07`
- `standard-chartered-audit-2026-07`
- `todo-cleanup-2026-07`
- `union-audit-2026-07`
- `yes-audit-2026-07`

Remote branches pruned from GitHub after confirming they were merged into
`origin/main`:

- `origin/amex-audit-2026-07`
- `origin/au-audit-2026-07`
- `origin/axis-audit-2026-07`
- `origin/bob-audit-2026-07`
- `origin/boi-audit-2026-07`
- `origin/canara-audit-2026-07`
- `origin/claude/credit-cards-database-design-xSfPh`
- `origin/claude/database-audit-plan-jah344`
- `origin/claude/fix-api-timeout-BnKqu`
- `origin/claude/image-format-selection-VZ6vE`
- `origin/claude/issuer-logos-batch2`
- `origin/claude/recommender-followups`
- `origin/claude/update-card-spend-limits-oFBGz`
- `origin/claude/wave7-continued`
- `origin/codex/verify-card-details-and-code-comments`
- `origin/codex/verify-card-details-and-code-comments-8qtri7`
- `origin/federal-audit-2026-07`
- `origin/hsbc-audit-2026-07`
- `origin/icici-audit-2026-07`
- `origin/idbi-audit-2026-07`
- `origin/idfc-first-audit-2026-07`
- `origin/indusind-audit-2026-07`
- `origin/kotak-audit-2026-07`
- `origin/kvb-audit-2026-07`
- `origin/onecard-audit-2026-07`
- `origin/pdf-verify-2026-07`
- `origin/pnb-audit-2026-07`
- `origin/rbl-audit-2026-07`
- `origin/revert-14-claude/credit-cards-database-design-xSfPh`
- `origin/sbi-audit-2026-07`
- `origin/slice-audit-2026-07`
- `origin/south-indian-audit-2026-07`
- `origin/standard-chartered-audit-2026-07`
- `origin/todo-cleanup-2026-07`
- `origin/union-audit-2026-07`
- `origin/yes-audit-2026-07`

Additional remote branches pruned as superseded cleanup branches, even though
they were not direct ancestors of `origin/main`; each was older or smaller than
the 317-card canonical `main`:

- `origin/chore/roadmap-status-refresh` - tip `f219ed2`, 127 cards.
- `origin/claude/expand-catalog` - tip `234d93b`, 200 cards.
- `origin/codex/verify-card-details-and-code-comments-t5bukr` - tip `66fa571`, 11 cards.
- `origin/hdfc-audit-2026-07` - tip `22fad2b`, 136 cards.
