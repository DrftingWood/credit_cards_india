import type { RewardRecord } from "@/lib/types";
import { formatInr, formatPct } from "@/lib/utils";
import { SourceLink } from "./source-link";

export function RewardsSection({ rewards }: { rewards: RewardRecord | null }) {
  if (!rewards) return null;
  const baseRate =
    rewards.base && rewards.base.unit_value_inr != null
      ? (rewards.base.rate * rewards.base.unit_value_inr * 100) / rewards.base.per_inr
      : null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-slate-900">Rewards</h2>
      <div className="mt-2 text-sm text-slate-700">
        Earns <strong className="capitalize">{rewards.currency}</strong>
        {rewards.currency_name ? <> ({rewards.currency_name})</> : null}.
      </div>

      <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm">
        <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Base rate</div>
        <div className="prose-card-value">
          {rewards.base.rate} per ₹{rewards.base.per_inr}
          {rewards.base.unit_value_inr != null ? (
            <span className="text-slate-600 font-normal">
              {" "}
              · worth ≈ {formatPct(baseRate, 2)} back
            </span>
          ) : null}
        </div>
      </div>

      {rewards.accelerated?.length ? (
        <div className="mt-4">
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Accelerated</div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
                  <th className="py-1.5 pr-3 font-medium">Category</th>
                  <th className="py-1.5 pr-3 font-medium">Rate</th>
                  <th className="py-1.5 pr-3 font-medium">Cap</th>
                </tr>
              </thead>
              <tbody>
                {rewards.accelerated.map((a, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0">
                    <td className="py-2 pr-3">
                      <div className="text-slate-800">{humanizeCategory(a.category)}</div>
                      {a.merchants?.length ? (
                        <div className="text-xs text-slate-500 mt-0.5">
                          {a.merchants.slice(0, 5).join(", ")}
                          {a.merchants.length > 5 ? ` +${a.merchants.length - 5}` : ""}
                        </div>
                      ) : null}
                    </td>
                    <td className="py-2 pr-3 prose-card-value">
                      {a.effective_rate != null ? `${a.effective_rate}%` : `${a.multiplier}×`}
                    </td>
                    <td className="py-2 pr-3 text-slate-700">
                      {a.cap_per_cycle === "unlimited" || a.cap_per_cycle == null
                        ? "Unlimited"
                        : capText(a.cap_per_cycle, a.cap_unit, a.cycle)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {rewards.exclusions?.length ? (
        <div className="mt-3 text-xs text-slate-600">
          <span className="font-medium text-slate-700">No rewards on:</span>{" "}
          {rewards.exclusions.join(", ")}
        </div>
      ) : null}
      {rewards.capping_rules?.length ? (
        <ul className="mt-2 list-disc pl-5 text-xs text-slate-600 space-y-1">
          {rewards.capping_rules.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      ) : null}

      <SourceLink source={rewards.source} />
    </section>
  );
}

function capText(
  cap: number,
  unit: string | undefined,
  cycle: string | undefined,
): string {
  const suffix = cycle ? ` / ${cycle}` : "";
  if (unit === "cashback-inr") return `${formatInr(cap)}${suffix}`;
  return `${cap} ${unit ?? "points"}${suffix}`;
}

function humanizeCategory(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
