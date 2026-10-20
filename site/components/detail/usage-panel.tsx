import { CATEGORY_LABELS } from "@/lib/category-mapping";
import {
  familyOf, familySharePct, setFamilyShare, setLoyaltyTier, toggleEcosystem, tokenLabel,
  type UsageDelta, type UsageGroup, type UsageProfile,
} from "@/lib/usage";
import type { LoyaltyProgram } from "@/lib/types";
import type { LoyaltyTierItem } from "@/lib/value-components";

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
  groups, usage, ecosystem, deltas, onChange, tier,
}: {
  groups: UsageGroup[];
  usage: UsageProfile;
  /** This card's closed-loop ecosystem, if any. */
  ecosystem: string | null;
  deltas: UsageDelta[];
  onChange?: (u: UsageProfile) => void;
  /** The tiered programme this card stacks with, and the bonus the user's tier earns here (null = none). */
  tier?: { program: LoyaltyProgram; bonus: LoyaltyTierItem | null };
}) {
  if (groups.length === 0 && !ecosystem && !tier) return null;
  return (
    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <h3 className="text-sm font-semibold text-slate-900">Your usage</h3>
      <p className="mt-0.5 text-xs text-slate-500">
        Co-brand and portal rates count only on the share you say goes through them; the rest earns base. Shared
        with every calculator on this site.
      </p>

      {groups.length > 0 ? (
        <ul className="mt-2 space-y-1.5">
          {groups.map((g) => (
            <li key={g.family} className="flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-700">
                <span className="font-medium">{g.label}</span>{" "}
                <span className="text-slate-500">· share of {g.categories.map((c) => CATEGORY_LABELS[c] ?? c).join(" / ")}</span>
              </span>
              <span className="flex items-center gap-1">
                <input
                  type="number" min={0} max={100} inputMode="numeric"
                  aria-label={`Share of spend via ${g.label}`}
                  value={familySharePct(usage, g.family)}
                  readOnly={!onChange}
                  onChange={onChange ? (e) => onChange(setFamilyShare(usage, g.family, Math.max(0, Math.min(100, Number(e.target.value) || 0)))) : undefined}
                  className="w-16 rounded-md border border-slate-300 px-2 py-0.5 text-right text-xs text-slate-900 tabular-nums"
                />
                <span className="text-slate-500">%</span>
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {ecosystem ? (
        <label className="mt-2 flex items-center gap-2 text-xs text-slate-700">
          <input
            type="checkbox"
            checked={usage.ecosystems.includes(ecosystem)}
            readOnly={!onChange}
            onChange={onChange ? () => onChange(toggleEcosystem(usage, ecosystem)) : undefined}
          />
          I redeem in {ecosystem} (its points are only worth full value there)
        </label>
      ) : null}

      {tier ? <TierPicker program={tier.program} bonus={tier.bonus} usage={usage} onChange={onChange} /> : null}

      {deltas.length > 0 ? (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {deltas.map((d) => (
            <li
              key={d.category}
              className={
                d.delta_inr_monthly >= 0
                  ? "rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-800 tabular-nums"
                  : "rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] text-amber-800 tabular-nums"
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

/**
 * "Your <programme> tier": the tier the user holds, persisted with the rest of the usage
 * profile. The bonus is the programme's earn (D-9), shown as its own ledger line in the value
 * totals and never added to the card's rewards or rank.
 */
function TierPicker({
  program, bonus, usage, onChange,
}: { program: LoyaltyProgram; bonus: LoyaltyTierItem | null; usage: UsageProfile; onChange?: (u: UsageProfile) => void }) {
  const selected = usage.loyalty_tiers[program.id] ?? "";
  const selectedTier = program.earn?.tiers?.find((t) => t.id === selected);
  const note = !selectedTier
    ? null
    : bonus
      ? `+${inr(bonus.annual_inr)}/yr ${bonus.tier_name} tier bonus on ${inr(bonus.qualifying_spend_annual_inr)} a year of bookings this card accelerates. Paid by ${program.name}, so it is listed separately and not ranked.`
      : !(selectedTier.bonus_rate > 0)
        ? `${selectedTier.name ?? selectedTier.id} earns no tier bonus.`
        : `No spend through this card's ${program.name} bookings yet, so the tier adds nothing here.`;
  return (
    <div className="mt-2 text-xs text-slate-700">
      <label className="flex items-center gap-2">
        <span>Your {program.name} tier</span>
        <select
          value={selected}
          disabled={!onChange}
          onChange={onChange ? (e) => onChange(setLoyaltyTier(usage, program.id, e.target.value || null)) : undefined}
          className="rounded-md border border-slate-300 px-1.5 py-0.5 text-xs text-slate-900"
        >
          <option value="">None</option>
          {(program.earn?.tiers ?? []).map((t) => <option key={t.id} value={t.id}>{t.name ?? t.id}</option>)}
        </select>
      </label>
      {note ? <p className="mt-1 text-[11px] text-slate-500 tabular-nums">{note}</p> : null}
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
    return <p className="text-[11px] text-slate-500">No merchant shares declared yet — set them in any card&apos;s breakdown.</p>;
  }
  return (
    <ul className="flex flex-wrap gap-1.5">
      {[...families].sort((a, b) => a[0].localeCompare(b[0])).map(([f, pct]) => (
        <li key={f} className="flex items-center gap-1 rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px] text-slate-700">
          {tokenLabel(f)} {pct}%
          {onChange ? (
            <button type="button" aria-label={`Remove ${tokenLabel(f)}`} onClick={() => onChange(setFamilyShare(usage, f, 0))} className="text-slate-400 hover:text-slate-700">
              ×
            </button>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
