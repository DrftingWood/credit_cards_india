import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site-url";
import { Suspense } from "react";
import { getActiveClientCards, getAllClientIssuers } from "@/lib/data";
import { BrowseClient } from "./browse-client";

export const metadata: Metadata = pageMetadata(
  "Browse every Indian credit card",
  "Filter Indian credit cards by issuer, network, tier, reward currency, lifetime-free, lounge access, and co-brand.",
);

export default function BrowsePage() {
  const cards = getActiveClientCards();
  const issuers = getAllClientIssuers();

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Browse</h1>
        <p className="mt-1 text-slate-600 text-sm">
          All active cards. Filters are shareable — copy the URL.
        </p>
      </header>
      <Suspense fallback={<div className="text-slate-500 text-sm">Loading filters…</div>}>
        <BrowseClient cards={cards} issuers={issuers} />
      </Suspense>
    </div>
  );
}
