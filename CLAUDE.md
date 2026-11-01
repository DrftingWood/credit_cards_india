# credit_cards_india

An open, versioned dataset of credit cards issued in India (YAML, one file per card, JSON Schema validated), a Next.js comparison site that renders it, and Python engines around it. No server database, no auth, no scraping service. Read `README.md` and `docs/README.md` (the documentation map) first.

## Layout

```text
data/                  the dataset: cards/<issuer>/<slug>.yaml, issuers/, networks/, loyalty_programs/, channels/
schema/                JSON Schemas
scripts/               validate.py (authoritative checks), provenance.py, check_links.py, new_card.py, tests (test_*.py)
site/                  Next.js app (app/, components/, lib/, styles/); lib/ holds the calculator and recommender engines
booking-savings/       Python booking-savings engine and its tests
docs/                  CONTRIBUTING.md, SCHEMA.md, DECISIONS.md, TODO.md, PROVENANCE.md, CODING_STANDARDS.md, audits, superpowers/ (specs and plans)
.github/workflows/     validate.yml, link-check.yml
```

Local PDF evidence lives in `docs/sources/**/*.pdf`. It is gitignored and exists on one machine. Never delete or move it.

## Hard rules

- **Never edit `data/` except through the data workflow in `docs/CONTRIBUTING.md`.** Scaffold with `scripts/new_card.py`, close the old dated record and append a new one (never overwrite fees, rewards, benefits), bump `metadata.last_verified_on`, cite the issuer source with `source.retrieved_on`. Tooling and standards work must not touch `data/`, `docs/sources/` or the audit docs; check with `git diff --stat <base> -- data` (must be empty).
- A data review may be in progress with many uncommitted edits in the main checkout. Do not stash, reset, reformat or commit anything you did not write. Work in a separate worktree on its own branch.
- Do not run `git add --renormalize` or a repo-wide formatter. Prettier is a later, owner-triggered step.
- Palette, tokens and dark mode already exist (`site/styles/tokens.css`, tested by `site/lib/design-tokens.test.ts`). Extend them; do not import another project's look.
- Check versions and docs online before an upgrade or a new tool, cite the version and date in the PR, and pin exactly.

## Commands before a PR

Data (from the repo root):

```powershell
pip install -r scripts/requirements.txt   # one-time
python scripts/validate.py                # exit 0 = clean
python scripts/test_provenance.py         # plus the other scripts/test_*.py the workflow runs
npm.cmd --prefix site run prebuild        # schema types + dist/*.json
```

Site (from `site/`):

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build
```

CI (`.github/workflows/validate.yml`) runs the Python checks today; site checks are added by the standards plan (`docs/superpowers/plans/2026-11-01-standards-alignment.md`).

## UI rules

- **Measure before done.** Before calling a UI change finished, measure in the browser at 1280, 1920 and 390 widths: left edges, column positions, computed font size and tracking. Report the numbers, not "looks aligned". Page long lists instead of rendering them whole.
- **No decorative emoji. Labels first.** Text labels carry the meaning; an icon supports a label and never replaces it. One icon system (Phosphor, planned) through one barrel; hand-drawn SVGs stay only for issuer and network marks.
- Numbers users compare (fees, reward rates, rupee amounts) use tabular figures and right alignment in columns.
- Colour never carries meaning alone. Keep focus rings, 24 px minimum targets (44 px on touch), and contrast tests green.

## Conventions

- Site code: TypeScript strict, Tailwind with the existing tokens, `@/` imports, engines stay in `site/lib/` and never import from `app/` or `components/`.
- Comments explain why, not what. Match the existing style; do not refactor working code for style.
- Add a test with each logic change. Do not retro-fit tests on stable code.
- New files stay under 800 lines. Rule names (ST- size, NC- naming, UI- precision) are defined in `docs/CODING_STANDARDS.md`.

## Agents, subagents and worktrees

- Use a worktree per task (`git worktree add ../<name> -b <branch> <base>`); never switch branches in the main checkout.
- Dispatch implementers and reviewers on Sonnet by default. A subagent gets a written brief with exact values, files and the "done when" line, and does not dispatch further agents.
- One PR per concern, stacked in plan order. The owner merges; agents do not push to `main` or merge.
- Do not stash with bare `git stash`; the stash stack is shared across worktrees. Use a WIP commit.
- Commit messages end with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`; PR bodies end with `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.

## Where things are decided

`docs/DECISIONS.md` (D-numbers), `docs/TODO.md` (task board), `docs/superpowers/specs/` and `plans/` (current standards work), `docs/audits/standards-gap-2026-11-01.md` (the gap audit behind `docs/CODING_STANDARDS.md`).
