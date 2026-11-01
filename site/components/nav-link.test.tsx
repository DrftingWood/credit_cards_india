// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";

const pathname = vi.hoisted(() => ({ value: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.value }));

import { NavLink } from "./nav-link";

afterEach(cleanup);

function current(path: string): string[] {
  pathname.value = path;
  const { container } = render(
    <nav>
      <NavLink href="/browse">Browse</NavLink>
      <NavLink href="/compare">Compare</NavLink>
      <NavLink href="/">Home</NavLink>
    </nav>,
  );
  return [...container.querySelectorAll("a[aria-current]")].map((a) => a.textContent ?? "");
}

describe("NavLink", () => {
  test("marks only the exactly matching route", () => {
    expect(current("/compare")).toEqual(["Compare"]);
  });

  test("the root link is current only on the root", () => {
    expect(current("/")).toEqual(["Home"]);
    cleanup();
    expect(current("/browse")).toEqual(["Browse"]);
  });

  test("a section stays current on its sub-routes, not on lookalike prefixes", () => {
    expect(current("/browse/some-card")).toEqual(["Browse"]);
    cleanup();
    expect(current("/browser")).toEqual([]);
  });

  test("uses aria-current=page and no attribute when inactive", () => {
    pathname.value = "/browse";
    const { getByText } = render(<NavLink href="/browse">Browse</NavLink>);
    expect(getByText("Browse").getAttribute("aria-current")).toBe("page");
    cleanup();
    pathname.value = "/other";
    const r = render(<NavLink href="/browse">Browse</NavLink>);
    expect(r.getByText("Browse").hasAttribute("aria-current")).toBe(false);
  });
});
