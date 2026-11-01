"use client";

import { useEffect, useState } from "react";
import { IconThemeDark, IconThemeLight, IconThemeSystem } from "@/components/icons";
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
  if (pref === "light") return <IconThemeLight size={16} />;
  if (pref === "dark") return <IconThemeDark size={16} />;
  return <IconThemeSystem size={16} />;
}
