import type { Metadata } from "next";

/**
 * The one place the site's public base URL is configured.
 *
 * Set NEXT_PUBLIC_SITE_URL (e.g. in Vercel project env) when a custom domain is
 * attached; until then the vercel.app URL is the fallback. Everything that needs
 * an absolute URL — metadataBase, canonical links, Open Graph URLs, robots.txt,
 * sitemap.xml — reads SITE_URL from here, so a domain move is a one-value change.
 */
export const SITE_URL = normaliseBaseUrl(
  process.env.NEXT_PUBLIC_SITE_URL || "https://credit-cards-india.vercel.app",
);

export const SITE_NAME = "Credit Cards of India";

export const SITE_DESCRIPTION =
  "Open dataset and comparison site for Indian credit cards. Fees, rewards, benefits, history — all source-linked.";

/** Default share image (1200×630), rendered at build time by app/og.png/route.tsx. */
export const DEFAULT_OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Credit Cards of India — open, source-linked comparison of Indian credit cards",
};

export function normaliseBaseUrl(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

/** Absolute URL for a site path ("/browse" -> "https://…/browse"). */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Metadata for a top-level page: title, description, canonical, and Open Graph /
 * Twitter card tags so a shared link previews with the page's own title and the
 * default share image. (A page-level `openGraph` replaces the layout's object
 * wholesale, so every field the preview needs is set here.)
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title?: string;
  description: string;
  path: string;
}): Metadata {
  const shareTitle = title ? `${title} · ${SITE_NAME}` : SITE_NAME;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      title: shareTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "en_IN",
      type: "website",
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [DEFAULT_OG_IMAGE.url],
    },
  };
}
