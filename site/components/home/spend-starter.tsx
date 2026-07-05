import Link from "next/link";
import { IconArrowRight } from "@/components/icons";

const CATS = ["Dining", "Travel", "Online", "Fuel", "Groceries"];

export function SpendStarter() {
  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm max-w-2xl">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Where does most of your money go?</div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {CATS.map((c) => (
          <span key={c} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700">{c}</span>
        ))}
        <Link href="/recommend"
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white no-underline hover:bg-brand-700 hover:text-white">
          Rank my cards <IconArrowRight />
        </Link>
      </div>
    </div>
  );
}
