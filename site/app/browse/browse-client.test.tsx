// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { getActiveCards, getAllIssuers } from "@/lib/data";

const replace = vi.fn();
let search = "";
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(search),
  usePathname: () => "/browse",
}));

import { BrowseClient } from "./browse-client";

const cards = getActiveCards();
const issuers = getAllIssuers();
const mount = (q: string) => {
  search = q;
  return render(<BrowseClient cards={cards} issuers={issuers} />);
};

beforeEach(() => replace.mockClear());
afterEach(cleanup);

describe("BrowseClient URL state", () => {
  test("a deep link does not rewrite the URL on mount (page and view survive)", () => {
    mount("view=table&page=3");
    expect(replace).not.toHaveBeenCalled();
  });

  test("reordered params keep page=3 (no mount-time replace)", () => {
    // stateToParams emits issuer before network; the hand-written URL has them swapped.
    mount("network=visa&issuer=hdfc&page=3");
    expect(replace).not.toHaveBeenCalled();
  });

  test("changing a filter resets to page 1 (no page param) and keeps view", () => {
    const { getByLabelText } = mount("view=table&page=3");
    fireEvent.click(getByLabelText("Lifetime free"));
    expect(replace).toHaveBeenCalledTimes(1);
    const url = replace.mock.calls[0][0] as string;
    expect(url).toBe("/browse?ltf=1&view=table");
    expect(url).not.toContain("page");
  });

  test("Reset filters drops page, keeps view", () => {
    const { getByText } = mount("ltf=1&view=table&page=2");
    fireEvent.click(getByText("Reset filters"));
    expect(replace.mock.calls[0][0]).toBe("/browse?view=table");
  });

  test("view toggle reflects the URL with aria-pressed", () => {
    const a = mount("");
    expect(a.getByRole("button", { name: "Cards" }).getAttribute("aria-pressed")).toBe("true");
    expect(a.getByRole("button", { name: "Table" }).getAttribute("aria-pressed")).toBe("false");
    cleanup();
    const b = mount("view=table");
    expect(b.getByRole("button", { name: "Table" }).getAttribute("aria-pressed")).toBe("true");
    expect(b.getByRole("button", { name: "Cards" }).getAttribute("aria-pressed")).toBe("false");
  });

  test("toggle switches view=table on and off, preserving filters and page", () => {
    const a = mount("ltf=1&page=2");
    fireEvent.click(a.getByRole("button", { name: "Table" }));
    expect(replace.mock.calls[0][0]).toBe("/browse?ltf=1&view=table&page=2");
    cleanup();
    const b = mount("ltf=1&view=table&page=2");
    fireEvent.click(b.getByRole("button", { name: "Cards" }));
    expect(replace.mock.calls[1][0]).toBe("/browse?ltf=1&page=2");
  });
});
