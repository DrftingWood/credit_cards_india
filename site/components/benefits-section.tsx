import type { BenefitRecord, LoungeDetails } from "@/lib/types";
import { formatInr, formatPct } from "@/lib/utils";
import { SourceLink } from "./source-link";

export function BenefitsSection({ benefits }: { benefits: BenefitRecord | null }) {
  if (!benefits) return null;
  const lounge = benefits.lounge_access;
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-slate-900">Benefits</h2>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {lounge?.domestic ? (
          <Block title="Domestic lounge">
            <LoungeDetailsRow details={lounge.domestic} />
          </Block>
        ) : null}
        {lounge?.international ? (
          <Block title="International lounge">
            <LoungeDetailsRow details={lounge.international} />
          </Block>
        ) : null}

        {benefits.golf ? (
          <Block title="Golf">
            <div>
              {benefits.golf.rounds_per_cycle !== undefined
                ? `${benefits.golf.rounds_per_cycle} round(s) / ${benefits.golf.cycle ?? "month"}`
                : null}
            </div>
            {benefits.golf.lessons_per_cycle ? (
              <div>
                {benefits.golf.lessons_per_cycle} lesson(s) / {benefits.golf.cycle ?? "month"}
              </div>
            ) : null}
          </Block>
        ) : null}

        {benefits.fuel_surcharge_waiver ? (
          <Block title="Fuel surcharge waiver">
            <div>
              {formatPct(benefits.fuel_surcharge_waiver.pct, 1)} waived
              {benefits.fuel_surcharge_waiver.min_txn_inr
                ? ` · min ${formatInr(benefits.fuel_surcharge_waiver.min_txn_inr)}`
                : ""}
              {benefits.fuel_surcharge_waiver.max_txn_inr
                ? ` · max ${formatInr(benefits.fuel_surcharge_waiver.max_txn_inr)}`
                : ""}
            </div>
            {benefits.fuel_surcharge_waiver.cap_per_cycle_inr ? (
              <div className="text-xs text-slate-500 mt-0.5">
                Cap {formatInr(benefits.fuel_surcharge_waiver.cap_per_cycle_inr)} /{" "}
                {benefits.fuel_surcharge_waiver.cycle ?? "cycle"}
              </div>
            ) : null}
          </Block>
        ) : null}

        {benefits.dining ? (
          <Block title="Dining">
            {benefits.dining.program ? <div>{benefits.dining.program}</div> : null}
            {benefits.dining.discount_pct != null ? (
              <div>{formatPct(benefits.dining.discount_pct, 0)} off at partners</div>
            ) : null}
          </Block>
        ) : null}

        {benefits.movies ? (
          <Block title="Movies">
            <div className="capitalize">{benefits.movies.type}</div>
            {benefits.movies.partner ? <div>{benefits.movies.partner}</div> : null}
            {benefits.movies.max_per_cycle
              ? `up to ${benefits.movies.max_per_cycle} / ${benefits.movies.cycle ?? "cycle"}`
              : null}
          </Block>
        ) : null}

        <Block title="Concierge">{benefits.concierge ? "Yes" : "—"}</Block>
      </div>

      {benefits.milestones?.length ? (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-slate-800">Milestones</h3>
          <ul className="mt-1 space-y-1 text-sm">
            {benefits.milestones.map((m, i) => (
              <li key={i}>
                <strong>{formatInr(m.spend_inr)}</strong> / {m.cycle} → {m.benefit}
                {m.value_inr ? (
                  <span className="text-slate-500"> (≈ {formatInr(m.value_inr)})</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {benefits.welcome?.length ? (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-slate-800">Welcome</h3>
          <ul className="mt-1 space-y-1 text-sm">
            {benefits.welcome.map((w, i) => (
              <li key={i}>
                {w.condition ? (
                  <span className="text-slate-600">{w.condition} → </span>
                ) : null}
                {w.benefit}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {benefits.insurance?.length ? (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-slate-800">Insurance</h3>
          <ul className="mt-1 space-y-1 text-sm">
            {benefits.insurance.map((ins, i) => (
              <li key={i} className="capitalize">
                {ins.type.replace(/-/g, " ")}: <strong>{formatInr(ins.sum_insured_inr)}</strong>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {benefits.other?.length ? (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-slate-800">Other</h3>
          <ul className="mt-1 space-y-1 text-sm">
            {benefits.other.map((o, i) => (
              <li key={i}>
                <strong>{o.name}.</strong> {o.description}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <SourceLink source={benefits.source} />
    </section>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">{title}</div>
      <div className="text-slate-800">{children}</div>
    </div>
  );
}

function LoungeDetailsRow({ details }: { details: LoungeDetails }) {
  return (
    <>
      <div>
        {details.visits_per_cycle === "unlimited"
          ? "Unlimited"
          : `${details.visits_per_cycle ?? "—"}`}{" "}
        visit(s) / {details.cycle ?? "cycle"}
        {details.guests_per_visit && details.guests_per_visit !== 0 ? (
          <span className="text-slate-500">
            {" "}
            · guests:{" "}
            {details.guests_per_visit === "unlimited"
              ? "unlimited"
              : details.guests_per_visit}
          </span>
        ) : null}
      </div>
      {details.via?.length ? (
        <div className="text-xs text-slate-500 mt-0.5">via {details.via.join(", ")}</div>
      ) : null}
      {details.spend_threshold_inr ? (
        <div className="text-xs text-amber-700 mt-0.5">
          Unlocks after {formatInr(details.spend_threshold_inr)} /{" "}
          {details.spend_threshold_cycle ?? "quarterly"} spend
        </div>
      ) : null}
    </>
  );
}
