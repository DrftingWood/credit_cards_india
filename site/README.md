# site/ - Credit Cards of India

Next.js 15 App Router, TypeScript, and Tailwind. The app reads the compiled JSON
artifact generated from the YAML dataset in the parent directory.

## Develop

```powershell
cd site
npm install
npm run dev
```

`npm run dev` automatically runs `scripts/prebuild.mjs`, which regenerates
`../dist/*.json` first.

Open http://localhost:3000.

## Build

```powershell
npm run build
npm run start
```

`npm run build` also regenerates `../dist/*.json` before the Next build.

## Data Flow

```text
data/**/*.yaml
   -> site/scripts/prebuild.mjs
   -> dist/cards.json, issuers.json, networks.json, index.json,
      loyalty_programs.json, category_rules.json
   -> site/lib/data.ts
   -> SSG pages under app/
```

No Python is required on the deploy path. Python is still used for dataset
tooling outside deploy: `scripts/validate.py` in CI, `scripts/new_card.py`, and
`scripts/tag_canonical_categories.py`.

## Deployment

The app is deployed from the `site/` directory. In Vercel, set Project Settings
-> General -> Root Directory to `site`.

With that set, Vercel auto-detects Next.js, runs `npm install`, then
`npm run build`, which triggers `scripts/prebuild.mjs`.

Set `NEXT_PUBLIC_SITE_URL` in project environment variables so the sitemap uses
the production host.

Interactive pages receive a trimmed `ClientCard` (`lib/client-card.ts`), not
the full `EnrichedCard`: every card they list is serialised into the HTML.
Add a field to `ClientCard` and `toClientCard()` before reading it in a client
component; `lib/client-card.test.ts` checks both shapes give identical output.

`build.mjs` fails the build on a missing issuer/network/loyalty programme, a
duplicate id, or a logo/image path with no file under `public/`.

## Folder Layout

- `app/` - routes for home, browse, compare, calculator, recommender, booking,
  card detail, about, sitemap, robots, and 404.
- `components/` - presentational pieces.
- `lib/` - data loading, filters, calculator, recommender, types, and utilities.
- `scripts/` - prebuild, schema validation, JSON generation, and generated
  schema types.
- `styles/` - Tailwind entry.

## Current Features

- Home with headline stats and featured cards.
- Browse with filters, Fuse.js search, and shareable URL state.
- Card detail pages with fees, rewards, benefits, eligibility, source links, and
  history timeline.
- Reward calculator over eight canonical spend categories; net value
  subtracts the annual fee incl. GST, waived only on qualifying spend
  (docs/DECISIONS.md D-21).
- Guided recommender.
- Booking-channel cost comparison (`/booking`).
- Side-by-side comparison for up to four cards.
- Beta banner, SEO metadata, sitemap, and robots.

## Not Yet

- Full source-evidence mapping from each rendered field to a local archived PDF
  or issuer page.
- Dark mode.
- Analytics.
