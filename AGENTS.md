# Agent instructions

The full project rules are in [CLAUDE.md](CLAUDE.md). Any coding agent working here must follow it. The essentials:

- Never edit `data/` except through the data workflow in `docs/CONTRIBUTING.md`. Do not touch `docs/sources/**/*.pdf`.
- Work in a separate git worktree and branch. Do not stash, reset or commit files you did not write; the main checkout may hold uncommitted data review edits.
- Before a PR: `python scripts/validate.py`, then from `site/` run `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`.
- UI changes: measure edges, columns and tracking in the browser at 1280, 1920 and 390 and report the numbers. No decorative emoji; labels first.
- Keep the existing palette and tokens. Check versions online before upgrades and pin exactly.
- The owner merges PRs. Commits written by an agent end with a `Co-Authored-By` trailer.

## Next.js version

The site uses Next.js 16 (Turbopack by default). APIs and conventions differ between versions: check the official docs for the installed version (see `site/package.json`) before writing routing, caching or config code, and heed deprecation notices (`next lint` and `middleware` are gone or renamed in 16; `params` and `searchParams` are Promises).
