import type { EnrichedCard } from "@/lib/types";
import { CardTile } from "./card-tile";

export function CardGrid({ cards }: { cards: EnrichedCard[] }) {
  if (cards.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
        No cards match these filters.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <CardTile key={c.id} card={c} />
      ))}
    </div>
  );
}
