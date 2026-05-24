import type { Metadata } from "next";
import Link from "next/link";
import "../styles/globals.css";
import { BetaBanner } from "@/components/beta-banner";

export const metadata: Metadata = {
  title: {
    default: "Credit Cards of India — open, versioned, source-linked",
    template: "%s · Credit Cards of India",
  },
  description:
    "Open dataset and comparison site for every major credit card in India. Fees, rewards, benefits, history — all source-linked.",
  openGraph: {
    title: "Credit Cards of India",
    description:
      "Open dataset and comparison site for Indian credit cards. Fees, rewards, benefits, history — all source-linked.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <BetaBanner />
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-slate-900 hover:text-slate-900 font-semibold tracking-tight">
              Credit Cards <span className="text-brand-600">·</span> India
            </Link>
            <nav className="flex gap-5 text-sm">
              <Link href="/browse">Browse</Link>
              <Link href="/compare">Compare</Link>
              <Link href="/calculator">Calculator</Link>
              <Link href="/recommend">Recommend</Link>
              <Link href="/about">About</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-600 flex flex-wrap justify-between gap-3">
            <div>
              Open dataset — MIT licensed.{" "}
              <a href="https://github.com/DrftingWood/credit_cards_india" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              .
            </div>
            <div>Data in beta. Verify with the issuer before applying.</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
