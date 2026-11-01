"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "cci.beta_banner_dismissed";

export function BetaBanner() {
  // Initial render shows the banner — matches SSR exactly, so no hydration
  // mismatch and no CLS for the (majority) case of users who haven't dismissed.
  // Effect then checks localStorage and hides if previously dismissed.
  // localStorage (was sessionStorage) so the dismissal persists across tabs
  // and visits — the previous behaviour annoyed users with the banner every
  // time they opened a new tab.
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") setDismissed(true);
    } catch {
      // localStorage blocked (private mode / embed) — accept showing the banner.
    }
  }, []);

  if (dismissed) return null;

  return (
    <div className="bg-warn-subtle border-b border-warn-line text-warn text-sm">
      <div className="mx-auto max-w-page px-4 py-2 flex items-start justify-between gap-3">
        <p>
          <strong>Beta data.</strong> Numbers are community-sourced and may be out of date.
          Every value links to the issuer page — always verify before applying.
        </p>
        <button
          type="button"
          aria-label="Dismiss beta notice"
          className="shrink-0 text-warn hover:text-fg"
          onClick={() => {
            try {
              localStorage.setItem(STORAGE_KEY, "1");
            } catch {}
            setDismissed(true);
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
