import type { FeeRecord } from "@/lib/types";
import { formatInr, formatPct } from "@/lib/utils";
import { SourceLink } from "./source-link";

export function FeeSection({ fee }: { fee: FeeRecord | null }) {
  if (!fee) return null;
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-slate-900">Fees</h2>
      <dl className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-sm">
        <Fact label="Joining fee" value={formatInr(fee.joining_fee_inr)} />
        <Fact label="Annual fee" value={formatInr(fee.annual_fee_inr)} />
        {fee.fee_waiver ? (
          <Fact
            label="Fee waiver"
            value={`${formatInr(fee.fee_waiver.spend_inr)} / ${fee.fee_waiver.cycle}`}
            detail={fee.fee_waiver.conditions}
          />
        ) : (
          <Fact label="Fee waiver" value="None" />
        )}
        <Fact label="Forex markup" value={formatPct(fee.forex_markup_pct, 2)} />
        <Fact
          label="Finance charge (monthly)"
          value={formatPct(fee.finance_charge_monthly_pct, 2)}
        />
        {fee.cash_advance_fee ? (
          <Fact
            label="Cash advance"
            value={`${formatPct(fee.cash_advance_fee.pct, 1)} · min ${formatInr(fee.cash_advance_fee.min_inr ?? null)}`}
          />
        ) : null}
      </dl>
      {fee.notes ? <p className="mt-3 text-xs text-slate-600">{fee.notes}</p> : null}
      <SourceLink source={fee.source} />
    </section>
  );
}

function Fact({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string | null;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="prose-card-value text-sm">{value}</dd>
      {detail ? <div className="text-xs text-slate-500 mt-0.5">{detail}</div> : null}
    </div>
  );
}
