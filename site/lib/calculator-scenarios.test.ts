import { describe, test, expect } from "vitest";
import { allocatePortfolio } from "./portfolio";
import { scoreCard, rankCards, type SpendProfile } from "./calculator";
import type { EnrichedCard } from "./types";
import { usageContext, type UsageProfile } from "./usage";

async function load() {
  const { default: cards } = await import("../../dist/cards.json", { with: { type: "json" } });
  return (cards as unknown as EnrichedCard[]).filter((c) => c.computed.is_active);
}

function emptySpend(): SpendProfile {
  return { online: 0, groceries: 0, dining: 0, fuel: 0, travel: 0, utilities: 0, rent: 0, international: 0 };
}

describe("Red-Testing Calculator & Portfolio Across User Scenarios", () => {
  // Scenario 1: ₹50k on Swiggy / Food Apps
  test("Scenario 1: Swiggy / Food Apps (₹50k/mo) - Cap spilling & multi-card superiority", async () => {
    const cards = await load();
    const spend = { ...emptySpend(), dining: 50_000 };

    // Swiggy merchant preference
    const usage: UsageProfile = {
      merchant_share_pct: { swiggy: 100 },
      ecosystems: [],
      gate_calculator: true,
      loyalty_tiers: {},
    };
    const ctx = usageContext(usage);

    const soloScores = rankCards(cards, spend, ctx);
    const topSolo = soloScores[0];

    const p = allocatePortfolio(cards, spend, ctx, { dropFeeNegative: true });

    // 1. The stack must beat the single best card scored alone
    expect(p.annual_net_inr).toBeGreaterThan(topSolo.annual_net_inr);

    // 2. Swiggy HDFC must be in the stack, must be cap-bound, and must route at least ₹15,000
    const swiggySlot = p.slots.find((s) => s.card.id === "hdfc-swiggy-hdfc");
    expect(swiggySlot).toBeDefined();
    expect(swiggySlot!.cap_bound).toBe(true);
    expect(swiggySlot!.monthly_spend_inr).toBeCloseTo(15_000, -2);
    expect(swiggySlot!.monthly_value_inr).toBeCloseTo(1_500, -1);

    // 3. Excess spend must spill to other cards (e.g. HSBC Live+, Millennia, etc.)
    expect(p.slots.length).toBeGreaterThanOrEqual(2);

    // 4. Zero unallocated spend
    expect(p.unallocated_monthly_spend_inr).toBe(0);
  });

  // Scenario 2: E-Commerce Heavy (₹60k/mo Online Shopping)
  test("Scenario 2: E-Commerce Heavy (₹60k/mo Online) - Absorbs without premature cap drop", async () => {
    const cards = await load();
    const spend = { ...emptySpend(), online: 60_000 };

    const p = allocatePortfolio(cards, spend, {}, { dropFeeNegative: true });

    expect(p.slots.length).toBeGreaterThanOrEqual(1);
    expect(p.monthly_value_inr).toBeGreaterThanOrEqual(2500); // at least ~5% on 60k
    expect(p.unallocated_monthly_spend_inr).toBe(0);

    // Check that allocated spend across slots matches 60k
    const totalAllocated = p.slots.reduce((sum, s) => sum + s.monthly_spend_inr, 0);
    expect(totalAllocated).toBeCloseTo(60_000, 0);
  });

  // Scenario 3: Frequent Flyer / Travel (₹1,00,000/mo)
  test("Scenario 3: Travel Heavy (₹1,00,000/mo Travel) - Reward yield and fee recovery", async () => {
    const cards = await load();
    const spend = { ...emptySpend(), travel: 100_000 };

    const p = allocatePortfolio(cards, spend, {}, { dropFeeNegative: true });

    expect(p.slots.length).toBeGreaterThanOrEqual(1);
    // On 1L/mo travel (12L/yr), rewards should comfortably exceed annual fees
    expect(p.annual_net_inr).toBeGreaterThan(30_000);
    expect(p.unallocated_monthly_spend_inr).toBe(0);
  });

  // Scenario 4: Heavy Fuel & Commute (₹25,000/mo Fuel)
  test("Scenario 4: Fuel Heavy (₹25,000/mo) - Fuel cards route, non-fuel cards excluded", async () => {
    const cards = await load();
    const spend = { ...emptySpend(), fuel: 25_000 };

    const p = allocatePortfolio(cards, spend, {}, { dropFeeNegative: true });

    expect(p.slots.length).toBeGreaterThanOrEqual(1);

    // Fuel-excluded cards like Swiggy HDFC or SBI Cashback must NOT be allocated fuel spend
    for (const slot of p.slots) {
      const fuelExclusions = slot.card.current_rewards?.exclusions ?? [];
      expect(fuelExclusions.includes("fuel")).toBe(false);
    }
  });

  // Scenario 5: Modest / Low Budget Spender (₹10,000/mo Total)
  test("Scenario 5: Low Budget Spender (₹10,000/mo) - Fee negative pruning", async () => {
    const cards = await load();
    const spend = { ...emptySpend(), online: 5000, groceries: 3000, dining: 2000 };

    const p = allocatePortfolio(cards, spend, {}, { dropFeeNegative: true });

    // Every card in this stack must clear its fee (annual value > annual fee)
    for (const slot of p.slots) {
      expect(slot.monthly_value_inr * 12).toBeGreaterThanOrEqual(slot.annual_fee_inr);
    }
    expect(p.annual_net_inr).toBeGreaterThan(0);
  });

  // Scenario 6: Mathematical Invariants Watchdog
  test("Scenario 6: Mathematical Invariants - No NaN, exact spend accounting", async () => {
    const cards = await load();
    const testProfiles: SpendProfile[] = [
      { online: 15000, groceries: 8000, dining: 8000, fuel: 4000, travel: 10000, utilities: 5000, rent: 0, international: 0 },
      { online: 50000, groceries: 20000, dining: 15000, fuel: 10000, travel: 25000, utilities: 10000, rent: 30000, international: 20000 },
      { online: 0, groceries: 0, dining: 0, fuel: 0, travel: 0, utilities: 0, rent: 0, international: 0 },
    ];

    for (const sp of testProfiles) {
      const p = allocatePortfolio(cards, sp, {}, { dropFeeNegative: true });
      const totalInputSpend = Object.values(sp).reduce((a, b) => a + b, 0);

      expect(Number.isFinite(p.monthly_value_inr)).toBe(true);
      expect(Number.isFinite(p.annual_net_inr)).toBe(true);
      expect(Number.isFinite(p.annual_fee_inr)).toBe(true);
      expect(p.monthly_value_inr).toBeGreaterThanOrEqual(0);

      const totalAllocated = p.slots.reduce((s, slot) => s + slot.monthly_spend_inr, 0);
      expect(totalAllocated + p.unallocated_monthly_spend_inr).toBeCloseTo(totalInputSpend, 0);
    }
  });
});
