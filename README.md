# credit_cards_india

An open, versioned dataset of credit cards issued in India: issuer, network,
fees, rewards, benefits, eligibility, source evidence, and dated history of how
each card has changed over time.

The dataset is authored as YAML, one file per card, validated by JSON Schema,
compiled into `dist/*.json`, and rendered by the Next.js site under `site/`.

## Layout

```text
schema/                             # JSON Schemas
data/
  networks/                         # visa, mastercard, rupay, amex, diners
  issuers/                          # hdfc, icici, sbi, axis, ...
  cards/<issuer>/<slug>.yaml        # one file per card
  loyalty_programs/<type>/<id>.yaml # third-party programs
  channels/known.yaml               # merchant/channel token index
scripts/
  validate.py                       # JSON Schema + cross-file lints
  new_card.py                       # scaffold a new card file
  category_rules.yaml               # regex -> canonical bucket map
  tag_canonical_categories.py       # one-shot category tagger
docs/
  README.md                         # documentation map
  TODO.md                           # canonical agent task board
  SCHEMA.md                         # schema reference
  DECISIONS.md                      # architecture decisions
  ROADMAP.md                        # high-level roadmap themes
  CONTRIBUTING.md                   # how to add/update cards
site/                               # Next.js app
.github/workflows/validate.yml      # CI validation
```

## Status

- 317 card YAML files across 24 issuers.
- Source confidence is tracked in [docs/PROVENANCE.md](docs/PROVENANCE.md).
- Local PDF evidence lives under `docs/sources/**/*.pdf`; PDFs are intentionally
  gitignored and must be preserved locally.
- Current agent task board: [docs/TODO.md](docs/TODO.md).
- Documentation map: [docs/README.md](docs/README.md).
- Roadmap themes: [docs/ROADMAP.md](docs/ROADMAP.md).

Historical pilot and expansion notes have been superseded by the 317-card July
2026 audit merge. Older audit files remain in `docs/` as evidence, not as the
current work queue.

## Contributing

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md). Short version:

```powershell
pip install -r scripts/requirements.txt   # pins jsonschema + attrs (reproducible)
python scripts/new_card.py hdfc millennia "HDFC Bank Millennia Credit Card"
python scripts/validate.py                # authoritative cross-file validation
npm.cmd --prefix site run prebuild         # regenerates dist/*.json
```

`python scripts/validate.py` is the cross-file gate (issuer/network joins,
dated-record overlap, channel tokens, `replaces_card` references, source-date
ordering, category tagging). Run it before `prebuild` so mistakes are caught
before `dist/*.json` is regenerated. It is the same command CI runs, so a clean
local run matches CI.

For site-facing changes, also run:

```powershell
npm.cmd --prefix site test -- --run
npm.cmd --prefix site run typecheck
```

## Schema And Design

- [docs/README.md](docs/README.md) - documentation map.
- [docs/TODO.md](docs/TODO.md) - canonical agent task board.
- [docs/SCHEMA.md](docs/SCHEMA.md) - field-by-field reference.
- [docs/DECISIONS.md](docs/DECISIONS.md) - architecture decisions.
- [docs/ROADMAP.md](docs/ROADMAP.md) - roadmap themes.

Fees, rewards, and benefits are modeled as arrays of effective-dated records.
When an issuer revises a fee or reward rate, the old record is closed with
`effective_until` and a new open record is appended.

## Build Artifact

The site compiles `data/**/*.yaml` into JSON under `dist/` before rendering:

```powershell
npm.cmd --prefix site run prebuild
```

`site/scripts/prebuild.mjs` runs schema type generation, schema validation, and
the Node data builder. It also runs automatically before `next dev` and
`next build`.

`dist/cards.json` is the consumer-friendly form. Each card keeps its historical
arrays plus `issuer_detail`, `network_detail`, `current_fees`,
`current_rewards`, `current_benefits`, and computed fields used by the site.

`dist/` is gitignored and regenerated at site-build time.

## Site

The consumer-facing site lives under [site/](site/README.md). It reads the build
artifact at build time and pre-renders pages.

```powershell
cd site
npm install
npm run dev
```

## Deploying To Vercel

The Next.js app lives in `site/`, not the repo root.

1. Import the repo in Vercel.
2. Set Project Settings -> General -> Root Directory to `site`.
3. Use the Next.js framework preset.
4. Leave install/build/output defaults.
5. Optionally set `NEXT_PUBLIC_SITE_URL`.

The deploy path is pure Node. Python validation still runs in CI and local data
tooling.

## License

Data and code are released under the [MIT License](LICENSE). Attribution is
appreciated when reusing the dataset.
