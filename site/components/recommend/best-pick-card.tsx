// site/components/recommend/best-pick-card.tsx
import Link from "next/link";
import type { Highlight } from "@/lib/present";
import { IconArrowRight, IconLink } from "@/components/icons";
import { cardDetailHref } from "./ranked-row";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export function BestPickCard({ highlight }: { highlight: Highlight }) {
  const s = highlight.score;
  const c = s.card;
  const href = cardDetailHref(s);
  const waiver = c.computed.fee_waiver_spend_inr;
  const verified = c.metadata?.last_verified_on;
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-brand-700">{highlight.label}</div>
      <h3 className="mt-1 text-lg font-semibold text-slate-900">
        <Link href={href} className="hover:underline">{c.name}</Link>
      </h3>
      <p className="text-xs text-slate-500 capitalize">
        {c.tier.replaceAll("-", " ")} · {c.network_detail?.name ?? c.network}
      </p>

      {/* FACTS (from T&C) */}
      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-md bg-slate-50 px-2 py-1.5">
          <dt className="text-slate-500">Annual fee</dt>
          <dd className="font-semibold text-slate-900 tabular-nums">
            {c.computed.is_lifetime_free
              ? "Lifetime free"
              : c.current_fees?.annual_fee_inr != null
                ? inr(c.current_fees.annual_fee_inr)
                : "—"}
            {waiver ? <span className="ml-1 font-normal text-slate-500">· waived above {inr(waiver)}</span> : null}
          </dd>
        </div>
        <div className="rounded-md bg-slate-50 px-2 py-1.5">
          <dt className="text-slate-500">Headline reward</dt>
          <dd className="font-semibold text-slate-900 tabular-nums">
            {c.computed.headline_rate_pct != null ? `${c.computed.headline_rate_pct}%` : "—"}
            <span className="ml-1 font-normal text-slate-500">base</span>
          </dd>
        </div>
      </dl>

      {/* ESTIMATE (personalized, clearly tagged, links to the breakdown) */}
      <div className="mt-3 flex items-center justify-between rounded-md border border-amber-200 bg-amber-50 px-3 py-2">
        <div>
          <span className="mr-1 rounded border border-amber-300 bg-amber-100 px-1 text-[9px] font-bold uppercase tracking-wide text-amber-800">Est.</span>
          <span className="text-lg font-semibold text-slate-900 tabular-nums">{inr(s.net_rewards_inr)}</span>
          <span className="ml-1 text-xs text-slate-500">/yr net for your spend</span>
        </div>
        <Link href={href} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline">
          See the math <IconArrowRight className="text-[13px]" />
        </Link>
      </div>

      {verified ? (
        <p className="mt-3 flex items-center gap-1 text-[11px] text-slate-500">
          <IconLink className="text-[12px] text-brand-600" /> Facts from issuer T&amp;C · verified {verified}
        </p>
      ) : null}
    </article>
  );
}
