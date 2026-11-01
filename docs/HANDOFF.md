# Handoff

One-page orientation for the next person or agent. Written 2026-11-01 at the end of the standards-alignment work (`docs/superpowers/plans/2026-11-01-standards-alignment.md`).

## What this repo is

An open dataset of Indian credit cards (YAML in `data/`, JSON Schema in `schema/`) plus a Next.js site in `site/` that compiles it to `dist/*.json` and renders browse, compare, calculator and recommender pages. Start with `CLAUDE.md` and `README.md`.

## How to run

```powershell
pip install -r scripts/requirements.txt
python scripts/validate.py                          # data gate (schema + cross-file lints + schema/VERSION vs changelog)
python scripts/validate.py --check-ratchet          # validator warnings may only go down
cd site; npm ci
npm run prebuild                                    # generated types + dist/*.json (needed before typecheck/test)
npm run dev                                         # or: npm run build
npm run typecheck; npm run lint; npm test; npm run ratchet; npm run file-size
python scripts/test_provenance.py                   # Python tests are plain scripts: run each scripts/test_*.py
```

## CI jobs (`.github/workflows/validate.yml`, `link-check.yml`)

| Job | Checks | Blocking |
|---|---|---|
| `data` | `validate.py`, warning ratchet, orphans and stale cards, Python provenance/evidence tests | yes |
| `site` | `npm ci`, prebuild, typecheck, lint, vitest, escape-hatch ratchet, file-size gate, `next build` | yes |
| `python-tests` | every `scripts/test_*.py` and `booking-savings/test_*.py` as a plain script | yes |
| `report` | knip, jscpd, dependency-cruiser, `npm audit --omit=dev`, gitleaks | no (report only) |
| `url-health` | weekly source-URL check (schedule or manual); `link-check.yml` is the same idea with a report artifact | no |

## Standards stack added in this work

- `CLAUDE.md`: repo instructions for agents.
- `docs/CODING_STANDARDS.md`: rules ST/NC/TE/TQ/DP/DA/UI/PR, each with an enforcement.
- `docs/DESIGN_INSTRUCTIONS.md` (DI-) and `docs/UI_UX_STANDARDS.md` (UX-): visual and behaviour rules.
- `docs/SCHEMA_CHANGELOG.md`: required entry for every `schema/VERSION` bump.
- `docs/DECISIONS.md` D-28 to D-32: browse rendering, TypeScript 6, Tailwind 4, Next 16, browse CDN cache.
- `docs/audits/standards-gap-2026-11-01.md`: the gap analysis; `docs/superpowers/specs` and `plans` hold the design and plan.
- Ratchet baselines, which only go down: `site/ratchet-baseline.json` (`any`, `as unknown as`, `!`, `eslint-disable`, `lintWarnings`, `setStateInEffect`) and `scripts/lint-baseline.json` (validator warnings). When a check says "below baseline", lower the number in the same PR (`npm run ratchet` / `python scripts/validate.py --check-ratchet` print the current count). Size cap: `site/scripts/file-size-allowlist.json` (lower `max` as files shrink).

## User-visible changes in this stack

1. Inter loads via `next/font/google`; the rupee glyph renders (latin-ext). Two glyphs on `/browse` fall back to Arial (unidentified).
2. `scrollbar-gutter: stable` makes desktop content about 15px narrower with Windows classic scrollbars (1280 left edge 64 -> 56.5). No effect on overlay scrollbars or phones.
3. Input placeholder is now the contrast-passing token (darker; D-30 item 6). Delete the `::placeholder` rule in `globals.css` to revert (not recommended).
4. Hover styles apply only on hover-capable devices (Tailwind 4 default).
5. The card page info grid keeps a v3 specificity quirk (only the first cell gets a bottom rule at md+), reproduced exactly. One-line fix if wanted.
6. The JSON-LD script is now the first child of the card `<article>` (v4 `space-y` margin). Content unchanged, still server-rendered.
7. About 19 emoji (calculator, booking) became Phosphor icons plus labels. The calculator lock/unlock badge carries a visually hidden "Locked"/"Unlocked".
8. `/browse`: 24 per page, URL-synced pager, opt-in `view=table`, dynamic rendering per request (D-28) with CDN cache `s-maxage=3600` (D-32; confirm `x-vercel-cache: HIT` on a preview deploy), 346 active cards.
9. Skip link, `aria-current` nav, focusable compare table, `error.tsx` and `loading.tsx`.
10. CI job `validate` is renamed `data`, and `site` and `python-tests` are new. Branch protection must be updated (old required check `validate`).
11. `.gitattributes` forces `eol=lf`; a Windows checkout of existing files may show CRLF churn. Do not run `git add --renormalize` without the owner.
12. Vercel: `turbopack.root` and `outputFileTracingRoot` are the repo root. Turn on "Include source files outside of the Root Directory" and do a preview deploy before promoting (D-31).
13. `npm audit --omit=dev` (re-run 2026-11-01): 1 high, `js-yaml` (quadratic CPU on merge keys/omap), fix via `npm audit fix`. Earlier notes recorded 6; decide whether to take it.

## Open owner decisions and deferred items

1. PDF source-archive backup location is not chosen; the PDFs have no backup (`docs/PROVENANCE.md`, "Owner decision needed").
2. Bump Next to 16.4.3 on or after 2026-11-06 (16.4.2 was chosen because it is at least 14 days old).
3. `react-hooks/set-state-in-effect` is a warning at 4 sites (`browse-client`, `compare-client`, `beta-banner`, `theme-toggle`); fixing is deferred. It is ratcheted (`setStateInEffect`, baseline 4), so it cannot grow.
4. Prettier reformat (plan Task 13) waits until the data review is committed. Then run the format commit and add `.git-blame-ignore-revs`.
5. Splitting `docs/TODO.md` and moving the `*-audit.md` files into `docs/audits/` also wait for the data review commit (those files have uncommitted edits elsewhere). `docs/DECISIONS.md` is deliberately not reordered: others append D-NN entries.
6. The Python tests run as plain scripts in CI, not pytest. Converting them is an owner decision.
7. Lint warnings outside the ratchet: the 3 in `site/scripts/*.mjs` (build tooling, intentionally not ratcheted; D-31). `npm run lint` shows 123 warnings; the ratchet counts 116 size/complexity plus 4 hook warnings.
8. `site/styles/globals.css` opts links out of the default hover colour with a brittle `[class*="hover:text-"]` selector (owner aware). Replace it if a class name ever changes.
9. Owner decisions: page `<title>` is identical across `?page=N` on `/browse`; `error.tsx` has no home link and there is no `global-error.tsx`.
