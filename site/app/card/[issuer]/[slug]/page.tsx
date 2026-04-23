import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allCardRouteParams, getCardByIssuerAndSlug } from "@/lib/data";
import { formatDate, formatInr } from "@/lib/utils";
import { HistoryTimeline } from "@/components/history-timeline";
import { IssuerLogo } from "@/components/logos/issuer-logo";
import { NetworkLogo } from "@/components/logos/network-logo";
import { Breadcrumb } from "@/components/detail/breadcrumb";
import { SummaryProse } from "@/components/detail/summary-prose";
import { QuickFacts } from "@/components/detail/quick-facts";
import { RewardsBenefitsGrid } from "@/components/detail/rewards-benefits-grid";
import { FeesChargesGrid } from "@/components/detail/fees-charges-grid";
import { ProductDetails } from "@/components/detail/product-details";
import { ProsCons } from "@/components/detail/pros-cons";
import { DeepDive } from "@/components/detail/deep-dive";

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
      <Breadcrumb card={card} />

      {/* Title strip */}
      <header className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 leading-tight">
          {card.name}
        </h1>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span>Updated {formatDate(verified)}</span>
          <span aria-hidden>·</span>
          <span>Source-linked</span>
          {card.status === "discontinued" ? (
            <>
              <span aria-hidden>·</span>
              <span className="chip chip-warn">
                Discontinued
                {card.discontinued_on ? ` ${formatDate(card.discontinued_on)}` : ""}
              </span>
            </>
          ) : null}
        </div>
      </header>

      {/* Summary prose */}
      <SummaryProse card={card} />

      {/* Quick facts box */}
      <QuickFacts card={card} />

      {/* Identity + actions strip */}
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <IssuerLogo issuer={card.issuer_detail} variant="with-name" height={22} />
          <NetworkLogo network={card.network_detail} height={20} />
          {card.network_tier ? (
            <span className="chip capitalize">{card.network_tier.replace("-", " ")}</span>
          ) : null}
          <span className="chip capitalize">{card.tier.replace("-", " ")}</span>
          {card.computed.is_lifetime_free ? (
            <span className="chip chip-success">Lifetime free</span>
          ) : null}
          {card.co_brand ? (
            <span className="chip chip-brand">Co-brand · {card.co_brand.partner}</span>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/compare?cards=${card.id}`}
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 no-underline hover:bg-slate-50 hover:text-slate-900"
          >
            + Compare
          </Link>
          {card.application?.apply_url ? (
            <a
              href={card.application.apply_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-medium text-white no-underline hover:bg-brand-700 hover:text-white"
            >
              Apply Now ↗
            </a>
          ) : null}
        </div>
      </section>

      {/* Scannable grids */}
      <RewardsBenefitsGrid card={card} />
      <FeesChargesGrid card={card} />

      {/* Product details + pros/cons */}
      <ProductDetails card={card} />
      <ProsCons card={card} />

      {/* Deep-dive prose sections */}
      <DeepDive card={card} />

      {/* Eligibility */}
      <EligibilitySection card={card} />

      {/* History */}
      <HistoryTimeline card={card} />
    </article>
  );
}

function EligibilitySection({ card }: { card: ReturnType<typeof getCardByIssuerAndSlug> }) {
  if (!card) return null;
  const e = card.eligibility;
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <header className="border-b border-slate-200 bg-slate-50 px-5 py-3">
        <h2 className="text-sm font-semibold text-slate-900">Eligibility</h2>
      </header>
      <dl className="p-5 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3 text-sm">
        <Fact label="Age" value={e.min_age && e.max_age ? `${e.min_age}–${e.max_age}` : "—"} />
        <Fact label="Credit score" value={e.credit_score_min ? `${e.credit_score_min}+` : "—"} />
        <Fact
          label="Income (salaried)"
          value={
            formatInr(e.income_inr_annual?.salaried ?? null) +
            (e.income_inr_annual?.salaried ? " p.a." : "")
          }
        />
        <Fact
          label="Income (self-employed)"
          value={
            formatInr(e.income_inr_annual?.self_employed ?? null) +
            (e.income_inr_annual?.self_employed ? " p.a." : "")
          }
        />
      </dl>
      {e.notes ? <p className="px-5 pb-5 text-sm text-slate-700">{e.notes}</p> : null}
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
