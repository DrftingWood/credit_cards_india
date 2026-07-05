// ─────────────────────────────────────────────────────────────────────────
// PROTOTYPE — decoupled recommender scorer.
//
// Addresses the structural flaws in docs/RECOMMENDER-FLAWS-2026-07.md WITHOUT
// inventing any weighting constants:
//  - RANK = brand-aware spend rewards − annual fee. Only card-data rates ×
//    user-reported spend. A co-brand rate is credited only when the user
//    actually selects that brand (then it applies to that bucket at its real,
//    possibly-uncapped rate — e.g. Amazon Pay ICICI's uncapped 5% legitimately
//    wins for a heavy Amazon spender). No made-up applicability fraction.
//  - F3/F4/F5/F8: welcome, milestones and lounge are DECOUPLED — shown as
//    separate informational line items, never summed into the rank. Lounge is
//    reported as factual visit counts (no invented per-visit valuation);
//    milestone/welcome carry their data-stated ₹ values.
//  - F7/F10: factual `flags[]` (implausible uncapped rate, category mismatch,
//    implausible milestone) — warnings only; they do not silently alter the rank.
//    Bad data (bob-scapia 20%, uncapped 10%) is flagged, not hidden or fudged;
//    the real fix is the data (D14 etc.).
//
// Side-by-side with recommender.ts (does not replace it). Reuses scoreCard.
// ─────────────────────────────────────────────────────────────────────────

import type { EnrichedCard, LoyaltyProgram, BenefitRecord } from "./types";
import { scoreCard, type ScoringContext, type SpendProfile } from "./calculator";
import { pointsToPct } from "./rate-math.mjs";
import { CanonicalCategory } from "./category-mapping";
import type { RecommendPayload } from "./recommender";
import { INCOME_BAND_ANNUAL_INR, BRAND_PREF_TO_CHANNELS } from "./recommender-constants";

// The scorer invents NO value or spend numbers. The only constants below are
// (a) WARNING thresholds that never change a ₹ figure, and (b) the coarse
// band→₹ mapping, which is a UI-input approximation superseded by `exactSpend`.

/** Warning threshold only — never alters an amount. */
const IMPLAUSIBLE_UNCAPPED_RATE_PCT = 8;
/** A milestone award worth more than this share of its own trigger spend is flagged (warning only). */
const IMPLAUSIBLE_MILESTONE_SHARE = 0.15;

/** Coarse band midpoints for the legacy band input. Prefer `exactSpend` for real amounts. */
const BAND_TO_INR: Record<string, number> = { "0": 0, "lt-5k": 2500, "5k-15k": 10000, "15k-30k": 22500, "gt-30k": 40000 };
const MACRO_TO_BUCKET: Record<string, CanonicalCategory> = { online: "online", travel: "travel", dining: "dining", groceries: "groceries", fuel: "fuel" };
const CYCLE_MONTHS: Record<string, number> = { annual: 12, quarterly: 3, monthly: 1, statement: 1, "per-txn": 1 };

export interface DecoupledScore {
  card: EnrichedCard;
  // THE RANK KEY — spend-grounded, brand-aware, no invented weights.
  net_rewards_inr: number; // annual rewards (given the user's brand selection) − annual fee
  annual_rewards_inr: number;
  annual_fee_inr: number;
  // Decoupled, informational line items (NOT in the rank):
  first_year_bonus_inr: number; // welcome, one-time (data value)
  milestone_value_inr: number; // recurring milestone value (data value)
  lounge_visits: { domestic: number | "unlimited"; international: number | "unlimited" }; // factual, not monetised
  reason: string; // one-line factual "why" (CardExpert-style), derived from the score — never invented
  flags: string[];
}

function emptySpend(): SpendProfile {
  return { online: 0, groceries: 0, dining: 0, fuel: 0, travel: 0, utilities: 0, rent: 0, international: 0 };
}
function spendFromPayload(p: RecommendPayload): SpendProfile {
  const sp = emptySpend();
  for (const [macro, band] of Object.entries(p.monthly_spend)) {
    const b = MACRO_TO_BUCKET[macro];
    if (b) sp[b] = BAND_TO_INR[band] ?? 0;
  }
  // Deliberately do NOT fabricate utilities/rent/international amounts from the
  // recurring toggles (the old engine injected ₹5,000/₹5,000/₹15,000 out of thin
  // air). Those buckets stay 0 unless a real amount is supplied via `exactSpend`.
  return sp;
}
function channelMixFromPayload(p: RecommendPayload): Set<string> {
  const out = new Set<string>();
  if (p.brand_preferences.airline) for (const m of BRAND_PREF_TO_CHANNELS.airline[p.brand_preferences.airline] ?? []) out.add(m);
  for (const s of p.brand_preferences.shopping) for (const m of BRAND_PREF_TO_CHANNELS.shopping[s] ?? []) out.add(m);
  if (p.brand_preferences.food_ecosystem) for (const m of BRAND_PREF_TO_CHANNELS.food[p.brand_preferences.food_ecosystem] ?? []) out.add(m);
  if (p.brand_preferences.fuel_station) for (const m of BRAND_PREF_TO_CHANNELS.fuel[p.brand_preferences.fuel_station] ?? []) out.add(m);
  return out;
}

/** Recurring milestone ₹ value at the card's data-stated values (A4 logic: one-times excluded); also reports whether any award is implausibly large vs its trigger. */
function milestoneRecurring(b: BenefitRecord | null, annualSpendInr: number): { inr: number; implausible: boolean } {
  if (!b?.milestones?.length) return { inr: 0, implausible: false };
  let total = 0;
  let implausible = false;
  for (const m of b.milestones) {
    if (m.value_inr == null) continue;
    if (m.trigger_window === "first-year" || m.trigger_window === "one-time") continue;
    const cyclesPerYear = CYCLE_MONTHS[m.cycle] ? 12 / CYCLE_MONTHS[m.cycle] : 1;
    const perCycleSpend = annualSpendInr / cyclesPerYear;
    const threshold = m.spend_inr ?? 0;
    if (threshold > 0 && perCycleSpend < threshold) continue;
    if (threshold > 0 && m.value_inr > threshold * IMPLAUSIBLE_MILESTONE_SHARE) implausible = true;
    total += m.value_inr * (m.is_repeatable === false ? 1 : cyclesPerYear);
  }
  return { inr: total, implausible };
}

function welcomeOneTime(b: BenefitRecord | null): number {
  if (!b?.welcome?.length) return 0;
  return b.welcome.reduce((s, w) => s + (w.value_inr ?? 0), 0);
}

function loungeVisits(b: BenefitRecord | null): DecoupledScore["lounge_visits"] {
  const la = b?.lounge_access ?? {};
  const annual = (v: number | "unlimited" | undefined, cycle: string | undefined): number | "unlimited" => {
    if (v === undefined) return 0;
    if (v === "unlimited") return "unlimited";
    return v * (12 / (CYCLE_MONTHS[cycle ?? "annual"] ?? 12));
  };
  return { domestic: annual(la.domestic?.visits_per_cycle, la.domestic?.cycle), international: annual(la.international?.visits_per_cycle, la.international?.cycle) };
}

function realizedUnitValue(card: EnrichedCard, programs: Record<string, LoyaltyProgram>): number {
  const r = card.current_rewards;
  if (!r) return 0;
  const lp = r.loyalty_program ? programs[r.loyalty_program] : null;
  if (lp) return lp.unit_value_inr.realized;
  return r.base.unit_value_inr_realized ?? r.base.unit_value_inr ?? (r.currency === "cashback" ? 1 : 0);
}

export function ratesFlags(card: EnrichedCard, topBucket: CanonicalCategory | null, rewardedBuckets: Set<CanonicalCategory>, uv: number): string[] {
  const flags: string[] = [];
  const base = card.current_rewards?.base;
  for (const a of card.current_rewards?.accelerated ?? []) {
    const uncapped = a.cap_per_cycle == null || a.cap_per_cycle === "unlimited";
    if (!uncapped) continue;
    // Only flag BROAD uncapped rates. A channel-gated co-brand rate (IndiGo
    // direct, Amazon, …) is narrow by scope, so a high rate there is expected,
    // not a data error. Use card_attributable_rate when present — the receipt-
    // visible effective_rate double-counts the loyalty programme's own earn
    // (e.g. IndiGo BluChips), which the calculator adds separately.
    if (a.channel) continue;
    const rate = a.card_attributable_rate ?? a.effective_rate;
    const per = a.card_attributable_rate != null ? (a.card_attributable_per_inr ?? 100) : (a.effective_per_inr ?? base?.per_inr ?? 100);
    // Through the shared primitive so per_inr <= 0 can't surface "~Infinity%".
    const ratePct = typeof rate === "number" ? pointsToPct(rate, per, uv) : null;
    if (ratePct != null && ratePct >= IMPLAUSIBLE_UNCAPPED_RATE_PCT) {
      flags.push(`Unusually high uncapped rate (~${ratePct.toFixed(0)}%) — verify against issuer T&C`);
      break;
    }
  }
  if (topBucket && rewardedBuckets.size > 0 && !rewardedBuckets.has(topBucket)) {
    flags.push(`Rewards don't cover your main category (${topBucket})`);
  }
  return flags;
}

const CATEGORY_LABEL: Record<string, string> = {
  online: "online shopping", groceries: "groceries", dining: "dining", fuel: "fuel",
  travel: "travel", utilities: "utility bills", rent: "rent", international: "international",
};

/** One-line factual "why" (CardExpert-style), derived entirely from the score — invents nothing. */
function buildReason(
  buckets: { category: string; monthly_value_inr: number; effective_rate_pct: number }[],
  fee: number,
  lounge: DecoupledScore["lounge_visits"],
  welcome: number,
): string {
  const top = [...buckets].filter((b) => b.monthly_value_inr > 0).sort((a, b) => b.monthly_value_inr - a.monthly_value_inr)[0];
  if (top) {
    const yr = Math.round(top.monthly_value_inr * 12);
    return `Best on your ${CATEGORY_LABEL[top.category] ?? top.category} spend — ~${top.effective_rate_pct.toFixed(1)}% (₹${yr.toLocaleString("en-IN")}/yr)`;
  }
  const hasLounge = lounge.domestic !== 0 || lounge.international !== 0;
  if (hasLounge) return `Airport lounge access${fee === 0 ? " on a fee-free card" : ""}`;
  if (welcome > 0) return `First-year sign-up benefit worth ₹${welcome.toLocaleString("en-IN")}`;
  if (fee === 0) return "Low-cost everyday card (no effective annual fee)";
  return "Everyday rewards card";
}

export interface ScoreOpts {
  topN?: number;
  /** Exact monthly spend per bucket, overriding the coarse band mapping (fixes F9). */
  exactSpend?: Partial<SpendProfile>;
  /** Collapse near-identical variants that share an id stem (keeps the higher-ranked). Default true (F12). */
  dedupeVariants?: boolean;
}

/** Two cards are variants if one id is a `-`-delimited extension of the other (e.g. sbi-pulse / sbi-pulse-sprint, yes-paisabazaar / -rupay). */
function isVariantOf(a: string, b: string): boolean {
  return b.startsWith(a + "-") || a.startsWith(b + "-");
}

export function scoreDecoupled(
  cards: EnrichedCard[],
  programs: Record<string, LoyaltyProgram>,
  payload: RecommendPayload,
  opts: ScoreOpts = {},
): DecoupledScore[] {
  const spend = opts.exactSpend ? { ...emptySpend(), ...opts.exactSpend } : spendFromPayload(payload);
  const annualSpend = Object.values(spend).reduce((a, b) => a + b, 0) * 12;
  const channelMix = channelMixFromPayload(payload);
  const topBucket = (Object.keys(spend) as CanonicalCategory[]).filter((k) => spend[k] > 0).sort((a, b) => spend[b] - spend[a])[0] ?? null;

  // Brand-aware, optimistic-on-selected-brand: a co-brand rate fires (at its real
  // rate) only if the user selected that brand's channel. No applicability fudge.
  const ctx: ScoringContext = { channelMix, tierMap: payload.loyalty_tiers ?? {}, programs };

  const eligible = cards.filter(
    (c) => c.current_rewards && c.computed.is_active && !c.computed.is_invite_only && passesIncome(c, payload.income_band),
  );
  const filtered = eligible.filter((c) => {
    if (!payload.goals.includes("lounge")) return true;
    const pref = payload.lifestyle.lounge_pref;
    if (pref === "domestic-only" || pref === "domestic-unlimited") return c.computed.has_domestic_lounge;
    return c.computed.has_domestic_lounge || c.computed.has_international_lounge;
  });

  const scored: DecoupledScore[] = filtered.map((card) => {
    const uv = realizedUnitValue(card, programs);
    const s = scoreCard(card, spend, ctx);
    const rewardedBuckets = new Set(s.buckets.filter((b) => b.monthly_value_inr > 0).map((b) => b.category));
    const ms = milestoneRecurring(card.current_benefits, annualSpend);
    const flags = ratesFlags(card, topBucket, rewardedBuckets, uv);
    if (ms.implausible) flags.push("Milestone value implausibly large vs its spend trigger — likely a data error");
    const lounge = loungeVisits(card.current_benefits);
    const welcome = Math.round(welcomeOneTime(card.current_benefits));
    return {
      card,
      net_rewards_inr: Math.round(s.annual_gross_inr - s.annual_fee_effective_inr),
      annual_rewards_inr: Math.round(s.annual_gross_inr),
      annual_fee_inr: s.annual_fee_effective_inr,
      first_year_bonus_inr: welcome,
      milestone_value_inr: Math.round(ms.inr),
      lounge_visits: lounge,
      reason: buildReason(s.buckets, s.annual_fee_effective_inr, lounge, welcome),
      flags,
    };
  });

  scored.sort((a, b) => b.net_rewards_inr - a.net_rewards_inr || a.card.id.localeCompare(b.card.id));

  // De-dup near-identical variants (F12): keep the higher-ranked of each variant family.
  const deduped: DecoupledScore[] = [];
  if (opts.dedupeVariants === false) {
    deduped.push(...scored);
  } else {
    for (const s of scored) {
      if (!deduped.some((k) => isVariantOf(k.card.id, s.card.id))) deduped.push(s);
    }
  }
  return deduped.slice(0, opts.topN ?? 5);
}

function passesIncome(card: EnrichedCard, band: RecommendPayload["income_band"]): boolean {
  if (!band) return true;
  const ceiling = INCOME_BAND_ANNUAL_INR[band];
  if (ceiling == null) return true;
  const inc = card.eligibility?.income_inr_annual ?? {};
  const minStated = Math.min(inc.salaried ?? Number.POSITIVE_INFINITY, inc.self_employed ?? Number.POSITIVE_INFINITY);
  return !Number.isFinite(minStated) || ceiling >= minStated;
}
