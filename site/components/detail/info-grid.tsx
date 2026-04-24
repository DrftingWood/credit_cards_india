import type { ReactNode } from "react";

/** Generic label / value cell used across the Rewards & Benefits and
 *  Fees & Charges summary grids on the detail page. */
export interface InfoCell {
  label: string;
  value: ReactNode;
}

export function InfoGrid({ title, cells }: { title: string; cells: InfoCell[] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <header className="border-b border-slate-200 bg-slate-50 px-5 py-3">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 divide-y divide-slate-200 md:divide-y-0">
        {cells.map((c, i) => (
          <div
            key={i}
            className={[
              "p-4 md:border-b md:border-slate-200",
              i % 3 !== 2 ? "md:border-r" : "",
              // Hide bottom border on the bottom row
              i >= cells.length - (cells.length % 3 === 0 ? 3 : cells.length % 3)
                ? "md:border-b-0"
                : "",
            ].filter(Boolean).join(" ")}
          >
            <div className="text-xs uppercase tracking-wide text-brand-600 font-medium">
              {c.label}
            </div>
            <div className="mt-1 text-sm text-slate-800">{c.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
