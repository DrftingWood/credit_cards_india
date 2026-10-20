import { describe, test, expect } from "vitest";
import {
  explainValueComponents,
  milestoneAwardsPerCycle,
  welcomeSpendRequirement,
  DEFAULT_VALUE_PREFS,
  type ValuePrefs,
} from "./value-components";
import { explainCard, scoreCard, type SpendProfile } from "./calculator";
import type { BenefitRecord, EnrichedCard, LoyaltyProgram } from "./types";

const SOURCE = { url: "https://example.test", retrieved_on: "2024-01-01" };
const ZERO: SpendProfile = { online: 0, groceries: 0, dining: 0, fuel: 0, travel: 0, utilities: 0, rent: 0, international: 0 };
const spend = (o: Partial<SpendProfile>): SpendProfile => ({ ...ZERO, ...o });

type Milestone = NonNullable<BenefitRecord["milestones"]>[number];
type Welcome = NonNullable<BenefitRecord["welcome"]>[number];

function makeCard(o: {
  joiningFee?: number;
  annualFee?: number;
  feeWaiverSpend?: number | null;
  milestones?: Milestone[];
  welcome?: Welcome[];
  lounge?: BenefitRecord["lounge_access"];
}): EnrichedCard {
  const rewards = {
    effective_from: "2024-01-01", effective_until: null, currency: "cashback",
    base: { rate: 1, per_inr: 100, unit_value_inr: 1 }, accelerated: [], source: SOURCE,
  };
  const benefits: BenefitRecord = {
    effective_from: "2024-01-01", effective_until: null,
    milestones: o.milestones, welcome: o.welcome, lounge_access: o.lounge,
  } as BenefitRecord;
  return {
    id: "vc-test", name: "VC Test", issuer: "test", network: "visa", tier: "mid", status: "active",
    fees: [], rewards: [rewards], benefits: [benefits], eligibility: {}, metadata: { last_verified_on: "2024-01-01" },
    issuer_detail: { id: "test", name: "Test", legal_name: "Test", website: "https://t" },
    network_detail: { id: "visa", name: "Visa", tiers: [] },
    current_fees: { effective_from: "2024-01-01", effective_until: null, joining_fee_inr: o.joiningFee ?? 0, annual_fee_inr: o.annualFee ?? 0, source: SOURCE },
    current_rewards: rewards, current_benefits: benefits,
    computed: {
      is_active: true, is_invite_only: false, is_lifetime_free: false,
      has_fee_waiver: o.feeWaiverSpend != null, fee_waiver_spend_inr: o.feeWaiverSpend ?? null,
      primary_reward_currency: "cashback", headline_rate_pct: null,
      has_domestic_lounge: !!o.lounge?.domestic, has_international_lounge: !!o.lounge?.international,
      co_brand_partner: null, co_brand_category: null,
    },
  } as unknown as EnrichedCard;
}

const NO_LOUNGE_USE: ValuePrefs = DEFAULT_VALUE_PREFS;
const rewards = (gross: number, fee: number) => ({ annual_gross_inr: gross, annual_fee_inr: fee });

describe("milestoneAwardsPerCycle — trigger, repeatability, multi-award", () => {
  const m = (x: Partial<Milestone>): Milestone => ({ spend_inr: 10000, cycle: "monthly", benefit: "x", value_inr: 300, ...x });
  test("below the trigger earns nothing", () => {
    expect(milestoneAwardsPerCycle(m({}), 9999)).toBe(0);
  });
  test("at the trigger earns one award", () => {
    expect(milestoneAwardsPerCycle(m({}), 10000)).toBe(1);
  });
  test("max_awards_per_cycle > 1 scales with spend (kotak-pvr-inox: 1 ticket per ₹10k, up to 10)", () => {
    expect(milestoneAwardsPerCycle(m({ is_repeatable: true, max_awards_per_cycle: 10 }), 45000)).toBe(4);
    expect(milestoneAwardsPerCycle(m({ is_repeatable: true, max_awards_per_cycle: 10 }), 500000)).toBe(10);
  });
  test("without max_awards_per_cycle the award is once per cycle — never inferred multiples", () => {
    expect(milestoneAwardsPerCycle(m({ is_repeatable: true }), 50000)).toBe(1);
  });
  test("a zero-spend trigger (renewal perk on fee payment) is one award per cycle", () => {
    expect(milestoneAwardsPerCycle(m({ spend_inr: 0 }), 0)).toBe(1);
  });
});

describe("welcomeSpendRequirement — parses only an explicit ₹ spend condition", () => {
  test("₹ amount with commas", () => {
    expect(welcomeSpendRequirement("Spend ₹5,000 or more within 60 days of issuance")).toBe(5000);
  });
  test("Rs. prefix and lakh", () => {
    expect(welcomeSpendRequirement("Spend Rs. 1 lakh in 90 days")).toBe(100000);
  });
  test("no spend condition → null (never guessed)", () => {
    expect(welcomeSpendRequirement("Joining fee paid")).toBeNull();
    expect(welcomeSpendRequirement(undefined)).toBeNull();
  });
});

describe("explainValueComponents — welcome is year-1 only and gated by its stated spend", () => {
  const card = makeCard({
    joiningFee: 500, annualFee: 500,
    welcome: [
      { condition: "Spend ₹50,000 within 30 days", benefit: "₹1,000 voucher", value_inr: 1000, window_days: 30 },
      { condition: "Joining fee paid", benefit: "₹500 voucher", value_inr: 500 },
      { condition: "Card issued", benefit: "Membership", value_inr: null },
    ],
  });

  test("a met spend condition counts; unmet does not; unvalued is listed but adds ₹0", () => {
    const low = explainValueComponents(card, spend({ online: 10000 }), rewards(0, 500), NO_LOUNGE_USE);
    expect(low.welcome.items.map((i) => i.status)).toEqual(["not-met", "counted", "unvalued"]);
    expect(low.welcome.total_inr).toBe(500);
    const high = explainValueComponents(card, spend({ online: 60000 }), rewards(0, 500), NO_LOUNGE_USE);
    expect(high.welcome.total_inr).toBe(1500);
  });

  test("welcome is in year 1 and NOT in the steady state", () => {
    const vc = explainValueComponents(card, spend({ online: 60000 }), rewards(12000, 500), NO_LOUNGE_USE);
    expect(vc.first_year.welcome_inr).toBe(1500);
    expect(vc.steady_state.total_inr).toBe(12000 - 500);
    expect(vc.first_year.total_inr).toBe(12000 - 500 + 1500);
  });
});

describe("explainValueComponents — milestones", () => {
  test("recurring milestone counts every year when reached; first-year one only in year 1", () => {
    const card = makeCard({
      milestones: [
        { spend_inr: 300000, cycle: "annual", benefit: "₹3,000 voucher", value_inr: 3000, trigger_window: "anniversary-year" },
        { spend_inr: 100000, cycle: "annual", benefit: "Prime membership", value_inr: 1499, trigger_window: "first-year", is_repeatable: false },
      ],
    });
    const vc = explainValueComponents(card, spend({ online: 30000 }), rewards(0, 0), NO_LOUNGE_USE); // ₹3.6L/yr
    expect(vc.milestones.recurring_annual_inr).toBe(3000);
    expect(vc.milestones.first_year_only_inr).toBe(1499);
    expect(vc.steady_state.milestones_inr).toBe(3000);
    expect(vc.first_year.milestones_inr).toBe(4499);
  });

  test("an unreached milestone reports the per-cycle shortfall and adds ₹0", () => {
    const card = makeCard({
      milestones: [{ spend_inr: 100000, cycle: "quarterly", benefit: "4,000 points", value_inr: 1000, trigger_window: "rolling" }],
    });
    const vc = explainValueComponents(card, spend({ online: 20000 }), rewards(0, 0), NO_LOUNGE_USE); // ₹60k/quarter
    const item = vc.milestones.items[0];
    expect(item.status).toBe("short");
    expect(item.shortfall_inr).toBe(40000);
    expect(item.annual_value_inr).toBe(0);
  });

  test("quarterly milestone reached earns 4 awards/yr", () => {
    const card = makeCard({
      milestones: [{ spend_inr: 100000, cycle: "quarterly", benefit: "4,000 points", value_inr: 1000, trigger_window: "rolling" }],
    });
    const vc = explainValueComponents(card, spend({ online: 40000 }), rewards(0, 0), NO_LOUNGE_USE);
    expect(vc.milestones.items[0].awards_per_year).toBe(4);
    expect(vc.milestones.recurring_annual_inr).toBe(4000);
  });

  test("a renewal-fee-waiver milestone is NOT counted again — the fee waiver already nets it (no double count)", () => {
    // icici-emeralde-private-metal shape: fee waiver at ₹10L AND a milestone "Renewal-fee
    // waiver" valued at the fee, also at ₹10L.
    const card = makeCard({
      annualFee: 12499, feeWaiverSpend: 1000000,
      milestones: [{ spend_inr: 1000000, cycle: "annual", benefit: "Renewal-fee waiver + bonus points", value_inr: 12499 }],
    });
    const vc = explainValueComponents(card, spend({ online: 100000 }), rewards(12000, 0), NO_LOUNGE_USE);
    expect(vc.milestones.items[0].status).toBe("counted-in-fee");
    expect(vc.milestones.recurring_annual_inr).toBe(0);
  });

  test("reward_kind fee-waiver is always counted-in-fee", () => {
    const card = makeCard({
      milestones: [{ spend_inr: 25000, cycle: "annual", benefit: "Renewal membership fee waived", reward_kind: "fee-waiver" }],
    });
    const vc = explainValueComponents(card, spend({ online: 5000 }), rewards(0, 0), NO_LOUNGE_USE);
    expect(vc.milestones.items[0].status).toBe("counted-in-fee");
  });

  test("an unvalued milestone is listed, reached-ness reported, ₹0 added", () => {
    const card = makeCard({ milestones: [{ spend_inr: 100000, cycle: "annual", benefit: "Tier upgrade", value_inr: null }] });
    const vc = explainValueComponents(card, spend({ online: 50000 }), rewards(0, 0), NO_LOUNGE_USE);
    expect(vc.milestones.items[0].status).toBe("unvalued");
    expect(vc.milestones.items[0].reached).toBe(true);
    expect(vc.milestones.recurring_annual_inr).toBe(0);
  });

  test("an implausibly large award is flagged, not clipped (D19: warn, don't fudge)", () => {
    const card = makeCard({ milestones: [{ spend_inr: 100000, cycle: "annual", benefit: "₹50,000 voucher", value_inr: 50000 }] });
    const vc = explainValueComponents(card, spend({ online: 10000 }), rewards(0, 0), NO_LOUNGE_USE);
    expect(vc.milestones.items[0].implausible).toBe(true);
    expect(vc.milestones.recurring_annual_inr).toBe(50000);
    expect(vc.flags.join(" ")).toMatch(/implausibl/i);
  });
});

describe("explainValueComponents — lounge is valued only from the user's own usage input", () => {
  const card = makeCard({
    lounge: {
      domestic: { visits_per_cycle: 2, cycle: "quarterly", spend_threshold_inr: 50000, spend_threshold_cycle: "quarterly" },
      international: { visits_per_cycle: "unlimited", cycle: "annual" },
    },
  });

  test("default prefs (no usage entered) → allowance shown, ₹0 valued — no invented per-visit price", () => {
    const vc = explainValueComponents(card, spend({ online: 30000 }), rewards(0, 0), NO_LOUNGE_USE);
    expect(vc.lounge.items.find((i) => i.scope === "domestic")!.allowance_per_year).toBe(8);
    expect(vc.lounge.items.find((i) => i.scope === "international")!.allowance_per_year).toBe("unlimited");
    expect(vc.lounge.annual_inr).toBe(0);
  });

  test("usage is capped at the allowance and priced at the user's own per-visit value", () => {
    const prefs: ValuePrefs = { ...DEFAULT_VALUE_PREFS, lounge_visits: { domestic: 12, international: 3 }, lounge_value_inr: { domestic: 1000, international: 2500 } };
    const vc = explainValueComponents(card, spend({ online: 30000 }), rewards(0, 0), prefs); // ₹90k/quarter clears ₹50k
    const dom = vc.lounge.items.find((i) => i.scope === "domestic")!;
    expect(dom.unlocked).toBe(true);
    expect(dom.used_visits).toBe(8);
    expect(dom.value_inr).toBe(8000);
    expect(vc.lounge.items.find((i) => i.scope === "international")!.value_inr).toBe(7500);
    expect(vc.lounge.annual_inr).toBe(15500);
    expect(vc.steady_state.lounge_inr).toBe(15500);
  });

  test("a spend-gated allowance stays locked below its threshold", () => {
    const prefs: ValuePrefs = { ...DEFAULT_VALUE_PREFS, lounge_visits: { domestic: 4, international: 0 }, lounge_value_inr: { domestic: 1000, international: 0 } };
    const vc = explainValueComponents(card, spend({ online: 10000 }), rewards(0, 0), prefs); // ₹30k/quarter < ₹50k
    const dom = vc.lounge.items.find((i) => i.scope === "domestic")!;
    expect(dom.unlocked).toBe(false);
    expect(dom.value_inr).toBe(0);
  });

  test("access with no stated visit count is listed but never valued", () => {
    const c = makeCard({ lounge: { domestic: { spend_threshold_inr: 50000, spend_threshold_cycle: "quarterly" } } });
    const prefs: ValuePrefs = { ...DEFAULT_VALUE_PREFS, lounge_visits: { domestic: 4, international: 0 }, lounge_value_inr: { domestic: 1000, international: 0 } };
    const vc = explainValueComponents(c, spend({ online: 30000 }), rewards(0, 0), prefs);
    expect(vc.lounge.items[0].allowance_per_year).toBeNull();
    expect(vc.lounge.items[0].value_inr).toBe(0);
  });
});

describe("explainValueComponents — year 1 vs steady state vs tenure", () => {
  test("year 1 pays the joining fee; renewal years pay the (waiver-aware) annual fee", () => {
    const card = makeCard({ joiningFee: 1000, annualFee: 2500 });
    const vc = explainValueComponents(card, spend({ online: 10000 }), rewards(10000, 2500), NO_LOUNGE_USE);
    expect(vc.first_year.fee_inr).toBe(1000);
    expect(vc.first_year.total_inr).toBe(9000);
    expect(vc.steady_state.total_inr).toBe(7500);
  });

  test("tenure average spreads the one-offs across the years held", () => {
    const card = makeCard({ welcome: [{ benefit: "₹3,000 voucher", value_inr: 3000 }] });
    const prefs: ValuePrefs = { ...DEFAULT_VALUE_PREFS, tenure_years: 3 };
    const vc = explainValueComponents(card, spend({ online: 10000 }), rewards(6000, 0), prefs);
    expect(vc.first_year.total_inr).toBe(9000);
    expect(vc.steady_state.total_inr).toBe(6000);
    expect(vc.tenure_avg_annual_inr).toBe(7000); // (9000 + 2×6000) / 3
  });
});

describe("explainCard attaches value components only when asked, and never moves the steady-state total", () => {
  const card = makeCard({
    annualFee: 500,
    welcome: [{ benefit: "₹2,000 voucher", value_inr: 2000 }],
    milestones: [{ spend_inr: 100000, cycle: "annual", benefit: "₹1,000 voucher", value_inr: 1000 }],
  });
  const sp = spend({ online: 20000 });

  test("no prefs → no value_components (Phase 1 shape unchanged)", () => {
    expect(explainCard(card, sp, { valueBasis: "realized" }).value_components).toBeUndefined();
  });

  test("with prefs → components present; annual_net still equals scoreCard's rank total", () => {
    const ex = explainCard(card, sp, { valueBasis: "realized" }, DEFAULT_VALUE_PREFS);
    expect(ex.value_components).toBeDefined();
    expect(ex.annual_net_inr).toBe(scoreCard(card, sp, { valueBasis: "realized" }).annual_net_inr);
    expect(ex.value_components!.steady_state.rewards_net_inr).toBe(ex.annual_net_inr);
    expect(ex.value_components!.first_year.welcome_inr).toBe(2000);
    expect(ex.value_components!.steady_state.milestones_inr).toBe(1000);
  });
});

describe("value components on live data", () => {
  async function load() {
    const { default: cards } = await import("../../dist/cards.json", { with: { type: "json" } });
    const { default: progs } = await import("../../dist/loyalty_programs.json", { with: { type: "json" } });
    return {
      cards: cards as unknown as EnrichedCard[],
      programs: Object.fromEntries((progs as unknown as LoyaltyProgram[]).map((p) => [p.id, p])),
    };
  }

  test("every active card produces finite, non-negative components for a heavy profile", async () => {
    const { cards } = await load();
    const heavy = spend({ online: 80000, groceries: 20000, dining: 20000, travel: 50000, utilities: 10000 });
    const prefs: ValuePrefs = { ...DEFAULT_VALUE_PREFS, lounge_visits: { domestic: 6, international: 2 }, lounge_value_inr: { domestic: 1200, international: 2500 } };
    for (const c of cards.filter((x) => x.computed.is_active && x.current_rewards)) {
      const vc = explainValueComponents(c, heavy, rewards(10000, c.current_fees?.annual_fee_inr ?? 0), prefs);
      for (const n of [vc.welcome.total_inr, vc.milestones.recurring_annual_inr, vc.milestones.first_year_only_inr, vc.lounge.annual_inr]) {
        expect(Number.isFinite(n), c.id).toBe(true);
        expect(n, c.id).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test("kotak-pvr-inox's per-₹10k ticket milestone scales with spend (max_awards_per_cycle honoured)", async () => {
    const { cards } = await load();
    const c = cards.find((x) => x.id === "kotak-pvr-inox");
    if (!c) return; // card removed from dataset — nothing to lock
    const m = c.current_benefits?.milestones?.find((x) => (x.max_awards_per_cycle ?? 0) > 1);
    if (!m) return;
    const vc = explainValueComponents(c, spend({ online: 50000 }), rewards(0, 0), DEFAULT_VALUE_PREFS);
    const item = vc.milestones.items.find((i) => i.benefit === m.benefit)!;
    expect(item.awards_per_year).toBe(12 * Math.min(m.max_awards_per_cycle!, Math.floor(50000 / m.spend_inr)));
  });
});
