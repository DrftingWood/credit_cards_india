import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site-config";
import { Suspense } from "react";
import { getActiveCards, getAllIssuers } from "@/lib/data";
import { BrowseClient } from "./browse-client";

export const metadata: Metadata = pageMetadata({
  title: "Browse every Indian credit card",
  description:
    "Filter Indian credit cards by issuer, network, tier, reward currency, lifetime-free, lounge access, and co-brand.",
  path: "/browse",
});

export default function BrowsePage() {
  const cards = getActiveCards();
  const issuers = getAllIssuers();

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-fg">Browse</h1>
        <p className="mt-1 text-fg-muted text-sm">
          All active cards. Filters are shareable — copy the URL.
        </p>
      </header>
      <Suspense fallback={<div className="text-fg-muted text-sm">Loading filters…</div>}>
        <BrowseClient cards={cards} issuers={issuers} />
      </Suspense>
    </div>
  );
}
