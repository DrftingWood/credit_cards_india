import type { EnrichedCard } from "@/lib/types";
import { formatDate, formatInr } from "@/lib/utils";

/** Shows closed (historical) effective-dated records, newest first.
 *  If the card has no closed records, renders nothing. */
export function HistoryTimeline({ card }: { card: EnrichedCard }) {
  const items: { date: string; label: string }[] = [];

  for (const r of card.fees) {
    if (r.effective_until) {
      items.push({
        date: r.effective_until,
        label: `Fees changed — was joining ${formatInr(r.joining_fee_inr)}, annual ${formatInr(
          r.annual_fee_inr,
        )} until ${formatDate(r.effective_until)}`,
      });
    }
  }
  for (const r of card.rewards) {
    if (r.effective_until) {
      items.push({
        date: r.effective_until,
        label: `Reward structure changed — prior rate ${r.base.rate} per ₹${r.base.per_inr} (${r.currency}) until ${formatDate(
          r.effective_until,
        )}`,
      });
    }
  }
  for (const r of card.benefits) {
    if (r.effective_until) {
      items.push({
        date: r.effective_until,
        label: `Benefits revised on ${formatDate(r.effective_until)}`,
      });
    }
  }

  if (items.length === 0) return null;

  items.sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-slate-900">History</h2>
      <p className="text-xs text-slate-500 mt-1">
        Past revisions as recorded in the dataset. Most recent first.
      </p>
      <ol className="mt-3 space-y-3 text-sm">
        {items.map((item, i) => (
          <li key={i} className="border-l-2 border-slate-200 pl-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              {formatDate(item.date)}
            </div>
            <div className="text-slate-800">{item.label}</div>
          </li>
        ))}
      </ol>
    </section>
  );
}
