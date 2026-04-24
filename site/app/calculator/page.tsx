import type { Metadata } from "next";
import { getActiveCards } from "@/lib/data";
import { CalculatorClient } from "./calculator-client";

export const metadata: Metadata = {
  title: "Reward calculator — find the best card for your spend",
  description:
    "Enter your monthly spend across online, groceries, dining, fuel, travel, utilities, rent and international — see Indian credit cards ranked by net annual value.",
};

export default function CalculatorPage() {
  const cards = getActiveCards();
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Reward calculator</h1>
        <p className="mt-1 text-slate-600 text-sm max-w-2xl">
          Approximate ranking of Indian credit cards based on your monthly spend. Computation ignores welcome
          bonuses, milestone vouchers and some complex caps — read the card detail page for the full picture
          before applying.
        </p>
      </header>
      <CalculatorClient cards={cards} />
    </div>
  );
}
