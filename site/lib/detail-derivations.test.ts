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
    // 30 pts per ₹200 at ₹0.35/pt = 5.25% — NOT 30.
    expect(pct).not.toBeNull();
    expect(pct!).toBeGreaterThan(4);
    expect(pct!).toBeLessThan(7);
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
});
