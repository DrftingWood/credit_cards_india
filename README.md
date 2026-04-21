# credit_cards_india

An open, versioned dataset of credit cards issued in India — issuer, network, fees, rewards, benefits, and eligibility — with full history of how each card has changed over time.

The dataset is authored as YAML, one file per card, validated by JSON Schema. A consumer-facing site will sit on top of this repo (planned separately).

## Layout

```
schema/                             # JSON Schemas (card, issuer, network)
data/
  networks/                         # visa, mastercard, rupay, amex, diners
  issuers/                          # hdfc, icici, sbi, axis, ...
  cards/<issuer>/<slug>.yaml        # one file per card
scripts/
  validate.py                       # JSON Schema + cross-file lints
  new_card.py                       # scaffold a new card file
docs/
  SCHEMA.md                         # field-by-field reference
  CONTRIBUTING.md                   # how to add/update a card
.github/workflows/validate.yml      # CI runs validate.py on every PR
```

## Status

v1.0 ships the schema + a 10-card pilot deliberately chosen to exercise every schema branch:

| Card | Why it's in the pilot |
| --- | --- |
| HDFC Infinia | Invite-only, metal, points, super-premium |
| HDFC Diners Black | Diners network, unlimited lounge/golf |
| HDFC Regalia Gold | Mainstream premium with spend-threshold benefits |
| Axis Magnus | Demonstrates effective-dated revision (pre/post 2023 nerf) |
| Axis Atlas | Miles currency, milestone tiers |
| Amex Platinum Travel | Amex network, milestone-heavy |
| SBI Cashback | Cashback currency, online-spend accelerator |
| ICICI Amazon Pay | Co-branded (ecommerce), lifetime-free |
| RBL IRCTC | Co-branded (railway), niche |
| IDFC FIRST Select | Lifetime-free mid-tier, incremental rewards |
| AU LIT | Customisable-features card (edge case) |

Roadmap:

- **v1.1**: Fill out HDFC, Axis, Amex catalogues end-to-end (~30–40 cards).
- **v1.2+**: Issuer-by-issuer expansion (SBI, ICICI, IDFC FIRST, Kotak, RBL, AU, IndusInd, Yes, Standard Chartered, HSBC, BoB, Federal, OneCard, smaller issuers).

## Contributing

See [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md). TL;DR:

```
pip install -r scripts/requirements.txt
python scripts/new_card.py hdfc millennia "HDFC Bank Millennia Credit Card"
# fill in the TODOs
python scripts/validate.py
```

## Schema

See [`docs/SCHEMA.md`](docs/SCHEMA.md). The source of truth is `schema/*.schema.json`.

Fees, rewards, and benefits are modelled as **arrays of effective-dated records** — when an issuer revises an annual fee or reward rate, the old record is closed with `effective_until` and a new record is appended. Site queries like "what was this card's annual fee on 2024-06-01" become a one-line lookup without going through git history.

## Build artifact

```
python scripts/build.py        # writes dist/cards.json, issuers.json, networks.json, index.json
```

`dist/cards.json` is the consumer-friendly form: each card has the full historical arrays **plus** `issuer_detail`, `network_detail`, `current_fees` / `current_rewards` / `current_benefits` (the currently-open records), and a `computed` block with derived fields the site can filter/sort on (`is_active`, `is_lifetime_free`, `headline_rate_pct`, `has_domestic_lounge`, etc.).

`dist/index.json` summarises counts by issuer / network / tier / reward currency + tag vocabulary — useful for landing-page badges, filter sidebars, and tag clouds without scanning every card.

`dist/` is git-ignored; the artifact is meant to be regenerated in CI / at site-build time. Publish to a GitHub Release if a versioned consumer-facing dump is needed.

## Site

The consumer-facing site lives under [`site/`](site/README.md) — Next.js 15 + Tailwind. It reads the build artefact at build time and pre-renders every page.

```
cd site
npm install
npm run dev          # auto-runs python scripts/build.py first
```

### Deploying to Vercel

The Next.js app lives in `site/`, not at the repo root, so Vercel's framework auto-detection needs to be pointed at it explicitly:

1. Import the repo in the Vercel dashboard.
2. **Project Settings → General → Root Directory → `site`**. This is the key step — Vercel will cd into `site/` (with the rest of the repo still checked out, so `../scripts/build.py` resolves from `site/scripts/prebuild.mjs`).
3. Framework preset: **Next.js** (auto-detected once the root directory is correct).
4. Install command: leave default (`npm install`).
5. Build command: leave default (`next build`) — `site/package.json` wires `prebuild` to regenerate `../dist/*.json` via Python.
6. Output directory: leave default (`.next`).
7. (Optional) Set `NEXT_PUBLIC_SITE_URL` in project env vars to the production URL so the sitemap has the right host.

Python 3 is available on Vercel's default build image, so no extra runtime configuration is needed.

## License

Data and code are released under the [MIT License](LICENSE). Attribution appreciated when reusing the dataset.
