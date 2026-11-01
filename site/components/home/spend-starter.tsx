import Link from "next/link";
import { IconArrowRight } from "@/components/icons";

const CATS = ["Dining", "Travel", "Online", "Fuel", "Groceries"];

export function SpendStarter() {
  return (
    <div className="mt-6 rounded-xl border border-line bg-surface p-4 shadow-sm max-w-2xl">
      <div className="text-[11px] font-semibold uppercase tracking-label text-fg-muted">Where does most of your money go?</div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {CATS.map((c) => (
          <span key={c} className="rounded-full border border-line bg-surface-subtle px-3 py-1.5 text-sm text-fg-secondary">{c}</span>
        ))}
        <Link href="/recommend"
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent no-underline hover:bg-accent-hover hover:text-on-accent">
          Rank my cards <IconArrowRight />
        </Link>
      </div>
    </div>
  );
}
