# Site Functional Components Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the answer-first, honest information architecture and presentation-logic components for the site — grouped `/recommend` results, a concrete-facts best-pick card, a rethought home page that routes by intent, plus tile/compare/mobile/trust fixes — on the existing Tailwind system, leaving the premium visual skin for a later Figma pass.

**Architecture:** Pure presentation modules over the existing `DecoupledScore` (no ranking-math changes). A pure `pickHighlights()` labels the already-ranked list into highlight groups; presentational components render facts vs a clearly-tagged estimate; the home page becomes intent-routing sections; browse/compare/mobile get hierarchy and ergonomics fixes. Every new component is structured so a future visual pass restyles it by swapping classes, not rewriting structure.

**Tech Stack:** Next.js (app router) + React + TypeScript, Tailwind, vitest, Playwright (webapp-testing skill). Existing `DecoupledScore` from `site/lib/scorer-decoupled.ts`, `RecommendPayload` from `site/lib/recommender.ts`, `CATEGORY_LABELS`/`CanonicalCategory` from `site/lib/category-mapping.ts`.

## Global Constraints

- Branch: `site-functional-2026-07` (already created off `main`). Never commit to `main`. Never push unless asked.
- **The rank key is sacred:** presentation may GROUP and LABEL but never re-orders within a group by anything other than `net_rewards_inr`, and never folds welcome/milestone/lounge into a rank.
- **Concrete facts on primary surfaces; personalized ₹/yr is a labelled `Est.` linking to a breakdown** — never asserted as fact, never an "up to X%" headline, never an invented rating.
- **No emoji in product UI** — icons are SVG components only.
- **No lead-gen / affiliate funnel** — no phone/PAN/eligibility capture; CTAs are "See the math / Compare", not "Apply Now / Check Eligibility".
- Copy tone: factual, source-linked, no editorial superlatives.
- **Visual skin (Ink & Warm palette, final type/depth/dark mode) is OUT of scope** — use existing Tailwind tokens; keep markup semantic for a later restyle.
- Gate before every commit: `npm.cmd --prefix site test -- --run` (86+ pass), `npm.cmd --prefix site run typecheck`, `npm.cmd --prefix site run prebuild`; `npm.cmd --prefix site run build` at least once per phase. On Windows use `--no-file-parallelism` on the test command if vitest workers crash.
- Don't commit competitor screenshots; own-site screenshots → `docs/ui-benchmark/2026-07/`.

---

### Task 1: `pickHighlights()` presentation module

**Files:**
- Create: `site/lib/present.ts`
- Test: `site/lib/present.test.ts`

**Interfaces:**
- Consumes: `DecoupledScore[]` (already sorted by `net_rewards_inr` desc — `scoreDecoupled` guarantees this) and `RecommendPayload`.
- Produces: `pickHighlights(scores: DecoupledScore[], payload: RecommendPayload): Highlight[]` where `Highlight = { key: "best-overall" | "best-no-fee" | "best-for-top-category" | "premium-pick"; label: string; score: DecoupledScore }`. Pure — each highlight is the FIRST already-ranked score satisfying a predicate. No re-ranking; no duplicate card.

- [ ] **Step 1: Write the failing test**

```ts
// site/lib/present.test.ts
import { describe, test, expect } from "vitest";
import { pickHighlights } from "./present";
import type { DecoupledScore } from "./scorer-decoupled";

const mk = (id: string, net: number, fee: number, reason = ""): DecoupledScore =>
  ({ card: { id, issuer: "x", computed: { is_lifetime_free: fee === 0 } },
     net_rewards_inr: net, annual_rewards_inr: net + fee, annual_fee_inr: fee,
     first_year_bonus_inr: 0, milestone_value_inr: 0,
     lounge_visits: { domestic: 0, international: 0 }, reason, flags: [] }) as unknown as DecoupledScore;

describe("pickHighlights — labels the ranked list, never re-ranks", () => {
  const scores = [mk("a", 9000, 5000, "Best on your dining spend"), mk("b", 8000, 0), mk("c", 7000, 0)];
  const payload = { monthly_spend: { dining: "gt-30k", online: "0", travel: "0", groceries: "0", fuel: "0" } } as never;

  test("best-overall is scores[0]; best-no-fee is the first lifetime-free card", () => {
    const h = pickHighlights(scores, payload);
    expect(h.find((x) => x.key === "best-overall")!.score.card.id).toBe("a");
    expect(h.find((x) => x.key === "best-no-fee")!.score.card.id).toBe("b");
  });

  test("no highlight points at a card not present in the ranked list", () => {
    const h = pickHighlights(scores, payload);
    for (const x of h) expect(scores.indexOf(x.score)).toBeGreaterThanOrEqual(0);
  });

  test("no duplicate card across highlights", () => {
    const h = pickHighlights(scores, payload);
    const ids = h.map((x) => x.score.card.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("empty scores → empty highlights", () => {
    expect(pickHighlights([], payload)).toEqual([]);
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `npm.cmd --prefix site test -- --run lib/present.test.ts`
Expected: FAIL, "Cannot find module './present'".

- [ ] **Step 3: Implement the module**

```ts
// site/lib/present.ts
/**
 * Presentation-layer grouping for /recommend results.
 * PURE LABELLING: each highlight is the first entry of the already-ranked list
 * that satisfies a factual predicate. No re-ranking, no invented value.
 */
import type { DecoupledScore } from "./scorer-decoupled";
import type { RecommendPayload } from "./recommender";
import { CATEGORY_LABELS, type CanonicalCategory } from "./category-mapping";

export interface Highlight {
  key: "best-overall" | "best-no-fee" | "best-for-top-category" | "premium-pick";
  label: string;
  score: DecoupledScore;
}

export function pickHighlights(scores: DecoupledScore[], payload: RecommendPayload): Highlight[] {
  if (scores.length === 0) return [];
  const used = new Set<string>();
  const out: Highlight[] = [];
  const take = (key: Highlight["key"], label: string, s: DecoupledScore | undefined) => {
    if (!s || used.has(s.card.id) || s.net_rewards_inr <= 0) return;
    used.add(s.card.id);
    out.push({ key, label, score: s });
  };

  take("best-overall", "Best overall for your spend", scores[0]);
  take("best-no-fee", "Best lifetime-free pick",
    scores.find((s) => s.card.computed.is_lifetime_free));

  const spend = (payload.monthly_spend ?? {}) as Record<string, string>;
  const top = (Object.entries(spend) as [CanonicalCategory, string][])
    .filter(([, band]) => band && band !== "0")
    .sort((a, b) => b[1].localeCompare(a[1]))[0]?.[0];
  if (top) {
    take("best-for-top-category", `Best for ${CATEGORY_LABELS[top] ?? top}`,
      scores.find((s) => s.reason.toLowerCase().includes(String(top))));
  }
  take("premium-pick", "Premium pick (fee justified by rewards)",
    scores.find((s) => s.annual_fee_inr > 0 && s.net_rewards_inr > 0));
  return out;
}
```

- [ ] **Step 4: Run tests → PASS** — `npm.cmd --prefix site test -- --run lib/present.test.ts`
- [ ] **Step 5: Commit**

```bash
git add site/lib/present.ts site/lib/present.test.ts
git commit -m "feat(present): pickHighlights labelling for recommend results — no re-ranking"
```

---

### Task 2: SVG line-icon component set

**Files:**
- Create: `site/components/icons/index.tsx`
- Test: `site/components/icons/icons.test.tsx`

**Interfaces:**
- Produces: named React components `IconArrowRight`, `IconSearch`, `IconLink`, and category icons `IconCashback`, `IconTravel`, `IconDining`, `IconFuel`, `IconShopping`, `IconFree`, `IconPremium`, `IconForex`, each `(props: { className?: string }) => JSX.Element`, rendering an inline `<svg>` with `stroke="currentColor"`, `fill="none"`. No emoji anywhere.

- [ ] **Step 1: Write the failing test**

```tsx
// site/components/icons/icons.test.tsx
import { describe, test, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { IconArrowRight, IconTravel } from "./index";

describe("icons — inline svg, currentColor, no emoji", () => {
  test("renders an svg using currentColor", () => {
    const html = renderToStaticMarkup(<IconArrowRight className="x" />);
    expect(html).toContain("<svg");
    expect(html).toContain('stroke="currentColor"');
    expect(html).toContain('class="x"');
  });
  test("no emoji codepoints in output", () => {
    const html = renderToStaticMarkup(<IconTravel />);
    expect(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(html)).toBe(false);
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `npm.cmd --prefix site test -- --run components/icons/icons.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement**

```tsx
// site/components/icons/index.tsx
import type { SVGProps } from "react";

function Svg({ children, className }: { children: React.ReactNode; className?: string }) {
  const p: SVGProps<SVGSVGElement> = {
    viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
    strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round",
    className, "aria-hidden": true, width: "1em", height: "1em",
  };
  return <svg {...p}>{children}</svg>;
}

export const IconArrowRight = ({ className }: { className?: string }) =>
  <Svg className={className}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
export const IconSearch = ({ className }: { className?: string }) =>
  <Svg className={className}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></Svg>;
export const IconLink = ({ className }: { className?: string }) =>
  <Svg className={className}><path d="M10 14a4 4 0 006 0l3-3a4 4 0 00-6-6l-1 1M14 10a4 4 0 00-6 0l-3 3a4 4 0 006 6l1-1" /></Svg>;
export const IconCashback = ({ className }: { className?: string }) =>
  <Svg className={className}><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18" /></Svg>;
export const IconTravel = ({ className }: { className?: string }) =>
  <Svg className={className}><path d="M2 16l8-2 4-9 2 1-2 8 6-1 1 2-9 3-4 5-2-1 2-5-6 1z" /></Svg>;
export const IconDining = ({ className }: { className?: string }) =>
  <Svg className={className}><path d="M6 3v8a3 3 0 006 0V3M8 3v6M18 3c-2 1-3 3-3 6v3M15 12h3v9" /></Svg>;
export const IconFuel = ({ className }: { className?: string }) =>
  <Svg className={className}><rect x="4" y="4" width="10" height="16" rx="1" /><path d="M14 9h3a2 2 0 012 2v5a2 2 0 002 2M14 12h3" /></Svg>;
export const IconShopping = ({ className }: { className?: string }) =>
  <Svg className={className}><path d="M6 6h15l-1.5 9h-12z" /><path d="M6 6L5 3H3" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></Svg>;
export const IconFree = ({ className }: { className?: string }) =>
  <Svg className={className}><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M7 12h6" /></Svg>;
export const IconPremium = ({ className }: { className?: string }) =>
  <Svg className={className}><path d="M3 8l4 3 5-6 5 6 4-3-2 11H5z" /></Svg>;
export const IconForex = ({ className }: { className?: string }) =>
  <Svg className={className}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></Svg>;
```

- [ ] **Step 4: Run tests → PASS.**
- [ ] **Step 5: Commit** — `git add site/components/icons && git commit -m "feat(icons): shared SVG line-icon set (no emoji)"`

---

### Task 3: `BestPickCard` + `RankedRow` components

**Files:**
- Create: `site/components/recommend/best-pick-card.tsx`
- Create: `site/components/recommend/ranked-row.tsx`
- Test: `site/components/recommend/best-pick-card.test.tsx`

**Interfaces:**
- Consumes: `Highlight` (Task 1) and `DecoupledScore` (`.card` is an `EnrichedCard`; `.net_rewards_inr`, `.annual_rewards_inr`, `.annual_fee_inr`, `.reason`).
- Produces: `BestPickCard({ highlight }: { highlight: Highlight })` and `RankedRow({ rank, score }: { rank: number; score: DecoupledScore })`. Both presentational. The card asserts only facts; the net-₹/yr is rendered with a literal `Est.` tag and a "See the math" link to the card detail page.

- [ ] **Step 1: Write the failing test**

```tsx
// site/components/recommend/best-pick-card.test.tsx
import { describe, test, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { BestPickCard } from "./best-pick-card";
import type { Highlight } from "@/lib/present";

const card = {
  id: "hdfc-infinia", issuer: "hdfc", name: "HDFC Infinia",
  network_detail: { name: "Visa Infinite" }, tier: "super-premium",
  current_fees: { annual_fee_inr: 12500 },
  current_rewards: { currency: "points" },
  computed: { is_lifetime_free: false, headline_rate_pct: 3.3, fee_waiver_spend_inr: 1000000, has_domestic_lounge: true, has_international_lounge: true },
  metadata: { last_verified_on: "2026-07-06" },
} as never;
const highlight: Highlight = {
  key: "best-overall", label: "Best overall for your spend",
  score: { card, net_rewards_inr: 51600, annual_rewards_inr: 64100, annual_fee_inr: 12500,
           first_year_bonus_inr: 0, milestone_value_inr: 0,
           lounge_visits: { domestic: "unlimited", international: "unlimited" },
           reason: "Best on your dining + travel", flags: [] } as never,
};

describe("BestPickCard — facts + tagged estimate", () => {
  const html = renderToStaticMarkup(<BestPickCard highlight={highlight} />);
  test("shows the highlight label and card name", () => {
    expect(html).toContain("Best overall for your spend");
    expect(html).toContain("HDFC Infinia");
  });
  test("net ₹/yr is present and tagged as an estimate", () => {
    expect(html).toContain("51,600");
    expect(html.toLowerCase()).toContain("est");
  });
  test("links to the card detail page for the breakdown", () => {
    expect(html).toContain("/card/hdfc/infinia");
  });
  test("shows the verified date (trust), not a star rating", () => {
    expect(html).toContain("2026-07-06");
    expect(html).not.toContain("★");
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `npm.cmd --prefix site test -- --run components/recommend/best-pick-card.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement `RankedRow`**

```tsx
// site/components/recommend/ranked-row.tsx
import Link from "next/link";
import type { DecoupledScore } from "@/lib/scorer-decoupled";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
export function cardDetailHref(score: DecoupledScore): string {
  const slug = score.card.id.replace(`${score.card.issuer}-`, "");
  return `/card/${score.card.issuer}/${slug}`;
}

export function RankedRow({ rank, score }: { rank: number; score: DecoupledScore }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
      <div className="min-w-0">
        <span className="text-xs font-semibold text-slate-400">#{rank}</span>{" "}
        <Link href={cardDetailHref(score)} className="text-sm font-semibold text-slate-900 hover:underline">
          {score.card.name}
        </Link>
        <p className="truncate text-xs text-slate-500">{score.reason}</p>
      </div>
      <div className="text-right shrink-0">
        <div className="text-sm font-semibold text-slate-900 tabular-nums">{inr(score.net_rewards_inr)}</div>
        <div className="text-[10px] uppercase tracking-wide text-slate-400">est. net /yr</div>
      </div>
    </li>
  );
}
```

- [ ] **Step 4: Implement `BestPickCard`**

```tsx
// site/components/recommend/best-pick-card.tsx
import Link from "next/link";
import type { Highlight } from "@/lib/present";
import { IconArrowRight, IconLink } from "@/components/icons";
import { cardDetailHref } from "./ranked-row";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export function BestPickCard({ highlight }: { highlight: Highlight }) {
  const s = highlight.score;
  const c = s.card;
  const href = cardDetailHref(s);
  const waiver = c.computed.fee_waiver_spend_inr;
  const verified = c.metadata?.last_verified_on;
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-brand-700">{highlight.label}</div>
      <h3 className="mt-1 text-lg font-semibold text-slate-900">
        <Link href={href} className="hover:underline">{c.name}</Link>
      </h3>
      <p className="text-xs text-slate-500 capitalize">
        {c.tier.replace("-", " ")} · {c.network_detail?.name ?? c.network}
      </p>

      {/* FACTS (from T&C) */}
      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-md bg-slate-50 px-2 py-1.5">
          <dt className="text-slate-500">Annual fee</dt>
          <dd className="font-semibold text-slate-900 tabular-nums">
            {c.current_fees?.annual_fee_inr ? inr(c.current_fees.annual_fee_inr) : "Lifetime free"}
            {waiver ? <span className="ml-1 font-normal text-slate-500">· waived above {inr(waiver)}</span> : null}
          </dd>
        </div>
        <div className="rounded-md bg-slate-50 px-2 py-1.5">
          <dt className="text-slate-500">Headline reward</dt>
          <dd className="font-semibold text-slate-900 tabular-nums">
            {c.computed.headline_rate_pct != null ? `${c.computed.headline_rate_pct}%` : "—"}
            <span className="ml-1 font-normal text-slate-500">base</span>
          </dd>
        </div>
      </dl>

      {/* ESTIMATE (personalized, clearly tagged, links to the breakdown) */}
      <div className="mt-3 flex items-center justify-between rounded-md border border-amber-200 bg-amber-50 px-3 py-2">
        <div>
          <span className="mr-1 rounded border border-amber-300 bg-amber-100 px-1 text-[9px] font-bold uppercase tracking-wide text-amber-800">Est.</span>
          <span className="text-lg font-semibold text-slate-900 tabular-nums">{inr(s.net_rewards_inr)}</span>
          <span className="ml-1 text-xs text-slate-500">/yr net for your spend</span>
        </div>
        <Link href={href} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline">
          See the math <IconArrowRight className="text-[13px]" />
        </Link>
      </div>

      {verified ? (
        <p className="mt-3 flex items-center gap-1 text-[11px] text-slate-500">
          <IconLink className="text-[12px] text-brand-600" /> Facts from issuer T&amp;C · verified {verified}
        </p>
      ) : null}
    </article>
  );
}
```

- [ ] **Step 5: Run tests → PASS** — `npm.cmd --prefix site test -- --run components/recommend/best-pick-card.test.tsx`
- [ ] **Step 6: Commit**

```bash
git add site/components/recommend
git commit -m "feat(recommend): BestPickCard (facts + tagged estimate) + RankedRow"
```

---

### Task 4: Grouped answer-first `ResultsView`

**Files:**
- Modify: `site/app/recommend/recommend-client.tsx` (`ResultsView`, ~line 656)

**Interfaces:**
- Consumes: `pickHighlights` (Task 1), `BestPickCard`/`RankedRow` (Task 3).

- [ ] **Step 1: Add imports** at the top of `recommend-client.tsx` (below the existing imports):

```tsx
import { pickHighlights } from "../../lib/present";
import { BestPickCard } from "../../components/recommend/best-pick-card";
import { RankedRow } from "../../components/recommend/ranked-row";
```

- [ ] **Step 2: In `ResultsView`, compute highlights** right after the `results` `useMemo`:

```tsx
  const highlights = useMemo(() => pickHighlights(results, payload), [results, payload]);
```

- [ ] **Step 3: Render the highlights band** immediately above the existing `results.length === 0 ? … : <ol>…</ol>` block:

```tsx
      {highlights.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {highlights.map((h) => (
            <BestPickCard key={`${h.key}-${h.score.card.id}`} highlight={h} />
          ))}
        </div>
      ) : null}
```

- [ ] **Step 4: Replace the ranked `<ol>` body** — swap the `ResultCard` usage for `RankedRow` under a heading, so the full ranked list stays but reads as the secondary "all results":

```tsx
        <div>
          <h3 className="mb-2 mt-2 text-sm font-semibold text-slate-700">All ranked results</h3>
          <ol className="space-y-2">
            {results.map((r, i) => (
              <RankedRow key={r.card.id} rank={i + 1} score={r} />
            ))}
          </ol>
        </div>
```

(Delete the now-unused `ResultCard` function if nothing else references it; run typecheck to confirm.)

- [ ] **Step 5: Gates** — `npm.cmd --prefix site test -- --run`; `npm.cmd --prefix site run typecheck`; `npm.cmd --prefix site run prebuild`.
- [ ] **Step 6: Manual check** — `npm.cmd --prefix site run dev`, walk the wizard with a dining-heavy profile: highlights band renders above "All ranked results", no duplicate card in the band, ranked list intact, no debug panel in a production build (`run build`).
- [ ] **Step 7: Commit** — `git commit -am "feat(recommend): answer-first grouped results (highlights band + ranked rows)"`

---

### Task 5: Home page — intent-routing IA

**Files:**
- Create: `site/components/home/spend-starter.tsx`
- Create: `site/components/home/category-tiles.tsx`
- Modify: `site/app/page.tsx` (replace the featured-grid body)

**Interfaces:**
- `SpendStarter` routes to `/recommend` (the wizard starts; category preselection is a nice-to-have, not required for this task — link to `/recommend`).
- `CategoryTiles` routes each tile to `/browse?tag=<slug>` (browse-client already reads URL params via `paramsToState`).

- [ ] **Step 1: Implement `CategoryTiles`**

```tsx
// site/components/home/category-tiles.tsx
import Link from "next/link";
import { IconCashback, IconTravel, IconDining, IconFuel, IconShopping, IconFree, IconPremium, IconForex } from "@/components/icons";

const TILES = [
  { href: "/browse?tag=cashback", Icon: IconCashback, t: "Cashback", d: "Flat, uncapped returns" },
  { href: "/browse?tag=travel", Icon: IconTravel, t: "Travel & miles", d: "Lounges, transfers, forex" },
  { href: "/browse?tag=dining", Icon: IconDining, t: "Dining", d: "Weekends & delivery" },
  { href: "/browse?tag=fuel", Icon: IconFuel, t: "Fuel", d: "Surcharge waivers" },
  { href: "/browse?tag=online", Icon: IconShopping, t: "Online shopping", d: "Amazon, Flipkart, co-brands" },
  { href: "/browse?lifetimeFree=1", Icon: IconFree, t: "Lifetime free", d: "No annual fee, ever" },
  { href: "/browse?tag=premium", Icon: IconPremium, t: "Premium", d: "Super-premium & invite-only" },
  { href: "/browse?tag=forex", Icon: IconForex, t: "Low forex", d: "For spends abroad" },
];

export function CategoryTiles() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {TILES.map(({ href, Icon, t, d }) => (
        <Link key={href} href={href as never}
          className="group rounded-xl border border-slate-200 bg-white p-4 no-underline transition-colors hover:border-brand-500/50">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700 text-lg"><Icon /></span>
          <div className="mt-2.5 text-sm font-semibold text-slate-900">{t}</div>
          <div className="text-xs text-slate-500">{d}</div>
        </Link>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Implement `SpendStarter`**

```tsx
// site/components/home/spend-starter.tsx
import Link from "next/link";
import { IconArrowRight } from "@/components/icons";

const CATS = ["Dining", "Travel", "Online", "Fuel", "Groceries"];

export function SpendStarter() {
  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm max-w-2xl">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Where does most of your money go?</div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {CATS.map((c) => (
          <span key={c} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700">{c}</span>
        ))}
        <Link href="/recommend"
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white no-underline hover:bg-brand-700 hover:text-white">
          Rank my cards <IconArrowRight />
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Rework `app/page.tsx`** — replace the whole component body (keep the `getIndex` import) with the intent-routing IA. Full replacement:

```tsx
import Link from "next/link";
import { getIndex } from "@/lib/data";
import { CategoryTiles } from "@/components/home/category-tiles";
import { SpendStarter } from "@/components/home/spend-starter";

export default function HomePage() {
  const index = getIndex();
  const n = index.counts.cards_total;
  return (
    <div className="space-y-12">
      {/* hero */}
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-brand-50 p-8 md:p-10">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-brand-700">
          {n} cards · sourced from issuer T&amp;C · no affiliate links
        </div>
        <h1 className="mt-3 max-w-2xl text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
          Every card, ranked by what it actually pays you.
        </h1>
        <p className="mt-3 max-w-2xl text-slate-700">
          Tell us where your money goes. We rank India&apos;s cards by <strong>real ₹/year</strong> —
          rewards minus fees and the caps aggregators skip — and link every number back to the issuer.
        </p>
        <SpendStarter />
      </section>

      {/* category tiles */}
      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Best cards, by what you need</h2>
          <Link href="/browse" className="text-sm">All {n} cards →</Link>
        </div>
        <CategoryTiles />
      </section>

      {/* credibility band */}
      <section className="rounded-2xl bg-slate-900 p-8 text-slate-100">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-brand-300">Why you can trust the numbers</div>
        <div className="mt-4 grid grid-cols-2 gap-6 md:grid-cols-4">
          <Trust k={String(n)} v="cards — every fee & reward links to the issuer's own page" />
          <Trust k="Net ₹/yr" v="ranked on what you keep; fees & caps in, 'up to' rates out" />
          <Trust k="₹0" v="affiliate income — we don't earn on applications, so nothing's pushed" />
          <Trust k="Dated" v="every card carries its own verification date" />
        </div>
      </section>

      {/* methodology */}
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-8">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-amber-800">How we rank — in one line</div>
        <p className="mt-2 text-lg font-semibold text-slate-900">
          What you keep = rewards − annual fee − the caps you&apos;ll actually hit → <span className="text-emerald-700">net ₹/yr</span>
        </p>
        <p className="mt-3 max-w-2xl text-sm text-slate-700">
          A 5% card capped at ₹1,000/month is not a 5% card — and we say so. Every ranking is the honest
          ₹/year for a stated spend, with the assumptions shown on each card&apos;s own breakdown.
        </p>
        <Link href="/about" className="mt-4 inline-block text-sm font-semibold text-slate-900 underline">Read the full method →</Link>
      </section>

      {/* tools */}
      <section>
        <h2 className="mb-3 text-xl font-semibold text-slate-900">Tools</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <Tool href="/recommend" t="Rank my cards" d="Enter your monthly spend by category → a net-₹/yr ranked shortlist." />
          <Tool href="/compare" t="Compare side by side" d="Up to 4 cards head-to-head — fees, rates, caps, lounges." />
          <Tool href="/calculator" t="Reward calculator" d="One card, your spend, the exact ₹/yr with caps applied." />
        </div>
      </section>
    </div>
  );
}

function Trust({ k, v }: { k: string; v: string }) {
  return (<div><div className="text-2xl font-semibold text-white tabular-nums">{k}</div><div className="mt-1.5 text-xs text-slate-300">{v}</div></div>);
}
function Tool({ href, t, d }: { href: string; t: string; d: string }) {
  return (
    <Link href={href as never} className="block rounded-xl border border-slate-200 bg-white p-5 no-underline transition-colors hover:border-brand-500/50">
      <div className="text-sm font-semibold text-slate-900">{t}</div>
      <div className="mt-1 text-xs text-slate-500">{d}</div>
      <div className="mt-3 text-xs font-semibold text-brand-700">Open →</div>
    </Link>
  );
}
```

- [ ] **Step 4: Gates** — full test suite, typecheck, prebuild, and `run build` (home is a server component; confirm it builds).
- [ ] **Step 5: Manual check** — dev server: home shows hero + starter + tiles + trust + methodology + tools; a category tile navigates to `/browse?tag=…` and the browse list reflects it; no featured card grid on the home page.
- [ ] **Step 6: Commit** — `git add site/components/home site/app/page.tsx && git commit -m "feat(home): intent-routing IA — hero+starter, category tiles, trust, methodology, tools (no card grid)"`

---

### Task 6: Card tile hierarchy

**Files:**
- Modify: `site/components/card-tile.tsx`

- [ ] **Step 1: Rework the type scale** — make the headline value-% and the fee/LTF the largest elements; demote issuer/tags to one muted line. Replace the two-column `grid` block (the `Annual fee` / `Rewards` cells) with a hierarchy where the reward value-% is the visual lead:

```tsx
      <div className="mt-3">
        <div className="text-lg font-semibold text-slate-900 tabular-nums">
          {bestRate != null ? `up to ${formatPct(bestRate, 1)}` : formatPct(rate, 2)}
          <span className="ml-1 text-xs font-normal text-slate-500">rewards</span>
        </div>
        <div className="mt-0.5 text-sm text-slate-700 tabular-nums">
          {fee ? formatFeeInr(fee) : "Lifetime free"}
          {waiverAt ? <span className="text-xs text-slate-500"> · waived at {formatInr(waiverAt)}</span> : null}
          <span className="text-xs text-slate-500"> · annual fee</span>
        </div>
      </div>
```

- [ ] **Step 2: Keep the memoisation** (`CardTileImpl` + `React.memo`) untouched — the grid renders 100+ tiles.
- [ ] **Step 3: Gates** — `npm.cmd --prefix site test -- --run` (confirm `detail-derivations.test.ts` still green), typecheck, prebuild.
- [ ] **Step 4: Commit** — `git commit -am "feat(card-tile): value-% + fee lead the hierarchy; meta demoted"`

---

### Task 7: Compare table — winner per row

**Files:**
- Modify: `site/components/compare-table.tsx`

- [ ] **Step 1: Add a winner helper + emphasis** — for numeric rows compute the winning column and emphasise that cell (`font-semibold` + existing accent), ties get none. Add near the top of the module:

```tsx
// lower-is-better for fees; higher-is-better for value-% and lounge counts.
function winners(values: (number | null)[], higherWins: boolean): boolean[] {
  const nums = values.filter((v): v is number => v != null);
  if (nums.length < 2) return values.map(() => false);
  const best = higherWins ? Math.max(...nums) : Math.min(...nums);
  const count = nums.filter((v) => v === best).length;
  if (count === values.filter((v) => v != null).length) return values.map(() => false); // all tie
  return values.map((v) => v != null && v === best);
}
```

- [ ] **Step 2: Apply** the helper to the annual-fee row (`higherWins=false`), the headline/accelerated value-% row (`higherWins=true`, compare via the existing value-% helpers — never raw `effective_rate`), and lounge-visits row (`higherWins=true`); add `className={win[i] ? "font-semibold text-emerald-700" : ""}` to each numeric cell.
- [ ] **Step 3: Gates** + screenshot `/compare?cards=hdfc-infinia,axis-atlas,sbi-cashback`, eyeball the emphasised winners.
- [ ] **Step 4: Commit** — `git commit -am "feat(compare): emphasise the winning cell per numeric row (ties neutral)"`

---

### Task 8: Header at 390px + mobile filter sheet

**Files:**
- Modify: `site/app/layout.tsx`
- Modify: `site/components/filter-bar.tsx` (mobile sheet toggle)

Note: `browse-client` already renders results-before-filters on mobile (`order-2 md:order-none`). This task hardens the header and makes the (long) filter list collapsible on mobile.

- [ ] **Step 1: Header** — verify at 390px via Playwright (`browser_resize` 390×844 + snapshot). If nav wraps/overflows, collapse the links into a `useState` hamburger dropdown (a small client component) or a horizontal scroll-snap strip. Assert no horizontal body scroll: `document.body.scrollWidth <= window.innerWidth`.
- [ ] **Step 2: Filter sheet** — on `<md`, wrap `FilterBar` in a collapsible: a sticky "Filters (n active)" button that toggles the existing filter list open/closed (`useState`), so the long list doesn't push results far down. `≥md` keeps the sidebar. Preserve the URL-state sync exactly — do not touch `browse-client`'s two round-trip effects.
- [ ] **Step 3: Gates** + Playwright check at 390px: results visible without scrolling past filters, sheet opens/closes, filter changes still update the URL.
- [ ] **Step 4: Commit** — `git commit -am "feat(mobile): 390px header hardening + collapsible filter sheet"`

---

### Task 9: Trust cues on detail + tiles

**Files:**
- Modify: `site/components/detail/quick-facts.tsx`
- Modify: `site/components/card-tile.tsx`

- [ ] **Step 1: QuickFacts** — add a muted "Data verified `<metadata.last_verified_on>`" line linking to the About methodology section; render the date via the existing formatting idiom. The value exists on every card.
- [ ] **Step 2: Card tile** — if a card carries a scorer flag surface a small amber dot; SKIP if it needs scorer context on the tile (tile scope is data-only) — in that case add only the verified-date as a `title` tooltip on the tile.
- [ ] **Step 3: Gates** + commit — `git commit -am "feat(trust): verified-on date on detail + tile"`

---

### Task 10: Visual/functional QA sweep + board close

**Files:**
- Create: `docs/ui-benchmark/2026-07/QA.md`
- Modify: `docs/TODO.md` (flip D9, D25, C3)

- [ ] **Step 1:** Playwright pass at 390×844, 768×1024, 1440×900 over `/`, `/browse`, `/recommend` (walk to results), `/card/hdfc/infinia`, `/compare`: assert no horizontal body scroll on any page/viewport; screenshot each to `docs/ui-benchmark/2026-07/`; record PASS/FAIL per page in `QA.md`.
- [ ] **Step 2:** Fix anything failing (each fix its own small commit), re-run until clean.
- [ ] **Step 3:** `npm.cmd --prefix site run build` final gate; flip D9/D25/C3 rows in `docs/TODO.md` citing `QA.md`; commit `docs: close D9/D25/C3 — functional redesign QA green at 3 viewports`.

## Self-Review Notes

- **Spec coverage:** D1→T1+T4; D2→T3; D3→T3+T5; D4→T5; D5→T2 (used in T3/T5); D6 copy honoured in T3/T5 strings. Component units: present.ts(T1), icons(T2), BestPickCard/RankedRow(T3), ResultsView(T4), home IA+SpendStarter+CategoryTiles(T5), CardTile(T6), CompareTable(T7), header+filter sheet(T8), trust cues(T9), QA(T10). Rank-key-sacred honoured (T1 labels only; T4 keeps the ranked `<ol>` order).
- **Deferred (Figma):** final palette/type/depth/dark mode — this plan uses existing Tailwind tokens only; markup is semantic for a later restyle.
- **Type consistency:** `Highlight` shape identical in T1/T3/T4; `cardDetailHref` defined once in `ranked-row.tsx` and imported by `best-pick-card.tsx`; `DecoupledScore` fields used match `scorer-decoupled.ts`.
- **Note:** mobile results-before-filters (old plan) is already shipped in `browse-client`; T8 covers only the header + the filter-sheet collapse, avoiding duplicate work.
