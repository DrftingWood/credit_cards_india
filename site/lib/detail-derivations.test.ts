import { describe, test, expect } from "vitest";
import { bestAcceleratedPct, formatAcceleratedRate } from "./detail-derivations";
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
