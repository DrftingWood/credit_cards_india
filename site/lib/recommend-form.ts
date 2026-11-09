// The /recommend wizard's form model: option lists, state shape and the pure rules that
// decide which questions show and what the scorer receives. No React here, so the rules
// are unit-tested directly (recommend-form.test.ts).
import type { LoyaltyProgram } from "./types";
import type { IncomeBand, RecommendPayload } from "./recommender";
import { BRAND_PREF_TO_CHANNELS } from "./recommender-constants";

// ─────────────────────────────────────────────────────────────────────────────
// Types — kept narrow so TypeScript catches every option mismatch.
// The on-submit JSON payload uses these literal strings as-is so a downstream
// recommendation algorithm can switch on them without re-parsing free text.
// IncomeBand is imported (rather than redeclared) so the type and the
// INCOME_BAND_ANNUAL_INR record can't drift.
// ─────────────────────────────────────────────────────────────────────────────

export type Goal = "cashback" | "travel" | "lounge" | "premium" | "credit-score";
export type MacroCategory = "online" | "travel" | "dining" | "groceries" | "fuel";
export type SpendBand = "0" | "lt-5k" | "5k-15k" | "15k-30k" | "gt-30k";
export type ShoppingPlatform = "amazon" | "flipkart" | "tata-neu" | "myntra" | "nykaa" | "others";
export type AirlinePref = "indigo" | "air-india-vistara" | "ota";
export type FoodEcosystem = "swiggy" | "zomato-blinkit" | "bigbasket-zepto" | "offline";
export type FuelStation = "iocl" | "bpcl" | "hpcl" | "none";
export type LoungePref = "none" | "domestic-only" | "domestic-unlimited" | "international";
export type RecurringSpend = "utilities-rent" | "movies-entertainment" | "high-forex" | "bank-portal-bookings";

export interface FormState {
  income: IncomeBand | null;
  goals: Goal[]; // up to 2, ordered by selection
  spend: Record<MacroCategory, SpendBand>;
  shoppingPlatforms: ShoppingPlatform[]; // ranked, up to 2
  airline: AirlinePref | null;
  foodEcosystem: FoodEcosystem | null;
  fuelStation: FuelStation | null;
  loungePref: LoungePref | null;
  recurring: RecurringSpend[];
  loyaltyTiers: Record<string, string | null>; // program-id → tier-id (or null)
}

export const INITIAL_STATE: FormState = {
  income: null,
  goals: [],
  spend: { online: "0", travel: "0", dining: "0", groceries: "0", fuel: "0" },
  shoppingPlatforms: [],
  airline: null,
  foodEcosystem: null,
  fuelStation: null,
  loungePref: null,
  recurring: [],
  loyaltyTiers: {},
};

// ─────────────────────────────────────────────────────────────────────────────
// Option labels. Keeping them next to the type defs so adding a new variant
// to the union forces an exhaustive-record TS error here.
// ─────────────────────────────────────────────────────────────────────────────

export const INCOME_OPTIONS: Array<{ id: IncomeBand; label: string }> = [
  { id: "lt-30k", label: "< ₹30k" },
  { id: "30k-75k", label: "₹30k – ₹75k" },
  { id: "75k-1.5L", label: "₹75k – ₹1.5L" },
  { id: "1.5L-3L", label: "₹1.5L – ₹3L" },
  { id: "gt-3L", label: "₹3L+" },
];

export const GOAL_OPTIONS: Array<{ id: Goal; label: string; hint: string }> = [
  { id: "cashback", label: "Maximising cashback", hint: "Direct INR back on every spend" },
  { id: "travel", label: "Free flights & travel", hint: "Air miles, hotel points, redemptions" },
  { id: "lounge", label: "Lounge access", hint: "Domestic and international airports" },
  { id: "premium", label: "Premium lifestyle", hint: "Concierge, golf, dining privileges" },
  { id: "credit-score", label: "Building credit score", hint: "Easy approval, low fees" },
];

export const SPEND_BAND_OPTIONS: Array<{ id: SpendBand; label: string }> = [
  { id: "0", label: "₹0" },
  { id: "lt-5k", label: "< ₹5k" },
  { id: "5k-15k", label: "₹5k – ₹15k" },
  { id: "15k-30k", label: "₹15k – ₹30k" },
  { id: "gt-30k", label: "₹30k+" },
];

export const MACRO_CATEGORIES: Array<{ id: MacroCategory; label: string; sub: string }> = [
  { id: "online", label: "Online shopping & electronics", sub: "Amazon, Flipkart, marketplaces" },
  { id: "travel", label: "Travel (flights & hotels)", sub: "Bookings via airline / OTA / hotel direct" },
  { id: "dining", label: "Food delivery & dining out", sub: "Swiggy, Zomato, restaurants" },
  { id: "groceries", label: "Groceries & quick commerce", sub: "BigBasket, Zepto, Blinkit, supermarkets" },
  { id: "fuel", label: "Fuel & commute", sub: "Petrol pumps, FASTag" },
];

export const SHOPPING_OPTIONS: Array<{ id: ShoppingPlatform; label: string }> = [
  { id: "amazon", label: "Amazon" },
  { id: "flipkart", label: "Flipkart" },
  { id: "tata-neu", label: "Tata Neu / Croma" },
  { id: "myntra", label: "Myntra" },
  { id: "nykaa", label: "Nykaa" },
  { id: "others", label: "Others" },
];

export const AIRLINE_OPTIONS: Array<{ id: AirlinePref; label: string }> = [
  { id: "indigo", label: "IndiGo" },
  { id: "air-india-vistara", label: "Air India / Vistara" },
  { id: "ota", label: "No preference (book via OTA)" },
];

export const FOOD_OPTIONS: Array<{ id: FoodEcosystem; label: string }> = [
  { id: "swiggy", label: "Swiggy ecosystem" },
  { id: "zomato-blinkit", label: "Zomato / Blinkit ecosystem" },
  { id: "bigbasket-zepto", label: "BigBasket / Zepto" },
  { id: "offline", label: "Offline supermarkets" },
];

export const FUEL_OPTIONS: Array<{ id: FuelStation; label: string }> = [
  { id: "iocl", label: "IndianOil (IOCL)" },
  { id: "bpcl", label: "Bharat Petroleum (BPCL)" },
  { id: "hpcl", label: "Hindustan Petroleum (HPCL)" },
  { id: "none", label: "No preference" },
];

export const LOUNGE_OPTIONS: Array<{ id: LoungePref; label: string }> = [
  { id: "none", label: "Don't use them" },
  { id: "domestic-only", label: "Domestic only" },
  { id: "domestic-unlimited", label: "Unlimited domestic" },
  { id: "international", label: "International (Priority Pass)" },
];

export const RECURRING_OPTIONS: Array<{ id: RecurringSpend; label: string; hint?: string }> = [
  { id: "utilities-rent", label: "Utility bills & rent" },
  { id: "movies-entertainment", label: "Movies & entertainment" },
  { id: "high-forex", label: "High forex / international spend" },
  {
    id: "bank-portal-bookings",
    label: "I book travel via bank portals",
    hint: "Unlocks SmartBuy / Travel EDGE / iShop accelerators on your shortlist.",
  },
];

export const STEP_LABELS = ["Profile", "Spend", "Brand fit", "Loyalty", "Lifestyle"];
export const TOTAL_STEPS = 5;

// ─────────────────────────────────────────────────────────────────────────────
// Logic helpers. Pure functions so they're trivially unit-testable.
// ─────────────────────────────────────────────────────────────────────────────

/** A category passes the drill-down threshold at ₹5k+/month. */
export function isAboveThreshold(band: SpendBand): boolean {
  return band === "5k-15k" || band === "15k-30k" || band === "gt-30k";
}

/** Which conditional questions in step 3 should render for this state. */
export function drillDowns(state: FormState) {
  return {
    shopping: isAboveThreshold(state.spend.online),
    airline: isAboveThreshold(state.spend.travel),
    food: isAboveThreshold(state.spend.dining) || isAboveThreshold(state.spend.groceries),
    fuel: isAboveThreshold(state.spend.fuel),
  };
}

export function hasAnyDrillDown(state: FormState): boolean {
  const d = drillDowns(state);
  return d.shopping || d.airline || d.food || d.fuel;
}

/** Programs implied by the user's brand picks; drives whether step 4 (tiers) renders. */
/**
 * The brand answers that still count. A step-3 question is asked only while its spend band
 * is ₹5k+; lowering the band hides the question but used to leave the old answer in state,
 * so a hidden "IndiGo" kept steering the tier step and the scoring.
 */
export function activeBrands(state: FormState) {
  const d = drillDowns(state);
  return {
    shopping: d.shopping ? state.shoppingPlatforms : [],
    airline: d.airline ? state.airline : null,
    food_ecosystem: d.food ? state.foodEcosystem : null,
    fuel_station: d.fuel ? state.fuelStation : null,
  };
}

/** Programs implied by the user's brand picks; drives whether step 4 (tiers) renders. */
export function impliedProgramIds(state: FormState, programs: LoyaltyProgram[]): string[] {
  // Collect channel tokens implied by current brand picks; match against program.earn.channels[].merchants
  const brands = activeBrands(state);
  const tokens = new Set<string>();
  if (brands.airline) {
    for (const m of BRAND_PREF_TO_CHANNELS.airline[brands.airline] ?? []) tokens.add(m);
  }
  for (const s of brands.shopping) {
    for (const m of BRAND_PREF_TO_CHANNELS.shopping[s] ?? []) tokens.add(m);
  }
  if (brands.food_ecosystem) {
    for (const m of BRAND_PREF_TO_CHANNELS.food[brands.food_ecosystem] ?? []) tokens.add(m);
  }
  if (brands.fuel_station) {
    for (const m of BRAND_PREF_TO_CHANNELS.fuel[brands.fuel_station] ?? []) tokens.add(m);
  }
  const out: string[] = [];
  for (const p of programs) {
    if (!p.earn?.tiers || p.earn.tiers.length === 0) continue;
    const merch = (p.earn.channels ?? []).flatMap((c) => c.merchants);
    if (merch.some((m) => tokens.has(m))) out.push(p.id);
  }
  return out;
}

/** Per-step gating: the "Next" button should be disabled until these pass. */
export function isStepValid(step: number, state: FormState): boolean {
  if (step === 1) return state.income !== null && state.goals.length > 0;
  if (step === 2) return Object.values(state.spend).some((b) => b !== "0");
  if (step === 3) {
    const d = drillDowns(state);
    if (d.shopping && state.shoppingPlatforms.length === 0) return false;
    if (d.airline && state.airline === null) return false;
    if (d.food && state.foodEcosystem === null) return false;
    if (d.fuel && state.fuelStation === null) return false;
    return true;
  }
  if (step === 4) return true; // tiers — every selection is optional
  if (step === 5) return state.loungePref !== null;
  return true;
}

/**
 * Final JSON payload constructed on submit. Shape is intentionally flat and
 * uses literal string ids — drop this directly into a recommendation
 * algorithm's `score(profile, card)` function. Null fields are preserved so
 * the consumer can distinguish "user skipped" from "user said no".
 */
export function buildPayload(state: FormState, programs: LoyaltyProgram[]): RecommendPayload {
  // Only tiers of programmes the current answers still imply: a tier picked for a programme
  // whose brand question has since been hidden must not reach the scorer.
  const implied = new Set(impliedProgramIds(state, programs));
  const loyaltyTiers = Object.fromEntries(Object.entries(state.loyaltyTiers).filter(([id]) => implied.has(id)));
  return {
    income_band: state.income,
    goals: state.goals,
    monthly_spend: state.spend,
    brand_preferences: activeBrands(state),
    lifestyle: {
      lounge_pref: state.loungePref,
      recurring: state.recurring,
    },
    loyalty_tiers: loyaltyTiers,
  };
}
