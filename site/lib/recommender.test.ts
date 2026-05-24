import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import {
  recommend,
  parseWelcomeCondition,
  type RecommendPayload,
  type IncomeBand,
} from "./recommender";
import type { EnrichedCard, LoyaltyProgram } from "./types";

async function loadDataset() {
  const { default: cards } = await import("../../dist/cards.json", { with: { type: "json" } });
  const { default: programs } = await import("../../dist/loyalty_programs.json", { with: { type: "json" } });
  return {
    cards: cards as unknown as EnrichedCard[],
    programsById: Object.fromEntries(
      (programs as unknown as LoyaltyProgram[]).map((p) => [p.id, p]),
    ),
  };
}

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
    const { cards, programsById } = await loadDataset();
    // Simulates: client union grew a new band ("50k-1L") but the constants record
    // wasn't updated; or a payload deserialized from JSON carries an unexpected string.
    const payload = basePayload({ income_band: "50k-1L" as IncomeBand });
    const results = recommend(cards, programsById, payload, 200);
    expect(results.length).toBeGreaterThan(0); // pre-fix: returned 0
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Unknown income band "50k-1L"'),
    );
  });
});

describe("computed.has_*_lounge requires real visits (B3-SF5)", () => {
  test("Amex Platinum Travel: international has visits_per_cycle: 0 → has_international_lounge: false", async () => {
    const { cards } = await loadDataset();
    const card = cards.find((c) => c.id === "amex-platinum-travel")!;
    expect(card.computed.has_international_lounge).toBe(false); // pre-fix: true
    expect(card.computed.has_domestic_lounge).toBe(true); // 8 visits/yr is real
  });
});

describe("recommend — lounge filter honours user pref (B4-BL2)", () => {
  test("lounge goal with domestic-only pref does NOT pass intl-only cards", async () => {
    const { cards, programsById } = await loadDataset();
    const payload = basePayload({
      goals: ["lounge"],
      lifestyle: { lounge_pref: "domestic-only", recurring: [] },
    });
    const results = recommend(cards, programsById, payload, 200);
    // Every result must have a real domestic lounge.
    for (const r of results) {
      expect(r.card.computed.has_domestic_lounge).toBe(true);
    }
  });
});

describe("recommend — domestic-unlimited credits finite-visit cards (B4-BL1)", () => {
  test("Amex Platinum Travel (8 domestic visits/yr) gets >0 lounge value when pref is domestic-unlimited", async () => {
    const { cards, programsById } = await loadDataset();
    const payload = basePayload({
      goals: ["lounge"],
      lifestyle: { lounge_pref: "domestic-unlimited", recurring: [] },
    });
    const results = recommend(cards, programsById, payload, 200);
    const plat = results.find((r) => r.card.id === "amex-platinum-travel");
    expect(plat).toBeDefined();
    expect(plat!.breakdown.lounge_inr).toBeGreaterThan(0); // pre-fix: 0
  });
});

describe("recommend — utilities-rent credits both buckets (B4-SF3)", () => {
  test("toggling utilities-rent raises total monthly spend by both ₹5k utilities + ₹5k rent", async () => {
    const { cards, programsById } = await loadDataset();
    // Use a card we know exists; the test asserts on score behaviour, not card identity.
    const without = recommend(
      cards,
      programsById,
      basePayload({ lifestyle: { lounge_pref: null, recurring: [] } }),
      1,
    );
    const withFlag = recommend(
      cards,
      programsById,
      basePayload({ lifestyle: { lounge_pref: null, recurring: ["utilities-rent"] } }),
      1,
    );
    // With both buckets credited, the same top card should have a higher gross
    // rewards number (utilities and rent both contribute spend now; pre-fix only
    // utilities did).
    expect(withFlag[0].base_score.base_value_inr_monthly).toBeGreaterThan(
      without[0].base_score.base_value_inr_monthly,
    );
  });
});

describe("recommend — deterministic tie-breaking (B4-SF9)", () => {
  test("two runs with identical input produce identical ordering", async () => {
    const { cards, programsById } = await loadDataset();
    const payload = basePayload({ goals: ["cashback"] });
    const a = recommend(cards, programsById, payload, 20);
    const b = recommend(cards, programsById, payload, 20);
    expect(a.map((r) => r.card.id)).toEqual(b.map((r) => r.card.id));
  });
});

describe("parseWelcomeCondition (B4-SF1)", () => {
  test("parses '₹50,000 in 90 days'", () => {
    expect(parseWelcomeCondition("₹50,000 in 90 days")).toEqual({ spendInr: 50000, days: 90 });
  });

  test("parses 'Spend ₹15,000 within 90 days' (real card format)", () => {
    expect(parseWelcomeCondition("Spend ₹15,000 within 90 days")).toEqual({ spendInr: 15000, days: 90 });
  });

  test("parses '2 lakh within 60 days'", () => {
    expect(parseWelcomeCondition("2 lakh within 60 days")).toEqual({ spendInr: 200000, days: 60 });
  });

  test("parses '1.5L in 90 days'", () => {
    expect(parseWelcomeCondition("1.5L in 90 days")).toEqual({ spendInr: 150000, days: 90 });
  });

  test("returns null for 'Joining fee paid'", () => {
    expect(parseWelcomeCondition("Joining fee paid")).toBeNull();
  });

  test("returns null for empty/undefined", () => {
    expect(parseWelcomeCondition(undefined)).toBeNull();
    expect(parseWelcomeCondition("")).toBeNull();
    expect(parseWelcomeCondition("Some arbitrary text without numbers")).toBeNull();
  });
});
