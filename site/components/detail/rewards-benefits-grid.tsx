import type { EnrichedCard, BenefitRecord } from "@/lib/types";
import { formatInr, formatPct } from "@/lib/utils";
import { formatAccelerated, pickTopAccelerated } from "@/lib/detail-derivations";
import { InfoGrid, type InfoCell } from "./info-grid";

function loungeText(
  lounge: NonNullable<BenefitRecord["lounge_access"]>["domestic"] | null | undefined,
) {
  if (!lounge) return "N/A";
  // {visits_per_cycle: 0} reads worse than no lounge at all — "0 visits each year"
  // misrepresents the card. Treat as N/A so the row aligns with has_*_lounge.
  if (lounge.visits_per_cycle === 0 || lounge.visits_per_cycle == null) {
    // Spend-threshold lounges (without a fixed visit count) still count.
    if (lounge.spend_threshold_inr == null) return "N/A";
  }
  const visits =
    lounge.visits_per_cycle === "unlimited"
      ? "Unlimited"
      : `${lounge.visits_per_cycle}`;
  const cycle = lounge.cycle ?? "year";
  const threshold = lounge.spend_threshold_inr
    ? ` on making spends of ${formatInr(lounge.spend_threshold_inr)} in the previous ${lounge.spend_threshold_cycle ?? "quarter"}`
    : "";
  if (lounge.visits_per_cycle == null) {
    // Threshold-only path
    return `Lounge access${threshold}.`;
  }
  const noun = Number(visits) === 1 ? "visit" : "visits";
  return `${visits} ${noun} each ${cycle}${threshold}.`;
}

/** The scannable Rewards & Benefits summary grid on the detail page. */
export function RewardsBenefitsGrid({ card }: { card: EnrichedCard }) {
  const benefits = card.current_benefits;
  const rewards = card.current_rewards;
  const top = pickTopAccelerated(card);
  const base = card.computed.headline_rate_pct;

  const rewardsRate = rewards ? (
    <div className="space-y-0.5">
      {rewards.accelerated?.slice(0, 3).map((a, i) => (
        <div key={i}>{formatAccelerated(a)}</div>
      ))}
      {base !== null ? <div>Base {formatPct(base, 2)} on other spends.</div> : null}
    </div>
  ) : (
    "N/A"
  );

  const redemption = rewards?.redemption?.[0];
  const rewardRedemption = redemption ? (
    <>
      {redemption.program ? <strong>{redemption.program}: </strong> : null}
      {redemption.constraints ?? `Redeem at ${formatInr(redemption.rate_inr_per_unit ?? null)} per unit.`}
    </>
  ) : (
    "N/A"
  );

  const domLounge = loungeText(benefits?.lounge_access?.domestic ?? null);
  const intlLounge = loungeText(benefits?.lounge_access?.international ?? null);

  const golf = benefits?.golf
    ? `${
        benefits.golf.rounds_per_cycle === "unlimited"
          ? "Unlimited"
          : benefits.golf.rounds_per_cycle ?? 0
      } round(s) / ${benefits.golf.cycle ?? "month"}${
        benefits.golf.lessons_per_cycle
          ? ` · ${benefits.golf.lessons_per_cycle} lesson(s)`
          : ""
      }.`
    : "N/A";

  const movieDining = benefits?.movies
    ? `${benefits.movies.type.toUpperCase()} on ${benefits.movies.partner ?? "partner cinemas"}`
    : benefits?.dining
    ? `Up to ${formatPct(benefits.dining.discount_pct ?? null, 0)} off via ${benefits.dining.program ?? "dining partners"}`
    : "N/A";

  const travel = card.co_brand?.category === "airline"
    ? `Co-branded with ${card.co_brand.partner}; ${top ? formatAccelerated(top) : "travel-forward rewards"}.`
    : benefits?.insurance?.find((i) => /travel/.test(i.type))
    ? "Travel insurance cover bundled (see Insurance section)."
    : "N/A";

  const insurance = (benefits?.insurance ?? []).length > 0 ? (
    <ul className="space-y-0.5">
      {benefits!.insurance!.map((i, idx) => (
        <li key={idx} className="capitalize">
          {i.type.replace(/-/g, " ")}: {formatInr(i.sum_insured_inr)}
        </li>
      ))}
    </ul>
  ) : (
    "N/A"
  );

  const welcome = benefits?.welcome?.[0]
    ? benefits.welcome[0].benefit
    : "N/A";

  const milestones = benefits?.milestones ?? [];
  const milestoneContent = milestones.length > 0 ? (
    <ul className="space-y-0.5 list-none">
      {milestones.slice(0, 4).map((m, i) => (
        <li key={i}>
          <strong>{formatInr(m.spend_inr)}</strong> / {m.cycle}: {m.benefit}
        </li>
      ))}
      {milestones.length > 4 ? (
        <li className="text-slate-500">+{milestones.length - 4} more milestones</li>
      ) : null}
    </ul>
  ) : (
    "N/A"
  );

  const otherList = benefits?.other ?? [];
  const otherContent = otherList.length > 0 ? (
    <ul className="space-y-0.5 list-none">
      {otherList.slice(0, 3).map((o, i) => (
        <li key={i}>
          <strong>{o.name}</strong>
          {o.description ? <span className="text-slate-600"> — {o.description}</span> : null}
        </li>
      ))}
      {otherList.length > 3 ? (
        <li className="text-slate-500">+{otherList.length - 3} more</li>
      ) : null}
    </ul>
  ) : (
    "N/A"
  );

  const cells: InfoCell[] = [
    { label: "Rewards Rate", value: rewardsRate },
    { label: "Reward Redemption", value: rewardRedemption },
    { label: "Welcome Benefits", value: welcome },
    { label: "Milestone Rewards", value: milestoneContent },
    { label: "Domestic Lounge Access", value: domLounge },
    { label: "International Lounge Access", value: intlLounge },
    { label: "Travel", value: travel },
    { label: "Movie & Dining", value: movieDining },
    { label: "Golf", value: golf },
    { label: "Insurance Benefits", value: insurance },
    { label: "Other Benefits", value: otherContent },
  ];

  return <InfoGrid title="Rewards and Benefits" cells={cells} />;
}
