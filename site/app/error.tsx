"use client";

import { useEffect } from "react";

/**
 * Runtime render-error boundary only. It does NOT mask build-time data
 * validation failures (scripts/prebuild.mjs, schema checks): those still fail
 * the build before any page exists. Shows fixed copy, never the message or stack.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-xl border border-line bg-surface p-8 text-center">
      <h1 className="text-xl font-semibold text-fg">Something went wrong</h1>
      <p className="mt-2 text-fg-muted">This page did not load. Try again, or go back to the home page.</p>
      <button type="button" onClick={() => reset()} className="mt-4 rounded-md border border-line px-3 py-2 text-sm text-fg">
        Try again
      </button>
    </div>
  );
}
