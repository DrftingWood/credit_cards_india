import Link from "next/link";
import type { BenefitRecord, EnrichedCard } from "@/lib/types";
import { formatInr, formatPct } from "@/lib/utils";

interface Row {
  label: string;
  render: (card: EnrichedCard) => React.ReactNode;
}

type LoungeAccess = NonNullable<BenefitRecord["lounge_access"]>;

function loungeSummary(
  details: LoungeAccess | null | undefined,
  key: "domestic" | "international",
): React.ReactNode {
  if (!details) return "—";
  const d = details[key];
  if (!d) return "—";
  const visits =
    d.visits_per_cycle === "unlimited"
      ? "Unlimited"
      : `${d.visits_per_cycle ?? "—"}/${d.cycle ?? "cycle"}`;
  if (d.spend_threshold_inr) {
    return (
      <>
        {visits}{" "}
        <span className="text-xs text-amber-700">
          (after {formatInr(d.spend_threshold_inr)} spend)
        </span>
      </>
    );
  }
  return visits;
}

function topAcceleratedRow(card: EnrichedCard): React.ReactNode {
  const acc = card.current_rewards?.accelerated ?? [];
  if (acc.length === 0) return "—";
  // Pick the entry with the highest effective_rate / multiplier.
  const ranked = [...acc].sort((a, b) => {
    const ar = a.effective_rate ?? a.multiplier ?? 0;
    const br = b.effective_rate ?? b.multiplier ?? 0;
    return br - ar;
  });
  const top = ranked[0];
  const rate = top.effective_rate != null ? `${top.effective_rate}%` : `${top.multiplier}×`;
  return (
    <>
      <span className="prose-card-value">{rate}</span>
      <span className="block text-xs text-slate-500 mt-0.5 capitalize">
        {top.category.replace(/-/g, " ")}
      </span>
    </>
  );
}

const ROWS: Row[] = [
  { label: "Issuer", render: (c) => c.issuer_detail.name },
  { label: "Network", render: (c) => <span className="capitalize">{c.network}</span> },
  {
    label: "Tier",
    render: (c) => <span className="capitalize">{c.tier.replace("-", " ")}</span>,
  },
  {
    label: "Status",
    render: (c) => <span className="capitalize">{c.status.replace("-", " ")}</span>,
  },
  {
    label: "Annual fee",
    render: (c) => formatInr(c.current_fees?.annual_fee_inr ?? null),
  },
  {
    label: "Fee waiver",
    render: (c) =>
      c.computed.fee_waiver_spend_inr
        ? `${formatInr(c.computed.fee_waiver_spend_inr)} spend`
        : "—",
  },
  {
    label: "Forex markup",
    render: (c) => formatPct(c.current_fees?.forex_markup_pct, 2),
  },
  {
    label: "Reward currency",
    render: (c) => (
      <span className="capitalize">
        {c.current_rewards?.currency ?? "—"}
        {c.current_rewards?.currency_name ? (
          <span className="block text-xs text-slate-500 mt-0.5">
            {c.current_rewards.currency_name}
          </span>
        ) : null}
      </span>
    ),
  },
  {
    label: "Base reward rate",
    render: (c) => formatPct(c.computed.headline_rate_pct, 2),
  },
  { label: "Best accelerated", render: topAcceleratedRow },
  {
    label: "Domestic lounge",
    render: (c) => loungeSummary(c.current_benefits?.lounge_access ?? null, "domestic"),
  },
  {
    label: "International lounge",
    render: (c) => loungeSummary(c.current_benefits?.lounge_access ?? null, "international"),
  },
  {
    label: "Golf",
    render: (c) => {
      const g = c.current_benefits?.golf;
      if (!g) return "—";
      const rounds =
        g.rounds_per_cycle === "unlimited"
          ? "Unlimited"
          : `${g.rounds_per_cycle ?? 0}/${g.cycle ?? "cycle"}`;
      return rounds;
    },
  },
  {
    label: "Concierge",
    render: (c) => (c.current_benefits?.concierge ? "Yes" : "—"),
  },
  {
    label: "Lifetime-free",
    render: (c) => (c.computed.is_lifetime_free ? "Yes" : "—"),
  },
  {
    label: "Co-brand",
    render: (c) => c.co_brand?.partner ?? "—",
  },
  {
    label: "Credit score (min)",
    render: (c) => c.eligibility.credit_score_min ?? "—",
  },
  {
    label: "Income (salaried)",
    render: (c) =>
      c.eligibility.income_inr_annual?.salaried
        ? `${formatInr(c.eligibility.income_inr_annual.salaried)} p.a.`
        : "—",
  },
];

export function CompareTable({ cards }: { cards: EnrichedCard[] }) {
  const colCount = cards.length;
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="text-left p-3 text-xs uppercase tracking-wide text-slate-500 w-40">
              Field
            </th>
            {cards.map((c) => {
              const slug = c.id.startsWith(`${c.issuer}-`)
                ? c.id.slice(c.issuer.length + 1)
                : c.id;
              return (
                <th
                  key={c.id}
                  className="text-left p-3 align-top"
                  style={{ width: `${Math.floor(80 / colCount)}%` }}
                >
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    {c.issuer_detail.short_name || c.issuer_detail.name}
                  </div>
                  <Link
                    href={`/card/${c.issuer}/${slug}`}
                    className="block mt-1 text-sm font-semibold text-slate-900 hover:text-slate-900"
                  >
                    {c.name}
                  </Link>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, i) => (
            <tr key={i} className="border-b border-slate-100 last:border-0">
              <td className="p-3 text-xs uppercase tracking-wide text-slate-500 align-top">
                {row.label}
              </td>
              {cards.map((c) => (
                <td key={c.id} className="p-3 align-top text-slate-800">
                  {row.render(c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
