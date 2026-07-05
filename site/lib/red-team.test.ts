import { describe, test, expect } from "vitest";
import { scoreDecoupled } from "./scorer-decoupled";
import type { RecommendPayload } from "./recommender";
import type { EnrichedCard, LoyaltyProgram } from "./types";

/**
 * E5 red-team replay locks (D19). These are adversarial-profile invariants on
 * the LIVE dataset, not unit tests: if a data regression (uncapped rate,
 * ungated accelerator) or an engine regression lets an absurd result through
 * unflagged, these fail. Guards warn — they never fudge the rank (the
 * no-invented-values principle): a suspicious card is flagged, not clipped.
 */

async function load() {
  const { default: cards } = await import("../../dist/cards.json", { with: { type: "json" } });
  const { default: progs } = await import("../../dist/loyalty_programs.json", { with: { type: "json" } });
  return {
    cards: cards as unknown as EnrichedCard[],
    programs: Object.fromEntries((progs as unknown as LoyaltyProgram[]).map((p) => [p.id, p])),
  };
}
function base(o: Partial<RecommendPayload> = {}): RecommendPayload {
  return { income_band: "gt-3L", goals: [], monthly_spend: { online: "0", travel: "0", dining: "0", groceries: "0", fuel: "0" }, brand_preferences: { shopping: [], airline: null, food_ecosystem: null, fuel_station: null }, lifestyle: { lounge_pref: null, recurring: [] }, ...o };
}

// A single gt-30k bucket is scored at a representative ₹40k/mo → ₹480k/yr.
const SINGLE_BUCKET_ANNUAL_SPEND = 480000;

describe("red-team replay — adversarial profiles against the live dataset (E5/D19)", () => {
  test("fuel-heavy: every positive-net top card actually earns on fuel (F10)", async () => {
    const { cards, programs } = await load();
    const res = scoreDecoupled(cards, programs, base({ goals: ["cashback"], monthly_spend: { fuel: "gt-30k", online: "0", travel: "0", dining: "0", groceries: "0" } }), { topN: 5 });
    for (const d of res) {
      if (d.net_rewards_inr <= 0) continue;
      // Fuel is the only spend entered, so a positive spend-grounded rank key
      // means the card genuinely rewards fuel — the reason line says so.
      expect(d.reason).toMatch(/fuel/i);
      expect(d.flags.join(" ")).not.toMatch(/don't cover your main category/);
    }
  });

  test("no unflagged card returns an absurd share of any single-bucket spend (F2/F7 watchdog)", async () => {
    const { cards, programs } = await load();
    const buckets = ["online", "dining", "travel", "groceries", "fuel"] as const;
    for (const bucket of buckets) {
      const spend = { online: "0", travel: "0", dining: "0", groceries: "0", fuel: "0", [bucket]: "gt-30k" } as never;
      const res = scoreDecoupled(cards, programs, base({ goals: ["cashback"], monthly_spend: spend }), { topN: 5 });
      for (const d of res) {
        const sharePct = (d.net_rewards_inr / SINGLE_BUCKET_ANNUAL_SPEND) * 100;
        if (sharePct > 25) {
          expect(
            d.flags.length,
            `${d.card.id} returns ${sharePct.toFixed(1)}% on ${bucket} with no flag`,
          ).toBeGreaterThan(0);
        }
      }
    }
  });
});
