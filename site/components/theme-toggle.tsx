"use client";

import { useEffect, useState } from "react";
import {
  applyThemePref,
  nextThemePref,
  readThemePref,
  writeThemePref,
  type ThemePref,
} from "@/lib/theme";

const LABEL: Record<ThemePref, string> = {
  system: "Theme: system",
  light: "Theme: light",
  dark: "Theme: dark",
};

/** Cycles system → light → dark. The choice persists in localStorage. */
export function ThemeToggle() {
  // null until mounted: the server can't know the stored preference.
  const [pref, setPref] = useState<ThemePref | null>(null);

  useEffect(() => {
    setPref(readThemePref());
  }, []);

  const current = pref ?? "system";
  const onClick = () => {
    const next = nextThemePref(current);
    writeThemePref(next);
    applyThemePref(next);
    setPref(next);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${LABEL[current]}. Switch to ${nextThemePref(current)}.`}
      title={LABEL[current]}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-line text-fg-muted hover:border-line-strong hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-focus"
    >
      <ThemeIcon pref={current} />
    </button>
  );
}

function ThemeIcon({ pref }: { pref: ThemePref }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (pref === "light") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    );
  }
  if (pref === "dark") {
    return (
      <svg {...common}>
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}
