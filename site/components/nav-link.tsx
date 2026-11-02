"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Header nav link that sets aria-current="page" on the active route only.
 * "/" matches exactly (otherwise it would be current everywhere); any other
 * href is current on itself and on its sub-routes ("/browse" for
 * "/browse/x"), matched on a path-segment boundary so "/browser" does not count.
 */
export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link href={href} aria-current={active ? "page" : undefined}>
      {children}
    </Link>
  );
}
