import Link from "next/link";
import type { EnrichedCard } from "@/lib/types";

export function Breadcrumb({ card }: { card: EnrichedCard }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="hover:text-slate-700">Home</Link>
        </li>
        <li aria-hidden>›</li>
        <li>
          <Link
            href={`/browse?issuer=${card.issuer}`}
            className="hover:text-slate-700"
          >
            {card.issuer_detail.name}
          </Link>
        </li>
        <li aria-hidden>›</li>
        <li className="text-slate-700 font-medium">{card.name}</li>
      </ol>
    </nav>
  );
}
