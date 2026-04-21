"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "cci.beta_banner_dismissed";

export function BetaBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(sessionStorage.getItem(STORAGE_KEY) !== "1");
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-sm">
      <div className="mx-auto max-w-6xl px-4 py-2 flex items-start justify-between gap-3">
        <p>
          <strong>Beta data.</strong> Numbers are community-sourced and may be out of date.
          Every value links to the issuer page — always verify before applying.
        </p>
        <button
          type="button"
          aria-label="Dismiss beta notice"
          className="shrink-0 text-amber-900/70 hover:text-amber-900"
          onClick={() => {
            try {
              sessionStorage.setItem(STORAGE_KEY, "1");
            } catch {}
            setVisible(false);
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
