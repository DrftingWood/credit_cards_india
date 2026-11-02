/**
 * First focusable element on every page (WCAG 2.4.1). Visually hidden until
 * focused, then pinned top-left with absolute positioning so it never shifts
 * the layout. Targets the `id="main"` landmark in app/layout.tsx.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:border focus:border-line focus:bg-surface focus:px-3 focus:py-2 focus:text-sm focus:text-fg focus:outline focus:outline-2 focus:outline-offset-2"
    >
      Skip to main content
    </a>
  );
}
