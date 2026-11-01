/** Static (no animation) route-transition placeholder; announced as "Loading". */
export default function Loading() {
  return (
    <div role="status" className="space-y-3">
      <span className="sr-only">Loading</span>
      <div className="h-8 w-64 max-w-full rounded bg-surface-muted" aria-hidden />
      <div className="h-40 w-full rounded-xl bg-surface-subtle" aria-hidden />
    </div>
  );
}
