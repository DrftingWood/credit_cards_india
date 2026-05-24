# Rate-Math Primitive Extraction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract one canonical `pointsToPct()` primitive shared by `calculator.ts`, `detail-derivations.ts`, and `build.mjs` so the points-to-percent arithmetic can never silently drift across files or languages again.

**Architecture:** New ESM module `site/lib/rate-math.mjs` with JSDoc types. TypeScript callers (`.ts`) and the Node build script (`.mjs`) both `import` the same file byte-for-byte. No toolchain change, no compilation step. The build script's `computeHeadlineRatePct` keeps its existing `!per_inr` guard so its return contract (`null` vs `0`) is preserved.

**Tech Stack:** TypeScript 5.6 (strict), ESM `.mjs`, vitest 4.

**Spec:** `docs/superpowers/specs/2026-05-24-rate-math-primitive-design.md`

---

## File Structure

| Action | File | Responsibility |
|---|---|---|
| Create | `site/lib/rate-math.mjs` | The primitive `pointsToPct(rate, perInr, unitValue) → number`. ~12 lines. |
| Create | `site/lib/rate-math.test.ts` | Vitest cases for the primitive. ~6 cases. |
| Modify | `site/lib/calculator.ts` | Delete local `pointsToPct`; replace with import. |
| Modify | `site/lib/detail-derivations.ts` | `effectivePctOf` uses imported `pointsToPct` instead of inline math. |
| Modify | `site/scripts/build.mjs` | `computeHeadlineRatePct` uses imported `pointsToPct` instead of inline math. Keeps its `!per_inr` guard (null vs 0 contract). |

Total: 2 new files, 3 modifications, 5 commits + 1 PR-open step. Estimated 30 minutes.

---

## Task 0: Create the feature branch

**Files:**
- None.

- [ ] **Step 1: Verify on main and synced**

Run: `git checkout main && git pull origin main`
Expected: `Already up to date.` or fast-forward output.

- [ ] **Step 2: Create branch**

Run: `git checkout -b fix/rate-math-primitive`
Expected: `Switched to a new branch 'fix/rate-math-primitive'`

---

## Task 1: TDD the primitive

**Files:**
- Create: `site/lib/rate-math.test.ts`
- Create: `site/lib/rate-math.mjs`

- [ ] **Step 1: Write the failing test**

Create `site/lib/rate-math.test.ts`:

```ts
import { describe, test, expect } from "vitest";
import { pointsToPct } from "./rate-math.mjs";

describe("pointsToPct", () => {
  test("cashback baseline: 1 unit per ₹100 at ₹1 = 1%", () => {
    expect(pointsToPct(1, 100, 1)).toBe(1);
  });
  test("points card: 5 pts per ₹150 at ₹0.70 ≈ 2.33%", () => {
    expect(pointsToPct(5, 150, 0.7)).toBeCloseTo(2.3333, 4);
  });
  test("perInr === 0 returns 0 (not Infinity)", () => {
    expect(pointsToPct(1, 0, 0.25)).toBe(0);
  });
  test("perInr negative returns 0", () => {
    expect(pointsToPct(1, -1, 0.25)).toBe(0);
  });
  test("unitValue === 0 returns 0", () => {
    expect(pointsToPct(1, 100, 0)).toBe(0);
  });
  test("realistic points: 2 pts per ₹100 at ₹0.25 = 0.5%", () => {
    expect(pointsToPct(2, 100, 0.25)).toBe(0.5);
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `cd site && npm test -- rate-math`
Expected: FAIL with `Cannot find module './rate-math.mjs'` or `Failed to load url ./rate-math.mjs`.

- [ ] **Step 3: Create the primitive**

Create `site/lib/rate-math.mjs`:

```js
/**
 * Canonical points/miles → percentage primitive.
 *
 * Returns the value scaled so the calculator's `(amount * rate) / 100` formula
 * produces the correct rupee yield. A card earning 1 point per ₹100 worth ₹1
 * each ⇒ pointsToPct(1, 100, 1) === 1 (meaning 1%), NOT 0.01.
 *
 * Returns 0 when perInr is non-positive — guards against a YAML typo
 * (`per_inr: 0`) producing Infinity and sorting that card to rank 1 in the
 * recommender / calculator output.
 *
 * Shared by site/lib/calculator.ts, site/lib/detail-derivations.ts, and
 * site/scripts/build.mjs so the arithmetic can never silently drift across
 * languages again. The PR-2 "100x base-rate" bug was a direct consequence of
 * three copies of this math disagreeing on units.
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

- [ ] **Step 4: Run test, verify it passes**

Run: `cd site && npm test -- rate-math`
Expected: PASS, all 6 tests green.

- [ ] **Step 5: Run full test suite (catch unintended impact)**

Run: `cd site && npm test`
Expected: All tests pass (49 previously, now 55 with new ones).

- [ ] **Step 6: Commit**

```bash
git add site/lib/rate-math.mjs site/lib/rate-math.test.ts
git commit -m "Add canonical rate-math primitive

Single ESM module exporting pointsToPct(rate, perInr, unitValue) for
the points/miles → percentage conversion that until now had three
separate implementations across calculator.ts, detail-derivations.ts,
and build.mjs. Includes 6 vitest cases.

Subsequent commits migrate the three call sites to use this primitive."
```

---

## Task 2: Migrate `calculator.ts` to use the primitive

**Files:**
- Modify: `site/lib/calculator.ts:51-55` (delete local definition), top-of-file imports (add import)

- [ ] **Step 1: Confirm existing tests pass on current main**

Run: `cd site && npm test`
Expected: All tests pass. This is the baseline — anything that breaks AFTER this task indicates a behavioral regression.

- [ ] **Step 2: Add the import**

Open `site/lib/calculator.ts`. Find the import block at the top. After the `import { CanonicalCategory, resolveBuckets } from "./category-mapping";` line, add:

```ts
import { pointsToPct } from "./rate-math.mjs";
```

- [ ] **Step 3: Delete the local definition**

In `site/lib/calculator.ts`, find this block (currently around lines 51–55):

```ts
/** Points/miles rate as % of spend (e.g. returns 1 for 1%). Returns 0 if per_inr is non-positive — guards against a YAML typo producing Infinity that would sort to rank 1. */
function pointsToPct(rate: number, perInr: number, unitValue: number): number {
  if (perInr <= 0) return 0;
  return ((rate * unitValue) / perInr) * 100;
}
```

Delete the entire 5-line block (the docstring AND the function). The 7 internal callers (`baseRatePct`, `programStackPct` ×3, `acceleratorRatePct` ×2, legacy multiplier path) now reference the imported version — no other changes needed because the signature is identical.

- [ ] **Step 4: Run typecheck**

Run: `cd site && npm run typecheck`
Expected: No errors. Strict TS infers the parameter and return types from the JSDoc on `pointsToPct`.

- [ ] **Step 5: Run full test suite**

Run: `cd site && npm test`
Expected: All tests pass, including the real-card cases (`SBI Cashback @ ₹20k/mo dining ≈ ₹2,400/yr`, `HDFC Infinia @ ₹50k/mo dining ≈ ₹14,000/yr`). If either breaks, STOP and investigate — it means the new primitive produces different values than the deleted local one.

- [ ] **Step 6: Commit**

```bash
git add site/lib/calculator.ts
git commit -m "calculator.ts: import pointsToPct from rate-math.mjs

Delete the local pointsToPct definition (added in PR #27, fix/calculator-math).
Import the canonical primitive instead. Identical signature, identical
arithmetic — no behavioural change. The 7 internal callers (baseRatePct,
programStackPct, acceleratorRatePct, legacy multiplier path) need no
other edits."
```

---

## Task 3: Migrate `detail-derivations.ts` to use the primitive

**Files:**
- Modify: `site/lib/detail-derivations.ts` (top-of-file imports + `effectivePctOf` body)

- [ ] **Step 1: Add the import**

Open `site/lib/detail-derivations.ts`. Find the import block. After the existing `import { formatInr, formatPct } from "./utils";` line, add:

```ts
import { pointsToPct } from "./rate-math.mjs";
```

- [ ] **Step 2: Refactor `effectivePctOf`**

Find this function (added in PR #30, fix/calculator-round-2):

```ts
function effectivePctOf(a: AcceleratedReward, rewards: RewardRecord | null): number {
  if (a.effective_rate != null) return a.effective_rate;
  if (a.multiplier != null && rewards?.base && rewards.base.per_inr > 0) {
    const unitValue = rewards.base.unit_value_inr_realized ?? rewards.base.unit_value_inr ?? 1;
    const basePct = ((rewards.base.rate * unitValue) / rewards.base.per_inr) * 100;
    return basePct * a.multiplier;
  }
  return 0;
}
```

Replace with:

```ts
function effectivePctOf(a: AcceleratedReward, rewards: RewardRecord | null): number {
  if (a.effective_rate != null) return a.effective_rate;
  if (a.multiplier != null && rewards?.base) {
    const unitValue = rewards.base.unit_value_inr_realized ?? rewards.base.unit_value_inr ?? 1;
    return pointsToPct(rewards.base.rate, rewards.base.per_inr, unitValue) * a.multiplier;
  }
  return 0;
}
```

**Why `rewards.base.per_inr > 0` is removed:** `pointsToPct` already returns `0` for `perInr <= 0`, and `0 * a.multiplier === 0` — same observable behaviour as the old guard. Defensive duplication removed.

- [ ] **Step 3: Run typecheck**

Run: `cd site && npm run typecheck`
Expected: No errors.

- [ ] **Step 4: Run full test suite**

Run: `cd site && npm test`
Expected: All tests pass, including `pickTopAccelerated — normalises effective_rate (%) vs multiplier (×)` from `calculator.test.ts`. That test asserts a 6% effective_rate beats a 10× multiplier on a 0.25%-base card — exercises `effectivePctOf` end-to-end.

- [ ] **Step 5: Commit**

```bash
git add site/lib/detail-derivations.ts
git commit -m "detail-derivations.ts: effectivePctOf uses pointsToPct

Replaces the inline ((rate * unitValue) / per_inr) * 100 in effectivePctOf
with the canonical primitive from rate-math.mjs. Drops the now-redundant
rewards.base.per_inr > 0 guard since pointsToPct handles it (returns 0,
which when multiplied by the accelerator multiplier stays 0 — same
observable behaviour). pickTopAccelerated and downstream meta description,
JSON-LD, and detail-page prose all see identical output."
```

---

## Task 4: Migrate `build.mjs` to use the primitive

**Files:**
- Modify: `site/scripts/build.mjs` (top-of-file imports + `computeHeadlineRatePct` body)

This task includes a **byte-equality verification step** on `dist/cards.json`. The point of the consolidation is that no card's `computed.headline_rate_pct` should change. If any does, we've introduced a behavioural change and must investigate.

- [ ] **Step 1: Capture baseline `dist/cards.json` headline_rate snapshot**

Run from repo root:

```bash
cd /c/Users/achar/Documents/Github/credit_cards_india
node -e "const c=require('./dist/cards.json'); const out={}; for (const card of c) out[card.id]=card.computed.headline_rate_pct; require('fs').writeFileSync('/tmp/headline-before.json', JSON.stringify(out, null, 2));"
```

Expected: file `/tmp/headline-before.json` exists with 127 entries.

- [ ] **Step 2: Add the import**

Open `site/scripts/build.mjs`. Find the import block (lines ~14–22). After the last `import` line (likely `import yaml from "js-yaml";`), add:

```js
import { pointsToPct } from "../lib/rate-math.mjs";
```

The path is `../lib/...` because `build.mjs` lives in `site/scripts/`. Verify: `site/scripts/build.mjs` → `../lib/rate-math.mjs` → `site/lib/rate-math.mjs`. ✓

- [ ] **Step 3: Refactor `computeHeadlineRatePct`**

Find this function (around line 113):

```js
function computeHeadlineRatePct(rewards) {
  if (!rewards) return null;
  const b = rewards.base ?? {};
  const { rate, per_inr, unit_value_inr } = b;
  if (rate == null || !per_inr || unit_value_inr == null) return null;
  const pct = (Number(rate) * Number(unit_value_inr) / Number(per_inr)) * 100;
  if (!Number.isFinite(pct)) return null;
  return Math.round(pct * 10000) / 10000;
}
```

Replace with:

```js
function computeHeadlineRatePct(rewards) {
  if (!rewards) return null;
  const b = rewards.base ?? {};
  const { rate, per_inr, unit_value_inr } = b;
  // KEEP this guard — pointsToPct returns 0 for per_inr <= 0, but this
  // caller's contract is to return null (so the site renders "—" not "0.00%").
  if (rate == null || !per_inr || unit_value_inr == null) return null;
  const pct = pointsToPct(Number(rate), Number(per_inr), Number(unit_value_inr));
  if (!Number.isFinite(pct)) return null;
  return Math.round(pct * 10000) / 10000;
}
```

The `!per_inr` and `Number.isFinite` guards stay because this caller's null-return semantics are load-bearing for downstream UI (`formatPct(null)` renders "—", `formatPct(0)` renders "0.00%" — different things).

- [ ] **Step 4: Regenerate dist/**

Run: `cd site && npm run prebuild`
Expected: `Schema validation OK: 161 files.` and `Wrote 127 cards, 24 issuers, 5 networks, 5 loyalty programs to dist/`.

- [ ] **Step 5: Compare headline_rate_pct before vs after**

Run from repo root:

```bash
cd /c/Users/achar/Documents/Github/credit_cards_india
node -e "const c=require('./dist/cards.json'); const out={}; for (const card of c) out[card.id]=card.computed.headline_rate_pct; require('fs').writeFileSync('/tmp/headline-after.json', JSON.stringify(out, null, 2));"
diff /tmp/headline-before.json /tmp/headline-after.json
```

Expected: `diff` produces NO output (files identical). If any difference appears, STOP — the refactor changed behaviour. Investigate the offending card before continuing.

- [ ] **Step 6: Run full test suite + typecheck**

Run: `cd site && npm test && npm run typecheck`
Expected: All tests pass, typecheck clean.

- [ ] **Step 7: Commit**

```bash
git add site/scripts/build.mjs
git commit -m "build.mjs: computeHeadlineRatePct uses pointsToPct

Replaces the inline arithmetic with the canonical primitive from
lib/rate-math.mjs. KEEPS the !per_inr early-return because this caller's
contract is null (UI renders '—') vs the primitive's 0 (UI would render
'0.00%'). Also keeps the Number.isFinite wrapper for the same reason.

Verified dist/cards.json's computed.headline_rate_pct is byte-identical
for all 127 cards before and after this commit — no behavioural change."
```

---

## Task 5: Verify, push, open PR

**Files:**
- None (verification + PR open).

- [ ] **Step 1: Final full verification**

Run: `cd site && npm test && npm run typecheck && npm run prebuild`
Expected: 55 tests pass, no type errors, prebuild completes successfully (`Schema validation OK: 161 files.`).

- [ ] **Step 2: Inspect the diff vs main**

Run from repo root:

```bash
cd /c/Users/achar/Documents/Github/credit_cards_india
git diff main --stat
```

Expected output:

```
 site/lib/calculator.ts          | 6 ------
 site/lib/detail-derivations.ts  | 7 +++----
 site/lib/rate-math.mjs          | 26 ++++++++++++++++++++++++++
 site/lib/rate-math.test.ts      | 24 ++++++++++++++++++++++++
 site/scripts/build.mjs          | 5 +++--
 5 files changed, 56 insertions(+), 12 deletions(-)
```

(Line counts approximate — verify file count is 5 and direction matches.)

- [ ] **Step 3: Push branch**

Run: `git push -u origin fix/rate-math-primitive`
Expected: branch created on remote, GitHub URL printed.

- [ ] **Step 4: Open PR**

Run:

```bash
gh pr create --base main --head fix/rate-math-primitive --title "Extract rate-math primitive: one canonical pointsToPct shared TS+Node" --body "$(cat <<'EOF'
## Summary

Graphify (post code-review session) caught three separate implementations of the same points-to-percent arithmetic across two languages (TypeScript + Node \`.mjs\`). The PR-2 100x base-rate bug was a direct consequence of these three having drifted on what \"%\" meant. This PR extracts one canonical primitive shared byte-for-byte by all three call sites.

Spec: \`docs/superpowers/specs/2026-05-24-rate-math-primitive-design.md\`

## Changes

- **New** \`site/lib/rate-math.mjs\` — one function: \`pointsToPct(rate, perInr, unitValue) → number\`. JSDoc-typed so strict TypeScript callers infer correctly without a separate \`.d.ts\`.
- **New** \`site/lib/rate-math.test.ts\` — 6 vitest cases (canonical inputs + the per_inr/unitValue zero/negative guards).
- **Modified** \`site/lib/calculator.ts\` — deleted local \`pointsToPct\`, imports the canonical one.
- **Modified** \`site/lib/detail-derivations.ts\` — \`effectivePctOf\` now composes \`pointsToPct\`.
- **Modified** \`site/scripts/build.mjs\` — \`computeHeadlineRatePct\` composes \`pointsToPct\` but **keeps** its \`!per_inr\` guard so the null-return contract (site renders \"—\" instead of \"0.00%\") is preserved.

## Verification

- 55 vitest tests pass (49 prior + 6 new).
- \`npm run typecheck\` clean.
- \`dist/cards.json\` \`computed.headline_rate_pct\` is byte-identical for all 127 cards before/after (verified via diff).
- No behavioural change for any user.

## Why this matters

The 100x base-rate bug I caught and fixed in PR #27 was discovered because real-card test data forced units to be consistent. With three separate implementations, it was a matter of time before they drifted again. After this PR, the points-to-percent rule is enforced in one place — change it once, every caller benefits, drift is impossible.

🤖 Generated with Claude Code
EOF
)"
```

Expected: PR URL printed (e.g. `https://github.com/DrftingWood/credit_cards_india/pull/36`).

- [ ] **Step 5: Wait for CI, then merge**

Run: `gh pr checks --watch`
Expected: All checks pass (validate, Vercel deploy, Vercel preview comments).

After green:

```bash
gh pr merge --merge
git checkout main && git pull origin main
git branch -D fix/rate-math-primitive
git push origin --delete fix/rate-math-primitive
```

Expected: PR merged, local main synced, branch cleaned up.

---

## Self-review notes

- **Spec coverage:** Every section of the design spec (Architecture, Components, Data flow, Error handling, Testing, Migration) has a corresponding task.
- **No placeholders:** Every step has exact paths, exact code, exact commands.
- **Type consistency:** `pointsToPct(rate: number, perInr: number, unitValue: number): number` is the signature used identically across Tasks 1-4. Camel-case `perInr`/`unitValue` in the primitive; snake_case `per_inr`/`unit_value_inr` is unmarshalled at the build.mjs and detail-derivations.ts call sites where the source data uses snake_case keys.
- **Branch hygiene:** Task 0 creates a clean branch off main. Task 5 cleans up after merge.
