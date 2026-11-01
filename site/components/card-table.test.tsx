// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { getActiveCards } from "@/lib/data";
import { CardTable } from "./card-table";

afterEach(cleanup);
const cards = getActiveCards().slice(0, 5);

describe("CardTable", () => {
  test("one body row per card", () => {
    const { container } = render(<CardTable cards={cards} />);
    expect(container.querySelectorAll("tbody tr")).toHaveLength(5);
  });
  test("column headers have scope=col, each row has a scope=row header", () => {
    const { container } = render(<CardTable cards={cards} />);
    const cols = container.querySelectorAll("thead th");
    expect(cols.length).toBe(5);
    cols.forEach((th) => expect(th.getAttribute("scope")).toBe("col"));
    expect(container.querySelectorAll('tbody th[scope="row"]')).toHaveLength(5);
  });
  test("numeric cells are right-aligned and use .num; same in the header", () => {
    const { container } = render(<CardTable cards={cards} />);
    const row = container.querySelector("tbody tr")!;
    const nums = row.querySelectorAll("td.num");
    expect(nums.length).toBe(3);
    nums.forEach((td) => expect(td.className).toContain("text-right"));
    const heads = [...container.querySelectorAll("thead th")];
    expect(heads.filter((h) => h.className.includes("text-right"))).toHaveLength(3);
  });
  test("columns share widths via a colgroup and fixed layout", () => {
    const { container } = render(<CardTable cards={cards} />);
    expect(container.querySelector("table")!.className).toContain("table-fixed");
    expect(container.querySelectorAll("colgroup col")).toHaveLength(5);
  });
  test("renders without React key warnings", () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<CardTable cards={cards} />);
    const keyWarnings = err.mock.calls.filter((c) => /same key|unique "key"/.test(String(c[0])));
    err.mockRestore();
    expect(keyWarnings).toHaveLength(0);
  });
  test("card name links to the card page", () => {
    const { container } = render(<CardTable cards={cards} />);
    expect(container.querySelector("tbody th a")!.getAttribute("href")).toMatch(/^\/card\//);
  });
  test("scroll wrapper is a named focusable region", () => {
    const { getByRole } = render(<CardTable cards={cards} />);
    const region = getByRole("region", { name: "Cards table, scrolls horizontally" });
    expect(region.getAttribute("tabindex")).toBe("0");
  });
});
