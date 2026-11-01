import path from "node:path";

// lib/data.ts imports ../../dist/*.json, which prebuild writes at the repo root,
// one level above this app. Turbopack (the Next 16 default for dev and build)
// refuses imports outside its root, which defaults to the app directory, so the
// root is the repo root. outputFileTracingRoot is kept equal, as the Next docs ask.
// https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory
const repoRoot = path.join(import.meta.dirname, "..");

// D-32: /browse renders per request (D-28), so its CDN lifetime is set here.
// Card data only changes on deploy (dist/ is built at deploy) and the Vercel CDN
// cache key includes the deployment URL, so a new deploy starts with an empty
// cache; one hour fresh is therefore safe, with a day of stale-while-revalidate.
// https://vercel.com/docs/caching/cache-control-headers (read 2026-11-01)
const BROWSE_CDN_CACHE = "public, s-maxage=3600, stale-while-revalidate=86400";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: { root: repoRoot },
  outputFileTracingRoot: repoRoot,
  async headers() {
    return [
      {
        source: "/browse",
        headers: [
          // Top priority on Vercel and stripped before the browser; the CDN key includes the query string.
          { key: "Vercel-CDN-Cache-Control", value: BROWSE_CDN_CACHE },
          // Browsers always revalidate with the CDN.
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
