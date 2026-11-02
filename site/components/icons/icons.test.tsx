import { describe, test, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import * as icons from "./index";

const GLYPHS = Object.entries(icons).filter(([name]) => name.startsWith("Icon")) as [
  string,
  (p: Record<string, unknown>) => React.ReactElement,
][];

describe("icons barrel - Phosphor glyphs, currentColor, no emoji", () => {
  test("exports glyphs", () => {
    expect(GLYPHS.length).toBeGreaterThanOrEqual(11);
  });
  test.each(GLYPHS)("%s renders a decorative svg using currentColor", (_n, Icon) => {
    const html = renderToStaticMarkup(<Icon className="x" />);
    expect(html).toContain("<svg");
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain("role=");
    expect(html).toContain('fill="currentColor"');
    expect(html).toContain('class="x"');
    expect(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(html)).toBe(false);
  });
  test("size passes through, default is 1em", () => {
    expect(renderToStaticMarkup(<icons.IconSearch />)).toContain('width="1em"');
    const html = renderToStaticMarkup(<icons.IconSearch size={20} />);
    expect(html).toContain('width="20"');
    expect(html).toContain('height="20"');
  });
  test("weight light is accepted for large icons", () => {
    expect(renderToStaticMarkup(<icons.IconTravel weight="light" size={40} />)).toContain("<svg");
  });
  test("a label makes the icon meaningful (role=img, no aria-hidden)", () => {
    const html = renderToStaticMarkup(<icons.IconLock aria-label="Locked" />);
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Locked"');
    expect(html).not.toContain("aria-hidden");
  });
});
