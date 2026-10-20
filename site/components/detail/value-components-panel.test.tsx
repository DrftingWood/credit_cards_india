import { describe, test, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ValueComponentsPanel, valueSummaryLine } from "./value-components-panel";
import { explainValueComponents, DEFAULT_VALUE_PREFS, type ValuePrefs } from "@/lib/value-components";
import type { SpendProfile } from "@/lib/calculator";
import type { BenefitRecord, EnrichedCard } from "@/lib/types";

const SOURCE = { url: "https://example.test", retrieved_on: "2024-01-01" };
const SPEND: SpendProfile = { online: 30000, groceries: 0, dining: 0, fuel: 0, travel: 0, utilities: 0, rent: 0, international: 0 };
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

function card(b: Partial<BenefitRecord>, fees = { joining: 1000, annual: 1000 }): EnrichedCard {
  const benefits = { effective_from: "2024-01-01", effective_until: null, ...b } as BenefitRecord;
  return {
    id: "panel-test", name: "Panel Test",
    current_fees: { effective_from: "2024-01-01", effective_until: null, joining_fee_inr: fees.joining, annual_fee_inr: fees.annual, source: SOURCE },
    current_benefits: benefits,
    computed: { fee_waiver_spend_inr: null },
  } as unknown as EnrichedCard;
}

const RICH = card({
  welcome: [
    { condition: "Spend ₹1,00,000 within 30 days", benefit: "₹2,000 voucher", value_inr: 2000, window_days: 30 },
    { condition: "Joining fee paid", benefit: "1,000 bonus points", value_inr: 250 },
    { condition: "Card issued", benefit: "Club membership", value_inr: null },
  ],
  milestones: [
    { spend_inr: 300000, cycle: "annual", benefit: "₹3,000 voucher", value_inr: 3000, trigger_window: "anniversary-year" },
    { spend_inr: 200000, cycle: "quarterly", benefit: "5,000 bonus points", value_inr: 1250, trigger_window: "rolling" },
  ],
  lounge_access: { domestic: { visits_per_cycle: 2, cycle: "quarterly", spend_threshold_inr: 50000, spend_threshold_cycle: "quarterly" } },
});

describe("ValueComponentsPanel renders every component as its own honest line", () => {
  const prefs: ValuePrefs = { ...DEFAULT_VALUE_PREFS, lounge_visits: { domestic: 4, international: 0 }, lounge_value_inr: { domestic: 1000, international: 0 } };
  const vc = explainValueComponents(RICH, SPEND, { annual_gross_inr: 9000, annual_fee_inr: 1000 }, prefs);
  const html = renderToStaticMarkup(<ValueComponentsPanel vc={vc} prefs={prefs} />);

  test("welcome: counted value, unmet spend condition, and unvalued item are all shown", () => {
    expect(html).toContain("₹2,000 voucher");
    expect(html).toMatch(/needs ₹1,00,000/i);
    expect(html).toContain("1,000 bonus points");
    expect(html).toMatch(/value not stated/i);
  });

  test("milestones: reached one shows ₹/yr, unreached one shows the per-cycle shortfall", () => {
    expect(html).toContain("₹3,000/yr");
    expect(html).toMatch(/₹1,10,000 short per quarter/);
  });

  test("lounge: allowance, unlock threshold and the user's own valuation", () => {
    expect(html).toMatch(/8 visits\/yr/);
    expect(html).toMatch(/₹50,000/);
    expect(html).toContain("₹4,000");
  });

  test("year 1, year 2+ and tenure average are separate totals", () => {
    // Steady: 9000 − 1000 + 3000 + 4000 = 15000. Year 1: 9000 − 1000 + 250 + 3000 + 4000 = 15250.
    expect(html).toContain("₹15,250");
    expect(html).toContain("₹15,000");
    expect(html).toMatch(/Year 1/);
    expect(html).toMatch(/Year 2 onward/);
  });

  test("states it is not in the ranking, and carries no emoji", () => {
    expect(html).toMatch(/not part of the ranking/i);
    expect(EMOJI.test(html)).toBe(false);
  });
});

describe("ValueComponentsPanel with no benefits on record", () => {
  test("says so plainly instead of rendering empty lists", () => {
    const vc = explainValueComponents(card({}), SPEND, { annual_gross_inr: 1000, annual_fee_inr: 0 }, DEFAULT_VALUE_PREFS);
    const html = renderToStaticMarkup(<ValueComponentsPanel vc={vc} prefs={DEFAULT_VALUE_PREFS} />);
    expect(html).toMatch(/no welcome, milestone or lounge benefit on record/i);
  });
});

describe("valueSummaryLine — the one-liner under a ranked /calculator row", () => {
  test("names year 1 and what lifts it", () => {
    const vc = explainValueComponents(RICH, SPEND, { annual_gross_inr: 9000, annual_fee_inr: 1000 }, DEFAULT_VALUE_PREFS);
    const line = valueSummaryLine(vc);
    expect(line).toMatch(/Year 1/);
    expect(line).toContain("₹250 welcome");
    expect(line).toContain("₹3,000 milestones");
  });

  test("null when there is nothing beyond spend rewards and year 1 equals steady state", () => {
    const vc = explainValueComponents(card({}, { joining: 0, annual: 0 }), SPEND, { annual_gross_inr: 1000, annual_fee_inr: 0 }, DEFAULT_VALUE_PREFS);
    expect(valueSummaryLine(vc)).toBeNull();
  });
});
