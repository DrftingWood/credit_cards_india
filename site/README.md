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
data/**/*.yaml            (source of truth)
   ↓ python scripts/build.py
dist/cards.json, issuers.json, networks.json, index.json
   ↓ site/lib/data.ts (imported at build time)
SSG pages under app/
```

Every page on the site is pre-rendered (`generateStaticParams` for the per-card routes). The calculator is a client component but runs over the same compiled JSON.

## Deployment

Configured for Vercel via the repo-root `vercel.json`. Vercel runs Python 3 during the build, so `npm run build` → `scripts/prebuild.mjs` → `python scripts/build.py` works out of the box.

Set `NEXT_PUBLIC_SITE_URL` to the production URL so the sitemap has the correct host.

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
- Reward-rate calculator (8 canonical categories) ranking all active cards by net annual value.
- Beta banner, SEO metadata + sitemap + robots.

## Not yet

- Card art / issuer logos.
- Side-by-side comparison.
- Dark mode.
- Analytics.
- Auto-regenerated types from `../schema/card.schema.json` (scaffold under `scripts/gen-types.mjs`, run manually).
