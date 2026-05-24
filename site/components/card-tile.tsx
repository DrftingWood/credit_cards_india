import { memo } from "react";
import Link from "next/link";
import type { EnrichedCard } from "@/lib/types";
import { cardHref } from "@/lib/data";
import { cn, formatFeeInr, formatInr, formatPct } from "@/lib/utils";
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

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-md bg-slate-50 px-2 py-1.5">
          <div className="text-slate-500">Annual fee</div>
          <div className="prose-card-value">{formatFeeInr(fee)}</div>
          {waiverAt ? (
            <div className="text-slate-500 mt-0.5">
              Waived at {formatInr(waiverAt)} spend
            </div>
          ) : null}
        </div>
        <div className="rounded-md bg-slate-50 px-2 py-1.5">
          <div className="text-slate-500">Base reward</div>
          <div className="prose-card-value">{formatPct(rate, 2)}</div>
          <div className="text-slate-500 capitalize mt-0.5">
            {card.current_rewards?.currency ?? "—"}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {card.computed.is_lifetime_free ? <span className="chip chip-success">Lifetime free</span> : null}
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
