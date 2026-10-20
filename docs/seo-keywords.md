# SEO keyword map

Last updated: 2026-10-20

Twenty high-intent Indian search queries, each assigned to the one page on the
site that should rank for it. "High intent" means the searcher is choosing or
about to apply for a card, not reading news.

**How this list was made.** The queries were picked by judgment from the shape of
Indian credit-card search (best-X-card, card-name + review/fees, X-vs-Y). No
keyword tool or Search Console data was used, so there are no volume or difficulty
figures here. Once Google Search Console is connected for the live site
(`credit-cards-india.vercel.app`, or the custom domain once `NEXT_PUBLIC_SITE_URL`
is set), replace the judgment with real impression data and re-rank this list.

**One page per query.** Two pages competing for the same query split the signal,
so each query has a single target. Every page also has its own canonical URL
(`alternates.canonical`). Filtered `/browse?...` URLs canonicalise to `/browse`,
so they cannot rank on their own.

## Keyword → page map

| # | Keyword (en-IN) | Intent | Target page | Fit today |
|---|---|---|---|---|
| 1 | best credit card in India | choose | `/` (home) | Good |
| 2 | best credit card for my spending | choose (personalised) | `/recommend` | Good |
| 3 | credit card reward calculator India | compare value | `/calculator` | Good |
| 4 | compare credit cards India | compare | `/compare` | Good |
| 5 | lifetime free credit card India | choose | `/browse` | Partial: no dedicated LTF landing page |
| 6 | best travel credit card India | choose | `/recommend` | Partial: see gap A |
| 7 | best cashback credit card India | choose | `/recommend` | Partial: see gap A |
| 8 | best credit card for lounge access India | choose | `/browse` | Partial: see gap A |
| 9 | best credit card for online shopping India | choose | `/calculator` | Partial: see gap A |
| 10 | best fuel credit card India | choose | `/calculator` | Partial: see gap A |
| 11 | best way to book flights with credit card points India | how-to / book | `/booking` | Good |
| 12 | HDFC Infinia credit card review | evaluate one card | `/card/hdfc/infinia` | Good |
| 13 | Axis Atlas credit card benefits | evaluate one card | `/card/axis/atlas` | Good |
| 14 | SBI Cashback credit card fees | evaluate one card | `/card/sbi/cashback` | Good |
| 15 | Amazon Pay ICICI credit card rewards | evaluate one card | `/card/icici/amazon-pay` | Good |
| 16 | Swiggy HDFC credit card benefits | evaluate one card | `/card/hdfc/swiggy-hdfc` | Good |
| 17 | Tata Neu Infinity HDFC credit card review | evaluate one card | `/card/hdfc/tata-neu-infinity` | Good |
| 18 | HDFC Millennia credit card fees and charges | evaluate one card | `/card/hdfc/millennia` | Good |
| 19 | Axis Magnus vs HDFC Infinia | head-to-head | `/compare` | Partial: see gap B |
| 20 | credit card annual fee waiver India | evaluate cost | `/browse` | Partial: see gap A |

Card titles are already keyword-led (`<Card name>: fees, rewards & benefits`;
owner decision 2026-10-20), which covers the "review / fees / benefits / rewards"
tails of queries 12–18 without a separate page per tail.

## Gaps worth closing (not done on this branch)

- **A. Category landing pages.** Queries 5–10 and 20 are category intent ("best
  travel card"). The site answers them interactively (`/recommend`,
  `/calculator`, `/browse` filters), but there is no static, indexable page per
  category with a ranked list and prose. Statically generated routes such as
  `/best/travel`, `/best/cashback`, `/best/lounge`, `/best/fuel`,
  `/best/online-shopping` and `/lifetime-free`, built from the same scorer as
  `/recommend` with a fixed spend profile, would be the strongest single SEO
  addition. Re-point rows 5–10 and 20 to them when they exist.
- **B. Indexable comparison URLs.** `/compare` keeps its selection in the query
  string and canonicalises to `/compare`, so "X vs Y" queries can only land on
  the empty tool. Pre-rendering a short list of popular pairs at path URLs (for
  example `/compare/axis-magnus-vs-hdfc-infinia`) would let row 19 rank.
- **C. Structured data.** No JSON-LD yet. `FinancialProduct` markup on card pages
  and `BreadcrumbList` on detail pages are low-effort additions.

## Technical SEO already in place (for reference)

- `sitemap.xml` (`site/app/sitemap.ts`): home, the six tool pages and every
  active card page, as absolute URLs. `lastmod` is the card's
  `last_verified_on` (or the newest one, for data-driven tool pages) and is
  omitted for prose pages; no `priority`/`changefreq`, which Google ignores.
- `robots.txt` (`site/app/robots.ts`): allow all, points at the sitemap.
- Base URL: `SITE_URL` in `site/lib/site-config.ts`, from
  `NEXT_PUBLIC_SITE_URL` with the vercel.app URL as fallback. It is the only
  place the domain is configured.
- Open Graph and Twitter card tags on every page. The default share image is
  `/og.png` (rendered at build time by `site/app/og.png/route.tsx`). Card pages
  use their own card art when the dataset has licensed art, and the default
  image otherwise.

## Standards relied on (checked 2026-10-20)

- Google Search Central, "Build and submit a sitemap": use fully-qualified
  absolute URLs; `lastmod` is used only if "consistently and verifiably"
  accurate; `priority` and `changefreq` are ignored.
  https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- The Open Graph protocol: `og:title`, `og:type`, `og:image` and `og:url` are
  required on every page; a page with `og:image` should also set
  `og:image:alt`; `og:locale` defaults to `en_US` (set here to `en_IN`).
  https://ogp.me/
