import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allCardRouteParams, getCardByIssuerAndSlug } from "@/lib/data";
import { formatDate, formatInr } from "@/lib/utils";
import { FeeSection } from "@/components/fee-section";
import { RewardsSection } from "@/components/rewards-section";
import { BenefitsSection } from "@/components/benefits-section";
import { HistoryTimeline } from "@/components/history-timeline";

interface Params {
  issuer: string;
  slug: string;
}

export function generateStaticParams(): Params[] {
  return allCardRouteParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { issuer, slug } = await params;
  const card = getCardByIssuerAndSlug(issuer, slug);
  if (!card) return { title: "Card not found" };
  const fee = card.current_fees?.annual_fee_inr ?? null;
  return {
    title: card.name,
    description: `${card.name} — fees (${formatInr(fee)} annual), rewards and benefits. Source-linked and versioned.`,
  };
}

export default async function CardPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { issuer, slug } = await params;
  const card = getCardByIssuerAndSlug(issuer, slug);
  if (!card) notFound();

  const verified = card.metadata.last_verified_on;

  return (
    <article className="space-y-5">
      <nav className="text-sm">
        <Link href="/browse">← Browse</Link>
      </nav>

      <header className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">
              {card.issuer_detail.name}
            </div>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">{card.name}</h1>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="chip capitalize">{card.network}</span>
              {card.network_tier ? (
                <span className="chip capitalize">{card.network_tier.replace("-", " ")}</span>
              ) : null}
              <span className="chip capitalize">{card.tier.replace("-", " ")}</span>
              <span className={`chip ${card.status === "active" ? "chip-success" : "chip-warn"} capitalize`}>
                {card.status.replace("-", " ")}
              </span>
              {card.computed.is_lifetime_free ? <span className="chip chip-success">Lifetime free</span> : null}
              {card.co_brand ? (
                <span className="chip chip-brand">Co-brand · {card.co_brand.partner}</span>
              ) : null}
            </div>
          </div>

          {card.application?.apply_url ? (
            <a
              href={card.application.apply_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-medium text-white no-underline hover:bg-brand-700 hover:text-white"
            >
              Apply on issuer site
            </a>
          ) : null}
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Last verified {formatDate(verified)}. Always confirm with the issuer before applying.
        </p>
      </header>

      <FeeSection fee={card.current_fees} />
      <RewardsSection rewards={card.current_rewards} />
      <BenefitsSection benefits={card.current_benefits} />

      <EligibilitySection card={card} />

      <HistoryTimeline card={card} />
    </article>
  );
}

function EligibilitySection({ card }: { card: ReturnType<typeof getCardByIssuerAndSlug> }) {
  if (!card) return null;
  const e = card.eligibility;
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-slate-900">Eligibility</h2>
      <dl className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3 text-sm">
        <Fact label="Age" value={e.min_age && e.max_age ? `${e.min_age}–${e.max_age}` : "—"} />
        <Fact label="Credit score" value={e.credit_score_min ? `${e.credit_score_min}+` : "—"} />
        <Fact
          label="Income (salaried)"
          value={formatInr(e.income_inr_annual?.salaried ?? null) + (e.income_inr_annual?.salaried ? " p.a." : "")}
        />
        <Fact
          label="Income (self-employed)"
          value={formatInr(e.income_inr_annual?.self_employed ?? null) + (e.income_inr_annual?.self_employed ? " p.a." : "")}
        />
      </dl>
      {e.notes ? <p className="mt-3 text-sm text-slate-700">{e.notes}</p> : null}
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="prose-card-value text-sm">{value}</dd>
    </div>
  );
}
