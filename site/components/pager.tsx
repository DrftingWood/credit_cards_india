import Link from "next/link";
import { cn } from "@/lib/utils";
import { IconCaretLeft, IconCaretRight } from "./icons";

/** Page numbers to show: first, last, and the current page with one neighbour each side; a single missing page is shown rather than elided. */
function windowOf(page: number, pageCount: number): (number | "gap")[] {
  const keep = new Set([1, pageCount, page - 1, page, page + 1]);
  const nums = [...keep].filter((n) => n >= 1 && n <= pageCount).sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  nums.forEach((n, i) => {
    const prev = nums[i - 1];
    if (prev !== undefined && n - prev === 2) out.push(prev + 1);
    else if (prev !== undefined && n - prev > 2) out.push("gap");
    out.push(n);
  });
  return out;
}

const CELL =
  "hit-dense inline-flex items-center justify-center gap-1 rounded-md px-2 text-sm num no-underline";

/** Previous / Next: a link when there is somewhere to go, otherwise disabled text (not a link). */
function Step({ label, href }: { label: "Previous" | "Next"; href: string | null }) {
  const prev = label === "Previous";
  const content = (
    <>
      {prev ? <IconCaretLeft /> : null}
      {label}
      {prev ? null : <IconCaretRight />}
    </>
  );
  return href ? (
    <Link href={href as never} className={cn(CELL, "border border-line text-accent-fg hover:bg-surface-muted")}>
      {content}
    </Link>
  ) : (
    <span aria-disabled="true" className={cn(CELL, "border border-line text-fg-disabled")}>
      {content}
    </span>
  );
}

export function Pager({
  page,
  pageCount,
  hrefFor,
}: {
  page: number;
  pageCount: number;
  hrefFor: (page: number) => string;
}) {
  if (pageCount <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-6">
      <ul className="flex flex-wrap items-center justify-center gap-1">
        <li><Step label="Previous" href={page > 1 ? hrefFor(page - 1) : null} /></li>
        {windowOf(page, pageCount).map((n, i) =>
          n === "gap" ? (
            <li key={`gap-${i}`} aria-hidden="true" className="px-1 text-fg-muted">
              …
            </li>
          ) : (
            <li key={n}>
              {n === page ? (
                <span aria-current="page" className={cn(CELL, "bg-accent text-on-accent font-semibold")}>
                  {n}
                </span>
              ) : (
                <Link
                  href={hrefFor(n) as never}
                  aria-label={`Page ${n}`}
                  className={cn(CELL, "text-accent-fg hover:bg-surface-muted")}
                >
                  {n}
                </Link>
              )}
            </li>
          ),
        )}
        <li><Step label="Next" href={page < pageCount ? hrefFor(page + 1) : null} /></li>
      </ul>
    </nav>
  );
}
