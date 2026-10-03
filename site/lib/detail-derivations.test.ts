import { describe, test, expect } from "vitest";
import { bestAcceleratedPct, feeClause, formatAcceleratedRate, productDetails, summaryProse } from "./detail-derivations";
import type { EnrichedCard } from "./types";

// These functions feed the listing tile, the compare table and the SEO meta
// description. Before the 2026-06 fix all three rendered the raw `effective_rate`
// as a percent (Axis Reserve "45% on dining"). Lock the units-correct behaviour.
describe("accelerator presentation helpers — units-correct, not raw effective_rate", () => {
  test("bestAcceleratedPct converts points/₹N through unit value (Reserve-shaped)", async () => {
    const { default: cards } = await import("../../dist/cards.json", { with: { type: "json" } });
    const reserve = (cards as unknown as EnrichedCard[]).find((c) => c.id === "axis-reserve")!;
    const pct = bestAcceleratedPct(reserve);
    // 30 pts per ₹200 at ₹0.18/pt realized (EDGE Reward Points, uniform 2026-07) = 2.7% — NOT 30.
    expect(pct).not.toBeNull();
    expect(pct!).toBeGreaterThan(2);
    expect(pct!).toBeLessThan(4);
  });

  test("formatAcceleratedRate shows receipt-visible points rate, not a percent, for points cards", async () => {
    const { default: cards } = await import("../../dist/cards.json", { with: { type: "json" } });
    const reserve = (cards as unknown as EnrichedCard[]).find((c) => c.id === "axis-reserve")!;
    const top = reserve.current_rewards!.accelerated![0];
    const label = formatAcceleratedRate(top, reserve.current_rewards);
    expect(label).toMatch(/per ₹/);
    expect(label).not.toBe("30%");
  });

  test("cashback cards still read as a plain percent", async () => {
    const { default: cards } = await import("../../dist/cards.json", { with: { type: "json" } });
    const cb = (cards as unknown as EnrichedCard[]).find((c) => c.id === "sbi-cashback")!;
    const top = cb.current_rewards!.accelerated![0];
    expect(formatAcceleratedRate(top, cb.current_rewards)).toBe("5%");
  });

  test("formatAcceleratedRate never renders Infinity when per_inr is 0 (rate-math guard)", () => {
    // A `per_inr: 0` YAML typo must not produce "Infinity%" on tiles/compare/SEO.
    // pointsToPct guards per_inr <= 0 by returning 0; the cashback branch must
    // go through the same primitive instead of ad-hoc division.
    const rewards = {
      currency: "cashback",
      base: { rate: 1, per_inr: 0 },
    } as unknown as EnrichedCard["current_rewards"];
    const label = formatAcceleratedRate(
      { category: "online", effective_rate: 5 } as never,
      rewards,
    );
    expect(label).not.toMatch(/Infinity|NaN/);
  });
});

describe("detail-page fee prose and point valuation", () => {
  async function card(id: string) {
    const { default: cards } = await import("../../dist/cards.json", { with: { type: "json" } });
    return (cards as unknown as EnrichedCard[]).find((c) => c.id === id)!;
  }

  test("a card with a joining fee and no annual fee is not called lifetime free", async () => {
    const mmt = await card("icici-mmt-platinum"); // joining ₹500, annual ₹0
    expect(feeClause(mmt)).toBe("a joining fee of ₹500 + GST and no annual fee");
    expect(productDetails(mmt).join(" ")).not.toMatch(/lifetime free/i);
    expect(summaryProse(mmt)[0]).toContain("a joining fee of ₹500 + GST and no annual fee");
  });

  test("the annual fee is no longer labelled the joining fee", async () => {
    const irctc = await card("bob-irctc"); // joining ₹500, annual ₹350
    expect(feeClause(irctc)).toBe("a joining fee of ₹500 and an annual fee of ₹350 + GST");
  });

  test("accelerators on a loyalty-programme card are valued at the programme's realized value", async () => {
    // bob-irctc's base record says ₹0.18/pt, but its IRCTC programme (which the
    // calculator and the listing badge use) realizes ₹0.95/pt.
    const irctc = await card("bob-irctc");
    expect(irctc.computed.program_unit_value_inr).toBe(0.95);
    const withProgramme = bestAcceleratedPct(irctc)!;
    const baseOnly = bestAcceleratedPct({ ...irctc, computed: { ...irctc.computed, program_unit_value_inr: null } })!;
    expect(withProgramme / baseOnly).toBeCloseTo(0.95 / 0.18, 5);
  });
});
