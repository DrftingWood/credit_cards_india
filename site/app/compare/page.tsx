import type { Metadata } from "next";
import { Suspense } from "react";
import { getActiveCards } from "@/lib/data";
import { CompareClient } from "./compare-client";

export const metadata: Metadata = {
  title: "Compare Indian credit cards side by side",
  description:
    "Pin up to 4 Indian credit cards and see fees, rewards, lounge access, eligibility and more side by side. Selection is shareable via URL.",
};

export default function ComparePage() {
  const cards = getActiveCards();

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Compare</h1>
        <p className="mt-1 text-slate-600 text-sm max-w-2xl">
          Pin up to 4 cards side by side. Selection is reflected in the URL — copy and share to
          send a comparison to someone else.
        </p>
      </header>
      <Suspense fallback={<div className="text-slate-500 text-sm">Loading…</div>}>
        <CompareClient cards={cards} />
      </Suspense>
    </div>
  );
}
