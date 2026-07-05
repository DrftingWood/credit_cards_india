# Site Visual Redesign (Competitor-Benchmarked) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Before writing any UI code, load the `frontend-design` and `dataviz` skills for aesthetic and chart/stat-tile guidance.

**Goal:** Benchmark the site's presentation against CardExpert, CardInsider, and Paisabazaar, then rework result presentation, tile hierarchy, and mobile ergonomics so a user can answer "which card and why" in one glance — closing D25, D9, and the C3 residuals.

**Architecture:** Phase 0 produces a screenshot-based findings doc with a fixed rubric (this is the benchmark deliverable — later tasks cite it). Phases 1–3 are code: a pure presentation-layer `pickHighlights()` module for grouped recommend results (rank math untouched — the no-invented-values rank stays the single source of truth), tile/compare hierarchy fixes, and trust cues. Phase 4 is Playwright visual QA at three viewports.

**Tech Stack:** Next.js (site/), Tailwind, vitest, Playwright (playwright MCP or webapp-testing skill), existing `DecoupledScore` shape from `site/lib/scorer-decoupled.ts`.

## Global Constraints

- Branch: `site-visual-2026-07`. Never commit to `main`/`master`. Never push unless asked.
- The rank key is sacred: presentation may GROUP and LABEL results but never re-order within a group by anything other than `net_rewards_inr`, and never fold welcome/milestone/lounge into a rank (DECISIONS: decoupled one-offs stay out).
- Every gate before every commit: `npm.cmd --prefix site test -- --run`, `npm.cmd --prefix site run typecheck`, `npm.cmd --prefix site run prebuild`; `npm.cmd --prefix site run build` at least once per phase.
- Screenshots of external sites are for internal benchmarking only — do not commit competitor screenshots to the repo (copyright); commit only the findings doc. Own-site screenshots go to `docs/ui-benchmark/2026-07/`.
- Copy tone: factual, source-linked, no editorial superlatives (matches the existing beta-banner promise).
- Commit trailer convention: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` + `Claude-Session:` link.

---

### Task 1: Benchmark capture + findings doc (Phase 0)

**Files:**
- Create: `docs/ui-benchmark/2026-07/FINDINGS.md`
- Create: `docs/ui-benchmark/2026-07/own-*.png` (own-site screenshots only)

**Interfaces:**
- Produces: FINDINGS.md with a scored rubric table; Tasks 2–8 each cite the finding they close by rubric row ID (F-1, F-2, …).

- [ ] **Step 1: Run the site** — `npm.cmd --prefix site run dev` (background), wait for `localhost:3000`.
- [ ] **Step 2: Capture own site** — via Playwright MCP: `/`, `/browse`, `/recommend` (walk the wizard to results with a dining-heavy profile), `/card/hdfc/infinia`, `/compare?cards=hdfc-infinia,axis-atlas` at 390×844 and 1440×900. Save as `own-<page>-<width>.png`.
- [ ] **Step 3: Capture competitors (do not save to repo)** — browse `cardexpert.in` best-cards-2026 page, a CardInsider card-detail page, a Paisabazaar card-listing page at both widths; take notes/screenshots in the scratchpad only.
- [ ] **Step 4: Write FINDINGS.md** with exactly this rubric, one row per finding, scored 1–5 for us and best-competitor, with a one-line gap description:

```markdown
# UI Benchmark 2026-07 — Findings

| ID | Dimension | Us | Best competitor | Gap (one line) |
| --- | --- | --- | --- | --- |
| F-1 | Answer-first results (is the #1 pick + why visible without scrolling?) | ? | ? | ? |
| F-2 | Result grouping (tiered by capacity/pattern vs one flat list) | ? | ? | ? |
| F-3 | Per-card reason line (concrete ₹/yr + category, not adjectives) | ? | ? | ? |
| F-4 | Tile hierarchy (headline rate/fee legible at arm's length?) | ? | ? | ? |
| F-5 | Trust cues (verified-on date, source links, flags visible?) | ? | ? | ? |
| F-6 | Mobile results-before-filters | ? | ? | ? |
| F-7 | Header/nav behaviour at 390px | ? | ? | ? |
| F-8 | Compare table scannability (winner-per-row visible?) | ? | ? | ? |
| F-9 | Detail-page above-the-fold (fees+rate+status without scroll?) | ? | ? | ? |

## Notes per finding
(F-1 … F-9: two or three sentences each, citing the screenshots.)
```

- [ ] **Step 5: Commit** — findings doc + own-site screenshots only.

---

### Task 2: `pickHighlights()` presentation module (D25 core)

**Files:**
- Create: `site/lib/present.ts`
- Test: `site/lib/present.test.ts`

**Interfaces:**
- Consumes: `DecoupledScore[]` (sorted by `net_rewards_inr` desc — the scorer already guarantees this) and `RecommendPayload`.
- Produces: `pickHighlights(scores: DecoupledScore[], payload: RecommendPayload): Highlight[]` where `Highlight = { key: "best-overall" | "best-no-fee" | "best-for-top-category" | "premium-pick"; label: string; score: DecoupledScore }`. Pure function, no re-ranking — each highlight is the FIRST score in the already-ranked list satisfying its predicate.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, test, expect } from "vitest";
import { pickHighlights } from "./present";
import type { DecoupledScore } from "./scorer-decoupled";

const mk = (id: string, net: number, fee: number, reason = ""): DecoupledScore =>
  ({ card: { id, computed: { is_lifetime_free: fee === 0 } }, net_rewards_inr: net,
     annual_rewards_inr: net + fee, annual_fee_inr: fee, first_year_bonus_inr: 0,
     milestone_value_inr: 0, lounge_visits: { domestic: 0, international: 0 },
     reason, flags: [] }) as unknown as DecoupledScore;

describe("pickHighlights — grouping labels, never re-ranking", () => {
  const scores = [mk("a", 9000, 5000, "Best on your dining spend"), mk("b", 8000, 0), mk("c", 7000, 0)];
  const payload = { monthly_spend: { dining: "gt-30k", online: "0", travel: "0", groceries: "0", fuel: "0" } } as never;

  test("best-overall is scores[0]; best-no-fee is the first LTF card", () => {
    const h = pickHighlights(scores, payload);
    expect(h.find((x) => x.key === "best-overall")!.score.card.id).toBe("a");
    expect(h.find((x) => x.key === "best-no-fee")!.score.card.id).toBe("b");
  });

  test("a highlight never points at a lower-ranked card than an earlier qualifier", () => {
    const h = pickHighlights(scores, payload);
    for (const x of h) expect(scores.indexOf(x.score)).toBeGreaterThanOrEqual(0);
  });

  test("no duplicate card across highlights", () => {
    const h = pickHighlights(scores, payload);
    const ids = h.map((x) => x.score.card.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
```

- [ ] **Step 2: Run to verify FAIL** — `npm.cmd --prefix site test -- --run lib/present.test.ts` → module not found.
- [ ] **Step 3: Implement**

```ts
/**
 * Presentation-layer grouping for /recommend results (D25, benchmark F-2).
 * PURE LABELLING: each highlight is the first entry of the already-ranked
 * list that satisfies a factual predicate. No re-ranking, no invented value.
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

  const spendEntries = Object.entries(payload.monthly_spend ?? {}) as [CanonicalCategory, string][];
  const top = spendEntries.filter(([, band]) => band !== "0").sort((a, b) => b[1].localeCompare(a[1]))[0]?.[0];
  if (top) {
    take("best-for-top-category", `Best for ${CATEGORY_LABELS[top] ?? top}`,
      scores.find((s) => s.reason.toLowerCase().includes(String(top))));
  }
  take("premium-pick", "Premium pick (fee justified by rewards)",
    scores.find((s) => s.annual_fee_inr > 0 && s.net_rewards_inr > 0));
  return out;
}
```

- [ ] **Step 4: Run tests → PASS** (fix the top-category band comparison if the band-string sort proves wrong for real band names — the test pins behaviour, adjust implementation not the test).
- [ ] **Step 5: Commit** — `feat(present): pickHighlights grouping for recommend results (D25, F-2) — labels only, no re-ranking`.

---

### Task 3: ResultsView — grouped, answer-first layout (D25 UI)

**Files:**
- Modify: `site/app/recommend/recommend-client.tsx` (the `ResultsView` component, ~line 656)

- [ ] **Step 1: Restructure ResultsView** — above the existing flat list, render a highlights band: one `HighlightCard` per `pickHighlights()` entry showing card art (existing `CardImage`), the highlight label as the section header, the existing `reason` line verbatim, net ₹/yr large (existing `formatInr`), fee + LTF chip, flags as amber chips. The full ranked list stays below under "All ranked results" (unchanged rows). Match existing Tailwind idiom in the file.
- [ ] **Step 2: Remove the debug payload panel from public results** — the C3 review flagged it; wrap in `process.env.NODE_ENV === "development"` if it's still useful locally, delete otherwise.
- [ ] **Step 3: Gates** — full test suite, typecheck, `run build`.
- [ ] **Step 4: Manual check** — dev server, run the wizard (dining-heavy), verify: highlights render, no duplicate cards, flat list intact, no debug panel in a production build (`run build` + `npx serve site/out` or `next start`).
- [ ] **Step 5: Commit** — `feat(recommend): answer-first grouped results (D25, F-1/F-2/F-3); hide debug payload panel`.

---

### Task 4: Card tile hierarchy (F-4)

**Files:**
- Modify: `site/components/card-tile.tsx`

- [ ] **Step 1:** Rework the tile's type scale per the benchmark finding: headline value-% (existing `bestAcceleratedPct`) and fee/LTF chip get the largest/boldest slots; issuer + network logos stay; tags/meta drop to a single muted line. Keep the memoisation (`CardTileImpl` + `React.memo`) — the grid renders 100+ tiles.
- [ ] **Step 2:** Verify `detail-derivations.test.ts` still passes (tile consumes its helpers) + full gates.
- [ ] **Step 3:** Screenshot `/browse` at 390 + 1440, save over the Task 1 own-shots, eyeball against FINDINGS F-4.
- [ ] **Step 4:** Commit.

---

### Task 5: Mobile browse ergonomics (F-6, C3 residual)

**Files:**
- Modify: `site/app/browse/browse-client.tsx`, `site/components/filter-bar.tsx`

- [ ] **Step 1:** On `<md` viewports render results FIRST with a sticky "Filters (n active)" button that opens the existing `FilterBar` in a slide-over/sheet (Tailwind `fixed inset-y-0` panel + backdrop, no new dependency); `≥md` keeps the current sidebar. Preserve the URL-state sync exactly (both effects — the round-trip equality guard must not be disturbed).
- [ ] **Step 2:** Gates + Playwright check at 390px: results visible without scroll-past-filters, sheet opens/closes, filter changes still update the URL.
- [ ] **Step 3:** Commit.

---

### Task 6: Header behaviour at 390px (F-7, C3 residual)

**Files:**
- Modify: `site/app/layout.tsx`

- [ ] **Step 1:** Verify the earlier C3 fix at 390px via Playwright (`browser_resize` + snapshot). If nav still wraps/overflows: collapse to a hamburger (button + the same nav links in a dropdown, `useState` toggle in a small client component) or a horizontal scroll-snap strip — pick whichever the FINDINGS scored higher for competitors.
- [ ] **Step 2:** Assert no horizontal body scroll at 390px (evaluate `document.body.scrollWidth <= window.innerWidth`). Gates + commit.

---

### Task 7: Compare-table winner-per-row (F-8)

**Files:**
- Modify: `site/components/compare-table.tsx`
- Test: extend `site/lib/detail-derivations.test.ts` only if a new helper is extracted; otherwise visual-check only

- [ ] **Step 1:** For numeric rows (annual fee — lower wins; headline/accelerated value-% — higher wins; lounge visits — higher wins), compute the winning column and give that cell a subtle emphasis (`font-semibold` + existing accent token). Ties get no emphasis (the booking view's `isTie` convention). Rates must compare via the existing value-% helpers, never raw `effective_rate` (units contract).
- [ ] **Step 2:** Gates + screenshot `/compare` with 3 cards, eyeball, commit.

---

### Task 8: Trust cues on detail + tiles (F-5)

**Files:**
- Modify: `site/components/detail/quick-facts.tsx` (verified-on badge), `site/components/card-tile.tsx` (flag dot if the card would carry a scorer flag — SKIP if it needs scorer context on the tile; tile scope is data-only)

- [ ] **Step 1:** QuickFacts hero gets a muted "Data verified <metadata.last_verified_on>" line with a link to the About methodology section — the value exists on every card; render date via existing formatting idiom.
- [ ] **Step 2:** Gates + commit.

---

### Task 9: Visual QA sweep (D9 close-out)

**Files:**
- Create: `docs/ui-benchmark/2026-07/QA.md`
- Modify: `docs/TODO.md` (flip D9, D25, C3)

- [ ] **Step 1:** Playwright pass at 390×844, 768×1024, 1440×900 over `/`, `/browse`, `/recommend` results, `/card/hdfc/infinia`, `/compare`, `/booking`: assert no horizontal body scroll on any page/viewport; screenshot each; record PASS/FAIL per page in QA.md.
- [ ] **Step 2:** Fix anything failing (each fix = its own small commit), re-run until clean.
- [ ] **Step 3:** `npm.cmd --prefix site run build` final gate; flip D9/D25/C3 rows citing QA.md; commit `docs: close D9/D25/C3 — visual QA green at 3 viewports`.

## Self-Review Notes

- Spec coverage: benchmarking (T1), D25 grouped presentation (T2–T3), C3 residuals — debug panel (T3), mobile filters (T5), header (T6) — tile hierarchy (T4), compare scannability (T7), trust cues (T8), D9 QA (T9).
- FINDINGS rubric IDs are referenced by later tasks; if Phase 0 scores a dimension as already-competitive, the executing agent may mark that task's step "verified competitive, no change" and move on — the benchmark decides, not this plan.
- Type check: `pickHighlights` consumes `DecoupledScore` exactly as declared in `scorer-decoupled.ts:44` (`card`, `net_rewards_inr`, `annual_fee_inr`, `reason`, `flags`) and `CATEGORY_LABELS`/`CanonicalCategory` from `category-mapping.ts`; `is_lifetime_free` exists on `card.computed` (build.mjs sets it).
