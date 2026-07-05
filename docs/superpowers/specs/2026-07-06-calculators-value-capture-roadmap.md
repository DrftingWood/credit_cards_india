# Calculators — "Truly Capture Value" Roadmap (2026-07-06)

Vision: make every calculator on the site capture a card's **full, honest value**.
Decomposed into phases on a shared foundation. Each phase gets its own
brainstorm → spec → plan → build cycle. Phase 1 is spec'd + planned; 2–4 are
scoped stubs here so they aren't lost.

## Phase 1 — Foundation (spec + plan written; building now)
- Spec: `docs/superpowers/specs/2026-07-06-card-acceleration-breakdown-design.md`
- Plan: `docs/superpowers/plans/2026-07-06-card-acceleration-breakdown.md`
- Delivers: `explainCard()` engine (per-accelerator cap story, Realistic ⇄ Absolute,
  reuses `calculator.ts`), a shared `localStorage`-persisted spend profile
  (`useSpendProfile`), the `AccelerationBreakdown` component on the card page AND
  `/calculator`. The reusable spine every later phase plugs into.

## Phase 2 — Full value components
Surface welcome bonus + milestones + lounge as separate honest line items so the
calculator shows first-year total vs steady-state, resolving `/calculator`'s
"ignores welcome bonuses, milestone vouchers" disclaimer.
- **Leverage:** the decoupled scorer already computes `first_year_bonus_inr`,
  `milestone_value_inr`, `lounge_visits` (`scorer-decoupled.ts`) — never blend
  them into the steady-state rank; show as capped, labelled line items (D-18).
- **Work:** extend `CardExplanation` with optional value-component fields; add a
  "one-off & benefit value" section to `AccelerationBreakdown`; keep the honest
  decoupling (welcome ÷ tenure, milestone by % of trigger, lounge by usage input).
- **Depends on:** Phase 1 `CardExplanation`.

## Phase 3 — Usage inputs (channels / brands / ecosystem)
Let the user declare which channels/brands/ecosystems they actually use, so the
Realistic layer is truly personal (not just base-vs-ceiling).
- **Leverage:** `ScoringContext` already carries `channelMix`, `tierMap`,
  `enabledEcosystems`; `channelSatisfied`/`merchantSatisfied`/`ecosystemCredited`
  already consume them. This is largely UI that populates the ctx.
- **Work:** a compact usage-selector (persisted alongside the spend profile via the
  same store pattern) feeding the Realistic ctx across all calculators; show which
  accelerators unlocked/dropped as a result.
- **Depends on:** Phase 1 shared store + Realistic ctx.

## Phase 4 — Redemption realism
Value points at the best real redemption route, not a flat rate.
- **Leverage:** `transfer_partners` in the data + `unit_value_inr_realized` +
  `realized_source`; the transfer-partner analysis already done in the dataset.
- **Work:** model transfer-route value (miles→partner ratios), forex markup on
  international spend, and per-redemption fees; expose a "valued via <route>" note
  in the breakdown and let value basis reflect the chosen route (still honest:
  best *available* route, sourced, never invented).
- **Depends on:** Phase 1 value-basis plumbing.

## Sequencing
Build 1 → 2 → 3 → 4. Each is independently shippable and testable. Re-brainstorm
each before building — the foundation may reveal simplifications.
