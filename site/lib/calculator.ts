import type { EnrichedCard, AcceleratedReward, RewardRecord } from "./types";
import { CanonicalCategory, classifyCategory } from "./category-mapping";

export type SpendProfile = Record<CanonicalCategory, number>;

export interface BucketBreakdown {
  category: CanonicalCategory;
  monthly_spend: number;
  effective_rate_pct: number;
  monthly_value_inr: number;
  note?: string;
}

export interface CardScore {
  card: EnrichedCard;
  annual_gross_inr: number;
  annual_fee_effective_inr: number;
  annual_net_inr: number;
  fee_waived: boolean;
  buckets: BucketBreakdown[];
  base_value_inr_monthly: number;
  disclaimer?: string;
}

const MONTHS_PER_YEAR = 12;

function baseRatePct(rewards: RewardRecord | null): number {
  if (!rewards) return 0;
  const b = rewards.base;
  if (b.unit_value_inr == null) return 0;
  return (b.rate * b.unit_value_inr) / b.per_inr;
}

function acceleratedRateForBucket(
  accelerated: AcceleratedReward[],
  bucket: CanonicalCategory,
  rewards: RewardRecord,
): { rate_pct: number; cap_monthly_inr: number | null } | null {
  let best: { rate_pct: number; cap_monthly_inr: number | null } | null = null;
  const baseUnitValue = rewards.base.unit_value_inr;

  for (const a of accelerated) {
    const buckets = classifyCategory(a.category);
    if (!buckets.includes(bucket)) continue;

    let ratePct: number | null = null;
    if (a.effective_rate != null && (a.cap_unit === "cashback-inr" || a.cap_unit === undefined)) {
      // When cap_unit is cashback-inr, effective_rate is effectively a %.
      ratePct = a.effective_rate;
    } else if (a.effective_rate != null && baseUnitValue != null) {
      // `effective_rate` is points per ₹100 (schema convention) — convert via unit value.
      ratePct = (a.effective_rate * baseUnitValue) / 1; // per ₹100 with unit_value_inr is already pct-like
    } else if (baseUnitValue != null) {
      // Fall back to multiplier × base rate
      const base = (rewards.base.rate * baseUnitValue) / rewards.base.per_inr;
      ratePct = base * a.multiplier;
    }

    if (ratePct == null) continue;

    let capMonthlyInr: number | null = null;
    if (typeof a.cap_per_cycle === "number") {
      // Convert cap to INR cap:
      if (a.cap_unit === "cashback-inr") {
        capMonthlyInr = a.cap_per_cycle;
      } else if (baseUnitValue != null) {
        // "points" or "miles" — multiply by unit value
        capMonthlyInr = a.cap_per_cycle * baseUnitValue;
      } else if (a.cap_unit === "spend-inr") {
        // Cap is on spend itself
        capMonthlyInr = (a.cap_per_cycle * ratePct) / 100;
      }
      // Normalise caps by cycle length (approximate)
      if (a.cycle === "quarterly" && capMonthlyInr != null) capMonthlyInr = capMonthlyInr / 3;
      if (a.cycle === "annual" && capMonthlyInr != null) capMonthlyInr = capMonthlyInr / 12;
    }

    const candidate = { rate_pct: ratePct, cap_monthly_inr: capMonthlyInr };
    if (!best || candidate.rate_pct > best.rate_pct) best = candidate;
  }
  return best;
}

export function scoreCard(card: EnrichedCard, spend: SpendProfile): CardScore {
  const rewards = card.current_rewards;
  const baseRate = baseRatePct(rewards);
  const buckets: BucketBreakdown[] = [];
  let monthlyValue = 0;
  let totalSpend = 0;

  for (const bucket of Object.keys(spend) as CanonicalCategory[]) {
    const amount = spend[bucket] || 0;
    totalSpend += amount;
    if (amount <= 0) continue;

    let rate = baseRate;
    let cap: number | null = null;
    let note: string | undefined;

    if (rewards?.accelerated?.length) {
      const hit = acceleratedRateForBucket(rewards.accelerated, bucket, rewards);
      if (hit) {
        rate = hit.rate_pct;
        cap = hit.cap_monthly_inr;
      }
    }

    let monthlyValueForBucket = (amount * rate) / 100;
    if (cap != null && monthlyValueForBucket > cap) {
      note = `Capped at ₹${cap.toLocaleString("en-IN", { maximumFractionDigits: 0 })}/mo`;
      monthlyValueForBucket = cap;
    }

    monthlyValue += monthlyValueForBucket;
    buckets.push({
      category: bucket,
      monthly_spend: amount,
      effective_rate_pct: rate,
      monthly_value_inr: monthlyValueForBucket,
      note,
    });
  }

  const annualGross = monthlyValue * MONTHS_PER_YEAR;
  const annualSpend = totalSpend * MONTHS_PER_YEAR;

  const annualFee = card.current_fees?.annual_fee_inr ?? 0;
  const waiverSpend = card.computed.fee_waiver_spend_inr;
  const feeWaived = waiverSpend != null && annualSpend >= waiverSpend;
  const annualFeeEffective = feeWaived ? 0 : annualFee;

  return {
    card,
    annual_gross_inr: annualGross,
    annual_fee_effective_inr: annualFeeEffective,
    annual_net_inr: annualGross - annualFeeEffective,
    fee_waived: feeWaived,
    buckets,
    base_value_inr_monthly: monthlyValue,
    disclaimer:
      card.current_rewards?.capping_rules?.join("; ") ||
      (card.current_rewards?.exclusions?.length
        ? `Excludes: ${card.current_rewards.exclusions.join(", ")}`
        : undefined),
  };
}

export function rankCards(cards: EnrichedCard[], spend: SpendProfile): CardScore[] {
  return cards
    .filter((c) => c.current_rewards && c.computed.is_active && !c.computed.is_invite_only)
    .map((c) => scoreCard(c, spend))
    .sort((a, b) => b.annual_net_inr - a.annual_net_inr);
}
