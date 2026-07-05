"use client";
import { useMemo, useState } from "react";
import type { EnrichedCard } from "@/lib/types";
import { explainCard, type AcceleratorExplain, type BaseSpendExplain, type ScoringContext } from "@/lib/calculator";
import { useSpendProfile } from "@/lib/use-spend-profile";
import { CANONICAL_CATEGORIES, CATEGORY_LABELS, type CanonicalCategory } from "@/lib/category-mapping";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

/** Sanity ceiling per category (₹1 crore/month) — matches /calculator's MAX_MONTHLY so
 *  the shared spend-profile store never gets a value one view accepts and another rejects. */
const MAX_MONTHLY_SPEND = 100_000_000;

/**
 * For a base-rate row in the currently-selected layer, find the reason (if any) an
 * accelerator that DOES fire in the Absolute layer doesn't fire here — sourced from
 * the Absolute explanation's own factor list (its "Requires booking via <channel>" /
 * "Assumes 100% of this bucket qualifies" lines), so the note is a fact pulled from
 * the engine, not invented copy. Pure and exported so it's unit-testable without
 * rendering the (hook-driven) component (FIX 4).
 */
export function baseRowCutNote(
  category: CanonicalCategory,
  absoluteAccelerators: AcceleratorExplain[],
): string | null {
  const absRow = absoluteAccelerators.find((a) => a.category === category);
  if (!absRow) return null;
  const requires = absRow.factors.find((f) => /^requires /i.test(f));
  const assumes = absRow.factors.find((f) => /^assumes /i.test(f));
  const chosen = requires ?? assumes;
  if (!chosen) return null;
  const reason = chosen.replace(/^(requires|assumes)\s+/i, "");
  return `${absRow.label} — earns base; accelerated rate needs ${reason}`;
}

export function AcceleratorRow({ item }: { item: AcceleratorExplain }) {
  return (
    <li className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold text-slate-900">{item.label}</span>
        <span className="text-sm font-semibold text-slate-900 tabular-nums">{inr(item.net_value_inr)}/mo</span>
      </div>
      <p className="mt-1 text-xs text-slate-600 tabular-nums">
        You spend {inr(item.monthly_spend)} · earns {item.rate_pct.toFixed(1)}% ={" "}
        <span className="text-slate-900">{inr(item.uncapped_value_inr)}</span> uncapped
        {item.cap_bound && item.cap_monthly_inr != null ? (
          <>
            {" "}→ cap {inr(item.cap_monthly_inr)} clamps it, <span className="text-amber-700">{inr(item.lost_to_cap_inr)} lost to the cap</span>
            {item.base_spillover_inr > 0 ? <> · {inr(item.base_spillover_inr)} earned at base beyond it</> : null}
          </>
        ) : null}
      </p>
      {item.factors.length > 0 ? (
        <ul className="mt-1.5 flex flex-wrap gap-1.5">
          {item.factors.map((f, i) => (
            <li key={i} className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600">{f}</li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function AccelerationBreakdown({ card }: { card: EnrichedCard }) {
  const [spend, setSpend] = useSpendProfile(); // shared + persisted across all calculators
  const [layer, setLayer] = useState<"realistic" | "absolute">("realistic");

  const ctx: ScoringContext = useMemo(
    () => layer === "realistic"
      ? { applyApplicability: true, channelMix: new Set<string>(), enabledEcosystems: new Set<string>(), valueBasis: "realized" }
      : { valueBasis: "face" },
    [layer],
  );
  const ex = useMemo(() => explainCard(card, spend, ctx), [card, spend, ctx]);
  // Absolute layer, computed unconditionally (explainCard is pure/cheap): the source of
  // truth for "what got cut" notes on base-rate rows in the selected layer (FIX 1).
  const exAbs = useMemo(() => explainCard(card, spend, { valueBasis: "face" }), [card, spend]);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">See the math — accelerations &amp; caps</h2>
        <div className="inline-flex rounded-lg border border-slate-300 p-0.5 text-xs">
          {(["realistic", "absolute"] as const).map((l) => (
            <button key={l} type="button" onClick={() => setLayer(l)}
              className={l === layer ? "rounded-md bg-slate-900 px-3 py-1 font-medium text-white" : "rounded-md px-3 py-1 text-slate-600"}>
              {l === "realistic" ? "Realistic" : "Absolute"}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        {layer === "realistic"
          ? "What you'd realistically keep — caps applied, channel premiums cut when you don't route through them, realized redemption value."
          : "Best case — every accelerator fires at full rate on the whole bucket at face value. Caps still apply; each row states what you must satisfy."}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {CANONICAL_CATEGORIES.map((cat) => (
          <label key={cat} className="text-xs text-slate-600">
            {CATEGORY_LABELS[cat] ?? cat}
            <input type="number" min={0} max={MAX_MONTHLY_SPEND} inputMode="numeric" value={spend[cat]}
              onChange={(e) => setSpend((s) => ({ ...s, [cat]: Math.max(0, Math.min(MAX_MONTHLY_SPEND, Number(e.target.value) || 0)) }))}
              className="mt-0.5 w-full rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-900 tabular-nums" />
          </label>
        ))}
      </div>

      {ex.accelerators.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {ex.accelerators.map((a) => <AcceleratorRow key={a.category} item={a} />)}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-slate-500">No accelerated categories apply to the spend you entered — everything earns the base rate.</p>
      )}

      {ex.base_spend.length > 0 ? (
        <div className="mt-4 border-t border-slate-200 pt-3">
          <h3 className="text-sm font-semibold text-slate-900">Base-rate spend</h3>
          <p className="mt-0.5 text-xs text-slate-500">Non-accelerated spend, summarized at this card&apos;s base rate.</p>
          <ul className="mt-2 space-y-1.5">
            {ex.base_spend.map((b: BaseSpendExplain) => {
              const cutNote = baseRowCutNote(b.category, exAbs.accelerators);
              return (
                <li key={b.category} className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                  <div className="flex items-baseline justify-between gap-3 text-xs">
                    <span className="font-medium text-slate-700">{b.label}</span>
                    <span className="tabular-nums text-slate-600">
                      {inr(b.monthly_spend)} · {b.rate_pct.toFixed(1)}% = {inr(b.value_inr)}/mo
                    </span>
                  </div>
                  {cutNote ? <p className="mt-1 text-[11px] text-slate-500">{cutNote}</p> : null}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <div className="mt-4 flex items-baseline justify-between border-t border-slate-200 pt-3">
        <div>
          <span className="mr-1 rounded border border-amber-300 bg-amber-50 px-1 text-[10px] font-bold uppercase text-amber-800">Est.</span>
          <span className="text-sm text-slate-600">net rewards for this spend, {layer}</span>
        </div>
        <span className="text-lg font-semibold text-slate-900 tabular-nums">{inr(ex.annual_net_inr)}/yr</span>
      </div>
      <p className="mt-1 text-[11px] text-slate-400 tabular-nums">
        {inr(ex.annual_gross_inr)} rewards − {inr(ex.annual_fee_inr)} annual fee. Estimate for the spend you entered.
      </p>
    </section>
  );
}
