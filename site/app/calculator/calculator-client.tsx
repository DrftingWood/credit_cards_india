"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { EnrichedCard } from "@/lib/types";
import { CANONICAL_CATEGORIES, CATEGORY_LABELS } from "@/lib/category-mapping";
import { cardHref } from "@/lib/data";
import { IssuerLogo } from "@/components/logos/issuer-logo";
import { NetworkLogo } from "@/components/logos/network-logo";
import { rankCards, type CardScore, type SpendProfile } from "@/lib/calculator";
import { formatInr, formatPct } from "@/lib/utils";

const DEFAULT_SPEND: SpendProfile = {
  online: 20000,
  groceries: 10000,
  dining: 8000,
  fuel: 4000,
  travel: 5000,
  utilities: 3000,
  rent: 0,
  international: 0,
};

export function CalculatorClient({ cards }: { cards: EnrichedCard[] }) {
  const [spend, setSpend] = useState<SpendProfile>(DEFAULT_SPEND);
  const selectedId = useSearchParams().get("card");

  const { ranked, pinnedSelected } = useMemo(() => {
    const all = rankCards(cards, spend);
    const top = all.slice(0, 10);
    if (!selectedId) return { ranked: top, pinnedSelected: null as CardScore | null };
    const inTop = top.some((r) => r.card.id === selectedId);
    if (inTop) return { ranked: top, pinnedSelected: null };
    const pinned = all.find((r) => r.card.id === selectedId) ?? null;
    return { ranked: top, pinnedSelected: pinned };
  }, [cards, spend, selectedId]);

  const monthlyTotal = Object.values(spend).reduce((a, b) => a + (b || 0), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
      <form className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Your monthly spend</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Fill in how much you spend per category each month. Set to ₹0 to ignore.
          </p>
        </div>

        {CANONICAL_CATEGORIES.map((cat) => (
          <div key={cat}>
            <label className="block text-sm text-slate-700 mb-1">{CATEGORY_LABELS[cat]}</label>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">₹</span>
              <input
                type="number"
                min={0}
                step={500}
                value={spend[cat]}
                onChange={(e) =>
                  setSpend((s) => ({ ...s, [cat]: Math.max(0, Number(e.target.value) || 0) }))
                }
                className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>
        ))}

        <div className="rounded-md bg-slate-50 p-3 text-sm">
          <div className="flex justify-between">
            <span>Monthly total</span>
            <strong className="tabular-nums">{formatInr(monthlyTotal)}</strong>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Annualised</span>
            <span className="tabular-nums">{formatInr(monthlyTotal * 12)}</span>
          </div>
        </div>
      </form>

      <div>
        <h2 className="text-lg font-semibold text-slate-900">Ranked by net annual value</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Approximate. Ignores welcome bonuses, milestone vouchers and some complex caps; for the full picture open the detail page.
        </p>
        {pinnedSelected ? (
          <div className="mt-4">
            <div className="text-xs uppercase tracking-wide text-brand-700 mb-1">Selected card</div>
            <ResultRow rank={null} score={pinnedSelected} highlighted />
          </div>
        ) : null}
        <ol className="mt-4 space-y-3">
          {ranked.map((r, i) => (
            <ResultRow
              key={r.card.id}
              rank={i + 1}
              score={r}
              highlighted={r.card.id === selectedId}
            />
          ))}
        </ol>
        {ranked.length === 0 ? (
          <div className="mt-4 rounded-md border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
            Enter some spend on the left to see rankings.
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ResultRow({
  rank,
  score,
  highlighted = false,
}: {
  rank: number | null;
  score: CardScore;
  highlighted?: boolean;
}) {
  const c = score.card;
  const href = cardHref(c);

  return (
    <li
      className={
        highlighted
          ? "rounded-xl border-2 border-brand-500 bg-brand-50 p-4"
          : "rounded-xl border border-slate-200 bg-white p-4"
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="text-slate-400 font-semibold tabular-nums w-6 text-right">
            {rank != null ? `#${rank}` : "★"}
          </div>
          <div>
            <Link href={href} className="font-semibold text-slate-900 hover:text-slate-900">
              {c.name}
            </Link>
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
              <IssuerLogo issuer={c.issuer_detail} height={14} />
              <span>· {c.tier.replace("-", " ")}</span>
              <span>·</span>
              <NetworkLogo network={c.network_detail} height={14} />
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold tabular-nums text-emerald-700">
            {formatInr(Math.round(score.annual_net_inr))} / yr
          </div>
          <div className="text-xs text-slate-500 tabular-nums">
            gross {formatInr(Math.round(score.annual_gross_inr))} − fee{" "}
            {score.fee_waived ? (
              <span className="text-emerald-700">waived</span>
            ) : (
              formatInr(score.annual_fee_effective_inr)
            )}
          </div>
        </div>
      </div>

      <details className="mt-3 text-sm" open={highlighted}>
        <summary className="cursor-pointer text-slate-600 hover:text-slate-900 text-xs uppercase tracking-wide">
          Breakdown
        </summary>
        <table className="mt-2 w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
              <th className="py-1 pr-3 font-medium">Category</th>
              <th className="py-1 pr-3 font-medium">Rate</th>
              <th className="py-1 pr-3 font-medium">Monthly</th>
            </tr>
          </thead>
          <tbody>
            {score.buckets.map((b) => (
              <tr key={b.category} className="border-b border-slate-100 last:border-0">
                <td className="py-1.5 pr-3 capitalize">
                  {b.category.replace("-", " ")}
                  {b.note ? <span className="text-xs text-amber-700 ml-2">{b.note}</span> : null}
                </td>
                <td className="py-1.5 pr-3 tabular-nums">{formatPct(b.effective_rate_pct, 2)}</td>
                <td className="py-1.5 pr-3 tabular-nums">
                  {formatInr(Math.round(b.monthly_value_inr))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {score.disclaimer ? <p className="mt-2 text-xs text-slate-500">{score.disclaimer}</p> : null}
      </details>
    </li>
  );
}
