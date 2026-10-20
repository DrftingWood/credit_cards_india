import type { MetadataRoute } from "next";
import { cardHref, getActiveCards } from "@/lib/data";
import { SITE_URL as BASE } from "@/lib/site-config";

// Google Search Central: <lastmod> is used only when "consistently and
// verifiably" accurate, and <priority>/<changefreq> are ignored. So no
// build-time "now" stamps and no priority/changefreq:
// - card pages: the card's last_verified_on (when its data was last checked);
// - data-driven tool pages: the newest last_verified_on across active cards;
// - prose pages (/about, /booking): no lastmod rather than a made-up one.
// https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
export default function sitemap(): MetadataRoute.Sitemap {
  const cards = getActiveCards();
  const verified = cards
    .map((c) => c.metadata.last_verified_on)
    .filter((d): d is string => typeof d === "string" && d.length > 0)
    .sort();
  const dataUpdated = verified.length ? new Date(verified[verified.length - 1]) : undefined;
  const withData = (path: string) => ({
    url: `${BASE}${path}`,
    ...(dataUpdated ? { lastModified: dataUpdated } : {}),
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    withData("/"),
    withData("/browse"),
    withData("/compare"),
    withData("/calculator"),
    withData("/recommend"),
    { url: `${BASE}/booking` },
    { url: `${BASE}/about` },
  ];

  const cardRoutes: MetadataRoute.Sitemap = cards.map((c) => ({
    url: `${BASE}${cardHref(c)}`,
    ...(c.metadata.last_verified_on ? { lastModified: new Date(c.metadata.last_verified_on) } : {}),
  }));

  return [...staticRoutes, ...cardRoutes];
}
