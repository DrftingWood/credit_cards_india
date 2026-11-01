import type { ReactNode } from "react";

/** Generic label / value cell used across the Rewards & Benefits and
 *  Fees & Charges summary grids on the detail page. */
export interface InfoCell {
  label: string;
  value: ReactNode;
}

export function InfoGrid({ title, cells }: { title: string; cells: InfoCell[] }) {
  return (
    <section className="rounded-xl border border-line bg-surface">
      <header className="border-b border-line bg-surface-subtle px-5 py-3">
        <h2 className="text-sm font-semibold text-fg">{title}</h2>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {cells.map((c, i) => (
          <div
            key={i}
            className={[
              "p-4 border-line",
              // Separators, written out cell by cell (they used to come from
              // divide-y + md:divide-y-0, whose selectors Tailwind 4 changed).
              // Below md every cell after the first has a top rule. From md
              // only the first cell has a bottom rule (and only when it is not
              // in the last row), plus a right rule on columns 1 and 2. This
              // reproduces the old rendering pixel for pixel.
              i === 0 ? (cells.length > 3 ? "md:border-b" : "") : "border-t md:border-t-0",
              i % 3 !== 2 ? "md:border-r" : "",
            ].filter(Boolean).join(" ")}
          >
            <div className="text-xs uppercase tracking-label text-accent-fg font-medium">
              {c.label}
            </div>
            <div className="mt-1 text-sm text-fg">{c.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
