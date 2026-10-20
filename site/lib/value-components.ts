// ─────────────────────────────────────────────────────────────────────────
// Value components — roadmap Phase 2 ("full value components").
//
// The steady-state calculators rank on spend rewards − annual fee and nothing
// else (D-18 / D18 decoupling). This module computes everything ELSE a card is
// worth — welcome benefit, spend milestones, lounge access — as separate,
// labelled line items, and composes them into three honest totals:
//
//   steady_state  = rewards net of the annual fee + recurring milestones + lounge
//   first_year    = rewards − JOINING fee + welcome + every milestone + lounge
//   tenure avg    = (first_year + (n − 1) × steady_state) / n   (n = user input)
//
// It never feeds a rank. It invents no values:
//  - welcome / milestone ₹ figures are the card data's own `value_inr`; an item
//    with no stated value is listed and contributes ₹0;
//  - a welcome benefit is counted only if its stated ₹ spend condition (parsed
//    from the condition text, never guessed) is met by the user's spend;
//  - a milestone counts only when the user's per-cycle spend reaches its trigger,
//    and multiplies only by the data's own `max_awards_per_cycle`;
//  - lounge is monetised ONLY from the user's own usage input (visits they would
//    actually use × what a visit is worth to them). The per-visit ₹ proxies the
//    old recommender used (₹1,500 / ₹2,500) were invented and were removed.
// Implausibly large milestones are flagged, not clipped (D19: warn, don't fudge).
// ─────────────────────────────────────────────────────────────────────────

import type { BenefitRecord, Cycle, EnrichedCard, LoungeDetails } from "./types";
import type { SpendProfile } from "./calculator";

type Milestone = NonNullable<BenefitRecord["milestones"]>[number];

/** Months per cycle. Statement / per-txn are treated as monthly (same as scorer-decoupled). */
export const CYCLE_MONTHS: Record<Cycle, number> = { annual: 12, quarterly: 3, monthly: 1, statement: 1, "per-txn": 1 };
/** Warning threshold only — a milestone award worth more than this share of its own trigger spend is flagged. Never alters a ₹ figure. */
export const IMPLAUSIBLE_MILESTONE_SHARE = 0.15;
const DAYS_PER_YEAR = 365;
export const MAX_TENURE_YEARS = 10;

/** User-supplied valuation inputs. Nothing here comes from the dataset. */
export interface ValuePrefs {
  /** Years the user expects to hold the card — spreads one-offs in the tenure average. */
  tenure_years: number;
  /** Lounge visits per year the user would actually use. */
  lounge_visits: { domestic: number; international: number };
  /** What one visit is worth to the user (e.g. what they'd otherwise pay), ₹. */
  lounge_value_inr: { domestic: number; international: number };
}

/** No lounge usage entered → lounge is shown as an allowance, valued at ₹0. */
export const DEFAULT_VALUE_PREFS: ValuePrefs = {
  tenure_years: 3,
  lounge_visits: { domestic: 0, international: 0 },
  lounge_value_inr: { domestic: 0, international: 0 },
};

export interface WelcomeItem {
  benefit: string;
  condition: string | null;
  value_inr: number | null;
  /** counted = adds to year 1; not-met = stated spend condition not reached; unvalued = no ₹ value in the data. */
  status: "counted" | "not-met" | "unvalued";
  /** Spend the condition requires, when the text states one. */
  spend_required_inr: number | null;
  /** The user's spend over the condition's window (only when spend_required_inr is set). */
  spend_in_window_inr: number | null;
  window_days: number | null;
}

export interface MilestoneItem {
  benefit: string;
  spend_inr: number;
  cycle: Cycle;
  /** recurring = every year; first-year = a first-year / one-time award (year 1 only). */
  kind: "recurring" | "first-year";
  value_inr: number | null;
  reached: boolean;
  /** reached = counted; short = trigger not reached; unvalued = no ₹ in data; counted-in-fee = a fee waiver the annual-fee figure already nets. */
  status: "reached" | "short" | "unvalued" | "counted-in-fee";
  spend_per_cycle_inr: number;
  shortfall_inr: number;
  awards_per_year: number;
  annual_value_inr: number;
  implausible: boolean;
}

export interface LoungeItem {
  scope: "domestic" | "international";
  /** Visits per year the card grants; null when the data states access but no count. */
  allowance_per_year: number | "unlimited" | null;
  spend_threshold_inr: number | null;
  spend_threshold_cycle: Cycle | null;
  unlocked: boolean;
  used_visits: number;
  value_per_visit_inr: number;
  value_inr: number;
  via: string[];
}

export interface ValueComponents {
  welcome: { items: WelcomeItem[]; total_inr: number };
  milestones: { items: MilestoneItem[]; recurring_annual_inr: number; first_year_only_inr: number };
  lounge: { items: LoungeItem[]; annual_inr: number };
  steady_state: { rewards_net_inr: number; milestones_inr: number; lounge_inr: number; total_inr: number };
  first_year: {
    rewards_gross_inr: number; fee_inr: number; welcome_inr: number;
    milestones_inr: number; lounge_inr: number; total_inr: number;
  };
  tenure_years: number;
  tenure_avg_annual_inr: number;
  flags: string[];
}

const cyclesPerYear = (c: Cycle | undefined): number => 12 / (CYCLE_MONTHS[c ?? "annual"] ?? 12);

/**
 * Awards a milestone pays in ONE cycle at the given per-cycle spend. A zero trigger
 * (a perk paid on fee payment) is one award. Multiples only when the data says so
 * via `max_awards_per_cycle` (e.g. "1 ticket per ₹10,000, up to 10") — otherwise one.
 */
export function milestoneAwardsPerCycle(m: Milestone, perCycleSpend: number): number {
  const t = m.spend_inr ?? 0;
  if (t <= 0) return 1;
  if (perCycleSpend < t) return 0;
  const max = m.max_awards_per_cycle;
  if (m.is_repeatable !== false && max != null && max > 1) return Math.min(max, Math.floor(perCycleSpend / t));
  return 1;
}

const LAKH = 100000;
/** "Spend ₹5,000 …", "spends of Rs. 1 lakh …", "spend INR 50k …" → the ₹ amount. Null when no explicit ₹ spend is stated. */
const WELCOME_SPEND = /\bspend(?:s|ing)?\s+(?:of\s+|above\s+|over\s+|at\s+least\s+|a\s+minimum\s+of\s+|minimum\s+)?(?:₹|rs\.?|inr)\s*([\d,]+(?:\.\d+)?)\s*(lakhs?|lacs?|l\b|k\b)?/i;
const WITHIN_DAYS = /\b(\d{1,3})\s*days?\b/i;

export function welcomeSpendRequirement(condition: string | null | undefined): number | null {
  if (!condition) return null;
  const m = WELCOME_SPEND.exec(condition);
  if (!m) return null;
  const n = Number(m[1].replace(/,/g, ""));
  if (!Number.isFinite(n) || n <= 0) return null;
  const unit = (m[2] ?? "").toLowerCase();
  if (unit.startsWith("l")) return n * LAKH;
  if (unit === "k") return n * 1000;
  return n;
}

/** A milestone that IS the renewal-fee waiver: the waiver-aware annual fee already nets it. */
function isFeeWaiverMilestone(m: Milestone, card: EnrichedCard): boolean {
  if (m.reward_kind === "fee-waiver") return true;
  const waiver = card.computed.fee_waiver_spend_inr;
  return waiver != null && m.spend_inr === waiver && /\bwaive[rd]?\b|\bwaiver\b/i.test(m.benefit);
}

function welcomeItems(b: BenefitRecord | null, monthlySpend: number): WelcomeItem[] {
  return (b?.welcome ?? []).map((w) => {
    const required = welcomeSpendRequirement(w.condition);
    const days = w.window_days ?? (w.condition ? Number(WITHIN_DAYS.exec(w.condition)?.[1] ?? NaN) : NaN);
    const windowDays = Number.isFinite(days) && days > 0 ? days : null;
    // No stated window → the condition can be met at any point in the first year.
    const inWindow = required != null ? (monthlySpend * 12 * (windowDays ?? DAYS_PER_YEAR)) / DAYS_PER_YEAR : null;
    const met = required == null || (inWindow ?? 0) >= required;
    const status: WelcomeItem["status"] = w.value_inr == null ? "unvalued" : met ? "counted" : "not-met";
    return {
      benefit: w.benefit, condition: w.condition ?? null, value_inr: w.value_inr ?? null, status,
      spend_required_inr: required, spend_in_window_inr: inWindow != null ? Math.round(inWindow) : null,
      window_days: windowDays,
    };
  });
}

function milestoneItems(card: EnrichedCard, annualSpend: number): MilestoneItem[] {
  return (card.current_benefits?.milestones ?? []).map((m) => {
    const perYear = cyclesPerYear(m.cycle);
    const perCycle = annualSpend / perYear;
    const awardsPerCycle = milestoneAwardsPerCycle(m, perCycle);
    const awardsPerYear = m.is_repeatable === false ? Math.min(1, awardsPerCycle) : awardsPerCycle * perYear;
    const reached = awardsPerCycle > 0;
    const threshold = m.spend_inr ?? 0;
    const kind: MilestoneItem["kind"] = m.trigger_window === "first-year" || m.trigger_window === "one-time" ? "first-year" : "recurring";
    const status: MilestoneItem["status"] = isFeeWaiverMilestone(m, card)
      ? "counted-in-fee"
      : m.value_inr == null ? "unvalued" : reached ? "reached" : "short";
    return {
      benefit: m.benefit, spend_inr: threshold, cycle: m.cycle, kind, value_inr: m.value_inr ?? null, reached, status,
      spend_per_cycle_inr: Math.round(perCycle),
      shortfall_inr: reached ? 0 : Math.round(threshold - perCycle),
      awards_per_year: awardsPerYear,
      annual_value_inr: status === "reached" ? Math.round((m.value_inr ?? 0) * awardsPerYear) : 0,
      implausible: threshold > 0 && m.value_inr != null && m.value_inr > threshold * IMPLAUSIBLE_MILESTONE_SHARE,
    };
  });
}

function loungeAllowance(l: LoungeDetails): number | "unlimited" | null {
  const v = l.visits_per_cycle;
  if (v == null) return null;
  if (v === "unlimited") return "unlimited";
  return v * cyclesPerYear(l.cycle);
}

function loungeItems(b: BenefitRecord | null, monthlySpend: number, prefs: ValuePrefs): LoungeItem[] {
  const out: LoungeItem[] = [];
  for (const scope of ["domestic", "international"] as const) {
    const l = b?.lounge_access?.[scope];
    if (!l) continue;
    const allowance = loungeAllowance(l);
    const threshold = l.spend_threshold_inr ?? null;
    const thresholdCycle: Cycle | null = threshold != null ? l.spend_threshold_cycle ?? l.cycle ?? "quarterly" : null;
    const unlocked = threshold == null || monthlySpend * CYCLE_MONTHS[thresholdCycle ?? "quarterly"] >= threshold;
    const wanted = Math.max(0, prefs.lounge_visits[scope] || 0);
    const used = !unlocked || allowance == null ? 0 : allowance === "unlimited" ? wanted : Math.min(wanted, allowance);
    const perVisit = Math.max(0, prefs.lounge_value_inr[scope] || 0);
    out.push({
      scope, allowance_per_year: allowance, spend_threshold_inr: threshold, spend_threshold_cycle: thresholdCycle,
      unlocked, used_visits: used, value_per_visit_inr: perVisit, value_inr: Math.round(used * perVisit), via: l.via ?? [],
    });
  }
  return out;
}

/**
 * Everything beyond the steady-state spend rewards, for one card at one spend profile.
 * `rewards` is the steady-state result the caller already computed (explainCard's
 * annual gross + waiver-aware annual fee) so the totals reconcile with the rank.
 */
export function explainValueComponents(
  card: EnrichedCard,
  spend: SpendProfile,
  rewards: { annual_gross_inr: number; annual_fee_inr: number },
  prefs: ValuePrefs = DEFAULT_VALUE_PREFS,
): ValueComponents {
  const monthly = Object.values(spend).reduce((a, b) => a + (b || 0), 0);
  const annualSpend = monthly * 12;
  const b = card.current_benefits;

  const welcome = welcomeItems(b, monthly);
  const welcomeTotal = Math.round(welcome.filter((w) => w.status === "counted").reduce((s, w) => s + (w.value_inr ?? 0), 0));

  const milestones = milestoneItems(card, annualSpend);
  const sumKind = (k: MilestoneItem["kind"]) => milestones.filter((m) => m.kind === k).reduce((s, m) => s + m.annual_value_inr, 0);
  const recurring = sumKind("recurring");
  const firstYearOnly = sumKind("first-year");

  const lounge = loungeItems(b, monthly, prefs);
  const loungeTotal = lounge.reduce((s, l) => s + l.value_inr, 0);

  const rewardsNet = rewards.annual_gross_inr - rewards.annual_fee_inr;
  const steadyTotal = rewardsNet + recurring + loungeTotal;
  const joiningFee = card.current_fees?.joining_fee_inr ?? card.current_fees?.annual_fee_inr ?? 0;
  const fyMilestones = recurring + firstYearOnly;
  const firstYearTotal = rewards.annual_gross_inr - joiningFee + welcomeTotal + fyMilestones + loungeTotal;

  const n = Math.min(MAX_TENURE_YEARS, Math.max(1, Math.round(prefs.tenure_years || 1)));
  const flags: string[] = [];
  if (milestones.some((m) => m.implausible)) flags.push("Milestone value implausibly large vs its spend trigger — likely a data error");

  return {
    welcome: { items: welcome, total_inr: welcomeTotal },
    milestones: { items: milestones, recurring_annual_inr: recurring, first_year_only_inr: firstYearOnly },
    lounge: { items: lounge, annual_inr: loungeTotal },
    steady_state: { rewards_net_inr: rewardsNet, milestones_inr: recurring, lounge_inr: loungeTotal, total_inr: steadyTotal },
    first_year: {
      rewards_gross_inr: rewards.annual_gross_inr, fee_inr: joiningFee, welcome_inr: welcomeTotal,
      milestones_inr: fyMilestones, lounge_inr: loungeTotal, total_inr: firstYearTotal,
    },
    tenure_years: n,
    tenure_avg_annual_inr: Math.round((firstYearTotal + (n - 1) * steadyTotal) / n),
    flags,
  };
}
