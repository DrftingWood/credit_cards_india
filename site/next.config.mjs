import path from "node:path";

// lib/data.ts imports ../../dist/*.json, which prebuild writes at the repo root,
// one level above this app. Turbopack (the Next 16 default for dev and build)
// refuses imports outside its root, which defaults to the app directory, so the
// root is the repo root. outputFileTracingRoot is kept equal, as the Next docs ask.
// https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory
const repoRoot = path.join(import.meta.dirname, "..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: { root: repoRoot },
  outputFileTracingRoot: repoRoot,
};

export default nextConfig;
