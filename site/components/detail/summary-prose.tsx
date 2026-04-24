import type { EnrichedCard } from "@/lib/types";
import { summaryProse } from "@/lib/detail-derivations";

/** Two-or-three-sentence introduction block at the top of the detail page. */
export function SummaryProse({ card }: { card: EnrichedCard }) {
  const sentences = summaryProse(card);
  if (sentences.length === 0) return null;
  return (
    <section className="text-slate-700 leading-relaxed space-y-2">
      {sentences.map((s, i) => (
        <p key={i} className={i === 0 ? "text-slate-800" : undefined}>{s}</p>
      ))}
    </section>
  );
}
