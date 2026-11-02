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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 divide-y divide-line md:divide-y-0">
        {cells.map((c, i) => (
          <div
            key={i}
            className={[
              "p-4 md:border-b md:border-line",
              i % 3 !== 2 ? "md:border-r" : "",
              // Hide bottom border on the bottom row
              i >= cells.length - (cells.length % 3 === 0 ? 3 : cells.length % 3)
                ? "md:border-b-0"
                : "",
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
