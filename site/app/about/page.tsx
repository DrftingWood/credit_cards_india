import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site-url";

export const metadata: Metadata = pageMetadata(
  "About — data and ranking methodology",
  "How cards are ranked by net ₹/year, where the data comes from, and how to contribute to the open dataset of Indian credit cards.",
);

export default function AboutPage() {
  return (
    // Plain Tailwind spacing: the site has no typography plugin, so `prose` classes did nothing.
    <article className="max-w-2xl [&_a]:text-brand-700 [&_a:hover]:underline [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:text-[0.9em]">
      <h1 className="text-2xl font-semibold text-slate-900">About</h1>

      <p className="mt-4 text-slate-700">
        Credit Cards of India is an open dataset and comparison site for every major credit card
        issued in India. It&apos;s built on top of a YAML dataset in the{" "}
        <a href="https://github.com/DrftingWood/credit_cards_india" target="_blank" rel="noopener noreferrer">
          DrftingWood/credit_cards_india
        </a>{" "}
        repository — every value on this site links back to the issuer page it came from.
      </p>

      <h2 id="method" className="mt-6 scroll-mt-4 text-lg font-semibold text-slate-900">How we rank cards</h2>
      <p className="mt-2 text-slate-700">
        Every ranking is <strong>net ₹ per year for the spend you enter</strong>: the rewards the
        card pays on that spend, minus what the card costs you.
      </p>
      <ul className="mt-2 list-disc space-y-1.5 pl-6 text-slate-700">
        <li>
          <strong>Rewards</strong> use each category&apos;s real earn rate, with every published cap
          applied. Spend past a cap earns the base rate, and categories the card excludes (rent,
          fuel, wallet loads…) earn nothing. Points are valued at what they realistically redeem
          for, not their best-case transfer value.
        </li>
        <li>
          <strong>Co-brand and channel rates</strong> (a 5% Amazon rate, a 10× bank-portal rate)
          count only when you say you use that brand or channel. In the card breakdown,{" "}
          <em>Realistic</em> applies this; <em>Absolute</em> shows the best case and states what each
          rate requires.
        </li>
        <li>
          <strong>The annual fee</strong> is subtracted including 18% GST, and waived only when your
          spend clears the card&apos;s waiver threshold over its own cycle, counting just the
          spend the card itself rewards, since issuers exclude the same categories from waiver
          spend.
        </li>
        <li>
          <strong>Welcome bonuses, milestones and lounge visits</strong> are shown separately and
          never added to the ranking: they are one-off or depend on how you use them.
        </li>
      </ul>
      <p className="mt-2 text-slate-700">
        Each card&apos;s page shows this calculation line by line under <em>See the math</em>, for
        whatever spend you enter.
      </p>

      <h2 className="mt-6 text-lg font-semibold text-slate-900">How the data works</h2>
      <p className="mt-2 text-slate-700">
        Fees, rewards and benefits are stored as <strong>effective-dated records</strong>: when an
        issuer revises an annual fee or reward rate, we close the old record with an
        <code className="mx-1">effective_until</code> date and append a new one, so historical
        values are never lost. Cards with recorded revisions show them on their page under{" "}
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
        <li>Favourites / bookmarks.</li>
        <li>Community reviews and ratings.</li>
        <li>Welcome bonuses and milestone vouchers in the net ₹/yr ranking (shown separately).</li>
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
