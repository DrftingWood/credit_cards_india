import type { EnrichedCard, LoyaltyProgram, BenefitRecord } from "./types";
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
  if (p.lifestyle.recurring.includes("utilities-rent")) sp.utilities = 5000;
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

function loungeValue(b: BenefitRecord | null, pref: LoungePref | null): number {
  if (!b?.lounge_access || !pref || pref === "none") return 0;
  const dom = b.lounge_access.domestic;
  const intl = b.lounge_access.international;
  let inr = 0;

  function visitsAnnual(v: number | "unlimited" | undefined, cycle: string | undefined): number {
    if (v === undefined) return 0;
    if (v === "unlimited") return 24; // cap unlimited at 24/yr proxy
    const c = cycle ?? "annual";
    if (c === "annual") return v;
    if (c === "quarterly") return v * 4;
    if (c === "monthly") return v * 12;
    return v;
  }

  if (pref === "domestic-only") {
    if (dom) inr += visitsAnnual(dom.visits_per_cycle, dom.cycle) * LOUNGE_VALUE_DOMESTIC_INR;
  } else if (pref === "domestic-unlimited") {
    if (dom?.visits_per_cycle === "unlimited") {
      inr += 24 * LOUNGE_VALUE_DOMESTIC_INR;
    }
  } else if (pref === "international") {
    if (dom) inr += visitsAnnual(dom.visits_per_cycle, dom.cycle) * LOUNGE_VALUE_DOMESTIC_INR;
    if (intl) inr += visitsAnnual(intl.visits_per_cycle, intl.cycle) * LOUNGE_VALUE_INTERNATIONAL_INR;
  }
  return inr;
}

function milestonesValue(b: BenefitRecord | null, annualSpendInr: number): number {
  if (!b?.milestones?.length) return 0;
  let total = 0;
  for (const m of b.milestones) {
    if (m.value_inr == null) continue;
    const cycleSpend =
      m.cycle === "annual" ? annualSpendInr :
      m.cycle === "quarterly" ? annualSpendInr / 4 :
      m.cycle === "monthly" ? annualSpendInr / 12 :
      annualSpendInr;
    if (cycleSpend >= m.spend_inr) {
      const occurrences =
        m.cycle === "quarterly" ? 4 :
        m.cycle === "monthly" ? 12 : 1;
      total += m.value_inr * occurrences;
    }
  }
  return total;
}

function welcomeValue(b: BenefitRecord | null, monthlyTotalSpend: number): number {
  if (!b?.welcome?.length) return 0;
  if (monthlyTotalSpend < WELCOME_SPEND_FLOOR_INR_PER_MONTH) {
    // Be conservative: only credit welcome items with no spend condition
    let bare = 0;
    for (const w of b.welcome) {
      if (!w.condition || /joining/i.test(w.condition)) {
        bare += w.value_inr ?? 0;
      }
    }
    return bare / WELCOME_AMORTIZATION_YEARS;
  }
  let total = 0;
  for (const w of b.welcome) total += w.value_inr ?? 0;
  return total / WELCOME_AMORTIZATION_YEARS;
}

function premiumExtrasValue(b: BenefitRecord | null, goals: Goal[]): number {
  if (!goals.includes("premium")) return 0;
  if (!b) return 0;
  let inr = 0;
  if (b.concierge) inr += 2000;
  if (b.golf) inr += 3000;
  for (const o of b.other ?? []) inr += o.value_inr ?? 0;
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
    channelMix: channelMix.size > 0 ? channelMix : undefined,
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

  // Hard filters from goals
  const filtered = eligible.filter((c) => {
    if (payload.goals.includes("lounge") && !c.computed.has_domestic_lounge && !c.computed.has_international_lounge) {
      return false;
    }
    return true;
  });

  const monthlyTotal = Object.values(spend).reduce((a, b) => a + b, 0);
  const annualSpend = monthlyTotal * 12;

  const ranked: RecommendResult[] = filtered.map((card) => {
    const primary = scoreCard(card, spend, ctx);
    const general = scoreCard(card, spend, ctxGeneral);

    const benefits = card.current_benefits;
    const lounge = loungeValue(benefits, payload.lifestyle.lounge_pref);
    const milestones = milestonesValue(benefits, annualSpend);
    const welcome = welcomeValue(benefits, monthlyTotal);
    const premiumExtras = premiumExtrasValue(benefits, payload.goals);
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

  ranked.sort((a, b) => b.rank_total_inr - a.rank_total_inr);
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
