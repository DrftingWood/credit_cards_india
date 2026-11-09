"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { EnrichedCard, LoyaltyProgram } from "../../lib/types";
import {
  type RecommendPayload,
} from "../../lib/recommender";
import { scoreDecoupled } from "../../lib/scorer-decoupled";
import {
  AIRLINE_OPTIONS,
  FOOD_OPTIONS,
  FUEL_OPTIONS,
  type FormState,
  GOAL_OPTIONS,
  type Goal,
  INCOME_OPTIONS,
  INITIAL_STATE,
  LOUNGE_OPTIONS,
  MACRO_CATEGORIES,
  type MacroCategory,
  RECURRING_OPTIONS,
  type RecurringSpend,
  SHOPPING_OPTIONS,
  SPEND_BAND_OPTIONS,
  STEP_LABELS,
  type ShoppingPlatform,
  type SpendBand,
  TOTAL_STEPS,
  buildPayload,
  drillDowns,
  hasAnyDrillDown,
  impliedProgramIds,
  isStepValid,
} from "../../lib/recommend-form";
import { Field, RadioGroup, PillGroup, CheckboxCard, ProgressStepper, NavButtons } from "./form-controls";
import { pickHighlights } from "../../lib/present";
import { BestPickCard } from "../../components/recommend/best-pick-card";
import { RankedRow } from "../../components/recommend/ranked-row";

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
    const payload = buildPayload(state, programs);
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

  // Steps 3 (brand drill-down) and 4 (loyalty tiers) are conditional. A step
  // that won't be shown for the current answers is "skipped", not "completed" —
  // the stepper must not tick it just because the cursor has moved past it (C3).
  const stepApplies = (n: number): boolean => {
    if (n === 3) return hasAnyDrillDown(state);
    if (n === 4) return tierPrograms.length > 0;
    return true;
  };

  return (
    <div className="space-y-5">
      <ProgressStepper current={step} total={TOTAL_STEPS} labels={STEP_LABELS} applies={stepApplies} />

      <section
        key={step}
        className="rounded-xl border border-line bg-surface p-5 sm:p-6 animate-step-in"
        aria-labelledby="step-heading"
      >
        <h2
          id="step-heading"
          ref={stepHeadingRef}
          tabIndex={-1}
          className="text-lg font-semibold text-fg outline-hidden"
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
      <p className="text-sm text-fg-muted">
        Roughly how much do you spend each month in each category? Brand-specific
        questions in the next step only appear for categories above ₹5k.
      </p>
      <div className="space-y-4">
        {MACRO_CATEGORIES.map((cat) => (
          <div key={cat.id}>
            <div className="mb-1.5 flex items-baseline justify-between gap-2">
              <label className="text-sm font-medium text-fg">{cat.label}</label>
              <span className="text-xs text-fg-muted">{cat.sub}</span>
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
      <p className="text-sm text-fg-muted">
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
        <div className="rounded-md border border-dashed border-line-strong bg-surface-subtle p-4 text-sm text-fg-muted">
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
      <div className="rounded-md border border-dashed border-line-strong bg-surface-subtle p-4 text-sm text-fg-muted">
        No loyalty programs to ask about — tap <strong>Next</strong> to continue.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-fg-muted">
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
                    ? "border-accent bg-accent-subtle text-accent-strong"
                    : "border-line-strong bg-surface text-fg-secondary hover:bg-surface-subtle")
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
                      ? "border-accent bg-accent-subtle text-accent-strong"
                      : "border-line-strong bg-surface text-fg-secondary hover:bg-surface-subtle")
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
    () => scoreDecoupled(cards, programsById, payload, { topN: 5 }),
    [cards, programsById, payload],
  );
  const highlights = useMemo(() => pickHighlights(results, payload), [results, payload]);

  return (
    <section className="space-y-4 animate-step-in">
      <div className="rounded-xl border border-success-line bg-success-subtle p-5">
        <h2 className="text-lg font-semibold text-success">Top picks for you</h2>
        <p className="mt-1 text-sm text-success">
          Ranked by <strong>net annual rewards</strong> on your spend (card rate × your
          spend, less the annual fee). Co-brand rates count only for brands you selected.
          Sign-up bonuses, milestones and lounge access are shown <em>separately</em> —
          they&apos;re one-off or usage-dependent, so they don&apos;t inflate the ranking.
        </p>
      </div>

      {highlights.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {highlights.map((h) => (
            <BestPickCard key={`${h.key}-${h.score.card.id}`} highlight={h} />
          ))}
        </div>
      ) : null}

      {results.length === 0 ? (
        <div className="rounded-xl border border-warn-line bg-warn-subtle p-5 text-sm text-warn">
          No cards passed the eligibility filters. Try widening your income band
          or removing the lounge requirement.
        </div>
      ) : (
        <div>
          <h3 className="mb-2 mt-2 text-sm font-semibold text-fg-secondary">All ranked results</h3>
          <ol className="space-y-2">
            {results.map((r, i) => (
              <RankedRow key={r.card.id} rank={i + 1} score={r} />
            ))}
          </ol>
        </div>
      )}

      {process.env.NODE_ENV !== "production" ? (
        <details className="rounded-xl border border-line bg-surface p-4">
          <summary className="cursor-pointer text-xs font-semibold text-fg-secondary">
            Debug: payload
          </summary>
          <pre className="mt-2 overflow-x-auto rounded-md bg-inverse p-3 text-xs text-on-inverse">
            {JSON.stringify(payload, null, 2)}
          </pre>
        </details>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/browse"
          className="inline-flex items-center rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-on-accent no-underline hover:bg-accent-hover hover:text-on-accent"
        >
          Browse all cards
        </Link>
        <Link
          href="/calculator"
          className="inline-flex items-center rounded-lg border border-line-strong bg-surface px-3 py-2 text-sm font-medium text-fg no-underline hover:bg-surface-subtle hover:text-fg"
        >
          Open calculator
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center rounded-lg border border-line-strong bg-surface px-3 py-2 text-sm font-medium text-fg hover:bg-surface-subtle hover:text-fg"
        >
          Start over
        </button>
      </div>
    </section>
  );
}

type SetState = React.Dispatch<React.SetStateAction<FormState>>;
