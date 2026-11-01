// @vitest-environment jsdom
import { afterEach, describe, expect, test } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { Pager } from "./pager";

afterEach(cleanup);
const hrefFor = (p: number) => (p === 1 ? "/browse?tag=x" : `/browse?tag=x&page=${p}`);
const labels = (c: HTMLElement) => [...c.querySelectorAll("li")].map((li) => li.textContent?.trim());

describe("Pager", () => {
  test("is a named nav landmark", () => {
    const { getByRole } = render(<Pager page={1} pageCount={3} hrefFor={hrefFor} />);
    expect(getByRole("navigation", { name: "Pagination" })).toBeTruthy();
  });
  test("windows with ellipses", () => {
    const { container } = render(<Pager page={5} pageCount={16} hrefFor={hrefFor} />);
    expect(labels(container)).toEqual(["Previous", "1", "…", "4", "5", "6", "…", "16", "Next"]);
  });
  test("near the start and end, one ellipsis", () => {
    const a = render(<Pager page={1} pageCount={16} hrefFor={hrefFor} />);
    expect(labels(a.container)).toEqual(["Previous", "1", "2", "…", "16", "Next"]);
    cleanup();
    const b = render(<Pager page={16} pageCount={16} hrefFor={hrefFor} />);
    expect(labels(b.container)).toEqual(["Previous", "1", "…", "15", "16", "Next"]);
  });
  test("small counts list every page", () => {
    const { container } = render(<Pager page={2} pageCount={3} hrefFor={hrefFor} />);
    expect(labels(container)).toEqual(["Previous", "1", "2", "3", "Next"]);
  });
  test("current page has aria-current", () => {
    const { container } = render(<Pager page={5} pageCount={16} hrefFor={hrefFor} />);
    const cur = container.querySelectorAll('[aria-current="page"]');
    expect(cur).toHaveLength(1);
    expect(cur[0].textContent).toBe("5");
  });
  test("Previous is disabled text on page 1, Next on the last page", () => {
    const a = render(<Pager page={1} pageCount={3} hrefFor={hrefFor} />);
    const prev = a.getByText("Previous").closest("[aria-disabled]");
    expect(prev?.getAttribute("aria-disabled")).toBe("true");
    expect(prev?.tagName).not.toBe("A");
    expect(a.getByText("Next").closest("a")).not.toBeNull();
    cleanup();
    const b = render(<Pager page={3} pageCount={3} hrefFor={hrefFor} />);
    expect(b.getByText("Next").closest("[aria-disabled]")?.tagName).not.toBe("A");
    expect(b.getByText("Previous").closest("a")).not.toBeNull();
  });
  test("hrefs preserve other params and omit page=1", () => {
    const { getByText } = render(<Pager page={2} pageCount={3} hrefFor={hrefFor} />);
    expect(getByText("1").closest("a")?.getAttribute("href")).toBe("/browse?tag=x");
    expect(getByText("3").closest("a")?.getAttribute("href")).toBe("/browse?tag=x&page=3");
    expect(getByText("Previous").closest("a")?.getAttribute("href")).toBe("/browse?tag=x");
    expect(getByText("Next").closest("a")?.getAttribute("href")).toBe("/browse?tag=x&page=3");
  });
  test("renders nothing for a single page", () => {
    const { container } = render(<Pager page={1} pageCount={1} hrefFor={hrefFor} />);
    expect(container.innerHTML).toBe("");
  });
});
