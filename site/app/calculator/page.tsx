import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site-config";
import { Suspense } from "react";
import { getActiveCards, getAllLoyaltyPrograms } from "@/lib/data";
import { CalculatorClient } from "./calculator-client";

export const metadata: Metadata = pageMetadata({
  title: "Reward calculator — find the best card for your spend",
  description:
    "Enter your monthly spend across online, groceries, dining, fuel, travel, utilities, rent and international — see Indian credit cards ranked by net annual value.",
  path: "/calculator",
});

export default function CalculatorPage() {
  const cards = getActiveCards();
  // Only tiered programmes can change a value (the user's declared tier); keep the payload small.
  const tieredPrograms = getAllLoyaltyPrograms().filter((p) => (p.earn?.tiers?.length ?? 0) > 0);
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Reward calculator</h1>
        <p className="mt-1 text-slate-600 text-sm max-w-2xl">
          Approximate ranking of Indian credit cards based on your monthly spend. Computation ignores welcome
          bonuses, milestone vouchers and some complex caps — read the card detail page for the full picture
          before applying. Channel-locked accelerators (e.g. SmartBuy, Travel EDGE, IndiGo direct) are credited
          at their headline rate — i.e. assuming you book through that channel. For a more realistic estimate
          that accounts for your actual booking habits, use{" "}
          <a className="text-brand-700 hover:underline" href="/recommend">
            /recommend
          </a>
          .
        </p>
      </header>
      <Suspense fallback={<div className="text-slate-500 text-sm">Loading…</div>}>
        <CalculatorClient cards={cards} programs={tieredPrograms} />
      </Suspense>
    </div>
  );
}
