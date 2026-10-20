/**
 * Theme preference: "system" (follow prefers-color-scheme), "light" or "dark".
 * Persisted in localStorage under THEME_STORAGE_KEY; every storage access is
 * wrapped because it can throw (private mode, blocked site data, sandboxed
 * iframes). With no stored value the CSS media query decides.
 */
export type ThemePref = "system" | "light" | "dark";

export const THEME_STORAGE_KEY = "cci-theme";

export function readThemePref(): ThemePref {
  try {
    const v = window.localStorage.getItem(THEME_STORAGE_KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

export function writeThemePref(pref: ThemePref): void {
  try {
    if (pref === "system") window.localStorage.removeItem(THEME_STORAGE_KEY);
    else window.localStorage.setItem(THEME_STORAGE_KEY, pref);
  } catch {
    /* storage unavailable — preference lasts for this page view only */
  }
}

/** Reflect a preference on <html data-theme>; "system" removes the attribute. */
export function applyThemePref(pref: ThemePref, root: HTMLElement = document.documentElement): void {
  if (pref === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", pref);
}

export function nextThemePref(pref: ThemePref): ThemePref {
  return pref === "system" ? "light" : pref === "light" ? "dark" : "system";
}

/**
 * Inline <head> script: applies the stored preference before first paint so a
 * manual choice never flashes the other theme. Kept dependency-free and
 * wrapped in try/catch for the same storage reasons as above.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;
