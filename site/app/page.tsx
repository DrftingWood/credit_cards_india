import Link from "next/link";
import { getActiveCards, getIndex } from "@/lib/data";
import { CardGrid } from "@/components/card-grid";

/** Featured selection for the home grid. Handpicked to span tiers / issuers /
 *  currencies so the reader sees variety on first load. */
const FEATURED_IDS = [
  "hdfc-infinia",
  "axis-magnus",
  "amex-platinum-travel",
  "sbi-cashback",
  "icici-amazon-pay",
  "idfc-first-wealth",
  "hdfc-marriott-bonvoy",
  "axis-ace",
];

export default function HomePage() {
  const cards = getActiveCards();
  const index = getIndex();

  const featured = FEATURED_IDS
    .map((id) => cards.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => !!c);

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-brand-50 p-8 md:p-10">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
          Every credit card in India, open and source-linked.
        </h1>
        <p className="mt-3 max-w-2xl text-slate-700">
          A community-maintained dataset of fees, rewards and benefits for{" "}
          <strong>{index.counts.cards_total}</strong> cards across{" "}
          <strong>{index.counts.issuers}</strong> issuers. Every number links back to the issuer page.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/browse"
            className="inline-flex items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white no-underline hover:bg-brand-700 hover:text-white"
          >
            Browse {index.counts.cards_total} cards
          </Link>
          <Link
            href="/calculator"
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 no-underline hover:bg-slate-50 hover:text-slate-900"
          >
            Find the best card for my spend
          </Link>
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-xl font-semibold text-slate-900">At a glance</h2>
          <Link href="/about" className="text-sm">
            How we source this →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Cards tracked" value={index.counts.cards_total} />
          <Stat label="Issuers covered" value={index.counts.issuers} />
          <Stat label="Lifetime-free" value={index.counts.cards_lifetime_free} />
          <Stat label="Invite-only" value={index.counts.cards_invite_only} />
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-xl font-semibold text-slate-900">Featured</h2>
          <Link href="/browse" className="text-sm">
            See all →
          </Link>
        </div>
        <CardGrid cards={featured} />
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-2xl font-semibold tabular-nums text-slate-900">{value}</div>
      <div className="text-xs uppercase tracking-wide text-slate-500 mt-1">{label}</div>
    </div>
  );
}
