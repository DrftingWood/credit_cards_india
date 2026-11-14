# Standards Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring credit_cards_india up to debate_cv's code, dataset, design, icon, accessibility and process standards without touching `data/`.

**Architecture:** 13 stacked PRs, one task each, in merge order. Each task adds an enforcement (CI job, lint rule, script or test) together with the baseline that makes it pass on today's code, then ratchets. Site work lives in `site/`, dataset tooling in `scripts/` and `schema/`, rules in `docs/`.

**Tech Stack:** Next.js (site), Tailwind, Vitest, ESLint flat config, Prettier, Python 3.12 + pytest (scripts, booking-savings), GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-11-01-standards-alignment-design.md`. Evidence: the audit in `C:\Users\achar\reports\credit_cards_india - standards gap audit 2026-11-01.md` (copied into `docs/audits/standards-gap-2026-11-01.md` in Task 1).

## Global Constraints

- Never modify, reformat or delete anything under `data/`, `dist/`, `docs/sources/`, or the uncommitted audit docs. Verify with `git diff --stat origin/main -- data` being empty on every PR.
- Work in worktree branches stacked in order: `standards/01-docs` from main, `standards/02-ci` from `01`, and so on. Branch names `standards/NN-<slug>`.
- Commit messages end with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`; PR bodies end with `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.
- Push branches and open PRs with `gh` (owner approved 2026-11-01). The owner merges; never merge.
- Prettier: double quotes, semicolons, trailing commas `all`, width 100, LF. Scope `site/`, `scripts/*.mjs`, workflow YAML, JSON config, CSS. Excludes `data/`, `dist/`, `docs/`, `.next`, generated types, lockfiles.
- Fonts Inter via `next/font`, `.num` tabular figures; icons Phosphor via one barrel; no decorative emoji; palette and tokens unchanged.
- Row height 34 px desktop, 44 px touch. Browse pages at 24. Dense table is an opt-in toggle.
- `schema_version` lives in `schema/` and the `dist` manifest, never in a card YAML. Baselines are taken from committed main.
- TypeScript stays below 7, ESLint on 9. Re-check every dependency version online and cite it in the PR body before an upgrade. Each upgrade is its own PR with a rollback note.
- File-size cap 800 lines for new or grown files; allowlist `site/lib/calculator.ts`, `site/components/recommend/recommend-client.tsx`, `site/components/calculator/calculator-client.tsx` (verify paths) with dated notes.
- Measure UI changes in the browser at 1280, 1920 and 390 and report the numbers in the PR.

## Review Focus

- A PR that makes CI red on main because a baseline was taken from the dirty working tree: expect baselines to be computed with `git stash`-free commands on a clean worktree checkout.
- Windows CRLF: `.gitattributes` must keep YAML, JSON, TS and shell files LF so Prettier and the schema tests agree.
- Browse page 2+ with no matching cards, `?page=0`, `?page=abc` or `?page=999`: must clamp or 404 cleanly, never crash.
- `loading.tsx` / `error.tsx` must not mask the build-time data validation failure.
- A skip link that is visible only on focus and does not shift layout.
- The ratchet must fail when counts rise and pass (with a "lower the baseline" hint) when they fall.

## File structure

- Create: `CLAUDE.md`, `AGENTS.md`, `.gitattributes`, `.editorconfig`, `.nvmrc`, `.python-version`, `.github/pull_request_template.md`, `docs/CODING_STANDARDS.md`, `docs/DESIGN_INSTRUCTIONS.md`, `docs/UI_UX_STANDARDS.md`, `docs/SCHEMA_CHANGELOG.md`, `docs/audits/standards-gap-2026-11-01.md`, `.prettierrc`, `.git-blame-ignore-revs`.
- Create: `site/scripts/check-ratchet.mjs`, `site/scripts/check-file-size.mjs`, `site/scripts/a11y-smoke.mjs`, `site/eslint.config.mjs`, `site/knip.json`, `site/.dependency-cruiser.cjs`, `site/.jscpd.json`, `site/ratchet-baseline.json`, `schema/VERSION`, `scripts/check_ratchet.py`, `scripts/migrations/`.
- Modify: `.github/workflows/validate.yml`, `site/package.json`, `site/tsconfig.json`, `site/styles/tokens.css`, `site/app/layout.tsx`, `site/app/browse/*`, `site/components/icons/*`, `docs/UI_UX_TODO.md`, `README.md`.

---

### Task 1: Docs and EOL policy (PR 1, `standards/01-docs`)

**Files:** Create `.gitattributes`, `.editorconfig`, `CLAUDE.md`, `AGENTS.md`, `.github/pull_request_template.md`, `docs/CODING_STANDARDS.md`, `docs/audits/standards-gap-2026-11-01.md`.

**Interfaces:** Produces the rule names (`ST-` size, `NC-` naming, `UI-` precision) later tasks cite in lint messages and PR templates.

- [ ] **Step 1: Create the worktree** `git worktree add ../cc-01 -b standards/01-docs origin/main`; the branch must contain no `data/` change.
- [ ] **Step 2: `.gitattributes`** with `* text=auto eol=lf` and binary markers for images and PDFs; `.editorconfig` with LF, 2-space indent, final newline.
- [ ] **Step 3: `CLAUDE.md` and `AGENTS.md`** adapted from debate_cv's (read `C:\Users\achar\work\debate_cv\CLAUDE.md` and `AGENTS.md`): repo layout, the data-edit rules from `docs/CONTRIBUTING.md`, the commands to run before a PR, the measure-before-done UI rule, the no-emoji and labels-first rule, subagent and worktree rules, attribution lines. Drop every Prisma, auth and scraper rule.
- [ ] **Step 4: PR template** with two sections, Data PR (validate.py passes, `last_verified_on`, source retrieved, one open record) and Site PR (typecheck, lint, test, build, screenshots at 1280 and 390, what was not verified), plus attribution and "owner merges".
- [ ] **Step 5: `docs/CODING_STANDARDS.md`** of about 20 rules, each with rule, reason, enforcement column ("enforced by Task N" or "review"), derived from the audit tables.
- [ ] **Step 6: Verify** `git diff --stat origin/main` lists only the files above; `python scripts/validate.py` passes.
- [ ] **Step 7: Commit, push, open PR** `gh pr create --base main`.

### Task 2: CI for the site and Python (PR 2, `standards/02-ci`)

**Files:** Modify `.github/workflows/validate.yml`; create `.nvmrc` (Node 24), `.python-version` (3.12); modify `site/package.json` (`engines`, `"verify"` script).

**Interfaces:** Produces workflow job ids `data`, `site`, `python-tests` (the names the owner marks required). Consumes nothing.

- [ ] **Step 1: Run the commands locally first** (`npm ci && npm run typecheck && npm run lint && npm test && npm run build` in `site/`; `pytest scripts booking-savings`); record what is red.
- [ ] **Step 2: Fix or baseline red items** that are not caused by this PR; anything unfixed is listed in the PR body with an owner decision.
- [ ] **Step 3: Extend `validate.yml`** with jobs `data` (existing steps), `site`, `python-tests`; actions pinned to commit SHAs (look up current SHAs online), `permissions: contents: read`, `concurrency` cancel-in-progress, `timeout-minutes`. `link-check.yml` untouched.
- [ ] **Step 4: Verify** the PR's own checks go green on GitHub; paste the run URL in the PR body.
- [ ] **Step 5: Commit, push, open PR** against `standards/01-docs`.

### Task 3: Report-only quality job (PR 3, `standards/03-report`)

**Files:** Create `site/knip.json`, `site/.dependency-cruiser.cjs`, `site/.jscpd.json`; modify `validate.yml` (job `report`, `continue-on-error: true`); modify `site/eslint` config for size and complexity warnings.

**Interfaces:** Produces npm scripts `knip`, `dup`, `arch`; lint rules `max-lines` 400, `max-lines-per-function` 60, `complexity` 15, `max-params` 3, `max-depth` 3 as warnings.

- [ ] **Step 1: Write a failing arch test** in `site/lib/arch.test.ts` that asserts `lib/` imports nothing from `app/` or `components/` (use dependency-cruiser's JSON output); run it, expect FAIL if a violation exists, else PASS and keep as a guard.
- [ ] **Step 2: Add the tools** at exact current versions (check online, cite); `gitleaks` and `npm audit --omit=dev` in the `report` job.
- [ ] **Step 3: Record the warning baseline** counts in `site/ratchet-baseline.json` (consumed by Task 4).
- [ ] **Step 4: Verify** `npm run knip && npm run dup && npm run arch` run without crashing; commit, push, PR against `standards/02-ci`.

### Task 4: tsconfig, ratchet and file-size gate (PR 4, `standards/04-ts`)

**Files:** Modify `site/tsconfig.json`; create `site/scripts/check-ratchet.mjs`, `site/scripts/check-file-size.mjs`, tests `site/scripts/check-ratchet.test.mjs`, `site/scripts/check-file-size.test.mjs`.

**Interfaces:** Produces `npm run ratchet` and `npm run file-size` (exit 1 on regression); `ratchet-baseline.json` keys `any`, `asUnknownAs`, `nonNull`, `eslintDisable`, `lintWarnings`.

- [ ] **Step 1: Write failing tests** for the ratchet: counts above baseline exit 1; equal exit 0; lower exits 0 and prints "lower the baseline". For file-size: a fixture file of 801 lines not in the allowlist exits 1; an allowlisted one exits 0; `generated-types.ts` and tests are ignored.
- [ ] **Step 2: Run to verify FAIL.**
- [ ] **Step 3: Implement both scripts** (port debate_cv's `scripts/check-ratchet.mjs` and `check-file-size.mjs`, adapt globs to `site/`, `scripts/`, `booking-savings/`).
- [ ] **Step 4: Turn on** `noFallthroughCasesInSwitch`, `noImplicitOverride`, `noUnusedLocals`, `noUnusedParameters`; fix what surfaces (count first and put the count in the PR body). `noUncheckedIndexedAccess` stays off.
- [ ] **Step 5: Run tests and the gates** to verify PASS; add both to the `site` CI job; commit, push, PR.

### Task 5: Flat ESLint (PR 5, `standards/05-eslint`)

**Files:** Create `site/eslint.config.mjs`; delete `site/.eslintrc.json`; modify `site/package.json` (`"lint": "eslint ."`).

**Interfaces:** Consumes Task 3's warning rules. Produces `no-restricted-imports` for direct icon imports (pattern added in Task 9).

- [ ] **Step 1:** Port `eslint.config.mjs` from debate_cv (core-web-vitals + typescript, `_` unused-vars).
- [ ] **Step 2: Verify** `npm run lint` passes and warning counts match the Task 3 baseline; commit, push, PR.

### Task 6: Dataset tooling (PR 6, `standards/06-dataset`)

**Files:** Create `schema/VERSION` (`1.0.0`), `docs/SCHEMA_CHANGELOG.md`, `scripts/migrations/README.md`, `scripts/test_lint_ratchet.py`; modify `scripts/validate.py`, `site/scripts/prebuild.mjs` (write `schema_version` into the `dist` manifest); move one-shot backfill scripts to `scripts/migrations/` with `git mv`.

**Interfaces:** Produces `validate.py` flags `--warn-orphans`, `--warn-stale DAYS` and a lint-warning count compared to `scripts/lint-baseline.json`.

- [ ] **Step 1: Write failing tests** `test_lint_ratchet.py`: more warnings than baseline fails; orphan loyalty program is reported; a card with `last_verified_on` older than the threshold is reported.
- [ ] **Step 2: Run to verify FAIL.**
- [ ] **Step 3: Implement** the flags in `validate.py` and the dist manifest field; baseline computed on a clean checkout of main.
- [ ] **Step 4: Document** the source-PDF backup plan in `docs/PROVENANCE.md` (manifest check, one documented copy location; owner decides location).
- [ ] **Step 5: Verify** `python scripts/validate.py` and `pytest scripts` pass; `git diff --stat origin/main -- data` is empty; commit, push, PR.

### Task 7: Accessibility (PR 7, `standards/07-a11y`)

**Files:** Modify `site/app/layout.tsx`, nav component, `site/components/compare-table.tsx`; create `site/app/error.tsx`, `site/app/loading.tsx`, `site/scripts/a11y-smoke.mjs`; tests alongside.

**Interfaces:** Produces `<SkipLink />` (`site/components/skip-link.tsx`, no props) and a `NavLink` that sets `aria-current="page"`.

- [ ] **Step 1: Write failing component tests:** `SkipLink` is the first focusable element and targets `#main`; `NavLink` sets `aria-current` on the active route only; the compare table scroll wrapper has `tabIndex=0` and an accessible name.
- [ ] **Step 2: Run to verify FAIL; implement; run to verify PASS.**
- [ ] **Step 3: Add `error.tsx` and `loading.tsx`**, with a test that an error boundary renders a retry action.
- [ ] **Step 4: Add axe smoke** (report-only) against `/`, `/browse`, `/compare`, `/calculator`; commit, push, PR.

### Task 8: Design standards and tokens (PR 8, `standards/08-design`)

**Files:** Create `docs/DESIGN_INSTRUCTIONS.md`, `docs/UI_UX_STANDARDS.md`; modify `site/styles/tokens.css`, `site/styles/globals.css`, `site/app/layout.tsx`, `site/tailwind.config.ts`, `site/lib/design-tokens.test.ts`.

**Interfaces:** Produces CSS variables `--container-page`, `--container-prose`, tracking roles `--tracking-label`, `--tracking-heading`, the `.num` utility, and `scrollbar-gutter: stable` on `html`.

- [ ] **Step 1: Write failing tests** in `design-tokens.test.ts`: the new variables exist; `.num` sets `font-variant-numeric: tabular-nums`; no contrast regressions.
- [ ] **Step 2: Run to verify FAIL; implement; run to verify PASS.**
- [ ] **Step 3: Load Inter** with `next/font/google` (variable, `display: swap`), mapped to `--font-sans`; apply `.num` to fee, reward and calculator columns.
- [ ] **Step 4: Measure** edges, columns, font and tracking at 1280, 1920 and 390 on `/`, `/browse`, `/compare` and paste the numbers in the PR.
- [ ] **Step 5: Commit, push, PR.**

### Task 9: Icons (PR 9, `standards/09-icons`)

**Files:** Modify `site/components/icons/index.ts` (barrel re-exporting Phosphor Regular/Light), the 7 emoji sites, `docs/UI_UX_TODO.md`, `site/eslint.config.mjs`.

**Interfaces:** Produces the lint rule banning `@phosphor-icons/react` imports outside `site/components/icons/`; the 25 custom SVGs that are marks stay under `site/components/logos/`.

- [ ] **Step 1: Write a failing test** that fails if the string-literal emoji regex matches any `.tsx` under `site/app` or `site/components`.
- [ ] **Step 2: Run to verify FAIL; replace emoji with labelled chips or Phosphor icons; run to verify PASS.**
- [ ] **Step 3:** Pin `@phosphor-icons/react` exactly (check version online); commit, push, PR.

### Task 10: Browse paging (PR 10, `standards/10-browse`)

**Files:** Modify `site/app/browse/page.tsx`, `site/components/card-grid.tsx`; create `site/components/pager.tsx`, `site/components/card-table.tsx`, `site/lib/paginate.ts` with test.

**Interfaces:** `paginate<T>(items: T[], page: number, size?: number): { items: T[]; page: number; pageCount: number; total: number }` (default size 24; clamps `page` into `[1, pageCount]`, non-numeric becomes 1). `<Pager page pageCount hrefFor />`.

- [ ] **Step 1: Write failing tests** for `paginate`: 368 items give 16 pages; `page=0`, `page=NaN`, `page=999` clamp; empty list gives `pageCount` 1.
- [ ] **Step 2: Run to verify FAIL; implement; run to verify PASS.**
- [ ] **Step 3:** Wire the pager with URL state, "N of 368" label, self-canonical for page 2+, and an opt-in dense table (34 px / 44 px rows) behind a `view=table` parameter; filters and sort keep working.
- [ ] **Step 4: Measure** column alignment and row height in the browser; commit, push, PR.

### Task 11: Dependency upgrades (PRs 11a to 11e, one branch each)

Order by current release notes, default: TypeScript 5 to 6.0, Tailwind 4, Next 16 (+ React), Vitest 5 only if debate_cv has moved. Each branch: check the registry and docs online, cite versions and release dates, run codemod or migration guide, run the full `site` job, do a before/after visual comparison at 1280 and 390, write a rollback note (revert commit plus lockfile) in the PR body.

- [ ] **Step 1 to 4 per upgrade:** read docs, upgrade, fix, verify green and screenshots, push, PR.

### Task 12: Docs hygiene (PR 12, `standards/12-docs`)

Split `docs/TODO.md`, move per-issuer audit files to `docs/audits/`, correct README counts (verify against `data/` without editing it), add `docs/HANDOFF.md`, reorder `DECISIONS.md`. Verify links with `python scripts/check_links.py --local` if supported, else a markdown link check; push, PR.

### Task 13: Prettier and format commit (PR 13, `standards/13-format`) , starts only when the owner says the data review is committed

**Files:** Create `.prettierrc`, `.prettierignore`, `.git-blame-ignore-revs`; modify `site/package.json` (`format`, `format:check`), `validate.yml`.

- [ ] **Step 1:** Commit the config alone. **Step 2:** Run `npm run format`, commit as a format-only change, record its SHA in `.git-blame-ignore-revs` in a following commit. **Step 3:** Add `format:check` to the `site` job. **Step 4: Verify** typecheck, lint, tests and build all still pass and `git diff --stat origin/main -- data` is empty; push, PR.

## Self-review notes

- Spec coverage: goals 1 to 8 map to Tasks 2, 3 to 5, 6, 8, 9, 7 and 10, 1, 11. Non-goals respected by the `data/` guard in Global Constraints.
- The audit file lives outside the repo, so Task 1 copies it in.
- Open item for the owner: external-facing checks are only "required" once the owner sets branch protection.
