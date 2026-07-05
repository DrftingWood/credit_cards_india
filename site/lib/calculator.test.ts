import { describe, test, expect } from "vitest";
import { scoreCard, explainCard, type SpendProfile, type ScoringContext } from "./calculator";
import { pickTopAccelerated } from "./detail-derivations";
import type {
  EnrichedCard,
  RewardRecord,
  AcceleratedReward,
  RewardCurrency,
} from "./types";
import type { CanonicalCategory } from "./category-mapping";

const SOURCE = { url: "https://example.test", retrieved_on: "2024-01-01" };

const ZERO_SPEND: SpendProfile = {
  online: 0,
  groceries: 0,
  dining: 0,
  fuel: 0,
  travel: 0,
  utilities: 0,
  rent: 0,
  international: 0,
};

function spend(overrides: Partial<Record<CanonicalCategory, number>>): SpendProfile {
  return { ...ZERO_SPEND, ...overrides };
}

type CapUnit = "points" | "cashback-inr" | "miles" | "spend-inr";
type Cycle = "monthly" | "quarterly" | "annual" | "statement" | "per-txn";

interface CardOpts {
  id?: string;
  currency?: RewardCurrency;
  base: {
    rate: number;
    per_inr: number;
    unit_value_inr?: number;
    unit_value_inr_realized?: number;
    cap_per_cycle?: number;
    cap_unit?: CapUnit;
    cycle?: Cycle;
  };
  accelerated?: AcceleratedReward[];
  exclusions?: string[];
  mcc_exclusions?: string[];
  rewardCap?: { max_units: number; cap_unit?: CapUnit; cycle: Cycle };
  annualFee?: number;
  feeWaiverSpend?: number | null;
  isInviteOnly?: boolean;
}

function makeCard(opts: CardOpts): EnrichedCard {
  const rewards: RewardRecord = {
    effective_from: "2024-01-01",
    effective_until: null,
    currency: opts.currency ?? "cashback",
    base: {
      rate: opts.base.rate,
      per_inr: opts.base.per_inr,
      ...(opts.base.unit_value_inr != null
        ? { unit_value_inr: opts.base.unit_value_inr }
        : {}),
      ...(opts.base.unit_value_inr_realized != null
        ? { unit_value_inr_realized: opts.base.unit_value_inr_realized }
        : {}),
      ...(opts.base.cap_per_cycle != null ? { cap_per_cycle: opts.base.cap_per_cycle } : {}),
      ...(opts.base.cap_unit != null ? { cap_unit: opts.base.cap_unit } : {}),
      ...(opts.base.cycle != null ? { cycle: opts.base.cycle } : {}),
    },
    accelerated: opts.accelerated ?? [],
    ...(opts.exclusions ? { exclusions: opts.exclusions } : {}),
    ...(opts.mcc_exclusions ? { mcc_exclusions: opts.mcc_exclusions } : {}),
    ...(opts.rewardCap ? { reward_cap: opts.rewardCap } : {}),
    source: SOURCE,
  } as RewardRecord;

  const card = {
    id: opts.id ?? "test-card",
    name: "Test Card",
    issuer: "test",
    network: "visa",
    tier: "mid",
    status: "active",
    fees: [],
    rewards: [rewards],
    benefits: [],
    eligibility: {},
    metadata: { last_verified_on: "2024-01-01" },
    issuer_detail: { id: "test", name: "Test Bank", legal_name: "Test Bank Ltd", website: "https://test" },
    network_detail: { id: "visa", name: "Visa", tiers: [] },
    current_fees: {
      effective_from: "2024-01-01",
      effective_until: null,
      joining_fee_inr: 0,
      annual_fee_inr: opts.annualFee ?? 0,
      source: SOURCE,
    },
    current_rewards: rewards,
    current_benefits: null,
    computed: {
      is_active: true,
      is_invite_only: opts.isInviteOnly ?? false,
      is_lifetime_free: (opts.annualFee ?? 0) === 0,
      has_fee_waiver: opts.feeWaiverSpend != null,
      fee_waiver_spend_inr: opts.feeWaiverSpend ?? null,
      primary_reward_currency: opts.currency ?? "cashback",
      headline_rate_pct: null,
      has_domestic_lounge: false,
      has_international_lounge: false,
      co_brand_partner: null,
      co_brand_category: null,
    },
  };
  return card as unknown as EnrichedCard;
}

describe("scoreCard — cap_unit branching (blocker #1)", () => {
  test("cap_unit: 'spend-inr' caps using rate, not unit value", () => {
    // 5% on online with a ₹50k/mo spend cap. Spending ₹100k/mo means cap bites.
    // Expected monthly value: min(100000 * 5%, 50000 * 5%) = 2500. Annual: 30000.
    // The previous code's `unitValue != null` branch fired first, multiplying
    // 50000 * unit_value (e.g. 0.25) = 12500 capMonthlyInr, then min'd against
    // 5000 actual earn → wrong note but right cap by coincidence at this rate.
    // The bug is most visible when the spend cap > earn at that spend:
    // here capMonthlyInr should be 2500 (the rate-applied cap), not 50000 * uv.
    const card = makeCard({
      currency: "cashback",
      base: { rate: 0, per_inr: 100, unit_value_inr: 1 },
      accelerated: [
        {
          category: "online",
          canonical_categories: ["online"],
          multiplier: 0,
          effective_rate: 5,
          cap_per_cycle: 50000,
          cap_unit: "spend-inr",
          cycle: "monthly",
        },
      ],
    });
    const score = scoreCard(card, spend({ online: 100000 }));
    expect(score.annual_gross_inr).toBe(30000); // 2500 * 12
    expect(score.buckets[0].note).toMatch(/Capped at ₹2,500/);
  });

  test("cap_unit: 'cashback-inr' caps in INR directly", () => {
    const card = makeCard({
      currency: "cashback",
      base: { rate: 0, per_inr: 100, unit_value_inr: 1 },
      accelerated: [
        {
          category: "dining",
          canonical_categories: ["dining"],
          multiplier: 0,
          effective_rate: 10,
          cap_per_cycle: 500,
          cap_unit: "cashback-inr",
          cycle: "monthly",
        },
      ],
    });
    // 10% on ₹20k/mo dining = ₹2000 uncapped, capped at ₹500 → annual 6000.
    const score = scoreCard(card, spend({ dining: 20000 }));
    expect(score.annual_gross_inr).toBe(6000);
    expect(score.buckets[0].note).toMatch(/Capped at ₹500/);
  });

  test("cap_unit: 'points' (default) converts cap via unit value", () => {
    const card = makeCard({
      currency: "points",
      base: { rate: 1, per_inr: 100, unit_value_inr: 0.25 },
      accelerated: [
        {
          category: "groceries",
          canonical_categories: ["groceries"],
          multiplier: 5,
          cap_per_cycle: 1000, // 1000 points/mo cap
          // cap_unit omitted → schema default "points"
          cycle: "monthly",
        },
      ],
    });
    // 5x of base (1 point per ₹100 worth ₹0.25 → 0.25% base; 5x = 1.25%).
    // Spending ₹50k/mo → uncapped ₹625, but cap is 1000 points * 0.25 = ₹250/mo,
    // which covers the first ₹20k of spend. The remaining ₹30k earns base
    // 0.25% = ₹75/mo (over-cap spend falls back to base, not zero — E2 fix).
    // Annual: (250 + 75) * 12 = 3900.
    const score = scoreCard(card, spend({ groceries: 50000 }));
    expect(score.annual_gross_inr).toBe(3900);
    expect(score.buckets[0].note).toMatch(/Capped at ₹250/);
  });

  test("quarterly cap windows down to monthly third", () => {
    const card = makeCard({
      currency: "cashback",
      base: { rate: 0, per_inr: 100, unit_value_inr: 1 },
      accelerated: [
        {
          category: "fuel",
          canonical_categories: ["fuel"],
          multiplier: 0,
          effective_rate: 5,
          cap_per_cycle: 1500,
          cap_unit: "cashback-inr",
          cycle: "quarterly",
        },
      ],
    });
    // 1500/quarter → 500/mo cap. 5% on ₹15k/mo fuel = ₹750 uncapped, capped at 500. Annual = 6000.
    const score = scoreCard(card, spend({ fuel: 15000 }));
    expect(score.annual_gross_inr).toBe(6000);
    expect(score.buckets[0].note).toMatch(/Capped at ₹500/);
  });
});

describe("scoreCard — cap semantics across engines (E2 divergence fixes)", () => {
  test("spend above an accelerator's cap earns the base rate, not zero", () => {
    // Real cards keep earning base on spend beyond the accelerator cap —
    // engine_v2.py already models this; the calculator credited zero.
    const card = makeCard({
      currency: "cashback",
      base: { rate: 1, per_inr: 100, unit_value_inr: 1 }, // 1% base
      accelerated: [
        {
          category: "dining",
          canonical_categories: ["dining"],
          multiplier: 0,
          effective_rate: 10,
          cap_per_cycle: 500,
          cap_unit: "cashback-inr",
          cycle: "monthly",
        },
      ],
    });
    // ₹50k dining at 10%: cap ₹500 covers the first ₹5k of spend; the
    // remaining ₹45k earns base 1% = ₹450. Monthly = 950, annual = 11,400.
    const score = scoreCard(card, spend({ dining: 50000 }));
    expect(score.annual_gross_inr).toBe(11400);
    expect(score.buckets[0].note).toMatch(/Capped at ₹500/);
  });

  test("an accelerator's cap is one shared pool across buckets, not granted per bucket", () => {
    const card = makeCard({
      currency: "cashback",
      base: { rate: 0, per_inr: 100, unit_value_inr: 1 },
      accelerated: [
        {
          category: "dining-and-online",
          canonical_categories: ["dining", "online"],
          multiplier: 0,
          effective_rate: 10,
          cap_per_cycle: 500,
          cap_unit: "cashback-inr",
          cycle: "monthly",
        },
      ],
    });
    // ₹10k dining + ₹10k online at 10% is ₹2,000 gross, but the ₹500/mo cap
    // is a single pool shared by every bucket the accelerator covers.
    const score = scoreCard(card, spend({ dining: 10000, online: 10000 }));
    expect(score.annual_gross_inr).toBe(6000); // 500 × 12, not 1000 × 12
  });

  test("cap_unit: 'miles' converts via unit value like points", () => {
    const card = makeCard({
      currency: "miles",
      base: { rate: 0, per_inr: 100, unit_value_inr: 0.5 },
      accelerated: [
        {
          category: "travel",
          canonical_categories: ["travel"],
          multiplier: 0,
          effective_rate: 4, // 4 miles/₹100 at ₹0.5 = 2%
          cap_per_cycle: 1000, // 1000 miles = ₹500/mo
          cap_unit: "miles",
          cycle: "monthly",
        },
      ],
    });
    // ₹50k travel at 2% = ₹1,000 gross, capped at ₹500. Base 0 over cap.
    const score = scoreCard(card, spend({ travel: 50000 }));
    expect(score.annual_gross_inr).toBe(6000);
  });

  test("annual cap cycle windows down to a twelfth", () => {
    const card = makeCard({
      currency: "cashback",
      base: { rate: 0, per_inr: 100, unit_value_inr: 1 },
      accelerated: [
        {
          category: "utilities",
          canonical_categories: ["utilities"],
          multiplier: 0,
          effective_rate: 5,
          cap_per_cycle: 6000, // ₹6,000/year = ₹500/mo
          cap_unit: "cashback-inr",
          cycle: "annual",
        },
      ],
    });
    // 5% on ₹15k/mo = ₹750 gross, capped at ₹500/mo. Annual = 6,000.
    const score = scoreCard(card, spend({ utilities: 15000 }));
    expect(score.annual_gross_inr).toBe(6000);
  });

  test("cap_per_cycle: 'unlimited' string means uncapped", () => {
    const card = makeCard({
      currency: "cashback",
      base: { rate: 0, per_inr: 100, unit_value_inr: 1 },
      accelerated: [
        {
          category: "online",
          canonical_categories: ["online"],
          multiplier: 0,
          effective_rate: 5,
          cap_per_cycle: "unlimited" as never,
          cycle: "monthly",
        },
      ],
    });
    const score = scoreCard(card, spend({ online: 100000 }));
    expect(score.annual_gross_inr).toBe(60000); // 5% × ₹100k × 12, no cap
  });

  test("per-txn cap cycle is approximated as monthly (documented, locked)", () => {
    const card = makeCard({
      currency: "cashback",
      base: { rate: 0, per_inr: 100, unit_value_inr: 1 },
      accelerated: [
        {
          category: "groceries",
          canonical_categories: ["groceries"],
          multiplier: 0,
          effective_rate: 5,
          cap_per_cycle: 500,
          cap_unit: "cashback-inr",
          cycle: "per-txn" as never,
        },
      ],
    });
    // per-txn caps can't be modelled without a transaction-size distribution;
    // the documented approximation treats the cap as monthly. 5% of ₹20k =
    // ₹1,000 gross, capped at ₹500/mo → ₹6,000/yr.
    const score = scoreCard(card, spend({ groceries: 20000 }));
    expect(score.annual_gross_inr).toBe(6000);
  });

  test("base cap authored in points units converts through unit value", () => {
    const card = makeCard({
      currency: "points",
      base: {
        rate: 2, per_inr: 100, unit_value_inr: 0.25, // 0.5% base
        cap_per_cycle: 1000, cap_unit: "points", cycle: "monthly", // ₹250/mo
      },
    });
    // 0.5% on ₹100k = ₹500 base, clamped to 1000 pts × ₹0.25 = ₹250/mo.
    const score = scoreCard(card, spend({ online: 100000 }));
    expect(score.annual_gross_inr).toBe(3000);
  });

  test("points-unit cap on a cashback card without explicit unit_value_inr still binds (₹1/unit)", () => {
    // The rate path already treats cashback units as ₹1 when unit_value_inr is
    // absent; the cap conversion must use the same fallback — otherwise the
    // accelerated earn is credited but its cap silently vanishes.
    const card = makeCard({
      currency: "cashback",
      base: { rate: 0, per_inr: 100 }, // no unit_value_inr on purpose
      accelerated: [
        {
          category: "dining",
          canonical_categories: ["dining"],
          multiplier: 0,
          effective_rate: 10,
          cap_per_cycle: 500, // 500 cashback units = ₹500/mo
          // cap_unit omitted → schema default "points" (units of the currency)
          cycle: "monthly",
        },
      ],
    });
    // 10% on ₹20k = ₹2,000 gross, capped at ₹500. Annual = 6,000.
    const score = scoreCard(card, spend({ dining: 20000 }));
    expect(score.annual_gross_inr).toBe(6000);
  });
});

describe("scoreCard — per_inr=0 guards (blocker #3)", () => {
  test("base.per_inr === 0 does not produce Infinity", () => {
    const card = makeCard({
      currency: "points",
      base: { rate: 1, per_inr: 0, unit_value_inr: 0.25 },
    });
    const score = scoreCard(card, spend({ dining: 10000 }));
    expect(Number.isFinite(score.annual_gross_inr)).toBe(true);
    expect(score.annual_gross_inr).toBe(0);
  });

  test("base.per_inr === -1 does not produce negative-infinity ranking", () => {
    const card = makeCard({
      currency: "points",
      base: { rate: 1, per_inr: -1, unit_value_inr: 0.25 },
    });
    const score = scoreCard(card, spend({ dining: 10000 }));
    expect(Number.isFinite(score.annual_gross_inr)).toBe(true);
    expect(score.annual_gross_inr).toBe(0);
  });
});

describe("scoreCard — effective_rate not collapsed by unit_value (B3-BL4)", () => {
  test("effective_rate=5 (pts/₹100 at ₹0.25/pt) values to 1.25% with a points cap", () => {
    const card = makeCard({
      currency: "points",
      base: { rate: 1, per_inr: 100, unit_value_inr: 0.25 },
      accelerated: [
        {
          category: "online",
          canonical_categories: ["online"],
          multiplier: 0,
          effective_rate: 5,
          cap_per_cycle: 10000, // 10,000 points/mo cap
          cap_unit: "points",
          cycle: "monthly",
        },
      ],
    });
    // effective_rate is receipt-visible units: 5 pts/₹100 × ₹0.25/pt = 1.25%.
    // ₹20k/mo → ₹250/mo. Cap = 10000 points × 0.25 = ₹2500/mo (doesn't bite).
    // Annual: ₹3000. (An earlier regression read 5 as "5%" → ₹12000/yr.)
    const score = scoreCard(card, spend({ online: 20000 }));
    expect(score.annual_gross_inr).toBe(3000);
  });
});

describe("scoreCard — cap-aware accelerator selection (B3-SF2)", () => {
  test("uncapped 5% beats capped 10% when user spend exceeds the cap break-even", () => {
    const card = makeCard({
      currency: "cashback",
      base: { rate: 0, per_inr: 100, unit_value_inr: 1 },
      accelerated: [
        {
          category: "dining",
          canonical_categories: ["dining"],
          multiplier: 0,
          effective_rate: 10,
          cap_per_cycle: 500, // 10% capped at ₹500/mo
          cap_unit: "cashback-inr",
          cycle: "monthly",
        },
        {
          category: "dining-uncapped",
          canonical_categories: ["dining"],
          multiplier: 0,
          effective_rate: 5,
          // no cap
          cycle: "monthly",
        },
      ],
    });
    // At ₹50k/mo: capped-10% = min(5000, 500) = ₹500. Uncapped-5% = ₹2500.
    // Uncapped should win. Pre-fix: selection by rate_pct picked the 10% candidate
    // first and only then min'd at ₹500, returning ₹6000/yr instead of ₹30k/yr.
    const score = scoreCard(card, spend({ dining: 50000 }));
    expect(score.annual_gross_inr).toBe(30000);
    // basis should be the uncapped one ("general"; both happen to be general here).
    expect(score.buckets[0].effective_rate_pct).toBe(5);
  });

  test("capped-10% wins when user spend is low enough that the cap doesn't bite", () => {
    const card = makeCard({
      currency: "cashback",
      base: { rate: 0, per_inr: 100, unit_value_inr: 1 },
      accelerated: [
        {
          category: "dining",
          canonical_categories: ["dining"],
          multiplier: 0,
          effective_rate: 10,
          cap_per_cycle: 500,
          cap_unit: "cashback-inr",
          cycle: "monthly",
        },
        {
          category: "dining-uncapped",
          canonical_categories: ["dining"],
          multiplier: 0,
          effective_rate: 5,
          cycle: "monthly",
        },
      ],
    });
    // At ₹3k/mo: capped-10% = min(300, 500) = ₹300. Uncapped-5% = ₹150.
    // Capped should win.
    const score = scoreCard(card, spend({ dining: 3000 }));
    expect(score.annual_gross_inr).toBe(3600);
    expect(score.buckets[0].effective_rate_pct).toBe(10);
  });
});

describe("scoreCard — base rate unit correctness (bonus blocker)", () => {
  test("real card: SBI Cashback @ ₹20k/mo dining (1% base, no accelerator on dining) ≈ ₹2.4k/yr", async () => {
    const { default: cards } = await import("../../dist/cards.json", { with: { type: "json" } });
    const sbi = (cards as unknown as EnrichedCard[]).find((c) => c.id === "sbi-cashback")!;
    const score = scoreCard(sbi, spend({ dining: 20000 }));
    expect(score.annual_gross_inr).toBe(2400); // 1% * 20000 * 12
  });

  test("real card: Swiggy HDFC optimal spend hits all caps at ₹42k/yr", async () => {
    const { default: cards } = await import("../../dist/cards.json", { with: { type: "json" } });
    const swiggy = (cards as unknown as EnrichedCard[]).find((c) => c.id === "hdfc-swiggy-hdfc")!;
    // dining 10% cap ₹1500 (at ₹15k) + online 5% cap ₹1500 (at ₹30k) + base 1% on
    // groceries capped ₹500 (at ₹50k) = ₹3500/mo → ₹42,000/yr.
    const score = scoreCard(swiggy, spend({ dining: 15000, online: 30000, groceries: 50000 }));
    expect(score.annual_gross_inr).toBe(42000);
  });

  test("real card: Swiggy HDFC excludes fuel (0 rewards there)", async () => {
    const { default: cards } = await import("../../dist/cards.json", { with: { type: "json" } });
    const swiggy = (cards as unknown as EnrichedCard[]).find((c) => c.id === "hdfc-swiggy-hdfc")!;
    const score = scoreCard(swiggy, spend({ fuel: 20000 }));
    expect(score.annual_gross_inr).toBe(0);
  });

  test("real card: HDFC Infinia @ ₹50k/mo dining (5pt/₹150 * ₹1.0 realized = 3.33% base) ≈ ₹20k/yr", async () => {
    const { default: cards } = await import("../../dist/cards.json", { with: { type: "json" } });
    const infinia = (cards as unknown as EnrichedCard[]).find((c) => c.id === "hdfc-infinia")!;
    const score = scoreCard(infinia, spend({ dining: 50000 }));
    // 5 points per ₹150 * ₹1.0/point realized (SmartBuy ₹1 floor, source-backed) * 50000 * 12 = 20000
    expect(score.annual_gross_inr).toBeCloseTo(20000, 0);
  });
});

describe("pickTopAccelerated — normalises effective_rate (units/₹N) vs multiplier (×) (B3-SF8)", () => {
  test("a higher-value effective_rate entry beats a 10× multiplier on a low-base card", () => {
    // Base 1pt/₹100 at ₹0.25 = 0.25% value. 10× = 2.5% value.
    // 12 pts/₹100 explicit = 3% value — should rank higher than the 10× one.
    const card = makeCard({
      currency: "points",
      base: { rate: 1, per_inr: 100, unit_value_inr: 0.25 },
      accelerated: [
        {
          category: "smartbuy",
          canonical_categories: ["travel"],
          multiplier: 10, // = 2.5% value
          cycle: "monthly",
        },
        {
          category: "dining",
          canonical_categories: ["dining"],
          multiplier: 0,
          effective_rate: 12, // 12 pts/₹100 × ₹0.25 = 3% value
          cycle: "monthly",
        },
      ],
    });
    const top = pickTopAccelerated(card);
    expect(top?.category).toBe("dining");
  });
});

describe("scoreCard — merchant/MCC applicability (A2)", () => {
  const realistic = (channels: string[]): ScoringContext => ({
    applyApplicability: true,
    channelMix: new Set(channels),
  });

  test("narrow co-brand rate is NOT applied to the whole bucket; unauthored → base only", () => {
    const card = makeCard({
      currency: "cashback",
      base: { rate: 1, per_inr: 100, unit_value_inr: 1 },
      accelerated: [
        {
          category: "amazon",
          canonical_categories: ["online"],
          multiplier: 0,
          effective_rate: 5,
          channel: { class: "cobrand-merchant", merchants: ["amazon-pay"] },
        },
      ],
    });
    // Optimistic /calculator: whole ₹20k online at 5% → ₹12,000/yr.
    expect(scoreCard(card, spend({ online: 20000 })).annual_gross_inr).toBe(12000);
    // Realistic + opted into amazon, but no authored share → refuse to invent a
    // fraction; rank on base only (₹200/mo → ₹2,400/yr) and flag it.
    const optedIn = scoreCard(card, spend({ online: 20000 }), realistic(["amazon-pay"]));
    expect(optedIn.annual_gross_inr).toBe(2400);
    expect(optedIn.merchant_rates_uncounted).toBe(true);
    // Realistic, NOT opted in: channel unsatisfied → base only, no flag (the rate
    // simply doesn't apply).
    const notOptedIn = scoreCard(card, spend({ online: 20000 }), realistic([]));
    expect(notOptedIn.annual_gross_inr).toBe(2400);
    expect(notOptedIn.merchant_rates_uncounted).toBeUndefined();
  });

  test("merchant-list accelerator with no channel gate is also uncounted without an authored share", () => {
    const card = makeCard({
      currency: "cashback",
      base: { rate: 1, per_inr: 100, unit_value_inr: 1 },
      accelerated: [
        { category: "co-brand store", canonical_categories: ["online"], multiplier: 0, effective_rate: 5, merchants: ["some-store"] },
      ],
    });
    expect(scoreCard(card, spend({ online: 20000 })).annual_gross_inr).toBe(12000); // optimistic whole bucket
    const real = scoreCard(card, spend({ online: 20000 }), realistic([]));
    expect(real.annual_gross_inr).toBe(2400); // base only
    expect(real.merchant_rates_uncounted).toBe(true);
  });

  test("authored applicability_pct blends accelerator-on-slice with base-on-remainder", () => {
    const card = makeCard({
      currency: "cashback",
      base: { rate: 1, per_inr: 100, unit_value_inr: 1 },
      accelerated: [
        {
          category: "amazon",
          canonical_categories: ["online"],
          multiplier: 0,
          effective_rate: 5,
          applicability_pct: 40, // evidence-based: 40% of the user's online spend
          channel: { class: "cobrand-merchant", merchants: ["amazon-pay"] },
        },
      ],
    });
    // 40% at 5% + 60% at 1% base on ₹20k = ₹520/mo → ₹6,240/yr; nothing uncounted.
    const real = scoreCard(card, spend({ online: 20000 }), realistic(["amazon-pay"]));
    expect(real.annual_gross_inr).toBe(6240);
    expect(real.merchant_rates_uncounted).toBeUndefined();
  });

  test("applicability_pct: 100 pins the whole bucket", () => {
    const card = makeCard({
      currency: "cashback",
      base: { rate: 1, per_inr: 100, unit_value_inr: 1 },
      accelerated: [
        {
          category: "amazon",
          canonical_categories: ["online"],
          multiplier: 0,
          effective_rate: 5,
          applicability_pct: 100,
          channel: { class: "cobrand-merchant", merchants: ["amazon-pay"] },
        },
      ],
    });
    expect(scoreCard(card, spend({ online: 20000 }), realistic(["amazon-pay"])).annual_gross_inr).toBe(12000);
  });

  test("category-wide accelerator (no merchant/MCC/channel) still covers the whole bucket", () => {
    const card = makeCard({
      currency: "cashback",
      base: { rate: 1, per_inr: 100, unit_value_inr: 1 },
      accelerated: [{ category: "dining", canonical_categories: ["dining"], multiplier: 0, effective_rate: 5 }],
    });
    // Not narrow → f = 1 even in realistic mode → same as optimistic.
    const real = scoreCard(card, spend({ dining: 20000 }), realistic([]));
    expect(real.annual_gross_inr).toBe(12000);
    expect(real.merchant_rates_uncounted).toBeUndefined();
  });

  test("online-any channel class is treated as category-wide, not narrow", () => {
    const card = makeCard({
      currency: "cashback",
      base: { rate: 1, per_inr: 100, unit_value_inr: 1 },
      accelerated: [
        {
          category: "any online",
          canonical_categories: ["online"],
          multiplier: 0,
          effective_rate: 5,
          channel: { class: "online-any", merchants: ["online-any"] },
        },
      ],
    });
    expect(scoreCard(card, spend({ online: 20000 }), realistic(["online-any"])).annual_gross_inr).toBe(12000);
  });

  test("mcc_exclusions zero a single-MCC-family bucket (fuel) in scoring, not just disclaimer", () => {
    const card = makeCard({
      currency: "cashback",
      base: { rate: 1, per_inr: 100, unit_value_inr: 1 },
      mcc_exclusions: ["5541", "5542"],
    });
    const score = scoreCard(card, spend({ fuel: 20000, dining: 10000 }));
    expect(score.buckets.find((b) => b.category === "fuel")!.monthly_value_inr).toBe(0);
    expect(score.annual_gross_inr).toBe(1200); // only dining 1% earns
  });

  test("mcc_exclusions 6513 zeroes the rent bucket", () => {
    const card = makeCard({
      currency: "cashback",
      base: { rate: 1, per_inr: 100, unit_value_inr: 1 },
      mcc_exclusions: ["6513"],
    });
    const score = scoreCard(card, spend({ rent: 30000, online: 10000 }));
    expect(score.buckets.find((b) => b.category === "rent")!.monthly_value_inr).toBe(0);
    expect(score.annual_gross_inr).toBe(1200); // only online 1%
  });
});

describe("scoreCard — canonical reward math regressions", () => {
  test("cashback uncapped: 1% on dining, ₹10k spend → ₹1200/yr", () => {
    const card = makeCard({
      currency: "cashback",
      base: { rate: 1, per_inr: 100, unit_value_inr: 1 },
    });
    const score = scoreCard(card, spend({ dining: 10000 }));
    expect(score.annual_gross_inr).toBe(1200);
  });

  test("points: 2 pts per ₹100 at ₹0.25/pt = 0.5% effective; ₹10k spend → ₹600/yr", () => {
    const card = makeCard({
      currency: "points",
      base: { rate: 2, per_inr: 100, unit_value_inr: 0.25 },
    });
    const score = scoreCard(card, spend({ online: 10000 }));
    expect(score.annual_gross_inr).toBe(600);
  });

  test("category exclusion: excluded bucket earns 0", () => {
    const card = makeCard({
      currency: "cashback",
      base: { rate: 1, per_inr: 100, unit_value_inr: 1 },
      exclusions: ["fuel"],
    });
    // fuel excluded → 0; dining 1% on ₹10k = ₹100/mo → ₹1200/yr
    const score = scoreCard(card, spend({ fuel: 20000, dining: 10000 }));
    expect(score.annual_gross_inr).toBe(1200);
    const fuel = score.buckets.find((b) => b.category === "fuel")!;
    expect(fuel.monthly_value_inr).toBe(0);
    expect(fuel.effective_rate_pct).toBe(0);
    expect(fuel.note).toMatch(/excluded/i);
  });

  test("base.cap_per_cycle caps base earn across buckets (accelerated unaffected)", () => {
    const card = makeCard({
      currency: "cashback",
      base: { rate: 1, per_inr: 100, unit_value_inr: 1, cap_per_cycle: 500, cap_unit: "cashback-inr", cycle: "statement" },
      accelerated: [
        { category: "dining", canonical_categories: ["dining"], multiplier: 0, effective_rate: 10, cycle: "monthly" },
      ],
    });
    // base 1% on ₹100k other spend = ₹1000/mo but capped at ₹500; dining 10% on ₹20k = ₹2000/mo (accelerated, uncapped).
    // monthly = 500 + 2000 = 2500 → ₹30,000/yr.
    const score = scoreCard(card, spend({ online: 50000, groceries: 50000, dining: 20000 }));
    expect(score.annual_gross_inr).toBe(30000);
  });

  test("reward_cap clamps card-wide total per cycle", () => {
    const card = makeCard({
      currency: "points",
      base: { rate: 1, per_inr: 100, unit_value_inr: 1 },
      rewardCap: { max_units: 1000, cap_unit: "points", cycle: "monthly" },
    });
    // 1% (1pt/₹100 * ₹1) on ₹200k/mo = ₹2000/mo, clamped by reward_cap 1000pts*₹1 = ₹1000/mo → ₹12,000/yr.
    const score = scoreCard(card, spend({ online: 100000, dining: 100000 }));
    expect(score.annual_gross_inr).toBe(12000);
  });

  test("fee waiver crossing at threshold", () => {
    const card = makeCard({
      currency: "cashback",
      base: { rate: 1, per_inr: 100, unit_value_inr: 1 },
      annualFee: 1500,
      feeWaiverSpend: 300000,
    });
    // 299_999/yr → not waived; 300_000/yr → waived.
    // monthlyTotal * 12 must reach 300_000. Use ₹25_000/mo dining = 300_000/yr.
    const justWaived = scoreCard(card, spend({ dining: 25000 }));
    expect(justWaived.fee_waived).toBe(true);
    expect(justWaived.annual_fee_effective_inr).toBe(0);

    const justNot = scoreCard(card, spend({ dining: 24999 }));
    expect(justNot.fee_waived).toBe(false);
    expect(justNot.annual_fee_effective_inr).toBe(1500);
  });
});

describe("scoreCard — effective_rate is receipt-visible units, not percent (audit A1)", () => {
  test("points-card effective_rate converts via base.per_inr and unit value", () => {
    // IDFC-shaped: 10 pts per ₹150 at ₹0.22/pt = 1.4667% value — NOT 10%.
    const card = makeCard({
      currency: "points",
      base: { rate: 3, per_inr: 150, unit_value_inr: 0.22 },
      accelerated: [
        {
          category: "online",
          canonical_categories: ["online"],
          multiplier: 0,
          effective_rate: 10,
        },
      ],
    });
    const score = scoreCard(card, spend({ online: 10000 }));
    // ₹10k/mo × (10 × 0.22 / 150) = ₹146.67/mo → ₹1,760/yr.
    expect(score.buckets[0].effective_rate_pct).toBeCloseTo(1.4667, 3);
    expect(score.annual_gross_inr).toBeCloseTo(1760, 0);
  });

  test("effective_per_inr overrides base.per_inr (Magnus-shaped)", () => {
    // 35 pts per ₹200 at ₹0.18/pt = 3.15%, on a card whose base earns per ₹100.
    const card = makeCard({
      currency: "points",
      base: { rate: 1, per_inr: 100, unit_value_inr: 0.18 },
      accelerated: [
        {
          category: "online",
          canonical_categories: ["online"],
          multiplier: 1,
          effective_rate: 35,
          effective_per_inr: 200,
        },
      ],
    });
    const score = scoreCard(card, spend({ online: 10000 }));
    expect(score.buckets[0].effective_rate_pct).toBeCloseTo(3.15, 6);
  });

  test("high-rate points accelerator no longer scores as an absurd percent (Reserve-shaped)", () => {
    // 45 pts per ₹200 at ₹0.35/pt = 7.875% — the percent reading said 45%.
    const card = makeCard({
      currency: "points",
      base: { rate: 15, per_inr: 200, unit_value_inr: 0.35 },
      accelerated: [
        {
          category: "dining",
          canonical_categories: ["dining"],
          multiplier: 3,
          effective_rate: 45,
        },
      ],
    });
    const score = scoreCard(card, spend({ dining: 10000 }));
    expect(score.buckets[0].effective_rate_pct).toBeCloseTo(7.875, 6);
    expect(score.buckets[0].effective_rate_pct).toBeLessThan(10);
  });

  test("cashback effective_rate without explicit unit value treats units as ₹1", () => {
    const card = makeCard({
      currency: "cashback",
      base: { rate: 1, per_inr: 100 },
      accelerated: [
        {
          category: "online",
          canonical_categories: ["online"],
          multiplier: 0,
          effective_rate: 5,
        },
      ],
    });
    const score = scoreCard(card, spend({ online: 10000 }));
    expect(score.buckets[0].effective_rate_pct).toBe(5);
  });
});

describe("valueBasis threads face vs realized", () => {
  test("face basis yields >= realized basis for a points card whose realized < face", () => {
    // hdfc-infinia-shaped: face ₹1.1/pt, realized ₹1.0/pt (realized is the honest
    // floor; face is the optimistic ceiling for the best documented redemption).
    const CARD = makeCard({
      currency: "points",
      base: { rate: 5, per_inr: 150, unit_value_inr: 1.1, unit_value_inr_realized: 1.0 },
    });
    const spendProfile = spend({ dining: 10000 });
    const realized = scoreCard(CARD, spendProfile, { valueBasis: "realized" } as ScoringContext);
    const face = scoreCard(CARD, spendProfile, { valueBasis: "face" } as ScoringContext);
    expect(face.annual_gross_inr).toBeGreaterThanOrEqual(realized.annual_gross_inr);
    expect(face.annual_gross_inr).toBeGreaterThan(realized.annual_gross_inr);
  });

  test("face basis raises the ACCELERATED value, not just base (via acceleratorRatePct)", () => {
    // Points card with an accelerated dining rate. realized ₹1.0/pt < face ₹1.1/pt.
    // The accelerator's own effective_rate is valued through acceleratorRatePct's
    // unitValueFor call, so face basis must lift the accelerated earn, not only base.
    const CARD = makeCard({
      currency: "points",
      base: { rate: 5, per_inr: 150, unit_value_inr: 1.1, unit_value_inr_realized: 1.0 },
      accelerated: [
        {
          category: "dining",
          canonical_categories: ["dining"],
          multiplier: 0,
          effective_rate: 20, // 20 pts/₹150 — the elevated rate this test exercises
        },
      ],
    });
    const spendProfile = spend({ dining: 10000 });
    const realized = scoreCard(CARD, spendProfile, { valueBasis: "realized" } as ScoringContext);
    const face = scoreCard(CARD, spendProfile, { valueBasis: "face" } as ScoringContext);
    // The dining bucket earns the accelerated rate; face (₹1.1) values those points
    // higher than realized (₹1.0), so annual gross must rise.
    expect(face.buckets[0].effective_rate_pct).toBeGreaterThan(realized.buckets[0].effective_rate_pct);
    expect(face.annual_gross_inr).toBeGreaterThan(realized.annual_gross_inr);
  });
});

describe("explainCard — per-accelerator cap story", () => {
  const spendHeavy = { online: 0, groceries: 0, dining: 0, fuel: 0, travel: 200000, utilities: 0, rent: 0, international: 0 };

  // Cashback card with a travel accelerator capped low enough that ₹200k/mo
  // travel spend blows through it: 5% gross would be ₹10,000/mo but the cap
  // clamps accelerated earn to ₹2,000/mo, with the remainder spilling to base.
  const CAPPED_TRAVEL_CARD = makeCard({
    currency: "cashback",
    base: { rate: 1, per_inr: 100, unit_value_inr: 1 },
    accelerated: [
      {
        category: "travel",
        canonical_categories: ["travel"],
        multiplier: 0,
        effective_rate: 5,
        cap_per_cycle: 2000,
        cap_unit: "cashback-inr",
        cycle: "monthly",
      },
    ],
    annualFee: 1000,
  });

  // Mirrors the real hdfc-infinia SmartBuy accelerator: a points card whose
  // travel accelerator only fires when booked through the issuer portal.
  const CHANNEL_CARD = makeCard({
    currency: "points",
    base: { rate: 5, per_inr: 150, unit_value_inr: 1.1, unit_value_inr_realized: 1.0 },
    accelerated: [
      {
        category: "smartbuy-flights-hotels",
        canonical_categories: ["travel"],
        multiplier: 10,
        cap_per_cycle: 15000,
        cap_unit: "points",
        cycle: "monthly",
        channel: { required: true, class: "issuer-portal", merchants: ["smartbuy"] },
      },
    ],
  });

  test("a cap-bound accelerator reports the clamp, ₹ lost, and base spillover", () => {
    // Use a card with a capped travel accelerator on a spend high enough to hit
    // the cap (load the card the way other tests do). Absolute layer fires it.
    const ex = explainCard(CAPPED_TRAVEL_CARD, spendHeavy, { valueBasis: "face" });
    const row = ex.accelerators.find((a) => a.category === "travel");
    expect(row).toBeTruthy();
    expect(row!.cap_bound).toBe(true);
    expect(row!.lost_to_cap_inr).toBeGreaterThan(0);
    expect(row!.uncapped_value_inr).toBeGreaterThan(row!.net_value_inr - row!.base_spillover_inr);
    expect(row!.factors.join(" ").toLowerCase()).toContain("cap");
  });

  test("realistic drops a channel-locked accelerator to base; absolute fires it", () => {
    // A card whose top accelerator is channel-locked (e.g. hdfc-infinia SmartBuy).
    const realistic = explainCard(CHANNEL_CARD, spendHeavy, { applyApplicability: true, channelMix: new Set(), enabledEcosystems: new Set(), valueBasis: "realized" });
    const absolute = explainCard(CHANNEL_CARD, spendHeavy, { valueBasis: "face" });
    expect(absolute.annual_gross_inr).toBeGreaterThan(realistic.annual_gross_inr);
    // realistic factor list should mention the channel/base fallback for the affected bucket
    const absRow = absolute.accelerators.find((a) => a.category === "travel");
    expect(absRow!.factors.join(" ").toLowerCase()).toMatch(/channel|smartbuy|portal/);
  });

  test("annual_net nets the fee off the gross", () => {
    const ex = explainCard(CAPPED_TRAVEL_CARD, spendHeavy, { valueBasis: "realized" });
    expect(ex.annual_net_inr).toBe(ex.annual_gross_inr - ex.annual_fee_inr);
  });
});
