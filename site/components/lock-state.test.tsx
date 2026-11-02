import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { LockState } from "./lock-state";

describe("LockState", () => {
  test("locked exposes 'Locked' to assistive tech and hides the icon", () => {
    const html = renderToStaticMarkup(<LockState unlocked={false} />);
    expect(html).toContain('<span class="sr-only">Locked</span>');
    expect(html).toContain("aria-hidden");
  });
  test("unlocked exposes 'Unlocked'", () => {
    const html = renderToStaticMarkup(<LockState unlocked />);
    expect(html).toContain('<span class="sr-only">Unlocked</span>');
    expect(html).not.toContain(">Locked<");
  });
});
