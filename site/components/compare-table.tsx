import Link from "next/link";
import type { BenefitRecord, EnrichedCard } from "@/lib/types";
import { cardHref } from "@/lib/data";
import { formatFeeInr, formatInr, formatPct } from "@/lib/utils";
import { pickTopAccelerated, formatAcceleratedRate } from "@/lib/detail-derivations";
import { IssuerLogo } from "./logos/issuer-logo";
import { NetworkLogo } from "./logos/network-logo";
import { CardImage } from "./card-image";

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
  // Rank by realised value-%, not raw effective_rate — otherwise a "45 pts/₹200"
  // points entry outranks a true 5% cashback one, and renders "45%". Both the
  // ranking and the rendered rate route through the shared, units-correct helpers.
  const top = pickTopAccelerated(card);
  if (!top) return "—";
  const rate = formatAcceleratedRate(top, card.current_rewards);
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
  {
    label: "Issuer",
    render: (c) => <IssuerLogo issuer={c.issuer_detail} variant="with-name" height={20} />,
  },
  {
    label: "Network",
    render: (c) => <NetworkLogo network={c.network_detail} height={18} />,
  },
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
    render: (c) => formatFeeInr(c.current_fees?.annual_fee_inr ?? null),
  },
  {
    label: "Joining fee",
    render: (c) => formatFeeInr(c.current_fees?.joining_fee_inr ?? null),
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
    label: "Finance charge",
    render: (c) => {
      const v = c.current_fees?.finance_charge_monthly_pct;
      return v != null ? `${formatPct(v, 2)} / mo` : "—";
    },
  },
  {
    label: "Cash advance fee",
    render: (c) => {
      const ca = c.current_fees?.cash_advance_fee;
      if (!ca) return "—";
      return `${formatPct(ca.pct ?? null, 1)} or ${formatInr(ca.min_inr ?? null)} (whichever higher)`;
    },
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
    label: "Welcome benefit",
    render: (c) => {
      const w = c.current_benefits?.welcome?.[0];
      if (!w) return "—";
      return (
        <span>
          {w.benefit}
          {w.value_inr != null ? (
            <span className="block text-xs text-slate-500 mt-0.5">
              ≈ {formatInr(w.value_inr)} value
            </span>
          ) : null}
        </span>
      );
    },
  },
  {
    label: "Milestones",
    render: (c) => {
      const m = c.current_benefits?.milestones ?? [];
      if (!m.length) return "—";
      return (
        <ul className="list-none space-y-0.5">
          {m.slice(0, 3).map((x, i) => (
            <li key={i} className="text-xs">
              <strong>{formatInr(x.spend_inr)}</strong>: {x.benefit}
            </li>
          ))}
          {m.length > 3 ? (
            <li className="text-xs text-slate-500">+{m.length - 3} more</li>
          ) : null}
        </ul>
      );
    },
  },
  {
    label: "Redemption fee",
    render: (c) => {
      const r = c.current_rewards?.redemption?.[0];
      return r?.fee_inr != null ? `${formatInr(r.fee_inr)} per claim` : "—";
    },
  },
  {
    label: "Fuel surcharge waiver",
    render: (c) => {
      const f = c.current_benefits?.fuel_surcharge_waiver;
      if (!f) return "—";
      return `${formatPct(f.pct, 1)}${
        f.cap_per_cycle_inr ? ` (cap ${formatInr(f.cap_per_cycle_inr)}/${f.cycle ?? "cycle"})` : ""
      }`;
    },
  },
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
    label: "Insurance",
    render: (c) => {
      const ins = c.current_benefits?.insurance ?? [];
      if (!ins.length) return "—";
      return (
        <ul className="list-none space-y-0.5">
          {ins.slice(0, 3).map((x, i) => (
            <li key={i} className="text-xs capitalize">
              {x.type.replace(/-/g, " ")}: {formatInr(x.sum_insured_inr)}
            </li>
          ))}
          {ins.length > 3 ? (
            <li className="text-xs text-slate-500">+{ins.length - 3} more</li>
          ) : null}
        </ul>
      );
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
  // Defensive early-return — every caller already gates on cards.length >= 2,
  // but the component shouldn't divide by 0 (used to produce "Infinity%" widths)
  // if a future caller passes an empty array.
  if (cards.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        No cards selected to compare.
      </div>
    );
  }

  // colgroup + table-fixed gives each card column an equal share, keeping
  // header and body cells aligned regardless of content width. The first
  // column is sticky on mobile (overflow-x-auto wrapper) so the row label
  // stays visible while users scroll horizontally.
  const cardColPct = Math.floor(80 / cards.length);

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-sm table-fixed">
        <colgroup>
          <col style={{ width: "20%" }} />
          {cards.map((c) => (
            <col key={c.id} style={{ width: `${cardColPct}%` }} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="text-left p-3 text-xs uppercase tracking-wide text-slate-500 sticky left-0 bg-slate-50 z-10">
              Field
            </th>
            {cards.map((c) => (
              <th key={c.id} className="text-left p-3 align-top">
                <div className="w-40 mb-2">
                  <CardImage card={c} size="tile" />
                </div>
                <IssuerLogo issuer={c.issuer_detail} height={16} />
                <Link
                  href={cardHref(c)}
                  className="block mt-1 text-sm font-semibold text-slate-900 hover:text-slate-900"
                >
                  {c.name}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, i) => (
            <tr key={i} className="border-b border-slate-100 last:border-0">
              <td className="p-3 text-xs uppercase tracking-wide text-slate-500 align-top sticky left-0 bg-white z-10">
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
