# Contributing

Thanks for helping keep this dataset accurate. The goal is a comprehensive,
verifiable, versioned record of credit cards issued in India.

## Adding A New Card

1. Confirm the issuer exists in `data/issuers/`. If not, add it.
2. Scaffold a file:

   ```powershell
   python scripts/new_card.py <issuer_slug> <card_slug> "Full card name"
   ```

3. Fill every TODO from issuer-owned evidence. Prefer T&C/MITC PDFs over
   marketing pages when they conflict.
4. Replace all `source.url` placeholders with the exact pages or PDFs you read.
5. Run validation. `scripts/validate.py` is the authoritative cross-file check
   (issuer/network joins, dated-record overlap, channel tokens, `replaces_card`
   references, source-date ordering, and category tagging). Run it **before**
   the Node prebuild so cross-file mistakes are caught before `dist/*.json` is
   regenerated:

   ```powershell
   pip install -r scripts/requirements.txt   # one-time; pins jsonschema + attrs
   python scripts/validate.py                # cross-file lints (exit 0 = clean)
   npm.cmd --prefix site run prebuild         # schema types + dist/*.json builder
   ```

   This is the exact command sequence CI runs (`.github/workflows/validate.yml`),
   so a green local run means a green CI validation.

6. Open a PR. CI re-runs the Python validator.

Troubleshooting: if `python scripts/validate.py` fails with
`ModuleNotFoundError: No module named 'attr'`, your environment has `jsonschema`
without its `attrs` dependency — re-run `pip install -r scripts/requirements.txt`
(it now pins `attrs` explicitly).

## Updating An Existing Card

Never edit effective-dated fee, reward, or benefit values in place. Close the
current dated record and append a new one:

```yaml
fees:
  - effective_from: 2022-08-01
    effective_until: 2025-02-28
    annual_fee_inr: 500
  - effective_from: 2025-03-01
    effective_until: null
    annual_fee_inr: 750
```

This applies to `fees`, `rewards`, and `benefits`. Eligibility, application
URLs, tags, and notes can be overwritten in place when they are not historical
terms.

Always bump `metadata.last_verified_on` when you have re-read the issuer source
and confirmed the values.

## Source Citation Rules

- Prefer the issuer's official domain.
- Archive.org links are acceptable for historical records only.
- `source.retrieved_on` is the date you personally loaded the source.
- If the issuer publishes a PDF, cite the PDF URL directly.
- Do not cite aggregators as primary sources unless no issuer evidence exists
  and the record is clearly marked low-confidence.
- Do not delete or move local PDFs under `docs/sources/**/*.pdf`.

## PR Review Checklist

- [ ] `python scripts/validate.py` exits 0, or the local blocker is documented.
- [ ] `npm.cmd --prefix site run prebuild` exits 0.
- [ ] Every `source.url` resolves or has a note explaining why it is historical.
- [ ] Fee/reward/benefit arrays have exactly one open-ended record for active
      cards.
- [ ] For updates, the closed record's `effective_until` is one day before the
      new record's `effective_from`.
- [ ] `metadata.last_verified_on` is current for touched cards.
- [ ] Slugs are kebab-case, with no underscores or capitals.
- [ ] No local PDF evidence was deleted or moved.

## Discontinuing A Card

1. Set `status: discontinued`.
2. Set `discontinued_on` to the last day the card was issued, or the closest
   known date.
3. Close every open-ended `fees`, `rewards`, and `benefits` record with
   `effective_until: <discontinued_on>`.

## What Not To Include

- Speculation about upcoming cards.
- Values from personal pre-approved or invite-only offers unless published as
  policy.
- Scraped aggregator data without issuer re-verification.
