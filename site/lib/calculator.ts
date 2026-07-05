import type {
  EnrichedCard,
  AcceleratedReward,
  RewardRecord,
  LoyaltyProgram,
} from "./types";
import { CanonicalCategory, resolveBuckets } from "./category-mapping";
import { pointsToPct } from "./rate-math.mjs";

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
  /** True when a merchant/co-brand-specific accelerator was left uncredited because its bucket share isn't authored (A2). */
  merchant_rates_uncounted?: boolean;
  /** Ecosystem this card's rewards are locked to (e.g. "Adani One"), when closed-loop. */
  closed_loop_ecosystem?: string | null;
  /** For a closed-loop card: whether the user's ecosystem preferences credited it in full
   *  (true) or dropped it to base because they don't use that ecosystem (false). */
  ecosystem_credited?: boolean;
}

export interface ScoringContext {
  /** Merchant tokens the user is willing to transact through. When omitted, the calculator is "optimistic" — channel-locked accelerators fire as if the user always books on the right channel. */
  channelMix?: Set<string>;
  /** program-id → tier-id (e.g. {"indigo-bluchip": "silver"}). */
  tierMap?: Record<string, string | null>;
  /** id → loyalty program record. */
  programs?: Record<string, LoyaltyProgram>;
  /**
   * When true (realistic /recommend mode), a merchant/MCC/co-brand-specific
   * accelerator is applied to only a fraction of a broad spend bucket — the
   * rest earns the base rate. When false/omitted (optimistic /calculator), the
   * accelerator covers the whole bucket as if all category spend qualifies (A2).
   */
  applyApplicability?: boolean;
  /**
   * Ecosystems the individual actually uses (by ecosystem_label, e.g. "Adani One").
   * A closed-loop card's points are real ₹1 money ONLY if the user redeems in that
   * ecosystem — so when a card's ecosystem is NOT in this set, its accelerators are
   * dropped and it earns base rate only. `undefined` = optimistic (all ecosystems
   * assumed used), preserving the default calculator behaviour.
   */
  enabledEcosystems?: Set<string>;
}

/** Whether a card's (closed-loop) rewards should be credited in full for this user.
 *  Open cards: always. Closed-loop: only if the user uses that ecosystem (or the
 *  calculator is in optimistic mode with enabledEcosystems undefined). */
function ecosystemCredited(rewards: RewardRecord | null, ctx: ScoringContext | undefined): boolean {
  if (!rewards || rewards.redemption_scope !== "closed-loop") return true;
  if (!ctx?.enabledEcosystems) return true; // optimistic: assume used
  const eco = rewards.ecosystem_label;
  return eco != null && ctx.enabledEcosystems.has(eco);
}

/**
 * Channel classes that span a whole calculator bucket rather than a specific
 * merchant: "any online merchant" / "any physical store". An accelerator gated
 * only by one of these is category-wide, not narrow.
 */
const BROAD_CHANNEL_CLASSES = new Set(["online-any", "physical"]);

/**
 * A narrow accelerator is tied to a specific merchant, MCC, or co-brand channel,
 * so it can't be assumed to cover a user's whole broad-bucket spend.
 */
function isNarrowAccelerator(a: AcceleratedReward): boolean {
  const cls = a.channel?.class;
  if (cls) return !BROAD_CHANNEL_CLASSES.has(cls);
  if (a.merchants && a.merchants.length > 0) return true;
  if (a.mcc_list && a.mcc_list.length > 0) return true;
  return false; // no merchant/MCC/channel narrowing → the accelerator IS the category
}

/**
 * Share of a broad bucket the accelerator's elevated rate applies to.
 *
 * We do NOT invent a fraction for a narrow accelerator — there is no per-merchant
 * spend distribution anywhere in the dataset to derive one from. So (A2):
 *  - optimistic /calculator (applyApplicability off) → 1 (whole bucket, as before).
 *  - authored `applicability_pct` → that evidence-based fraction.
 *  - category-wide accelerator, no authoring → 1 (this is the accelerator's own
 *    definition, not a guess).
 *  - narrow accelerator, no authoring → null: the caller refuses to credit the
 *    elevated rate and falls back to the base rate for the bucket, with a caveat.
 */
function applicabilityFraction(a: AcceleratedReward, ctx: ScoringContext | undefined): number | null {
  if (!ctx?.applyApplicability) return 1; // optimistic /calculator: whole bucket
  if (a.applicability_pct != null) {
    return Math.max(0, Math.min(1, a.applicability_pct / 100));
  }
  return isNarrowAccelerator(a) ? null : 1;
}

/**
 * MCCs that, when a card excludes them, effectively zero a whole calculator
 * bucket (these buckets are defined by a single MCC family). Used so
 * `mcc_exclusions` affect scoring, not just disclaimers (A2).
 */
const MCC_EXCLUSION_TO_BUCKET: Record<string, CanonicalCategory> = {
  "5541": "fuel",
  "5542": "fuel",
  "5983": "fuel",
  "5172": "fuel",
  "6513": "rent",
  "4900": "utilities",
};

const MONTHS_PER_YEAR = 12;

/** Which sourced unit value to score with. Both are researched per card, not invented:
 *  "realized" = unit_value_inr_realized (the floor, e.g. Adani's ₹0.90 closed-loop);
 *  "face"     = unit_value_inr          (the best documented redemption, the ceiling). */
export type ValueBasis = "realized" | "face";

/** Sourced unit value for the chosen basis. Realized: program.realized > base.realized > base.face.
 *  Face: program.face > base.face > base.realized. No made-up friction — just the two data points. */
function unitValueFor(
  rewards: RewardRecord,
  programs?: Record<string, LoyaltyProgram>,
  basis: ValueBasis = "realized",
): number | null {
  const program = rewards.loyalty_program ? programs?.[rewards.loyalty_program] : null;
  if (program) {
    return basis === "face"
      ? program.unit_value_inr.face ?? program.unit_value_inr.realized
      : program.unit_value_inr.realized ?? program.unit_value_inr.face;
  }
  const face = rewards.base.unit_value_inr;
  const realized = rewards.base.unit_value_inr_realized;
  if (basis === "face") return face ?? realized ?? null;
  return realized ?? face ?? null;
}

function baseRatePct(
  rewards: RewardRecord | null,
  programs?: Record<string, LoyaltyProgram>,
  basis: ValueBasis = "realized",
): number {
  if (!rewards) return 0;
  const uv = unitValueFor(rewards, programs, basis);
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
  // effective_rate is the receipt-visible total in reward units per
  // effective_per_inr (default: base.per_inr) rupees — e.g. Axis Reserve's
  // "45 points per ₹200" — NOT a percent (schema/DECISIONS.md contract).
  // Convert through unit value like every other earn rate; cashback units
  // are worth ₹1 by definition.
  if (a.effective_rate != null) {
    const uv = unitValue ?? (rewards.currency === "cashback" ? 1 : null);
    if (uv == null) return null;
    const perInr = a.effective_per_inr ?? rewards.base.per_inr;
    return pointsToPct(a.effective_rate, perInr, uv);
  }
  if (a.multiplier != null && unitValue != null) {
    const base = pointsToPct(rewards.base.rate, rewards.base.per_inr, unitValue);
    return base * a.multiplier;
  }
  return null;
}

function acceleratedRateForBucket(
  accelerated: AcceleratedReward[],
  bucket: CanonicalCategory,
  amount: number,
  rewards: RewardRecord,
  ctx: ScoringContext | undefined,
  baseRate: number,
): {
  hit: { rate_pct: number; cap_monthly_inr: number | null; basis: "general" | "channel-locked"; applicability: number } | null;
  narrowUncounted: boolean;
} {
  type Candidate = {
    rate_pct: number;
    cap_monthly_inr: number | null;
    basis: "general" | "channel-locked";
    applicability: number;
    value: number;
  };
  let best: Candidate | null = null;
  let narrowUncounted = false;
  const unitValue = unitValueFor(rewards, ctx?.programs);

  for (const a of accelerated) {
    const buckets = resolveBuckets(a.category, a.canonical_categories);
    if (!buckets.includes(bucket)) continue;

    if (!channelSatisfied(a, ctx)) continue;

    const ratePct = acceleratorRatePct(a, rewards, ctx);
    if (ratePct == null) continue;

    // Applicability: a merchant/MCC/co-brand-specific accelerator only covers a
    // slice of a broad bucket. When that slice isn't authored, refuse to invent
    // one — fall back to base for the bucket and flag it, rather than crediting a
    // narrow rate across the whole bucket.
    const f = applicabilityFraction(a, ctx);
    if (f == null) {
      narrowUncounted = true;
      continue;
    }

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

    const accelSpend = amount * f;
    const grossAccel = (accelSpend * ratePct) / 100;
    const accelValue = capMonthlyInr != null ? Math.min(grossAccel, capMonthlyInr) : grossAccel;
    const baseRemainderValue = (amount * (1 - f) * baseRate) / 100;

    // Rank by realised blended monthly value for THIS user's spend on this
    // bucket, not by headline rate — otherwise a 10% accelerator capped at
    // ₹500/mo always beats a 5% uncapped one on ₹50k spend (where uncapped
    // 5% = ₹2,500 wins), and a narrow co-brand rate beats a broad category one.
    const value = accelValue + baseRemainderValue;

    const basis: "general" | "channel-locked" = a.channel ? "channel-locked" : "general";
    const candidate: Candidate = { rate_pct: ratePct, cap_monthly_inr: capMonthlyInr, basis, applicability: f, value };
    if (!best || candidate.value > best.value) best = candidate;
  }
  return { hit: best, narrowUncounted };
}

/** Converts a cap spec (units + unit-type + cycle) to a monthly INR ceiling. */
function capToMonthlyInr(
  cap: number,
  capUnit: string | undefined,
  cycle: string | undefined,
  unitValue: number | null,
): number | null {
  const unit = capUnit ?? "points";
  let inr: number | null;
  if (unit === "cashback-inr") inr = cap;
  else if (unit === "points" || unit === "miles") inr = unitValue != null ? cap * unitValue : null;
  else inr = null; // spend-inr and unknowns don't apply to base/card-wide caps
  if (inr == null) return null;
  if (cycle === "quarterly") return inr / 3;
  if (cycle === "annual") return inr / 12;
  return inr; // monthly / statement / per-txn ≈ monthly
}

const inr0 = (n: number) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

/**
 * Maps a reward `exclusions[]` category token to a calculator bucket. Only the
 * tokens that overlap the calculator's UI bucket set matter; the rest
 * (wallet-loads, government, insurance-premiums, education, emi, ...) aren't
 * scored buckets anyway.
 */
const EXCLUSION_TO_BUCKET: Partial<Record<string, CanonicalCategory>> = {
  fuel: "fuel",
  rent: "rent",
  utilities: "utilities",
};

export function scoreCard(
  card: EnrichedCard,
  spend: SpendProfile,
  ctx?: ScoringContext,
): CardScore {
  const rewards = card.current_rewards;
  const baseRate = baseRatePct(rewards, ctx?.programs);
  const unitValue = rewards ? unitValueFor(rewards, ctx?.programs) : null;
  // Layer 2: a closed-loop card's points are only real money if the individual uses
  // that ecosystem. When they don't, drop the accelerators — the card earns base only.
  const closedLoopEco = rewards?.redemption_scope === "closed-loop" ? rewards.ecosystem_label ?? null : null;
  const ecoCredited = ecosystemCredited(rewards, ctx);

  const excluded = new Set<CanonicalCategory>();
  for (const ex of rewards?.exclusions ?? []) {
    const b = EXCLUSION_TO_BUCKET[ex];
    if (b) excluded.add(b);
  }
  // MCC exclusions that cover a whole single-MCC-family bucket (fuel/rent/
  // utilities) zero that bucket's earn — not just a disclaimer (A2).
  for (const mcc of rewards?.mcc_exclusions ?? []) {
    const b = MCC_EXCLUSION_TO_BUCKET[mcc];
    if (b) excluded.add(b);
  }

  const buckets: BucketBreakdown[] = [];
  let monthlyValue = 0;
  let baseMonthly = 0; // portion earned at the base rate (subject to base.cap_per_cycle)
  let totalSpend = 0;
  let narrowRatesUncounted = false; // a merchant/co-brand rate we declined to credit (A2)

  for (const bucket of Object.keys(spend) as CanonicalCategory[]) {
    const amount = spend[bucket] || 0;
    totalSpend += amount;
    if (amount <= 0) continue;

    if (excluded.has(bucket)) {
      buckets.push({
        category: bucket,
        monthly_spend: amount,
        effective_rate_pct: 0,
        monthly_value_inr: 0,
        basis: "general",
        note: "Not eligible — excluded category",
      });
      continue;
    }

    let basis: "general" | "channel-locked" = "general";
    let note: string | undefined;
    let effectiveRate = baseRate; // blended rate shown to the user
    let monthlyValueForBucket: number;
    let baseEarned: number; // portion earned at base rate (subject to base.cap_per_cycle)

    const accel = ecoCredited && rewards?.accelerated?.length
      ? acceleratedRateForBucket(rewards.accelerated, bucket, amount, rewards, ctx, baseRate)
      : { hit: null, narrowUncounted: false };
    const hit = accel.hit;
    if (accel.narrowUncounted) narrowRatesUncounted = true;

    if (hit) {
      // Accelerator covers `applicability` of the bucket; the rest earns base.
      const f = hit.applicability;
      let accelValue = (amount * f * hit.rate_pct) / 100;
      if (hit.cap_monthly_inr != null && accelValue > hit.cap_monthly_inr) {
        note = `Capped at ${inr0(hit.cap_monthly_inr)}/mo`;
        accelValue = hit.cap_monthly_inr;
      }
      baseEarned = (amount * (1 - f) * baseRate) / 100;
      monthlyValueForBucket = accelValue + baseEarned;
      basis = hit.basis;
      effectiveRate = amount > 0 ? (monthlyValueForBucket / amount) * 100 : hit.rate_pct;
      if (f < 1 && !note) {
        note = `${Math.round(f * 100)}% of this bucket earns the accelerated rate; the rest earns base`;
      }
    } else {
      monthlyValueForBucket = (amount * baseRate) / 100;
      baseEarned = monthlyValueForBucket;
      effectiveRate = baseRate;
    }

    baseMonthly += baseEarned;
    monthlyValue += monthlyValueForBucket;
    buckets.push({
      category: bucket,
      monthly_spend: amount,
      effective_rate_pct: effectiveRate,
      monthly_value_inr: monthlyValueForBucket,
      basis,
      note,
    });
  }

  const capNotes: string[] = [];

  // Base-rate cap: clamp the base-earned portion (accelerated earn is unaffected).
  if (rewards && typeof rewards.base.cap_per_cycle === "number") {
    const baseCapMonthly = capToMonthlyInr(
      rewards.base.cap_per_cycle,
      rewards.base.cap_unit,
      rewards.base.cycle,
      unitValue,
    );
    if (baseCapMonthly != null && baseMonthly > baseCapMonthly) {
      monthlyValue -= baseMonthly - baseCapMonthly;
      capNotes.push(`Base earn capped at ${inr0(baseCapMonthly)}/mo`);
    }
  }

  // Card-wide reward cap: clamp the total across all categories.
  if (rewards?.reward_cap) {
    const rewardCapMonthly = capToMonthlyInr(
      rewards.reward_cap.max_units,
      rewards.reward_cap.cap_unit,
      rewards.reward_cap.cycle,
      unitValue,
    );
    if (rewardCapMonthly != null && monthlyValue > rewardCapMonthly) {
      monthlyValue = rewardCapMonthly;
      capNotes.push(`Total rewards capped at ${inr0(rewardCapMonthly)}/mo`);
    }
  }

  const annualGross = monthlyValue * MONTHS_PER_YEAR;
  const annualSpend = totalSpend * MONTHS_PER_YEAR;

  const annualFee = card.current_fees?.annual_fee_inr ?? 0;
  const waiverSpend = card.computed.fee_waiver_spend_inr;
  const feeWaived = waiverSpend != null && annualSpend >= waiverSpend;
  const annualFeeEffective = feeWaived ? 0 : annualFee;

  const disclaimerParts: string[] = [...capNotes];
  if (rewards?.capping_rules?.length) disclaimerParts.push(...rewards.capping_rules);
  const mccEx = rewards?.mcc_exclusions;
  if (mccEx?.length) disclaimerParts.push(`Zero rewards on ${mccEx.length} excluded MCC${mccEx.length > 1 ? "s" : ""}`);
  if (rewards?.exclusions?.length) disclaimerParts.push(`Excludes: ${rewards.exclusions.join(", ")}`);
  if (narrowRatesUncounted) {
    disclaimerParts.push(
      "Merchant/co-brand-specific rates shown at base only — enter per-merchant spend to value them",
    );
  }
  if (closedLoopEco && !ecoCredited) {
    disclaimerParts.push(
      `Rewards redeem only in ${closedLoopEco} — shown at base rate because you don't use it; enable ${closedLoopEco} to value them in full`,
    );
  }

  return {
    card,
    annual_gross_inr: annualGross,
    annual_fee_effective_inr: annualFeeEffective,
    annual_net_inr: annualGross - annualFeeEffective,
    fee_waived: feeWaived,
    buckets,
    base_value_inr_monthly: monthlyValue,
    disclaimer: disclaimerParts.length ? disclaimerParts.join("; ") : undefined,
    merchant_rates_uncounted: narrowRatesUncounted || undefined,
    closed_loop_ecosystem: closedLoopEco,
    ecosystem_credited: closedLoopEco ? ecoCredited : undefined,
  };
}

export function rankCards(
  cards: EnrichedCard[],
  spend: SpendProfile,
  ctx?: ScoringContext,
): CardScore[] {
  // Include invite-only cards (Infinia, Kotak Solitaire, Amex Centurion): the calculator
  // is a value comparison, and hiding them makes the top of the market invisible. They carry
  // an "Invite only" chip in the UI so availability is clear.
  return cards
    .filter((c) => c.current_rewards && c.computed.is_active)
    .map((c) => scoreCard(c, spend, ctx))
    .sort((a, b) => b.annual_net_inr - a.annual_net_inr);
}

/** Distinct closed-loop ecosystems across the given cards, for the preference toggles. */
export function listEcosystems(cards: EnrichedCard[]): string[] {
  const s = new Set<string>();
  for (const c of cards) {
    const r = c.current_rewards;
    if (r?.redemption_scope === "closed-loop" && r.ecosystem_label) s.add(r.ecosystem_label);
  }
  return [...s].sort((a, b) => a.localeCompare(b));
}
