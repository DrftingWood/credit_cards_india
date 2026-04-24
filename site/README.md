# site/ — Credit Cards of India

Next.js 15 (App Router) + TypeScript + Tailwind. Reads the build artefact produced by the Python dataset in the parent directory.

## Develop

```bash
cd site
npm install
npm run dev          # auto-runs ../scripts/build.py via scripts/prebuild.mjs
```

Open http://localhost:3000.

## Build

```bash
npm run build        # also runs the Python build step first
npm run start
```

## Data flow

```
data/**/*.yaml                     (source of truth)
   ↓ site/scripts/build.mjs        (invoked via prebuild; Node + js-yaml)
dist/cards.json, issuers.json, networks.json, index.json
   ↓ site/lib/data.ts              (static JSON imports, bundled at build time)
SSG pages under app/
```

Every page on the site is pre-rendered (`generateStaticParams` for the per-card routes). The calculator and compare UIs are client components but run over the same compiled JSON.

No Python on the deploy path — the old `scripts/build.py` was ported to Node. Python is still used for dataset tooling outside the deploy: `scripts/validate.py` (CI), `scripts/new_card.py` (scaffolder), `scripts/tag_canonical_categories.py` (one-shot migration).

## Deployment

Deployed to Vercel. Because the Next.js app lives under `site/` (not at repo root), the deploy requires one explicit setting:

- In Vercel **Project Settings → General → Root Directory**, set to **`site`**.

With that set, Vercel auto-detects Next.js, runs `npm install`, then `npm run build` which triggers `scripts/prebuild.mjs` to regenerate `../dist/*.json` via Node. No Python is required on the deploy path.

Set `NEXT_PUBLIC_SITE_URL` in project env vars to the production URL so the sitemap has the correct host.

## Folder layout

- `app/` — routes (home, browse, calculator, card detail, about, sitemap, 404).
- `components/` — presentational pieces (grid, tile, sections, banner, filter bar).
- `lib/` — data loading, filters, calculator, types, utilities.
- `scripts/` — prebuild (runs Python) and generator for typed schema types.
- `styles/` — Tailwind entry.

## What's in v0

- Home with headline stats + featured cards.
- Browse with filters (issuer / network / tier / reward currency / features) + Fuse.js search; filter state reflected in URL.
- Per-card detail with fees, rewards, benefits, eligibility, apply link, history timeline, source links on every section.
- Reward-rate calculator (8 canonical categories) ranking all active cards by net annual value; prefers schema-tagged `canonical_categories` over the heuristic fallback.
- Side-by-side comparison at `/compare` — pin up to 4 cards; selection reflected in URL for shareable links.
- Beta banner, SEO metadata + sitemap + robots.

## Not yet

- Card art / issuer logos.
- Dark mode.
- Analytics.
- Auto-regenerated types from `../schema/card.schema.json` (scaffold under `scripts/gen-types.mjs`, run manually).
