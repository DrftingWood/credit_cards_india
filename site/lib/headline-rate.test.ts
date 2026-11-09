import { describe, test, expect } from "vitest";
import { computeHeadlineRatePct } from "./headline-rate.mjs";
import { scoreCard } from "./calculator";
import { bestAcceleratedPct } from "./detail-derivations";
import type { EnrichedCard, LoyaltyProgram, RewardRecord } from "./types";

const SOURCE = { url: "https://example.test", retrieved_on: "2024-01-01" };

function rewardsOf(opts: {
  currency: string;
  rate: number;
  per_inr: number;
  unit_value_inr_realized?: number;
  unit_value_inr?: number;
  accelerated?: unknown[];
}): RewardRecord {
  return {
    effective_from: "2024-01-01",
    effective_until: null,
    currency: opts.currency,
    base: {
      rate: opts.rate,
      per_inr: opts.per_inr,
      ...(opts.unit_value_inr_realized != null ? { unit_value_inr_realized: opts.unit_value_inr_realized } : {}),
      ...(opts.unit_value_inr != null ? { unit_value_inr: opts.unit_value_inr } : {}),
    },
    accelerated: opts.accelerated ?? [],
    source: SOURCE,
  } as unknown as RewardRecord;
}

function cardOf(rewards: RewardRecord): EnrichedCard {
  return {
    id: "test-card",
    name: "Test Card",
    issuer: "test",
    network: "visa",
    tier: "mid",
    status: "active",
    rewards: [rewards],
    metadata: { last_verified_on: "2024-01-01" },
    current_fees: { effective_from: "2024-01-01", effective_until: null, joining_fee_inr: 0, annual_fee_inr: 0, source: SOURCE },
    current_rewards: rewards,
    current_benefits: null,
    computed: {
      is_active: true, is_invite_only: false, is_lifetime_free: true,
      has_fee_waiver: false, fee_waiver_spend_inr: null,
      primary_reward_currency: rewards.currency, headline_rate_pct: null,
      has_domestic_lounge: false, has_international_lounge: false,
      co_brand_partner: null, co_brand_category: null,
    },
  } as unknown as EnrichedCard;
}

const FULL_SPEND = { online: 10000, groceries: 0, dining: 0, fuel: 0, travel: 0, utilities: 0, rent: 0, international: 0 };

describe("computeHeadlineRatePct — the build-time badge shares the engines' rate math", () => {
  test("per_inr: 0 returns null (renders as em-dash), never 0 or Infinity", () => {
    expect(computeHeadlineRatePct(rewardsOf({ currency: "points", rate: 1, per_inr: 0, unit_value_inr: 1 }), {})).toBeNull();
  });

  test("missing unit value returns null, not a made-up number", () => {
    expect(computeHeadlineRatePct(rewardsOf({ currency: "points", rate: 4, per_inr: 150 }), {})).toBeNull();
  });

  test("three consumers agree on the same points record (build badge = calculator base = detail-derivations)", () => {
    // 4 pts per ₹150 at ₹0.30 realized = 0.8%. Any drift between the listing
    // badge, the calculator's base-bucket rate, and the tile's derived pct is
    // exactly the class of bug behind PR-2's 100x drift.
    const rewards = rewardsOf({
      currency: "points", rate: 4, per_inr: 150, unit_value_inr_realized: 0.3,
      accelerated: [{ category: "everything", canonical_categories: ["online"], multiplier: 1 }],
    });
    const headline = computeHeadlineRatePct(rewards, {});
    const calc = scoreCard(cardOf(rewards), FULL_SPEND).buckets[0].effective_rate_pct;
    const derived = bestAcceleratedPct(cardOf(rewards));
    expect(headline).toBeCloseTo(0.8, 6);
    expect(calc).toBeCloseTo(headline!, 6);
    expect(derived).toBeCloseTo(headline!, 6);
  });

  test("three consumers agree on the same cashback record", () => {
    const rewards = rewardsOf({
      currency: "cashback", rate: 5, per_inr: 100, unit_value_inr: 1,
      accelerated: [{ category: "everything", canonical_categories: ["online"], multiplier: 1 }],
    });
    const headline = computeHeadlineRatePct(rewards, {});
    const calc = scoreCard(cardOf(rewards), FULL_SPEND).buckets[0].effective_rate_pct;
    const derived = bestAcceleratedPct(cardOf(rewards));
    expect(headline).toBeCloseTo(5, 6);
    expect(calc).toBeCloseTo(headline!, 6);
    expect(derived).toBeCloseTo(headline!, 6);
  });
});

describe("headline rate honours unit_value_from_program: false (D-27)", () => {
  // bob-irctc: the card's own points convert into the programme at a non-1:1 ratio, so the
  // programme's unit value is not the card's. The badge used the programme value anyway and
  // showed 4x the rate the calculator scored on the same record.
  const programs = { prog: { id: "prog", name: "Prog", unit_value_inr: { realized: 1, face: 1 } } } as unknown as Record<string, LoyaltyProgram>;
  const rewards = {
    ...rewardsOf({ currency: "points", rate: 2, per_inr: 100, unit_value_inr_realized: 0.25 }),
    loyalty_program: "prog",
    unit_value_from_program: false,
  } as unknown as RewardRecord;

  test("badge uses the card's own unit value and matches the calculator", () => {
    const badge = computeHeadlineRatePct(rewards, programs);
    expect(badge).toBeCloseTo(0.5, 6);
    const scored = scoreCard(cardOf(rewards), { online: 10_000, groceries: 0, dining: 0, fuel: 0, travel: 0, utilities: 0, rent: 0, international: 0 }, { programs });
    expect(scored.buckets[0]!.effective_rate_pct).toBeCloseTo(badge!, 6);
  });

  test("without the opt-out the programme value still wins", () => {
    const stacked = { ...rewards, unit_value_from_program: undefined } as unknown as RewardRecord;
    expect(computeHeadlineRatePct(stacked, programs)).toBeCloseTo(2, 6);
  });
});
