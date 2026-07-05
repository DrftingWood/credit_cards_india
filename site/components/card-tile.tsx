import { memo } from "react";
import Link from "next/link";
import type { EnrichedCard } from "@/lib/types";
import { cardHref } from "@/lib/data";
import { cn, formatFeeInr, formatInr, formatPct } from "@/lib/utils";
import { bestAcceleratedPct } from "@/lib/detail-derivations";
import { IssuerLogo } from "./logos/issuer-logo";
import { NetworkLogo } from "./logos/network-logo";
import { CardImage } from "./card-image";

/**
 * Memoised because CardGrid renders 100+ tiles and re-renders on every browse
 * filter toggle. The card prop is a stable object from the build artifact
 * (referentially stable across renders), so default React.memo === comparison
 * is enough — no custom comparator needed.
 */
function CardTileImpl({ card }: { card: EnrichedCard }) {
  const href = cardHref(card);

  const fee = card.current_fees?.annual_fee_inr ?? null;
  const waiverAt = card.computed.fee_waiver_spend_inr;
  const rate = card.computed.headline_rate_pct;
  // The base rate alone misrepresents points/co-brand cards (Magnus's 0.18%
  // base hides its accelerators). Surface the best accelerated value-% too.
  const bestRate = bestAcceleratedPct(card);
  const closed = card.status === "discontinued" || card.status === "on-hold";

  return (
    <Link
      href={href}
      className={cn(
        "group block rounded-xl border border-slate-200 bg-white p-4 transition-colors",
        "hover:border-brand-500/50 hover:bg-brand-50/30",
        "no-underline",
      )}
    >
      <CardImage card={card} size="tile" />

      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <IssuerLogo issuer={card.issuer_detail} height={16} />
          <h3 className="mt-1 text-sm font-semibold text-slate-900 leading-snug line-clamp-2">
            {card.name}
          </h3>
        </div>
        <NetworkLogo network={card.network_detail} height={16} className="shrink-0" />
      </div>

      <div className="mt-3">
        <div className="text-lg font-semibold text-slate-900 tabular-nums">
          {bestRate != null ? `up to ${formatPct(bestRate, 1)}` : formatPct(rate, 2)}
          <span className="ml-1 text-xs font-normal text-slate-500">rewards</span>
        </div>
        <div className="mt-0.5 text-sm text-slate-700 tabular-nums">
          {fee ? formatFeeInr(fee) : "Lifetime free"}
          {waiverAt ? <span className="text-xs text-slate-500"> · waived at {formatInr(waiverAt)}</span> : null}
          <span className="text-xs text-slate-500"> · annual fee</span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {closed ? (
          <span className="chip chip-warn">
            {card.status === "discontinued" ? "Discontinued" : "Closed to new applicants"}
          </span>
        ) : null}
        {card.computed.is_lifetime_free && !closed ? <span className="chip chip-success">Lifetime free</span> : null}
        {card.computed.is_invite_only ? <span className="chip chip-warn">Invite only</span> : null}
        {card.computed.has_domestic_lounge ? <span className="chip">Domestic lounge</span> : null}
        {card.computed.has_international_lounge ? <span className="chip">Intl lounge</span> : null}
        {card.co_brand?.partner ? (
          <span className="chip">Co-brand · {card.co_brand.partner}</span>
        ) : null}
        <span className="chip capitalize">{card.tier.replace("-", " ")}</span>
      </div>
    </Link>
  );
}

export const CardTile = memo(CardTileImpl);
