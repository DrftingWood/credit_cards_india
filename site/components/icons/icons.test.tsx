import { describe, test, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { IconArrowRight, IconTravel } from "./index";

describe("icons — inline svg, currentColor, no emoji", () => {
  test("renders an svg using currentColor", () => {
    const html = renderToStaticMarkup(<IconArrowRight className="x" />);
    expect(html).toContain("<svg");
    expect(html).toContain('stroke="currentColor"');
    expect(html).toContain('class="x"');
  });
  test("no emoji codepoints in output", () => {
    const html = renderToStaticMarkup(<IconTravel />);
    expect(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(html)).toBe(false);
  });
});
