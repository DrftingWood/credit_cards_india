"use client";
import { useMemo, useState } from "react";
import type { EnrichedCard, LoyaltyProgram } from "@/lib/types";
import { explainCard, type AcceleratorExplain, type BaseSpendExplain, type ScoringContext } from "@/lib/calculator";
import { useSpendProfile, MAX_MONTHLY_SPEND } from "@/lib/use-spend-profile";
import { CANONICAL_CATEGORIES, CATEGORY_LABELS, type CanonicalCategory } from "@/lib/category-mapping";
import { useValuePrefs } from "@/lib/use-value-prefs";
import { ValueComponentsPanel } from "./value-components-panel";
import { useUsageProfile } from "@/lib/use-usage-profile";
import { DEFAULT_USAGE, cardTierProgram, cardUsageGroups, tierContext, usageContext, usageDelta, withoutUsage, type UsageProfile } from "@/lib/usage";
import { UsagePanel } from "./usage-panel";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

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

export interface BreakdownLayer {
  id: string;
  label: string;
  blurb: string;
  ctx: ScoringContext;
}

const ABSOLUTE_LAYER: BreakdownLayer = {
  id: "absolute",
  label: "Absolute",
  blurb:
    "Best case — every accelerator fires at full rate on the whole bucket at face value. Caps still apply; each row states what you must satisfy.",
  ctx: { valueBasis: "face" },
};

/**
 * The layers this panel offers, and the ScoringContext behind each.
 *
 * When a host view (i.e. /calculator) supplies the exact context it ranked with, that
 * context becomes the primary, default-selected layer — passed through by identity, never
 * reconstructed — so the panel's total reconciles with the ranked row it sits under and the
 * host's own ecosystem/mode controls drive it. Standalone (the card detail page, which has
 * no ranking above it) keeps the self-contained Realistic/Absolute pair.
 *
 * Pure and exported so it's unit-testable without rendering the (hook-driven) component.
 */
export function breakdownLayers(hostCtx?: ScoringContext, hostLabel?: string, usage: UsageProfile = DEFAULT_USAGE): BreakdownLayer[] {
  if (hostCtx) {
    return [
      {
        id: "host",
        label: hostLabel ?? "This calculator",
        blurb: "Scored exactly as the ranking above — your spend, ecosystem and mode settings.",
        ctx: hostCtx,
      },
      ABSOLUTE_LAYER,
    ];
  }
  return [
    {
      id: "realistic",
      label: "Realistic",
      blurb:
        "What you'd realistically keep — caps applied, co-brand and portal rates only on the share you say goes through them, realized redemption value.",
      ctx: {
        applyApplicability: true,
        valueBasis: "realized",
        // Phase 3: the user's declared merchant shares + ecosystems. Nothing declared →
        // empty mix / no shares / no ecosystems — the strict Phase 1 layer.
        ...usageContext(usage),
      },
    },
    ABSOLUTE_LAYER,
  ];
}

/**
 * The context a layer is explained with: its own ctx plus the user's declared loyalty tiers,
 * except for Absolute (the data's best case, not personal). Tier fields only add a separate
 * value-components line; they never change rates or annual_net_inr, so a host layer still
 * reconciles with its ranked row. The host's object is copied, never mutated.
 */
export function explainContext(layer: BreakdownLayer, tiers: Record<string, string>, programs: LoyaltyProgram[]): ScoringContext {
  if (layer.id === "absolute") return layer.ctx;
  const t = tierContext(tiers, programs);
  if (Object.keys(t.tierMap).length === 0) return layer.ctx;
  return { ...layer.ctx, ...t };
}

export function AcceleratorRow({ item }: { item: AcceleratorExplain }) {
  return (
    <li className="rounded-lg border border-line bg-surface p-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold text-fg">{item.label}</span>
        <span className="text-sm font-semibold text-fg tabular-nums">{inr(item.net_value_inr)}/mo</span>
      </div>
      <p className="mt-1 text-xs text-fg-muted tabular-nums">
        You spend {inr(item.monthly_spend)} ·{" "}
        {item.applicability != null && item.applicability < 1 ? `${Math.round(item.applicability * 100)}% at ` : "earns "}
        {item.rate_pct.toFixed(1)}% ={" "}
        <span className="text-fg">{inr(item.uncapped_value_inr)}</span> uncapped
        {item.cap_bound && item.cap_monthly_inr != null ? (
          <>
            {" "}→ cap {inr(item.cap_monthly_inr)} clamps it, <span className="text-warn">{inr(item.lost_to_cap_inr)} lost to the cap</span>
            {item.base_spillover_inr > 0 ? <> · {inr(item.base_spillover_inr)} earned at base beyond it</> : null}
          </>
        ) : null}
      </p>
      {item.factors.length > 0 ? (
        <ul className="mt-1.5 flex flex-wrap gap-1.5">
          {item.factors.map((f, i) => (
            <li key={i} className="rounded border border-line bg-surface-subtle px-2 py-0.5 text-[11px] text-fg-muted">{f}</li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function AccelerationBreakdown({
  card,
  hostCtx,
  hostLabel,
  programs = [],
}: {
  card: EnrichedCard;
  /** Loyalty programmes (only tiered ones matter): lets the user's declared tier be valued. */
  programs?: LoyaltyProgram[];
  /** The exact ScoringContext the embedding view ranked with, if any. Supplying it makes
   *  this panel's total reconcile with the row above it instead of scoring its own way. */
  hostCtx?: ScoringContext;
  hostLabel?: string;
}) {
  const [spend, setSpend] = useSpendProfile(); // shared + persisted across all calculators
  const [valuePrefs, setValuePrefs] = useValuePrefs(); // tenure + lounge usage, shared the same way
  const [usage, setUsage] = useUsageProfile(); // merchant shares + ecosystems, shared the same way
  const layers = useMemo(() => breakdownLayers(hostCtx, hostLabel, usage), [hostCtx, hostLabel, usage]);
  const [layerId, setLayerId] = useState(() => layers[0].id);
  // Fall back to the primary layer if the host swapped the layer set out from under us.
  const layer = layers.find((l) => l.id === layerId) ?? layers[0];

  const ctx = useMemo(() => explainContext(layer, usage.loyalty_tiers, programs), [layer, usage.loyalty_tiers, programs]);
  const ex = useMemo(() => explainCard(card, spend, ctx, valuePrefs), [card, spend, ctx, valuePrefs]);
  const tierProgram = useMemo(() => cardTierProgram(card, programs), [card, programs]);
  // Absolute layer, computed unconditionally (explainCard is pure/cheap): the source of
  // truth for "what got cut" notes on base-rate rows in the selected layer (FIX 1).
  const exAbs = useMemo(() => explainCard(card, spend, { valueBasis: "face" }), [card, spend]);
  // Usage questions apply only to a realistic layer (one that gates narrow rates). What the
  // user's answers changed = this layer vs the same layer with nothing declared.
  const usageGroups = useMemo(() => cardUsageGroups(card), [card]);
  const ecosystem = card.current_rewards?.redemption_scope === "closed-loop" ? card.current_rewards.ecosystem_label ?? null : null;
  const isRealistic = layer.ctx.applyApplicability === true;
  const deltas = useMemo(
    () => (isRealistic ? usageDelta(ex, explainCard(card, spend, withoutUsage(layer.ctx))) : []),
    [isRealistic, ex, card, spend, layer],
  );

  return (
    <section className="rounded-xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-fg">See the math — accelerations &amp; caps</h2>
        <div className="inline-flex rounded-lg border border-line-strong p-0.5 text-xs">
          {layers.map((l) => (
            <button key={l.id} type="button" onClick={() => setLayerId(l.id)}
              className={l.id === layer.id ? "rounded-md bg-fg px-3 py-1 font-medium text-surface" : "rounded-md px-3 py-1 text-fg-muted"}>
              {l.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-1 text-xs text-fg-muted">{layer.blurb}</p>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {CANONICAL_CATEGORIES.map((cat) => (
          <label key={cat} className="text-xs text-fg-muted">
            {CATEGORY_LABELS[cat] ?? cat}
            <input type="number" min={0} max={MAX_MONTHLY_SPEND} inputMode="numeric" value={spend[cat]}
              onChange={(e) => setSpend((s) => ({ ...s, [cat]: Math.max(0, Math.min(MAX_MONTHLY_SPEND, Number(e.target.value) || 0)) }))}
              className="mt-0.5 w-full rounded-md border border-line-strong px-2 py-1 text-sm text-fg tabular-nums" />
          </label>
        ))}
      </div>

      {isRealistic || (tierProgram && layer.id !== "absolute") ? (
        <UsagePanel
          groups={isRealistic ? usageGroups : []}
          usage={usage}
          ecosystem={isRealistic ? ecosystem : null}
          deltas={deltas}
          onChange={(u) => setUsage(() => u)}
          tier={tierProgram ? { program: tierProgram, bonus: ex.value_components?.loyalty_tier ?? null } : undefined}
        />
      ) : null}

      {ex.accelerators.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {ex.accelerators.map((a) => <AcceleratorRow key={a.category} item={a} />)}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-fg-muted">No accelerated categories apply to the spend you entered — everything earns the base rate.</p>
      )}

      {ex.base_spend.length > 0 ? (
        <div className="mt-4 border-t border-line pt-3">
          <h3 className="text-sm font-semibold text-fg">Base-rate spend</h3>
          <p className="mt-0.5 text-xs text-fg-muted">Non-accelerated spend, summarized at this card&apos;s base rate.</p>
          <ul className="mt-2 space-y-1.5">
            {ex.base_spend.map((b: BaseSpendExplain) => {
              const cutNote = baseRowCutNote(b.category, exAbs.accelerators);
              return (
                <li key={b.category} className="rounded-lg border border-line bg-surface-subtle p-2.5">
                  <div className="flex items-baseline justify-between gap-3 text-xs">
                    <span className="font-medium text-fg-secondary">{b.label}</span>
                    <span className="tabular-nums text-fg-muted">
                      {inr(b.monthly_spend)} · {b.rate_pct.toFixed(1)}% = {inr(b.value_inr)}/mo
                    </span>
                  </div>
                  {cutNote ? <p className="mt-1 text-[11px] text-fg-muted">{cutNote}</p> : null}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <div className="mt-4 flex items-baseline justify-between border-t border-line pt-3">
        <div>
          <span className="mr-1 rounded border border-warn-line bg-warn-subtle px-1 text-[10px] font-bold uppercase text-warn">Est.</span>
          <span className="text-sm text-fg-muted">net rewards for this spend, {layer.label.toLowerCase()}</span>
        </div>
        <span className="text-lg font-semibold text-fg tabular-nums">{inr(ex.annual_net_inr)}/yr</span>
      </div>
      <p className="mt-1 text-[11px] text-fg-muted tabular-nums">
        {inr(ex.annual_gross_inr)} rewards − {inr(ex.annual_fee_inr)} annual fee
        {ex.annual_forex_inr > 0 ? <> − {inr(ex.annual_forex_inr)} forex markup on international spend</> : null}. Estimate for the spend you entered.
      </p>

      {ex.value_components ? (
        <ValueComponentsPanel vc={ex.value_components} prefs={valuePrefs} onPrefsChange={(p) => setValuePrefs(() => p)} />
      ) : null}
    </section>
  );
}
