import { describe, test, expect } from "vitest";
import { allocatePortfolio } from "./portfolio";
import { scoreCard, type SpendProfile } from "./calculator";
import type { EnrichedCard } from "./types";
import { usageContext, type UsageProfile } from "./usage";

async function load() {
  const { default: cards } = await import("../../dist/cards.json", { with: { type: "json" } });
  return (cards as unknown as EnrichedCard[]).filter((c) => c.computed.is_active);
}

describe("Deep Review of Calculator: 50k Swiggy Spend Allocation", () => {
  test("Portfolio allocation on active cards for 50k monthly dining / food delivery spend", async () => {
    const activeCards = await load();
    console.log(`Loaded ${activeCards.length} active cards.`);

    const spendDining: SpendProfile = {
      online: 0,
      groceries: 0,
      dining: 50_000,
      fuel: 0,
      travel: 0,
      utilities: 0,
      rent: 0,
      international: 0,
    };

    // 1. Standard dining allocation
    const portfolioGeneral = allocatePortfolio(activeCards, spendDining, {}, { dropFeeNegative: true });

    console.log("\n=======================================================");
    console.log("CASE A: GENERAL DINING / FOOD-DELIVERY (50,000 INR / month)");
    console.log("=======================================================");
    console.log("Total Monthly Value:", portfolioGeneral.monthly_value_inr);
    console.log("Total Annual Gross:", portfolioGeneral.annual_value_inr);
    console.log("Total Annual Fees:", portfolioGeneral.annual_fee_inr);
    console.log("Net Annual Benefit:", portfolioGeneral.annual_net_inr);
    console.log("Blended Effective Rate:", ((portfolioGeneral.monthly_value_inr / 50000) * 100).toFixed(2) + "%");

    for (const slot of portfolioGeneral.slots) {
      console.log(`\n• Card: ${slot.card.name} (${slot.card.id})`);
      console.log(`  Spend Allocated: ₹${slot.monthly_spend_inr.toLocaleString("en-IN")}`);
      console.log(`  Monthly Reward:  ₹${slot.monthly_value_inr.toLocaleString("en-IN")}`);
      console.log(`  Effective Rate:  ${slot.effective_rate_pct.toFixed(2)}%`);
      console.log(`  Cap Bound:       ${slot.cap_bound}`);
      console.log(`  Annual Fee:      ₹${slot.annual_fee_inr.toLocaleString("en-IN")}`);
    }

    // 2. Swiggy-specific merchant gated allocation
    const usage: UsageProfile = {
      merchant_share_pct: { swiggy: 100 },
      ecosystems: [],
      gate_calculator: true,
      loyalty_tiers: {},
    };
    const ctx = usageContext(usage);
    const portfolioSwiggyGated = allocatePortfolio(activeCards, spendDining, ctx, { dropFeeNegative: true });

    console.log("\n=======================================================");
    console.log("CASE B: 100% SWIGGY MERCHANT-GATED SPEND (50,000 INR / month)");
    console.log("=======================================================");
    console.log("Total Monthly Value:", portfolioSwiggyGated.monthly_value_inr);
    console.log("Total Annual Gross:", portfolioSwiggyGated.annual_value_inr);
    console.log("Total Annual Fees:", portfolioSwiggyGated.annual_fee_inr);
    console.log("Net Annual Benefit:", portfolioSwiggyGated.annual_net_inr);
    console.log("Blended Effective Rate:", ((portfolioSwiggyGated.monthly_value_inr / 50000) * 100).toFixed(2) + "%");

    for (const slot of portfolioSwiggyGated.slots) {
      console.log(`\n• Card: ${slot.card.name} (${slot.card.id})`);
      console.log(`  Spend Allocated: ₹${slot.monthly_spend_inr.toLocaleString("en-IN")}`);
      console.log(`  Monthly Reward:  ₹${slot.monthly_value_inr.toLocaleString("en-IN")}`);
      console.log(`  Effective Rate:  ${slot.effective_rate_pct.toFixed(2)}%`);
      console.log(`  Cap Bound:       ${slot.cap_bound}`);
      console.log(`  Annual Fee:      ₹${slot.annual_fee_inr.toLocaleString("en-IN")}`);
    }

    expect(portfolioGeneral.slots.length).toBeGreaterThan(1);
    expect(portfolioGeneral.monthly_value_inr).toBeGreaterThan(2000);
  });
});
