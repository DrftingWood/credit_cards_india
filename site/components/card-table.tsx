import Link from "next/link";
import type { EnrichedCard } from "@/lib/types";
import { cardHref } from "@/lib/data";
import { cn, formatFeeInr, formatPct } from "@/lib/utils";
import { bestAcceleratedPct } from "@/lib/detail-derivations";

// One width per column, shared by the header and every row (table-fixed + colgroup).
const COLS = ["w-[42%]", "w-[12%]", "w-[14%]", "w-[14%]", "w-[18%]"];
const TH = "px-3 py-0 text-left text-xs font-semibold text-fg-muted";
const TD = "px-3 py-0 text-sm text-fg-secondary truncate";

/** Dense, opt-in alternative to the tile grid: one 34 px (44 px on touch) row per card. */
export function CardTable({ cards }: { cards: EnrichedCard[] }) {
  return (
    <div
      role="region"
      aria-label="Cards table, scrolls horizontally"
      tabIndex={0}
      className="overflow-x-auto rounded-xl border border-line"
    >
      <table className="w-full min-w-[40rem] table-fixed border-collapse">
        <colgroup>
          {COLS.map((w, i) => (
            <col key={i} className={w} />
          ))}
        </colgroup>
        <thead className="bg-surface-subtle">
          <tr className="row-dense">
            <th scope="col" className={TH}>Card</th>
            <th scope="col" className={TH}>Network</th>
            <th scope="col" className={cn(TH, "text-right")}>Annual fee</th>
            <th scope="col" className={cn(TH, "text-right")}>Joining fee</th>
            <th scope="col" className={cn(TH, "text-right")}>Reward rate</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((c) => {
            const best = bestAcceleratedPct(c);
            return (
              <tr key={c.id} className="row-dense border-t border-line">
                <th scope="row" className="px-3 py-0 text-left text-sm font-medium text-fg truncate">
                  <Link href={cardHref(c) as never} className="text-fg hover:text-accent-strong no-underline">
                    {c.name}
                  </Link>
                  <span className="ml-2 text-xs font-normal text-fg-muted">{c.issuer_detail.short_name ?? c.issuer_detail.name}</span>
                </th>
                <td className={TD}>{c.network_detail?.name ?? c.network ?? "Not stated"}</td>
                <td className={cn(TD, "num text-right")}>
                  {c.computed.is_lifetime_free ? "Free" : formatFeeInr(c.current_fees?.annual_fee_inr ?? null)}
                </td>
                <td className={cn(TD, "num text-right")}>{formatFeeInr(c.current_fees?.joining_fee_inr ?? null)}</td>
                <td className={cn(TD, "num text-right")}>
                  {best != null ? `up to ${formatPct(best, 1)}` : formatPct(c.computed.headline_rate_pct, 2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
