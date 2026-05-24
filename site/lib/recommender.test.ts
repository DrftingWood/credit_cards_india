import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { recommend, type RecommendPayload, type IncomeBand } from "./recommender";
import type { EnrichedCard, LoyaltyProgram } from "./types";

function basePayload(overrides: Partial<RecommendPayload> = {}): RecommendPayload {
  return {
    income_band: null,
    goals: [],
    monthly_spend: { online: "lt-5k", travel: "0", dining: "0", groceries: "0", fuel: "0" },
    brand_preferences: { shopping: [], airline: null, food_ecosystem: null, fuel_station: null },
    lifestyle: { lounge_pref: null, recurring: [] },
    ...overrides,
  };
}

describe("recommend — income band filter (blocker #2)", () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  test("known band: 'lt-30k' filters out cards requiring more than ₹3.6L p.a.", async () => {
    const { default: cards } = await import("../../dist/cards.json", { with: { type: "json" } });
    const { default: programs } = await import("../../dist/loyalty_programs.json", { with: { type: "json" } });
    const allCards = cards as unknown as EnrichedCard[];
    const programsById = Object.fromEntries(
      (programs as unknown as LoyaltyProgram[]).map((p) => [p.id, p]),
    );
    const unfiltered = recommend(allCards, programsById, basePayload({ income_band: null }), 200);
    const filtered = recommend(allCards, programsById, basePayload({ income_band: "lt-30k" }), 200);
    expect(unfiltered.length).toBeGreaterThan(filtered.length);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test("unknown band (type-drift simulation): does NOT silently drop every card", async () => {
    const { default: cards } = await import("../../dist/cards.json", { with: { type: "json" } });
    const { default: programs } = await import("../../dist/loyalty_programs.json", { with: { type: "json" } });
    const allCards = cards as unknown as EnrichedCard[];
    const programsById = Object.fromEntries(
      (programs as unknown as LoyaltyProgram[]).map((p) => [p.id, p]),
    );
    // Simulates: client union grew a new band ("50k-1L") but the constants record
    // wasn't updated; or a payload deserialized from JSON carries an unexpected string.
    const payload = basePayload({ income_band: "50k-1L" as IncomeBand });
    const results = recommend(allCards, programsById, payload, 200);
    expect(results.length).toBeGreaterThan(0); // pre-fix: returned 0
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Unknown income band "50k-1L"'),
    );
  });
});
