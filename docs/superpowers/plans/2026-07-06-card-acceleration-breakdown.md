# Card Acceleration Breakdown — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an inline, per-card acceleration + cap breakdown to the card detail page — spend input → per-accelerator full cap story — with a Realistic ⇄ Absolute toggle, reusing `calculator.ts`'s existing cap math.

**Architecture:** Surface `calculator.ts`'s already-computed per-accelerator cap accounting (add one field + thread a value-basis flag), then add a pure `explainCard(card, spend, ctx)` that mirrors `scoreCard`'s bucket loop but emits the detailed per-accelerator breakdown. A client component renders it with a spend input and a layer toggle that only changes the `ScoringContext`/basis passed to `explainCard`. The two layers are never blended.

**Tech Stack:** Next.js app router, React, TypeScript, Tailwind, vitest. Existing `site/lib/calculator.ts` (`scoreCard`, `ScoringContext`, `ValueBasis`, private `acceleratedRateForBucket`), `CATEGORY_LABELS`/`CanonicalCategory` from `category-mapping.ts`.

## Global Constraints

- Branch: `card-breakdown-2026-07` (already created off `main`). Never commit to `main`. Never push unless asked.
- **Reuse `calculator.ts` as the single source of truth** — `explainCard` composes the existing private helpers (`acceleratedRateForBucket`, `unitValueFor`, `baseRatePct`, `ecosystemCredited`, exclusion maps); it must NOT re-implement cap/rate/value math. It lives IN `calculator.ts` so it can call those privates.
- **Two layers never blended.** The toggle shows exactly one layer; each is clearly labelled. Realistic ⇒ ctx `{ applyApplicability: true, channelMix: new Set(), enabledEcosystems: new Set(), programs }` + basis `"realized"`. Absolute ⇒ ctx `{ programs }` (channelMix omitted = optimistic channels; applyApplicability omitted = whole bucket; enabledEcosystems omitted = optimistic) + basis `"face"`.
- **No fabrication** — every figure derives from the card's authored data via the engine. The total is an estimate for user-entered spend, labelled as such.
- **No emoji.** TypeScript strict. Factual copy, no superlatives.
- **Visual polish deferred to a later Figma pass** — existing Tailwind tokens only; semantic markup for an easy restyle.
- Gate before every commit: `npm.cmd --prefix site test -- --run` (all green; add `--no-file-parallelism` if vitest workers crash on Windows), `npm.cmd --prefix site run typecheck`, `npm.cmd --prefix site run prebuild`.

## File structure

- `site/lib/calculator.ts` — Task 1 adds `uncapped_accel_inr` to `AcceleratorHit`, `valueBasis?: ValueBasis` to `ScoringContext`; Task 2 adds `explainCard` + `CardExplanation`/`AcceleratorExplain` types.
- `site/lib/calculator.test.ts` — tests for Tasks 1 & 2 (colocated with existing calculator tests).
- `site/lib/use-spend-profile.ts` — Task 3, the shared localStorage-persisted spend store hook (+ `DEFAULT_SPEND`).
- `site/lib/use-spend-profile.test.ts` — Task 3 store test (non-React store core).
- `site/components/detail/acceleration-breakdown.tsx` — Task 4, the client component (+ `AcceleratorRow`), consumes `useSpendProfile`.
- `site/components/detail/acceleration-breakdown.test.tsx` — Task 4 render test.
- `site/app/calculator/calculator-client.tsx` — Task 5 refactors its local spend `useState` to `useSpendProfile`.
- `site/app/card/[issuer]/[slug]/page.tsx` — Task 6 wires the component in.

---

### Task 1: Surface the cap detail + value-basis in the engine

**Files:**
- Modify: `site/lib/calculator.ts`
- Test: `site/lib/calculator.test.ts`

**Interfaces:**
- Produces: `AcceleratorHit.uncapped_accel_inr: number` (the pre-cap gross accel value/mo); `ScoringContext.valueBasis?: ValueBasis` threaded into unit-value lookups so the caller can request face vs realized. Existing `scoreCard` output is unchanged when `valueBasis` is omitted (defaults to `"realized"`).

- [ ] **Step 1: Write the failing test** (append to `calculator.test.ts`)

```ts
import { describe, test, expect } from "vitest";
import { scoreCard, type ScoringContext } from "./calculator";
// Use an existing points card fixture pattern from this file; if the file has a
// helper to load a card by id from the built dataset, reuse it. Otherwise build a
// minimal card inline mirroring the existing tests' fixture shape.

describe("valueBasis threads face vs realized", () => {
  test("face basis yields >= realized basis for a points card whose realized < face", () => {
    // pick any card with base.unit_value_inr > unit_value_inr_realized
    // (e.g. hdfc-infinia: face 1.1, realized 1.0). Load it the same way other
    // tests in this file load cards.
    const spend = { online: 0, groceries: 0, dining: 10000, fuel: 0, travel: 0, utilities: 0, rent: 0, international: 0 };
    const realized = scoreCard(CARD, spend, { valueBasis: "realized" } as ScoringContext);
    const face = scoreCard(CARD, spend, { valueBasis: "face" } as ScoringContext);
    expect(face.annual_gross_inr).toBeGreaterThanOrEqual(realized.annual_gross_inr);
  });
});
```

(Where `CARD` is loaded via whatever mechanism the existing tests in this file already use — read the top of `calculator.test.ts` first and follow it exactly.)

- [ ] **Step 2: Run to verify it fails** — `npm.cmd --prefix site test -- --run lib/calculator.test.ts` → FAIL (face == realized today, because the unit-value lookups hardcode the `"realized"` default and ignore any `valueBasis`).

- [ ] **Step 3: Add `valueBasis` to `ScoringContext`** — in the `ScoringContext` interface (calculator.ts:39), add after `enabledEcosystems`:

```ts
  /** "realized" (default, honest floor) or "face" (optimistic ceiling) unit value
   *  for points/miles. Passed to unitValueFor so the Absolute layer can value at face. */
  valueBasis?: ValueBasis;
```

- [ ] **Step 4: Thread `valueBasis` into the two unit-value lookups.**
  - In `scoreCard` (calculator.ts:~46): change `unitValueFor(rewards, ctx?.programs)` to `unitValueFor(rewards, ctx?.programs, ctx?.valueBasis ?? "realized")`.
  - In `acceleratedRateForBucket` (calculator.ts:322): change `const unitValue = unitValueFor(rewards, ctx?.programs);` to `const unitValue = unitValueFor(rewards, ctx?.programs, ctx?.valueBasis ?? "realized");`
  - If `baseRatePct` also computes a value and takes a basis param (check its signature at the top of the file — it's used at scoreCard:~45), thread `ctx?.valueBasis ?? "realized"` there too so base value matches; if it doesn't take a basis, leave it.

- [ ] **Step 5: Add `uncapped_accel_inr` to `AcceleratorHit`** — in the interface (calculator.ts:291) add:

```ts
  /** Pre-cap gross accelerated earn this bucket (INR/mo), before the cap clamp. */
  uncapped_accel_inr: number;
```
  and in the candidate built inside `acceleratedRateForBucket` (calculator.ts:~391, the `const candidate: Candidate = { … }` object) add the field:
```ts
      uncapped_accel_inr: grossAccel,
```
  (`grossAccel` is already computed at line ~375.)

- [ ] **Step 6: Run tests → PASS** — `npm.cmd --prefix site test -- --run lib/calculator.test.ts` (the new test passes; ALL existing calculator tests stay green — the `?? "realized"` default preserves current behaviour).

- [ ] **Step 7: Gates + commit**

```bash
npm.cmd --prefix site run typecheck
git add site/lib/calculator.ts site/lib/calculator.test.ts
git commit -m "feat(calculator): thread valueBasis + surface uncapped_accel_inr on AcceleratorHit"
```

---

### Task 2: `explainCard()` — the per-layer detailed breakdown

**Files:**
- Modify: `site/lib/calculator.ts` (add `explainCard` + result types, exported)
- Test: `site/lib/calculator.test.ts`

**Interfaces:**
- Consumes: `AcceleratorHit.uncapped_accel_inr` + `ScoringContext.valueBasis` (Task 1); the private `acceleratedRateForBucket`, `baseRatePct`, `unitValueFor`, `ecosystemCredited`, `EXCLUSION_TO_BUCKET`, `MCC_EXCLUSION_TO_BUCKET` (same module).
- Produces:
```ts
export interface AcceleratorExplain {
  category: CanonicalCategory; label: string;
  monthly_spend: number;
  rate_pct: number;
  uncapped_value_inr: number;
  cap_monthly_inr: number | null;
  cap_bound: boolean;
  lost_to_cap_inr: number;      // uncapped − capped (0 if unbound/no cap)
  base_spillover_inr: number;   // base earned on over-cap spend
  net_value_inr: number;        // monthly net for this accelerator's bucket
  factors: string[];            // realistic: cuts applied; absolute: constraints stated
}
export interface BaseSpendExplain { category: CanonicalCategory; label: string; monthly_spend: number; rate_pct: number; value_inr: number; }
export interface CardExplanation {
  layer: "realistic" | "absolute";
  value_basis: ValueBasis;
  accelerators: AcceleratorExplain[];
  base_spend: BaseSpendExplain[];
  annual_gross_inr: number; annual_fee_inr: number; annual_net_inr: number;
}
export function explainCard(card: EnrichedCard, spend: SpendProfile, ctx?: ScoringContext): CardExplanation
```

- [ ] **Step 1: Write the failing test** (append to `calculator.test.ts`)

```ts
import { explainCard } from "./calculator";

describe("explainCard — per-accelerator cap story", () => {
  const spendHeavy = { online: 0, groceries: 0, dining: 0, fuel: 0, travel: 200000, utilities: 0, rent: 0, international: 0 };

  test("a cap-bound accelerator reports the clamp, ₹ lost, and base spillover", () => {
    // Use a card with a capped travel accelerator on a spend high enough to hit
    // the cap (load the card the way other tests do). Absolute layer fires it.
    const ex = explainCard(CAPPED_TRAVEL_CARD, spendHeavy, { valueBasis: "face" });
    const row = ex.accelerators.find((a) => a.category === "travel");
    expect(row).toBeTruthy();
    expect(row!.cap_bound).toBe(true);
    expect(row!.lost_to_cap_inr).toBeGreaterThan(0);
    expect(row!.uncapped_value_inr).toBeGreaterThan(row!.net_value_inr - row!.base_spillover_inr);
    expect(row!.factors.join(" ").toLowerCase()).toContain("cap");
  });

  test("realistic drops a channel-locked accelerator to base; absolute fires it", () => {
    // A card whose top accelerator is channel-locked (e.g. hdfc-infinia SmartBuy).
    const realistic = explainCard(CHANNEL_CARD, spendHeavy, { applyApplicability: true, channelMix: new Set(), enabledEcosystems: new Set(), valueBasis: "realized" });
    const absolute = explainCard(CHANNEL_CARD, spendHeavy, { valueBasis: "face" });
    expect(absolute.annual_gross_inr).toBeGreaterThan(realistic.annual_gross_inr);
    // realistic factor list should mention the channel/base fallback for the affected bucket
    const absRow = absolute.accelerators.find((a) => a.category === "travel");
    expect(absRow!.factors.join(" ").toLowerCase()).toMatch(/channel|smartbuy|portal/);
  });

  test("annual_net nets the fee off the gross", () => {
    const ex = explainCard(CAPPED_TRAVEL_CARD, spendHeavy, { valueBasis: "realized" });
    expect(ex.annual_net_inr).toBe(ex.annual_gross_inr - ex.annual_fee_inr);
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `npm.cmd --prefix site test -- --run lib/calculator.test.ts` → FAIL ("explainCard is not a function").

- [ ] **Step 3: Implement `explainCard`** — add at the end of `calculator.ts`. It mirrors `scoreCard`'s setup + bucket loop (reusing the same private helpers and the shared `capUsage` pool) but collects the per-accelerator detail. Do NOT re-derive any rate/cap/value arithmetic — read it off the `hit`.

```ts
export interface AcceleratorExplain {
  category: CanonicalCategory; label: string;
  monthly_spend: number; rate_pct: number;
  uncapped_value_inr: number; cap_monthly_inr: number | null; cap_bound: boolean;
  lost_to_cap_inr: number; base_spillover_inr: number; net_value_inr: number;
  factors: string[];
}
export interface BaseSpendExplain { category: CanonicalCategory; label: string; monthly_spend: number; rate_pct: number; value_inr: number; }
export interface CardExplanation {
  layer: "realistic" | "absolute"; value_basis: ValueBasis;
  accelerators: AcceleratorExplain[]; base_spend: BaseSpendExplain[];
  annual_gross_inr: number; annual_fee_inr: number; annual_net_inr: number;
}

export function explainCard(card: EnrichedCard, spend: SpendProfile, ctx?: ScoringContext): CardExplanation {
  const rewards = card.current_rewards;
  const basis: ValueBasis = ctx?.valueBasis ?? "realized";
  // Layer is inferred from the context the caller built (see Global Constraints).
  const layer: "realistic" | "absolute" = ctx?.applyApplicability ? "realistic" : "absolute";
  const baseRate = baseRatePct(rewards, ctx?.programs);
  const ecoCredited = ecosystemCredited(rewards, ctx);

  const excluded = new Set<CanonicalCategory>();
  for (const ex of rewards?.exclusions ?? []) { const b = EXCLUSION_TO_BUCKET[ex]; if (b) excluded.add(b); }
  for (const mcc of rewards?.mcc_exclusions ?? []) { const b = MCC_EXCLUSION_TO_BUCKET[mcc]; if (b) excluded.add(b); }

  const capUsage = new Map<AcceleratedReward, number>();
  const accelerators: AcceleratorExplain[] = [];
  const base_spend: BaseSpendExplain[] = [];
  let monthlyGross = 0;

  for (const bucket of Object.keys(spend) as CanonicalCategory[]) {
    const amount = spend[bucket] || 0;
    if (amount <= 0) continue;
    const label = CATEGORY_LABELS[bucket] ?? bucket;

    if (excluded.has(bucket)) {
      base_spend.push({ category: bucket, label, monthly_spend: amount, rate_pct: 0, value_inr: 0 });
      continue;
    }
    const accel = ecoCredited && rewards?.accelerated?.length
      ? acceleratedRateForBucket(rewards.accelerated, bucket, amount, rewards, ctx, baseRate, capUsage)
      : { hit: null, narrowUncounted: false };
    const hit = accel.hit;

    if (hit) {
      capUsage.set(hit.accel, (capUsage.get(hit.accel) ?? 0) + hit.accel_value_inr);
      const lost = Math.max(0, hit.uncapped_accel_inr - hit.accel_value_inr);
      const net = hit.accel_value_inr + hit.base_remainder_inr + hit.over_cap_base_inr;
      monthlyGross += net;
      accelerators.push({
        category: bucket, label, monthly_spend: amount, rate_pct: hit.rate_pct,
        uncapped_value_inr: hit.uncapped_accel_inr, cap_monthly_inr: hit.cap_monthly_inr,
        cap_bound: hit.cap_bound, lost_to_cap_inr: lost, base_spillover_inr: hit.over_cap_base_inr,
        net_value_inr: net, factors: buildFactors(layer, hit, basis, rewards),
      });
    } else {
      const value = (amount * baseRate) / 100;
      monthlyGross += value;
      base_spend.push({ category: bucket, label, monthly_spend: amount, rate_pct: baseRate, value_inr: value });
    }
  }

  const annualGross = monthlyGross * 12;
  const annualFee = card.current_fees?.annual_fee_inr ?? 0;
  return {
    layer, value_basis: basis, accelerators, base_spend,
    annual_gross_inr: annualGross, annual_fee_inr: annualFee, annual_net_inr: annualGross - annualFee,
  };
}

/** The constraint/cut list shown per accelerator row. Realistic: what was cut.
 *  Absolute: what the number assumes/requires. Facts only — from the hit + card. */
function buildFactors(layer: "realistic" | "absolute", hit: AcceleratorHit, basis: ValueBasis, rewards: RewardRecord | null): string[] {
  const f: string[] = [];
  if (hit.cap_bound && hit.cap_monthly_inr != null) {
    f.push(`Cap ${inr0(hit.cap_monthly_inr)}/mo reached — extra spend earns base`);
  } else if (hit.cap_monthly_inr != null) {
    f.push(`Capped at ${inr0(hit.cap_monthly_inr)}/mo`);
  }
  if (hit.basis === "channel-locked") {
    const ch = hit.accel.channel?.merchants?.join(", ") ?? hit.accel.channel?.class ?? "a specific channel";
    f.push(layer === "absolute" ? `Requires booking via ${ch}` : `Credited only when you book via ${ch}`);
  }
  if (hit.applicability < 1) {
    f.push(`${Math.round(hit.applicability * 100)}% of this bucket earns the accelerated rate; the rest earns base`);
  } else if (layer === "absolute" && isNarrowAccelerator(hit.accel)) {
    f.push(`Assumes 100% of this bucket qualifies`);
  }
  if (rewards && rewards.currency !== "cashback") {
    f.push(layer === "absolute" ? `Valued at face` : `Valued at realized redemption value`);
  }
  return f;
}
```

- [ ] **Step 4: Run tests → PASS** — `npm.cmd --prefix site test -- --run lib/calculator.test.ts` (new + existing green). If a fixture assumption is off (e.g. the chosen card doesn't hit its cap on the spend), adjust the FIXTURE/spend in the test, not the implementation.

- [ ] **Step 5: Gates + commit**

```bash
npm.cmd --prefix site run typecheck
git add site/lib/calculator.ts site/lib/calculator.test.ts
git commit -m "feat(calculator): explainCard — per-accelerator cap story with realistic/absolute factors"
```

---

### Task 3: `useSpendProfile()` — shared, persisted spend store

**Files:**
- Create: `site/lib/use-spend-profile.ts`
- Test: `site/lib/use-spend-profile.test.ts`

**Interfaces:**
- Consumes: `SpendProfile` from `@/lib/calculator`; `CanonicalCategory` from `@/lib/category-mapping`.
- Produces: `DEFAULT_SPEND: SpendProfile`; a non-React store core `readSpend()/writeSpend(next)/subscribe(cb)`; and the React hook `useSpendProfile(): [SpendProfile, (updater: (s: SpendProfile) => SpendProfile) => void]`. One module-level store, persisted to `localStorage` (key `cc-spend-profile-v1`), shared live across all consumers via `useSyncExternalStore`. SSR-safe: `readSpend()` returns `DEFAULT_SPEND` when `window`/`localStorage` is unavailable.

- [ ] **Step 1: Write the failing test** (store core — no React needed)

```ts
// site/lib/use-spend-profile.test.ts
import { describe, test, expect, beforeEach } from "vitest";
import { DEFAULT_SPEND, readSpend, writeSpend, subscribe } from "./use-spend-profile";

describe("spend store core", () => {
  beforeEach(() => { writeSpend(() => ({ ...DEFAULT_SPEND })); });

  test("readSpend returns the default before any write", () => {
    expect(readSpend()).toEqual(DEFAULT_SPEND);
  });
  test("writeSpend updates and notifies subscribers", () => {
    let notified = 0;
    const unsub = subscribe(() => { notified++; });
    writeSpend((s) => ({ ...s, dining: 12345 }));
    expect(readSpend().dining).toBe(12345);
    expect(notified).toBeGreaterThan(0);
    unsub();
  });
  test("a later write is visible to a fresh read (shared single store)", () => {
    writeSpend((s) => ({ ...s, travel: 50000 }));
    expect(readSpend().travel).toBe(50000);
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `npm.cmd --prefix site test -- --run lib/use-spend-profile.test.ts` → FAIL (module not found).

- [ ] **Step 3: Implement the store + hook**

```ts
// site/lib/use-spend-profile.ts
import { useSyncExternalStore } from "react";
import type { SpendProfile } from "./calculator";
import type { CanonicalCategory } from "./category-mapping";

export const DEFAULT_SPEND: SpendProfile = {
  online: 15000, groceries: 8000, dining: 8000, fuel: 4000, travel: 10000,
  utilities: 5000, rent: 0, international: 0,
};

const KEY = "cc-spend-profile-v1";
const listeners = new Set<() => void>();
let current: SpendProfile = load();

function load(): SpendProfile {
  if (typeof window === "undefined") return { ...DEFAULT_SPEND };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_SPEND };
    const parsed = JSON.parse(raw) as Partial<SpendProfile>;
    // merge over defaults so a new category key is never undefined
    return { ...DEFAULT_SPEND, ...sanitize(parsed) };
  } catch {
    return { ...DEFAULT_SPEND };
  }
}

function sanitize(p: Partial<SpendProfile>): SpendProfile {
  const out = { ...DEFAULT_SPEND };
  (Object.keys(out) as CanonicalCategory[]).forEach((k) => {
    const v = Number(p[k]);
    out[k] = Number.isFinite(v) && v >= 0 ? v : DEFAULT_SPEND[k];
  });
  return out;
}

export function readSpend(): SpendProfile { return current; }

export function writeSpend(updater: (s: SpendProfile) => SpendProfile): void {
  current = sanitize(updater(current));
  if (typeof window !== "undefined") {
    try { window.localStorage.setItem(KEY, JSON.stringify(current)); } catch { /* storage full/blocked — keep in-memory */ }
  }
  listeners.forEach((l) => l());
}

export function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** React hook: shared, persisted spend profile. `getServerSnapshot` returns the
 *  default so SSR + first paint are stable; the store hydrates from localStorage
 *  on the client (load() ran at module init in the browser). */
export function useSpendProfile(): [SpendProfile, (updater: (s: SpendProfile) => SpendProfile) => void] {
  const spend = useSyncExternalStore(subscribe, readSpend, () => DEFAULT_SPEND);
  return [spend, writeSpend];
}
```

- [ ] **Step 4: Run tests → PASS** — `npm.cmd --prefix site test -- --run lib/use-spend-profile.test.ts`. (vitest env is `node`, so `window` is undefined — the store falls back to in-memory `DEFAULT_SPEND`, which is exactly what the core test exercises; the localStorage path is covered by the browser at runtime and the manual check in Task 6.)
- [ ] **Step 5: Gates + commit**

```bash
npm.cmd --prefix site run typecheck
git add site/lib/use-spend-profile.ts site/lib/use-spend-profile.test.ts
git commit -m "feat(spend): shared localStorage-persisted spend profile store + useSpendProfile hook"
```

---

### Task 4: `AccelerationBreakdown` component (shared spend + toggle)

**Files:**
- Create: `site/components/detail/acceleration-breakdown.tsx`
- Test: `site/components/detail/acceleration-breakdown.test.tsx`

**Interfaces:**
- Consumes: `explainCard`, `CardExplanation`, `AcceleratorExplain`, `ScoringContext`, `ValueBasis`, `SpendProfile` (Task 2 / calculator.ts); `useSpendProfile` (Task 3); `CANONICAL_CATEGORIES`, `CATEGORY_LABELS` from `@/lib/category-mapping`.
- Produces: `AccelerationBreakdown({ card }: { card: EnrichedCard })`, a `"use client"` component. Spend comes from `useSpendProfile()` (shared/persisted); the Realistic/Absolute layer is local `useState`.

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, test, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AcceleratorRow } from "./acceleration-breakdown";
import type { AcceleratorExplain } from "@/lib/calculator";

const capped: AcceleratorExplain = {
  category: "travel", label: "Travel & hotels", monthly_spend: 200000, rate_pct: 33.3,
  uncapped_value_inr: 60000, cap_monthly_inr: 15000, cap_bound: true,
  lost_to_cap_inr: 45000, base_spillover_inr: 3000, net_value_inr: 18000,
  factors: ["Cap ₹15,000/mo reached — extra spend earns base", "Requires booking via smartbuy"],
};

describe("AcceleratorRow renders the cap story", () => {
  const html = renderToStaticMarkup(<AcceleratorRow item={capped} />);
  test("shows the uncapped, the cap, the ₹ lost, and the net", () => {
    expect(html).toContain("60,000");   // uncapped
    expect(html).toContain("15,000");   // cap
    expect(html).toContain("45,000");   // lost to cap
    expect(html).toContain("18,000");   // net
  });
  test("lists the factors and has no emoji", () => {
    expect(html).toContain("Cap ₹15,000/mo reached");
    expect(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(html)).toBe(false);
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `npm.cmd --prefix site test -- --run components/detail/acceleration-breakdown.test.tsx` → FAIL (module not found).

- [ ] **Step 3: Implement `AcceleratorRow` + `AccelerationBreakdown`**

```tsx
"use client";
import { useMemo, useState } from "react";
import type { EnrichedCard } from "@/lib/types";
import { explainCard, type AcceleratorExplain, type ScoringContext } from "@/lib/calculator";
import { useSpendProfile } from "@/lib/use-spend-profile";
import { CANONICAL_CATEGORIES, CATEGORY_LABELS } from "@/lib/category-mapping";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export function AcceleratorRow({ item }: { item: AcceleratorExplain }) {
  return (
    <li className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold text-slate-900">{item.label}</span>
        <span className="text-sm font-semibold text-slate-900 tabular-nums">{inr(item.net_value_inr)}/mo</span>
      </div>
      <p className="mt-1 text-xs text-slate-600 tabular-nums">
        You spend {inr(item.monthly_spend)} · earns {item.rate_pct.toFixed(1)}% ={" "}
        <span className="text-slate-900">{inr(item.uncapped_value_inr)}</span> uncapped
        {item.cap_bound && item.cap_monthly_inr != null ? (
          <>
            {" "}→ cap {inr(item.cap_monthly_inr)} clamps it, <span className="text-amber-700">{inr(item.lost_to_cap_inr)} lost to the cap</span>
            {item.base_spillover_inr > 0 ? <> · {inr(item.base_spillover_inr)} earned at base beyond it</> : null}
          </>
        ) : null}
      </p>
      {item.factors.length > 0 ? (
        <ul className="mt-1.5 flex flex-wrap gap-1.5">
          {item.factors.map((f, i) => (
            <li key={i} className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600">{f}</li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function AccelerationBreakdown({ card }: { card: EnrichedCard }) {
  const [spend, setSpend] = useSpendProfile(); // shared + persisted across all calculators
  const [layer, setLayer] = useState<"realistic" | "absolute">("realistic");

  const ctx: ScoringContext = useMemo(
    () => layer === "realistic"
      ? { applyApplicability: true, channelMix: new Set<string>(), enabledEcosystems: new Set<string>(), valueBasis: "realized" }
      : { valueBasis: "face" },
    [layer],
  );
  const ex = useMemo(() => explainCard(card, spend, ctx), [card, spend, ctx]);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">See the math — accelerations &amp; caps</h2>
        <div className="inline-flex rounded-lg border border-slate-300 p-0.5 text-xs">
          {(["realistic", "absolute"] as const).map((l) => (
            <button key={l} type="button" onClick={() => setLayer(l)}
              className={l === layer ? "rounded-md bg-slate-900 px-3 py-1 font-medium text-white" : "rounded-md px-3 py-1 text-slate-600"}>
              {l === "realistic" ? "Realistic" : "Absolute"}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        {layer === "realistic"
          ? "What you'd realistically keep — caps applied, channel premiums cut when you don't route through them, realized redemption value."
          : "Best case — every accelerator fires at full rate on the whole bucket at face value. Caps still apply; each row states what you must satisfy."}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {CANONICAL_CATEGORIES.map((cat) => (
          <label key={cat} className="text-xs text-slate-600">
            {CATEGORY_LABELS[cat] ?? cat}
            <input type="number" min={0} inputMode="numeric" value={spend[cat]}
              onChange={(e) => setSpend((s) => ({ ...s, [cat]: Math.max(0, Number(e.target.value) || 0) }))}
              className="mt-0.5 w-full rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-900 tabular-nums" />
          </label>
        ))}
      </div>

      {ex.accelerators.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {ex.accelerators.map((a) => <AcceleratorRow key={a.category} item={a} />)}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-slate-500">No accelerated categories apply to the spend you entered — everything earns the base rate.</p>
      )}

      <div className="mt-4 flex items-baseline justify-between border-t border-slate-200 pt-3">
        <div>
          <span className="mr-1 rounded border border-amber-300 bg-amber-50 px-1 text-[10px] font-bold uppercase text-amber-800">Est.</span>
          <span className="text-sm text-slate-600">net rewards for this spend, {layer}</span>
        </div>
        <span className="text-lg font-semibold text-slate-900 tabular-nums">{inr(ex.annual_net_inr)}/yr</span>
      </div>
      <p className="mt-1 text-[11px] text-slate-400 tabular-nums">
        {inr(ex.annual_gross_inr)} rewards − {inr(ex.annual_fee_inr)} annual fee. Estimate for the spend you entered.
      </p>
    </section>
  );
}
```

- [ ] **Step 4: Run tests → PASS.** Then `npm.cmd --prefix site run typecheck`.
- [ ] **Step 5: Commit**

```bash
git add site/components/detail/acceleration-breakdown.tsx site/components/detail/acceleration-breakdown.test.tsx
git commit -m "feat(detail): AccelerationBreakdown — inline cap-story with realistic/absolute toggle"
```

---

### Task 5: `/calculator` shares the spend profile + shows the detailed breakdown

**Files:**
- Modify: `site/app/calculator/calculator-client.tsx`

**Interfaces:**
- Consumes: `useSpendProfile` (Task 3), `AccelerationBreakdown` (Task 4).

- [ ] **Step 1: Read `calculator-client.tsx` fully.** It holds `const [spend, setSpend] = useState<SpendProfile>(DEFAULT_SPEND)` (~line 46) and its own local `DEFAULT_SPEND`, and renders a spend-input column + a ranked list.
- [ ] **Step 2: Use the shared store.** Replace its local spend `useState` + local `DEFAULT_SPEND` with `const [spend, setSpend] = useSpendProfile();` (import from `@/lib/use-spend-profile`). Its existing `setSpend(next)` call sites: if any call `setSpend(value)` with a plain object rather than an updater, wrap them as `setSpend(() => value)` — the shared setter takes an updater `(s) => s`. Confirm via typecheck. Now spend entered here and on any card page is one shared, persisted value.
- [ ] **Step 3: Surface the detailed breakdown for the pinned/selected card.** The page already tracks a `selectedId`/pinned card. Below the ranked list (or beside it), render `<AccelerationBreakdown card={selectedCard} />` for the currently-selected card so the calculator doesn't just show a ranked total but the full per-accelerator cap story (the "truly capture value" detail) for the card the user is inspecting. If the page has no single selected card in some state, guard: render the breakdown only when a card is selected. Do NOT duplicate the spend inputs — `AccelerationBreakdown` reads the same shared `useSpendProfile`, so both stay in sync automatically; if the duplicate input grid looks redundant, that's fine for this functional pass (the Figma pass can merge them).
- [ ] **Step 4: Gates** — `npm.cmd --prefix site test -- --run` (existing calculator page has no unit test to break; all suites green), `npm.cmd --prefix site run typecheck`, `npm.cmd --prefix site run prebuild`.
- [ ] **Step 5: Manual check** — dev server: enter spend on `/calculator`, navigate to a card page — the same spend is pre-filled; the selected card's breakdown shows the cap story and matches the rank total's basis.
- [ ] **Step 6: Commit** — `git commit -am "feat(calculator): share the spend profile + show the detailed per-card cap breakdown"`

---

### Task 6: Wire onto the card detail page

**Files:**
- Modify: `site/app/card/[issuer]/[slug]/page.tsx`

- [ ] **Step 1: Add the import** near the other detail-component imports (after `RewardsBenefitsGrid`):

```tsx
import { AccelerationBreakdown } from "@/components/detail/acceleration-breakdown";
```

- [ ] **Step 2: Render it** immediately after `<RewardsBenefitsGrid card={card} />` (page.tsx:~236):

```tsx
      <RewardsBenefitsGrid card={card} />
      <AccelerationBreakdown card={card} />
```

- [ ] **Step 3: Gates** — `npm.cmd --prefix site test -- --run` (all green), `npm.cmd --prefix site run typecheck`, `npm.cmd --prefix site run prebuild`. (`next build` may hit the known Windows `spawn UNKNOWN` worker error — that's a pre-existing env issue, not a defect; prebuild+typecheck+tests are the gate.)
- [ ] **Step 4: Manual check** — `npm.cmd --prefix site run dev`, open `/card/hdfc/infinia`: the breakdown renders below rewards; editing a spend field updates the rows live; toggling Realistic↔Absolute changes the numbers and the factor lists (SmartBuy shows at base/ceiling accordingly); no horizontal overflow at 390px.
- [ ] **Step 5: Commit** — `git commit -am "feat(detail): show AccelerationBreakdown on the card page"`

## Self-Review Notes

- **Spec coverage:** D1 (surface, don't duplicate) → T1+T2 (explainCard composes privates, reuses cap math); D2 (two layers, never blended) → T2 layer/ctx + T4 toggle; D3 (full cap story) → T2 fields + T4 `AcceleratorRow`; D4 (inline input, pre-filled) → T3 `DEFAULT_SPEND` + T4 input; D5 (honesty, Est. labelling, no emoji) → T4 markup + tests; D6 (placement) → T6; D7 (shared, persisted spend across all calculators) → T3 `useSpendProfile` + T4 (card breakdown) + T5 (/calculator) both consume it.
- **Deferred (Figma):** final palette/type/depth/dark mode — existing Tailwind only; markup semantic.
- **Type consistency:** `AcceleratorExplain`/`CardExplanation` identical in T2 (definition) and T4 (consumption); `ScoringContext.valueBasis` + `AcceleratorHit.uncapped_accel_inr` defined in T1, used in T2; `explainCard` signature matches across T2/T4/T5; `useSpendProfile` signature `[SpendProfile, (updater)=>void]` defined in T3, consumed unchanged in T4 + T5; `DEFAULT_SPEND` lives once in `use-spend-profile.ts` (T3) — T4/T5 must not redeclare it.
- **"All calculators more detailed":** this plan builds the reusable detail engine (`explainCard`) + the `AccelerationBreakdown` unit + the shared spend profile, and surfaces the detail on BOTH the card page (T6) and `/calculator` (T5). Deepening the `/recommend` *ranking* value model (bands → richer capture) is a separate, larger subsystem — a documented follow-up, not part of this plan.
- **Reuse invariant:** `explainCard` mirrors `scoreCard`'s loop structure (orchestration) but calls the SAME private helpers for all rate/cap/value math — no arithmetic re-implemented. If a reviewer flags the loop-structure overlap, that is deliberate: the alternative (refactoring `scoreCard` to share a core) risks changing existing `scoreCard` output, which is out of scope.
