import { describe, expect, it } from "vitest";
import { DEFAULT_OG_IMAGE, SITE_URL, absoluteUrl, normaliseBaseUrl, pageMetadata } from "./site-config";

describe("site-config", () => {
  it("has a base URL without a trailing slash", () => {
    expect(SITE_URL).toMatch(/^https?:\/\//);
    expect(SITE_URL.endsWith("/")).toBe(false);
  });

  it("normalises trailing slashes and whitespace", () => {
    expect(normaliseBaseUrl(" https://example.in/// ")).toBe("https://example.in");
  });

  it("builds absolute URLs from site paths", () => {
    expect(absoluteUrl("/browse")).toBe(`${SITE_URL}/browse`);
    expect(absoluteUrl("about")).toBe(`${SITE_URL}/about`);
    expect(absoluteUrl("https://other.example/x")).toBe("https://other.example/x");
  });

  it("gives every page Open Graph and Twitter card tags with an image", () => {
    const m = pageMetadata({ title: "Browse", description: "d", path: "/browse" });
    expect(m.alternates?.canonical).toBe("/browse");
    expect(m.openGraph).toMatchObject({ url: "/browse", description: "d", images: [DEFAULT_OG_IMAGE] });
    expect(m.twitter).toMatchObject({ card: "summary_large_image", images: [DEFAULT_OG_IMAGE.url] });
  });
});
