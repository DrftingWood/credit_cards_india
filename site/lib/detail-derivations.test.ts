import { describe, test, expect } from "vitest";
import { bestAcceleratedPct, derivePros, formatAcceleratedRate, productDetails, summaryProse } from "./detail-derivations";
import type { EnrichedCard } from "./types";

// These functions feed the listing tile, the compare table and the SEO meta
// description. Before the 2026-06 fix all three rendered the raw `effective_rate`
// as a percent (Axis Reserve "45% on dining"). Lock the units-correct behaviour.
describe("accelerator presentation helpers — units-correct, not raw effective_rate", () => {
  test("bestAcceleratedPct converts points/₹N through unit value (Reserve-shaped)", async () => {
    const { default: cards } = await import("../../dist/cards.json", { with: { type: "json" } });
    const reserve = (cards as unknown as EnrichedCard[]).find((c) => c.id === "axis-reserve")!;
    const pct = bestAcceleratedPct(reserve);
    // The 2026-10 issuer-verified catalogue removed Reserve's point value ("No universal point
    // redemption value is published"), so there is no percent to show. The point is that the raw
    // 30 (points per ₹200) is never presented as 30%.
    expect(pct === null || pct < 4).toBe(true);
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

describe("card-page text does not state what the record does not say", () => {
  async function card(id: string) {
    const { default: cards } = await import("../../dist/cards.json", { with: { type: "json" } });
    return structuredClone((cards as unknown as EnrichedCard[]).find((c) => c.id === id)!);
  }
  const text = (c: EnrichedCard) => [...summaryProse(c), ...productDetails(c), ...derivePros(c)].join(" ");

  test("a lounge record with zero visits is not described as lounge access", async () => {
    // The build's has_*_lounge flags already treat visits_per_cycle: 0 as no lounge; the page
    // text tested only that the object existed and printed "0 annual international".
    const c = await card("sbi-cashback");
    (c as { current_benefits: unknown }).current_benefits = { lounge_access: { international: { visits_per_cycle: 0, cycle: "annual" } } };
    c.computed = { ...c.computed, has_domestic_lounge: false, has_international_lounge: false };
    expect(text(c)).not.toMatch(/lounge/i);

    (c as { current_benefits: unknown }).current_benefits = { lounge_access: { domestic: { visits_per_cycle: 4, cycle: "annual" }, international: { visits_per_cycle: 0, cycle: "annual" } } };
    c.computed = { ...c.computed, has_domestic_lounge: true };
    expect(text(c)).toMatch(/domestic/);
    expect(text(c)).not.toMatch(/international/i);
  });

  test.each([
    [0, /with no annual fee\./],
    [999, /with an annual fee of ₹999 \+ GST\./],
    [null, /credit card from [^,]+\.$/],
  ])("annual fee %s is worded as what it is", async (fee, expected) => {
    const c = await card("sbi-cashback");
    (c.current_fees as { annual_fee_inr: number | null }).annual_fee_inr = fee;
    expect(summaryProse(c)[0]).toMatch(expected);
    expect(summaryProse(c)[0]).not.toMatch(/joining fee|₹0 \+ GST/);
  });

  test("a waiver with no stated spend threshold does not print a blank amount", async () => {
    const c = await card("sbi-cashback");
    c.computed = { ...c.computed, has_fee_waiver: true, fee_waiver_spend_inr: null };
    expect(derivePros(c).join(" ")).not.toMatch(/waivable on — spend|waivable on\s+spend/);
  });
});
