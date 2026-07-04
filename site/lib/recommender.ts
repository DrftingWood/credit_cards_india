import type { EnrichedCard, LoyaltyProgram, BenefitRecord, LoungeDetails } from "./types";
import {
  rankCards as rankByValue,
  scoreCard,
  type CardScore,
  type ScoringContext,
  type SpendProfile,
} from "./calculator";
import { CanonicalCategory } from "./category-mapping";
import {
  LOUNGE_VALUE_DOMESTIC_INR,
  LOUNGE_VALUE_INTERNATIONAL_INR,
  WELCOME_AMORTIZATION_YEARS,
  WELCOME_SPEND_FLOOR_INR_PER_MONTH,
  PROXY_INTL_SPEND_INR_PER_MONTH,
  INCOME_BAND_ANNUAL_INR,
  BRAND_PREF_TO_CHANNELS,
} from "./recommender-constants";

// ─────────────────────────────────────────────────────────────────────────
// Wizard payload shape — kept loosely typed so the form can evolve without
// breaking the scorer. The recommender treats every field as optional.
// ─────────────────────────────────────────────────────────────────────────

export type IncomeBand = "lt-30k" | "30k-75k" | "75k-1.5L" | "1.5L-3L" | "gt-3L";
export type Goal = "cashback" | "travel" | "lounge" | "premium" | "credit-score";
export type SpendBand = "0" | "lt-5k" | "5k-15k" | "15k-30k" | "gt-30k";
export type LoungePref = "none" | "domestic-only" | "domestic-unlimited" | "international";
export type RecurringSpend = "utilities-rent" | "movies-entertainment" | "high-forex" | "bank-portal-bookings";

export interface RecommendPayload {
  income_band: IncomeBand | null;
  goals: Goal[];
  monthly_spend: Record<"online" | "travel" | "dining" | "groceries" | "fuel", SpendBand>;
  brand_preferences: {
    shopping: string[];
    airline: string | null;
    food_ecosystem: string | null;
    fuel_station: string | null;
  };
  lifestyle: {
    lounge_pref: LoungePref | null;
    recurring: RecurringSpend[];
  };
  loyalty_tiers?: Record<string, string | null>;
}

export interface RecommendResult {
  card: EnrichedCard;
  rank_total_inr: number;
  base_score: CardScore;
  breakdown: {
    rewards_inr: number;
    rewards_general_inr: number | null;
    lounge_inr: number;
    milestones_inr: number;
    welcome_inr: number;
    premium_extras_inr: number;
    annual_fee_inr: number;
    forex_cost_inr: number;
  };
  per_category: Array<{
    category: CanonicalCategory;
    inr_used_for_rank: number;
    basis: "channel-locked" | "general";
    also_show?: { general_value_inr: number } | null;
  }>;
  explanations: string[];
  caveats: string[];
}

// ─── helpers ─────────────────────────────────────────────────────────────

const BAND_TO_INR: Record<SpendBand, number> = {
  "0": 0,
  "lt-5k": 2500,
  "5k-15k": 10000,
  "15k-30k": 22500,
  "gt-30k": 40000,
};

const MACRO_TO_BUCKET: Record<string, CanonicalCategory> = {
  online: "online",
  travel: "travel",
  dining: "dining",
  groceries: "groceries",
  fuel: "fuel",
};

function emptySpendProfile(): SpendProfile {
  return {
    online: 0,
    groceries: 0,
    dining: 0,
    fuel: 0,
    travel: 0,
    utilities: 0,
    rent: 0,
    international: 0,
  };
}

function spendFromPayload(p: RecommendPayload): SpendProfile {
  const sp = emptySpendProfile();
  for (const [macro, band] of Object.entries(p.monthly_spend)) {
    const bucket = MACRO_TO_BUCKET[macro];
    if (!bucket) continue;
    sp[bucket] = BAND_TO_INR[band];
  }
  if (p.lifestyle.recurring.includes("utilities-rent")) {
    sp.utilities = 5000;
    sp.rent = 5000;
  }
  if (p.lifestyle.recurring.includes("high-forex")) {
    sp.international = PROXY_INTL_SPEND_INR_PER_MONTH;
  }
  return sp;
}

function channelMixFromPayload(p: RecommendPayload): Set<string> {
  const out = new Set<string>();
  if (p.brand_preferences.airline) {
    for (const m of BRAND_PREF_TO_CHANNELS.airline[p.brand_preferences.airline] ?? []) out.add(m);
  }
  for (const s of p.brand_preferences.shopping) {
    for (const m of BRAND_PREF_TO_CHANNELS.shopping[s] ?? []) out.add(m);
  }
  if (p.brand_preferences.food_ecosystem) {
    for (const m of BRAND_PREF_TO_CHANNELS.food[p.brand_preferences.food_ecosystem] ?? []) out.add(m);
  }
  if (p.brand_preferences.fuel_station) {
    for (const m of BRAND_PREF_TO_CHANNELS.fuel[p.brand_preferences.fuel_station] ?? []) out.add(m);
  }
  // Power-user opt-in: when the user signals they book via bank portals,
  // unlock issuer-portal tokens. By default these stay out of the mix
  // because casual users don't book via SmartBuy / Travel EDGE.
  if (p.lifestyle.recurring.includes("bank-portal-bookings")) {
    for (const m of ["smartbuy", "edge-travel", "edge-mall", "ishop", "sbi-rewardz", "amex-travel"]) {
      out.add(m);
    }
  }
  return out;
}

/** Hard income filter — drop cards whose stated min income exceeds the user's band ceiling. */
function passesIncomeFilter(card: EnrichedCard, band: IncomeBand | null): boolean {
  if (!band) return true;
  const ceiling = INCOME_BAND_ANNUAL_INR[band];
  if (ceiling == null) {
    // Defensive: TS guarantees the band matches IncomeBand at compile time, but
    // payloads deserialized from JSON can carry an unknown string. Don't silently
    // drop every card on type drift — fail open.
    if (typeof console !== "undefined") {
      console.warn(`[recommender] Unknown income band "${band}" — skipping income filter`);
    }
    return true;
  }
  const inc = card.eligibility?.income_inr_annual ?? {};
  const minStated = Math.min(
    inc.salaried ?? Number.POSITIVE_INFINITY,
    inc.self_employed ?? Number.POSITIVE_INFINITY,
  );
  if (!Number.isFinite(minStated)) return true;
  return ceiling >= minStated;
}

// ─── benefits valuation ──────────────────────────────────────────────────

const LOUNGE_CYCLE_MONTHS: Record<string, number> = {
  annual: 12,
  quarterly: 3,
  monthly: 1,
  statement: 1,
  "per-txn": 1,
};

/**
 * Prior-cycle spend gate. Many post-2024 Axis/HDFC/ICICI/SBI lounge programs
 * only hand out complimentary visits if the cardholder spent `spend_threshold_inr`
 * in the previous `spend_threshold_cycle` (usually ₹50k–₹1L/quarter).
 *
 * We don't know the user's real prior-cycle spend, so we model steady state:
 * if their projected spend over the threshold's cycle clears the bar, they'll
 * sustain the unlock; otherwise they won't. First-cycle grace visits (some cards
 * give the first quarter free) are one-off and immaterial to an annualised
 * ranking, so we don't credit them separately — the conservative default the
 * rest of the recommender uses (see A1/A2).
 */
function loungeThresholdMet(det: LoungeDetails | undefined, monthlyTotalSpend: number): boolean {
  if (!det || det.spend_threshold_inr == null) return true;
  const months = LOUNGE_CYCLE_MONTHS[det.spend_threshold_cycle ?? "quarterly"] ?? 3;
  return monthlyTotalSpend * months >= det.spend_threshold_inr;
}

function loungeValue(
  b: BenefitRecord | null,
  pref: LoungePref | null,
  monthlyTotalSpend: number,
): { inr: number; thresholdUnmet: boolean } {
  if (!b?.lounge_access || !pref || pref === "none") return { inr: 0, thresholdUnmet: false };
  const dom = b.lounge_access.domestic;
  const intl = b.lounge_access.international;
  let inr = 0;
  let thresholdUnmet = false;

  function visitsAnnual(v: number | "unlimited" | undefined, cycle: string | undefined): number {
    if (v === undefined) return 0;
    if (v === "unlimited") return 24; // cap unlimited at 24/yr proxy
    const c = cycle ?? "annual";
    if (c === "annual") return v;
    if (c === "quarterly") return v * 4;
    if (c === "monthly") return v * 12;
    return v;
  }

  // Value one lounge scope's visits, gated by its prior-cycle spend threshold.
  // Only flags `thresholdUnmet` when the gate actually removed real visits, so a
  // scope that offers 0 visits anyway doesn't produce a spurious caveat.
  function scopeValue(det: LoungeDetails | undefined, valuePerVisit: number, capAt24 = false): number {
    if (!det) return 0;
    let visits = visitsAnnual(det.visits_per_cycle, det.cycle);
    if (capAt24) visits = Math.min(visits, 24);
    if (visits <= 0) return 0;
    if (!loungeThresholdMet(det, monthlyTotalSpend)) {
      thresholdUnmet = true;
      return 0;
    }
    return visits * valuePerVisit;
  }

  if (pref === "domestic-only") {
    inr += scopeValue(dom, LOUNGE_VALUE_DOMESTIC_INR);
  } else if (pref === "domestic-unlimited") {
    // Stronger preference, but a card offering 16 visits/yr is still ~16 visits
    // of real value — don't zero it out. Cap at the unlimited proxy (24/yr) so
    // a card with a nominal "unlimited" doesn't get rewarded beyond the cap.
    inr += scopeValue(dom, LOUNGE_VALUE_DOMESTIC_INR, true);
  } else if (pref === "international") {
    inr += scopeValue(dom, LOUNGE_VALUE_DOMESTIC_INR);
    inr += scopeValue(intl, LOUNGE_VALUE_INTERNATIONAL_INR);
  }
  return { inr, thresholdUnmet };
}

const MILESTONE_CYCLES_PER_YEAR: Record<string, number> = {
  monthly: 12,
  statement: 12,
  quarterly: 4,
  annual: 1,
  "per-txn": 1,
};

/**
 * Annualised INR value of a card's spend milestones for a given yearly spend.
 *
 * Honours the rich milestone metadata (A4):
 *  - `trigger_window`: "first-year"/"one-time" awards fire once, so they're
 *    amortised over WELCOME_AMORTIZATION_YEARS (like welcome bonuses) instead of
 *    being credited in full every year. "anniversary-year"/"rolling"/legacy
 *    milestones recur and are credited per year.
 *  - `is_repeatable === false`: fires at most once per year even if its spend
 *    cycle is sub-annual (don't multiply a one-shot bonus by 12).
 *  - `max_awards_per_cycle`: a milestone earned every ₹N of spend can be earned
 *    multiple times within a cycle, up to this cap (e.g. Amex SmartEarn: 3×).
 *
 * Exported for unit tests; not part of the recommender's public contract.
 */
export function milestonesValue(b: BenefitRecord | null, annualSpendInr: number): number {
  if (!b?.milestones?.length) return 0;
  let total = 0;
  for (const m of b.milestones) {
    if (m.value_inr == null) continue;
    const cyclesPerYear = MILESTONE_CYCLES_PER_YEAR[m.cycle] ?? 1;
    const perCycleSpend = cyclesPerYear > 0 ? annualSpendInr / cyclesPerYear : annualSpendInr;
    const threshold = m.spend_inr ?? 0;

    // How many times the award is earned within a single spend cycle.
    let awardsThisCycle: number;
    if (threshold <= 0) {
      awardsThisCycle = 1; // flat anniversary bonus with no spend gate
    } else if (perCycleSpend < threshold) {
      awardsThisCycle = 0;
    } else if (m.max_awards_per_cycle != null) {
      // "Earn X every ₹threshold, up to max times per cycle."
      awardsThisCycle = Math.min(Math.floor(perCycleSpend / threshold), m.max_awards_per_cycle);
    } else {
      awardsThisCycle = 1; // crossing the bar once earns one award per cycle
    }
    if (awardsThisCycle <= 0) continue;

    // One-shot awards: fire once, amortised over the ownership horizon.
    if (m.trigger_window === "first-year" || m.trigger_window === "one-time") {
      total += m.value_inr / WELCOME_AMORTIZATION_YEARS;
      continue;
    }

    let annualAwards = awardsThisCycle * cyclesPerYear;
    // A non-repeatable milestone is earned at most once per year regardless of a
    // sub-annual measurement cycle.
    if (m.is_repeatable === false) annualAwards = 1;

    total += m.value_inr * annualAwards;
  }
  return total;
}

/** Parses a welcome `condition` string into (spend ₹, window days), or null if no spend target is stated. Exported for tests; not part of the recommender's public contract. */
export function parseWelcomeCondition(condition: string | null | undefined): { spendInr: number; days: number } | null {
  if (!condition) return null;
  // Matches: "₹50,000 in 90 days", "Rs 1,50,000 within 60 days", "Spend 2 lakh in 90 days", "2L within 60 days".
  const m = condition.match(
    /(?:₹|rs\.?|inr|spend\s+)?\s*([\d,]+(?:\.\d+)?)\s*(lakh|lac|l|k)?\b[\s\S]*?(?:within|in)\s+(\d+)\s*days?/i,
  );
  if (!m) return null;
  let amount = parseFloat(m[1].replace(/,/g, ""));
  const unit = m[2]?.toLowerCase();
  if (unit === "lakh" || unit === "lac" || unit === "l") amount *= 100000;
  else if (unit === "k") amount *= 1000;
  const days = parseInt(m[3], 10);
  if (!Number.isFinite(amount) || amount <= 0 || !Number.isFinite(days) || days <= 0) return null;
  return { spendInr: amount, days };
}

function welcomeValue(b: BenefitRecord | null, monthlyTotalSpend: number): number {
  if (!b?.welcome?.length) return 0;
  let total = 0;
  for (const w of b.welcome) {
    const value = w.value_inr ?? 0;
    if (value === 0) continue;
    // No condition or a joining-fee-only condition: always credit.
    if (!w.condition || /joining/i.test(w.condition)) {
      total += value;
      continue;
    }
    // Parse spend-target conditions per-item so the floor matches the actual ask.
    const parsed = parseWelcomeCondition(w.condition);
    if (parsed) {
      const requiredMonthly = (parsed.spendInr / parsed.days) * 30;
      if (monthlyTotalSpend >= requiredMonthly) total += value;
      continue;
    }
    // Unparseable condition — fall back to the global floor (current behaviour).
    if (monthlyTotalSpend >= WELCOME_SPEND_FLOOR_INR_PER_MONTH) total += value;
  }
  return total / WELCOME_AMORTIZATION_YEARS;
}

function premiumExtrasValue(
  b: BenefitRecord | null,
  goals: Goal[],
  recurring: RecurringSpend[],
): number {
  if (!b) return 0;
  let inr = 0;
  if (goals.includes("premium")) {
    if (b.concierge) inr += 2000;
    if (b.golf) inr += 3000;
    for (const o of b.other ?? []) inr += o.value_inr ?? 0;
  }
  // Credit movies/entertainment perks when the user signals that spend, even
  // outside the premium goal — BookMyShow/PVR perks are valuable for entry-tier
  // cards too. Flat ₹3,000/yr proxy: typical BOGO / discount caps work out to
  // ₹200–500/mo for moderate movie-goers.
  if (recurring.includes("movies-entertainment") && b.movies) {
    inr += 3000;
  }
  return inr;
}

function forexCost(card: EnrichedCard, lifestyle: RecommendPayload["lifestyle"]): number {
  if (!lifestyle.recurring.includes("high-forex")) return 0;
  const pct = card.current_fees?.forex_markup_pct ?? 3.5;
  return (pct / 100) * PROXY_INTL_SPEND_INR_PER_MONTH * 12;
}

// ─── main entry ──────────────────────────────────────────────────────────

export function recommend(
  cards: EnrichedCard[],
  programs: Record<string, LoyaltyProgram>,
  payload: RecommendPayload,
  topN = 5,
): RecommendResult[] {
  const spend = spendFromPayload(payload);
  const channelMix = channelMixFromPayload(payload);
  const tierMap = payload.loyalty_tiers ?? {};

  const ctx: ScoringContext = {
    // Always pass the concrete set — even when empty. An empty set means the
    // user opted into no partner/portal/airline/food/fuel channel, so channel-
    // locked accelerators (SmartBuy, Travel EDGE, co-brand direct, …) must NOT
    // fire for ranking. Passing `undefined` here would flip the calculator into
    // its optimistic mode and unlock those rates without any user signal (A1).
    // `/calculator` stays optimistic by omitting channelMix entirely (see rankByValue).
    channelMix,
    tierMap,
    programs,
  };
  const ctxGeneral: ScoringContext = {
    channelMix: new Set<string>(), // empty = nothing satisfies channel-locked accelerators
    tierMap,
    programs,
  };

  const eligible = cards.filter(
    (c) =>
      c.current_rewards &&
      c.computed.is_active &&
      !c.computed.is_invite_only &&
      passesIncomeFilter(c, payload.income_band),
  );

  // Hard filters from goals — honour the user's lounge_pref so an international-only
  // card doesn't pass a "domestic lounge access" filter.
  const filtered = eligible.filter((c) => {
    if (!payload.goals.includes("lounge")) return true;
    const pref = payload.lifestyle.lounge_pref;
    if (pref === "domestic-only" || pref === "domestic-unlimited") {
      return c.computed.has_domestic_lounge;
    }
    // pref === "international" | "none" | null — accept any meaningful lounge access.
    return c.computed.has_domestic_lounge || c.computed.has_international_lounge;
  });

  const monthlyTotal = Object.values(spend).reduce((a, b) => a + b, 0);
  const annualSpend = monthlyTotal * 12;

  const ranked: RecommendResult[] = filtered.map((card) => {
    const primary = scoreCard(card, spend, ctx);
    const general = scoreCard(card, spend, ctxGeneral);

    const benefits = card.current_benefits;
    const loungeRes = loungeValue(benefits, payload.lifestyle.lounge_pref, monthlyTotal);
    const lounge = loungeRes.inr;
    const milestones = milestonesValue(benefits, annualSpend);
    const welcome = welcomeValue(benefits, monthlyTotal);
    const premiumExtras = premiumExtrasValue(benefits, payload.goals, payload.lifestyle.recurring);
    const fee = primary.annual_fee_effective_inr;
    const forex = forexCost(card, payload.lifestyle);

    const rewardsInr = primary.annual_gross_inr;
    const rankTotal = rewardsInr + lounge + milestones + welcome + premiumExtras - fee - forex;

    const perCategory = primary.buckets.map((bk) => {
      const generalBk = general.buckets.find((g) => g.category === bk.category);
      const generalAnnual = generalBk ? generalBk.monthly_value_inr * 12 : 0;
      const ranked = bk.monthly_value_inr * 12;
      const isLocked = bk.basis === "channel-locked";
      return {
        category: bk.category,
        inr_used_for_rank: ranked,
        basis: bk.basis ?? "general",
        also_show: isLocked && Math.abs(ranked - generalAnnual) > 1
          ? { general_value_inr: generalAnnual }
          : null,
      };
    });

    const explanations = buildExplanations(card, payload, perCategory, primary, programs);
    const caveats = buildCaveats(card, payload, primary, monthlyTotal);
    if (loungeRes.thresholdUnmet) {
      caveats.push(
        "Complimentary lounge access here requires prior-cycle spend you're not projected to reach, so its value is excluded from ranking.",
      );
    }

    return {
      card,
      rank_total_inr: rankTotal,
      base_score: primary,
      breakdown: {
        rewards_inr: rewardsInr,
        rewards_general_inr: general.annual_gross_inr,
        lounge_inr: lounge,
        milestones_inr: milestones,
        welcome_inr: welcome,
        premium_extras_inr: premiumExtras,
        annual_fee_inr: fee,
        forex_cost_inr: forex,
      },
      per_category: perCategory,
      explanations,
      caveats,
    };
  });

  // Secondary sort by card.id keeps the order deterministic on ties — ties are
  // common when many cards collapse to similar low-spend scores.
  ranked.sort((a, b) => {
    const delta = b.rank_total_inr - a.rank_total_inr;
    return delta !== 0 ? delta : a.card.id.localeCompare(b.card.id);
  });
  return ranked.slice(0, topN);
}

function buildExplanations(
  card: EnrichedCard,
  payload: RecommendPayload,
  perCategory: RecommendResult["per_category"],
  score: CardScore,
  programs: Record<string, LoyaltyProgram>,
): string[] {
  const out: string[] = [];

  // Top contributing bucket
  const topBucket = [...perCategory].sort((a, b) => b.inr_used_for_rank - a.inr_used_for_rank)[0];
  if (topBucket && topBucket.inr_used_for_rank > 0) {
    const cat = topBucket.category;
    const inr = Math.round(topBucket.inr_used_for_rank).toLocaleString("en-IN");
    out.push(`Earns about ₹${inr}/yr on your ${cat} spend.`);
  }

  // Goal-based copy
  if (payload.goals.includes("lounge") && (card.computed.has_domestic_lounge || card.computed.has_international_lounge)) {
    out.push("Includes complimentary airport lounge access.");
  }
  if (payload.goals.includes("travel") && card.co_brand?.category === "airline") {
    out.push(`Co-branded with ${card.co_brand.partner} — strongest when you fly with them.`);
  }

  // Loyalty program reference
  const programId = card.current_rewards?.loyalty_program;
  if (programId && programs[programId]) {
    const p = programs[programId];
    const tier = payload.loyalty_tiers?.[programId];
    const tierStr = tier && tier !== "none" && tier !== "standard" ? ` ${tier} tier` : "";
    out.push(`Earns into ${p.name}${tierStr} — realised value ~₹${p.unit_value_inr.realized.toFixed(2)}/unit.`);
  }

  return out;
}

function buildCaveats(
  card: EnrichedCard,
  payload: RecommendPayload,
  score: CardScore,
  monthlyTotal: number,
): string[] {
  const out: string[] = [];

  // Channel reliance
  const channelLocked = score.buckets.filter((b) => b.basis === "channel-locked");
  if (channelLocked.length > 0) {
    const cats = channelLocked.map((b) => b.category).join(", ");
    out.push(`The ${cats} earn rate above assumes you book through your selected partner channel.`);
  }

  // Fee waiver gap
  const waiverSpend = card.computed.fee_waiver_spend_inr;
  if (waiverSpend && monthlyTotal * 12 < waiverSpend && score.annual_fee_effective_inr > 0) {
    const gap = Math.max(0, waiverSpend - monthlyTotal * 12);
    out.push(
      `Fee waiver requires ₹${waiverSpend.toLocaleString("en-IN")}/yr spend; you're projected ₹${gap.toLocaleString("en-IN")} short.`,
    );
  }

  return out;
}

// ─── re-export for callers that just want value ranking ──────────────────
export { rankByValue };
