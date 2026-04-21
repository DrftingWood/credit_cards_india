import type { MetadataRoute } from "next";
import { getActiveCards } from "@/lib/data";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://credit-cards-india.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const cards = getActiveCards();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/browse`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const cardRoutes: MetadataRoute.Sitemap = cards.map((c) => {
    const slug = c.id.startsWith(`${c.issuer}-`) ? c.id.slice(c.issuer.length + 1) : c.id;
    return {
      url: `${BASE}/card/${c.issuer}/${slug}`,
      lastModified: c.metadata.last_verified_on ? new Date(c.metadata.last_verified_on) : now,
      changeFrequency: "monthly",
      priority: 0.7,
    };
  });

  return [...staticRoutes, ...cardRoutes];
}
