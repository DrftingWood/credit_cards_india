# Standards alignment with debate_cv: design (2026-11-01)

Status: draft for owner approval. Evidence: `C:\Users\achar\reports\credit_cards_india - standards gap audit 2026-11-01.md` (kept outside the repo, like debate_cv's reports).

## Intent and why

The owner runs two products. debate_cv has accumulated hard-won engineering, database, design and process standards. credit_cards_india (a YAML dataset of Indian credit cards, a Next.js site, Python engines) has none of the enforcement and only some of the discipline. The goal is to carry over what transfers, and to leave out what belongs to debate_cv's product.

Rule of thumb for every item: **port the engineering and measurement standards; do not port the look.** debate_cv is a personal record with a graphite/emerald "Statement" theme and mono score tables. credit_cards_india is a consumer comparison tool: users scan rupee amounts, fees and reward rates across many cards, mostly on phones, and must trust the numbers. The look follows that need.

## Goals

1. CI that actually builds and tests the site and the Python code, with required checks.
2. Mechanical enforcement of code standards: formatter, flat ESLint, stricter tsconfig, file-size cap, escape-hatch ratchet, and report-only dead-code, duplication and architecture checks.
3. "Database" standards applied to the dataset: schema versioning, a change log, lint-warning ratchet, orphan and staleness warnings, reproducible backups of source evidence.
4. Design and UI precision standards written down and enforced where measurable, built on the existing token system.
5. Icon discipline: one system, no decorative emoji, labels first.
6. Accessibility basics and paging of long lists.
7. Agent and process files (CLAUDE.md, AGENTS.md, PR template) so future sessions follow the same rules.
8. Dependency upgrades, each as its own PR with a rollback note, versions checked against current docs at the time.

## Non-goals

- Anything in `data/`. A data-quality review is in progress with about 690 uncommitted edits. No PR in this work may modify, reformat or delete anything under `data/`, `docs/sources/` or the audit docs those edits touch.
- Porting debate_cv's palette, emerald accent, mono tables, charts or nav model.
- Prisma, Postgres, Neon, advisory-lock, token-encryption, auth, DPDP and scraper rules. They do not apply (no server, no database).
- Rewriting the recommender or calculator engines. Only gates and baselines around them.

## Anti-goals (a failure even if it technically works)

- A PR that conflicts with, or forces a rebase of, the data review.
- A mass reformat that lands while data PRs are open.
- Gates that fail on today's code with no baseline (every new rule starts as a recorded baseline, then ratchets).
- A redesign: the existing tokens, dark mode and contrast test stay.

## Constraints

- Work happens in a separate worktree, never in the main working tree. One PR per concern, stacked in order (see below), owner merges.
- Windows checkout: an EOL policy (`.gitattributes`, LF) goes in first.
- Versions are checked online at the time of each upgrade PR and cited in its body. Registry values in the audit are a starting point only.
- Subagents run on Sonnet by default.
- No commit or push of anything outside this work.

## Decisions

Owner's (given 2026-11-01: "go with your defaults"):
- Fonts: Inter, with tabular figures where numbers are compared.
- Icons: Phosphor.
- `data/` stays out of Prettier scope until the data review commits.

My calls (marked so they can be overridden):
- **Quote style: double quotes**, not debate_cv's single. The existing site code uses double quotes, so this gives a much smaller reformat diff. The owner's "single" default was from debate_cv, and the audit shows it would churn every file for no benefit here.
- **Prettier settings otherwise as debate_cv:** semicolons, trailing commas, width 100, LF.
- **Palette and theme unchanged.** Accent, surfaces, dark mode and the semantic Tailwind names stay. No emerald/graphite import.
- **Fonts:** self-host Inter through `next/font` (no layout shift; Inter covers the rupee sign). Use `font-variant-numeric: tabular-nums` through a `.num` utility on comparison tables, fee/reward columns and calculator output. Do not adopt a mono face; the product is not a ledger. Hero numbers on card pages use proportional figures like debate_cv's stat tiles.
- **Icons:** Phosphor (Regular, Light for large) for interface glyphs through one barrel file with a lint rule banning direct imports elsewhere. Keep the existing hand-drawn SVGs only where they are marks, not glyphs (issuer and network marks, card art). The 7 emoji go; `UI_UX_TODO.md` emoji chips are rewritten as labelled chips.
- **Layout measurement standard** (from the owner's UI precision rule): before a UI change is called done, measure left edges, column positions, computed font and tracking in the browser at 1280, 1920 and 390 widths and report the numbers. Add tokens for container widths, tracking roles and `scrollbar-gutter: stable`.
- **Density and paging:** `/browse` pages at 24 cards with a URL-synced pager and "N of 368", plus a dense table view (row 34 px desktop, 44 px touch) for scanning fees. No change to filtering behaviour or SEO URLs beyond adding page parameters with canonical handling.
- **Database mapping:** the dataset gets `schema_version`, `docs/SCHEMA_CHANGELOG.md`, a `scripts/migrations/` home for one-shot backfills, orphan and staleness warnings, and a lint-warning ratchet. Source PDFs are gitignored and exist on one machine, so the plan is a documented backup and manifest check, not committing them.
- **Tool versions:** TypeScript targets 6.0 (not 7) and ESLint stays on 9 until typescript-eslint and eslint-config-next support 7 and 10 (same decision as debate_cv). Tailwind 4 and Next 16 are their own PRs. The order is left to the builder (Tailwind is the larger churn), confirmed against current docs.

## Calls settled after the builder check (mine, override freely)

- **Stacked, serial PRs.** The first PR branches from main; each later PR branches from the one before it and is based on it until the owner merges. They are numbered for merge order. "Independent of the data review" means no PR touches `data/`; it does not mean the PRs are independent of each other.
- **`schema_version` lives outside `data/`:** in `schema/` (a version file plus a field in the compiled `dist` manifest), with the changelog in `docs/`. No YAML card file gains a field. Orphan and staleness warnings and the lint-warning ratchet are baselined against **committed main**, not the working tree, because CI only ever sees commits. The baseline is re-recorded in a small follow-up once the data review lands.
- **TypeScript:** the site is on `^5.6.3` today (earlier text wrongly said it was already on 6.0). The tsconfig flags in PR 4 are written for 5.x. A TypeScript 5 to 6.0 upgrade is added to the dependency PRs (PR 11), after Tailwind and Next, matching debate_cv's version. 7 waits for typescript-eslint support.
- **Required checks:** branch protection is a GitHub setting the owner changes. The PRs only make the jobs exist and name them. `validate.yml` is extended in place (and `link-check.yml` stays as is), so existing check names don't change. CI checks out commits, so it validates committed data only; the data review's uncommitted state cannot make it fail.
- **Browse:** the dense table is an opt-in toggle, not the default. Cards remain the default view. Page 2 and later are indexable with a self-referencing canonical and `rel=prev/next` is not relied on. Filter and sort state stays in the URL as today.
- **Prettier scope:** `site/`, `scripts/*.mjs`, `booking-savings` JS, workflow YAML, JSON config and CSS. Excluded: `data/`, `dist/`, `docs/` (markdown), `.next`, generated types, lockfiles. PR 13 starts only when the owner says the data review is committed; the builder does not guess.
- **CLAUDE.md and AGENTS.md** are written fresh for this repo, adapted from debate_cv's files and the audit. The audit's findings that matter are copied into `docs/` in PR 1, so the repo does not depend on a file outside it.
- **Git:** work is committed locally in the worktree. Pushing branches and opening PRs waits for the owner's say-so (pending).

## PR sequence

Each PR is independent of the data review and must pass CI before the next starts.

1. Docs: CLAUDE.md, AGENTS.md, PR template, `.gitattributes`.
2. CI: site job (npm ci, typecheck, lint, vitest, next build), pytest for scripts and booking-savings, SHA-pinned actions, permissions, concurrency, timeouts, `.nvmrc`, `engines`.
3. CI report-only job: knip, jscpd, dependency-cruiser, npm audit, gitleaks; size and complexity lint rules as warnings with baselines.
4. TypeScript: stricter tsconfig flags, escape-hatch ratchet, file-size gate with dated allowlist.
5. Lint: flat `eslint.config.mjs`, `eslint .`, unused-vars rule, icon import restriction.
6. Dataset tooling: `schema_version`, changelog, orphan and staleness warnings, ratchet, migrations folder. No `data/` edits.
7. Accessibility: skip link, `aria-current`, focusable table wrapper, `error.tsx`, `loading.tsx`, axe smoke (report-only).
8. Design standards: write `DESIGN_INSTRUCTIONS.md` and `UI_UX_STANDARDS.md`; token additions; Inter and `.num`.
9. Icons: Phosphor barrel, remove emoji, amend `UI_UX_TODO.md`.
10. Browse: paging, pager, dense table view.
11. Dependencies: Tailwind 4, then Next 16 with React bump, then Vitest, each separate.
12. Docs hygiene: split `TODO.md`, move audits, fix README counts, add HANDOFF.
13. Format: Prettier, one mechanical commit, `.git-blame-ignore-revs`, `format:check` in CI. Last, and only after the data review is committed.

## Left to the builder

Exact rule thresholds (set from measured baselines, not guessed), file lists for allowlists, pager and table markup details, the Tailwind-versus-Next upgrade order after reading current release notes, and wording of the standards docs. Anything that would change what users see beyond the items above comes back to the owner.
