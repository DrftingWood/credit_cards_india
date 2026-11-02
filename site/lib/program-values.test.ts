import { describe, test, expect } from "vitest";
import { explainCard, scoreCard, unitValueFor, type ScoringContext, type SpendProfile } from "./calculator";
import { DEFAULT_VALUE_PREFS } from "./value-components";
import type { AcceleratedReward, EnrichedCard, LoyaltyProgram, RewardRecord } from "./types";

// D-27: card pages and /calculator get the full programme records. These tests lock
// what that does: programme unit values (unless the card opts out), no stacking of
// programme earn into the rank there (stackProgramEarn: false), and D-24's rule that a
// declared tier stays a separate line, never the rank.

const SOURCE = { url: "https://example.test", retrieved_on: "2024-01-01" };
const ZERO: SpendProfile = { online: 0, groceries: 0, dining: 0, fuel: 0, travel: 0, utilities: 0, rent: 0, international: 0 };
const spend = (o: Partial<SpendProfile>): SpendProfile => ({ ...ZERO, ...o });

const PROGRAM = {
  id: "test-air", name: "Test Air Club", type: "airline", currency: "miles",
  unit_value_inr: { face: 1, realized: 0.5 },
  earn: {
    baseline: { rate: 5, per_inr: 100 },
    channels: [{ channel: "cobrand-merchant", merchants: ["test-air-web"], rate: 2, per_inr: 100 }],
    tiers: [{ id: "gold", name: "Gold", bonus_rate: 4, bonus_per_inr: 100 }],
  },
} as unknown as LoyaltyProgram;
const PROGRAMS = { "test-air": PROGRAM };

const FLIGHTS: AcceleratedReward = {
  category: "test-air-direct", canonical_categories: ["travel"], multiplier: 1,
  card_attributable_rate: 3, card_attributable_per_inr: 100, stacks_with_program: true,
  channel: { required: true, class: "cobrand-merchant", merchants: ["test-air-web"] },
} as AcceleratedReward;

function makeCard(extra: Partial<RewardRecord> = {}, accelerated: AcceleratedReward[] = [FLIGHTS]): EnrichedCard {
  const rewards = {
    effective_from: "2024-01-01", effective_until: null, currency: "miles", loyalty_program: "test-air",
    base: { rate: 1, per_inr: 100, unit_value_inr: 0.25, unit_value_inr_realized: 0.2 }, accelerated, source: SOURCE, ...extra,
  };
  return {
    id: "prog-test", name: "Prog Test", current_rewards: rewards, current_benefits: null,
    current_fees: { effective_from: "2024-01-01", effective_until: null, joining_fee_inr: 0, annual_fee_inr: 0, source: SOURCE },
    computed: { fee_waiver_spend_inr: null, is_active: true },
  } as unknown as EnrichedCard;
}

describe("unit value with programme data", () => {
  test("the programme's values replace the card's", () => {
    const r = makeCard().current_rewards!;
    expect(unitValueFor(r, PROGRAMS, "realized")).toBe(0.5);
    expect(unitValueFor(r, PROGRAMS, "face")).toBe(1);
    expect(unitValueFor(r, undefined, "realized")).toBe(0.2);
  });

  test("unit_value_from_program: false keeps the card's own values (a non-1:1 conversion, e.g. bob-irctc)", () => {
    const r = makeCard({ unit_value_from_program: false }).current_rewards!;
    expect(unitValueFor(r, PROGRAMS, "realized")).toBe(0.2);
    expect(unitValueFor(r, PROGRAMS, "face")).toBe(0.25);
  });
});

describe("programme earn: stacked on /recommend, never on card pages or /calculator", () => {
  const sp = spend({ travel: 10000 });
  test("stackProgramEarn: false values the card's own 3 per ₹100 at the programme's ₹0.5, nothing more", () => {
    // 3 per ₹100 at ₹0.5 = 1.5% of ₹10,000 = ₹150/mo.
    expect(scoreCard(makeCard(), sp, { programs: PROGRAMS, stackProgramEarn: false }).annual_gross_inr).toBeCloseTo(1800, 6);
  });
  test("default (the /recommend wizard, D-9) still stacks baseline + matching channel", () => {
    const ctx: ScoringContext = { programs: PROGRAMS, channelMix: new Set(["test-air-web"]) };
    // 3 card + 5 baseline + 2 channel = 10 per ₹100 at ₹0.5 = 5% = ₹500/mo.
    expect(scoreCard(makeCard(), sp, ctx).annual_gross_inr).toBeCloseTo(6000, 6);
  });
});

describe("D-24 still holds with programme data: a declared tier is a line, not the rank", () => {
  const sp = spend({ travel: 10000 });
  const lineCtx: ScoringContext = { programs: PROGRAMS, stackProgramEarn: false, tierLine: { "test-air": "gold" }, tierPrograms: PROGRAMS };

  test("tierLine adds a 'tier' ledger line and leaves annual_net_inr alone", () => {
    const withTier = explainCard(makeCard(), sp, lineCtx, DEFAULT_VALUE_PREFS);
    const without = explainCard(makeCard(), sp, { programs: PROGRAMS, stackProgramEarn: false }, DEFAULT_VALUE_PREFS);
    expect(withTier.annual_net_inr).toBe(without.annual_net_inr);
    const t = withTier.value_components!.loyalty_tier!;
    // ₹1,20,000 a year qualifying × 4 per ₹100 = 4,800 miles × ₹0.5 = ₹2,400.
    expect(t.annual_inr).toBeCloseTo(2400, 6);
    expect(withTier.value_components!.ledger.steady_state.lines.find((x) => x.key === "tier")?.inr).toBe(2400);
  });

  test("tierMap with stacking (the /recommend wizard) puts the tier in the rate instead, with no second line", () => {
    const ctx: ScoringContext = { programs: PROGRAMS, tierMap: { "test-air": "gold" }, tierLine: { "test-air": "gold" }, tierPrograms: PROGRAMS };
    const ex = explainCard(makeCard(), sp, ctx, DEFAULT_VALUE_PREFS);
    expect(ex.value_components!.loyalty_tier).toBeNull();
    expect(ex.annual_net_inr).toBeGreaterThan(explainCard(makeCard(), sp, { programs: PROGRAMS }).annual_net_inr);
  });
});

// The 19 co-brand cards whose unit values change when programme data is passed. Expected
// values are AFTER the 2026-10-21 review (docs/PROGRAMME-VALUES-REVIEW-2026-10-21.md):
// the IndiGo, Air India, IRCTC and Tata Neu programme files were corrected to the cards'
// 2026-07-05 values, and bob-irctc opts out. [realized, face] with programme data.
const EXPECTED: Record<string, [number, number]> = {
  "axis-indigo": [0.45, 0.6], "axis-indigo-premium": [0.45, 0.6], "idfc-first-indigo": [0.45, 0.6],
  "kotak-indigo": [0.45, 0.6], "kotak-indigo-xl": [0.45, 0.6], "sbi-indigo": [0.45, 0.6], "sbi-indigo-elite": [0.45, 0.6],
  "bob-irctc": [0.25, 0.25], // 2026-10 catalogue: realized raised 0.18 -> 0.25 (data/cards/bob/irctc.yaml)
  "hdfc-irctc-hdfc": [1, 1], "rbl-irctc": [1, 1], "sbi-irctc-platinum": [1, 1], "sbi-irctc-premier": [1, 1],
  "hdfc-marriott-bonvoy": [0.55, 0.85],
  "hdfc-tata-neu-infinity": [1, 1], "hdfc-tata-neu-infinity-rupay": [1, 1], "hdfc-tata-neu-plus": [1, 1], "hdfc-tata-neu-plus-rupay": [1, 1], "sbi-tata-neu-infinity": [1, 1], "sbi-tata-neu-plus": [1, 1],
  // sbi-air-india-platinum and -signature left this list: inactive in the 2026-10 catalogue.
};

describe("live data: the reviewed co-brand cards", () => {
  test("every card linked to a programme is in the reviewed list, with the reviewed values", async () => {
    const { default: cards } = await import("../../dist/cards.json", { with: { type: "json" } });
    const { default: progs } = await import("../../dist/loyalty_programs.json", { with: { type: "json" } });
    const programs = Object.fromEntries((progs as unknown as LoyaltyProgram[]).map((p) => [p.id, p]));
    const linked = (cards as unknown as EnrichedCard[]).filter((c) => c.computed.is_active && c.current_rewards?.loyalty_program);
    expect(linked.map((c) => c.id).sort()).toEqual(Object.keys(EXPECTED).sort());
    for (const c of linked) {
      const r = c.current_rewards!;
      expect([unitValueFor(r, programs, "realized"), unitValueFor(r, programs, "face")], c.id).toEqual(EXPECTED[c.id]);
    }
  });
});
