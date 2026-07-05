// site/components/recommend/ranked-row.tsx
import Link from "next/link";
import type { DecoupledScore } from "@/lib/scorer-decoupled";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
export function cardDetailHref(score: DecoupledScore): string {
  const slug = score.card.id.replace(`${score.card.issuer}-`, "");
  return `/card/${score.card.issuer}/${slug}`;
}

export function RankedRow({ rank, score }: { rank: number; score: DecoupledScore }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
      <div className="min-w-0">
        <span className="text-xs font-semibold text-slate-400">#{rank}</span>{" "}
        <Link href={cardDetailHref(score)} className="text-sm font-semibold text-slate-900 hover:underline">
          {score.card.name}
        </Link>
        <p className="truncate text-xs text-slate-500">{score.reason}</p>
      </div>
      <div className="text-right shrink-0">
        <div className="text-sm font-semibold text-slate-900 tabular-nums">{inr(score.net_rewards_inr)}</div>
        <div className="text-[10px] uppercase tracking-wide text-slate-400">est. net /yr</div>
      </div>
    </li>
  );
}
