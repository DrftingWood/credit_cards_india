import { afterEach, describe, expect, test, vi } from "vitest";
import {
  applyThemePref,
  nextThemePref,
  readThemePref,
  THEME_INIT_SCRIPT,
  THEME_STORAGE_KEY,
  writeThemePref,
} from "./theme";

function fakeStorage(throws = false) {
  const m = new Map<string, string>();
  const boom = () => {
    throw new Error("SecurityError");
  };
  return {
    getItem: throws ? boom : (k: string) => m.get(k) ?? null,
    setItem: throws ? boom : (k: string, v: string) => void m.set(k, v),
    removeItem: throws ? boom : (k: string) => void m.delete(k),
  };
}

afterEach(() => vi.unstubAllGlobals());

describe("theme preference", () => {
  test("round-trips light/dark and clears on system", () => {
    vi.stubGlobal("window", { localStorage: fakeStorage() });
    expect(readThemePref()).toBe("system");
    writeThemePref("dark");
    expect(readThemePref()).toBe("dark");
    writeThemePref("system");
    expect(readThemePref()).toBe("system");
  });

  test("ignores junk values", () => {
    const s = fakeStorage();
    s.setItem(THEME_STORAGE_KEY, "purple");
    vi.stubGlobal("window", { localStorage: s });
    expect(readThemePref()).toBe("system");
  });

  test("never throws when storage is blocked", () => {
    vi.stubGlobal("window", { localStorage: fakeStorage(true) });
    expect(readThemePref()).toBe("system");
    expect(() => writeThemePref("dark")).not.toThrow();
  });

  test("cycles system → light → dark → system", () => {
    expect(nextThemePref("system")).toBe("light");
    expect(nextThemePref("light")).toBe("dark");
    expect(nextThemePref("dark")).toBe("system");
  });

  test("applyThemePref sets / removes data-theme", () => {
    const attrs = new Map<string, string>();
    const root = {
      setAttribute: (k: string, v: string) => void attrs.set(k, v),
      removeAttribute: (k: string) => void attrs.delete(k),
    } as unknown as HTMLElement;
    applyThemePref("dark", root);
    expect(attrs.get("data-theme")).toBe("dark");
    applyThemePref("system", root);
    expect(attrs.has("data-theme")).toBe(false);
  });

  test("init script is guarded by try/catch and uses the storage key", () => {
    expect(THEME_INIT_SCRIPT).toContain("try{");
    expect(THEME_INIT_SCRIPT).toContain("catch(e)");
    expect(THEME_INIT_SCRIPT).toContain(THEME_STORAGE_KEY);
  });
});
