import type { Metadata } from "next";

/**
 * Canonical site origin, used for metadataBase, the sitemap and robots.txt.
 * NEXT_PUBLIC_SITE_URL wins; on Vercel the production domain is the
 * fallback. Normalised once here so a value with a trailing slash or no
 * scheme can't produce "//browse" URLs or make `new URL()` throw at build.
 */
function normalise(raw: string | undefined): string | null {
  const v = raw?.trim();
  if (!v) return null;
  const withScheme = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    return new URL(withScheme).origin;
  } catch {
    return null;
  }
}

export const SITE_URL =
  normalise(process.env.NEXT_PUBLIC_SITE_URL) ??
  normalise(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
  "https://credit-cards-india.vercel.app";

export const SITE_NAME = "Credit Cards of India";

/**
 * Title + description for a page, mirrored into Open Graph and Twitter. A
 * page that sets only title/description inherits the layout's openGraph,
 * so every share preview would otherwise read "Credit Cards of India".
 */
export function pageMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: { title, description, siteName: SITE_NAME, type: "website" },
    twitter: { card: "summary", title, description },
  };
}
