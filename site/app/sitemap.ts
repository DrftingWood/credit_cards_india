import type { MetadataRoute } from "next";
import { cardHref, getActiveCards } from "@/lib/data";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://credit-cards-india.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const cards = getActiveCards();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/browse`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/compare`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/recommend`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const cardRoutes: MetadataRoute.Sitemap = cards.map((c) => ({
    url: `${BASE}${cardHref(c)}`,
    lastModified: c.metadata.last_verified_on ? new Date(c.metadata.last_verified_on) : now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...cardRoutes];
}
