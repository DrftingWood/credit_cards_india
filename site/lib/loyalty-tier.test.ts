import { describe, test, expect } from "vitest";
import { explainCard, type ScoringContext, type SpendProfile } from "./calculator";
import { DEFAULT_VALUE_PREFS } from "./value-components";
import { tierContext } from "./usage";
import type { AcceleratedReward, EnrichedCard, LoyaltyProgram } from "./types";

const SOURCE = { url: "https://example.test", retrieved_on: "2024-01-01" };
const ZERO: SpendProfile = { online: 0, groceries: 0, dining: 0, fuel: 0, travel: 0, utilities: 0, rent: 0, international: 0 };
const spend = (o: Partial<SpendProfile>): SpendProfile => ({ ...ZERO, ...o });

const PROGRAM = {
  id: "test-air", name: "Test Air Club", type: "airline", currency: "miles",
  unit_value_inr: { face: 1, realized: 0.5 },
  earn: {
    baseline: { rate: 5, per_inr: 100 },
    channels: [],
    tiers: [
      { id: "silver", name: "Silver", bonus_rate: 2, bonus_per_inr: 100 },
      { id: "gold", name: "Gold", bonus_rate: 4, bonus_per_inr: 100 },
    ],
  },
} as unknown as LoyaltyProgram;

const FLIGHTS: AcceleratedReward = {
  category: "test-air-direct", canonical_categories: ["travel"], multiplier: 1,
  card_attributable_rate: 3, card_attributable_per_inr: 100, stacks_with_program: true,
  merchants: ["test-air-web"],
} as AcceleratedReward;

function makeCard(accelerated: AcceleratedReward[] = [FLIGHTS]): EnrichedCard {
  const rewards = {
    effective_from: "2024-01-01", effective_until: null, currency: "miles", loyalty_program: "test-air",
    base: { rate: 1, per_inr: 100, unit_value_inr: 0.6, unit_value_inr_realized: 0.45 }, accelerated, source: SOURCE,
  };
  return {
    id: "tier-test", name: "Tier Test", current_rewards: rewards, current_benefits: null,
    current_fees: { effective_from: "2024-01-01", effective_until: null, joining_fee_inr: 0, annual_fee_inr: 0, source: SOURCE },
    computed: { fee_waiver_spend_inr: null, is_active: true },
  } as unknown as EnrichedCard;
}

/** Realistic layer as the card page builds it: 50% of travel declared through the airline's site. */
const realistic = (tier: string | null): ScoringContext => ({
  applyApplicability: true, valueBasis: "realized",
  channelMix: new Set(["test-air-web"]), merchantShares: { "test-air-web": 0.5 }, enabledEcosystems: new Set(),
  ...tierContext({ "test-air": tier ?? "" }, [PROGRAM]),
});

describe("loyalty tier bonus — its own labelled line, never part of the rank", () => {
  const sp = spend({ travel: 20000 });

  test("a declared tier earns its bonus on the spend that flows through the stacking accelerator", () => {
    const ex = explainCard(makeCard(), sp, realistic("gold"), DEFAULT_VALUE_PREFS);
    const t = ex.value_components!.loyalty_tier!;
    // ₹20,000 × 50% × 12 = ₹1,20,000 a year qualifying; 4 per ₹100 = 4,800 miles × ₹0.45 = ₹2,160.
    expect(t.qualifying_spend_annual_inr).toBe(120000);
    expect(t.annual_inr).toBeCloseTo(2160, 6);
    expect(t.tier_name).toBe("Gold");
    expect(t.program_name).toBe("Test Air Club");
  });

  test("the rank total does not move; the ledger carries the bonus as a 'tier' line", () => {
    const withTier = explainCard(makeCard(), sp, realistic("gold"), DEFAULT_VALUE_PREFS);
    const without = explainCard(makeCard(), sp, realistic(null), DEFAULT_VALUE_PREFS);
    expect(withTier.annual_net_inr).toBe(without.annual_net_inr);
    const vc = withTier.value_components!;
    for (const l of [vc.ledger.first_year, vc.ledger.steady_state, vc.ledger.tenure_avg]) {
      const line = l.lines.find((x) => x.key === "tier");
      expect(line?.inr).toBe(2160);
      expect(line?.label).toMatch(/Gold tier bonus/);
      expect(line?.label).toMatch(/Test Air Club/);
      expect(l.lines.reduce((s, x) => s + x.inr, 0)).toBe(l.total_inr);
    }
    expect(vc.ledger.steady_state.total_inr - without.value_components!.ledger.steady_state.total_inr).toBe(2160);
    expect(vc.steady_state.tier_inr).toBeCloseTo(2160, 6);
  });

  test("no tier, an unknown tier, or a card without a stacking accelerator → no tier line", () => {
    for (const ex of [
      explainCard(makeCard(), sp, realistic(null), DEFAULT_VALUE_PREFS),
      explainCard(makeCard(), sp, realistic("platinum"), DEFAULT_VALUE_PREFS),
      explainCard(makeCard([{ ...FLIGHTS, stacks_with_program: false } as AcceleratedReward]), sp, realistic("gold"), DEFAULT_VALUE_PREFS),
    ]) {
      expect(ex.value_components!.loyalty_tier).toBeNull();
      expect(ex.value_components!.ledger.steady_state.lines.some((x) => x.key === "tier")).toBe(false);
    }
  });

  test("no double count when the context already stacks the tier into the rate (ctx.programs + tierMap, /recommend)", () => {
    const ctx: ScoringContext = { ...realistic("gold"), programs: { "test-air": PROGRAM }, tierMap: { "test-air": "gold" } };
    expect(explainCard(makeCard(), sp, ctx, DEFAULT_VALUE_PREFS).value_components!.loyalty_tier).toBeNull();
  });

  test("with programme data but no tierMap (card pages and /calculator, D-27) the tier is still a separate line", () => {
    const ctx: ScoringContext = { ...realistic("gold"), programs: { "test-air": PROGRAM } };
    const ex = explainCard(makeCard(), sp, ctx, DEFAULT_VALUE_PREFS);
    expect(ex.value_components!.loyalty_tier?.annual_inr).toBeGreaterThan(0);
    const without = explainCard(makeCard(), sp, { ...realistic(null), programs: { "test-air": PROGRAM } }, DEFAULT_VALUE_PREFS);
    expect(ex.annual_net_inr).toBe(without.annual_net_inr);
  });

  test("the Absolute layer (no usage context) shows no tier", () => {
    const ex = explainCard(makeCard(), sp, { valueBasis: "face" }, DEFAULT_VALUE_PREFS);
    expect(ex.value_components!.loyalty_tier).toBeNull();
  });

  test("no qualifying spend → no line", () => {
    const ex = explainCard(makeCard(), spend({ online: 20000 }), realistic("gold"), DEFAULT_VALUE_PREFS);
    expect(ex.value_components!.loyalty_tier).toBeNull();
  });
});

describe("tierContext — builds the narrow tier fields from the user's choice and programme data", () => {
  test("keeps only programmes and tiers that exist", () => {
    const c = tierContext({ "test-air": "gold", "other-air": "gold" }, [PROGRAM]);
    expect(c.tierLine).toEqual({ "test-air": "gold" });
    expect(Object.keys(c.tierPrograms)).toEqual(["test-air"]);
    expect(tierContext({ "test-air": "diamond" }, [PROGRAM]).tierLine).toEqual({});
    expect("tierMap" in c).toBe(false); // never stacked into the rate
  });
});

describe("loyalty tier on live data", () => {
  test("every stacking card gets a reconciling tier line for its programme's top tier", async () => {
    const { default: cards } = await import("../../dist/cards.json", { with: { type: "json" } });
    const { default: progs } = await import("../../dist/loyalty_programs.json", { with: { type: "json" } });
    const programs = progs as unknown as LoyaltyProgram[];
    let seen = 0;
    for (const c of (cards as unknown as EnrichedCard[]).filter((x) => x.computed.is_active)) {
      const r = c.current_rewards;
      const stacking = r?.accelerated?.filter((a) => a.stacks_with_program) ?? [];
      const prog = programs.find((p) => p.id === r?.loyalty_program);
      if (!stacking.length || !prog?.earn?.tiers?.length) continue;
      // A card with no card-level point value has no rupee tier line to show. The 2026-10
      // catalogue removed idfc-first-indigo's value (issuer: redemption value varies by route).
      if (r?.base.unit_value_inr == null && r?.base.unit_value_inr_realized == null) continue;
      const tokens = stacking.flatMap((a) => [...(a.merchants ?? []), ...(a.channel?.merchants ?? [])]);
      const ctx: ScoringContext = {
        applyApplicability: true, valueBasis: "realized",
        channelMix: new Set(tokens), merchantShares: Object.fromEntries(tokens.map((t) => [t, 1])), enabledEcosystems: new Set(),
        ...tierContext({ [prog.id]: prog.earn.tiers.at(-1)!.id }, programs),
      };
      const ex = explainCard(c, spend({ travel: 30000, online: 10000 }), ctx, DEFAULT_VALUE_PREFS);
      const vc = ex.value_components!;
      expect(vc.loyalty_tier, c.id).not.toBeNull();
      expect(vc.loyalty_tier!.annual_inr, c.id).toBeGreaterThan(0);
      for (const l of [vc.ledger.first_year, vc.ledger.steady_state, vc.ledger.tenure_avg]) {
        expect(l.lines.reduce((s, x) => s + x.inr, 0), c.id).toBe(l.total_inr);
      }
      seen++;
    }
    expect(seen).toBeGreaterThanOrEqual(2); // was 3 before idfc-first-indigo lost its point value (2026-10)
  });
});
