import Link from "next/link";
import { IconCashback, IconTravel, IconDining, IconFuel, IconShopping, IconFree, IconPremium, IconForex } from "@/components/icons";

const TILES = [
  { href: "/browse?tag=cashback", Icon: IconCashback, t: "Cashback", d: "Flat, uncapped returns" },
  { href: "/browse?tag=travel", Icon: IconTravel, t: "Travel & miles", d: "Lounges, transfers, forex" },
  { href: "/browse?tag=dining", Icon: IconDining, t: "Dining", d: "Weekends & delivery" },
  { href: "/browse?tag=fuel", Icon: IconFuel, t: "Fuel", d: "Surcharge waivers" },
  { href: "/browse?tag=online", Icon: IconShopping, t: "Online shopping", d: "Amazon, Flipkart, co-brands" },
  { href: "/browse?ltf=1", Icon: IconFree, t: "Lifetime free", d: "No annual fee, ever" },
  { href: "/browse?tag=premium", Icon: IconPremium, t: "Premium", d: "Super-premium & invite-only" },
  { href: "/browse?tag=forex", Icon: IconForex, t: "Low forex", d: "For spends abroad" },
];

export function CategoryTiles() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {TILES.map(({ href, Icon, t, d }) => (
        <Link key={href} href={href as never}
          className="group rounded-xl border border-line bg-surface p-4 no-underline transition-colors hover:border-accent/50">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent-subtle text-accent-fg"><Icon /></span>
          <div className="mt-2.5 text-sm font-semibold text-fg">{t}</div>
          <div className="text-xs text-fg-muted">{d}</div>
        </Link>
      ))}
    </div>
  );
}
