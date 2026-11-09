"use client";

// Form controls for the /recommend wizard. Colocated with the page rather than in the
// shared components/ folder: they are single-use and shaped around this one form.
import type React from "react";
import { TOTAL_STEPS } from "../../lib/recommend-form";

export function Field({
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
      <legend className="text-sm font-medium text-fg">
        {label}
        {required ? <span className="text-danger ml-0.5">*</span> : null}
      </legend>
      {hint ? <p className="text-xs text-fg-muted mt-0.5">{hint}</p> : null}
      <div className="mt-2">{children}</div>
    </fieldset>
  );
}

interface RadioOpt<T extends string> {
  id: T;
  label: string;
}

export function RadioGroup<T extends string>({
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
                ? "border-accent bg-accent-subtle text-accent-strong"
                : "border-line-strong bg-surface text-fg hover:bg-surface-subtle")
            }
          >
            <input
              type="radio"
              name={name}
              value={opt.id}
              checked={checked}
              onChange={() => onChange(opt.id)}
              className="border-line-strong text-accent-fg focus:ring-focus"
            />
            <span>{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
}

export function PillGroup<T extends string>({
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
                ? "border-accent bg-accent-subtle text-accent-strong"
                : "border-line-strong bg-surface text-fg-secondary hover:bg-surface-subtle")
            }
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function CheckboxCard({
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
          ? "border-line bg-surface-subtle text-fg-disabled cursor-not-allowed"
          : checked
          ? "border-accent bg-accent-subtle text-accent-strong cursor-pointer"
          : "border-line-strong bg-surface text-fg hover:bg-surface-subtle cursor-pointer")
      }
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="mt-0.5 border-line-strong text-accent-fg focus:ring-focus"
      />
      <span className="flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="font-medium">{label}</span>
          {badge ? (
            <span className="text-xs font-semibold text-accent-fg bg-surface border border-accent-line rounded-full px-1.5 py-0.5">
              {badge}
            </span>
          ) : null}
        </span>
        {hint ? <span className="block text-xs text-fg-muted mt-0.5">{hint}</span> : null}
      </span>
    </label>
  );
}

export function ProgressStepper({
  current,
  total,
  labels,
  applies,
}: {
  current: number;
  total: number;
  labels: string[];
  /** Whether a step is applicable to the current answers. A non-applicable step past the cursor is "skipped", not "done". */
  applies: (n: number) => boolean;
}) {
  const steps = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <ol className="flex items-center gap-2 sm:gap-3" aria-label="Form progress">
      {steps.map((n, i) => {
        const active = n === current;
        const past = n < current;
        const applicable = applies(n);
        const done = past && applicable;
        const skipped = past && !applicable;
        return (
          <li key={n} className="flex flex-1 items-center gap-2">
            <span
              aria-current={active ? "step" : undefined}
              title={skipped ? `${labels[i]} — not applicable to your answers` : undefined}
              className={
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold border " +
                (done
                  ? "bg-accent text-on-accent border-accent"
                  : skipped
                  ? "bg-surface-subtle text-fg-disabled border-dashed border-line-strong"
                  : active
                  ? "bg-surface text-accent-fg border-accent ring-2 ring-accent-line"
                  : "bg-surface text-fg-muted border-line-strong")
              }
            >
              {done ? "✓" : skipped ? "–" : n}
            </span>
            <span
              className={
                "hidden sm:inline text-xs " +
                (active ? "text-fg font-medium" : skipped ? "text-fg-disabled line-through" : "text-fg-muted")
              }
            >
              {labels[i]}
            </span>
            {n < total ? (
              <span
                aria-hidden
                className={
                  "flex-1 h-px " + (done ? "bg-accent" : "bg-line")
                }
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

export function NavButtons({
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
        className="inline-flex items-center rounded-lg border border-line-strong bg-surface px-3 py-2 text-sm font-medium text-fg hover:bg-surface-subtle hover:text-fg disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ← Back
      </button>
      <button
        type="button"
        onClick={isLast ? onSubmit : onNext}
        disabled={!canProceed}
        className="inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-accent-disabled disabled:text-on-accent-disabled"
      >
        {isLast ? "Get my recommendation" : "Next →"}
      </button>
    </div>
  );
}
