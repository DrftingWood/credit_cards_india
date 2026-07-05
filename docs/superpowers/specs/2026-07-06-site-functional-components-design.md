# Site Functional Redesign — Design Spec (2026-07-06)

## Overview & goal

Rework the site's **information architecture and presentation-logic components** so a
user can answer *"which card should I get, and why"* honestly and at a glance —
**without** committing to the final visual design yet. This spec is deliberately
scoped to the **functional layer**: structure, routing, the presentation modules,
component behaviour, and the honesty rules. The **premium visual skin** (final
palette, typography polish, the "Ink & Warm" look explored in brainstorming) is a
**separate, later Figma-driven pass** and is explicitly out of scope here.

Build on the existing Tailwind design system as-is (slate/brand tokens). Keep new
markup clean and semantic so a future visual pass can restyle it by swapping
classes/tokens, not by rewriting structure.

This spec refines and extends the earlier `2026-07-05-site-visual-redesign.md` plan:
it keeps that plan's functional tasks (grouped results, tile hierarchy, compare
winner-per-row, mobile ergonomics, trust cues) and **adds** a home-page IA rework
and an answer-first "honest card" framing that emerged from competitor benchmarking.

## Scope

**In scope (build now):**
1. `pickHighlights()` presentation module for grouped `/recommend` results.
2. Answer-first **ResultsView** — a highlights band above the ranked list.
3. **Best-pick card** + **compact ranked row** components (concrete-facts framing).
4. **Home page IA** — spend-question hero, intent-routing category tiles, trust band,
   one-line methodology, tools, guides, compact footer. No card grid up top.
5. **Category / spend routing** — tiles + hero chips route to a filtered browse/recommend view.
6. **Card tile** information hierarchy (headline value/fee legible; meta demoted).
7. **Compare table** winner-per-row emphasis.
8. **Mobile ergonomics** — results-before-filters on `/browse`; header at 390px.
9. **Trust cues** — verified-on date + source links surfaced consistently.
10. A small **SVG line-icon component set** (no emoji, ever).

**Out of scope (later, Figma-driven):**
- Final visual language: the "Ink & Warm" palette, refined type scale, card-art
  treatment, shadows/depth, dark mode. Implement functionally now; reskin later.
- Any net-new ranking math. Presentation only — the rank key is sacred.

## Design decisions (from brainstorming)

### D1 — Answer-first, but honest
`/recommend` leads with a **highlights band** — a few labelled picks
(best-overall, best lifetime-free, best-for-your-top-category, premium-pick) — above
the full ranked list. Highlights are **pure labelling of the already-ranked list**:
each is the first entry satisfying a factual predicate. **No re-ranking, ever.**

### D2 — Concrete facts on the card; estimates clearly tagged
The primary card surface asserts **only verifiable T&C facts** (name, network/tier,
fee + waiver, published reward rates *with their caps*, lounge, source link + verified
date). The **personalized net-₹/yr** — which depends on the user's spend assumptions —
appears as a **clearly-tagged estimate** (`Est.`) with a link to a per-card
**breakdown** where the assumptions live. It is never presented as a fact, and never
as an "up to X%" headline. This mirrors the engine's two-layer honesty
(`cc_engine_two_layer`): modelled value is a labelled layer, never blended into fact.

### D3 — Net-₹/yr framing beats "up to %"
Where competitors show reward-*rate* headlines or unsourced star ratings, our value
signal is **net ₹/yr = rewards − annual fee − the caps actually hit**. No invented
ratings. The trust slot competitors fill with "4.8★" we fill with a **source link +
verified date**.

### D4 — Home page routes by intent, never dumps a grid
Top-to-bottom: sticky nav → hero (transparency thesis + a **spend-question starter**:
pick your categories → "Rank my cards") → **intent-routing category tiles** → a dark
**credibility band** (source-linked, net-₹/yr, ₹0 affiliate, verified date) →
**one-line methodology** → **tools** (rank / compare / calculator) → **curated guides**
→ **compact footer**. The full 319-card catalog is always **one click down**. No
lead-gen (no phone/PAN/eligibility capture) — ever.

### D5 — Icons are SVG line-icons; no emoji
A small shared SVG icon component set (consistent stroke, `currentColor`). Emoji are
prohibited in product UI.

### D6 — Copy tone
Factual, source-linked, no editorial superlatives (matches the beta-banner promise).
The ₹/yr number makes the claim, not adjectives.

## Components (units, each independently testable)

| Unit | Responsibility | Interface / notes |
| --- | --- | --- |
| `site/lib/present.ts` — `pickHighlights(scores, payload)` | Pure: label the ranked list into highlights | Consumes `DecoupledScore[]` (already sorted) + `RecommendPayload`; returns `Highlight[]`. No re-ranking. Unit-tested. |
| `BestPickCard` | Render one highlight/#1 pick: facts + `Est.`-tagged net-₹/yr + breakdown link + source | Consumes a `DecoupledScore` + its card; pure presentational |
| `RankedRow` | Compact one-line row for results #2..N in the same language | Presentational |
| `ResultsView` (recommend-client) | Highlights band above the existing ranked list; remove debug panel from prod | Reuses `pickHighlights`; ranked list unchanged in order |
| `CategoryTiles` | Intent-routing tiles → **`/browse` pre-filtered to that category, sorted by the honest value signal** (a curated shortlist, not the whole catalog) | Data-driven from a fixed category taxonomy |
| Home page (`app/page.tsx`) | The D4 IA: hero + starter, tiles, trust band, methodology, tools, guides, footer | No featured-card grid |
| `SpendStarter` | Hero chips → **`/recommend`, seeding the wizard with the picked spend categories** (personalized net-₹/yr ranking) | Distinct from tiles: starter = personalized rank, tiles = category browse |
| `CardTile` | Hierarchy: headline value-% + fee/LTF largest; meta one muted line | Keep `React.memo` (grid renders 100+) |
| `CompareTable` | Winner-per-row emphasis (lower fee wins, higher value-% wins, more lounge wins; ties none) | Compare via existing value-% helpers, never raw `effective_rate` |
| Mobile: `browse-client` + `filter-bar` | `<md`: results first + a sticky "Filters (n)" sheet; preserve URL-state sync | |
| Header (`app/layout.tsx`) | No horizontal overflow at 390px; hamburger/scroll-strip if needed | |
| Trust cues: `quick-facts` + tiles | "Data verified <date>" + source links surfaced | |
| `components/icons/*` | Shared SVG line-icon set | No emoji |

## Constraints & invariants

- **Rank key is sacred.** Presentation may group/label but never re-orders within a
  group by anything other than `net_rewards_inr`; welcome/milestone/lounge stay
  decoupled (never folded into a rank).
- **Consumes existing `DecoupledScore`** from `site/lib/scorer-decoupled.ts` — no
  shape changes for presentation.
- **No fabrication.** Estimates are labelled; assumptions live on the breakdown.
- **No lead-gen / affiliate funnel.** No phone/PAN/eligibility capture; CTAs are
  "See the math / Compare", not "Apply Now / Check Eligibility".
- **Gates before every commit:** `npm --prefix site test -- --run`,
  `npm --prefix site run typecheck`, `npm --prefix site run prebuild`;
  `run build` at least once per phase.
- Don't commit competitor screenshots; own-site screenshots only.

## Testing

- `present.test.ts` — pinned behaviour for `pickHighlights` (best-overall is
  `scores[0]`; best-no-fee is the first LTF; no re-ranking; no duplicate card).
- Existing site suites stay green (86/86 baseline).
- Playwright visual/functional QA at 390 / 768 / 1440: no horizontal body scroll;
  highlights render; flat list intact; mobile filter sheet; compare emphasis.

## Explicitly deferred to the Figma visual pass

Final palette ("Ink & Warm"), type scale, card-art treatment, depth/shadow language,
dark mode, and any bespoke illustration. This spec's components must be structured so
that pass is a **restyle**, not a rebuild.
