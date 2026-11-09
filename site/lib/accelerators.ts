import type { AcceleratedReward, LoyaltyProgram, RewardRecord } from "./types";
import { type CanonicalCategory, CANONICAL_CATEGORIES, resolveBuckets } from "./category-mapping";
import { pointsToPct } from "./rate-math.mjs";
import type { ScoringContext, SpendProfile, ValueBasis } from "./scoring-context";
import { slabEarn, slabRatePct, slabSpendForValue } from "./slabs";

/** Whether a card's (closed-loop) rewards should be credited in full for this user.
 *  Open cards: always. Closed-loop: only if the user uses that ecosystem (or the
 *  calculator is in optimistic mode with enabledEcosystems undefined). */
export function ecosystemCredited(rewards: RewardRecord | null, ctx: ScoringContext | undefined): boolean {
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
export function isNarrowAccelerator(a: AcceleratedReward): boolean {
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
  // The user's own share for one of this accelerator's merchants is the most specific
  // evidence there is — it is about THIS user — so it wins over a card-level average.
  const userShare = userShareFor(a, ctx);
  if (userShare != null) return userShare;
  if (a.applicability_pct != null) {
    return Math.max(0, Math.min(1, a.applicability_pct / 100));
  }
  return isNarrowAccelerator(a) ? null : 1;
}

/** Merchant tokens an accelerator is scoped to (its channel's, else its own merchants[]). */
export function acceleratorTokens(a: AcceleratedReward): string[] {
  return a.channel?.merchants ?? a.merchants ?? [];
}

/** Largest user-declared share among this accelerator's tokens, clamped to [0, 1]; null when none declared. */
export function userShareFor(a: AcceleratedReward, ctx: ScoringContext | undefined): number | null {
  const shares = ctx?.merchantShares;
  if (!shares) return null;
  let best: number | null = null;
  for (const t of acceleratorTokens(a)) {
    const v = shares[t];
    if (typeof v !== "number" || !Number.isFinite(v)) continue;
    const c = Math.max(0, Math.min(1, v));
    if (best == null || c > best) best = c;
  }
  return best;
}

/** Sourced unit value for the chosen basis. Realized: program.realized > base.realized > base.face.
 *  Face: program.face > base.face > base.realized. No made-up friction — just the two data points.
 *  A record with `unit_value_from_program: false` (its own currency converts into the programme's
 *  at a non-1:1 ratio, D-27) always uses its own base values. */
export function unitValueFor(
  rewards: RewardRecord,
  programs?: Record<string, LoyaltyProgram>,
  basis: ValueBasis = "realized",
): number | null {
  const program = rewards.loyalty_program && rewards.unit_value_from_program !== false
    ? programs?.[rewards.loyalty_program]
    : null;
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

export function baseRatePct(
  rewards: RewardRecord | null,
  programs?: Record<string, LoyaltyProgram>,
  basis: ValueBasis = "realized",
): number {
  if (!rewards) return 0;
  if (rewards.base.rate == null || rewards.base.per_inr == null) return 0;
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

/**
 * Merchant-only accelerators (merchants[] with no channel block) are still
 * brand-scoped products: when the caller supplies a channelMix (the /recommend
 * flow), the elevated rate fires only if one of the accelerator's merchants
 * matches a brand the user picked — otherwise every user's whole bucket earned
 * a co-brand rate they never shop at (the D17 residual, inverted inertness).
 * No channelMix (optimistic /calculator) keeps today's behaviour. Same
 * optimistic-on-selected-brand principle as channelSatisfied: full real rate
 * when the user says they shop there, base otherwise, no invented fraction.
 * Exact token match only — display-name merchants ("Home Centre") that no
 * wizard brand can emit fail closed to base, which is the honest treatment
 * until those accelerators get real channel blocks (D34).
 */
function merchantSatisfied(a: AcceleratedReward, ctx: ScoringContext | undefined): boolean {
  if (a.channel) return true; // channelSatisfied already decided this one
  if (!a.merchants || a.merchants.length === 0) return true;
  if (!ctx || !ctx.channelMix) return true; // optimistic /calculator
  if (ctx.channelMix.size === 0) return false;
  return a.merchants.some((m) => ctx.channelMix!.has(m));
}

/** Sum of program baseline + matching channel bonuses + matching tier bonus, expressed as percent of spend. */
function programStackPct(
  rewards: RewardRecord,
  ctx: ScoringContext | undefined,
  unitValue: number,
): number {
  if (!rewards.loyalty_program || !ctx?.programs || ctx.stackProgramEarn === false) return 0;
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
  const unitValue = unitValueFor(rewards, ctx?.programs, ctx?.valueBasis ?? "realized");

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
    if (perInr == null) return null;
    return pointsToPct(a.effective_rate, perInr, uv);
  }
  if (a.multiplier != null && unitValue != null) {
    if (rewards.base.rate == null || rewards.base.per_inr == null) return null;
    const base = pointsToPct(rewards.base.rate, rewards.base.per_inr, unitValue);
    return base * a.multiplier;
  }
  return null;
}

export interface AcceleratorHit {
  rate_pct: number;
  cap_monthly_inr: number | null;
  basis: "general" | "channel-locked";
  applicability: number;
  /** The accelerator record itself — key for cross-bucket cap accounting. */
  accel: AcceleratedReward;
  /** Accelerated earn credited this bucket (cap-clamped, INR/mo). */
  accel_value_inr: number;
  /** Base earned on accelerated spend beyond the cap (INR/mo). */
  over_cap_base_inr: number;
  /** Base earned on the (1 - applicability) slice (INR/mo). */
  base_remainder_inr: number;
  cap_bound: boolean;
  /** Pre-cap gross accelerated earn this bucket (INR/mo), before the cap clamp. */
  uncapped_accel_inr: number;
}

/**
 * Base rate for one bucket. `base.applies_to_categories`, when authored, means the
 * issuer pays base ONLY on those buckets — elsewhere overflow past an accelerator
 * cap earns nothing rather than dropping to base.
 */
export function baseRateForBucket(rewards: RewardRecord | null, bucket: CanonicalCategory, baseRate: number): number {
  if (rewards?.base?.excluded_categories?.includes(bucket)) return 0;
  const scope = rewards?.base?.applies_to_categories;
  if (!scope || scope.length === 0) return baseRate;
  return scope.includes(bucket) ? baseRate : 0;
}

/** Base cashback from eligible non-accelerated transactions in this statement profile. */
export function baseCashbackPool(
  spend: SpendProfile,
  rewards: RewardRecord | null,
  ctx: ScoringContext | undefined,
  excluded: Set<CanonicalCategory>,
  baseRate: number,
): number {
  if (!rewards || rewards.currency !== "cashback" || baseRate <= 0) return 0;
  let value = 0;
  for (const bucket of CANONICAL_CATEGORIES) {
    const amount = spend[bucket] || 0;
    if (amount <= 0 || excluded.has(bucket)) continue;
    const rate = baseRateForBucket(rewards, bucket, baseRate);
    if (rate <= 0) continue;
    let eligibleShare = 1;
    for (const accelerator of rewards.accelerated ?? []) {
      if (accelerator.over_cap_earns_base !== false) continue;
      if (!resolveBuckets(accelerator.category, accelerator.canonical_categories).includes(bucket)) continue;
      if (!channelSatisfied(accelerator, ctx) || !merchantSatisfied(accelerator, ctx)) continue;
      const share = applicabilityFraction(accelerator, ctx);
      if (share != null) eligibleShare = Math.max(0, eligibleShare - share);
    }
    value += amount * eligibleShare * rate / 100;
  }
  return value;
}

/**
 * What a card's accelerators have already absorbed this cycle, shared by every bucket of
 * one scoring pass. `cap` is rupees credited against each cap pool (an accelerator, or a
 * `cap_group` several accelerators draw on); `spend` is qualifying spend per accelerator,
 * which a marginal slab schedule needs so a later bucket resumes where the earlier one
 * stopped instead of restarting at the bottom slab.
 */
export interface AcceleratorUsage {
  cap: Map<AcceleratedReward | string, number>;
  spend: Map<AcceleratedReward, number>;
}

export function newAcceleratorUsage(): AcceleratorUsage {
  return { cap: new Map(), spend: new Map() };
}

function capKeyOf(a: AcceleratedReward): AcceleratedReward | string {
  return a.cap_group ? `group:${a.cap_group}` : a;
}

/** Records a credited hit so the next bucket sees the cap and slab position it left behind. */
export function recordHit(usage: AcceleratorUsage, hit: AcceleratorHit, bucketSpend: number): void {
  const key = capKeyOf(hit.accel);
  usage.cap.set(key, (usage.cap.get(key) ?? 0) + hit.accel_value_inr);
  usage.spend.set(hit.accel, (usage.spend.get(hit.accel) ?? 0) + bucketSpend * hit.applicability);
}

export function acceleratedRateForBucket(
  accelerated: AcceleratedReward[],
  bucket: CanonicalCategory,
  amount: number,
  rewards: RewardRecord,
  ctx: ScoringContext | undefined,
  baseRate: number,
  usage: AcceleratorUsage,
  capBaseCashback = 0,
): {
  hit: AcceleratorHit | null;
  narrowUncounted: boolean;
} {
  type Candidate = AcceleratorHit & { value: number };
  let best: Candidate | null = null;
  let narrowUncounted = false;
  const unitValue = unitValueFor(rewards, ctx?.programs, ctx?.valueBasis ?? "realized");

  for (const a of accelerated) {
    const buckets = resolveBuckets(a.category, a.canonical_categories);
    if (!buckets.includes(bucket)) continue;

    if (!channelSatisfied(a, ctx)) continue;
    if (!merchantSatisfied(a, ctx)) {
      // A merchant rate exists but the user didn't pick that brand — earn is
      // base for this accelerator, and the caveat still tells them it's there.
      narrowUncounted = true;
      continue;
    }

    // A slab schedule sets its own blended rate for this bucket's spend; fall back
    // to the flat rate otherwise. acceleratorRatePct is still consulted first so a
    // record with slabs AND an unusable flat rate (channel/units) is still skipped.
    const flatRatePct = acceleratorRatePct(a, rewards, ctx);
    if (flatRatePct == null) continue;
    const ratePct = a.slabs?.length
      ? slabRatePct(a.slabs, amount * (applicabilityFraction(a, ctx) ?? 1), usage.spend.get(a) ?? 0) ?? flatRatePct
      : flatRatePct;

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
    if (typeof a.cap_base_multiplier === "number") {
      capMonthlyInr = a.cap_base_multiplier * capBaseCashback;
      if (a.cycle === "quarterly" && capMonthlyInr != null) capMonthlyInr /= 3;
      if (a.cycle === "annual" && capMonthlyInr != null) capMonthlyInr /= 12;
    } else if (typeof a.cap_per_cycle === "number") {
      // Match cap_unit explicitly; the unitValue branch is the points/miles fallback (schema default is "points").
      // Cashback units are worth ₹1 — same fallback the rate path uses, so a
      // cashback card without explicit unit_value_inr can't earn a rate whose
      // cap silently vanishes.
      const capUv = unitValue ?? (rewards.currency === "cashback" ? 1 : null);
      const unit = a.cap_unit ?? "points";
      if (unit === "cashback-inr") {
        capMonthlyInr = a.cap_per_cycle;
      } else if (unit === "spend-inr") {
        capMonthlyInr = (a.cap_per_cycle * ratePct) / 100;
      } else if (capUv != null) {
        capMonthlyInr = a.cap_per_cycle * capUv;
      }
      if (a.cycle === "quarterly" && capMonthlyInr != null) capMonthlyInr = capMonthlyInr / 3;
      if (a.cycle === "annual" && capMonthlyInr != null) capMonthlyInr = capMonthlyInr / 12;
    }

    // The cap is ONE monthly pool shared by every bucket this accelerator
    // covers — subtract what earlier buckets already consumed, otherwise a
    // [dining, online] accelerator gets its cap credited once per bucket.
    const used = usage.cap.get(capKeyOf(a)) ?? 0;
    const remainingCap = capMonthlyInr != null ? Math.max(0, capMonthlyInr - used) : null;

    const accelSpend = amount * f;
    // A slab schedule earns marginally over cumulative spend, so the rate that
    // applies depends on how much this accelerator has already absorbed in
    // earlier buckets. Flat accelerators keep the simple rate × spend form.
    const spentSoFar = usage.spend.get(a) ?? 0;
    const grossAccel = a.slabs?.length
      ? slabEarn(a.slabs, accelSpend, spentSoFar).value
      : (accelSpend * ratePct) / 100;
    const capBound = remainingCap != null && grossAccel > remainingCap;
    const accelValue = capBound ? remainingCap : grossAccel;
    // Spend beyond the cap still earns the base rate on real cards (the same
    // over-cap fallback engine_v2.py models) — not zero, unless the issuer scopes
    // base away from this bucket (base.applies_to_categories).
    const bucketBaseRate = baseRateForBucket(rewards, bucket, baseRate);
    let overCapSpend = 0;
    if (capBound) {
      if (a.slabs?.length) {
        // Walk the schedule to find how much spend the cap actually paid for.
        overCapSpend = Math.max(0, accelSpend - slabSpendForValue(a.slabs, remainingCap!, spentSoFar));
      } else if (ratePct > 0) {
        overCapSpend = accelSpend - (remainingCap! * 100) / ratePct;
      }
    }
    const overCapBase = a.over_cap_earns_base === false
      ? 0
      : (overCapSpend * bucketBaseRate) / 100;
    const baseRemainderValue = (amount * (1 - f) * bucketBaseRate) / 100;

    // Rank by realised blended monthly value for THIS user's spend on this
    // bucket, not by headline rate — otherwise a 10% accelerator capped at
    // ₹500/mo always beats a 5% uncapped one on ₹50k spend (where uncapped
    // 5% = ₹2,500 wins), and a narrow co-brand rate beats a broad category one.
    const value = accelValue + overCapBase + baseRemainderValue;

    const basis: "general" | "channel-locked" = a.channel ? "channel-locked" : "general";
    const candidate: Candidate = {
      rate_pct: ratePct,
      cap_monthly_inr: capMonthlyInr,
      basis,
      applicability: f,
      accel: a,
      accel_value_inr: accelValue,
      over_cap_base_inr: overCapBase,
      base_remainder_inr: baseRemainderValue,
      cap_bound: capBound,
      uncapped_accel_inr: grossAccel,
      value,
    };
    if (!best || candidate.value > best.value) best = candidate;
  }
  return { hit: best, narrowUncounted };
}

/** Converts a cap spec (units + unit-type + cycle) to a monthly INR ceiling. */
export function capToMonthlyInr(
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

