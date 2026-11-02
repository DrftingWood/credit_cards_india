import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site-config";
import { Suspense } from "react";
import { getActiveCards, getAllIssuers } from "@/lib/data";
import { browseCanonical } from "@/lib/paginate";
import { BrowseClient } from "./browse-client";

type Search = Record<string, string | string[] | undefined>;

// Reading searchParams makes this route render per request, which is what lets page N carry its own
// canonical in the initial HTML. Filtering itself stays client-side.
export async function generateMetadata({ searchParams }: { searchParams: Promise<Search> }): Promise<Metadata> {
  return pageMetadata({
    title: "Browse every Indian credit card",
    description:
      "Filter Indian credit cards by issuer, network, tier, reward currency, lifetime-free, lounge access, and co-brand.",
    path: browseCanonical(await searchParams, getActiveCards().length),
  });
}

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
