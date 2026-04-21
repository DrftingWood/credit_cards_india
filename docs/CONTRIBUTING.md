# Contributing

Thanks for helping keep this dataset accurate. The goal is a comprehensive, verifiable, versioned record of every active credit card in India.

## Adding a new card

1. Confirm the issuer is seeded in `data/issuers/`. If not, add it.
2. Scaffold a file:
   ```
   python scripts/new_card.py <issuer_slug> <card_slug> "Full card name"
   ```
   This creates `data/cards/<issuer>/<slug>.yaml` pre-filled with today's `retrieved_on` and TODO markers.
3. Fill in every TODO from the issuer's own page (T&C PDF > marketing page when they conflict).
4. Replace all `source.url` placeholders with the exact pages you read (one source per dated record — fees, rewards, benefits can each cite different pages).
5. Run the validator:
   ```
   pip install -r scripts/requirements.txt
   python scripts/validate.py
   ```
6. Open a PR. CI re-runs the validator.

## Updating an existing card

**Never edit values in place.** Instead, close the current dated record and append a new one:

```yaml
fees:
  - effective_from: 2022-08-01
    effective_until: 2025-02-28    # was null — closed the day before the change
    annual_fee_inr: 500
    ...
  - effective_from: 2025-03-01     # new open record
    effective_until: null
    annual_fee_inr: 750
    ...
```

This applies to `fees`, `rewards`, and `benefits`. Eligibility, application URLs, tags, etc. can be overwritten in place.

Always bump `metadata.last_verified_on` when you've re-read the issuer's page and confirmed the values.

## Source citation rules

- Prefer the issuer's official domain. Archive.org links are acceptable for historical records only.
- `source.retrieved_on` is **the date you personally loaded the page**, not the page's last-modified date.
- If an issuer publishes a PDF (MITC, key-fact statement), cite the PDF URL directly.
- Don't cite aggregators (CardInsider, BankBazaar, etc.) as primary sources — they drift.

## PR review checklist

- [ ] `python scripts/validate.py` exits 0.
- [ ] Every `source.url` resolves and matches the claimed values.
- [ ] Fee/reward/benefit arrays have exactly one open-ended record for an active card.
- [ ] For updates: the closed record's `effective_until` is one day before the new record's `effective_from`.
- [ ] `metadata.last_verified_on` is set to today.
- [ ] Slugs are kebab-case, no underscores, no capitals.

## Discontinuing a card

1. Set `status: discontinued`.
2. Set `discontinued_on` to the last day the card was issued (or the closest known date).
3. Close every open-ended `fees`/`rewards`/`benefits` record with `effective_until: <discontinued_on>`.

## What not to include

- Speculation about upcoming cards.
- Values from pre-approved / invite-only offers you received personally unless they are published policy.
- Scraped aggregator data — re-verify from issuer sources first.
