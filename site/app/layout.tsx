import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "../styles/globals.css";
import { BetaBanner } from "@/components/beta-banner";
import { DEFAULT_OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site-config";
import { NavLink } from "@/components/nav-link";
import { SkipLink } from "@/components/skip-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

// Self-hosted at build time by next/font (no runtime request to Google).
// Rupee sign U+20B9 is NOT in Google's "latin" subset (it is in latin-ext),
// so both subsets are listed; unicode-range keeps each file lazy.
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

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
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <SkipLink />
        <BetaBanner />
        <header className="border-b border-line bg-surface">
          <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
            <Link href="/" className="text-fg hover:text-fg font-semibold tracking-heading">
              Credit Cards <span className="text-accent-fg">·</span> India
            </Link>
            {/* Wrap + responsive gaps so five links never overflow a narrow
                viewport; they flow to a second line instead of clipping (C3). */}
            <div className="flex items-center gap-x-4 sm:gap-x-5">
            <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm sm:gap-x-5">
              <NavLink href="/browse">Browse</NavLink>
              <NavLink href="/compare">Compare</NavLink>
              <NavLink href="/calculator">Calculator</NavLink>
              <NavLink href="/booking">Booking</NavLink>
              <NavLink href="/recommend">Recommend</NavLink>
              <NavLink href="/about">About</NavLink>
            </nav>
            <ThemeToggle />
            </div>
          </div>
        </header>
        <main id="main" tabIndex={-1} className="mx-auto max-w-page px-4 py-8 focus:outline-hidden">{children}</main>
        <footer className="border-t border-line bg-surface-subtle">
          <div className="mx-auto max-w-page px-4 py-6 text-sm text-fg-muted flex flex-wrap justify-between gap-3">
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
