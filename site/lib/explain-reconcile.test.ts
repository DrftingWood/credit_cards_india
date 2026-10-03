import { describe, test, expect } from "vitest";
import { scoreCard, explainCard, type ScoringContext, type SpendProfile } from "./calculator";
import type { EnrichedCard } from "./types";

// The card page's "See the math" breakdown (explainCard) and the /calculator
// ranking (scoreCard) must agree on the bottom line for every card, or the
// same card shows two different ₹/yr figures for the same spend.

const ZERO: SpendProfile = { online: 0, groceries: 0, dining: 0, fuel: 0, travel: 0, utilities: 0, rent: 0, international: 0 };
const PROFILES: Record<string, SpendProfile> = {
  zero: ZERO,
  light: { ...ZERO, online: 5000, groceries: 5000, dining: 3000 },
  "slab-crossing": { ...ZERO, online: 60000, dining: 50000 },
  "excluded-heavy": { ...ZERO, fuel: 15000, rent: 40000, utilities: 8000 },
  travel: { ...ZERO, travel: 200000, international: 50000 },
  "all-100k": Object.fromEntries(Object.keys(ZERO).map((k) => [k, 100000])) as SpendProfile,
};
const LAYERS: Record<string, ScoringContext> = {
  // Same contexts components/detail/acceleration-breakdown.tsx builds.
  realistic: { applyApplicability: true, channelMix: new Set(), enabledEcosystems: new Set(), valueBasis: "realized" },
  absolute: { valueBasis: "face" },
  default: {},
};

describe("explainCard reconciles with scoreCard", () => {
  test("annual net and fee agree for every active card, profile and layer", { timeout: 60_000 }, async () => {
    const { default: data } = await import("../../dist/cards.json", { with: { type: "json" } });
    const cards = (data as unknown as EnrichedCard[]).filter((c) => c.computed.is_active);
    const failures: string[] = [];
    for (const card of cards) {
      for (const [pName, spend] of Object.entries(PROFILES)) {
        for (const [lName, ctx] of Object.entries(LAYERS)) {
          const ex = explainCard(card, spend, ctx);
          const sc = scoreCard(card, spend, ctx);
          if (Math.abs(ex.annual_net_inr - sc.annual_net_inr) >= 0.01 || ex.annual_fee_inr !== sc.annual_fee_effective_inr) {
            failures.push(`${card.id}/${pName}/${lName}: explain ${ex.annual_net_inr.toFixed(2)} vs score ${sc.annual_net_inr.toFixed(2)}`);
          }
        }
      }
    }
    expect(failures).toEqual([]);
  });
});
