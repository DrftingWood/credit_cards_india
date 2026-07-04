// ─────────────────────────────────────────────────────────────────────────
// Recommend-wizard payload shape.
//
// The scoring logic that used to live here (recommend(), lounge/milestone/
// welcome/premium valuations) has been removed: it summed unbounded, invented
// value proxies (₹1,500/visit lounge, ₹2,000 concierge, amortised welcome, …)
// into one rank — see docs/RECOMMENDER-FLAWS-2026-07.md. The live /recommend
// page now uses `scorer-decoupled.ts`, which invents no value/spend numbers.
// This module is the shared payload type only.
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
