import { describe, expect, test } from "vitest";
import { browseCanonical, browseHref, sameParams, paginate, parsePage } from "./paginate";

const items = (n: number) => Array.from({ length: n }, (_, i) => i);

describe("paginate", () => {
  test("368 items give 16 pages at 24", () => {
    const r = paginate(items(368), 1);
    expect(r.pageCount).toBe(16);
    expect(r.total).toBe(368);
    expect(r.items).toHaveLength(24);
    expect(paginate(items(368), 16).items).toHaveLength(368 - 15 * 24);
  });
  test("page 2 slices the right window", () => {
    expect(paginate(items(60), 2).items[0]).toBe(24);
  });
  test("exactly 24 items is one page; 25 is two", () => {
    expect(paginate(items(24), 1).pageCount).toBe(1);
    const r = paginate(items(25), 2);
    expect(r.pageCount).toBe(2);
    expect(r.items).toEqual([24]);
  });
  test("0, NaN and negatives become 1; 999 becomes the last page; 2.7 floors to 2", () => {
    expect(paginate(items(100), 0).page).toBe(1);
    expect(paginate(items(100), NaN).page).toBe(1);
    expect(paginate(items(100), -3).page).toBe(1);
    expect(paginate(items(100), 999).page).toBe(5);
    expect(paginate(items(100), 2.7).page).toBe(2);
    expect(paginate(items(100), Infinity).page).toBe(5);
  });
  test("empty list: one page, page 1, no items", () => {
    expect(paginate([], 5)).toEqual({ items: [], page: 1, pageCount: 1, total: 0 });
  });
  test("custom size", () => {
    expect(paginate(items(10), 2, 4).items).toEqual([4, 5, 6, 7]);
  });
});

describe("parsePage", () => {
  test.each([
    [undefined, 1],
    ["", 1],
    ["abc", 1],
    ["0", 1],
    ["-3", 1],
    ["2.7", 2],
    ["3", 3],
    ["999", 999],
    [["4", "5"], 4],
  ])("%j -> %i", (raw, want) => {
    expect(parsePage(raw as string | string[] | undefined)).toBe(want);
  });
});

describe("browseHref", () => {
  test("page 1 omits page; other params preserved", () => {
    const f = new URLSearchParams("issuer=hdfc&network=visa");
    expect(browseHref(f, 1, "cards")).toBe("/browse?issuer=hdfc&network=visa");
    expect(browseHref(f, 3, "cards")).toBe("/browse?issuer=hdfc&network=visa&page=3");
  });
  test("view only appears for table; bare path when empty", () => {
    expect(browseHref(new URLSearchParams(), 1, "cards")).toBe("/browse");
    expect(browseHref(new URLSearchParams(), 2, "table")).toBe("/browse?view=table&page=2");
  });
});

describe("browseCanonical", () => {
  test("page 1, missing, junk and view=table canonicalise to /browse", () => {
    expect(browseCanonical({}, 368)).toBe("/browse");
    expect(browseCanonical({ page: "abc" }, 368)).toBe("/browse");
    expect(browseCanonical({ page: "0" }, 368)).toBe("/browse");
    expect(browseCanonical({ view: "table" }, 368)).toBe("/browse");
  });
  test("page N is self-referencing, clamped to the last page", () => {
    expect(browseCanonical({ page: "2" }, 368)).toBe("/browse?page=2");
    expect(browseCanonical({ page: "2.7" }, 368)).toBe("/browse?page=2");
    expect(browseCanonical({ page: "999" }, 368)).toBe("/browse?page=16");
  });
  test("table view canonicalises to /browse even with a page", () => {
    expect(browseCanonical({ view: "table", page: "2" }, 368)).toBe("/browse");
  });
  test("filtered views keep the existing /browse canonical", () => {
    expect(browseCanonical({ page: "2", issuer: "hdfc" }, 368)).toBe("/browse");
  });
});

describe("sameParams", () => {
  test("ignores order, not content", () => {
    const q = (s: string) => new URLSearchParams(s);
    expect(sameParams(q("a=1&b=2"), q("b=2&a=1"))).toBe(true);
    expect(sameParams(q("a=1"), q("a=2"))).toBe(false);
    expect(sameParams(q("a=1"), q("a=1&b=2"))).toBe(false);
  });
});
