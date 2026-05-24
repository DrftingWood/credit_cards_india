import type { EnrichedCard } from "@/lib/types";
import { formatInr, formatPct, formatDate } from "@/lib/utils";
import { formatAccelerated } from "@/lib/detail-derivations";
import { SourceLink } from "@/components/source-link";

/**
 * The extended prose sections below the scannable grids. Each subsection
 * renders one aspect of the card's benefits in detail. Sections with
 * missing data silently omit — so the page collapses down cleanly on
 * sparse records.
 */
export function DeepDive({ card }: { card: EnrichedCard }) {
  const welcome = card.current_benefits?.welcome ?? [];
  const milestones = card.current_benefits?.milestones ?? [];
  const accelerated = card.current_rewards?.accelerated ?? [];
  const exclusions = card.current_rewards?.exclusions ?? [];
  const capping = card.current_rewards?.capping_rules ?? [];
  const insurance = card.current_benefits?.insurance ?? [];
  const lounge = card.current_benefits?.lounge_access;
  const other = card.current_benefits?.other ?? [];
  const sources = dedupedSources(card);

  return (
    <div className="space-y-4">
      {welcome.length > 0 ? (
        <Section title={welcome[0].value_inr ? `${formatInr(welcome[0].value_inr)} welcome benefit` : "Welcome benefit"}>
          <ul className="space-y-1.5">
            {welcome.map((w, i) => (
              <li key={i}>
                <strong>{w.benefit}</strong>
                {w.condition ? <div className="text-slate-600 text-sm mt-0.5">{w.condition}</div> : null}
                {w.window_days ? (
                  <div className="text-xs text-slate-500 mt-0.5">Window: {w.window_days} days from issuance.</div>
                ) : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {accelerated.length > 0 ? (
        <Section title="Accelerated rewards">
          <ul className="space-y-1">
            {accelerated.map((a, i) => (
              <li key={i}>
                <strong>{formatAccelerated(a)}</strong>
                {a.merchants?.length ? (
                  <div className="text-xs text-slate-600 mt-0.5">
                    Merchants: {a.merchants.slice(0, 8).join(", ")}
                    {a.merchants.length > 8 ? ` + ${a.merchants.length - 8} more` : ""}
                  </div>
                ) : null}
                {a.notes ? <div className="text-xs text-slate-500 mt-0.5">{a.notes}</div> : null}
              </li>
            ))}
          </ul>
          {capping.length > 0 ? (
            <div className="mt-3">
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Capping rules</div>
              <ul className="list-disc pl-5 text-sm space-y-0.5">
                {capping.map((c, i) => (<li key={i}>{c}</li>))}
              </ul>
            </div>
          ) : null}
        </Section>
      ) : null}

      {exclusions.length > 0 ? (
        <Section title="Exclusions">
          <p className="text-slate-700">
            The following spend categories earn no rewards on this card:
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {exclusions.map((e, i) => (
              <li key={i} className="chip capitalize">{e.replace(/-/g, " ")}</li>
            ))}
          </ul>
        </Section>
      ) : null}

      {milestones.length > 0 ? (
        <Section title="Milestone benefits">
          <ul className="space-y-1">
            {milestones.map((m, i) => (
              <li key={i}>
                <strong>{formatInr(m.spend_inr)} / {m.cycle}</strong>: {m.benefit}
                {m.value_inr != null ? (
                  <span className="text-slate-500"> (≈ {formatInr(m.value_inr)} value)</span>
                ) : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {(lounge?.domestic || lounge?.international) ? (
        <Section title="Airport lounge access">
          {lounge?.domestic ? (
            <div>
              <div className="text-sm font-medium text-slate-800">Domestic</div>
              <LoungeDetails d={lounge.domestic} />
            </div>
          ) : null}
          {lounge?.international ? (
            <div className="mt-3">
              <div className="text-sm font-medium text-slate-800">International</div>
              <LoungeDetails d={lounge.international} />
            </div>
          ) : null}
        </Section>
      ) : null}

      {insurance.length > 0 ? (
        <Section title="Insurance benefits">
          <ul className="space-y-1">
            {insurance.map((ins, i) => (
              <li key={i} className="capitalize">
                <strong>{ins.type.replace(/-/g, " ")}</strong>: {formatInr(ins.sum_insured_inr)}
                {ins.conditions ? (
                  <div className="text-xs text-slate-600 mt-0.5 normal-case">{ins.conditions}</div>
                ) : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {card.current_benefits?.fuel_surcharge_waiver ? (
        <Section title="Fuel surcharge waiver">
          <p>
            {formatPct(card.current_benefits.fuel_surcharge_waiver.pct, 1)} waiver on fuel transactions{" "}
            {card.current_benefits.fuel_surcharge_waiver.min_txn_inr
              ? `between ${formatInr(card.current_benefits.fuel_surcharge_waiver.min_txn_inr)}`
              : ""}
            {card.current_benefits.fuel_surcharge_waiver.max_txn_inr
              ? ` and ${formatInr(card.current_benefits.fuel_surcharge_waiver.max_txn_inr)}`
              : ""}
            {card.current_benefits.fuel_surcharge_waiver.cap_per_cycle_inr
              ? `, capped at ${formatInr(card.current_benefits.fuel_surcharge_waiver.cap_per_cycle_inr)} per ${card.current_benefits.fuel_surcharge_waiver.cycle ?? "cycle"}`
              : ""}.
          </p>
        </Section>
      ) : null}

      {other.length > 0 ? (
        <Section title="Other benefits">
          <ul className="space-y-1.5">
            {other.map((o, i) => (
              <li key={i}>
                <strong>{o.name}.</strong> {o.description}
                {o.value_inr ? (
                  <span className="text-slate-500"> (≈ {formatInr(o.value_inr)} value)</span>
                ) : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {sources.length > 0 ? (
        <Section title="Sources">
          <ul className="space-y-1 text-xs">
            {sources.map((s, i) => (
              <li key={i}>
                <SourceLink source={s} prefix="" />
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-500">
            Last verified {formatDate(card.metadata.last_verified_on)}. Verify with the issuer before applying.
          </p>
        </Section>
      ) : null}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <header className="border-b border-slate-200 bg-slate-50 px-5 py-3">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      </header>
      <div className="p-5 text-sm text-slate-800">{children}</div>
    </section>
  );
}

function LoungeDetails({ d }: { d: NonNullable<NonNullable<EnrichedCard["current_benefits"]>["lounge_access"]>["domestic"] }) {
  if (!d) return null;
  // Skip the row when nothing meaningful is declared — "0 visit(s)" reads worse than no row.
  if (d.visits_per_cycle === 0 || d.visits_per_cycle == null) return null;
  return (
    <div className="text-sm text-slate-700 mt-1">
      {d.visits_per_cycle === "unlimited" ? "Unlimited" : d.visits_per_cycle} visit(s) / {d.cycle ?? "year"}.
      {d.via?.length ? (
        <span className="text-slate-500"> Via {d.via.join(", ")}.</span>
      ) : null}
      {d.guests_per_visit ? (
        <span className="text-slate-500"> Guests: {d.guests_per_visit === "unlimited" ? "unlimited" : d.guests_per_visit}.</span>
      ) : null}
      {d.spend_threshold_inr ? (
        <div className="text-xs text-amber-700 mt-0.5">
          Unlocks after {formatInr(d.spend_threshold_inr)} / {d.spend_threshold_cycle ?? "quarter"} spend.
        </div>
      ) : null}
      {d.notes ? <div className="text-xs text-slate-500 mt-0.5">{d.notes}</div> : null}
    </div>
  );
}

type Source = NonNullable<EnrichedCard["current_fees"]>["source"];

function dedupedSources(card: EnrichedCard): Source[] {
  const seen = new Set<string>();
  const out: Source[] = [];
  const collect = (s: Source | null | undefined) => {
    if (!s?.url) return;
    if (seen.has(s.url)) return;
    seen.add(s.url);
    out.push(s);
  };
  collect(card.current_fees?.source);
  collect(card.current_rewards?.source);
  collect(card.current_benefits?.source);
  return out;
}
