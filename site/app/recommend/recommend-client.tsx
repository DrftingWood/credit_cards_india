"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

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
type RecurringSpend = "utilities-rent" | "movies-entertainment" | "high-forex";

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

const RECURRING_OPTIONS: Array<{ id: RecurringSpend; label: string }> = [
  { id: "utilities-rent", label: "Utility bills & rent" },
  { id: "movies-entertainment", label: "Movies & entertainment" },
  { id: "high-forex", label: "High forex / international spend" },
];

const STEP_LABELS = ["Profile", "Spend", "Brand fit", "Lifestyle"];
const TOTAL_STEPS = 4;

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
  if (step === 4) return state.loungePref !== null;
  return true;
}

/**
 * Final JSON payload constructed on submit. Shape is intentionally flat and
 * uses literal string ids — drop this directly into a recommendation
 * algorithm's `score(profile, card)` function. Null fields are preserved so
 * the consumer can distinguish "user skipped" from "user said no".
 */
function buildPayload(state: FormState) {
  return {
    income_band: state.income,
    goals: state.goals,
    monthly_spend: state.spend,
    brand_preferences: {
      shopping: state.shoppingPlatforms, // ranked array; [0] = primary
      airline: state.airline,
      food_ecosystem: state.foodEcosystem,
      fuel_station: state.fuelStation,
    },
    lifestyle: {
      lounge_pref: state.loungePref,
      recurring: state.recurring,
    },
  } as const;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function RecommendClient() {
  const [state, setState] = useState<FormState>(INITIAL_STATE);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState<ReturnType<typeof buildPayload> | null>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement | null>(null);

  // Move focus to the step heading on every navigation so screen readers
  // announce the change and keyboard users get oriented.
  useEffect(() => {
    stepHeadingRef.current?.focus();
  }, [step, submitted]);

  // If step 3 has no questions to ask for this user's spend, skip it on
  // forward navigation. Going backwards from step 4 also skips it.
  function nextStep() {
    if (step === 2 && !hasAnyDrillDown(state)) {
      setStep(4);
      return;
    }
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  }
  function prevStep() {
    if (step === 4 && !hasAnyDrillDown(state)) {
      setStep(2);
      return;
    }
    setStep((s) => Math.max(1, s - 1));
  }

  function handleSubmit() {
    // ▶▶▶ Final payload is constructed here.
    // Wire this into your recommendation algorithm: e.g. send to an API
    // route, or pipe through a local scorer that reads from the
    // `dist/cards.json` dataset and returns a ranked list.
    const payload = buildPayload(state);
    // For now: log to console + show the payload preview to the user.
    // eslint-disable-next-line no-console
    console.log("[recommend] submit payload", payload);
    setSubmitted(payload);
  }

  function reset() {
    setState(INITIAL_STATE);
    setStep(1);
    setSubmitted(null);
  }

  if (submitted) {
    return <SubmittedView payload={submitted} onReset={reset} />;
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
          {step === 4 ? <Step4 state={state} setState={setState} /> : null}
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
// Step 4 — Lifestyle multipliers (always visible)
// ─────────────────────────────────────────────────────────────────────────────

function Step4({ state, setState }: { state: FormState; setState: SetState }) {
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

function SubmittedView({
  payload,
  onReset,
}: {
  payload: ReturnType<typeof buildPayload>;
  onReset: () => void;
}) {
  return (
    <section className="space-y-4 animate-step-in">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <h2 className="text-lg font-semibold text-emerald-900">Profile captured</h2>
        <p className="mt-1 text-sm text-emerald-800">
          We have everything we need. The recommendation algorithm consumes the
          payload below — see <code>buildPayload()</code> in{" "}
          <code>recommend-client.tsx</code> for the schema.
        </p>
      </div>

      <details className="rounded-xl border border-slate-200 bg-white p-5" open>
        <summary className="cursor-pointer text-sm font-semibold text-slate-900">
          JSON payload preview
        </summary>
        <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-xs text-slate-100">
          {JSON.stringify(payload, null, 2)}
        </pre>
      </details>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/browse"
          className="inline-flex items-center rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-medium text-white no-underline hover:bg-brand-700 hover:text-white"
        >
          Browse cards
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
