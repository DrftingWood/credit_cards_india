import { describe, test, expect } from "vitest";
import { scoreDecoupled } from "./scorer-decoupled";
import type { RecommendPayload } from "./recommender";
import type { EnrichedCard, LoyaltyProgram } from "./types";

async function load() {
  const { default: cards } = await import("../../dist/cards.json", { with: { type: "json" } });
  const { default: progs } = await import("../../dist/loyalty_programs.json", { with: { type: "json" } });
  return {
    cards: cards as unknown as EnrichedCard[],
    programs: Object.fromEntries((progs as unknown as LoyaltyProgram[]).map((p) => [p.id, p])),
  };
}
function base(o: Partial<RecommendPayload> = {}): RecommendPayload {
  return { income_band: "75k-1.5L", goals: [], monthly_spend: { online: "0", travel: "0", dining: "0", groceries: "0", fuel: "0" }, brand_preferences: { shopping: [], airline: null, food_ecosystem: null, fuel_station: null }, lifestyle: { lounge_pref: null, recurring: [] }, ...o };
}

describe("decoupled scorer prototype", () => {
  test("brand selection lifts the matching co-brand card via its REAL rate (F1)", async () => {
    const { cards, programs } = await load();
    const spend = { online: "gt-30k", travel: "0", dining: "0", groceries: "0", fuel: "0" } as const;
    const noBrand = scoreDecoupled(cards, programs, base({ goals: ["cashback"], monthly_spend: spend }), { topN: 300 });
    const withAmz = scoreDecoupled(cards, programs, base({ goals: ["cashback"], monthly_spend: spend, brand_preferences: { shopping: ["amazon"], airline: null, food_ecosystem: null, fuel_station: null } }), { topN: 300 });
    const az = (rs: typeof noBrand) => rs.find((d) => d.card.id === "icici-amazon-pay")!;
    expect(az(withAmz).net_rewards_inr).toBeGreaterThan(az(noBrand).net_rewards_inr);
    // No invented fraction: with amazon selected the whole online bucket earns the co-brand 5%.
    expect(az(withAmz).net_rewards_inr).toBe(24000); // 5% of ₹40k/mo × 12
  });

  test("milestones are decoupled — a milestone phantom does NOT top the ranking (F3)", async () => {
    const { cards, programs } = await load();
    const foodie = scoreDecoupled(cards, programs, base({ goals: ["cashback"], monthly_spend: { online: "0", travel: "0", dining: "gt-30k", groceries: "5k-15k", fuel: "0" } }), { topN: 5 });
    // Old engine put amex-platinum-reserve #1 via a ₹1.44L milestone; it must not top a rewards rank.
    expect(foodie[0].card.id).not.toBe("amex-platinum-reserve");
    // Milestone value is reported as a separate line item, never folded into the rank key.
    for (const d of foodie) expect(d).toHaveProperty("milestone_value_inr");
  });

  test("implausible uncapped rates are flagged, not hidden (F7)", async () => {
    const { cards, programs } = await load();
    const res = scoreDecoupled(cards, programs, base({ goals: ["cashback"], monthly_spend: { online: "0", travel: "0", dining: "gt-30k", groceries: "0", fuel: "0" } }), { topN: 10 });
    expect(res.some((d) => d.flags.some((f) => f.includes("uncapped")))).toBe(true);
  });

  test("exact spend: selecting Amazon credits Amazon ICICI's real uncapped 5% on ₹4L/mo (F9 + user principle)", async () => {
    const { cards, programs } = await load();
    const p = base({
      goals: ["cashback"],
      brand_preferences: { shopping: ["amazon"], airline: null, food_ecosystem: null, fuel_station: null },
    });
    const az = scoreDecoupled(cards, programs, p, { topN: 400, exactSpend: { online: 400000 } }).find((d) => d.card.id === "icici-amazon-pay")!;
    // 5% uncapped on ₹4L/mo × 12 = ₹2.4L, no annual fee — credited via the REAL rate, no fudge.
    expect(az.net_rewards_inr).toBe(240000);
    expect(az.flags).toEqual([]); // 5% is plausible → not flagged
  });

  test("one-time welcome is never the rank key (F5/F8)", async () => {
    const { cards, programs } = await load();
    // Zero spend: rank is net rewards (≈0 for all), so nothing should rank purely on a welcome bonus.
    const res = scoreDecoupled(cards, programs, base({}), { topN: 5 });
    for (const d of res) expect(d.net_rewards_inr).toBeLessThanOrEqual(res[0].net_rewards_inr);
    // welcome is a separate field
    for (const d of res) expect(d).toHaveProperty("first_year_bonus_inr");
  });
});
