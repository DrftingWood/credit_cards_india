import type { EnrichedCard } from "@/lib/types";
import { formatFeeInr, formatPct } from "@/lib/utils";
import { bestSuitedFor, rewardTypeLabel, formatAccelerated } from "@/lib/detail-derivations";
import { CardImage } from "@/components/card-image";

/**
 * The hero "quick facts" box shown near the top of the detail page — card
 * image on the left, then three columns: core fees, rewards-rate bullets,
 * welcome benefits. Matches the CardInsider-style scannable intro.
 */
export function QuickFacts({ card }: { card: EnrichedCard }) {
  const fee = card.current_fees?.annual_fee_inr ?? null;
  const joining = card.current_fees?.joining_fee_inr ?? null;
  const rewards = card.current_rewards;
  const accelerated = rewards?.accelerated ?? [];
  const welcome = card.current_benefits?.welcome ?? [];
  const base = card.computed.headline_rate_pct;

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5 p-5">
        <div className="w-full md:w-[220px]">
          <CardImage card={card} size="tile" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm">
          <Group>
            <Row label="Joining Fee" value={formatFeeInr(joining)} />
            <Row label="Annual Fee" value={formatFeeInr(fee)} />
            <Row label="Best Suited For" value={bestSuitedFor(card)} />
            <Row label="Reward Type" value={rewardTypeLabel(card)} />
          </Group>

          <Group title="Rewards Rate">
            {accelerated.slice(0, 3).map((a, i) => (
              <li key={i} className="prose-card-value leading-snug">{formatAccelerated(a, rewards)}</li>
            ))}
            {accelerated.length === 0 && base !== null ? (
              <li className="prose-card-value">Base rate {formatPct(base, 2)}</li>
            ) : null}
            {accelerated.length > 0 && base !== null ? (
              <li className="text-slate-600 leading-snug">Base {formatPct(base, 2)} on other spends</li>
            ) : null}
          </Group>

          <Group title="Welcome Benefits">
            {welcome.length > 0 ? (
              welcome.slice(0, 2).map((w, i) => (
                <li key={i} className="prose-card-value leading-snug">{w.benefit}</li>
              ))
            ) : (
              <li className="text-slate-500">Not applicable</li>
            )}
          </Group>
        </div>
      </div>
    </section>
  );
}

function Group({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div>
      {title ? (
        <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">{title}</div>
      ) : null}
      <ul className="space-y-1.5 list-none">{children}</ul>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-baseline justify-between gap-3">
      <span className="text-slate-500">{label}</span>
      <span className="prose-card-value text-right">{value}</span>
    </li>
  );
}
