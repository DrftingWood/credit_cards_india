"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { EnrichedCard, LoyaltyProgram } from "@/lib/types";
import { CANONICAL_CATEGORIES, CATEGORY_LABELS } from "@/lib/category-mapping";
import { cardHref } from "@/lib/data";
import { IssuerLogo } from "@/components/logos/issuer-logo";
import { NetworkLogo } from "@/components/logos/network-logo";
import { explainCard, forexCost, rankCards, listEcosystems, type CardScore, type ScoringContext, type SpendProfile } from "@/lib/calculator";
import { useSpendProfile, MAX_MONTHLY_SPEND } from "@/lib/use-spend-profile";
import { useValuePrefs } from "@/lib/use-value-prefs";
import { explainValueComponents, type ValuePrefs } from "@/lib/value-components";
import { valueSummaryLine } from "@/components/detail/value-components-panel";
import { useUsageProfile } from "@/lib/use-usage-profile";
import { tierContext, toggleEcosystem, usageContext } from "@/lib/usage";
import { DeclaredUsageSummary } from "@/components/detail/usage-panel";
import { AccelerationBreakdown } from "@/components/detail/acceleration-breakdown";
import { formatInr, formatPct } from "@/lib/utils";

/** Parse an input value to a finite rupee amount in [0, MAX_MONTHLY_SPEND]. The ceiling
 *  lives in the shared spend store, which enforces it on every write. */
function clampSpend(raw: string): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.min(MAX_MONTHLY_SPEND, n);
}

/** Group the closed-loop ecosystems by the activity a user can actually answer for. */
const ECO_GROUPS: { label: string; icon: string; ecos: string[] }[] = [
  { label: "Shopping & retail", icon: "🛍", ecos: ["Tata Neu", "Adani One", "Shoppers Stop"] },
  { label: "Travel", icon: "✈️", ecos: ["SpiceJet", "IRCTC", "ixigo"] },
  { label: "Fuel", icon: "⛽", ecos: ["IndianOil"] },
  { label: "Health", icon: "❤️", ecos: ["Apollo"] },
  { label: "Bills & apps", icon: "💳", ecos: ["CheQ"] },
];

export function CalculatorClient({ cards, programs = [] }: { cards: EnrichedCard[]; programs?: LoyaltyProgram[] }) {
  const [spend, setSpend] = useSpendProfile();
  const [valuePrefs] = useValuePrefs();
  const selectedId = useSearchParams().get("card");
  const selectedCard = useMemo(
    () => (selectedId ? cards.find((c) => c.id === selectedId) ?? null : null),
    [cards, selectedId],
  );

  // Layer 2 — ecosystem preferences. Closed-loop points (Adani One, Tata Neu, …) are real ₹1
  // money only if you use that ecosystem. Default is REALISTIC: nothing ticked, so closed-loop
  // cards show at base rate until you opt into the ecosystems you actually use. A one-click
  // Best-case mode assumes you use every ecosystem (optimistic — the old behaviour).
  const ecosystems = useMemo(() => listEcosystems(cards), [cards]);
  const [mode, setMode] = useState<"realistic" | "best">("realistic");
  // Ecosystems and merchant shares live in the shared usage store (Phase 3), so what you
  // tick here is what the card pages' Realistic layer uses too, and it survives a reload.
  const [usage, setUsage] = useUsageProfile();
  const enabledEco = useMemo(() => new Set(usage.ecosystems), [usage.ecosystems]);
  const toggleEco = (eco: string) => setUsage((u) => toggleEcosystem(u, eco));

  // The single context this view scores with. Memoised on its own so the exact object can
  // also be handed to the embedded AccelerationBreakdown — the panel must reconcile with the
  // row it sits under, which it can't do if it builds a context of its own.
  const rankCtx: ScoringContext = useMemo(() => {
    // Best-case → enabledEcosystems undefined (optimistic path credits every ecosystem in full).
    if (mode === "best") return {};
    // Opt-in (D-3 keeps /calculator channel-optimistic by default): co-brand and portal rates
    // count only on the merchant shares the user declared; undeclared ones earn base.
    if (usage.gate_calculator) return { ...usageContext(usage), applyApplicability: true };
    return { enabledEcosystems: enabledEco };
  }, [mode, enabledEco, usage]);

  // The user's declared loyalty tiers (Phase 3). They add only a separate value line, never
  // the rank, so the row one-liners use them while rankCards keeps rankCtx unchanged.
  const tierCtx = useMemo(() => tierContext(usage.loyalty_tiers, programs), [usage.loyalty_tiers, programs]);

  const { ranked, pinnedSelected } = useMemo(() => {
    const all = rankCards(cards, spend, rankCtx);
    const top = all.slice(0, 10);
    if (!selectedId) return { ranked: top, pinnedSelected: null as CardScore | null };
    const inTop = top.some((r) => r.card.id === selectedId);
    if (inTop) return { ranked: top, pinnedSelected: null };
    const pinned = all.find((r) => r.card.id === selectedId) ?? null;
    return { ranked: top, pinnedSelected: pinned };
  }, [cards, spend, selectedId, rankCtx]);

  const monthlyTotal = Object.values(spend).reduce((a, b) => a + (b || 0), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
      <form className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-fg">Your monthly spend</h2>
          <p className="text-xs text-fg-muted mt-0.5">
            Fill in how much you spend per category each month. Set to ₹0 to ignore.
          </p>
        </div>

        {CANONICAL_CATEGORIES.map((cat) => (
          <div key={cat}>
            <label className="block text-sm text-fg-secondary mb-1">{CATEGORY_LABELS[cat]}</label>
            <div className="flex items-center gap-2">
              <span className="text-fg-muted">₹</span>
              <input
                type="number"
                min={0}
                max={MAX_MONTHLY_SPEND}
                step={500}
                value={spend[cat]}
                onChange={(e) =>
                  setSpend((s) => ({ ...s, [cat]: clampSpend(e.target.value) }))
                }
                className="w-full rounded-md border border-line-strong px-2 py-1.5 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-focus"
              />
            </div>
          </div>
        ))}

        <div className="rounded-md bg-surface-subtle p-3 text-sm">
          <div className="flex justify-between">
            <span>Monthly total</span>
            <strong className="tabular-nums">{formatInr(monthlyTotal)}</strong>
          </div>
          <div className="flex justify-between text-fg-muted">
            <span>Annualised</span>
            <span className="tabular-nums">{formatInr(monthlyTotal * 12)}</span>
          </div>
        </div>

        {ecosystems.length > 0 ? (
          <div className="border-t border-line pt-4">
            <h2 className="text-sm font-semibold text-fg">Ecosystem-locked points 🔒</h2>
            <p className="text-xs text-fg-muted mt-0.5">
              Some cards earn points redeemable only inside one ecosystem — real ₹1 money only if you use it.
            </p>
            {/* master mode */}
            <div className="mt-2 space-y-1 text-xs">
              {(["realistic", "best"] as const).map((m) => (
                <label key={m} className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="eco-mode"
                    checked={mode === m}
                    onChange={() => setMode(m)}
                    className="mt-0.5"
                  />
                  <span className="text-fg-secondary">
                    {m === "realistic" ? (
                      <><strong>Realistic</strong> — only count ecosystems I use (tick below)</>
                    ) : (
                      <><strong>Best-case</strong> — assume I use every ecosystem</>
                    )}
                  </span>
                </label>
              ))}
            </div>

            {mode === "realistic" ? (
              <div className="mt-3 space-y-2">
                {ECO_GROUPS.map((g) => {
                  const present = g.ecos.filter((e) => ecosystems.includes(e));
                  if (present.length === 0) return null;
                  return (
                    <div key={g.label}>
                      <div className="text-[11px] font-medium text-fg-muted">{g.icon} {g.label}</div>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {present.map((eco) => {
                          const on = enabledEco.has(eco);
                          return (
                            <button
                              key={eco}
                              type="button"
                              onClick={() => toggleEco(eco)}
                              aria-pressed={on}
                              className={
                                on
                                  ? "rounded-full border border-success bg-success-subtle text-success px-2.5 py-1 text-xs font-medium"
                                  : "rounded-full border border-line-strong bg-surface text-fg-muted px-2.5 py-1 text-xs"
                              }
                            >
                              {on ? "✓ " : "+ "}{eco}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                <p className="text-[11px] text-fg-muted pt-1">
                  Tick the ones you genuinely use — we only count rewards you can actually spend. Everything else
                  shows at base rate.
                </p>
              </div>
            ) : (
              <p className="mt-3 rounded-md bg-warn-subtle border border-warn-line p-2 text-[11px] text-warn">
                Best-case: every ecosystem-locked card is valued at full worth, as if you use them all. Switch to
                Realistic for your actual numbers.
              </p>
            )}
          </div>
        ) : null}

        {mode === "realistic" ? (
          <div className="border-t border-line pt-4">
            <h2 className="text-sm font-semibold text-fg">Co-brand &amp; portal rates</h2>
            <label className="mt-2 flex items-start gap-2 text-xs text-fg-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={usage.gate_calculator}
                onChange={(e) => setUsage((u) => ({ ...u, gate_calculator: e.target.checked }))}
                className="mt-0.5"
              />
              <span>
                <strong>Count them only on the share I declare</strong> — otherwise each is assumed to cover its
                whole category, as if you always book or shop through it.
              </span>
            </label>
            <div className="mt-2">
              <DeclaredUsageSummary usage={usage} onChange={(u) => setUsage(() => u)} />
            </div>
          </div>
        ) : null}
      </form>

      <div>
        <h2 className="text-lg font-semibold text-fg">Ranked by net annual value</h2>
        <p className="text-xs text-fg-muted mt-0.5">
          Approximate, and ranked on steady-state spend rewards only. Welcome, milestone and lounge value are shown
          separately on each row and in the breakdown, never mixed into the rank. Some complex caps are simplified.
        </p>
        {pinnedSelected ? (
          <div className="mt-4">
            <div className="text-xs uppercase tracking-wide text-accent-fg mb-1">Selected card</div>
            <ResultRow rank={null} score={pinnedSelected} spend={spend} valuePrefs={valuePrefs} rankCtx={rankCtx} tierCtx={tierCtx} highlighted />
          </div>
        ) : null}
        <ol className="mt-4 space-y-3">
          {ranked.map((r, i) => (
            <ResultRow
              key={r.card.id}
              rank={i + 1}
              score={r}
              spend={spend}
              valuePrefs={valuePrefs}
              rankCtx={rankCtx}
              tierCtx={tierCtx}
              highlighted={r.card.id === selectedId}
            />
          ))}
        </ol>
        {ranked.length === 0 ? (
          <div className="mt-4 rounded-md border border-dashed border-line-strong bg-surface-subtle p-8 text-center text-fg-muted">
            Enter some spend on the left to see rankings.
          </div>
        ) : null}

        {selectedCard ? (
          <div className="mt-6">
            <AccelerationBreakdown
              card={selectedCard}
              hostCtx={rankCtx}
              hostLabel={mode === "best" ? "Best-case" : "Realistic"}
              programs={programs}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ResultRow({
  rank,
  score,
  spend,
  valuePrefs,
  rankCtx,
  tierCtx,
  highlighted = false,
}: {
  rank: number | null;
  score: CardScore;
  spend: SpendProfile;
  valuePrefs: ValuePrefs;
  rankCtx: ScoringContext;
  tierCtx: ReturnType<typeof tierContext>;
  highlighted?: boolean;
}) {
  const c = score.card;
  const href = cardHref(c);
  // A declared tier for this card's programme: value it the way the embedded breakdown does
  // (same rank ctx + tier fields), so the row's Year 1 / Year 2+ match the panel below it.
  const pid = c.current_rewards?.loyalty_program;
  const loyaltyTier = pid && tierCtx.tierMap[pid]
    ? explainCard(c, spend, { ...rankCtx, ...tierCtx }, valuePrefs).value_components?.loyalty_tier ?? null
    : null;
  // Decoupled one-offs: computed from this row's own steady-state result, shown beside it, never ranked on.
  const extra = valueSummaryLine(
    explainValueComponents(
      c, spend,
      { annual_gross_inr: score.annual_gross_inr, annual_fee_inr: score.annual_fee_effective_inr, forex: forexCost(c, spend), loyalty_tier: loyaltyTier },
      valuePrefs,
    ),
  );

  return (
    <li
      className={
        highlighted
          ? "rounded-xl border-2 border-accent bg-accent-subtle p-4"
          : "rounded-xl border border-line bg-surface p-4"
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="text-fg-muted font-semibold tabular-nums w-6 text-right">
            {rank != null ? `#${rank}` : "★"}
          </div>
          <div>
            <Link href={href} className="font-semibold text-fg hover:text-fg">
              {c.name}
            </Link>
            {score.closed_loop_ecosystem ? (
              <span
                title={
                  score.ecosystem_credited
                    ? `Rewards redeem only within ${score.closed_loop_ecosystem} — counted at full value because you use it`
                    : `Rewards redeem only within ${score.closed_loop_ecosystem}, which you haven't ticked — shown at base rate. Tick it on the left to value them in full.`
                }
                className={
                  score.ecosystem_credited
                    ? "ml-2 rounded-full bg-success-subtle text-success ring-1 ring-success-line px-1.5 py-0.5 text-[10px] font-medium align-middle"
                    : "ml-2 rounded-full bg-surface-muted text-fg-muted ring-1 ring-line px-1.5 py-0.5 text-[10px] font-medium align-middle"
                }
              >
                {score.ecosystem_credited ? "🔓" : "🔒"} {score.closed_loop_ecosystem}
                {score.ecosystem_credited ? "" : " · base rate"}
              </span>
            ) : null}
            <div className="mt-1 flex items-center gap-2 text-xs text-fg-muted">
              <IssuerLogo issuer={c.issuer_detail} height={14} />
              <span>· {c.tier.replace("-", " ")}</span>
              <span>·</span>
              <NetworkLogo network={c.network_detail} height={14} />
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold tabular-nums text-success">
            {formatInr(Math.round(score.annual_net_inr))} / yr
          </div>
          <div className="text-xs text-fg-muted tabular-nums">
            gross {formatInr(Math.round(score.annual_gross_inr))} − fee{" "}
            {score.fee_waived ? (
              <span className="text-success">waived</span>
            ) : (
              formatInr(score.annual_fee_effective_inr)
            )}
            {score.annual_forex_inr > 0 ? <> − forex {formatInr(Math.round(score.annual_forex_inr))}</> : null}
          </div>
          {extra ? <div className="mt-0.5 text-[11px] text-fg-muted tabular-nums">{extra}</div> : null}
        </div>
      </div>

      <details className="mt-3 text-sm" open={highlighted}>
        <summary className="cursor-pointer text-fg-muted hover:text-fg text-xs uppercase tracking-wide">
          Breakdown
        </summary>
        <table className="mt-2 w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-fg-muted border-b border-line">
              <th className="py-1 pr-3 font-medium">Category</th>
              <th className="py-1 pr-3 font-medium">Rate</th>
              <th className="py-1 pr-3 font-medium">Monthly</th>
            </tr>
          </thead>
          <tbody>
            {score.buckets.map((b) => (
              <tr key={b.category} className="border-b border-line last:border-0">
                <td className="py-1.5 pr-3 capitalize">
                  {b.category.replace("-", " ")}
                  {b.note ? <span className="text-xs text-warn ml-2">{b.note}</span> : null}
                </td>
                <td className="py-1.5 pr-3 tabular-nums">{formatPct(b.effective_rate_pct, 2)}</td>
                <td className="py-1.5 pr-3 tabular-nums">
                  {formatInr(Math.round(b.monthly_value_inr))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {score.disclaimer ? <p className="mt-2 text-xs text-fg-muted">{score.disclaimer}</p> : null}
      </details>
    </li>
  );
}
