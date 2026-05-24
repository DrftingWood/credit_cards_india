# Design — `pointsToPct` primitive extraction

**Date:** 2026-05-24
**Status:** Approved (brainstorming complete, ready for implementation plan)
**Driver:** Graphify revealed three separate implementations of "points × unit-value / per_inr → %", spread across two languages (TypeScript + Node `.mjs`). The PR-2 100x base-rate bug was a direct consequence of these implementations having drifted on what "%" meant. A single canonical primitive eliminates the drift risk forever.

## Problem

Three functions today compute the same arithmetic:

| File | Function | Returns |
|---|---|---|
| `site/lib/calculator.ts` | `pointsToPct(rate, perInr, unitValue)` | percentage (1.0 = 1%) |
| `site/lib/detail-derivations.ts` | `effectivePctOf(accelerator, rewards)` (inline math) | percentage |
| `site/scripts/build.mjs` | `computeHeadlineRatePct(rewards)` | percentage |

Until PR 2 the calculator's version returned a fraction (0.01 = 1%) while build.mjs returned a percentage, and `scoreCard` silently divided by 100 again — producing 100x-under-reported rewards on every base-rate computation. Graphify's `semantically_similar_to` edges between these three nodes are exactly the kind of cross-cutting smell this consolidation kills.

## Goals

- **Single source of truth** for the "points → %" conversion across the entire codebase.
- **Cross-language** sharing: TypeScript (`calculator.ts`, `detail-derivations.ts`) and plain Node ESM (`build.mjs`) all consume the same file, byte-for-byte.
- **No toolchain change** — no new build step, no new dev dep, no compilation.
- **No behavioral change** — output is identical to today for every input; tests pass without updating expected values.

## Non-goals

- Refactoring `effectivePctOf` or `computeHeadlineRatePct` to compose the primitive (the higher-level helpers stay where they live; only the inner arithmetic moves).
- Consolidating other "parallel implementation" patterns graphify caught (grid layout duplication, fuel-waiver formatting). Out of scope; tracked separately.
- Migrating `.mjs` scripts to TypeScript. Out of scope; would be a separate decision.

## Architecture

New file `site/lib/rate-math.mjs` exports one function:

```js
/**
 * Converts a points/miles rate (units per per_inr spend) into a percentage.
 * Returns 0 if per_inr is non-positive — guards against a YAML typo
 * producing Infinity that would sort to rank 1 in calculator output.
 *
 * Returns the percentage value scaled so that scoreCard's
 * `(amount * rate) / 100` produces the correct rupee value.
 * 1 point per ₹100 worth ₹1 → 1 (meaning 1%), NOT 0.01.
 *
 * @param {number} rate
 * @param {number} perInr
 * @param {number} unitValue
 * @returns {number}
 */
export function pointsToPct(rate, perInr, unitValue) {
  if (perInr <= 0) return 0;
  return ((rate * unitValue) / perInr) * 100;
}
```

TypeScript callers import via `import { pointsToPct } from './rate-math.mjs';`. Strict-mode TS infers the types from the JSDoc annotations — no `.d.ts` file or `any` casts needed.

## Components

| Action | File | Notes |
|---|---|---|
| Create | `site/lib/rate-math.mjs` | ~12 lines |
| Create | `site/lib/rate-math.test.ts` | ~6 vitest cases |
| Modify | `site/lib/calculator.ts` | Delete local `pointsToPct` definition; add import. Internal call sites unchanged. |
| Modify | `site/lib/detail-derivations.ts` | `effectivePctOf` swaps inline `((rate * uv) / per_inr) * 100` for `pointsToPct(rate, per_inr, uv)`. |
| Modify | `site/scripts/build.mjs` | `computeHeadlineRatePct` swaps inline math for `pointsToPct(...)`. **Keeps** its existing `!per_inr` early-return guard (the primitive returns `0` for non-positive `per_inr`, but this caller's contract is to return `null` so downstream consumers render "—" instead of "0.00%"). Also keeps the `Number.isFinite` outer wrapper. |

Five files touched. No new directories. No new dependencies.

## Data flow

Identical to today. The function call replaces inline arithmetic but produces the same numbers for every input. No types change. No call signatures change.

### Before vs. after — concrete example

```js
// build.mjs (BEFORE):
function computeHeadlineRatePct(rewards) {
  if (!rewards) return null;
  const b = rewards.base ?? {};
  const { rate, per_inr, unit_value_inr } = b;
  if (rate == null || !per_inr || unit_value_inr == null) return null;
  const pct = (Number(rate) * Number(unit_value_inr) / Number(per_inr)) * 100;
  if (!Number.isFinite(pct)) return null;
  return Math.round(pct * 10000) / 10000;
}

// build.mjs (AFTER):
function computeHeadlineRatePct(rewards) {
  if (!rewards) return null;
  const b = rewards.base ?? {};
  const { rate, per_inr, unit_value_inr } = b;
  // KEEP this guard — primitive returns 0 for per_inr<=0, but this caller's
  // contract is null (so the site renders "—" not "0.00%").
  if (rate == null || !per_inr || unit_value_inr == null) return null;
  const pct = pointsToPct(Number(rate), Number(per_inr), Number(unit_value_inr));
  if (!Number.isFinite(pct)) return null;
  return Math.round(pct * 10000) / 10000;
}
```

## Error handling

One guard inside the primitive: `if (perInr <= 0) return 0`. Identical to the current `calculator.ts:pointsToPct`.

Callers that need different semantics keep their own guards at the call site:

- **`build.mjs:computeHeadlineRatePct`** wants `null` (not `0`) when inputs are missing or `per_inr === 0`, so its `!per_inr` and `Number.isFinite` guards stay. The primitive's `0` return is *defensive against unreachable cases* in this caller, not a behavioral change.
- **`calculator.ts:baseRatePct`** and the program-stack / accelerator paths happily treat `0` as "no rate" — they propagate `0` correctly through `scoreCard`. No additional guard needed.
- **`detail-derivations.ts:effectivePctOf`** returns `0` for the no-rate case (matches its existing fallback). No additional guard needed.

## Testing

### New tests — `site/lib/rate-math.test.ts`

| Case | Input | Expected |
|---|---|---|
| Cashback baseline | `pointsToPct(1, 100, 1)` | `1` (= 1%) |
| HDFC Infinia points | `pointsToPct(5, 150, 0.70)` | `≈ 2.333…` (= 2.33%) |
| `per_inr === 0` | `pointsToPct(1, 0, 0.25)` | `0` |
| `per_inr === -1` | `pointsToPct(1, -1, 0.25)` | `0` |
| `unitValue === 0` | `pointsToPct(1, 100, 0)` | `0` |
| Realistic 0.25% points | `pointsToPct(2, 100, 0.25)` | `0.5` |

### Existing tests guard end-to-end correctness

- `calculator.test.ts` — SBI Cashback at ₹20k/mo dining = ₹2,400/yr; HDFC Infinia at ₹50k/mo dining ≈ ₹14,000/yr. These pass through the primitive transitively; if the consolidation breaks the wiring, these break.
- `validate-schema.test.ts` — exercises `npm run prebuild` end-to-end which invokes the updated `computeHeadlineRatePct`. Any regression in `dist/cards.json` would be caught.

No separate "cross-language equivalence" test is needed because both `.ts` and `.mjs` callers import the same `.mjs` file. That's the win over the alternative approaches.

## Migration / rollout

- Single PR, single commit.
- All five file changes land together (atomic).
- Tests must pass without any expected-value updates. If they don't, a real bug surfaces (a caller was depending on subtly different math) — and we want that.
- No deploy-time risk: the primitive runs the same arithmetic in the same JS engine as before.
- No data migration. `dist/*.json` regenerates identically — verifiable by comparing `dist/cards.json` before and after the merge (every card's `computed.headline_rate_pct` must be identical to the byte).

## Alternatives considered

- **`site/lib/rate-math.ts` + tagged duplicate in build.mjs + parity test** — keeps lib in idiomatic TS but relies on a test as the contract. Rejected: explicit duplication is the smell we're trying to remove.
- **Move build.mjs to TypeScript via tsx** — opens the door to a fully typed build pipeline. Rejected for this PR: bigger toolchain change, scope creep. Could be a separate decision.

## Risks

- **JSDoc type inference quirks in strict TS.** Mitigation: vitest run + `tsc --noEmit` in the PR will surface any inference gap immediately.
- **`.mjs` import from a `.ts` file.** Next.js + TS handle this fine when `moduleResolution: "bundler"` (which `site/tsconfig.json` already uses). No config change required.

## Out-of-scope follow-ups noted for later

The graphify findings highlighted other "parallel implementation" clusters that match SHOULD-FIX items from the original code review. Not in this PR, but worth tracking:

- `FeesChargesGrid` ↔ `RewardsBenefitsGrid` (duplicated grid layout — B6-SF5)
- Fuel-waiver string-builder in 3 files (B6-SF2)
- Lounge formatting in `rewards-benefits-grid.tsx`, `deep-dive.tsx`, `compare-table.tsx`
- Same lounge formatting in `composeMetaDescription` in detail page

Each could follow the same pattern: identify the primitive, extract to a shared helper, eliminate the copies.
