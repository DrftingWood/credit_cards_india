import type { Metadata } from "next";
import { RecommendClient } from "./recommend-client";
import { getActiveCards, getAllLoyaltyPrograms } from "../../lib/data";

export const metadata: Metadata = {
  title: "Find your card — guided questionnaire",
  description:
    "Answer a few short steps about income, spend, brand preferences and lifestyle — get a personalised credit-card shortlist.",
};

export default function RecommendPage() {
  const cards = getActiveCards();
  const programs = getAllLoyaltyPrograms();
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Find your card</h1>
        <p className="mt-1 text-slate-600 text-sm max-w-2xl">
          A short guided form. Brand-specific questions only appear when your spend
          in that category crosses ₹5,000/month, and tier questions only appear
          for the loyalty programs implied by your brand picks.
        </p>
      </header>
      <RecommendClient cards={cards} programs={programs} />
    </div>
  );
}
