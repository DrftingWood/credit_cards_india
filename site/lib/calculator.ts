import type { EnrichedCard, RewardRecord } from "./types";
import { CanonicalCategory, CATEGORY_LABELS } from "./category-mapping";
import { explainValueComponents, type LoyaltyTierItem, type ValueComponents, type ValuePrefs } from "./value-components";
import type { ScoringContext, SpendProfile, ValueBasis } from "./scoring-context";
import {
  acceleratedRateForBucket,
  acceleratorTokens,
  baseCashbackPool,
  baseRateForBucket,
  baseRatePct,
  capToMonthlyInr,
  ecosystemCredited,
  isNarrowAccelerator,
  newAcceleratorUsage,
  recordHit,
  unitValueFor,
  userShareFor,
  type AcceleratorHit,
} from "./accelerators";

// The engine is split by job: scoring-context.ts (inputs), slabs.ts (marginal schedules),
// accelerators.ts (rates, gates, caps for one bucket). This file runs the per-card pass and
// shapes it for the rank (scoreCard) and the breakdown (explainCard). Existing import paths
// keep working through these re-exports.
export type { ScoringContext, SpendProfile, ValueBasis } from "./scoring-context";
export { slabEarn } from "./slabs";
export { acceleratorTokens, unitValueFor } from "./accelerators";

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
  /** D-26: forex markup (+ GST) on the user's international spend, ₹/yr. Already netted out of annual_net_inr. */
  annual_forex_inr: number;
  /** Rank total: annual_gross_inr − annual_fee_effective_inr − annual_forex_inr. */
  annual_net_inr: number;
  fee_waived: boolean;
  /** True when the data states no annual fee (null), so the ₹0 above is "unknown", not "free" (CALC-7). */
  fee_unknown?: boolean;
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


/** Waiver-aware effective annual fee: 0 (or reduced, once modeled) once the user's
 *  annualized spend clears the card's fee-waiver threshold. Shared by scoreCard and
 *  explainCard so the /calculator rank and the per-card breakdown always agree (FIX 2).
 *  A null fee is counted as ₹0 and reported as `feeUnknown`, never silently as "free". */
function effectiveAnnualFee(
  card: EnrichedCard,
  annualSpend: number,
): { annualFeeEffective: number; feeWaived: boolean; feeUnknown: boolean } {
  const stated = card.current_fees?.annual_fee_inr ?? null;
  const waiverSpend = card.computed.fee_waiver_spend_inr;
  const feeWaived = waiverSpend != null && annualSpend >= waiverSpend;
  return { annualFeeEffective: feeWaived ? 0 : stated ?? 0, feeWaived, feeUnknown: stated == null };
}

/**
 * GST on the forex markup, as a fraction. ASSUMPTION, NOT YET VERIFIED (D-26): the usual
 * 18% GST on card fees and charges, applied to the markup amount. Check against an issuer
 * MITC or a CBIC source before this ships. Applied only when the fee record's
 * `gst_applicable` is not false.
 */
export const GST_ON_FOREX_MARKUP = 0.18;

export interface ForexCost {
  /** ₹/yr: international monthly spend × 12 × markup% × (1 + GST when applicable). */
  annual_inr: number;
  /** The card's stated markup, or null when the data doesn't state one (then annual_inr is 0). */
  markup_pct: number | null;
  /** GST rate added on top of the markup (GST_ON_FOREX_MARKUP, an unverified assumption), or 0 when the fees are GST-exempt. */
  gst_rate: number;
}

/** D-26: what the card's forex markup costs this user a year. Never guesses a missing markup. */
export function forexCost(card: EnrichedCard, spend: SpendProfile): ForexCost {
  const markup = card.current_fees?.forex_markup_pct ?? null;
  const gstRate = card.current_fees?.gst_applicable === false ? 0 : GST_ON_FOREX_MARKUP;
  const intl = Math.max(0, spend.international || 0);
  if (markup == null || markup <= 0 || intl <= 0) return { annual_inr: 0, markup_pct: markup, gst_rate: gstRate };
  return { annual_inr: intl * MONTHS_PER_YEAR * (markup / 100) * (1 + gstRate), markup_pct: markup, gst_rate: gstRate };
}

/** One bucket of the earn pass, before the card-wide clamps. */
interface BucketEarn {
  category: CanonicalCategory;
  monthly_spend: number;
  /** The card pays nothing here (exclusions / mcc_exclusions). */
  excluded: boolean;
  /** Base rate the issuer pays on THIS bucket (0 when base is scoped away from it). */
  base_rate_pct: number;
  /** The accelerator credited on this bucket, cap-clamped; null = base only. */
  hit: AcceleratorHit | null;
  monthly_value_inr: number;
}

/** Everything scoreCard and explainCard both need from one pass over the spend profile. */
interface EarnPass {
  rewards: RewardRecord | null;
  /** Card-level base rate, before any per-bucket scoping. */
  base_rate_pct: number;
  unit_value: number | null;
  closed_loop_ecosystem: string | null;
  ecosystem_credited: boolean;
  buckets: BucketEarn[];
  /** Monthly rupees after base.cap_per_cycle and reward_cap. The per-bucket values stay pre-clamp. */
  monthly_value_inr: number;
  cap_notes: string[];
  monthly_spend_inr: number;
  /** A merchant/co-brand rate was left at base because nothing says the user shops there (A2). */
  narrow_rates_uncounted: boolean;
}

/** Buckets the card pays nothing on, from its category and single-MCC-family exclusions (A2). */
function excludedBuckets(rewards: RewardRecord | null): Set<CanonicalCategory> {
  const excluded = new Set<CanonicalCategory>();
  for (const ex of rewards?.exclusions ?? []) {
    const b = EXCLUSION_TO_BUCKET[ex];
    if (b) excluded.add(b);
  }
  for (const mcc of rewards?.mcc_exclusions ?? []) {
    const b = MCC_EXCLUSION_TO_BUCKET[mcc];
    if (b) excluded.add(b);
  }
  return excluded;
}

/**
 * Applies base.cap_per_cycle (to the base-earned portion only) and then the card-wide
 * reward_cap (to the total). Returns the clamped monthly value and the notes to show.
 */
function applyCardWideCaps(
  rewards: RewardRecord | null,
  unitValue: number | null,
  monthlyValue: number,
  baseMonthly: number,
): { monthlyValue: number; notes: string[] } {
  const notes: string[] = [];
  if (!rewards) return { monthlyValue, notes };
  // Cashback units are worth ₹1 when no explicit unit value is authored —
  // keep cap conversion consistent with the earn-rate fallback.
  const capUnitValue = unitValue ?? (rewards.currency === "cashback" ? 1 : null);
  let value = monthlyValue;

  if (typeof rewards.base.cap_per_cycle === "number") {
    const baseCap = capToMonthlyInr(rewards.base.cap_per_cycle, rewards.base.cap_unit, rewards.base.cycle, capUnitValue);
    if (baseCap != null && baseMonthly > baseCap) {
      value -= baseMonthly - baseCap;
      notes.push(`Base earn capped at ${inr0(baseCap)}/mo`);
    }
  }
  if (rewards.reward_cap) {
    const cap = rewards.reward_cap;
    const rewardCap = capToMonthlyInr(cap.max_units, cap.cap_unit, cap.cycle, capUnitValue);
    if (rewardCap != null && value > rewardCap) {
      value = rewardCap;
      notes.push(`Total rewards capped at ${inr0(rewardCap)}/mo`);
    }
  }
  return { monthlyValue: value, notes };
}

/**
 * The single earn pass. scoreCard (the rank) and explainCard (the breakdown beside it) are
 * two views of this result, so they cannot disagree. When each walked the buckets itself
 * they drifted twice (slab resume point, bucket-scoped base) and one card showed two totals.
 */
function earnPass(card: EnrichedCard, spend: SpendProfile, ctx: ScoringContext | undefined): EarnPass {
  const rewards = card.current_rewards;
  const basis: ValueBasis = ctx?.valueBasis ?? "realized";
  const baseRate = baseRatePct(rewards, ctx?.programs, basis);
  const unitValue = rewards ? unitValueFor(rewards, ctx?.programs, basis) : null;
  // Layer 2: a closed-loop card's points are only real money if the individual uses
  // that ecosystem. When they don't, drop the accelerators — the card earns base only.
  const closedLoopEco = rewards?.redemption_scope === "closed-loop" ? rewards.ecosystem_label ?? null : null;
  const ecoCredited = ecosystemCredited(rewards, ctx);
  const excluded = excludedBuckets(rewards);
  const capBaseCashback = baseCashbackPool(spend, rewards, ctx, excluded, baseRate);

  const buckets: BucketEarn[] = [];
  let monthlyValue = 0;
  let baseMonthly = 0; // portion earned at the base rate (subject to base.cap_per_cycle)
  let totalSpend = 0;
  let narrowRatesUncounted = false;
  const usage = newAcceleratorUsage();

  for (const bucket of Object.keys(spend) as CanonicalCategory[]) {
    // A negative or non-numeric amount is no spend: it must not shrink the annual total
    // that fee waivers are tested against.
    const raw = spend[bucket];
    const amount = typeof raw === "number" && Number.isFinite(raw) && raw > 0 ? raw : 0;
    if (amount <= 0) continue;
    totalSpend += amount;

    if (excluded.has(bucket)) {
      buckets.push({ category: bucket, monthly_spend: amount, excluded: true, base_rate_pct: 0, hit: null, monthly_value_inr: 0 });
      continue;
    }

    const bucketBaseRate = baseRateForBucket(rewards, bucket, baseRate);
    const accel = rewards && ecoCredited && rewards.accelerated?.length
      ? acceleratedRateForBucket(rewards.accelerated, bucket, amount, rewards, ctx, baseRate, usage, capBaseCashback)
      : { hit: null, narrowUncounted: false };
    const hit = accel.hit;
    if (accel.narrowUncounted) narrowRatesUncounted = true;

    let value: number;
    if (hit) {
      // The hit already carries cap-clamped values, so the credited rupees equal the value
      // the candidate was ranked by (and the shared cap pool holds). Over-cap spend and the
      // non-applicable slice both earn base, so both count toward base.cap_per_cycle.
      recordHit(usage, hit, amount);
      const baseEarned = hit.base_remainder_inr + hit.over_cap_base_inr;
      baseMonthly += baseEarned;
      value = hit.accel_value_inr + baseEarned;
    } else {
      value = (amount * bucketBaseRate) / 100;
      baseMonthly += value;
    }
    monthlyValue += value;
    buckets.push({ category: bucket, monthly_spend: amount, excluded: false, base_rate_pct: bucketBaseRate, hit, monthly_value_inr: value });
  }

  const capped = applyCardWideCaps(rewards, unitValue, monthlyValue, baseMonthly);
  return {
    rewards,
    base_rate_pct: baseRate,
    unit_value: unitValue,
    closed_loop_ecosystem: closedLoopEco,
    ecosystem_credited: ecoCredited,
    buckets,
    monthly_value_inr: capped.monthlyValue,
    cap_notes: capped.notes,
    monthly_spend_inr: totalSpend,
    narrow_rates_uncounted: narrowRatesUncounted,
  };
}

function bucketBreakdown(b: BucketEarn, cardBaseRate: number): BucketBreakdown {
  const row: BucketBreakdown = {
    category: b.category,
    monthly_spend: b.monthly_spend,
    effective_rate_pct: b.base_rate_pct,
    monthly_value_inr: b.monthly_value_inr,
    basis: "general",
    note: undefined,
  };
  if (b.excluded) {
    row.note = "Not eligible — excluded category";
  } else if (b.hit) {
    // Blended rate shown to the user: accelerated share plus whatever earned base.
    row.basis = b.hit.basis;
    row.effective_rate_pct = (b.monthly_value_inr / b.monthly_spend) * 100;
    if (b.hit.cap_bound && b.hit.cap_monthly_inr != null) {
      row.note = `Capped at ${inr0(b.hit.cap_monthly_inr)}/mo`;
    } else if (b.hit.applicability < 1) {
      row.note = `${Math.round(b.hit.applicability * 100)}% of this bucket earns the accelerated rate; the rest earns base`;
    }
  } else if (b.base_rate_pct === 0 && cardBaseRate > 0) {
    row.note = "Base rate not paid on this category";
  }
  return row;
}

/** The caveats shown under a card's score, in a fixed order. */
function scoreDisclaimer(pass: EarnPass, feeUnknown: boolean, forexUnknown: boolean): string | undefined {
  const { rewards } = pass;
  const parts: string[] = [...pass.cap_notes];
  if (rewards?.capping_rules?.length) parts.push(...rewards.capping_rules);
  if (rewards?.base?.rate == null || rewards?.base?.per_inr == null) {
    parts.push("Base earn rate is unverified; estimate excludes base rewards");
  }
  const mccEx = rewards?.mcc_exclusions;
  if (mccEx?.length) parts.push(`Zero rewards on ${mccEx.length} excluded MCC${mccEx.length > 1 ? "s" : ""}`);
  if (rewards?.exclusions?.length) parts.push(`Excludes: ${rewards.exclusions.join(", ")}`);
  if (pass.narrow_rates_uncounted) {
    parts.push("Merchant/co-brand-specific rates shown at base only — enter per-merchant spend to value them");
  }
  if (feeUnknown) parts.push("Annual fee not stated, counted as ₹0");
  if (forexUnknown) parts.push("Forex markup not stated, counted as ₹0");
  const eco = pass.closed_loop_ecosystem;
  if (eco && !pass.ecosystem_credited) {
    parts.push(
      `Rewards redeem only in ${eco} — shown at base rate because you don't use it; enable ${eco} to value them in full`,
    );
  }
  return parts.length ? parts.join("; ") : undefined;
}

export function scoreCard(
  card: EnrichedCard,
  spend: SpendProfile,
  ctx?: ScoringContext,
): CardScore {
  const pass = earnPass(card, spend, ctx);
  const annualGross = pass.monthly_value_inr * MONTHS_PER_YEAR;
  const { annualFeeEffective, feeWaived, feeUnknown } = effectiveAnnualFee(card, pass.monthly_spend_inr * MONTHS_PER_YEAR);
  const forex = forexCost(card, spend);
  const forexUnknown = forex.markup_pct == null && (spend.international || 0) > 0;
  const eco = pass.closed_loop_ecosystem;

  return {
    card,
    annual_gross_inr: annualGross,
    annual_fee_effective_inr: annualFeeEffective,
    annual_forex_inr: forex.annual_inr,
    annual_net_inr: annualGross - annualFeeEffective - forex.annual_inr,
    fee_waived: feeWaived,
    fee_unknown: feeUnknown || undefined,
    buckets: pass.buckets.map((b) => bucketBreakdown(b, pass.base_rate_pct)),
    base_value_inr_monthly: pass.monthly_value_inr,
    disclaimer: scoreDisclaimer(pass, feeUnknown, forexUnknown),
    merchant_rates_uncounted: pass.narrow_rates_uncounted || undefined,
    closed_loop_ecosystem: eco,
    ecosystem_credited: eco ? pass.ecosystem_credited : undefined,
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

export interface AcceleratorExplain {
  category: CanonicalCategory; label: string;
  monthly_spend: number;
  rate_pct: number;
  /** Share (0–1) of this bucket the accelerated rate applies to; the rest earns base. Omitted = whole bucket. */
  applicability?: number;
  uncapped_value_inr: number;
  cap_monthly_inr: number | null;
  cap_bound: boolean;
  lost_to_cap_inr: number;      // uncapped − capped (0 if unbound/no cap)
  base_spillover_inr: number;   // base earned on over-cap spend
  net_value_inr: number;        // monthly net for this accelerator's bucket
  factors: string[];            // realistic: cuts applied; absolute: constraints stated
}
export interface BaseSpendExplain { category: CanonicalCategory; label: string; monthly_spend: number; rate_pct: number; value_inr: number; }
export interface CardExplanation {
  layer: "realistic" | "absolute";
  value_basis: ValueBasis;
  accelerators: AcceleratorExplain[];
  base_spend: BaseSpendExplain[];
  annual_gross_inr: number; annual_fee_inr: number;
  /** D-26: forex markup (+ GST) on international spend, ₹/yr; netted out of annual_net_inr. */
  annual_forex_inr: number;
  annual_net_inr: number;
  /** True when the data states no annual fee, so the 0 in annual_fee_inr means "unknown" (CALC-7). */
  fee_unknown?: boolean;
  /** Phase 2: welcome / milestone / lounge line items + year-1 vs steady-state totals.
   *  Present only when the caller passes ValuePrefs; never part of annual_net_inr (the rank). */
  value_components?: ValueComponents;
}

/**
 * The user's declared programme tier bonus (D-9: programme earn, not card earn), on the
 * spend that flows through this card's stacks_with_program accelerators, valued at the
 * layer's own unit value. Null when no tier is declared in ctx.tierLine, the tier is
 * unknown, nothing qualifies, or ctx.tierMap already stacks a tier into the rate.
 */
function loyaltyTierBonus(
  rewards: RewardRecord | null,
  ctx: ScoringContext | undefined,
  qualifyingAnnualSpend: number,
  unitValue: number | null,
): LoyaltyTierItem | null {
  const id = rewards?.loyalty_program;
  if (!id || !ctx || !ctx.tierPrograms || unitValue == null || qualifyingAnnualSpend <= 0) return null;
  if (ctx.programs && ctx.tierMap?.[id]) return null; // already stacked into the rate (/recommend)
  const program = ctx.tierPrograms[id];
  const tierId = ctx.tierLine?.[id];
  const tier = tierId ? program?.earn?.tiers?.find((t) => t.id === tierId) : undefined;
  if (!program || !tier || !(tier.bonus_per_inr > 0) || !(tier.bonus_rate > 0)) return null;
  return {
    program_id: id, program_name: program.name, tier_id: tier.id, tier_name: tier.name ?? tier.id,
    qualifying_spend_annual_inr: Math.round(qualifyingAnnualSpend),
    annual_inr: (qualifyingAnnualSpend * tier.bonus_rate / tier.bonus_per_inr) * unitValue,
  };
}

export function explainCard(
  card: EnrichedCard,
  spend: SpendProfile,
  ctx?: ScoringContext,
  valuePrefs?: ValuePrefs,
): CardExplanation {
  const pass = earnPass(card, spend, ctx);
  const { rewards } = pass;
  const basis: ValueBasis = ctx?.valueBasis ?? "realized";
  // Layer is inferred from the context the caller built (see Global Constraints).
  const layer: "realistic" | "absolute" = ctx?.applyApplicability ? "realistic" : "absolute";

  // The rows below are pre-clamp (what each bucket earned on its own); the totals carry
  // base.cap_per_cycle and reward_cap. scoreCard's per-bucket breakdown has the same shape.
  const accelerators: AcceleratorExplain[] = [];
  const base_spend: BaseSpendExplain[] = [];
  let stackingSpendMonthly = 0; // spend through stacks_with_program accelerators — where a programme tier bonus is earned
  for (const b of pass.buckets) {
    const label = CATEGORY_LABELS[b.category] ?? b.category;
    const hit = b.hit;
    if (!hit) {
      base_spend.push({ category: b.category, label, monthly_spend: b.monthly_spend, rate_pct: b.base_rate_pct, value_inr: b.monthly_value_inr });
      continue;
    }
    if (hit.accel.stacks_with_program) stackingSpendMonthly += b.monthly_spend * hit.applicability;
    accelerators.push({
      category: b.category, label, monthly_spend: b.monthly_spend, rate_pct: hit.rate_pct, applicability: hit.applicability,
      uncapped_value_inr: hit.uncapped_accel_inr, cap_monthly_inr: hit.cap_monthly_inr,
      cap_bound: hit.cap_bound, lost_to_cap_inr: Math.max(0, hit.uncapped_accel_inr - hit.accel_value_inr),
      base_spillover_inr: hit.over_cap_base_inr,
      net_value_inr: b.monthly_value_inr, factors: buildFactors(layer, hit, rewards, ctx),
    });
  }

  const annualGross = pass.monthly_value_inr * MONTHS_PER_YEAR;
  const { annualFeeEffective, feeUnknown } = effectiveAnnualFee(card, pass.monthly_spend_inr * MONTHS_PER_YEAR);
  const forex = forexCost(card, spend);
  const out: CardExplanation = {
    layer, value_basis: basis, accelerators, base_spend,
    annual_gross_inr: annualGross, annual_fee_inr: annualFeeEffective, annual_forex_inr: forex.annual_inr,
    annual_net_inr: annualGross - annualFeeEffective - forex.annual_inr,
  };
  if (feeUnknown) out.fee_unknown = true;
  if (valuePrefs) {
    out.value_components = explainValueComponents(
      card, spend,
      {
        annual_gross_inr: annualGross, annual_fee_inr: annualFeeEffective, forex,
        loyalty_tier: loyaltyTierBonus(rewards, ctx, stackingSpendMonthly * MONTHS_PER_YEAR, pass.unit_value),
      },
      valuePrefs,
    );
  }
  return out;
}

/** The constraint/cut list shown per accelerator row. Realistic: what was cut.
 *  Absolute: what the number assumes/requires. Facts only — from the hit + card. */
function buildFactors(
  layer: "realistic" | "absolute",
  hit: AcceleratorHit,
  rewards: RewardRecord | null,
  ctx?: ScoringContext,
): string[] {
  const f: string[] = [];
  if (hit.cap_bound && hit.cap_monthly_inr != null) {
    f.push(`Cap ${inr0(hit.cap_monthly_inr)}/mo reached — extra spend earns base`);
  } else if (hit.cap_monthly_inr != null) {
    f.push(`Capped at ${inr0(hit.cap_monthly_inr)}/mo`);
  }
  if (hit.basis === "channel-locked") {
    const ch = hit.accel.channel?.merchants?.join(", ") ?? hit.accel.channel?.class ?? "a specific channel";
    f.push(layer === "absolute" ? `Requires booking via ${ch}` : `Credited only when you book via ${ch}`);
  }
  const userShare = layer === "realistic" ? userShareFor(hit.accel, ctx) : null;
  if (userShare != null) {
    const via = acceleratorTokens(hit.accel).filter((t) => ctx?.merchantShares?.[t] != null).join(", ");
    f.push(`${Math.round(userShare * 100)}% of this bucket via ${via} (your estimate)${userShare < 1 ? "; the rest earns base" : ""}`);
  } else if (hit.applicability < 1) {
    f.push(`${Math.round(hit.applicability * 100)}% of this bucket earns the accelerated rate; the rest earns base`);
  } else if (layer === "absolute" && isNarrowAccelerator(hit.accel)) {
    f.push(`Assumes 100% of this bucket qualifies`);
  }
  if (rewards && rewards.currency !== "cashback") {
    f.push(layer === "absolute" ? `Valued at face` : `Valued at realized redemption value`);
  }
  return f;
}
