import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingClient } from "./booking-client";

export const metadata: Metadata = {
  title: "How should I actually book this? — cheapest net cost by channel",
  description:
    "For a single flight or hotel, compare booking channels (bank portals, aggregators, direct) by net cost after the channel's price markup AND the reward your card earns there. The highest reward doesn't always win.",
};

export default function BookingPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">How should I actually book this?</h1>
        <p className="mt-1 text-slate-600 text-sm max-w-2xl">
          Find the cheapest way to pay for one purchase — after the booking channel&apos;s price difference{" "}
          <em>and</em> the reward your card earns there. The highest reward doesn&apos;t always win: a bank
          portal&apos;s markup and blocked coupons can outweigh a fat accelerator. Markups are research-based
          estimates (dynamic pricing varies daily) — paste a real quote to firm any of them up. This is separate
          from the{" "}
          <a className="text-brand-700 hover:underline" href="/calculator">
            reward calculator
          </a>
          ; it reads card reward rates, it doesn&apos;t change them.
        </p>
      </header>
      <Suspense fallback={<div className="text-slate-500 text-sm">Loading…</div>}>
        <BookingClient />
      </Suspense>
    </div>
  );
}
