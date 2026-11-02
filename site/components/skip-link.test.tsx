// @vitest-environment jsdom
import { afterEach, describe, expect, test } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { SkipLink } from "./skip-link";

afterEach(cleanup);

describe("SkipLink", () => {
  test("links to #main with the expected text", () => {
    const { getByRole } = render(<SkipLink />);
    const link = getByRole("link", { name: "Skip to main content" });
    expect(link.getAttribute("href")).toBe("#main");
  });

  test("is the first focusable element when rendered before the page chrome", () => {
    const { container } = render(
      <>
        <SkipLink />
        <header>
          <a href="#top">Home</a>
          <button type="button">Theme</button>
        </header>
      </>,
    );
    const first = container.querySelector<HTMLElement>("a[href], button, [tabindex]");
    expect(first?.textContent).toBe("Skip to main content");
  });
});
