import type { EnrichedCard } from "@/lib/types";
import { productDetails } from "@/lib/detail-derivations";

export function ProductDetails({ card }: { card: EnrichedCard }) {
  const bullets = productDetails(card);
  if (bullets.length === 0) return null;
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <header className="border-b border-slate-200 bg-slate-50 px-5 py-3">
        <h2 className="text-sm font-semibold text-slate-900">Product Details</h2>
      </header>
      <ul className="p-5 list-disc pl-9 text-sm text-slate-800 space-y-1.5">
        {bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </section>
  );
}
