import { describe, test, expect } from "vitest";
import { scoreCard, type SpendProfile } from "./calculator";
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

interface CardOpts {
  id?: string;
  currency?: RewardCurrency;
  base: { rate: number; per_inr: number; unit_value_inr?: number };
  accelerated?: AcceleratedReward[];
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
    },
    accelerated: opts.accelerated ?? [],
    source: SOURCE,
  };

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
    // Spending ₹50k/mo → uncapped ₹625, but cap is 1000 points * 0.25 = ₹250/mo.
    // Annual: 250 * 12 = 3000.
    const score = scoreCard(card, spend({ groceries: 50000 }));
    expect(score.annual_gross_inr).toBe(3000);
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

describe("scoreCard — base rate unit correctness (bonus blocker)", () => {
  test("real card: SBI Cashback @ ₹20k/mo dining (1% base, no accelerator on dining) ≈ ₹2.4k/yr", async () => {
    const { default: cards } = await import("../../dist/cards.json", { with: { type: "json" } });
    const sbi = (cards as unknown as EnrichedCard[]).find((c) => c.id === "sbi-cashback")!;
    const score = scoreCard(sbi, spend({ dining: 20000 }));
    expect(score.annual_gross_inr).toBe(2400); // 1% * 20000 * 12
  });

  test("real card: HDFC Infinia @ ₹50k/mo dining (5pt/₹150 * ₹0.70 realized = 2.33% base) ≈ ₹14k/yr", async () => {
    const { default: cards } = await import("../../dist/cards.json", { with: { type: "json" } });
    const infinia = (cards as unknown as EnrichedCard[]).find((c) => c.id === "hdfc-infinia")!;
    const score = scoreCard(infinia, spend({ dining: 50000 }));
    // 5 points per ₹150 * ₹0.70/point * 50000 * 12 = 14000
    expect(score.annual_gross_inr).toBeCloseTo(14000, 0);
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
