export const PAGE_SIZE = 24;

export interface Paged<T> {
  items: T[];
  page: number;
  pageCount: number;
  total: number;
}

/** Slice one page. `page` is clamped into [1, pageCount]; NaN, 0 and negatives become 1, fractions floor. */
export function paginate<T>(items: T[], page: number, size: number = PAGE_SIZE): Paged<T> {
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / size));
  const whole = Number.isFinite(page) ? Math.floor(page) : page === Infinity ? pageCount : 1;
  const clamped = Math.min(pageCount, Math.max(1, Number.isNaN(whole) ? 1 : whole));
  const start = (clamped - 1) * size;
  return { items: items.slice(start, start + size), page: clamped, pageCount, total };
}

/** Parse a `page` query value. Missing or non-numeric is 1; fractions floor. Range clamping is paginate's job. */
export function parsePage(raw: string | string[] | undefined): number {
  const v = Array.isArray(raw) ? raw[0] : raw;
  const n = Math.floor(Number(v));
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

export type BrowseView = "cards" | "table";

/** Build a /browse URL from the filter params plus view and page. `page` is omitted on page 1, `view` unless table. */
export function browseHref(filters: URLSearchParams, page: number, view: BrowseView): string {
  const p = new URLSearchParams(filters);
  p.delete("page");
  p.delete("view");
  if (view === "table") p.set("view", "table");
  if (page > 1) p.set("page", String(page));
  const q = p.toString();
  return q ? `/browse?${q}` : "/browse";
}

/**
 * Canonical path for /browse. Page N of the unfiltered list is its own canonical (?page=N) so page 2+ can
 * be indexed; page 1, filtered views and the table view canonicalise to /browse as before.
 */
export function browseCanonical(
  query: Record<string, string | string[] | undefined>,
  total: number,
): string {
  const filtered = Object.entries(query).some(
    ([k, v]) => k !== "page" && k !== "view" && (Array.isArray(v) ? v.length > 0 : !!v),
  );
  if (filtered) return "/browse";
  const { page } = paginate(new Array<null>(total), parsePage(query.page));
  return page > 1 ? `/browse?page=${page}` : "/browse";
}
