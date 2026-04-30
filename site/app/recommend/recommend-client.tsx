"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { EnrichedCard, LoyaltyProgram } from "../../lib/types";
import { recommend, type RecommendResult, type RecommendPayload } from "../../lib/recommender";
import { BRAND_PREF_TO_CHANNELS } from "../../lib/recommender-constants";

// ─────────────────────────────────────────────────────────────────────────────
// Types — kept narrow so TypeScript catches every option mismatch.
// The on-submit JSON payload uses these literal strings as-is so a downstream
// recommendation algorithm can switch on them without re-parsing free text.
// ─────────────────────────────────────────────────────────────────────────────

type IncomeBand = "lt-30k" | "30k-75k" | "75k-1.5L" | "1.5L-3L" | "gt-3L";
type Goal = "cashback" | "travel" | "lounge" | "premium" | "credit-score";
type MacroCategory = "online" | "travel" | "dining" | "groceries" | "fuel";
type SpendBand = "0" | "lt-5k" | "5k-15k" | "15k-30k" | "gt-30k";
type ShoppingPlatform = "amazon" | "flipkart" | "tata-neu" | "myntra" | "nykaa" | "others";
type AirlinePref = "indigo" | "air-india-vistara" | "ota";
type FoodEcosystem = "swiggy" | "zomato-blinkit" | "bigbasket-zepto" | "offline";
type FuelStation = "iocl" | "bpcl" | "hpcl" | "none";
type LoungePref = "none" | "domestic-only" | "domestic-unlimited" | "international";
type RecurringSpend = "utilities-rent" | "movies-entertainment" | "high-forex" | "bank-portal-bookings";

interface FormState {
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

const INITIAL_STATE: FormState = {
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

const INCOME_OPTIONS: Array<{ id: IncomeBand; label: string }> = [
  { id: "lt-30k", label: "< ₹30k" },
  { id: "30k-75k", label: "₹30k – ₹75k" },
  { id: "75k-1.5L", label: "₹75k – ₹1.5L" },
  { id: "1.5L-3L", label: "₹1.5L – ₹3L" },
  { id: "gt-3L", label: "₹3L+" },
];

const GOAL_OPTIONS: Array<{ id: Goal; label: string; hint: string }> = [
  { id: "cashback", label: "Maximising cashback", hint: "Direct INR back on every spend" },
  { id: "travel", label: "Free flights & travel", hint: "Air miles, hotel points, redemptions" },
  { id: "lounge", label: "Lounge access", hint: "Domestic and international airports" },
  { id: "premium", label: "Premium lifestyle", hint: "Concierge, golf, dining privileges" },
  { id: "credit-score", label: "Building credit score", hint: "Easy approval, low fees" },
];

const SPEND_BAND_OPTIONS: Array<{ id: SpendBand; label: string }> = [
  { id: "0", label: "₹0" },
  { id: "lt-5k", label: "< ₹5k" },
  { id: "5k-15k", label: "₹5k – ₹15k" },
  { id: "15k-30k", label: "₹15k – ₹30k" },
  { id: "gt-30k", label: "₹30k+" },
];

const MACRO_CATEGORIES: Array<{ id: MacroCategory; label: string; sub: string }> = [
  { id: "online", label: "Online shopping & electronics", sub: "Amazon, Flipkart, marketplaces" },
  { id: "travel", label: "Travel (flights & hotels)", sub: "Bookings via airline / OTA / hotel direct" },
  { id: "dining", label: "Food delivery & dining out", sub: "Swiggy, Zomato, restaurants" },
  { id: "groceries", label: "Groceries & quick commerce", sub: "BigBasket, Zepto, Blinkit, supermarkets" },
  { id: "fuel", label: "Fuel & commute", sub: "Petrol pumps, FASTag" },
];

const SHOPPING_OPTIONS: Array<{ id: ShoppingPlatform; label: string }> = [
  { id: "amazon", label: "Amazon" },
  { id: "flipkart", label: "Flipkart" },
  { id: "tata-neu", label: "Tata Neu / Croma" },
  { id: "myntra", label: "Myntra" },
  { id: "nykaa", label: "Nykaa" },
  { id: "others", label: "Others" },
];

const AIRLINE_OPTIONS: Array<{ id: AirlinePref; label: string }> = [
  { id: "indigo", label: "IndiGo" },
  { id: "air-india-vistara", label: "Air India / Vistara" },
  { id: "ota", label: "No preference (book via OTA)" },
];

const FOOD_OPTIONS: Array<{ id: FoodEcosystem; label: string }> = [
  { id: "swiggy", label: "Swiggy ecosystem" },
  { id: "zomato-blinkit", label: "Zomato / Blinkit ecosystem" },
  { id: "bigbasket-zepto", label: "BigBasket / Zepto" },
  { id: "offline", label: "Offline supermarkets" },
];

const FUEL_OPTIONS: Array<{ id: FuelStation; label: string }> = [
  { id: "iocl", label: "IndianOil (IOCL)" },
  { id: "bpcl", label: "Bharat Petroleum (BPCL)" },
  { id: "hpcl", label: "Hindustan Petroleum (HPCL)" },
  { id: "none", label: "No preference" },
];

const LOUNGE_OPTIONS: Array<{ id: LoungePref; label: string }> = [
  { id: "none", label: "Don't use them" },
  { id: "domestic-only", label: "Domestic only" },
  { id: "domestic-unlimited", label: "Unlimited domestic" },
  { id: "international", label: "International (Priority Pass)" },
];

const RECURRING_OPTIONS: Array<{ id: RecurringSpend; label: string; hint?: string }> = [
  { id: "utilities-rent", label: "Utility bills & rent" },
  { id: "movies-entertainment", label: "Movies & entertainment" },
  { id: "high-forex", label: "High forex / international spend" },
  {
    id: "bank-portal-bookings",
    label: "I book travel via bank portals",
    hint: "Unlocks SmartBuy / Travel EDGE / iShop accelerators on your shortlist.",
  },
];

const STEP_LABELS = ["Profile", "Spend", "Brand fit", "Loyalty", "Lifestyle"];
const TOTAL_STEPS = 5;

// ─────────────────────────────────────────────────────────────────────────────
// Logic helpers. Pure functions so they're trivially unit-testable.
// ─────────────────────────────────────────────────────────────────────────────

/** A category passes the drill-down threshold at ₹5k+/month. */
function isAboveThreshold(band: SpendBand): boolean {
  return band === "5k-15k" || band === "15k-30k" || band === "gt-30k";
}

/** Which conditional questions in step 3 should render for this state. */
function drillDowns(state: FormState) {
  return {
    shopping: isAboveThreshold(state.spend.online),
    airline: isAboveThreshold(state.spend.travel),
    food: isAboveThreshold(state.spend.dining) || isAboveThreshold(state.spend.groceries),
    fuel: isAboveThreshold(state.spend.fuel),
  };
}

function hasAnyDrillDown(state: FormState): boolean {
  const d = drillDowns(state);
  return d.shopping || d.airline || d.food || d.fuel;
}

/** Programs implied by the user's brand picks; drives whether step 4 (tiers) renders. */
function impliedProgramIds(state: FormState, programs: LoyaltyProgram[]): string[] {
  // Collect channel tokens implied by current brand picks; match against program.earn.channels[].merchants
  const tokens = new Set<string>();
  if (state.airline) {
    for (const m of BRAND_PREF_TO_CHANNELS.airline[state.airline] ?? []) tokens.add(m);
  }
  for (const s of state.shoppingPlatforms) {
    for (const m of BRAND_PREF_TO_CHANNELS.shopping[s] ?? []) tokens.add(m);
  }
  if (state.foodEcosystem) {
    for (const m of BRAND_PREF_TO_CHANNELS.food[state.foodEcosystem] ?? []) tokens.add(m);
  }
  if (state.fuelStation) {
    for (const m of BRAND_PREF_TO_CHANNELS.fuel[state.fuelStation] ?? []) tokens.add(m);
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
function isStepValid(step: number, state: FormState): boolean {
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
function buildPayload(state: FormState): RecommendPayload {
  return {
    income_band: state.income,
    goals: state.goals,
    monthly_spend: state.spend,
    brand_preferences: {
      shopping: state.shoppingPlatforms,
      airline: state.airline,
      food_ecosystem: state.foodEcosystem,
      fuel_station: state.fuelStation,
    },
    lifestyle: {
      lounge_pref: state.loungePref,
      recurring: state.recurring,
    },
    loyalty_tiers: state.loyaltyTiers,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function RecommendClient({
  cards,
  programs,
}: {
  cards: EnrichedCard[];
  programs: LoyaltyProgram[];
}) {
  const [state, setState] = useState<FormState>(INITIAL_STATE);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState<RecommendPayload | null>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement | null>(null);

  const programsById = useMemo(
    () => Object.fromEntries(programs.map((p) => [p.id, p])),
    [programs],
  );

  const tierPrograms = useMemo(
    () => impliedProgramIds(state, programs).map((id) => programsById[id]).filter(Boolean),
    [state, programs, programsById],
  );

  useEffect(() => {
    stepHeadingRef.current?.focus();
  }, [step, submitted]);

  function nextStep() {
    // Skip step 3 if no brand-drilldown applies; skip step 4 if no tier-bearing programs implied.
    if (step === 2 && !hasAnyDrillDown(state)) {
      setStep(tierPrograms.length === 0 ? 5 : 4);
      return;
    }
    if (step === 3 && tierPrograms.length === 0) {
      setStep(5);
      return;
    }
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  }
  function prevStep() {
    if (step === 5 && tierPrograms.length === 0) {
      setStep(hasAnyDrillDown(state) ? 3 : 2);
      return;
    }
    if (step === 4 && !hasAnyDrillDown(state)) {
      setStep(2);
      return;
    }
    setStep((s) => Math.max(1, s - 1));
  }

  function handleSubmit() {
    const payload = buildPayload(state);
    setSubmitted(payload);
  }

  function reset() {
    setState(INITIAL_STATE);
    setStep(1);
    setSubmitted(null);
  }

  if (submitted) {
    return (
      <ResultsView
        payload={submitted}
        cards={cards}
        programsById={programsById}
        onReset={reset}
      />
    );
  }

  return (
    <div className="space-y-5">
      <ProgressStepper current={step} total={TOTAL_STEPS} labels={STEP_LABELS} />

      <section
        key={step}
        className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 animate-step-in"
        aria-labelledby="step-heading"
      >
        <h2
          id="step-heading"
          ref={stepHeadingRef}
          tabIndex={-1}
          className="text-lg font-semibold text-slate-900 outline-none"
        >
          Step {step} of {TOTAL_STEPS} · {STEP_LABELS[step - 1]}
        </h2>

        <div className="mt-5">
          {step === 1 ? <Step1 state={state} setState={setState} /> : null}
          {step === 2 ? <Step2 state={state} setState={setState} /> : null}
          {step === 3 ? <Step3 state={state} setState={setState} /> : null}
          {step === 4 ? <Step4Tiers state={state} setState={setState} programs={tierPrograms} /> : null}
          {step === 5 ? <Step5 state={state} setState={setState} /> : null}
        </div>
      </section>

      <NavButtons
        step={step}
        canProceed={isStepValid(step, state)}
        onBack={prevStep}
        onNext={nextStep}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 1 — Core profile (always visible)
// ─────────────────────────────────────────────────────────────────────────────

function Step1({ state, setState }: { state: FormState; setState: SetState }) {
  function toggleGoal(g: Goal) {
    setState((s) => {
      if (s.goals.includes(g)) return { ...s, goals: s.goals.filter((x) => x !== g) };
      if (s.goals.length >= 2) return s; // hard cap at 2; UI shows the cap inline
      return { ...s, goals: [...s.goals, g] };
    });
  }

  return (
    <div className="space-y-6">
      <Field label="Net monthly income" required>
        <RadioGroup
          name="income"
          options={INCOME_OPTIONS}
          value={state.income}
          onChange={(v) => setState((s) => ({ ...s, income: v }))}
        />
      </Field>

      <Field
        label="Primary goal"
        hint={`Pick up to 2 (${state.goals.length}/2 selected).`}
        required
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {GOAL_OPTIONS.map((opt) => {
            const checked = state.goals.includes(opt.id);
            const disabled = !checked && state.goals.length >= 2;
            return (
              <CheckboxCard
                key={opt.id}
                checked={checked}
                disabled={disabled}
                onChange={() => toggleGoal(opt.id)}
                label={opt.label}
                hint={opt.hint}
                badge={checked ? `#${state.goals.indexOf(opt.id) + 1}` : null}
              />
            );
          })}
        </div>
      </Field>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 2 — Macro spend triage (always visible)
// ─────────────────────────────────────────────────────────────────────────────

function Step2({ state, setState }: { state: FormState; setState: SetState }) {
  function setBand(cat: MacroCategory, band: SpendBand) {
    setState((s) => ({ ...s, spend: { ...s.spend, [cat]: band } }));
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-600">
        Roughly how much do you spend each month in each category? Brand-specific
        questions in the next step only appear for categories above ₹5k.
      </p>
      <div className="space-y-4">
        {MACRO_CATEGORIES.map((cat) => (
          <div key={cat.id}>
            <div className="mb-1.5 flex items-baseline justify-between gap-2">
              <label className="text-sm font-medium text-slate-800">{cat.label}</label>
              <span className="text-xs text-slate-500">{cat.sub}</span>
            </div>
            <PillGroup
              name={`spend-${cat.id}`}
              options={SPEND_BAND_OPTIONS}
              value={state.spend[cat.id]}
              onChange={(v) => setBand(cat.id, v)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 3 — Conditional brand drill-down. Each subsection renders only if the
// corresponding macro spend in step 2 crosses ₹5k/month.
// ─────────────────────────────────────────────────────────────────────────────

function Step3({ state, setState }: { state: FormState; setState: SetState }) {
  const d = drillDowns(state);

  function toggleShopping(p: ShoppingPlatform) {
    setState((s) => {
      if (s.shoppingPlatforms.includes(p)) {
        return { ...s, shoppingPlatforms: s.shoppingPlatforms.filter((x) => x !== p) };
      }
      if (s.shoppingPlatforms.length >= 2) return s;
      return { ...s, shoppingPlatforms: [...s.shoppingPlatforms, p] };
    });
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        Brand preferences for the categories where you spend most. Co-branded
        cards earn meaningfully more on their partner brand than generic cards.
      </p>

      {d.shopping ? (
        <Field
          label="Which platforms dominate your checkout cart?"
          hint={`Rank top 2 (${state.shoppingPlatforms.length}/2 selected; tap again to remove).`}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SHOPPING_OPTIONS.map((opt) => {
              const idx = state.shoppingPlatforms.indexOf(opt.id);
              const checked = idx >= 0;
              const disabled = !checked && state.shoppingPlatforms.length >= 2;
              return (
                <CheckboxCard
                  key={opt.id}
                  checked={checked}
                  disabled={disabled}
                  onChange={() => toggleShopping(opt.id)}
                  label={opt.label}
                  badge={checked ? (idx === 0 ? "1st" : "2nd") : null}
                />
              );
            })}
          </div>
        </Field>
      ) : null}

      {d.airline ? (
        <Field label="Preferred domestic airline?">
          <RadioGroup
            name="airline"
            options={AIRLINE_OPTIONS}
            value={state.airline}
            onChange={(v) => setState((s) => ({ ...s, airline: v }))}
          />
        </Field>
      ) : null}

      {d.food ? (
        <Field label="Which food / grocery ecosystem do you rely on most?">
          <RadioGroup
            name="food"
            options={FOOD_OPTIONS}
            value={state.foodEcosystem}
            onChange={(v) => setState((s) => ({ ...s, foodEcosystem: v }))}
          />
        </Field>
      ) : null}

      {d.fuel ? (
        <Field label="Preferred fuel station?">
          <RadioGroup
            name="fuel"
            options={FUEL_OPTIONS}
            value={state.fuelStation}
            onChange={(v) => setState((s) => ({ ...s, fuelStation: v }))}
          />
        </Field>
      ) : null}

      {!d.shopping && !d.airline && !d.food && !d.fuel ? (
        <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
          No brand-specific questions for your spend pattern — tap{" "}
          <strong>Next</strong> to continue.
        </div>
      ) : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 4 — Loyalty tiers (conditional: only renders if brand picks imply
// tier-bearing programs).
// ─────────────────────────────────────────────────────────────────────────────

function Step4Tiers({
  state,
  setState,
  programs,
}: {
  state: FormState;
  setState: SetState;
  programs: LoyaltyProgram[];
}) {
  function setTier(programId: string, tierId: string | null) {
    setState((s) => ({ ...s, loyaltyTiers: { ...s.loyaltyTiers, [programId]: tierId } }));
  }

  if (programs.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
        No loyalty programs to ask about — tap <strong>Next</strong> to continue.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-600">
        Higher-tier members of these programs earn extra rewards. Default is &quot;None&quot; —
        we&apos;ll only credit the bonus if you tell us you have status.
      </p>
      {programs.map((p) => {
        const tiers = p.earn?.tiers ?? [];
        const current = state.loyaltyTiers[p.id] ?? null;
        return (
          <Field key={p.id} label={p.name}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setTier(p.id, null)}
                className={
                  "rounded-lg border px-2 py-2 text-xs sm:text-sm font-medium transition-colors text-center " +
                  (current === null
                    ? "border-brand-500 bg-brand-50 text-brand-900"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50")
                }
              >
                None
              </button>
              {tiers.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTier(p.id, t.id)}
                  className={
                    "rounded-lg border px-2 py-2 text-xs sm:text-sm font-medium transition-colors text-center " +
                    (current === t.id
                      ? "border-brand-500 bg-brand-50 text-brand-900"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50")
                  }
                >
                  {t.name ?? t.id}
                </button>
              ))}
            </div>
          </Field>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 5 — Lifestyle multipliers (always visible)
// ─────────────────────────────────────────────────────────────────────────────

function Step5({ state, setState }: { state: FormState; setState: SetState }) {
  function toggleRecurring(r: RecurringSpend) {
    setState((s) =>
      s.recurring.includes(r)
        ? { ...s, recurring: s.recurring.filter((x) => x !== r) }
        : { ...s, recurring: [...s.recurring, r] },
    );
  }

  return (
    <div className="space-y-6">
      <Field label="Lounge access" required>
        <RadioGroup
          name="lounge"
          options={LOUNGE_OPTIONS}
          value={state.loungePref}
          onChange={(v) => setState((s) => ({ ...s, loungePref: v }))}
        />
      </Field>

      <Field label="Recurring spends (any that apply)">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {RECURRING_OPTIONS.map((opt) => (
            <CheckboxCard
              key={opt.id}
              checked={state.recurring.includes(opt.id)}
              onChange={() => toggleRecurring(opt.id)}
              label={opt.label}
              hint={opt.hint}
            />
          ))}
        </div>
      </Field>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Submitted view — shows the constructed payload + a hand-off CTA.
// In production this is where you'd render the ranked card list.
// ─────────────────────────────────────────────────────────────────────────────

function ResultsView({
  payload,
  cards,
  programsById,
  onReset,
}: {
  payload: RecommendPayload;
  cards: EnrichedCard[];
  programsById: Record<string, LoyaltyProgram>;
  onReset: () => void;
}) {
  const results = useMemo(
    () => recommend(cards, programsById, payload, 5),
    [cards, programsById, payload],
  );

  return (
    <section className="space-y-4 animate-step-in">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <h2 className="text-lg font-semibold text-emerald-900">Top picks for you</h2>
        <p className="mt-1 text-sm text-emerald-800">
          Ranked by net annual value (rewards + lounge + milestones + amortised welcome
          bonus, less fees and forex). Channel-locked rates assume you book through
          your selected partners; we also show the &quot;general&quot; value when relevant.
        </p>
      </div>

      {results.length === 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          No cards passed the eligibility filters. Try widening your income band
          or removing the lounge requirement.
        </div>
      ) : (
        <ol className="space-y-3">
          {results.map((r, i) => (
            <ResultCard key={r.card.id} rank={i + 1} result={r} />
          ))}
        </ol>
      )}

      <details className="rounded-xl border border-slate-200 bg-white p-4">
        <summary className="cursor-pointer text-xs font-semibold text-slate-700">
          Debug: payload
        </summary>
        <pre className="mt-2 overflow-x-auto rounded-md bg-slate-900 p-3 text-xs text-slate-100">
          {JSON.stringify(payload, null, 2)}
        </pre>
      </details>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/browse"
          className="inline-flex items-center rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-medium text-white no-underline hover:bg-brand-700 hover:text-white"
        >
          Browse all cards
        </Link>
        <Link
          href="/calculator"
          className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 no-underline hover:bg-slate-50 hover:text-slate-900"
        >
          Open calculator
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 hover:text-slate-900"
        >
          Start over
        </button>
      </div>
    </section>
  );
}

function ResultCard({ rank, result }: { rank: number; result: RecommendResult }) {
  const r = result;
  const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
  return (
    <li className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-slate-500">#{rank}</span>
          <h3 className="text-base font-semibold text-slate-900">
            <Link
              href={`/card/${r.card.issuer}/${r.card.id.replace(`${r.card.issuer}-`, "")}`}
              className="hover:underline"
            >
              {r.card.name}
            </Link>
          </h3>
          <p className="text-xs text-slate-500">{r.card.issuer_detail?.name ?? r.card.issuer}</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-semibold text-emerald-700">{inr(r.rank_total_inr)}</div>
          <div className="text-xs text-slate-500">net /yr</div>
        </div>
      </div>

      {r.explanations.length > 0 ? (
        <ul className="mt-3 space-y-1 text-sm text-slate-700 list-disc list-inside">
          {r.explanations.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      ) : null}

      {r.per_category.some((p) => p.also_show) ? (
        <div className="mt-3 rounded-md bg-slate-50 p-3 text-xs text-slate-700">
          <div className="font-semibold mb-1">If you don&apos;t book on the picked channel:</div>
          <ul className="space-y-0.5">
            {r.per_category
              .filter((p) => p.also_show)
              .map((p) => (
                <li key={p.category}>
                  <span className="capitalize">{p.category}</span>: ranked {inr(p.inr_used_for_rank)}/yr,
                  but {inr(p.also_show!.general_value_inr)}/yr on general spend.
                </li>
              ))}
          </ul>
        </div>
      ) : null}

      {r.caveats.length > 0 ? (
        <ul className="mt-2 space-y-0.5 text-xs text-amber-800 list-disc list-inside">
          {r.caveats.map((c, i) => <li key={i}>{c}</li>)}
        </ul>
      ) : null}

      <details className="mt-3">
        <summary className="cursor-pointer text-xs font-semibold text-slate-600">
          Score breakdown
        </summary>
        <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-700">
          <dt>Rewards</dt><dd className="text-right">{inr(r.breakdown.rewards_inr)}</dd>
          <dt>Lounge</dt><dd className="text-right">{inr(r.breakdown.lounge_inr)}</dd>
          <dt>Milestones</dt><dd className="text-right">{inr(r.breakdown.milestones_inr)}</dd>
          <dt>Welcome (amortised)</dt><dd className="text-right">{inr(r.breakdown.welcome_inr)}</dd>
          {r.breakdown.premium_extras_inr > 0 ? (
            <><dt>Premium extras</dt><dd className="text-right">{inr(r.breakdown.premium_extras_inr)}</dd></>
          ) : null}
          <dt>Annual fee</dt><dd className="text-right">−{inr(r.breakdown.annual_fee_inr)}</dd>
          {r.breakdown.forex_cost_inr > 0 ? (
            <><dt>Forex cost</dt><dd className="text-right">−{inr(r.breakdown.forex_cost_inr)}</dd></>
          ) : null}
        </dl>
      </details>
    </li>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UI primitives. Kept local to this file — small, single-use, and we don't
// want to grow the shared `components/` surface for a one-off form.
// ─────────────────────────────────────────────────────────────────────────────

type SetState = React.Dispatch<React.SetStateAction<FormState>>;

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-slate-800">
        {label}
        {required ? <span className="text-rose-600 ml-0.5">*</span> : null}
      </legend>
      {hint ? <p className="text-xs text-slate-500 mt-0.5">{hint}</p> : null}
      <div className="mt-2">{children}</div>
    </fieldset>
  );
}

interface RadioOpt<T extends string> {
  id: T;
  label: string;
}

function RadioGroup<T extends string>({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: ReadonlyArray<RadioOpt<T>>;
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div role="radiogroup" className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map((opt) => {
        const checked = value === opt.id;
        return (
          <label
            key={opt.id}
            className={
              "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm cursor-pointer select-none transition-colors " +
              (checked
                ? "border-brand-500 bg-brand-50 text-brand-900"
                : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50")
            }
          >
            <input
              type="radio"
              name={name}
              value={opt.id}
              checked={checked}
              onChange={() => onChange(opt.id)}
              className="border-slate-400 text-brand-600 focus:ring-brand-500"
            />
            <span>{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
}

function PillGroup<T extends string>({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: ReadonlyArray<{ id: T; label: string }>;
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={name} className="grid grid-cols-5 gap-1.5">
      {options.map((opt) => {
        const checked = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={checked}
            onClick={() => onChange(opt.id)}
            className={
              "rounded-lg border px-2 py-2 text-xs sm:text-sm font-medium transition-colors text-center " +
              (checked
                ? "border-brand-500 bg-brand-50 text-brand-900"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50")
            }
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function CheckboxCard({
  checked,
  disabled,
  onChange,
  label,
  hint,
  badge,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  label: string;
  hint?: string;
  badge?: string | null;
}) {
  return (
    <label
      className={
        "flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors " +
        (disabled
          ? "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
          : checked
          ? "border-brand-500 bg-brand-50 text-brand-900 cursor-pointer"
          : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50 cursor-pointer")
      }
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="mt-0.5 border-slate-400 text-brand-600 focus:ring-brand-500"
      />
      <span className="flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="font-medium">{label}</span>
          {badge ? (
            <span className="text-xs font-semibold text-brand-700 bg-white border border-brand-200 rounded-full px-1.5 py-0.5">
              {badge}
            </span>
          ) : null}
        </span>
        {hint ? <span className="block text-xs text-slate-500 mt-0.5">{hint}</span> : null}
      </span>
    </label>
  );
}

function ProgressStepper({
  current,
  total,
  labels,
}: {
  current: number;
  total: number;
  labels: string[];
}) {
  const steps = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <ol className="flex items-center gap-2 sm:gap-3" aria-label="Form progress">
      {steps.map((n, i) => {
        const done = n < current;
        const active = n === current;
        return (
          <li key={n} className="flex flex-1 items-center gap-2">
            <span
              aria-current={active ? "step" : undefined}
              className={
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold border " +
                (done
                  ? "bg-brand-600 text-white border-brand-600"
                  : active
                  ? "bg-white text-brand-700 border-brand-500 ring-2 ring-brand-100"
                  : "bg-white text-slate-400 border-slate-300")
              }
            >
              {done ? "✓" : n}
            </span>
            <span
              className={
                "hidden sm:inline text-xs " +
                (active ? "text-slate-900 font-medium" : "text-slate-500")
              }
            >
              {labels[i]}
            </span>
            {n < total ? (
              <span
                aria-hidden
                className={
                  "flex-1 h-px " + (n < current ? "bg-brand-500" : "bg-slate-200")
                }
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function NavButtons({
  step,
  canProceed,
  onBack,
  onNext,
  onSubmit,
}: {
  step: number;
  canProceed: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}) {
  const isLast = step === TOTAL_STEPS;
  return (
    <div className="flex items-center justify-between gap-2">
      <button
        type="button"
        onClick={onBack}
        disabled={step === 1}
        className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ← Back
      </button>
      <button
        type="button"
        onClick={isLast ? onSubmit : onNext}
        disabled={!canProceed}
        className="inline-flex items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLast ? "Get my recommendation" : "Next →"}
      </button>
    </div>
  );
}
