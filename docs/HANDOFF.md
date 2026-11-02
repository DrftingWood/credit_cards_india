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
- `docs/DECISIONS.md` D-28 to D-31: browse rendering, TypeScript 6, Tailwind 4, Next 16.
- `docs/audits/standards-gap-2026-11-01.md`: the gap analysis; `docs/superpowers/specs` and `plans` hold the design and plan.
- Ratchet baselines, which only go down: `site/ratchet-baseline.json` (`any`, `as unknown as`, `!`, `eslint-disable`, `lintWarnings`) and `scripts/lint-baseline.json` (validator warnings). When a check says "below baseline", lower the number in the same PR (`npm run ratchet` / `python scripts/validate.py --check-ratchet` print the current count). Size cap: `site/scripts/file-size-allowlist.json` (lower `max` as files shrink).

## Open owner decisions and deferred items

1. PDF source-archive backup location is not chosen; the PDFs have no backup (`docs/PROVENANCE.md`, "Owner decision needed").
2. Branch protection: the old required check `validate` is now job `data`. Update it, and add `site` and `python-tests`.
3. Vercel: turn on "Include source files outside of the Root Directory" (the site imports `../../dist` and `../data`), and run a preview deploy before promoting the Next 16 upgrade (D-31).
4. Bump Next to 16.4.3 on or after 2026-11-06 (16.4.2 was chosen because it is at least 14 days old).
5. `react-hooks/set-state-in-effect` is a warning at 4 sites (`browse-client`, `compare-client`, `beta-banner`, `theme-toggle`); fixing is deferred.
6. `/browse` renders dynamically per request (D-28). Options: CDN `s-maxage`, or a static `/browse/page/[n]`.
7. The input placeholder colour is now the contrast-passing token (darker) after the Tailwind 4 upgrade (D-30 item 6). Revert is possible if the owner prefers the old grey.
8. The card page info grid keeps a v3 specificity quirk (only the first cell gets a bottom rule at md+). One-line fix if wanted.
9. `npm audit --omit=dev` (checked 2026-11-01) reports 1 high vulnerability, in `js-yaml` 4.x (quadratic CPU on merge keys/omap), fix available via `npm audit fix`. Decide whether to take it; earlier notes recorded 6 (5 high, 1 critical), so re-check before acting.
10. Prettier reformat (plan Task 13) waits until the data review is committed. Then run the format commit and add `.git-blame-ignore-revs`.
11. Splitting `docs/TODO.md` and moving the `*-audit.md` files into `docs/audits/` also wait for the data review commit (those files have uncommitted edits elsewhere). `docs/DECISIONS.md` is deliberately not reordered: others append D-NN entries.
12. `.gitattributes` forces `eol=lf`; a Windows checkout of existing files may show CRLF churn. Do not run `git add --renormalize` without the owner.
13. The Python tests run as plain scripts in CI, not pytest. Converting them is an owner decision.
14. Lint warnings outside the ratchet scope: 3 in `site/scripts/` and 4 hook warnings. `npm run lint` shows 123 warnings; the ratchet baseline counts 116, so these 7 are outside it and nothing stops them growing.
