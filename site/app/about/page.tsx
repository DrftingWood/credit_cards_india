import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — data methodology",
  description:
    "What this site is, where the data comes from, and how to contribute to the open dataset of Indian credit cards.",
};

export default function AboutPage() {
  return (
    <article className="prose prose-slate max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-900">About</h1>

      <p className="mt-4 text-slate-700">
        Credit Cards of India is an open dataset and comparison site for every major credit card
        issued in India. It&apos;s built on top of a YAML dataset in the{" "}
        <a href="https://github.com/DrftingWood/credit_cards_india" target="_blank" rel="noopener noreferrer">
          DrftingWood/credit_cards_india
        </a>{" "}
        repository — every value on this site links back to the issuer page it came from.
      </p>

      <h2 className="mt-6 text-lg font-semibold text-slate-900">How the data works</h2>
      <p className="mt-2 text-slate-700">
        Fees, rewards and benefits are stored as <strong>effective-dated records</strong>: when an
        issuer revises an annual fee or reward rate, we close the old record with an
        <code className="mx-1">effective_until</code> date and append a new one, so historical
        values are never lost. You can see these revisions on any card&apos;s page under{" "}
        <em>History</em>.
      </p>
      <p className="mt-2 text-slate-700">
        Every dated record carries a <code>source.url</code> and the date we retrieved it, so every
        number is traceable. The schema is a JSON Schema in <code>schema/card.schema.json</code> and
        the validator runs on every pull request.
      </p>

      <h2 className="mt-6 text-lg font-semibold text-slate-900">Data quality</h2>
      <p className="mt-2 text-slate-700">
        The dataset is in beta. Values were populated from widely-reported public figures and will
        have drifted for some cards since their retrieval dates. Always confirm with the issuer
        before applying. If you spot an error, please open an issue or a pull request on GitHub.
      </p>

      <h2 className="mt-6 text-lg font-semibold text-slate-900">Out of scope (for now)</h2>
      <ul className="mt-2 list-disc pl-6 text-slate-700 space-y-1">
        <li>Side-by-side card comparison.</li>
        <li>Favourites / bookmarks.</li>
        <li>Community reviews and ratings.</li>
        <li>Welcome bonuses and milestone vouchers in the calculator.</li>
      </ul>

      <h2 className="mt-6 text-lg font-semibold text-slate-900">Contributing</h2>
      <p className="mt-2 text-slate-700">
        See{" "}
        <a
          href="https://github.com/DrftingWood/credit_cards_india/blob/main/docs/CONTRIBUTING.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          CONTRIBUTING.md
        </a>{" "}
        in the repo. To add a card, run{" "}
        <code>python scripts/new_card.py &lt;issuer&gt; &lt;slug&gt; &quot;&lt;name&gt;&quot;</code>, fill in
        the TODOs from the issuer&apos;s own page, and open a PR. CI runs the validator on every
        submission.
      </p>
    </article>
  );
}
