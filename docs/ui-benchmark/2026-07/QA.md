# Visual/functional QA sweep — 2026-07 site redesign

Branch: `site-functional-2026-07`. Sweep performed against `npm.cmd --prefix site run dev`
(http://localhost:3000) using the Playwright MCP browser tools. Screenshots in this
directory are named `<page>-<width>.png`.

Assertion per page × viewport: `document.body.scrollWidth <= window.innerWidth`
(no horizontal body scroll). Evaluated via `browser_evaluate` immediately after
navigation/resize, before the screenshot.

## Results

| Page | 390×844 | 768×1024 | 1440×900 |
| --- | --- | --- | --- |
| `/` | PASS (scrollWidth 375 ≤ 390) | PASS (753 ≤ 768) | PASS (1425 ≤ 1440) |
| `/browse` | PASS (375 ≤ 390) | PASS (753 ≤ 768) | PASS (1425 ≤ 1440) |
| `/card/hdfc/infinia` | PASS (375 ≤ 390) | PASS (753 ≤ 768) | PASS (1425 ≤ 1440) |
| `/compare?cards=hdfc-infinia,axis-atlas,sbi-cashback` | PASS (375 ≤ 390) | PASS (753 ≤ 768) | PASS (1425 ≤ 1440) |
| `/recommend` (wizard landing) | PASS (375 ≤ 390) | PASS (768 ≤ 768) | PASS (1425 ≤ 1440) |

All 15 page × viewport combinations PASS. No horizontal body scroll found on any
page at any of the three viewports — no fixes were required this pass.

Screenshot files:

- `home-390.png`, `home-768.png`, `home-1440.png`
- `browse-390.png`, `browse-768.png`, `browse-1440.png`
- `card-hdfc-infinia-390.png`, `card-hdfc-infinia-768.png`, `card-hdfc-infinia-1440.png`
- `compare-390.png`, `compare-768.png`, `compare-1440.png`
- `recommend-390.png`, `recommend-768.png`, `recommend-1440.png`
- `recommend-results-390.png` (bonus — see below)

## `/recommend` wizard walkthrough

The brief marked walking the full wizard to results as optional/non-blocking.
The wizard was quick to complete (5 steps, one skipped as not-applicable given
the answers given), so **results were captured** at 390px:
`recommend-results-390.png`. Path taken: income `< ₹30k`, goal "Maximising
cashback", spend online `₹5k–₹15k` / travel `₹0` / dining `< ₹5k` / groceries
`< ₹5k` / fuel `₹0`, brand pick "Amazon" (1 of 2), step 4 (loyalty) auto-skipped
as not applicable to the answers given, lifestyle lounge access "Don't use
them". Result: `scrollWidth 375 ≤ innerWidth 390` → PASS. Desktop
(768/1440) results screens were not separately captured (mobile spot-check was
the required target; not blocking per the brief).

## Mobile (390px) spot-checks

- **Home (`/`)**: shows the "Where does most of your money go?" spend-starter
  (category quick-picks + "Rank my cards" CTA) and the "Best cards, by what you
  need" category-tile grid. No card grid is rendered on mobile — confirmed via
  accessibility snapshot (no `CardGrid`/card-list content in the `main` region
  besides the tiles and tools sections). Matches expected intent-routing IA.
- **Browse (`/browse`)**: mobile shows a collapsible `Filters` toggle button
  above the results. With zero filters active it reads `Filters` (no count,
  correct — count is conditional). Verified the count mechanism by loading
  `/browse?network=visa`: button text became `Filters (1 active)`, confirming
  the "Filters (N active)" behavior described in the brief actually renders
  when filters are active.
- **Recommend results (`/recommend`, mobile)**: the highlights band ("Best
  overall for your spend" / "Best lifetime-free pick" article cards) renders
  above the "All ranked results" ordered list — confirmed via accessibility
  snapshot and `recommend-results-390.png`. Matches the answer-first grouped
  presentation (D25).

## Notes / non-blocking observations (out of scope for this pass)

- **Dev-only debug panel confirmed gated correctly.** `/recommend` results show
  a "Debug: payload" `<details>` element in `npm run dev` (this is expected —
  `site/app/recommend/recommend-client.tsx` gates it with
  `process.env.NODE_ENV !== "production"`, so it is compiled out of production
  builds). This was one of the C3 concerns ("public recommend results expose a
  debug payload panel") — confirmed already resolved; not a production-facing
  issue.
- **Pre-existing Next/Image aspect-ratio warnings** (18 console warnings on
  `/browse` and the card detail page, for issuer/network SVG logos: "has either
  width or height modified, but not the other"). These are cosmetic dev-console
  warnings from `next/image` usage, unrelated to the Tasks 1–9 responsive
  redesign and unrelated to the horizontal-scroll assertion (they don't affect
  layout or produce visual defects in the screenshots). Not fixed here — noted
  for a future pass if picked up.
- **`favicon.ico` 404** on every page load (console error, cosmetic only, no
  favicon file exists in `site/app`). Pre-existing, unrelated to the redesign
  scope. Not fixed here.

No code fixes were required or made during this QA pass — all pages already
pass the no-horizontal-scroll assertion at all three viewports.

## Build gate

- `npm.cmd --prefix site run prebuild` — clean (319 cards, 25 issuers, 5
  networks, 5 loyalty programs written to `dist/`; schema validation OK, 354
  files).
- `npm.cmd --prefix site run typecheck` — clean (`tsc --noEmit`, no errors).
- `npm.cmd --prefix site test -- --run` — 104/104 tests passing (13 files).
- `npm.cmd --prefix site run build` — **known Windows-only environment
  limitation**, reproduced on unmodified `main`/this branch alike: the
  production build fails with a `spawn UNKNOWN` worker-pool error on this
  Windows machine. This is not a code defect introduced by Tasks 1–9 or this
  QA pass — with `experimental.cpus: 1` set locally (not committed), the build
  completes all 330/330 pages successfully, confirming the app itself builds
  correctly and the failure is specific to this machine's worker-process
  spawning under Next.js's default multi-worker build. No `next.config` change
  was committed. Production-build verification for this branch therefore rests
  on the passing prebuild + typecheck + test gates above, plus the manual
  `cpus:1` local build confirmation.

## Conclusion

Responsive QA sweep is green across all three target viewports for all five
required pages, with no horizontal body scroll anywhere and no code changes
needed. Mobile spot-checks for the answer-first home IA, the collapsible
browse filter sheet, and the recommend highlights band all confirm the
Tasks 1–9 redesign behaves as intended in a real browser, not just in unit
tests.

While reading source for the spot-checks, all six original C3 issues were
independently re-verified as already resolved in this branch's code (each
carries an inline `(C3)` comment at the fix site):

1. Detail pages linking discontinued/on-hold/invite-only cards into tools —
   fixed in `site/app/card/[issuer]/[slug]/page.tsx` (CTAs only render when
   the card actually appears in that tool's active-card set).
2. Browse/compare reading URL params only on first mount — fixed in both
   `browse-client.tsx` and `compare-client.tsx` (bidirectional state↔URL sync
   effects, loop-guarded by serialised round-trip comparison).
3. Mobile browse putting the filter list before results — fixed via
   `order-1`/`order-2` in `browse-client.tsx`, confirmed live in this pass
   (`browse-390.png`).
4. Header navigation overflow on narrow screens — fixed via `flex-wrap` in
   `site/app/layout.tsx`, confirmed live at 390px (no clipping in any header
   screenshot).
5. Recommend wizard marking skipped steps as completed — confirmed live: the
   skipped loyalty step showed "–" (not-applicable), not a checkmark, during
   the wizard walkthrough.
6. Public recommend results exposing a debug payload panel — confirmed
   gated behind `process.env.NODE_ENV !== "production"`, so it does not ship
   in production builds.

This clears D9 (browser-QA the responsive fixes — done, this document), D25
(answer-first grouped presentation — confirmed live in the recommend
highlights band and the home spend-starter/category-tile IA), and C3 (site
responsive fixes — all six original issues confirmed resolved and
responsive-QA'd at 390/768/1440px, this document).
