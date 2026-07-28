// ─────────────────────────────────────────────────────────────────────────
// CAP-AWARE PORTFOLIO ALLOCATION
//
// The decoupled scorer ranks cards INDEPENDENTLY: each card is scored against
// the user's whole spend profile, and the top-N are listed. That answers "which
// single card is best", which is the wrong question whenever a user's spend in
// one bucket dwarfs the monthly caps on that bucket's best rates.
//
// Worked example that motivated this file: ₹1.5L/month of food-delivery spend
// against cards whose 10% rates cap at ₹1,000–1,500 of cashback per month. Ranked
// independently, every card reports its own capped ceiling and the list reads as
// six alternatives. In reality they COMPOSE — each card contributes its own cap,
// and the correct answer is a stack of five, not a winner.
//
// Two structural facts this encodes, both of which the ranked list obscures:
//   1. A cashback cap is denominated in RUPEES OF REWARD, not spend. So a lower
//      headline rate does not reduce a cap-bound card's payout — it only changes
//      how much spend the card absorbs before capping, and therefore how much
//      spills to the next card. Allocation order matters; the payout of an
//      already-cap-bound card does not.
//   2. Cards a user cannot hold simultaneously must never appear in one stack.
//      `metadata.exclusive_group` carries the issuer's co-issue rule.
//
// Rates and caps are PROBED through `scoreCard` rather than re-derived here, so
// channel gating, applicability, ecosystem locks, unit values and base-rate caps
// keep exactly one implementation. This file only decides allocation.
//
// RISING schedules are handled, not assumed away. A card whose marginal rate
// climbs with monthly volume (axis-cashback: 2% on the first ₹5,000, 5% to
// ₹40,000, 7% above) cannot be cherry-picked — its top slab is only reachable by
// first pushing spend through the cheap ones. Those schedules collapse to the
// blended rate they actually deliver over their full width, which is the honest
// number to rank against a flat-rate competitor. Falling (concave) schedules keep
// their per-tranche detail, where greedy allocation is optimal.
// ─────────────────────────────────────────────────────────────────────────

import type { EnrichedCard } from "./types";
import { scoreCard, type ScoringContext, type SpendProfile } from "./calculator";
import { CanonicalCategory } from "./category-mapping";

/** Spend used to measure a card's marginal rate in a bucket. Small enough to sit under real caps. */
const PROBE_SPEND_INR = 100;
/** Spend used to drive a card to its ceiling so the cap becomes observable. */
const SATURATION_SPEND_INR = 1e9;
/** A card earning ≥ this share of the unconstrained amount at saturation is treated as uncapped. */
const UNCAPPED_RATIO = 0.99;
/** Geometric step between curve samples. Smaller = finer breakpoints, more scoreCard calls. */
const CURVE_SAMPLE_RATIO = 1.6;
/** Below this marginal rate a tranche is not worth routing spend to. */
const RESIDUAL_RATE_EPSILON = 0.0001;
/** Value share that counts as "already at the ceiling" when locating saturation. */
const SATURATION_PRECISION = 0.9999;
/** Bisection steps used to sharpen the sampled saturation boundary. */
const SATURATION_REFINE_ITERATIONS = 20;
/** Drop-and-rebuild passes when a fee outweighs a card’s contribution. */
const FEE_REALLOCATION_PASSES = 4;
/** Relative slack when comparing two sampled marginal rates for equality/ordering. */
const RISING_TOLERANCE = 0.02;

export interface PortfolioSlot {
  card: EnrichedCard;
  /** Monthly spend routed to this card, by bucket. */
  allocation: { category: CanonicalCategory; monthly_spend_inr: number; monthly_value_inr: number }[];
  monthly_spend_inr: number;
  monthly_value_inr: number;
  /** Blended realised rate on the spend actually routed here. */
  effective_rate_pct: number;
  /** True when the card's own cap — not a shortage of spend — stopped it earning more. */
  cap_bound: boolean;
  annual_fee_inr: number;
}

export interface Portfolio {
  slots: PortfolioSlot[];
  monthly_value_inr: number;
  annual_value_inr: number;
  annual_fee_inr: number;
  annual_net_inr: number;
  /** Monthly spend no card in the stack could reward — every candidate was cap-bound. */
  unallocated_monthly_spend_inr: number;
  /** Buckets where caps bound before the spend ran out; these are where another card still pays. */
  cap_constrained_categories: CanonicalCategory[];
}

export interface PortfolioOpts {
  /** Hard ceiling on cards in the stack. Omit for unlimited. */
  maxCards?: number;
  /** Cards the user already holds — always eligible, and their groups are pre-claimed. */
  heldCardIds?: string[];
  /** Skip a card whose annual fee exceeds the value it contributes. Default true. */
  dropFeeNegative?: boolean;
}

function emptySpend(): SpendProfile {
  return { online: 0, groceries: 0, dining: 0, fuel: 0, travel: 0, utilities: 0, rent: 0, international: 0 };
}

function valueAt(card: EnrichedCard, bucket: CanonicalCategory, amount: number, ctx: ScoringContext): number {
  const sp = emptySpend();
  sp[bucket] = amount;
  const s = scoreCard(card, sp, ctx);
  return s.annual_gross_inr / 12;
}

/** One linear segment of a card's value curve in a bucket: `ratePct` holds for the next `widthInr` of spend. */
interface Tranche {
  ratePct: number;
  /** Spend width this rate covers. Infinity for the final, uncapped segment. */
  widthInr: number;
}

/**
 * Decompose a card's value curve in one bucket into rate tranches.
 *
 * A capped accelerator does NOT make a card worthless past its cap — the base
 * rate usually continues uncapped underneath. Axis Cashback is the worked case:
 * 7% on online spend up to ₹4,000 of cashback per month, then 0.75% base
 * forever. Modelling that as a single (rate, cap) pair overstates the card
 * badly, because the saturation probe reads uncapped base earnings as though
 * they were accelerator headroom.
 *
 * Rates come from `scoreCard` at several spend levels rather than being
 * re-derived, so accelerator eligibility keeps one implementation.
 */
function tranches(card: EnrichedCard, bucket: CanonicalCategory, ctx: ScoringContext): Tranche[] {
  const v = (x: number) => valueAt(card, bucket, x, ctx);
  const first = (v(PROBE_SPEND_INR) / PROBE_SPEND_INR) * 100;
  if (first <= 0) return [];

  const saturated = v(SATURATION_SPEND_INR);
  if (saturated >= ((SATURATION_SPEND_INR * first) / 100) * UNCAPPED_RATIO) {
    return [{ ratePct: first, widthInr: Number.POSITIVE_INFINITY }];
  }

  // Sample the curve geometrically and read marginal rates off consecutive
  // samples. Sampling rather than bisecting is what lets this see a schedule
  // whose rate RISES with spend (axis-cashback's 2% → 5% → 7% slabs); a
  // bisection for "where the first rate stops holding" silently assumes the
  // rate can only fall.
  const xs: number[] = [];
  for (let x = PROBE_SPEND_INR; x < SATURATION_SPEND_INR; x *= CURVE_SAMPLE_RATIO) xs.push(x);
  xs.push(SATURATION_SPEND_INR);
  const marginals: { from: number; to: number; ratePct: number }[] = [];
  let prevX = 0;
  let prevV = 0;
  for (const x of xs) {
    const value = v(x);
    const rate = ((value - prevV) / (x - prevX)) * 100;
    marginals.push({ from: prevX, to: x, ratePct: Math.max(0, rate) });
    prevX = x;
    prevV = value;
  }

  // Saturation spend: past here the card earns nothing more, so no allocation
  // should be routed to it. Geometric sampling only brackets the boundary, so
  // bisect inside the bracket — routing even a few thousand rupees too many at a
  // dead card is spend that should have spilled to the next one in the stack.
  const satIdx = marginals.findIndex((m) => m.ratePct <= RESIDUAL_RATE_EPSILON);
  let saturationSpend = Number.POSITIVE_INFINITY;
  if (satIdx >= 0) {
    // The true boundary is the SMALLEST spend already earning the ceiling, which
    // lies in the last still-earning interval — not inside the flat one.
    const ceilingValue = v(marginals[satIdx].to);
    let lo = satIdx > 0 ? marginals[satIdx - 1].from : 0;
    let hi = marginals[satIdx].from;
    for (let i = 0; i < SATURATION_REFINE_ITERATIONS; i++) {
      const mid = (lo + hi) / 2;
      if (v(mid) >= ceilingValue * SATURATION_PRECISION) hi = mid;
      else lo = mid;
    }
    saturationSpend = hi;
  }
  const live = satIdx >= 0 ? marginals.slice(0, satIdx) : marginals;
  if (live.length === 0) return [];

  // A RISING schedule cannot be cherry-picked: the top slab is only reachable by
  // first pushing spend through the cheap ones, so its marginal rate is not an
  // offer the allocator can accept on its own. Collapse the whole schedule to the
  // blended rate it actually delivers over its full width — which is the honest
  // number to rank it against a flat-rate competitor.
  const rising = live.some((m, i) => i > 0 && m.ratePct > live[i - 1].ratePct * (1 + RISING_TOLERANCE));
  if (rising && Number.isFinite(saturationSpend)) {
    const blended = (v(saturationSpend) / saturationSpend) * 100;
    return [{ ratePct: blended, widthInr: saturationSpend }];
  }

  // Falling (concave) schedule: merge adjacent samples that share a rate, then
  // emit them in order. Greedy allocation is optimal over these.
  const groups: { from: number; to: number; ratePct: number }[] = [];
  for (const m of live) {
    const last = groups[groups.length - 1];
    if (last && Math.abs(last.ratePct - m.ratePct) < RISING_TOLERANCE * Math.max(1, m.ratePct)) {
      last.to = m.to;
    } else {
      groups.push({ ...m });
    }
  }

  // Geometric sampling only BRACKETS each rate change; the boundary itself can sit
  // anywhere inside the last interval. Left unrefined, a 10%-capped-at-₹1,000 card
  // reports a width of ₹6,872 instead of ₹10,000 and the allocator under-fills the
  // best rate while over-spilling to worse ones. Bisect each junction so widths are
  // the real cap boundaries.
  for (let i = 0; i < groups.length - 1; i++) {
    const g = groups[i];
    const startV = v(g.from);
    let lo = g.from;
    let hi = groups[i + 1].to;
    for (let k = 0; k < SATURATION_REFINE_ITERATIONS; k++) {
      const mid = (lo + hi) / 2;
      const linearHere = startV + ((mid - g.from) * g.ratePct) / 100;
      if (v(mid) >= linearHere * SATURATION_PRECISION) lo = mid;
      else hi = mid;
    }
    g.to = lo;
    groups[i + 1].from = lo;
  }

  const out: Tranche[] = groups
    .filter((g) => g.to > g.from)
    .map((g) => ({ ratePct: g.ratePct, widthInr: g.to - g.from }));
  if (!Number.isFinite(saturationSpend) && out.length > 0) {
    out[out.length - 1].widthInr = Number.POSITIVE_INFINITY;
  }
  return out;
}

/**
 * Annual fee net of a spend waiver, judged on the spend actually ROUTED to this
 * card. Judging it on the user's whole spend is what let ICICI Emeralde into a
 * stack at "₹0" — its ₹12,000 fee waives at ₹10L, which the profile total clears
 * but the card's own ₹1L share does not.
 */
function annualFeeForRouted(card: EnrichedCard, routedMonthly: SpendProfile, ctx: ScoringContext): number {
  return scoreCard(card, routedMonthly, ctx).annual_fee_effective_inr;
}

/** Two cards are variants when one id extends the other (yes-paisabazaar / -rupay). */
function isVariantOf(a: string, b: string): boolean {
  return b.startsWith(a + "-") || a.startsWith(b + "-");
}

/**
 * Build the best STACK of cards for a spend profile, respecting each card's
 * monthly caps and the issuer co-issue rules in `metadata.exclusive_group`.
 *
 * Greedy by marginal rate, which is optimal here: within a bucket the options are
 * independent (each card's cap is its own pool), so filling the highest rate
 * first and spilling the remainder down the list maximises total reward.
 */
function allocateOnce(
  candidates: EnrichedCard[],
  spend: SpendProfile,
  ctx: ScoringContext,
  opts: PortfolioOpts,
): Portfolio {
  const buckets = (Object.keys(spend) as CanonicalCategory[]).filter((b) => spend[b] > 0);
  const held = new Set(opts.heldCardIds ?? []);

  // Pre-claim the groups of cards the user already holds: a held Swiggy HDFC
  // makes Swiggy BLCK unobtainable, so it must not enter the stack at all.
  const claimedGroups = new Set<string>();
  for (const c of candidates) {
    if (held.has(c.id) && c.metadata?.exclusive_group) claimedGroups.add(c.metadata.exclusive_group);
  }

  const slots = new Map<string, PortfolioSlot>();
  const capConstrained: CanonicalCategory[] = [];
  let unallocated = 0;

  for (const bucket of buckets) {
    // Flatten every card's value curve into individually-rated segments, then
    // fill the highest-rate segment first. Greedy is optimal because segments
    // are independent — each draws on its own card's cap.
    const segments = candidates
      .flatMap((card) => tranches(card, bucket, ctx).map((t) => ({ card, ...t })))
      .filter((s) => s.ratePct > 0)
      .sort((a, b) => b.ratePct - a.ratePct || a.card.id.localeCompare(b.card.id));

    let remaining = spend[bucket];

    for (const seg of segments) {
      if (remaining <= 0) break;

      const group = seg.card.metadata?.exclusive_group;
      const alreadyIn = slots.has(seg.card.id);
      if (!alreadyIn) {
        // A held card pre-claims its own group, so exempt it here — otherwise
        // holding Swiggy HDFC blocks Swiggy HDFC, and the stack silently loses
        // the best rate the user already has.
        if (group && claimedGroups.has(group) && !held.has(seg.card.id)) continue;
        // Near-identical variants of one product (yes-paisabazaar / -rupay) are
        // one choice, not two independent caps.
        if ([...slots.keys()].some((id) => isVariantOf(id, seg.card.id))) continue;
        if (opts.maxCards != null && slots.size >= opts.maxCards) continue;
      }

      // A card's earlier tranche in this same bucket has already consumed part of
      // its curve; only the width beyond that is still available.
      const slotSoFar = slots.get(seg.card.id);
      const consumedHere = slotSoFar?.allocation.filter((a) => a.category === bucket).reduce((t, a) => t + a.monthly_spend_inr, 0) ?? 0;
      const width = Math.max(0, seg.widthInr - consumedHere);
      let take = Math.min(remaining, width);
      if (take <= 0) continue;

      // Tranche widths are measured PER BUCKET, but a cap and a slab schedule are
      // shared across every bucket the accelerator covers. Without a cross-bucket
      // check a card looks like it has fresh capacity in each one — axis-cashback
      // absorbed ₹70,709 of dining AND ₹20,000 of online while saturating at
      // ₹70,714 total, so the extra ₹20,000 earned nothing and never spilled to a
      // card that would have paid for it. Clamp to what the card can still earn.
      if (slotSoFar && slotSoFar.monthly_spend_inr > 0) {
        const routedSoFar = emptySpend();
        for (const a of slotSoFar.allocation) routedSoFar[a.category] += a.monthly_spend_inr;
        const before = scoreCard(seg.card, routedSoFar, ctx).annual_gross_inr / 12;
        const gain = (t: number) => {
          const probe = { ...routedSoFar };
          probe[bucket] += t;
          return scoreCard(seg.card, probe, ctx).annual_gross_inr / 12 - before;
        };
        // Shrink `take` to the largest amount that still earns close to its
        // tranche rate. If the card is already saturated this collapses to zero
        // and the spend correctly spills to the next card.
        if (gain(take) < ((take * seg.ratePct) / 100) * SATURATION_PRECISION) {
          let lo = 0;
          let hi = take;
          for (let k = 0; k < SATURATION_REFINE_ITERATIONS; k++) {
            const mid = (lo + hi) / 2;
            if (gain(mid) >= ((mid * seg.ratePct) / 100) * SATURATION_PRECISION) lo = mid;
            else hi = mid;
          }
          take = lo;
        }
        if (take <= RESIDUAL_RATE_EPSILON) continue;
      }

      if (!alreadyIn) {
        if (group) claimedGroups.add(group);
        slots.set(seg.card.id, {
          card: seg.card,
          allocation: [],
          monthly_spend_inr: 0,
          monthly_value_inr: 0,
          effective_rate_pct: 0,
          cap_bound: false,
          annual_fee_inr: 0,
        });
      }
      const slot = slots.get(seg.card.id)!;
      slot.allocation.push({ category: bucket, monthly_spend_inr: take, monthly_value_inr: (take * seg.ratePct) / 100 });
      slot.monthly_spend_inr += take;
      // A finite tranche that ran out before the spend did is a cap binding.
      if (Number.isFinite(seg.widthInr) && take >= width && remaining > width) slot.cap_bound = true;
      remaining -= take;
    }

    if (remaining > 0) {
      unallocated += remaining;
      capConstrained.push(bucket);
    }
  }

  // Re-score each card against the spend actually routed to it. The tranche model
  // decides ALLOCATION; scoreCard is the authority on VALUE, so a cap shared
  // across buckets is never credited twice, the totals reconcile exactly with the
  // per-card calculator, and any spend-based fee waiver is judged on this card's
  // own share rather than on the user's whole profile.
  const out = [...slots.values()];
  for (const s of out) {
    const routed = emptySpend();
    for (const a of s.allocation) routed[a.category] += a.monthly_spend_inr;
    s.monthly_value_inr = scoreCard(s.card, routed, ctx).annual_gross_inr / 12;
    s.effective_rate_pct = s.monthly_spend_inr > 0 ? (s.monthly_value_inr / s.monthly_spend_inr) * 100 : 0;
    s.annual_fee_inr = annualFeeForRouted(s.card, routed, ctx);
  }
  out.sort((a, b) => b.monthly_value_inr - a.monthly_value_inr || a.card.id.localeCompare(b.card.id));

  const monthly = out.reduce((t, s) => t + s.monthly_value_inr, 0);
  const fees = out.reduce((t, s) => t + s.annual_fee_inr, 0);
  return {
    slots: out,
    monthly_value_inr: monthly,
    annual_value_inr: monthly * 12,
    annual_fee_inr: fees,
    annual_net_inr: monthly * 12 - fees,
    unallocated_monthly_spend_inr: unallocated,
    cap_constrained_categories: capConstrained,
  };
}

/**
 * Build the best STACK of cards for a spend profile, respecting each card's
 * monthly caps and the issuer co-issue rules in `metadata.exclusive_group`.
 *
 * Greedy by marginal rate, which is optimal here: within a bucket the options are
 * independent (each card's cap is its own pool), so filling the highest rate
 * first and spilling the remainder down the list maximises total reward.
 *
 * A card whose fee outweighs what it contributes is dropped and the stack REBUILT,
 * because dropping one frees its spend for the others — and a card's fee waiver
 * depends on the spend it ends up with, so the two decisions are circular and have
 * to be iterated rather than settled in one pass.
 */
export function allocatePortfolio(
  candidates: EnrichedCard[],
  spend: SpendProfile,
  ctx: ScoringContext = {},
  opts: PortfolioOpts = {},
): Portfolio {
  let pool = candidates;
  let result = allocateOnce(pool, spend, ctx, opts);
  if (opts.dropFeeNegative === false) return result;

  for (let i = 0; i < FEE_REALLOCATION_PASSES; i++) {
    const losers = new Set(
      result.slots.filter((s) => s.monthly_value_inr * 12 <= s.annual_fee_inr).map((s) => s.card.id),
    );
    if (losers.size === 0) break;
    pool = pool.filter((c) => !losers.has(c.id));
    result = allocateOnce(pool, spend, ctx, opts);
  }
  // A survivor of the final pass may still be fee-negative if the loop ran out of
  // passes; drop those rather than report a stack that loses money.
  const kept = result.slots.filter((s) => s.monthly_value_inr * 12 > s.annual_fee_inr);
  if (kept.length === result.slots.length) return result;
  const monthly = kept.reduce((t, s) => t + s.monthly_value_inr, 0);
  const fees = kept.reduce((t, s) => t + s.annual_fee_inr, 0);
  return { ...result, slots: kept, monthly_value_inr: monthly, annual_value_inr: monthly * 12, annual_fee_inr: fees, annual_net_inr: monthly * 12 - fees };
}
