import { CATEGORY_LABELS } from "@/lib/category-mapping";
import {
  familyOf, familySharePct, setFamilyShare, toggleEcosystem, tokenLabel,
  type UsageDelta, type UsageGroup, type UsageProfile,
} from "@/lib/usage";

const inr = (n: number) => `₹${Math.round(Math.abs(n)).toLocaleString("en-IN")}`;
const signed = (n: number) => `${n < 0 ? "−" : "+"}${inr(n)}/mo`;
const CHANGE_LABEL: Record<UsageDelta["change"], string> = { unlocked: "Unlocked", dropped: "Dropped", changed: "Changed" };

/**
 * "Your usage" for one card: the share of each bucket the user routes through each of the
 * card's merchants (their own estimate — never defaulted), plus the ecosystem question for a
 * closed-loop card, plus what those answers unlocked or dropped. Presentational: the
 * hook-driven AccelerationBreakdown owns the store and passes `onChange`.
 */
export function UsagePanel({
  groups, usage, ecosystem, deltas, onChange,
}: {
  groups: UsageGroup[];
  usage: UsageProfile;
  /** This card's closed-loop ecosystem, if any. */
  ecosystem: string | null;
  deltas: UsageDelta[];
  onChange?: (u: UsageProfile) => void;
}) {
  if (groups.length === 0 && !ecosystem) return null;
  return (
    <div className="mt-4 rounded-lg border border-line bg-surface-subtle p-3">
      <h3 className="text-sm font-semibold text-fg">Your usage</h3>
      <p className="mt-0.5 text-xs text-fg-muted">
        Co-brand and portal rates count only on the share you say goes through them; the rest earns base. Shared
        with every calculator on this site.
      </p>

      {groups.length > 0 ? (
        <ul className="mt-2 space-y-1.5">
          {groups.map((g) => (
            <li key={g.family} className="flex items-center justify-between gap-3 text-xs">
              <span className="text-fg-secondary">
                <span className="font-medium">{g.label}</span>{" "}
                <span className="text-fg-muted">· share of {g.categories.map((c) => CATEGORY_LABELS[c] ?? c).join(" / ")}</span>
              </span>
              <span className="flex items-center gap-1">
                <input
                  type="number" min={0} max={100} inputMode="numeric"
                  aria-label={`Share of spend via ${g.label}`}
                  value={familySharePct(usage, g.family)}
                  readOnly={!onChange}
                  onChange={onChange ? (e) => onChange(setFamilyShare(usage, g.family, Math.max(0, Math.min(100, Number(e.target.value) || 0)))) : undefined}
                  className="w-16 rounded-md border border-line-strong px-2 py-0.5 text-right text-xs text-fg tabular-nums"
                />
                <span className="text-fg-muted">%</span>
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {ecosystem ? (
        <label className="mt-2 flex items-center gap-2 text-xs text-fg-secondary">
          <input
            type="checkbox"
            checked={usage.ecosystems.includes(ecosystem)}
            readOnly={!onChange}
            onChange={onChange ? () => onChange(toggleEcosystem(usage, ecosystem)) : undefined}
          />
          I redeem in {ecosystem} (its points are only worth full value there)
        </label>
      ) : null}

      {deltas.length > 0 ? (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {deltas.map((d) => (
            <li
              key={d.category}
              className={
                d.delta_inr_monthly >= 0
                  ? "rounded border border-success-line bg-success-subtle px-2 py-0.5 text-[11px] text-success tabular-nums"
                  : "rounded border border-warn-line bg-warn-subtle px-2 py-0.5 text-[11px] text-warn tabular-nums"
              }
            >
              {CHANGE_LABEL[d.change]}: {d.label} {signed(d.delta_inr_monthly)}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/** Sidebar summary for /calculator: declared shares, one entry per merchant family. */
export function DeclaredUsageSummary({ usage, onChange }: { usage: UsageProfile; onChange?: (u: UsageProfile) => void }) {
  const families = new Map<string, number>();
  for (const [t, pct] of Object.entries(usage.merchant_share_pct)) {
    const f = familyOf(t);
    families.set(f, Math.max(families.get(f) ?? 0, pct));
  }
  if (families.size === 0) {
    return <p className="text-[11px] text-fg-muted">No merchant shares declared yet — set them in any card&apos;s breakdown.</p>;
  }
  return (
    <ul className="flex flex-wrap gap-1.5">
      {[...families].sort((a, b) => a[0].localeCompare(b[0])).map(([f, pct]) => (
        <li key={f} className="flex items-center gap-1 rounded-full border border-line-strong bg-surface px-2 py-0.5 text-[11px] text-fg-secondary">
          {tokenLabel(f)} {pct}%
          {onChange ? (
            <button type="button" aria-label={`Remove ${tokenLabel(f)}`} onClick={() => onChange(setFamilyShare(usage, f, 0))} className="text-fg-muted hover:text-fg-secondary">
              ×
            </button>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
