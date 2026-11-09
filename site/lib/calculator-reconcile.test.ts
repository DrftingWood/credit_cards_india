import { describe, test, expect } from "vitest";
import { explainCard, scoreCard, type ScoringContext, type SpendProfile } from "./calculator";
import type { EnrichedCard } from "./types";

// scoreCard feeds the rank; explainCard feeds the per-card breakdown shown beside it.
// They must agree for every live card, not only for the fixtures someone thought to write:
// each time the two drifted (slab resume point, bucket-scoped base) a real card showed two
// different totals on one screen.

async function load() {
  const { default: cards } = await import("../../dist/cards.json", { with: { type: "json" } });
  return (cards as unknown as EnrichedCard[]).filter((c) => c.current_rewards && c.computed.is_active);
}

function spend(o: Partial<SpendProfile>): SpendProfile {
  return { online: 0, groceries: 0, dining: 0, fuel: 0, travel: 0, utilities: 0, rent: 0, international: 0, ...o };
}

const PROFILES: Array<[string, SpendProfile]> = [
  ["even mid spend", spend({ online: 20_000, groceries: 10_000, dining: 8_000, fuel: 5_000, travel: 12_000, utilities: 6_000 })],
  ["heavy, cap-binding", spend({ online: 150_000, groceries: 60_000, dining: 60_000, fuel: 30_000, travel: 200_000, utilities: 40_000, rent: 50_000, international: 80_000 })],
  ["online and travel only", spend({ online: 45_000, travel: 45_000 })],
  ["small", spend({ online: 3_000, groceries: 2_000, dining: 1_000 })],
  ["telecom present", { ...spend({ online: 30_000, utilities: 9_000 }), telecom: 4_000 }],
];

const CONTEXTS: Array<[string, ScoringContext | undefined]> = [
  ["no context", undefined],
  ["absolute (face)", { valueBasis: "face" }],
  ["realistic, no channels", { applyApplicability: true, channelMix: new Set<string>() }],
  ["realistic, some channels and shares", {
    applyApplicability: true,
    channelMix: new Set(["amazon", "flipkart", "swiggy", "smartbuy"]),
    merchantShares: { amazon: 0.4, swiggy: 0.5 },
  }],
];

describe("explainCard reconciles with scoreCard on every live card", () => {
  for (const [profileName, profile] of PROFILES) {
    for (const [ctxName, ctx] of CONTEXTS) {
      test(`${profileName} / ${ctxName}`, async () => {
        const cards = await load();
        expect(cards.length).toBeGreaterThan(300);
        const mismatches: string[] = [];
        for (const card of cards) {
          const s = scoreCard(card, profile, ctx);
          const e = explainCard(card, profile, ctx);
          if (Math.abs(s.annual_net_inr - e.annual_net_inr) > 0.01) {
            mismatches.push(`${card.id}: score ${s.annual_net_inr.toFixed(2)} vs explain ${e.annual_net_inr.toFixed(2)}`);
          }
          // The explanation's own rows must also add up to what the per-bucket score shows.
          const rows = [...e.accelerators.map((a) => a.net_value_inr), ...e.base_spend.map((b) => b.value_inr)]
            .reduce((x, y) => x + y, 0);
          const buckets = s.buckets.reduce((x, b) => x + b.monthly_value_inr, 0);
          if (Math.abs(rows - buckets) > 0.01) {
            mismatches.push(`${card.id}: explain rows ${rows.toFixed(2)}/mo vs score buckets ${buckets.toFixed(2)}/mo`);
          }
        }
        expect(mismatches).toEqual([]);
      });
    }
  }
});
