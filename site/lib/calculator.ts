import type {
  EnrichedCard,
  AcceleratedReward,
  RewardRecord,
  LoyaltyProgram,
} from "./types";
import { CanonicalCategory, resolveBuckets } from "./category-mapping";

export type SpendProfile = Record<CanonicalCategory, number>;

export interface BucketBreakdown {
  category: CanonicalCategory;
  monthly_spend: number;
  effective_rate_pct: number;
  monthly_value_inr: number;
  basis?: "general" | "channel-locked";
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

export interface ScoringContext {
  /** Merchant tokens the user is willing to transact through. When omitted, the calculator is "optimistic" — channel-locked accelerators fire as if the user always books on the right channel. */
  channelMix?: Set<string>;
  /** program-id → tier-id (e.g. {"indigo-bluchip": "silver"}). */
  tierMap?: Record<string, string | null>;
  /** id → loyalty program record. */
  programs?: Record<string, LoyaltyProgram>;
}

const MONTHS_PER_YEAR = 12;

/** Best-available unit value: program.realized > base.realized > base.face. */
function unitValueFor(rewards: RewardRecord, programs?: Record<string, LoyaltyProgram>): number | null {
  const program = rewards.loyalty_program ? programs?.[rewards.loyalty_program] : null;
  if (program) return program.unit_value_inr.realized;
  if (rewards.base.unit_value_inr_realized != null) return rewards.base.unit_value_inr_realized;
  if (rewards.base.unit_value_inr != null) return rewards.base.unit_value_inr;
  return null;
}

/** Points/miles rate as % of spend (e.g. returns 1 for 1%). Returns 0 if per_inr is non-positive — guards against a YAML typo producing Infinity that would sort to rank 1. */
function pointsToPct(rate: number, perInr: number, unitValue: number): number {
  if (perInr <= 0) return 0;
  return ((rate * unitValue) / perInr) * 100;
}

function baseRatePct(rewards: RewardRecord | null, programs?: Record<string, LoyaltyProgram>): number {
  if (!rewards) return 0;
  const uv = unitValueFor(rewards, programs);
  if (uv == null) return 0;
  return pointsToPct(rewards.base.rate, rewards.base.per_inr, uv);
}

/** Returns true if the accelerator's channel constraint is satisfied (or absent). */
function channelSatisfied(a: AcceleratedReward, ctx: ScoringContext | undefined): boolean {
  const ch = a.channel;
  if (!ch) return true;
  const required = ch.required !== false;
  if (!required) return true;
  // If caller didn't specify a channel mix, treat as optimistic (current /calculator behaviour).
  if (!ctx || !ctx.channelMix) return true;
  if (ctx.channelMix.size === 0) return false;
  for (const m of ch.merchants) {
    if (ctx.channelMix.has(m)) return true;
  }
  return false;
}

/** Sum of program baseline + matching channel bonuses + matching tier bonus, expressed as percent of spend. */
function programStackPct(
  rewards: RewardRecord,
  ctx: ScoringContext | undefined,
  unitValue: number,
): number {
  if (!rewards.loyalty_program || !ctx?.programs) return 0;
  const program = ctx.programs[rewards.loyalty_program];
  if (!program?.earn) return 0;
  let pct = 0;

  const baseline = program.earn.baseline;
  if (baseline) pct += pointsToPct(baseline.rate, baseline.per_inr, unitValue);

  if (program.earn.channels && ctx.channelMix) {
    for (const c of program.earn.channels) {
      const hit = c.merchants.some((m) => ctx.channelMix!.has(m));
      if (hit) pct += pointsToPct(c.rate, c.per_inr, unitValue);
    }
  }

  const tierId = ctx.tierMap?.[rewards.loyalty_program] ?? null;
  if (tierId && program.earn.tiers) {
    const tier = program.earn.tiers.find((t) => t.id === tierId);
    if (tier) pct += pointsToPct(tier.bonus_rate, tier.bonus_per_inr, unitValue);
  }

  return pct;
}

function acceleratorRatePct(
  a: AcceleratedReward,
  rewards: RewardRecord,
  ctx: ScoringContext | undefined,
): number | null {
  const unitValue = unitValueFor(rewards, ctx?.programs);

  // earn_components form takes precedence — sum components whose gates are satisfied.
  if (a.earn_components && a.earn_components.length > 0) {
    if (unitValue == null) return null;
    let pct = 0;
    for (const c of a.earn_components) {
      const perInr = c.per_inr ?? 100;
      // Tier gate
      if (c.requires_tier) {
        const programId = rewards.loyalty_program;
        const userTier = programId ? ctx?.tierMap?.[programId] : null;
        if (userTier !== c.requires_tier) continue;
      }
      // Channel gate
      if (c.requires_channel && c.requires_channel.length > 0) {
        if (!ctx?.channelMix) {
          // optimistic: count it
        } else {
          const hit = c.requires_channel.some((m) => ctx.channelMix!.has(m));
          if (!hit) continue;
        }
      }
      pct += pointsToPct(c.rate, perInr, unitValue);
    }
    return pct;
  }

  // Card-attributable scalar form.
  if (a.card_attributable_rate != null && unitValue != null) {
    const perInr = a.card_attributable_per_inr ?? 100;
    let pct = pointsToPct(a.card_attributable_rate, perInr, unitValue);
    if (a.stacks_with_program) {
      pct += programStackPct(rewards, ctx, unitValue);
    }
    return pct;
  }

  // Legacy effective_rate / multiplier paths (back-compat, optimistic).
  const baseUnitValue = unitValue;
  if (a.effective_rate != null && (a.cap_unit === "cashback-inr" || a.cap_unit === undefined)) {
    return a.effective_rate;
  }
  if (a.effective_rate != null && baseUnitValue != null) {
    return (a.effective_rate * baseUnitValue) / 1;
  }
  if (baseUnitValue != null) {
    const base = pointsToPct(rewards.base.rate, rewards.base.per_inr, baseUnitValue);
    return base * a.multiplier;
  }
  return null;
}

function acceleratedRateForBucket(
  accelerated: AcceleratedReward[],
  bucket: CanonicalCategory,
  rewards: RewardRecord,
  ctx: ScoringContext | undefined,
): { rate_pct: number; cap_monthly_inr: number | null; basis: "general" | "channel-locked" } | null {
  let best: { rate_pct: number; cap_monthly_inr: number | null; basis: "general" | "channel-locked" } | null = null;
  const unitValue = unitValueFor(rewards, ctx?.programs);

  for (const a of accelerated) {
    const buckets = resolveBuckets(a.category, a.canonical_categories);
    if (!buckets.includes(bucket)) continue;

    if (!channelSatisfied(a, ctx)) continue;

    const ratePct = acceleratorRatePct(a, rewards, ctx);
    if (ratePct == null) continue;

    let capMonthlyInr: number | null = null;
    if (typeof a.cap_per_cycle === "number") {
      // Match cap_unit explicitly; the unitValue branch is the points/miles fallback (schema default is "points").
      const unit = a.cap_unit ?? "points";
      if (unit === "cashback-inr") {
        capMonthlyInr = a.cap_per_cycle;
      } else if (unit === "spend-inr") {
        capMonthlyInr = (a.cap_per_cycle * ratePct) / 100;
      } else if (unitValue != null) {
        capMonthlyInr = a.cap_per_cycle * unitValue;
      }
      if (a.cycle === "quarterly" && capMonthlyInr != null) capMonthlyInr = capMonthlyInr / 3;
      if (a.cycle === "annual" && capMonthlyInr != null) capMonthlyInr = capMonthlyInr / 12;
    }

    const basis: "general" | "channel-locked" = a.channel ? "channel-locked" : "general";
    const candidate = { rate_pct: ratePct, cap_monthly_inr: capMonthlyInr, basis };
    if (!best || candidate.rate_pct > best.rate_pct) best = candidate;
  }
  return best;
}

export function scoreCard(
  card: EnrichedCard,
  spend: SpendProfile,
  ctx?: ScoringContext,
): CardScore {
  const rewards = card.current_rewards;
  const baseRate = baseRatePct(rewards, ctx?.programs);
  const buckets: BucketBreakdown[] = [];
  let monthlyValue = 0;
  let totalSpend = 0;

  for (const bucket of Object.keys(spend) as CanonicalCategory[]) {
    const amount = spend[bucket] || 0;
    totalSpend += amount;
    if (amount <= 0) continue;

    let rate = baseRate;
    let cap: number | null = null;
    let basis: "general" | "channel-locked" = "general";
    let note: string | undefined;

    if (rewards?.accelerated?.length) {
      const hit = acceleratedRateForBucket(rewards.accelerated, bucket, rewards, ctx);
      if (hit) {
        rate = hit.rate_pct;
        cap = hit.cap_monthly_inr;
        basis = hit.basis;
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
      basis,
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

export function rankCards(
  cards: EnrichedCard[],
  spend: SpendProfile,
  ctx?: ScoringContext,
): CardScore[] {
  return cards
    .filter((c) => c.current_rewards && c.computed.is_active && !c.computed.is_invite_only)
    .map((c) => scoreCard(c, spend, ctx))
    .sort((a, b) => b.annual_net_inr - a.annual_net_inr);
}
