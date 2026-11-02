import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-semibold text-fg">Not found</h1>
      <p className="mt-2 text-fg-muted">
        That page isn&apos;t in the dataset. Try <Link href="/browse">browsing</Link> instead.
      </p>
    </div>
  );
}
