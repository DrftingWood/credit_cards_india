import { describe, expect, test } from "vitest";
import nextConfig from "../next.config.mjs";

// D-32: only /browse gets CDN cache headers. Vercel's CDN cache key includes the
// query string, so each ?page=N / filter URL is cached separately.
describe("next.config headers()", () => {
  test("/browse sets Vercel-CDN-Cache-Control and a revalidating browser Cache-Control", async () => {
    const rules = await nextConfig.headers();
    const rule = rules.find((r) => r.source === "/browse");
    expect(rule).toBeDefined();
    const h = Object.fromEntries(rule.headers.map((x) => [x.key, x.value]));
    expect(h["Vercel-CDN-Cache-Control"]).toBe("public, s-maxage=3600, stale-while-revalidate=86400");
    expect(h["Cache-Control"]).toBe("public, max-age=0, must-revalidate");
  });

  test("no other route gets cache headers", async () => {
    const rules = await nextConfig.headers();
    expect(rules).toHaveLength(1);
    expect(rules[0].source).toBe("/browse");
  });
});
