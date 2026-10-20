import Link from "next/link";
import type { EnrichedCard } from "@/lib/types";

export function Breadcrumb({ card }: { card: EnrichedCard }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-fg-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="hover:text-fg-secondary">Home</Link>
        </li>
        <li aria-hidden>›</li>
        <li>
          <Link
            href={`/browse?issuer=${card.issuer}`}
            className="hover:text-fg-secondary"
          >
            {card.issuer_detail.name}
          </Link>
        </li>
        <li aria-hidden>›</li>
        <li className="text-fg-secondary font-medium">{card.name}</li>
      </ol>
    </nav>
  );
}
