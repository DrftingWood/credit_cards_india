import type { EnrichedCard } from "@/lib/types";
import { derivePros, deriveCons } from "@/lib/detail-derivations";

export function ProsCons({ card }: { card: EnrichedCard }) {
  const pros = derivePros(card);
  const cons = deriveCons(card);
  if (pros.length === 0 && cons.length === 0) return null;
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <header className="border-b border-slate-200 bg-slate-50 px-5 py-3">
        <h2 className="text-sm font-semibold text-slate-900">Pros &amp; Cons</h2>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
        <div className="p-5">
          <div className="text-xs uppercase tracking-wide text-emerald-700 font-medium mb-2">
            Pros
          </div>
          {pros.length > 0 ? (
            <ul className="space-y-1.5 text-sm text-slate-800">
              {pros.map((p, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-emerald-600 shrink-0" aria-hidden>✓</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No derived pros.</p>
          )}
        </div>
        <div className="p-5">
          <div className="text-xs uppercase tracking-wide text-rose-700 font-medium mb-2">
            Cons
          </div>
          {cons.length > 0 ? (
            <ul className="space-y-1.5 text-sm text-slate-800">
              {cons.map((c, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-rose-600 shrink-0" aria-hidden>✗</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No derived cons.</p>
          )}
        </div>
      </div>
      <footer className="text-xs text-slate-500 px-5 py-2 border-t border-slate-200 bg-slate-50">
        Pros &amp; cons are heuristically derived from the card&apos;s fees, rewards and benefits. Not editorial opinion.
      </footer>
    </section>
  );
}
