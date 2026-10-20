import type { Cycle } from "@/lib/types";
import type { ValueComponents, ValuePrefs, MilestoneItem, WelcomeItem, LoungeItem } from "@/lib/value-components";
import { MAX_LOUNGE_VISITS, MAX_LOUNGE_VALUE_INR, MAX_TENURE_YEARS } from "@/lib/use-value-prefs";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const PER: Record<Cycle, string> = { monthly: "month", quarterly: "quarter", annual: "year", statement: "statement", "per-txn": "transaction" };
const SCOPE_LABEL = { domestic: "Domestic", international: "International" } as const;

/**
 * One line for a ranked /calculator row: what year 1 is worth and what lifts it above the
 * steady state. Null when nothing beyond spend rewards applies and year 1 equals year 2+.
 * Pure so it's testable without rendering.
 */
export function valueSummaryLine(vc: ValueComponents): string | null {
  const parts: string[] = [];
  if (vc.welcome.total_inr > 0) parts.push(`${inr(vc.welcome.total_inr)} welcome`);
  const ms = vc.first_year.milestones_inr;
  if (ms > 0) parts.push(`${inr(ms)} milestones`);
  if (vc.lounge.annual_inr > 0) parts.push(`${inr(vc.lounge.annual_inr)} lounge`);
  if (parts.length === 0 && vc.first_year.total_inr === vc.steady_state.total_inr) return null;
  const tail = parts.length ? ` incl. ${parts.join(", ")}` : "";
  return `Year 1 ${inr(vc.first_year.total_inr)}${tail} · Year 2+ ${inr(vc.steady_state.total_inr)}`;
}

function WelcomeRow({ w }: { w: WelcomeItem }) {
  let right: string;
  let note: string | null = w.condition;
  if (w.status === "counted") right = inr(w.value_inr ?? 0);
  else if (w.status === "unvalued") right = "value not stated";
  else {
    right = "not met";
    note = `Needs ${inr(w.spend_required_inr ?? 0)} spend${w.window_days ? ` in ${w.window_days} days` : ""} — your spend gives ${inr(w.spend_in_window_inr ?? 0)}`;
  }
  return (
    <li className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
      <div className="flex items-baseline justify-between gap-3 text-xs">
        <span className="font-medium text-slate-700">{w.benefit}</span>
        <span className={w.status === "counted" ? "tabular-nums text-slate-900" : "tabular-nums text-slate-500"}>{right}</span>
      </div>
      {note ? <p className="mt-1 text-[11px] text-slate-500">{note}</p> : null}
    </li>
  );
}

function milestoneRight(m: MilestoneItem): string {
  switch (m.status) {
    case "reached":
      return `${inr(m.annual_value_inr)}/yr`;
    case "short":
      return `${inr(m.shortfall_inr)} short per ${PER[m.cycle]}`;
    case "unvalued":
      return m.reached ? "reached · value not stated" : `value not stated · ${inr(m.shortfall_inr)} short per ${PER[m.cycle]}`;
    case "counted-in-fee":
      return "counted as the fee waiver";
  }
}

function MilestoneRow({ m }: { m: MilestoneItem }) {
  const trigger = m.spend_inr > 0 ? `Spend ${inr(m.spend_inr)} per ${PER[m.cycle]}` : `Each ${PER[m.cycle]}`;
  const times = m.status === "reached" && m.awards_per_year > 1 ? ` · ${m.awards_per_year}× a year` : "";
  return (
    <li className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
      <div className="flex items-baseline justify-between gap-3 text-xs">
        <span className="font-medium text-slate-700">{m.benefit}</span>
        <span className={m.status === "reached" ? "tabular-nums text-slate-900" : "tabular-nums text-slate-500"}>{milestoneRight(m)}</span>
      </div>
      <p className="mt-1 text-[11px] text-slate-500">
        {trigger}
        {times}
        {m.kind === "first-year" ? " · first year only" : ""}
        {m.status === "reached" || m.status === "short" ? ` · you spend ${inr(m.spend_per_cycle_inr)} per ${PER[m.cycle]}` : ""}
      </p>
      {m.implausible ? (
        <p className="mt-1 text-[11px] text-amber-700">Stated value is unusually large for its spend trigger — verify with the issuer.</p>
      ) : null}
    </li>
  );
}

function allowanceText(l: LoungeItem): string {
  if (l.allowance_per_year === null) return "access stated, visit count not stated";
  if (l.allowance_per_year === "unlimited") return "unlimited visits";
  return `${l.allowance_per_year} visits/yr`;
}

function NumberInput({ label, value, max, onChange }: { label: string; value: number; max: number; onChange?: (n: number) => void }) {
  return (
    <label className="text-[11px] text-slate-600">
      {label}
      <input
        type="number" min={0} max={max} inputMode="numeric" value={value}
        readOnly={!onChange}
        onChange={onChange ? (e) => onChange(Math.max(0, Math.min(max, Number(e.target.value) || 0))) : undefined}
        className="mt-0.5 w-full rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-900 tabular-nums"
      />
    </label>
  );
}

function LoungeRow({ l, prefs, onPrefsChange }: { l: LoungeItem; prefs: ValuePrefs; onPrefsChange?: (p: ValuePrefs) => void }) {
  const gate = l.spend_threshold_inr != null
    ? `Unlocked by ${inr(l.spend_threshold_inr)} spend per ${PER[l.spend_threshold_cycle ?? "quarterly"]}${l.unlocked ? " — your spend clears it" : " — your spend doesn't reach it"}`
    : null;
  const set = (key: "lounge_visits" | "lounge_value_inr") => onPrefsChange
    ? (n: number) => onPrefsChange({ ...prefs, [key]: { ...prefs[key], [l.scope]: n } })
    : undefined;
  return (
    <li className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
      <div className="flex items-baseline justify-between gap-3 text-xs">
        <span className="font-medium text-slate-700">{SCOPE_LABEL[l.scope]} lounge · {allowanceText(l)}</span>
        <span className={l.value_inr > 0 ? "tabular-nums text-slate-900" : "tabular-nums text-slate-500"}>{inr(l.value_inr)}/yr</span>
      </div>
      {gate ? <p className={l.unlocked ? "mt-1 text-[11px] text-slate-500" : "mt-1 text-[11px] text-amber-700"}>{gate}</p> : null}
      <div className="mt-2 grid grid-cols-2 gap-2">
        <NumberInput label="Visits you'd use / yr" value={prefs.lounge_visits[l.scope]} max={MAX_LOUNGE_VISITS} onChange={set("lounge_visits")} />
        <NumberInput label="₹ a visit is worth to you" value={prefs.lounge_value_inr[l.scope]} max={MAX_LOUNGE_VALUE_INR} onChange={set("lounge_value_inr")} />
      </div>
      {l.used_visits > 0 ? (
        <p className="mt-1 text-[11px] text-slate-500 tabular-nums">{l.used_visits} visits × {inr(l.value_per_visit_inr)}</p>
      ) : null}
    </li>
  );
}

/**
 * "One-off & benefit value": welcome, milestones and lounge as separate line items, with
 * year 1 vs steady-state totals. Presentational — the hook-driven AccelerationBreakdown
 * owns the stores and passes `onPrefsChange`; without it the inputs render read-only.
 */
export function ValueComponentsPanel({
  vc, prefs, onPrefsChange,
}: { vc: ValueComponents; prefs: ValuePrefs; onPrefsChange?: (p: ValuePrefs) => void }) {
  const empty = vc.welcome.items.length === 0 && vc.milestones.items.length === 0 && vc.lounge.items.length === 0;
  return (
    <div className="mt-4 border-t border-slate-200 pt-3">
      <h3 className="text-sm font-semibold text-slate-900">One-off &amp; benefit value</h3>
      <p className="mt-0.5 text-xs text-slate-500">
        Not part of the ranking. Welcome and milestone figures are the card&apos;s own stated values, counted only when
        your spend meets the condition; lounge is valued only from the usage you enter.
      </p>

      {empty ? (
        <p className="mt-2 text-xs text-slate-500">This card has no welcome, milestone or lounge benefit on record.</p>
      ) : null}

      {vc.welcome.items.length > 0 ? (
        <div className="mt-3">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Welcome · year 1 only</h4>
          <ul className="mt-1.5 space-y-1.5">{vc.welcome.items.map((w, i) => <WelcomeRow key={i} w={w} />)}</ul>
        </div>
      ) : null}

      {vc.milestones.items.length > 0 ? (
        <div className="mt-3">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Spend milestones</h4>
          <ul className="mt-1.5 space-y-1.5">{vc.milestones.items.map((m, i) => <MilestoneRow key={i} m={m} />)}</ul>
        </div>
      ) : null}

      {vc.lounge.items.length > 0 ? (
        <div className="mt-3">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Airport lounges</h4>
          <ul className="mt-1.5 space-y-1.5">
            {vc.lounge.items.map((l) => <LoungeRow key={l.scope} l={l} prefs={prefs} onPrefsChange={onPrefsChange} />)}
          </ul>
        </div>
      ) : null}

      <dl className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 p-2.5">
          <dt className="text-[11px] text-slate-500">Year 1</dt>
          <dd className="text-sm font-semibold text-slate-900 tabular-nums">{inr(vc.first_year.total_inr)}</dd>
          <dd className="text-[11px] text-slate-400 tabular-nums">pays the {inr(vc.first_year.fee_inr)} joining fee</dd>
        </div>
        <div className="rounded-lg border border-slate-200 p-2.5">
          <dt className="text-[11px] text-slate-500">Year 2 onward</dt>
          <dd className="text-sm font-semibold text-slate-900 tabular-nums">{inr(vc.steady_state.total_inr)}</dd>
          <dd className="text-[11px] text-slate-400">annual fee, recurring benefits</dd>
        </div>
        <div className="rounded-lg border border-slate-200 p-2.5">
          <dt className="text-[11px] text-slate-500">
            Average a year over{" "}
            {onPrefsChange ? (
              <select
                aria-label="Years you expect to hold the card"
                value={vc.tenure_years}
                onChange={(e) => onPrefsChange({ ...prefs, tenure_years: Number(e.target.value) })}
                className="rounded border border-slate-300 px-1 text-[11px]"
              >
                {Array.from({ length: MAX_TENURE_YEARS }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            ) : vc.tenure_years}{" "}
            {vc.tenure_years === 1 ? "year" : "years"}
          </dt>
          <dd className="text-sm font-semibold text-slate-900 tabular-nums">{inr(vc.tenure_avg_annual_inr)}</dd>
          <dd className="text-[11px] text-slate-400">one-offs spread over the years held</dd>
        </div>
      </dl>
    </div>
  );
}
