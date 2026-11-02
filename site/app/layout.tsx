import type { Metadata } from "next";
import Link from "next/link";
import "../styles/globals.css";
import { BetaBanner } from "@/components/beta-banner";
import { DEFAULT_OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site-config";
import { ThemeToggle } from "@/components/theme-toggle";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Credit Cards of India — open, versioned, source-linked",
    template: "%s · Credit Cards of India",
  },
  description:
    "Open dataset and comparison site for every major credit card in India. Fees, rewards, benefits, history — all source-linked.",
  applicationName: SITE_NAME,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    type: "website",
    siteName: SITE_NAME,
    locale: "en_IN",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the init script may set data-theme before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <BetaBanner />
        <header className="border-b border-line bg-surface">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
            <Link href="/" className="text-fg hover:text-fg font-semibold tracking-tight">
              Credit Cards <span className="text-accent-fg">·</span> India
            </Link>
            {/* Wrap + responsive gaps so five links never overflow a narrow
                viewport; they flow to a second line instead of clipping (C3). */}
            <div className="flex items-center gap-x-4 sm:gap-x-5">
            <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm sm:gap-x-5">
              <Link href="/browse">Browse</Link>
              <Link href="/compare">Compare</Link>
              <Link href="/calculator">Calculator</Link>
              <Link href="/booking">Booking</Link>
              <Link href="/recommend">Recommend</Link>
              <Link href="/about">About</Link>
            </nav>
            <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="border-t border-line bg-surface-subtle">
          <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-fg-muted flex flex-wrap justify-between gap-3">
            <div>
              Open dataset — MIT licensed.{" "}
              <a href="https://github.com/DrftingWood/credit_cards_india" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              .
            </div>
            <div>Data in beta. Verify with the issuer before applying.</div>
            {/* Worded to stay true before and after any affiliate link exists. */}
            <p className="w-full text-xs text-fg-muted">
              Affiliate disclosure: this site has no affiliate links today. If we add them, we may
              earn a commission when you apply through one, at no extra cost to you. Rankings and
              calculator results come from the dataset alone and do not depend on commissions.{" "}
              <Link href="/about#affiliate-disclosure">More</Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
