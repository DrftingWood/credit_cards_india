## 2026-10-27 - HSBC Visa Platinum evidence archive

- Archived current card-specific MITC, Service Guide, KFS, welcome, EazyDiner, fuel contactless and District offer PDFs with extracted text; added the issuer product-page extract and updated HSBC manifest/index.
- Revalidated and updated Visa Platinum fees, rewards, partner ratios, welcome benefits, fuel offers and eligibility; retained source conflicts and representation gaps.
- Dataset-wide validation remains in progress.

## 2026-10-27 - HSBC RuPay Platinum evidence archive

- Archived current card MITC, Service Guide, KFS, welcome cashback terms and EazyDiner terms with extracted text; updated HSBC source manifest and source index.
- Revalidated the HSBC RuPay Platinum record against current issuer material and refreshed current fees, rewards, redemption partners, offers, fuel waiver and eligibility.
- Dataset-wide validation remains in progress.

## 2026-10-27 - HSBC Premier evidence archive

- Archived current Premier card-specific MITC, introductory offer terms, and HSBC Rewards Terms in `docs/sources/hsbc/premier/` with extracted text files; updated the HSBC source manifest and source index.
- Updated HSBC Premier record from current issuer sources, including fees, rewards, current offer, lounge, insurance and relationship eligibility; unresolved issuer conflicts are documented.
- Dataset-wide validation remains in progress.

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

## 2026-10-27 ? HSBC Live+ issuer source refresh

Archived seven current HSBC/Visa Live+ issuer PDFs under `docs/sources/hsbc/live-plus/`, refreshed the HSBC source manifest and index, and aligned the Live+ card record with the current Service Guide and product page. The data review and unresolved-source differences are recorded in the credit-card validation checklist and accuracy overview.


## 2026-10-27 ? ICICI Emirates Emeralde current-term review

Compared the Emirates Emeralde card record with current ICICI issuer product/FAQ material, the linked card-specific T&C, October 2026 MITC, active Emirates promo terms and the official 2022 launch announcement. Archived retrieved PDFs/text and issuer extract, corrected substantiated fields and documented unresolved BookMyShow, self-employed eligibility and current network/tier conflicts. Updated the ICICI manifest/index, validation checklist, current database overview and confidence audit. Validator, numeric evidence audit and stamp audit completed; results are recorded in the checklist and overview.


## 2026-10-27 ? ICICI Emirates Emeralde current-term review

Compared the card record with current ICICI product/FAQ material, linked card-specific T&C, October 2026 MITC, active Emirates promo terms and the official 2022 launch announcement. Archived the retrieved PDFs/text and issuer extract, corrected substantiated fields and documented unresolved BookMyShow, self-employed eligibility and current network/tier conflicts. Updated the ICICI manifest/index, validation checklist, current database overview and confidence audit. Validator, numeric evidence audit and stamp audit completed; results are in the checklist and overview.


## 2026-10-27 ? ICICI Emirates Rubyx current-term review

Compared current ICICI product/FAQ and card-specific terms with current MITC, linked BookMyShow terms, active Emirates promo conditions and the official launch announcement. Marked the record on-hold based on the current no-applications notice; corrected reward rate, mileage exclusions, lounge gate, movie gating, fuel range, fee and eligibility fields; removed unsupported mileage INR estimates; and documented conflicts with broader issuer pages. Archived source PDFs/text, updated manifest/index, checklist, accuracy overview, TODO snapshot and confidence audit.


## 2026-10-27 ? ICICI Emirates Sapphiro current-term review

Compared the current Sapphiro card page/FAQ, card-specific T&C, current MITC, linked BookMyShow offer and Emirates campaign conditions, plus the official 2022 launch announcement. Updated the card record and archived retrieved PDFs/text and an issuer-source extract. Documented 1.5 vs 2 miles/?100 source conflict, generic Gold-tier clause without an Sapphiro-specific threshold, and historical Visa branding without current network/tier confirmation. Updated the manifest/index, validation checklist, accuracy overview, TODO snapshot and confidence audit.
## 2026-10-27 - ICICI Emeralde Private Metal current-term review

Compared the current ICICI product page/FAQ, card-specific T&C updated 21-May-2026, current MITC, current iShop FAQ/cap table, and ICICI Lombard group insurance policy updated December 2025. Corrected launch/network/tier to unknown, refreshed fee and reward terms, redemption values and exclusions, card-specific iShop caps, lounge/golf/benefit conditions, fuel waiver cap, insurance details and age eligibility. Replaced unsupported point valuations and unsupported INR5,000,000 travel-medical cover; documented unresolved iShop multipliers, reward-cap conflict and insurance activity-window conflict. Archived retrieved PDFs/text and updated manifest/index, checklist, overview, TODO and confidence audit.


## 2026-10-27 - ICICI Emeralde issuer source review

Compared current ICICI product page/FAQ, linked membership guide, current MITC and general terms, golf terms, group insurance policy and cancellation process. Updated the card record, archived retrieved PDFs/text and issuer extract, documented unresolved source conflicts, and refreshed the ICICI manifest/index, checklist, accuracy overview, TODO snapshot and confidence audit. Live validator passed; numeric evidence and stamp audit results are recorded in the overview.


## 2026-10-27 - MakeMyTrip ICICI Bank Credit Card source review

Compared the current ICICI card product/FAQ, linked card-specific T&Cs and MITC, official launch release, MakeMyTrip partner page and BookMyShow offer terms. Updated the card record, archived retrieved PDFs/text and issuer extract, documented future terms and unresolved conflicts, and refreshed the ICICI manifest/index, checklist, accuracy overview, TODO and confidence audit. Validation and evidence-path/stamp audit results are recorded in the overview.


## 2026-10-27 - ICICI Parakram current-term review

Compared the current ICICI Parakram page/FAQ, card-specific T&C, current MITC and insurance policy. Updated card YAML, archived dated PDFs and issuer extract, cleared unsupported network/tier/launch date and point valuation, corrected reward, lounge, fee, insurance and eligibility terms, then refreshed manifest/index and validation tracking documents. Validator passed with zero errors/warnings; evidence-path and stamp audits are reflected in the overview.


## 2026-10-27 - ICICI Rubyx current-term review

Compared current ICICI product and eligibility page/FAQ, MITC, card terms, welcome T&Cs, golf terms, insurance policy and iShop cap guidance. Corrected the Rubyx YAML, archived retrieved sources, updated manifest/index and validation tracking; documented unresolved insurance activity-window conflict and unknown cash advance transaction fee. Validator passed with zero errors and warnings.


## 2026-10-27 - ICICI Sapphiro current-term review

Compared current ICICI Sapphiro product/eligibility page and FAQ, MITC, card terms, welcome voucher T&Cs, golf rules, current insurance policy and iShop points/capping rules. Corrected the card YAML, archived issuer sources, updated manifest/index and validation documents, and documented the 60/90-day insurance activity conflict and unknown cash-advance fee. Validator passed with zero errors/warnings.


## 2026-10-27 - IDFC FIRST WOW! current-term review

Reviewed current issuer product page/MITC and card communications; corrected the WOW YAML, archived source captures, refreshed IDFC FIRST manifest/index and validation tracking. Removed WOW Black lounge/welcome claims, updated rewards, ATM fee, fuel waiver and FD eligibility, and documented unconfirmed legacy insurance claims. Validator passed with zero errors and warnings.


## 2026-10-27 - ICICI Times Black current-term review

Reviewed current ICICI product/FAQ, current card terms/MITC, insurance schedule and CFAR process. Corrected card YAML, archived refreshed sources, updated ICICI source manifest/index and validation tracking. Validator passed with zero errors and warnings.


## 2026-10-27 - IndusInd Avios Visa Infinite current-term review

Compared current issuer card page, premium MITC, launch release, Qatar/BA Avios conditions, fuel waiver, meet-and-greet, travel insurance and Total Protect. Corrected Avios YAML, archived captures/PDFs, added field comparison, refreshed IndusInd source manifest/index and validation tracking. Validator passed with zero errors and warnings; numeric evidence/stamp audits recorded.


## 2026-10-27 - IndusInd Legend current-term review

Compared current Legend product page, 13-Oct-2026 MITC, Dec-2025 benefit guide, reward/cash-credit/airline redemption terms and current fuel schedule. Corrected card YAML, archived sources, added field-level comparison, refreshed IndusInd manifest/index and validation tracking. Validator passed with zero errors/warnings; numeric-evidence and stamp audits recorded.


## 2026-10-27 - IndusInd Pinnacle current-term review

Compared current Pinnacle product page, 13-Oct-2026 MITC, reward/redeem terms, lounge threshold, fuel schedule and golf guide. Updated Pinnacle card data, archived current issuer sources, added field-level comparison, refreshed IndusInd source manifest/index and validation progress documents. Validator passed with zero errors/warnings; numeric evidence and stamp audits recorded.


## 2026-10-27 - Kotak Cashback+ Prime source archive

- Archived the current Kotak Cashback+ Prime KFS, card-specific terms and issuer product-page capture; added a claim-level issuer extract and updated the Kotak source manifest and index.
- Updated fee, reward and benefit claims in the card record after source comparison; dataset-wide validation remains in progress.


## 2026-10-27 - Kotak Cashback+ source archive

- Archived current Cashback+ KFS, card-specific terms and live product/claim page captures; added a claim-level evidence extract and updated Kotak manifest/index.
- Corrected the card record against current sources; dataset-wide validation remains in progress.
