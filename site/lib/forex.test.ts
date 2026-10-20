import { describe, test, expect } from "vitest";
import { explainCard, rankCards, scoreCard, GST_ON_FOREX_MARKUP, type SpendProfile } from "./calculator";
import { DEFAULT_VALUE_PREFS } from "./value-components";
import { scoreDecoupled } from "./scorer-decoupled";
import type { RecommendPayload } from "./recommender";
import type { EnrichedCard } from "./types";

// D-26: forex markup on international spend is a ledger cost AND lowers the rank.

const SOURCE = { url: "https://example.test", retrieved_on: "2024-01-01" };
const ZERO: SpendProfile = { online: 0, groceries: 0, dining: 0, fuel: 0, travel: 0, utilities: 0, rent: 0, international: 0 };
const spend = (o: Partial<SpendProfile>): SpendProfile => ({ ...ZERO, ...o });

function makeCard(o: { id?: string; markup?: number | null; gst?: boolean; ratePer100?: number; annualFee?: number }): EnrichedCard {
  const rewards = {
    effective_from: "2024-01-01", effective_until: null, currency: "cashback",
    base: { rate: o.ratePer100 ?? 1, per_inr: 100, unit_value_inr: 1 }, accelerated: [], source: SOURCE,
  };
  const fees: Record<string, unknown> = {
    effective_from: "2024-01-01", effective_until: null, joining_fee_inr: 0, annual_fee_inr: o.annualFee ?? 0, source: SOURCE,
  };
  if (o.markup !== undefined) fees.forex_markup_pct = o.markup;
  if (o.gst !== undefined) fees.gst_applicable = o.gst;
  return {
    id: o.id ?? "fx-test", name: o.id ?? "FX Test", issuer: "test", network: "visa", tier: "mid", status: "active",
    current_fees: fees, current_rewards: rewards, current_benefits: null,
    computed: { is_active: true, is_invite_only: false, fee_waiver_spend_inr: null },
  } as unknown as EnrichedCard;
}

const INTL_10K = spend({ international: 10000 });
// ₹10,000 × 12 × 3.5% × 1.18
const COST_35 = 10000 * 12 * 0.035 * 1.18;

describe("GST assumption", () => {
  test("is one named constant, 18% (assumed, not yet verified)", () => {
    expect(GST_ON_FOREX_MARKUP).toBe(0.18);
  });
});

describe("forex cost on scoreCard / explainCard (D-26)", () => {
  test("a 3.5% card with ₹10k/mo international spend is charged 10,000 × 12 × 3.5% × 1.18", () => {
    const c = makeCard({ markup: 3.5 });
    const s = scoreCard(c, INTL_10K);
    expect(s.annual_forex_inr).toBeCloseTo(COST_35, 6);
    expect(s.annual_net_inr).toBeCloseTo(s.annual_gross_inr - s.annual_fee_effective_inr - COST_35, 6);
    const ex = explainCard(c, INTL_10K);
    expect(ex.annual_forex_inr).toBeCloseTo(COST_35, 6);
    expect(ex.annual_net_inr).toBeCloseTo(s.annual_net_inr, 6);
  });

  test("a 0% card is charged nothing", () => {
    const s = scoreCard(makeCard({ markup: 0 }), INTL_10K);
    expect(s.annual_forex_inr).toBe(0);
    expect(s.annual_net_inr).toBeCloseTo(s.annual_gross_inr, 6);
  });

  test("no international spend → no cost, whatever the markup", () => {
    const s = scoreCard(makeCard({ markup: 3.5 }), spend({ online: 20000 }));
    expect(s.annual_forex_inr).toBe(0);
    expect(s.disclaimer ?? "").not.toMatch(/forex/i);
  });

  test("gst_applicable: false → markup only, no GST", () => {
    const s = scoreCard(makeCard({ markup: 3.5, gst: false }), INTL_10K);
    expect(s.annual_forex_inr).toBeCloseTo(10000 * 12 * 0.035, 6);
  });

  test("a card with no stated markup is charged ₹0 and says so (no guessed markup)", () => {
    const s = scoreCard(makeCard({ markup: null }), INTL_10K);
    expect(s.annual_forex_inr).toBe(0);
    expect(s.disclaimer).toMatch(/Forex markup not stated, counted as ₹0/);
    expect(scoreCard(makeCard({}), INTL_10K).disclaimer).toMatch(/Forex markup not stated/);
  });

  test("the rank uses it: a 0% card beats a 3.5% card that earns slightly more for heavy international spend", () => {
    const zero = makeCard({ id: "zero-markup", markup: 0, ratePer100: 1 });
    const high = makeCard({ id: "high-markup", markup: 3.5, ratePer100: 2 });
    const sp = spend({ international: 50000 });
    // high earns 2% vs 1% (+₹6,000/yr) but pays ₹24,780/yr in markup + GST.
    expect(rankCards([high, zero], sp).map((s) => s.card.id)).toEqual(["zero-markup", "high-markup"]);
    // With no international spend the higher earner still wins.
    expect(rankCards([high, zero], spend({ online: 50000 })).map((s) => s.card.id)).toEqual(["high-markup", "zero-markup"]);
  });
});

describe("forex ledger line (D-23 ledger + D-26)", () => {
  test("Year 1, Year 2+ and the tenure average each carry a negative, labelled forex line", () => {
    const ex = explainCard(makeCard({ markup: 3.5 }), INTL_10K, undefined, DEFAULT_VALUE_PREFS);
    const vc = ex.value_components!;
    for (const l of [vc.ledger.first_year, vc.ledger.steady_state, vc.ledger.tenure_avg]) {
      const line = l.lines.find((x) => x.key === "forex");
      expect(line?.inr).toBe(-Math.round(COST_35)); // −4,956
      expect(line?.label).toMatch(/Forex markup on international spend \(3\.5% \+ 18% GST, assumed\)/);
      expect(l.lines.reduce((s, x) => s + x.inr, 0)).toBe(l.total_inr);
    }
    expect(vc.steady_state.forex_inr).toBeCloseTo(COST_35, 6);
    expect(vc.first_year.forex_inr).toBeCloseTo(COST_35, 6);
    // Year 2+ total = rewards − fee − forex, the same figure the rank uses.
    expect(vc.ledger.steady_state.total_inr).toBe(Math.round(ex.annual_net_inr));
  });

  test("no GST in the label when the card's fees are GST-exempt", () => {
    const vc = explainCard(makeCard({ markup: 2, gst: false }), INTL_10K, undefined, DEFAULT_VALUE_PREFS).value_components!;
    expect(vc.ledger.steady_state.lines.find((x) => x.key === "forex")?.label).toBe("Forex markup on international spend (2%)");
  });

  test("a 0% card, or no international spend, shows no forex line", () => {
    for (const [c, sp] of [[makeCard({ markup: 0 }), INTL_10K], [makeCard({ markup: 3.5 }), spend({ online: 10000 })]] as const) {
      const vc = explainCard(c, sp, undefined, DEFAULT_VALUE_PREFS).value_components!;
      expect(vc.ledger.steady_state.lines.some((x) => x.key === "forex")).toBe(false);
      expect(vc.ledger.first_year.lines.some((x) => x.key === "forex")).toBe(false);
    }
  });
});

describe("/recommend rank (scorer-decoupled) nets forex too", () => {
  test("net_rewards_inr = rewards − fee − forex when international spend is passed", () => {
    const payload = {
      income_band: null, goals: [], monthly_spend: { online: "0", travel: "0", dining: "0", groceries: "0", fuel: "0" },
      brand_preferences: { shopping: [], airline: null, food_ecosystem: null, fuel_station: null },
      lifestyle: { lounge_pref: null, recurring: [] },
    } as unknown as RecommendPayload;
    const c = makeCard({ markup: 3.5 });
    const [d] = scoreDecoupled([c], {}, payload, { exactSpend: { international: 10000 } });
    expect(d.net_rewards_inr).toBe(Math.round(10000 * 12 * 0.01 - COST_35));
  });
});
