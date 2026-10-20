# Pro-Grade Website Design Workflow

Last refreshed: 2026-07-06

This repo already has the hard product layer: sourced data, ranking logic,
calculator logic, responsive checks, and tests. The missing layer is the
professional design workflow that turns those capabilities into a trusted,
polished financial product.

The goal is not "make it prettier". The goal is to create a repeatable design
system and QA loop so every page feels intentional, credible, and easy to scan.

## Product Positioning

Credit Cards India should feel like:

- A finance-grade decision tool, not an affiliate blog.
- Calm, dense, and trustworthy.
- Transparent about estimates, caps, caveats, and sources.
- Fast to scan for experts, still understandable for normal users.

It should not feel like:

- A coupon or lead-generation website.
- A generic SaaS landing page.
- A database dump with filters.
- A blog post wrapped around tables.

Primary promise:

> Find the card that gives you the highest honest net value, with the math and
> source trail visible.

Primary user question:

> Which card should I get, why, and what assumptions does that answer depend on?

## How Professional Teams Usually Work

Professional website design is not just code. A typical workflow is:

1. Product brief: define audience, promise, user jobs, and trust constraints.
2. Reference research: collect and critique strong examples.
3. Information architecture: map the main user journeys.
4. Wireframes: establish hierarchy before visual polish.
5. Visual design in Figma: type, spacing, color, components, mobile states.
6. Design tokens in code: translate Figma decisions into Tailwind/CSS tokens.
7. Component library: build reusable primitives and product-specific components.
8. Page implementation: assemble pages from the component system.
9. Visual QA: screenshots, accessibility, responsive checks, and regression review.
10. Iteration: use analytics, user feedback, and support questions to refine.

## Current Repo Gap

What exists:

- Functional redesign is merged.
- `/recommend` is answer-first and grouped.
- Home page routes by intent rather than dumping a card grid.
- Mobile overflow checks pass.
- Tests and typecheck are healthy.

What is still missing:

- A visual source of truth in Figma.
- A brand/visual direction that matches a serious finance product.
- Full design tokens beyond the current light blue brand scale.
- Shared UI primitives for repeated surfaces.
- A visual regression workflow that catches polish drift.
- A final pass on card art, tables, filters, and trust/source cues.

## Phase 1: Design Brief

Create `docs/DESIGN_BRIEF.md` before touching UI code.

It should define:

- Audience segments: optimizers, beginners, travel users, cashback users.
- Product promise: honest net value with source-backed facts.
- Voice: factual, direct, non-affiliate, no hype.
- Visual personality: serious, warm, precise, data-rich.
- Anti-goals: no fake ratings, no lead-gen pressure, no decorative noise.
- Key journeys: home to recommendation, browse to card detail, compare to source.

Done when:

- Every design decision can be tested against the brief.
- The brief is short enough to read before a UI task.

## Phase 2: Reference Board

Collect references before designing.

Use:

- Credit-card and personal-finance sites.
- Premium fintech dashboards.
- Pricing/comparison tables.
- Data-heavy product search experiences.
- Trust-heavy editorial/product pages.

For each reference, record:

- What works.
- What feels untrustworthy.
- How hierarchy is handled.
- How mobile is handled.
- What pattern is worth adapting.

Store notes in `docs/DESIGN_BENCHMARK.md`. Do not commit competitor screenshots
unless licensing permits it; notes are enough.

Done when:

- There are at least 15 references.
- Each important screen has at least 3 relevant patterns to learn from.

## Phase 3: Figma Visual Pass

Design the core screens in Figma before coding:

- Home.
- Browse.
- Recommend results.
- Card detail.
- Compare.
- Calculator.

Each screen needs desktop and mobile frames.

Figma must define:

- Type scale.
- Spacing scale.
- Color palette.
- Buttons and links.
- Badges and chips.
- Card/product tiles.
- Result cards.
- Tables.
- Filter panels.
- Trust/source lines.
- Empty, loading, and error states.
- Mobile navigation and dense table behavior.

Done when:

- The main journey can be clicked through in Figma.
- The mobile version is designed, not merely implied.
- Every reusable UI pattern has a named component.

## Phase 4: Tokens In Code

Translate the Figma system into Tailwind and CSS variables.

Add tokens for:

- Backgrounds: page, subtle, raised, inverse.
- Text: primary, secondary, muted, inverse.
- Borders: default, strong, focus.
- Accent: brand, trust, estimate, warning, success.
- Typography: page title, section title, card title, metric, body, caption.
- Radius: small, medium, large.
- Shadow/elevation, if used.

Avoid page-level one-off colors. If a screen needs a new color, it should become
a named token or be removed.

Done when:

- `tailwind.config.ts` describes the visual language.
- Page files no longer invent raw visual decisions ad hoc.

## Phase 5: Component Library

Build shared primitives first, then product components.

Core primitives:

- `Button`
- `IconButton`
- `Badge`
- `Chip`
- `CardSurface`
- `Metric`
- `SectionHeader`
- `TrustLine`
- `Tabs`
- `FilterSheet`
- `DataTable`

Product components:

- `CreditCardTile`
- `RecommendationCard`
- `RankedResultRow`
- `CompareWinnerCell`
- `RewardBreakdownPanel`
- `SourceEvidencePanel`
- `FeeAndWaiverBlock`

Done when:

- Pages compose reusable components instead of repeating Tailwind-heavy markup.
- Components have stable responsive behavior.

## Phase 6: Implement One Vertical Slice

Do not reskin the whole website in one pass.

Start with the most important journey:

1. Home.
2. Recommend wizard entry.
3. Recommend results.
4. Card detail.
5. Compare handoff.

Acceptance criteria:

- The product promise is obvious in 5 seconds.
- The top recommendation is visually dominant.
- The reason line is specific, not fluffy.
- The estimate/fact distinction is visible.
- Source and verified-date cues are visible without hunting.
- Mobile feels designed, not compressed.

## Phase 7: Visual QA Gates

Every visual pass should produce screenshots at:

- 390 x 844
- 768 x 1024
- 1440 x 900

Check:

- No horizontal scroll.
- No text overlap.
- No clipped buttons.
- No unreadable cards.
- Tables remain scannable.
- Filters are reachable.
- Primary action is visible.
- Source/trust cues are present.

Recommended commands:

```powershell
npm.cmd --prefix site test -- --run
npm.cmd --prefix site run typecheck
npm.cmd --prefix site run prebuild
npm.cmd --prefix site run build
```

If local Windows build hits the known `spawn UNKNOWN` worker issue, record it and
verify with the established `experimental.cpus: 1` local workaround or CI.

## Definition Of Pro-Grade

The redesign is pro-grade when:

- The site has a documented visual system.
- Important screens are designed in Figma before implementation.
- Tailwind classes express design tokens, not random page-level styling.
- Reusable components cover the main UI surfaces.
- Every critical viewport is screenshot-reviewed.
- Trust and caveats are part of the UI, not footnotes.
- The site helps users decide, instead of merely showing records.

## First Work Package

Start UI-1 with this sequence:

1. Create `docs/DESIGN_BRIEF.md`.
2. Create `docs/DESIGN_BENCHMARK.md`.
3. Design Home, Recommend Results, Card Detail, Compare, and Calculator in Figma.
4. Convert the chosen visual language into Tailwind tokens.
5. Implement the Home to Recommend Results vertical slice.
6. Run visual QA and update `docs/ui-benchmark/<date>/QA.md`.

This keeps the work professional: design first, system second, code third,
verification always.
