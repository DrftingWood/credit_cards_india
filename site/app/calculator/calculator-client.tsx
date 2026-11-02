"use client";

import Link from "next/link";
import { useMemo, useState, type ComponentType } from "react";
import { useSearchParams } from "next/navigation";
import type { EnrichedCard, LoyaltyProgram } from "@/lib/types";
import { CANONICAL_CATEGORIES, CATEGORY_LABELS } from "@/lib/category-mapping";
import { cardHref } from "@/lib/data";
import { IconBag, IconBalance, IconBills, IconCheck, IconDining, IconFuel, IconHealth, IconLock, IconShopping, IconStar, IconTip, IconTravel, IconUnlock, IconWarning } from "@/components/icons";
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
import { allocatePortfolio, type PortfolioSlot } from "@/lib/portfolio";
import { formatInr, formatPct } from "@/lib/utils";

/** Parse an input value to a finite rupee amount in [0, MAX_MONTHLY_SPEND]. The ceiling
 *  lives in the shared spend store, which enforces it on every write. */
function clampSpend(raw: string): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.min(MAX_MONTHLY_SPEND, n);
}

/** Group the closed-loop ecosystems by the activity a user can actually answer for. */
const ECO_GROUPS: { label: string; Icon: ComponentType<{ className?: string }>; ecos: string[] }[] = [
  { label: "Shopping & retail", Icon: IconBag, ecos: ["Tata Neu", "Adani One", "Shoppers Stop"] },
  { label: "Travel", Icon: IconTravel, ecos: ["SpiceJet", "IRCTC", "ixigo"] },
  { label: "Fuel", Icon: IconFuel, ecos: ["IndianOil"] },
  { label: "Health", Icon: IconHealth, ecos: ["Apollo"] },
  { label: "Bills & apps", Icon: IconBills, ecos: ["CheQ"] },
];

interface SpendPreset {
  id: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
  tooltip: string;
  spend: SpendProfile;
  merchant?: { key: string; share: number };
}

const SPEND_PRESETS: SpendPreset[] = [
  {
    id: "swiggy-50k",
    label: "Swiggy / Food Apps",
    Icon: IconDining,
    tooltip: "₹50,000/mo on food delivery (Swiggy, Zomato)",
    spend: { online: 0, groceries: 0, dining: 50000, fuel: 0, travel: 0, utilities: 0, rent: 0, international: 0 },
    merchant: { key: "swiggy", share: 100 },
  },
  {
    id: "travel-100k",
    label: "Frequent Traveler",
    Icon: IconTravel,
    tooltip: "₹1,00,000/mo on flights, hotels & travel booking",
    spend: { online: 0, groceries: 0, dining: 0, fuel: 0, travel: 100000, utilities: 0, rent: 0, international: 0 },
  },
  {
    id: "ecom-50k",
    label: "Online Shopping",
    Icon: IconBag,
    tooltip: "₹50,000/mo on e-commerce (Amazon, Flipkart)",
    spend: { online: 50000, groceries: 0, dining: 0, fuel: 0, travel: 0, utilities: 0, rent: 0, international: 0 },
    merchant: { key: "amazon", share: 80 },
  },
  {
    id: "fuel-20k",
    label: "Daily Commute & Fuel",
    Icon: IconFuel,
    tooltip: "₹20,000/mo on petrol/diesel & vehicle expenses",
    spend: { online: 0, groceries: 0, dining: 0, fuel: 20000, travel: 0, utilities: 0, rent: 0, international: 0 },
  },
  {
    id: "groceries-30k",
    label: "Groceries & Quick-Commerce",
    Icon: IconShopping,
    tooltip: "₹30,000/mo on Instamart, Blinkit & supermarkets",
    spend: { online: 0, groceries: 30000, dining: 0, fuel: 0, travel: 0, utilities: 0, rent: 0, international: 0 },
  },
  {
    id: "balanced-50k",
    label: "Balanced Household",
    Icon: IconBalance,
    tooltip: "₹50,000/mo across multiple typical categories",
    spend: { online: 15000, groceries: 12000, dining: 8000, fuel: 5000, travel: 5000, utilities: 5000, rent: 0, international: 0 },
  },
];

export function CalculatorClient({ cards, programs = [] }: { cards: EnrichedCard[]; programs?: LoyaltyProgram[] }) {
  const [spend, setSpend] = useSpendProfile();
  const [valuePrefs] = useValuePrefs();
  const selectedId = useSearchParams().get("card");
  const selectedCard = useMemo(
    () => (selectedId ? cards.find((c) => c.id === selectedId) ?? null : null),
    [cards, selectedId],
  );

  // Strategy view: Single Best Card vs. Cap-Aware Multi-Card Stack
  const [strategy, setStrategy] = useState<"single" | "portfolio">("single");

  // Layer 2 — ecosystem preferences.
  const ecosystems = useMemo(() => listEcosystems(cards), [cards]);
  const [mode, setMode] = useState<"realistic" | "best">("realistic");
  const [usage, setUsage] = useUsageProfile();
  const enabledEco = useMemo(() => new Set(usage.ecosystems), [usage.ecosystems]);
  const toggleEco = (eco: string) => setUsage((u) => toggleEcosystem(u, eco));

  const programCtx = useMemo(
    () => ({ programs: Object.fromEntries(programs.map((p) => [p.id, p])), stackProgramEarn: false }),
    [programs],
  );
  const rankCtx: ScoringContext = useMemo(() => {
    if (mode === "best") return { ...programCtx };
    if (usage.gate_calculator) return { ...usageContext(usage), applyApplicability: true, ...programCtx };
    return { enabledEcosystems: enabledEco, ...programCtx };
  }, [mode, enabledEco, usage, programCtx]);

  const tierCtx = useMemo(() => tierContext(usage.loyalty_tiers, programs), [usage.loyalty_tiers, programs]);

  // Single-card ranking
  const { ranked, pinnedSelected } = useMemo(() => {
    const all = rankCards(cards, spend, rankCtx);
    const top = all.slice(0, 10);
    if (!selectedId) return { ranked: top, pinnedSelected: null as CardScore | null };
    const inTop = top.some((r) => r.card.id === selectedId);
    if (inTop) return { ranked: top, pinnedSelected: null };
    const pinned = all.find((r) => r.card.id === selectedId) ?? null;
    return { ranked: top, pinnedSelected: pinned };
  }, [cards, spend, selectedId, rankCtx]);

  // Cap-aware multi-card portfolio
  const portfolio = useMemo(() => {
    return allocatePortfolio(cards, spend, rankCtx, { dropFeeNegative: true });
  }, [cards, spend, rankCtx]);

  const monthlyTotal = Object.values(spend).reduce((a, b) => a + (b || 0), 0);

  const topSingleScore = ranked[0] ?? null;
  const portfolioGainAnnual = topSingleScore ? portfolio.annual_net_inr - topSingleScore.annual_net_inr : 0;

  const applyPreset = (preset: SpendPreset) => {
    setSpend(() => preset.spend);
    if (preset.merchant) {
      setUsage((u) => ({
        ...u,
        merchant_share_pct: { ...u.merchant_share_pct, [preset.merchant!.key]: preset.merchant!.share },
      }));
    }
  };

  const clearSpend = () => {
    setSpend(() => ({
      online: 0,
      groceries: 0,
      dining: 0,
      fuel: 0,
      travel: 0,
      utilities: 0,
      rent: 0,
      international: 0,
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
      <form className="space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-fg">Your monthly spend</h2>
            {monthlyTotal > 0 ? (
              <button
                type="button"
                onClick={clearSpend}
                className="text-xs text-accent-fg hover:underline cursor-pointer"
              >
                Reset to ₹0
              </button>
            ) : null}
          </div>
          <p className="text-xs text-fg-muted mt-0.5">
            Select a quick scenario or type your monthly spend per category.
          </p>
        </div>

        {/* Quick Scenario Preset Chips */}
        <div>
          <div className="text-[11px] font-medium text-fg-muted uppercase tracking-wider mb-1.5">
            Quick Scenarios
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SPEND_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                title={p.tooltip}
                onClick={() => applyPreset(p)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface hover:bg-surface-subtle px-2.5 py-1 text-xs text-fg-secondary transition-colors"
              >
                <p.Icon className="text-sm" />
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-line pt-3 space-y-3">
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
                  className="w-full rounded-md border border-line-strong px-2 py-1.5 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-focus bg-surface text-fg"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-md bg-surface-subtle p-3 text-sm border border-line">
          <div className="flex justify-between">
            <span>Monthly total</span>
            <strong className="num">{formatInr(monthlyTotal)}</strong>
          </div>
          <div className="flex justify-between text-fg-muted">
            <span>Annualised</span>
            <span className="num">{formatInr(monthlyTotal * 12)}</span>
          </div>
        </div>

        {ecosystems.length > 0 ? (
          <div className="border-t border-line pt-4">
            <h2 className="text-sm font-semibold text-fg">Ecosystem-locked points</h2>
            <p className="text-xs text-fg-muted mt-0.5">
              Some cards earn points redeemable only inside one ecosystem — real ₹1 money only if you use it.
            </p>
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
                      <div className="inline-flex items-center gap-1 text-[11px] font-medium text-fg-muted"><g.Icon />{g.label}</div>
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
                              {on ? <IconCheck className="mr-1 inline h-3.5 w-3.5" /> : "+ "}{eco}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
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

      {/* Right Column: Comparative Results */}
      <div className="space-y-4">
        {/* Strategy Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3">
          <div>
            <h2 className="text-lg font-semibold text-fg">
              {strategy === "single" ? "Ranked by net annual value" : "Optimal Multi-Card Stack (Portfolio)"}
            </h2>
            <p className="text-xs text-fg-muted mt-0.5">
              {strategy === "single"
                ? "If you want to pick just one card for all your spending."
                : "Composes cards up to their monthly caps, spilling excess spend to the next card."}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-surface-subtle p-1 rounded-lg border border-line shrink-0">
            <button
              type="button"
              onClick={() => setStrategy("single")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                strategy === "single"
                  ? "bg-surface shadow text-fg font-semibold"
                  : "text-fg-muted hover:text-fg"
              }`}
            >
              Single Card
            </button>
            <button
              type="button"
              onClick={() => setStrategy("portfolio")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                strategy === "portfolio"
                  ? "bg-accent text-accent-fg font-semibold shadow"
                  : "text-fg-muted hover:text-fg"
              }`}
            >
              Multi-Card Stack
            </button>
          </div>
        </div>

        {monthlyTotal === 0 ? (
          <div className="rounded-md border border-dashed border-line-strong bg-surface-subtle p-8 text-center text-fg-muted">
            Enter spend on the left or click a quick scenario above to see comparisons.
          </div>
        ) : strategy === "portfolio" ? (
          /* Multi-Card Stack View */
          <div className="space-y-4">
            {/* Value Header Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-line bg-surface p-3">
                <div className="text-xs text-fg-muted font-medium">Net Annual Value</div>
                <div className="text-lg font-bold text-success num mt-0.5">
                  {formatInr(Math.round(portfolio.annual_net_inr))}
                </div>
                <div className="text-[11px] text-fg-muted">after all card fees</div>
              </div>
              <div className="rounded-xl border border-line bg-surface p-3">
                <div className="text-xs text-fg-muted font-medium">Monthly Rewards</div>
                <div className="text-lg font-bold text-fg num mt-0.5">
                  {formatInr(Math.round(portfolio.monthly_value_inr))}
                </div>
                <div className="text-[11px] text-fg-muted">per month</div>
              </div>
              <div className="rounded-xl border border-line bg-surface p-3">
                <div className="text-xs text-fg-muted font-medium">Effective Return</div>
                <div className="text-lg font-bold text-accent-fg num mt-0.5">
                  {monthlyTotal > 0 ? ((portfolio.monthly_value_inr / monthlyTotal) * 100).toFixed(2) : "0"}%
                </div>
                <div className="text-[11px] text-fg-muted">blended rate on spend</div>
              </div>
              <div className="rounded-xl border border-line bg-surface p-3">
                <div className="text-xs text-fg-muted font-medium">Annual Card Fees</div>
                <div className="text-lg font-bold text-fg-muted num mt-0.5">
                  {formatInr(Math.round(portfolio.annual_fee_inr))}
                </div>
                <div className="text-[11px] text-fg-muted">net of waivers</div>
              </div>
            </div>

            {/* Comparison Callout */}
            {portfolioGainAnnual > 500 && topSingleScore ? (
              <div className="rounded-xl border border-success/30 bg-success-subtle/50 p-4 flex items-start gap-3">
                <IconTip className="shrink-0 text-xl text-accent-fg" />
                <div className="text-xs sm:text-sm text-fg">
                  <strong>Stacking Advantage: </strong>
                  By using this {portfolio.slots.length}-card stack instead of relying on a single card (
                  <strong>{topSingleScore.card.name}</strong>), you earn an extra{" "}
                  <strong className="text-success">{formatInr(Math.round(portfolioGainAnnual))} per year</strong>{" "}
                  because your spend no longer gets clipped by single-card monthly caps!
                </div>
              </div>
            ) : null}

            {/* Spend Allocation Visualizer */}
            <div className="rounded-xl border border-line bg-surface p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-fg-muted font-medium">
                <span>Monthly Spend Routing ({formatInr(monthlyTotal)}/mo)</span>
                <span>{portfolio.slots.length} Cards in Stack</span>
              </div>
              <div className="h-3 w-full bg-surface-subtle rounded-full overflow-hidden flex border border-line">
                {portfolio.slots.map((s, idx) => {
                  const pct = (s.monthly_spend_inr / monthlyTotal) * 100;
                  const colors = [
                    "bg-blue-500",
                    "bg-emerald-500",
                    "bg-purple-500",
                    "bg-amber-500",
                    "bg-rose-500",
                  ];
                  return (
                    <div
                      key={s.card.id}
                      style={{ width: `${pct}%` }}
                      title={`${s.card.name}: ${formatInr(Math.round(s.monthly_spend_inr))} (${pct.toFixed(1)}%)`}
                      className={`${colors[idx % colors.length]} h-full transition-all`}
                    />
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-fg-muted pt-1">
                {portfolio.slots.map((s, idx) => {
                  const colors = [
                    "bg-blue-500",
                    "bg-emerald-500",
                    "bg-purple-500",
                    "bg-amber-500",
                    "bg-rose-500",
                  ];
                  return (
                    <span key={s.card.id} className="inline-flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${colors[idx % colors.length]}`} />
                      <span className="font-medium text-fg">{s.card.name}</span>: {formatInr(Math.round(s.monthly_spend_inr))}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Stack Card Slots */}
            <div className="space-y-3">
              {portfolio.slots.map((slot, index) => (
                <PortfolioSlotRow key={slot.card.id} slot={slot} index={index} />
              ))}
            </div>

            {portfolio.unallocated_monthly_spend_inr > 0 ? (
              <div className="rounded-xl border border-warn/30 bg-warn-subtle/50 p-4 text-xs text-warn">
                <IconWarning className="mr-1 inline align-[-0.125em]" /><strong>Unallocated Spend: </strong>
                {formatInr(Math.round(portfolio.unallocated_monthly_spend_inr))}/mo could not be routed to any
                card offering an accelerated reward because all eligible candidate cards hit their monthly caps.
              </div>
            ) : null}
          </div>
        ) : (
          /* Single Card Ranking View */
          <div>
            {pinnedSelected ? (
              <div className="mb-4">
                <div className="text-xs uppercase tracking-label text-accent-fg mb-1">Selected card</div>
                <ResultRow rank={null} score={pinnedSelected} spend={spend} valuePrefs={valuePrefs} rankCtx={rankCtx} tierCtx={tierCtx} highlighted />
              </div>
            ) : null}
            <ol className="space-y-3">
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
          </div>
        )}

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

function PortfolioSlotRow({ slot, index }: { slot: PortfolioSlot; index: number }) {
  const c = slot.card;
  const href = cardHref(c);

  return (
    <div className="rounded-xl border border-line bg-surface p-4 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent-fg text-xs font-bold">
            #{index + 1}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Link href={href} className="font-semibold text-fg hover:underline">
                {c.name}
              </Link>
              {slot.cap_bound ? (
                <span className="rounded-full bg-warn-subtle text-warn border border-warn-line px-2 py-0.5 text-[10px] font-semibold inline-flex items-center gap-1">
                  <IconWarning /> Cap Bound — Spend Spills
                </span>
              ) : (
                <span className="rounded-full bg-success-subtle text-success border border-success-line px-2 py-0.5 text-[10px] font-semibold">
                  <span className="inline-flex items-center gap-1"><IconCheck className="h-3.5 w-3.5" />Efficient</span>
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-fg-muted">
              <IssuerLogo issuer={c.issuer_detail} height={14} />
              <span>· {c.tier.replace("-", " ")}</span>
              <span>·</span>
              <NetworkLogo network={c.network_detail} height={14} />
            </div>
          </div>
        </div>

        <div className="sm:text-right">
          <div className="text-base font-semibold num text-success">
            +{formatInr(Math.round(slot.monthly_value_inr * 12))} / yr
          </div>
          <div className="text-xs text-fg-muted num">
            {formatInr(Math.round(slot.monthly_value_inr))}/mo reward ({slot.effective_rate_pct.toFixed(1)}%)
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-surface-subtle p-2.5 text-xs grid grid-cols-1 sm:grid-cols-3 gap-2 border border-line">
        <div>
          <span className="text-fg-muted block">Spend Routed Here</span>
          <strong className="text-fg num text-sm">
            {formatInr(Math.round(slot.monthly_spend_inr))}/mo
          </strong>
        </div>
        <div>
          <span className="text-fg-muted block">Effective Realised Rate</span>
          <strong className="text-accent-fg num text-sm">
            {slot.effective_rate_pct.toFixed(2)}%
          </strong>
        </div>
        <div>
          <span className="text-fg-muted block">Net Annual Fee</span>
          <strong className="text-fg num text-sm">
            {slot.annual_fee_inr === 0 ? "₹0 (Waived / Free)" : formatInr(slot.annual_fee_inr)}
          </strong>
        </div>
      </div>

      {slot.allocation.length > 0 ? (
        <div className="text-xs text-fg-muted">
          <span className="font-medium text-fg-secondary">Routed categories: </span>
          {slot.allocation
            .map((a) => `${a.category.replace("-", " ")} (${formatInr(Math.round(a.monthly_spend_inr))})`)
            .join(", ")}
        </div>
      ) : null}
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
  const pid = c.current_rewards?.loyalty_program;
  const loyaltyTier = pid && tierCtx.tierLine[pid]
    ? explainCard(c, spend, { ...rankCtx, ...tierCtx }, valuePrefs).value_components?.loyalty_tier ?? null
    : null;
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
          <div className="text-fg-muted font-semibold num w-6 text-right">
            {rank != null ? `#${rank}` : <IconStar className="ml-auto h-4 w-4" />}
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
                {score.ecosystem_credited ? <IconUnlock className="mr-1 inline align-[-0.125em]" /> : <IconLock className="mr-1 inline align-[-0.125em]" />}{score.closed_loop_ecosystem}
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
          <div className="text-lg font-semibold num text-success">
            {formatInr(Math.round(score.annual_net_inr))} / yr
          </div>
          <div className="text-xs text-fg-muted num">
            gross {formatInr(Math.round(score.annual_gross_inr))} − fee{" "}
            {score.fee_waived ? (
              <span className="text-success">waived</span>
            ) : (
              formatInr(score.annual_fee_effective_inr)
            )}
            {score.annual_forex_inr > 0 ? <> − forex {formatInr(Math.round(score.annual_forex_inr))}</> : null}
          </div>
          {extra ? <div className="mt-0.5 text-[11px] text-fg-muted num">{extra}</div> : null}
        </div>
      </div>

      <details className="mt-3 text-sm" open={highlighted}>
        <summary className="cursor-pointer text-fg-muted hover:text-fg text-xs uppercase tracking-label">
          Breakdown
        </summary>
        <table className="mt-2 w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-label text-fg-muted border-b border-line">
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
                <td className="py-1.5 pr-3 num">{formatPct(b.effective_rate_pct, 2)}</td>
                <td className="py-1.5 pr-3 num">
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
