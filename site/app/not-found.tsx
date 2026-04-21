import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">Not found</h1>
      <p className="mt-2 text-slate-600">
        That page isn&apos;t in the dataset. Try <Link href="/browse">browsing</Link> instead.
      </p>
    </div>
  );
}
