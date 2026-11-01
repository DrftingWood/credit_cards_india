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
    <article className="rounded-xl border border-line bg-surface p-5">
      <div className="text-[11px] font-semibold uppercase tracking-label text-accent-fg">{highlight.label}</div>
      <h3 className="mt-1 text-lg font-semibold text-fg">
        <Link href={href} className="hover:underline">{c.name}</Link>
      </h3>
      <p className="text-xs text-fg-muted capitalize">
        {c.tier.replaceAll("-", " ")} · {c.network_detail?.name ?? c.network ?? "Network not stated"}
      </p>

      {/* FACTS (from T&C) */}
      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-md bg-surface-subtle px-2 py-1.5">
          <dt className="text-fg-muted">Annual fee</dt>
          <dd className="font-semibold text-fg num">
            {c.computed.is_lifetime_free
              ? "Lifetime free"
              : c.current_fees?.annual_fee_inr != null
                ? inr(c.current_fees.annual_fee_inr)
                : "—"}
            {waiver ? <span className="ml-1 font-normal text-fg-muted">· waived above {inr(waiver)}</span> : null}
          </dd>
        </div>
        <div className="rounded-md bg-surface-subtle px-2 py-1.5">
          <dt className="text-fg-muted">Headline reward</dt>
          <dd className="font-semibold text-fg num">
            {c.computed.headline_rate_pct != null ? `${c.computed.headline_rate_pct}%` : "—"}
            <span className="ml-1 font-normal text-fg-muted">base</span>
          </dd>
        </div>
      </dl>

      {/* ESTIMATE (personalized, clearly tagged, links to the breakdown) */}
      <div className="mt-3 flex items-center justify-between rounded-md border border-warn-line bg-warn-subtle px-3 py-2">
        <div>
          <span className="mr-1 rounded border border-warn-line bg-warn-subtle px-1 text-[9px] font-bold uppercase tracking-label text-warn">Est.</span>
          <span className="text-lg font-semibold text-fg num">{inr(s.net_rewards_inr)}</span>
          <span className="ml-1 text-xs text-fg-muted">/yr net for your spend</span>
        </div>
        <Link href={href} className="inline-flex items-center gap-1 text-xs font-semibold text-accent-fg hover:underline">
          See the math <IconArrowRight className="text-[13px]" />
        </Link>
      </div>

      {verified ? (
        <p className="mt-3 flex items-center gap-1 text-[11px] text-fg-muted">
          <IconLink className="text-[12px] text-accent-fg" /> Facts from issuer T&amp;C · verified {verified}
        </p>
      ) : null}
    </article>
  );
}
