# Card Acceleration Breakdown — Design Spec (2026-07-06)

## Overview & goal

Make each card detail page transparently show **how its accelerated rewards and
acceleration caps actually work**, per card, as an inline "see the math"
breakdown. The user enters their monthly spend and sees, per accelerated
category, the full cap story — and can toggle between a **Realistic** (honest
floor, cuts applied) and an **Absolute** (optimistic ceiling, constraints
stated) layer. This is the target of the redesigned `/recommend` cards' "See the
math" link.

The reward math and cap accounting already exist inside `site/lib/calculator.ts`
(`scoreCard`'s internal per-accelerator cap logic). This feature **surfaces** that
logic — it does not duplicate or re-derive it. Visual polish (final palette,
type, depth) is **out of scope** — deferred to the later Figma pass; build
functional on existing Tailwind.

## Scope

**In scope:**
1. `explainCard(card, spend, ctx)` in `calculator.ts` — a pure function that
   returns the detailed, per-accelerator, cap-aware breakdown for ONE layer,
   reusing the existing internal cap accounting.
2. `AccelerationBreakdown` client component on the card detail page: a per-category
   spend input (pre-filled), a **Realistic ⇄ Absolute toggle**, per-accelerator
   full-cap-story rows, base-rate categories, and a net-₹/yr total.
3. Wiring the component onto `app/card/[issuer]/[slug]/page.tsx`.
4. A shared, `localStorage`-persisted `useSpendProfile()` hook consumed by the
   card `AccelerationBreakdown` AND the existing `/calculator` page, so the spend
   profile is one shared, persisted value across the site (D7).

**Out of scope:**
- Final visual styling / dark mode (Figma pass).
- Any new ranking or valuation math. `explainCard` composes existing
  `calculator.ts` primitives; the two layers use the engine's existing
  realistic/optimistic `ScoringContext` + `ValueBasis` semantics.
- Changing `/recommend` ranking or the `/calculator` page.

## Design decisions

### D1 — Surface, don't duplicate
`scoreCard` already computes, per accelerator: uncapped gross, `cap_monthly_inr`,
whether the cap bound, the over-cap base spillover, and the capped value
(calculator.ts ~lines 293–377). These are internal today (the public
`BucketBreakdown` only exposes category/spend/effective-rate/value/note).
`explainCard` exposes them in a returned structure. The clamp/spillover/rate
arithmetic is **reused**, never re-implemented in the component.

### D2 — Two layers, never blended
A `Realistic | Absolute` toggle selects ONE layer at a time (never a blended
number), honoring the engine's two-layer principle.
- **Realistic (floor)** — the honest number, with cuts APPLIED and shown:
  **channel-premium cut** (a channel-gated accelerator's elevated rate drops to
  base when the channel isn't used — the premium is removed), **applicability
  cut** (elevated rate applies only to the accelerator's real bucket share, via
  `ScoringContext.applyApplicability`), **realized value** (`ValueBasis`
  "realized", e.g. ₹0.30/pt not face), and the **cap clamp + base spillover**.
- **Absolute (ceiling)** — the best case: every accelerator fires at full elevated
  rate on its whole bucket assuming perfect channel routing and face value; but
  it **states every constraint** that makes the number optimistic/conditional —
  the cap that still binds, the channel required, the whole-bucket applicability
  assumption, and the face-vs-realized value gap. Caps STILL bind in Absolute (a
  cap is a real limit, not optimism).

`explainCard` takes the `ctx`/basis for the selected layer; the component builds
the ctx from the toggle. Realistic ⇒ `{ applyApplicability: true, enabledEcosystems, valueBasis: "realized" }`; Absolute ⇒ optimistic ctx (applyApplicability off, all channel accelerators fire) + face basis (exact field wiring finalized in the plan against `calculator.ts`).

### D3 — The per-accelerator row = the full cap story
Per accelerated category, for the selected layer:
`your spend ₹X → rate (10 pts/₹150 = 5%) → uncapped ₹A/mo → cap clamps at ₹B/mo
→ ₹C lost to the cap → the ₹D past the cap earns base → net ₹E/mo (₹F/yr)`.
Plus a **factors list**: in Realistic, the cuts that were applied; in Absolute,
the constraints being stated. Non-accelerated spend is summarized at base rate.

### D4 — Inline input, pre-filled, per card
A compact spend input across the canonical categories, pre-filled with a sensible
default (reuse the `/calculator` `DEFAULT_SPEND`) so the breakdown is never empty;
edits update live. Everything is computed for THIS card only.

### D5 — Honesty & copy
The total is labelled an **estimate for your entered spend** (not a fact). No
invented numbers — every figure comes from the card's authored data through
`calculator.ts`. Channel-locked and applicability-limited accelerators are noted.
No emoji; factual copy, no superlatives.

### D6 — Placement
Rendered on `app/card/[issuer]/[slug]/page.tsx`, in the rewards region (near
`RewardsBenefitsGrid`). It is the "See the math" destination for the recommend
best-pick cards.

### D7 — Shared, persisted spend profile across all calculators
The spend a user enters in ANY exact-₹ calculator persists and is shared with
every other calculator on the site. A single `useSpendProfile()` hook backs a
module-level store that is **persisted to `localStorage`** (SSR-safe: server
render + first paint use the default profile, then hydrate from storage) and
**shared live** across mounted components via `useSyncExternalStore`. Both the
card `AccelerationBreakdown` and the existing `/calculator` page read/write this
one profile — so entering spend on a card page carries over to `/calculator` and
to every other card's breakdown, and survives reloads. The `/recommend` wizard
uses coarse spend *bands* (a different input), so it is out of scope for this
sharing for now (a band↔₹ bridge is a possible later enhancement). The default
profile (`DEFAULT_SPEND`) is the single seed for an empty store.

## Components (units)

| Unit | Responsibility | Interface |
| --- | --- | --- |
| `explainCard(card, spend, ctx)` in `site/lib/calculator.ts` | Pure: return one layer's detailed per-accelerator + base breakdown, reusing internal cap accounting | Returns `CardExplanation` (see below). No new math. |
| `useSpendProfile()` (`site/lib/use-spend-profile.ts`) | Shared, localStorage-persisted spend store via `useSyncExternalStore`; SSR-safe (default until hydrated) | `(): [SpendProfile, (updater) => void]` — one store, shared live + across reloads |
| `AccelerationBreakdown` (`site/components/detail/acceleration-breakdown.tsx`) | Client: reads spend from `useSpendProfile()` + Realistic/Absolute toggle → calls `explainCard` → renders rows + total | `{ card: EnrichedCard }`; layer state local, spend shared |
| `/calculator` page (`site/app/calculator/calculator-client.tsx`) | Refactor its local `useState(DEFAULT_SPEND)` to `useSpendProfile()` so it shares the same profile | existing page, minimal change |
| `AcceleratorRow` (same file or colocated) | Presentational: one accelerator's cap story + factors list | `{ item: AcceleratorExplain, layer }` |
| card page wiring | Render `<AccelerationBreakdown card={card} />` | `app/card/[issuer]/[slug]/page.tsx` |

Return shape (finalized against `calculator.ts` internals in the plan):
```ts
interface AcceleratorExplain {
  category: CanonicalCategory; label: string;
  monthly_spend: number;
  rate_pct: number;              // elevated value-% used for this layer
  uncapped_value_inr: number;    // monthly, before cap
  cap_monthly_inr: number | null;
  cap_bound: boolean;
  lost_to_cap_inr: number;       // uncapped − capped (0 if unbound/no cap)
  base_spillover_inr: number;    // base earned on over-cap spend
  net_value_inr: number;         // monthly net for this accelerator
  factors: string[];             // realistic: cuts applied; absolute: constraints stated
}
interface CardExplanation {
  layer: "realistic" | "absolute";
  value_basis: "realized" | "face";
  accelerators: AcceleratorExplain[];
  base_spend: { category: CanonicalCategory; monthly_spend: number; rate_pct: number; value_inr: number }[];
  annual_gross_inr: number; annual_fee_inr: number; annual_net_inr: number;
}
```

## Constraints & invariants

- **Reuse `calculator.ts` as the single source of truth** — no duplicated
  cap/rate/value math in the component or `explainCard` beyond composing existing
  primitives.
- **Layers never blended** — the toggle shows exactly one; each is clearly labelled.
- **No fabrication** — all figures derive from the card's authored data. The total
  is an estimate for user-entered spend, labelled as such.
- No emoji. TypeScript strict. Factual copy.
- **Visual skin deferred to Figma** — existing Tailwind tokens; semantic markup.
- Gates before every commit: `npm.cmd --prefix site test -- --run`,
  `npm.cmd --prefix site run typecheck`, `npm.cmd --prefix site run prebuild`.

## Testing

- `explainCard` unit tests (in `calculator.test.ts` or a colocated file): a
  cap-bound accelerator returns correct `lost_to_cap_inr` + `base_spillover_inr`
  and `cap_bound: true`; an uncapped/under-cap accelerator returns `cap_bound:
  false`, `lost_to_cap_inr: 0`; Realistic vs Absolute produce the expected
  different `rate_pct`/`net_value_inr` and factor lists for a channel-gated,
  applicability-limited card; the annual total nets the fee.
- `AccelerationBreakdown` render test: a capped accelerator's row shows the clamp
  + factors; the toggle switches layers; the total is labelled an estimate.
- Existing `calculator.test.ts` stays green (surfacing internals must not change
  existing `scoreCard` outputs).

## Deferred to the Figma visual pass
Final layout polish, color, motion, dark mode. Build the breakdown functionally
now; structure it so the visual pass is a restyle, not a rebuild.
