import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import {
  recommend,
  parseWelcomeCondition,
  milestonesValue,
  type RecommendPayload,
  type IncomeBand,
} from "./recommender";
import type { EnrichedCard, LoyaltyProgram, BenefitRecord } from "./types";

type Milestone = NonNullable<BenefitRecord["milestones"]>[number];
function benefitWith(milestones: Milestone[]): BenefitRecord {
  return {
    effective_from: "2024-01-01",
    effective_until: null,
    milestones,
    source: { url: "https://example.test", retrieved_on: "2024-01-01" },
  } as BenefitRecord;
}

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

describe("milestonesValue — rich metadata (A4)", () => {
  test("repeatable monthly (rolling) milestone credits every qualifying month", () => {
    const b = benefitWith([
      { spend_inr: 6000, cycle: "monthly", benefit: "₹250 voucher", value_inr: 250, trigger_window: "rolling", is_repeatable: true },
    ]);
    // ₹10k/mo (₹120k/yr) clears ₹6k every month → 12 × ₹250.
    expect(milestonesValue(b, 120000)).toBe(3000);
    // ₹5k/mo (₹60k/yr) never clears ₹6k in a month → nothing.
    expect(milestonesValue(b, 60000)).toBe(0);
  });

  test("max_awards_per_cycle caps a per-₹N repeatable annual milestone (Amex SmartEarn 3×)", () => {
    const b = benefitWith([
      { spend_inr: 120000, cycle: "annual", benefit: "500 pts", value_inr: 500, trigger_window: "anniversary-year", is_repeatable: true, max_awards_per_cycle: 3 },
    ]);
    expect(milestonesValue(b, 120000)).toBe(500); // 1×
    expect(milestonesValue(b, 360000)).toBe(1500); // 3×
    expect(milestonesValue(b, 600000)).toBe(1500); // still capped at 3×
  });

  test("first-year milestone is amortised, not credited in full every year", () => {
    const b = benefitWith([
      { spend_inr: 100000, cycle: "annual", benefit: "₹1499 voucher", value_inr: 1499, trigger_window: "first-year", is_repeatable: false },
    ]);
    expect(milestonesValue(b, 150000)).toBeCloseTo(1499 / 2, 5); // amortised over 2 yrs
    expect(milestonesValue(b, 50000)).toBe(0); // spend bar not met
  });

  test("tiered anniversary ladder sums each crossed tier (once each)", () => {
    const b = benefitWith([
      { spend_inr: 0, cycle: "annual", benefit: "base", value_inr: 1200, trigger_window: "anniversary-year" },
      { spend_inr: 150000, cycle: "annual", benefit: "tier1", value_inr: 1200, trigger_window: "anniversary-year" },
      { spend_inr: 300000, cycle: "annual", benefit: "tier2", value_inr: 1200, trigger_window: "anniversary-year" },
    ]);
    expect(milestonesValue(b, 100000)).toBe(1200); // only the ₹0 tier
    expect(milestonesValue(b, 150000)).toBe(2400); // ₹0 + ₹150k tiers
    expect(milestonesValue(b, 300000)).toBe(3600); // all three
  });

  test("non-repeatable sub-annual milestone fires at most once per year", () => {
    const b = benefitWith([
      { spend_inr: 5000, cycle: "monthly", benefit: "one-shot", value_inr: 1000, is_repeatable: false },
    ]);
    // ₹10k/mo clears ₹5k every month, but is_repeatable:false → once/yr, not 12×.
    expect(milestonesValue(b, 120000)).toBe(1000);
  });

  test("legacy annual milestone (no trigger_window) behaves as before", () => {
    const b = benefitWith([
      { spend_inr: 400000, cycle: "annual", benefit: "₹5000 voucher", value_inr: 5000 },
    ]);
    expect(milestonesValue(b, 480000)).toBe(5000);
    expect(milestonesValue(b, 300000)).toBe(0);
  });

  test("end-to-end: Amex MRCC monthly milestone flows through recommend", async () => {
    const { cards, programsById } = await loadDataset();
    const res = recommend(
      cards,
      programsById,
      basePayload({ monthly_spend: { online: "5k-15k", travel: "0", dining: "0", groceries: "0", fuel: "0" } }),
      200,
    );
    const mrcc = res.find((r) => r.card.id === "amex-mrcc");
    expect(mrcc).toBeDefined();
    // ₹10k/mo → monthly ₹6k milestone fires 12× (₹3000); annual ₹9L milestone does not.
    expect(mrcc!.breakdown.milestones_inr).toBe(3000);
  });
});

describe("recommend — lounge value gated by prior-cycle spend threshold (A3)", () => {
  test("Axis IndiGo domestic lounge (₹50k/quarter gate) is NOT credited at low spend", async () => {
    const { cards, programsById } = await loadDataset();
    const low = recommend(
      cards,
      programsById,
      basePayload({
        goals: ["lounge"],
        lifestyle: { lounge_pref: "domestic-only", recurring: [] },
        // ₹2.5k/mo → ₹7.5k/quarter, well under the ₹50k/quarter unlock.
        monthly_spend: { online: "lt-5k", travel: "0", dining: "0", groceries: "0", fuel: "0" },
      }),
      200,
    );
    const axis = low.find((r) => r.card.id === "axis-indigo");
    expect(axis).toBeDefined();
    expect(axis!.breakdown.lounge_inr).toBe(0);
    expect(axis!.caveats.join(" ")).toMatch(/prior-cycle spend/i);
  });

  test("Axis IndiGo domestic lounge IS credited once projected spend clears the gate", async () => {
    const { cards, programsById } = await loadDataset();
    const high = recommend(
      cards,
      programsById,
      basePayload({
        goals: ["lounge"],
        lifestyle: { lounge_pref: "domestic-only", recurring: [] },
        // ₹80k/mo → ₹240k/quarter, comfortably over the ₹50k/quarter unlock.
        monthly_spend: { online: "gt-30k", travel: "gt-30k", dining: "0", groceries: "0", fuel: "0" },
      }),
      200,
    );
    const axis = high.find((r) => r.card.id === "axis-indigo");
    expect(axis).toBeDefined();
    expect(axis!.breakdown.lounge_inr).toBeGreaterThan(0);
    expect(axis!.caveats.join(" ")).not.toMatch(/prior-cycle spend/i);
  });

  test("threshold-free lounge cards (Amex Platinum Travel) are unaffected by the gate", async () => {
    const { cards, programsById } = await loadDataset();
    const results = recommend(
      cards,
      programsById,
      basePayload({
        goals: ["lounge"],
        lifestyle: { lounge_pref: "domestic-unlimited", recurring: [] },
        monthly_spend: { online: "lt-5k", travel: "0", dining: "0", groceries: "0", fuel: "0" },
      }),
      200,
    );
    const plat = results.find((r) => r.card.id === "amex-platinum-travel");
    expect(plat).toBeDefined();
    expect(plat!.breakdown.lounge_inr).toBeGreaterThan(0); // 8 visits/yr, no spend gate
  });
});

describe("recommend — no channel selected blocks channel-locked accelerators (A1)", () => {
  test("no brand/portal/airline/food/fuel signal → no result ranks on a channel-locked rate", async () => {
    const { cards, programsById } = await loadDataset();
    // Heavy spend across every scored bucket, but the user picked NO channel.
    const payload = basePayload({
      monthly_spend: { online: "gt-30k", travel: "15k-30k", dining: "5k-15k", groceries: "5k-15k", fuel: "5k-15k" },
    });
    const results = recommend(cards, programsById, payload, 50);
    expect(results.length).toBeGreaterThan(0);
    for (const r of results) {
      for (const pc of r.per_category) {
        expect(pc.basis).not.toBe("channel-locked");
      }
      // The channel-reliance caveat must not appear when nothing is channel-locked.
      expect(r.caveats.join(" ")).not.toMatch(/selected partner channel/);
    }
  });

  test("selecting a shopping channel makes a narrow co-brand rate eligible (then A2 handles its share)", async () => {
    const { cards, programsById } = await loadDataset();
    const spend = { online: "gt-30k", travel: "0", dining: "0", groceries: "0", fuel: "0" } as const;
    const noChannel = recommend(cards, programsById, basePayload({ monthly_spend: spend }), 200);
    const withAmazon = recommend(
      cards,
      programsById,
      basePayload({
        monthly_spend: spend,
        brand_preferences: { shopping: ["amazon"], airline: null, food_ecosystem: null, fuel_station: null },
      }),
      200,
    );

    // icici-amazon-pay carries a channel-locked online accelerator on the amazon-pay
    // token. Not opting in → the channel is unsatisfied and the rate simply doesn't
    // apply. Opting in → the channel is satisfied, so A2's applicability logic kicks
    // in; with no authored share the rate is recognised-but-uncounted and flagged.
    const off = noChannel.find((r) => r.card.id === "icici-amazon-pay");
    const on = withAmazon.find((r) => r.card.id === "icici-amazon-pay");
    expect(off?.base_score.merchant_rates_uncounted).toBeUndefined();
    expect(on?.base_score.merchant_rates_uncounted).toBe(true);
    expect(on!.caveats.join(" ")).toMatch(/specific merchants\/portals/);
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
