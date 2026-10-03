import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allCardRouteParams, cardHref, getCardById, getCardByIssuerAndSlug } from "@/lib/data";
import { cycleNoun, formatDate, formatInr } from "@/lib/utils";
import { pickTopAccelerated, formatAcceleratedRate } from "@/lib/detail-derivations";
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
import { AccelerationBreakdown } from "@/components/detail/acceleration-breakdown";
import { toClientCard } from "@/lib/client-card";
import type { EnrichedCard } from "@/lib/types";

interface Params {
  issuer: string;
  slug: string;
}

// Every card page is pre-rendered; an unknown slug is a static 404 rather
// than an on-demand render.
export const dynamicParams = false;

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
  if (!card) return { title: "Card not found", robots: { index: false } };
  const description = composeMetaDescription(card);
  // Per-card OG/Twitter so share previews aren't identical across all 150+ pages.
  // Falls back to the layout's site-level images when the card has no licensed art.
  const images = card.image_path ? [{ url: card.image_path, alt: card.name }] : undefined;
  return {
    title: card.name,
    description,
    alternates: { canonical: cardHref(card) },
    openGraph: {
      title: card.name,
      description,
      type: "article",
      siteName: "Credit Cards of India",
      url: cardHref(card),
      ...(images ? { images } : {}),
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: card.name,
      description,
      ...(images ? { images } : {}),
    },
  };
}

/**
 * Per-card meta description that highlights the actual differentiator —
 * top accelerated rate, lounge counts, co-brand partner, fee — instead of
 * the same generic stub on every page.
 */
function composeMetaDescription(card: EnrichedCard): string {
  const parts: string[] = [];
  const fee = card.current_fees?.annual_fee_inr ?? null;
  const top = pickTopAccelerated(card);
  const lounge = card.current_benefits?.lounge_access;
  const partner = card.co_brand?.partner;

  if (partner) {
    parts.push(`${card.name} — co-branded with ${partner}`);
  } else {
    parts.push(`${card.name} from ${card.issuer_detail.name}`);
  }
  if (top) {
    // Receipt-visible rate ("45 pts per ₹200" / "5%"), NOT the raw effective_rate
    // as a percent — that read points cards as absurd ("45% on dining").
    const rate = formatAcceleratedRate(top, card.current_rewards);
    parts.push(`earns ${rate} on ${top.category.replace(/-/g, " ")}`);
  }
  // Only mention lounge visits when the count is real — `visits_per_cycle: 0` or
  // missing reads as misleading marketing.
  const intlVisits = lounge?.international?.visits_per_cycle;
  const domVisits = lounge?.domestic?.visits_per_cycle;
  const intlReal = intlVisits === "unlimited" || (typeof intlVisits === "number" && intlVisits > 0);
  const domReal = domVisits === "unlimited" || (typeof domVisits === "number" && domVisits > 0);
  if (intlReal || domReal) {
    // Visit counts are per the lounge record's own cycle (often quarterly).
    const bits: string[] = [];
    if (intlReal) bits.push(`${intlVisits} international/${cycleNoun(lounge?.international?.cycle)}`);
    if (domReal) bits.push(`${domVisits} domestic/${cycleNoun(lounge?.domestic?.cycle)}`);
    parts.push(`${bits.join(" + ")} lounge visits`);
  }
  if (fee !== null) {
    parts.push(card.computed.is_lifetime_free ? "lifetime free" : fee === 0 ? "no annual fee" : `${formatInr(fee)} + GST annual fee`);
  }
  return parts.join("; ") + ".";
}

/** Static JSON-LD Product schema for SEO rich snippets. */
function jsonLdForCard(card: EnrichedCard): Record<string, unknown> {
  const fee = card.current_fees?.annual_fee_inr;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: card.name,
    category: "Credit Card",
    brand: {
      "@type": "Organization",
      name: card.issuer_detail.name,
      url: card.issuer_detail.website,
    },
    description: composeMetaDescription(card),
    ...(fee != null
      ? {
          offers: {
            "@type": "Offer",
            price: String(fee),
            priceCurrency: "INR",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: String(fee),
              priceCurrency: "INR",
              unitText: "ANNUM",
            },
            // Discontinued and on-hold cards both take no new applications.
            availability: card.computed.is_active
              ? "https://schema.org/InStock"
              : "https://schema.org/Discontinued",
          },
        }
      : {}),
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
        </div>
      </header>

      <StatusNotice card={card} />

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
            card.co_brand.partner_website ? (
              <a
                href={card.co_brand.partner_website}
                target="_blank"
                rel="noopener noreferrer"
                className="chip chip-brand no-underline hover:underline"
              >
                Co-brand · {card.co_brand.partner} ↗
              </a>
            ) : (
              <span className="chip chip-brand">Co-brand · {card.co_brand.partner}</span>
            )
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* The calculator and compare tools only carry active + invite-only
              cards (getActiveCards). Linking a discontinued/on-hold card there
              lands the user on a tool where their card silently isn't present,
              so only offer these CTAs when the card actually appears (C3). */}
          {card.computed.is_active ? (
            <>
              <Link
                href={`/calculator?card=${card.id}`}
                className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 no-underline hover:bg-slate-50 hover:text-slate-900"
              >
                Calculate rewards
              </Link>
              <Link
                href={`/compare?cards=${card.id}`}
                className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 no-underline hover:bg-slate-50 hover:text-slate-900"
              >
                + Compare
              </Link>
            </>
          ) : null}
          {/* A closed card's apply link leads nowhere useful; the status notice
              above already says it takes no new applications. */}
          {card.computed.is_active && card.application?.apply_url ? (
            <a
              href={card.application.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-medium text-white no-underline hover:bg-brand-700 hover:text-white"
            >
              Apply Now ↗
            </a>
          ) : null}
        </div>
      </section>

      {/* Scannable grids */}
      <RewardsBenefitsGrid card={card} />
      <AccelerationBreakdown card={toClientCard(card)} />
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

      {/* Tag chips for discoverability */}
      {(card.metadata.tags ?? []).length > 0 ? (
        <section className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs uppercase tracking-wide text-slate-500 mr-1">Tags</span>
          {(card.metadata.tags ?? []).map((t) => (
            <Link
              key={t}
              href={`/browse?tag=${t}`}
              className="chip no-underline hover:bg-slate-100 hover:text-slate-900"
            >
              {t.replace(/-/g, " ")}
            </Link>
          ))}
        </section>
      ) : null}

      {/* JSON-LD structured data for SEO. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdForCard(card)) }}
      />
    </article>
  );
}

/**
 * Lifecycle notice shown under the title. `discontinued` and `on-hold` both
 * mean "closed to new applicants" (the 2026-06 audit marked ~10 cards on-hold);
 * rendering them like live cards is misleading. `invite-only` gets a softer note
 * since it IS obtainable, just not via open application.
 */
function StatusNotice({ card }: { card: EnrichedCard }) {
  if (card.status === "active") return null;

  if (card.status === "invite-only") {
    return (
      <aside className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        <strong>Invite-only.</strong> This card is not available through an open
        application — it is extended by the issuer to select customers.
      </aside>
    );
  }

  const discontinued = card.status === "discontinued";
  return (
    <aside className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <strong>
        {discontinued ? "This card was discontinued" : "Closed to new applicants"}
        {discontinued && card.discontinued_on
          ? ` on ${formatDate(card.discontinued_on)}`
          : ""}
        .
      </strong>{" "}
      {discontinued
        ? "It is no longer accepting new applications. The details below reflect the card's final state before discontinuation."
        : "The issuer has stopped sourcing new applications; existing cardholders keep these benefits. Details below reflect the latest known terms."}
    </aside>
  );
}

function EligibilitySection({ card }: { card: ReturnType<typeof getCardByIssuerAndSlug> }) {
  if (!card) return null;
  const e = card.eligibility;
  const replacesId = card.application?.replaces_card ?? null;
  const replaces = replacesId ? getCardById(replacesId) : null;
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <header className="border-b border-slate-200 bg-slate-50 px-5 py-3">
        <h2 className="text-sm font-semibold text-slate-900">Eligibility</h2>
      </header>
      <dl className="p-5 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3 text-sm">
        <Fact
          label="Age"
          value={
            e.min_age && e.max_age
              ? `${e.min_age}–${e.max_age}`
              : e.min_age
                ? `${e.min_age}+`
                : e.max_age
                  ? `Up to ${e.max_age}`
                  : "—"
          }
        />
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
      {replaces ? (
        <p className="px-5 pb-3 text-sm text-slate-700">
          Supersedes{" "}
          <Link
            href={cardHref(replaces)}
            className="text-brand-700 hover:text-brand-800"
          >
            {replaces.name}
          </Link>
          .
        </p>
      ) : null}
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
