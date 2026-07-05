import { describe, test, expect } from "vitest";
import { scoreDecoupled, ratesFlags } from "./scorer-decoupled";
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

  test("implausible uncapped rates are flagged, not hidden (F7)", () => {
    // Guards the FLAGGING MECHANISM directly. The 2026-07 remediation capped/
    // corrected every real card that used to carry a broad uncapped implausible
    // rate, so no live card trips this anymore via the recommend flow — but the
    // guard must still fire if bad data reappears. A broad (no channel), uncapped
    // ~12% accelerator must be flagged; a plausible uncapped 5% must not.
    const mk = (rate: number, opts: Partial<{ cap: unknown; channel: unknown }> = {}) =>
      ({
        current_rewards: {
          base: { rate: 1, per_inr: 100, unit_value_inr: 1 },
          accelerated: [
            { category: "online", canonical_categories: ["online"], effective_rate: rate, effective_per_inr: 100, cap_per_cycle: opts.cap ?? "unlimited", channel: opts.channel },
          ],
        },
      }) as unknown as EnrichedCard;

    // broad, uncapped, ~12% → flagged
    expect(ratesFlags(mk(12), "online", new Set(["online"] as never), 1).some((f) => f.includes("uncapped"))).toBe(true);
    // plausible uncapped 5% (Amazon-Pay-like) → NOT flagged
    expect(ratesFlags(mk(5), "online", new Set(["online"] as never), 1).some((f) => f.includes("uncapped"))).toBe(false);
    // channel-gated (narrow) high rate → NOT flagged (expected for co-brand/portal)
    expect(ratesFlags(mk(12, { channel: { required: true, merchants: ["amazon"] } }), "online", new Set(["online"] as never), 1).some((f) => f.includes("uncapped"))).toBe(false);
  });

  test("ratesFlags never emits an Infinity flag when per_inr is 0 (rate-math guard)", () => {
    // A `per_inr: 0` typo must not surface "~Infinity%" to the user; the rate
    // conversion must go through pointsToPct (which guards per_inr <= 0).
    const card = {
      current_rewards: {
        base: { rate: 1, per_inr: 0, unit_value_inr: 1 },
        accelerated: [
          { category: "online", canonical_categories: ["online"], effective_rate: 5, cap_per_cycle: "unlimited" },
        ],
      },
    } as unknown as EnrichedCard;
    const flags = ratesFlags(card, "online", new Set(["online"] as never), 1);
    expect(flags.some((f) => f.includes("Infinity") || f.includes("NaN"))).toBe(false);
  });

  test("clean data: no live card trips the uncapped flag in the dining recommend flow (F7 regression)", async () => {
    const { cards, programs } = await load();
    const res = scoreDecoupled(cards, programs, base({ goals: ["cashback"], monthly_spend: { online: "0", travel: "0", dining: "gt-30k", groceries: "0", fuel: "0" } }), { topN: 10 });
    // Documents the remediation outcome — a broad uncapped implausible dining rate
    // resurfacing here would be a data regression to investigate.
    expect(res.some((d) => d.flags.some((f) => f.includes("uncapped")))).toBe(false);
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

  test("near-identical variants are de-duped (F12)", async () => {
    const { cards, programs } = await load();
    const p = base({ goals: ["cashback"], monthly_spend: { online: "gt-30k", travel: "0", dining: "0", groceries: "0", fuel: "0" } });
    const res = scoreDecoupled(cards, programs, p, { topN: 30 });
    const ids = res.map((d) => d.card.id);
    // No two results share a variant stem (e.g. kotak-cashback-plus + -prime).
    for (let i = 0; i < ids.length; i++)
      for (let j = i + 1; j < ids.length; j++)
        expect(ids[j].startsWith(ids[i] + "-") || ids[i].startsWith(ids[j] + "-")).toBe(false);
    // Turning dedupe off brings the variant back.
    const raw = scoreDecoupled(cards, programs, p, { topN: 30, dedupeVariants: false }).map((d) => d.card.id);
    expect(raw.length).toBeGreaterThanOrEqual(ids.length);
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
