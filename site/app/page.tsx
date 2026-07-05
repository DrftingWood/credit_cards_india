import Link from "next/link";
import { getIndex } from "@/lib/data";
import { CategoryTiles } from "@/components/home/category-tiles";
import { SpendStarter } from "@/components/home/spend-starter";

export default function HomePage() {
  const index = getIndex();
  const n = index.counts.cards_total;
  return (
    <div className="space-y-12">
      {/* hero */}
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-brand-50 p-8 md:p-10">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-brand-700">
          {n} cards · sourced from issuer T&amp;C · no affiliate links
        </div>
        <h1 className="mt-3 max-w-2xl text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
          Every card, ranked by what it actually pays you.
        </h1>
        <p className="mt-3 max-w-2xl text-slate-700">
          Tell us where your money goes. We rank India&apos;s cards by <strong>real ₹/year</strong> —
          rewards minus fees and the caps aggregators skip — and link every number back to the issuer.
        </p>
        <SpendStarter />
      </section>

      {/* category tiles */}
      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Best cards, by what you need</h2>
          <Link href="/browse" className="text-sm">All {n} cards →</Link>
        </div>
        <CategoryTiles />
      </section>

      {/* credibility band */}
      <section className="rounded-2xl bg-slate-900 p-8 text-slate-100">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-brand-300">Why you can trust the numbers</div>
        <div className="mt-4 grid grid-cols-2 gap-6 md:grid-cols-4">
          <Trust k={String(n)} v="cards — every fee & reward links to the issuer's own page" />
          <Trust k="Net ₹/yr" v="ranked on what you keep; fees & caps in, 'up to' rates out" />
          <Trust k="₹0" v="affiliate income — we don't earn on applications, so nothing's pushed" />
          <Trust k="Dated" v="every card carries its own verification date" />
        </div>
      </section>

      {/* methodology */}
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-8">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-amber-800">How we rank — in one line</div>
        <p className="mt-2 text-lg font-semibold text-slate-900">
          What you keep = rewards − annual fee − the caps you&apos;ll actually hit → <span className="text-emerald-700">net ₹/yr</span>
        </p>
        <p className="mt-3 max-w-2xl text-sm text-slate-700">
          A 5% card capped at ₹1,000/month is not a 5% card — and we say so. Every ranking is the honest
          ₹/year for a stated spend, with the assumptions shown on each card&apos;s own breakdown.
        </p>
        <Link href="/about" className="mt-4 inline-block text-sm font-semibold text-slate-900 underline">Read the full method →</Link>
      </section>

      {/* tools */}
      <section>
        <h2 className="mb-3 text-xl font-semibold text-slate-900">Tools</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <Tool href="/recommend" t="Rank my cards" d="Enter your monthly spend by category → a net-₹/yr ranked shortlist." />
          <Tool href="/compare" t="Compare side by side" d="Up to 4 cards head-to-head — fees, rates, caps, lounges." />
          <Tool href="/calculator" t="Reward calculator" d="One card, your spend, the exact ₹/yr with caps applied." />
        </div>
      </section>
    </div>
  );
}

function Trust({ k, v }: { k: string; v: string }) {
  return (<div><div className="text-2xl font-semibold text-white tabular-nums">{k}</div><div className="mt-1.5 text-xs text-slate-300">{v}</div></div>);
}
function Tool({ href, t, d }: { href: string; t: string; d: string }) {
  return (
    <Link href={href as never} className="block rounded-xl border border-slate-200 bg-white p-5 no-underline transition-colors hover:border-brand-500/50">
      <div className="text-sm font-semibold text-slate-900">{t}</div>
      <div className="mt-1 text-xs text-slate-500">{d}</div>
      <div className="mt-3 text-xs font-semibold text-brand-700">Open →</div>
    </Link>
  );
}
