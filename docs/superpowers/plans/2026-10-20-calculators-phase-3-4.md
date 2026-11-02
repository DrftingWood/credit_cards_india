# Calculators — Phase 3 remainder + Phase 4 — Implementation Plan (2026-10-20)

> **For agentic workers:** use superpowers:executing-plans or
> superpowers:subagent-driven-development. Tests first for every task. Not yet
> started: this is a plan only.

**Status going in.** Phase 2 (value components, D-23) and Phase 3 (usage inputs,
D-24) are merged. Phase 2 now carries a per-total `ledger` (`site/lib/value-components.ts`):
labelled whole-rupee lines that sum exactly to each displayed total. Phase 3 left
one gap: loyalty tiers (`ScoringContext.tierMap`) are consumed by the engine but no
UI sets them. Phase 4 (redemption realism, CALC-4) has not started.

## Global constraints

- Branch off `main` (e.g. `calc/phase-4`). Never push or deploy without being asked.
- No invented numbers. Every ₹ figure comes from the dataset (with a source) or from
  an input the user typed. When neither exists, show "not stated" and count ₹0.
- **New money goes on the ledger.** A cost or gain added by these phases is a new
  `LedgerLine` key (`forex`, `redemption_fees`, …), never a silent change to an
  existing line. The live-data reconciliation test in `value-components.test.ts`
  must keep passing and should be extended to the new keys.
- Realistic and Absolute layers stay separate (Phase 1 contract). Absolute keeps the
  face value (`unit_value_inr`); Realistic keeps the floor unless the user picks a route.
- Gate before each commit: `python scripts/validate.py`,
  `npm.cmd --prefix site test -- --run`, `npm.cmd --prefix site run typecheck`,
  and `npm.cmd --prefix site run build` before the branch is called done.

## Part A — Phase 3 remainder: loyalty tier input (small) — DONE on `calc/phase-3-tiers`

> Built 2026-10-20. Differences from the sketch below: the tier bonus is a separate
> `tier` ledger line, not a rate change. D-9 makes it programme earn, so it never
> moves the rank. It reaches the engine through a narrow `ScoringContext.tierPrograms`
> rather than the full `programs` map. No card uses `earn_components.requires_tier`,
> so the stacking path (`stacks_with_program`) is what applies. See D-24.

The engine already applies tier bonuses: `programEarnPct` reads
`ctx.tierMap[program]` and `acceleratorRatePct` gates `earn_components.requires_tier`
(`site/lib/calculator.ts`). Three programs define tiers: Air India Maharaja Club,
IndiGo BluChip and Marriott Bonvoy (`data/loyalty_programs/**`).

1. **Store.** Add `loyalty_tiers: Record<programId, tierId>` to `UsageProfile`
   (`site/lib/usage.ts`). `sanitizeUsage` keeps only program ids and tier ids that
   exist in the loaded programs. Empty by default, so no tier means no tier bonus.
   Tests: sanitising drops unknown ids, and old stored profiles still load.
2. **Context.** `usageContext` returns `tierMap`; `withoutUsage` clears it. Test:
   a co-brand card with a `requires_tier` component gains exactly that component's
   rate when the tier is set, and nothing otherwise.
3. **UI.** In the "Your usage" panel, show one tier `<select>` per program that a
   card in view actually links to. The unlocked/dropped diff already reports ₹/mo
   changes, so check that a tier change appears there.
4. **Docs.** Add a line to D-24 and mark the CALC-3 follow-up done.

**Open data point (needs outside verification):** IndiGo BluChip's and Air India's
tier slabs are marked APPROXIMATE in the YAML, so tier bonuses inherit that confidence.
Label them in the UI with the program file's own confidence note.

## Part B — Phase 4: redemption realism

### B1. Forex markup as a ledger cost (do first: data already present)

`current_fees.forex_markup_pct` is set on about 320 cards, but no calculator charges
it. Only `detail-derivations.ts` mentions it, as pros and cons text.

- Engine: `forexCostInr(card, spend) = spend.international × 12 × markup% × (1 + GST)`.
  The GST rate on the markup (18% under current practice) must be **verified
  externally** before shipping and kept as one named, sourced constant.
- Ledger: add a `forex` line (negative) to all three totals in `explainValueComponents`
  when it is non-zero. Label it "Forex markup on international spend (x% + GST)".
- **Rank decision (record as the next free DECISIONS number, D-26 once
  `remediate/d4-d5-d11-d12`'s D-25 lands, before building):** forex is a recurring cost that
  scales with spend, unlike welcome or milestones, so the recommended default is to
  subtract it in `scoreCard` / `explainCard` `annual_net_inr` too. Today a 3.5%-markup
  card can outrank a 0%-markup card for heavy international spend. That changes
  rankings for users with international spend, so ship it as its own commit with
  before/after rank diffs on the red-team profiles (`site/lib/red-team.test.ts`).
- Tests: a 0%-markup card shows no forex line; a 3.5% card with ₹10k/mo international
  spend shows −₹(10,000 × 12 × 0.035 × 1.18); the reconciliation test covers `forex`.

### B2. Per-redemption fees and minimum redemption

`redemption[].fee_inr` is set on 24 cards and `min_units` on 13. No card has
`transfer_fee_inr` populated.

- Input: "redemptions a year" in `ValuePrefs`, default 1. One redemption is the minimum
  needed to realise any value, so the default is defensible. It is a UI default the
  user changes, not a dataset value; record it in the same decision.
- Ledger: add a `redemption_fees` line (negative) = fee × redemptions/yr for the route
  being valued (see B3; the floor route when none is chosen).
- `min_units`: when annual units earned < `min_units`, show a warning flag ("you may not
  reach the minimum redemption in a year"). Do not change the value (D19: warn, don't fudge).
- Data task (/cc-remediate lane, needs outside verification): source `transfer_fee_inr`
  for the major transfer programs (HDFC, Axis EDGE, Amex MR) before B3 values transfers.

### B3. Valued-via route (largest, needs a data model first)

Partner ₹/unit values exist only as prose tables in `docs/TRANSFER_PARTNERS.md`
(verified 2026-07-05, medium confidence on some partners). The engine cannot read
them, and ratios (302 `transfer_ratio` entries on cards) are useless without them.

1. **Data model.** Add `data/transfer_partners.yaml` (or extend
   `loyalty_program.schema.json`) with one record per partner program:
   `id`, `name`, `unit_value_inr: { realized, realized_source }`, `aliases`.
   Values are copied from `TRANSFER_PARTNERS.md` with its sources and **re-verified
   externally** (award pricing drifts). Validator lint: every card
   `transfer_partners[].partner_name` resolves to a record or an alias, or warns.
2. **Engine.** `redemptionRoutes(card, programs, partners)` returns one route per
   documented option: the floor (`unit_value_inr_realized`), each transfer partner
   (`units_per_point(ratio) × partner ₹/unit`, less the transfer fee), and the face
   value. Each route carries its source. A route with an unknown ratio or partner
   value is listed as "not valued", not dropped.
3. **Choice, not auto-maximisation.** Realistic stays on the floor until the user
   picks a route ("I'd transfer to KrisFlyer"). Absolute shows the best route,
   labelled as the ceiling. Store the choice per loyalty currency in `ValuePrefs`.
   `unitValueFor` gains an optional route override in `ScoringContext`, so caps and
   ranks reuse the existing math.
4. **UI.** Add a "Valued via <route>" note under the breakdown's total and a route
   picker listing every route with its ₹/point. Flag routes below the floor, as
   `TRANSFER_PARTNERS.md` already does.
5. **Tests.** Ratio parsing (`'5:2'`, `'1:1'`, `'100:33'`) and partner resolution.
   A route choice changes only the unit value, so the reward units stay the same.
   Absolute ≥ Realistic for every card on live data. A missing partner value gives
   "not valued", never a guess.

## Sequencing and size

| Step | Size | Depends on | Outside verification |
| --- | --- | --- | --- |
| A (tiers) | S | none | tier slabs marked APPROXIMATE |
| B1 (forex) | S–M | rank decision (D-26) | GST on markup |
| B2 (redemption fees) | S | B1 ledger keys | transfer fees (data) |
| B3 (routes) | L | partner data model | partner ₹/unit values, ratios |

Ship A, B1, B2 and B3 as separate branches or PRs. B3 should be re-brainstormed
once the partner data exists, because the data model may simplify the engine.
