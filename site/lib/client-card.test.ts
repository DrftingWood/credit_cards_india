import { describe, test, expect } from "vitest";
import Fuse from "fuse.js";
import { toClientCard } from "./client-card";
import { scoreCard, explainCard, type ScoringContext, type SpendProfile } from "./calculator";
import { scoreDecoupled } from "./scorer-decoupled";
import { filterCards, EMPTY_FILTERS, type FilterState } from "./filters";
import { pickHighlights } from "./present";
import type { RecommendPayload } from "./recommender";
import type { ClientCard, EnrichedCard, LoyaltyProgram } from "./types";

// The interactive pages receive toClientCard(card) instead of the full
// EnrichedCard. These tests prove that every engine they run gives the same
// answer on the trimmed shape as on the full one, so trimming the payload
// can never silently change a number.

async function load() {
  const { default: cards } = await import("../../dist/cards.json", { with: { type: "json" } });
  const { default: progs } = await import("../../dist/loyalty_programs.json", { with: { type: "json" } });
  const full = (cards as unknown as EnrichedCard[]).filter((c) => c.computed.is_active);
  return {
    full,
    slim: full.map(toClientCard),
    programs: Object.fromEntries((progs as unknown as LoyaltyProgram[]).map((p) => [p.id, p])),
  };
}

const ZERO: SpendProfile = { online: 0, groceries: 0, dining: 0, fuel: 0, travel: 0, utilities: 0, rent: 0, international: 0 };
const PROFILES: SpendProfile[] = [
  { ...ZERO, online: 15000, groceries: 8000, dining: 5000, fuel: 3000, travel: 4000, utilities: 3000 },
  { ...ZERO, online: 60000, dining: 50000 },
  { ...ZERO, fuel: 15000, rent: 40000, utilities: 8000 },
  { ...ZERO, travel: 200000, international: 50000 },
];

/** Drop the card itself so the comparison is about the computed numbers. */
function numbers<T extends { card: unknown }>(s: T): Omit<T, "card"> {
  const { card: _card, ...rest } = s;
  return rest;
}

describe("toClientCard keeps every engine's output identical", () => {
  test("scoreCard and explainCard", { timeout: 60_000 }, async () => {
    const { full, slim, programs } = await load();
    const ctxs: ScoringContext[] = [
      {},
      { enabledEcosystems: new Set() },
      { applyApplicability: true, channelMix: new Set(), enabledEcosystems: new Set(), valueBasis: "realized" },
      { valueBasis: "face" },
      { programs, channelMix: new Set(["amazon", "swiggy", "smartbuy"]), tierMap: {}, applyApplicability: true },
    ];
    for (const ctx of ctxs) {
      for (const spend of PROFILES) {
        full.forEach((card, i) => {
          expect(numbers(scoreCard(slim[i], spend, ctx))).toEqual(numbers(scoreCard(card, spend, ctx)));
          expect(explainCard(slim[i], spend, ctx)).toEqual(explainCard(card, spend, ctx));
        });
      }
    }
  });

  test("recommender scores and highlights", { timeout: 60_000 }, async () => {
    const { full, slim, programs } = await load();
    const base: RecommendPayload = {
      income_band: "75k-1.5L",
      goals: [],
      monthly_spend: { online: "15k-30k", travel: "5k-15k", dining: "5k-15k", groceries: "lt-5k", fuel: "lt-5k" },
      brand_preferences: { shopping: [], airline: null, food_ecosystem: null, fuel_station: null },
      lifestyle: { lounge_pref: null, recurring: [] },
    };
    const payloads: RecommendPayload[] = [
      base,
      { ...base, goals: ["cashback"], brand_preferences: { shopping: ["amazon"], airline: null, food_ecosystem: "swiggy", fuel_station: null } },
      { ...base, goals: ["lounge"], lifestyle: { lounge_pref: "international", recurring: [] } },
      { ...base, goals: ["travel"], brand_preferences: { shopping: [], airline: "indigo", food_ecosystem: null, fuel_station: null } },
      { ...base, income_band: "lt-30k" },
      { ...base, income_band: "gt-3L", monthly_spend: { online: "gt-30k", travel: "gt-30k", dining: "gt-30k", groceries: "gt-30k", fuel: "gt-30k" } },
    ];
    for (const p of payloads) {
      const a = scoreDecoupled(full, programs, p, { topN: 400 });
      const b = scoreDecoupled(slim, programs, p, { topN: 400 });
      expect(b.map((s) => s.card.id)).toEqual(a.map((s) => s.card.id));
      expect(b.map(numbers)).toEqual(a.map(numbers));
      const ha = pickHighlights(a, p).map((h) => [h.key, h.score.card.id]);
      const hb = pickHighlights(b, p).map((h) => [h.key, h.score.card.id]);
      expect(hb).toEqual(ha);
    }
  });

  test("browse filters and search", { timeout: 60_000 }, async () => {
    const { full, slim } = await load();
    const toggles: Array<Partial<FilterState>> = [
      {},
      { lifetimeFree: true },
      { feeWaiver: true },
      { domesticLounge: true },
      { intlLounge: true },
      { hasMilestones: true },
      { hasWelcomeBonus: true },
      { inviteOnly: true },
      { coBrandOnly: true },
      { forexBand: "low" },
      { forexBand: "mid" },
      { forexBand: "high" },
      { tags: ["cashback", "travel"] },
      { currencies: ["points"] },
      { coBrandCategories: ["airline", "e-commerce"] },
      { issuers: ["hdfc", "axis"], tiers: ["premium"] },
    ];
    const ids = (cs: ClientCard[]) => cs.map((c) => c.id);
    for (const t of toggles) {
      const f = { ...EMPTY_FILTERS, ...t };
      expect(ids(filterCards(slim, f))).toEqual(ids(filterCards(full, f)));
    }
    const opts = { keys: ["name", "issuer_detail.name", "issuer_detail.short_name", "metadata.tags"], threshold: 0.35, ignoreLocation: true };
    const fa = new Fuse(full, opts);
    const fb = new Fuse(slim, opts);
    for (const q of ["hdfc", "travel", "amex plat", "cashback", "indigo", "sbi elite"]) {
      expect(fb.search(q).map((r) => r.item.id)).toEqual(fa.search(q).map((r) => r.item.id));
    }
  });

  test("trimmed payload carries no history, sources or application data", { timeout: 60_000 }, async () => {
    const { full, slim } = await load();
    const json = JSON.stringify(slim);
    expect(json).not.toContain('"source"');
    expect(json).not.toContain('"retrieved_on"');
    expect(json).not.toContain('"application"');
    expect(json).not.toContain('"legal_name"');
    expect(json).not.toContain('"effective_from"');
    expect(json.length).toBeLessThan(JSON.stringify(full).length * 0.4);
  });
});
