import type { Metadata } from "next";
import { RecommendClient } from "./recommend-client";

export const metadata: Metadata = {
  title: "Find your card — guided questionnaire",
  description:
    "Answer 4 short steps about income, spend, brand preferences and lifestyle — get a personalised credit-card shortlist.",
};

export default function RecommendPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Find your card</h1>
        <p className="mt-1 text-slate-600 text-sm max-w-2xl">
          A short 4-step guide. Brand-specific questions only appear when your spend
          in that category crosses ₹5,000/month — so you never answer questions
          that don&apos;t apply to you.
        </p>
      </header>
      <RecommendClient />
    </div>
  );
}
