"""scripts/test_backfill_source_confidence.py — D3 confidence-backfill rule tests (no git, no data files)."""
import copy

from backfill_source_confidence import decide, header_tier, hedged, pure_insert

HIGH_HDR = "# ---\n#   Verified   : 2026-07-04   Confidence: HIGH (pdf)\n# ---\nid: x\n"
MED_HDR = "#   Verified   : 2026-07-04   Confidence: MEDIUM (web)\n"
LOW_HDR = "#   Verified   : 2026-07-04   Confidence: LOW (unconfirmed)\n"
MIXED_HDR = "#   Verified   : 2026-07-28   Confidence: MIXED\n#   HIGH (pdf): base earn\n"

# 1. Header tiers map onto the schema enum; anything non-standard maps to nothing.
assert header_tier(HIGH_HDR) == "high"
assert header_tier(MED_HDR) == "medium"
assert header_tier(LOW_HDR) == "low"
assert header_tier(MIXED_HDR) is None
assert header_tier("id: no-header\n") is None
assert header_tier("#   Confidence: HIGH (issuer page, 2026-07-05)\n") is None

SRC = {"url": "https://www.axis.bank.in/cards/credit-card/x", "retrieved_on": "2026-07-03", "type": "issuer-page"}


def fee(src=SRC, until=None, **extra):
    rec = {"effective_from": "2024-01-01", "effective_until": until, "joining_fee_inr": 500,
           "annual_fee_inr": 500, "source": dict(src)}
    rec.update(extra)
    return rec


def wave(*recs, section="fees"):
    return {section: [copy.deepcopy(r) for r in recs]}


# 2. The happy path: open, issuer-owned, unchanged since the wave, unhedged.
r = fee()
assert decide(r, "fees", "high", wave(r)) == ("high", "ok")
# a source-only change since the wave (URL repoint, restamp, type added) still qualifies
old = fee(src={"url": "https://www.axisbank.com/x", "retrieved_on": "2026-04-01"})
assert decide(r, "fees", "medium", wave(old)) == ("medium", "ok")

# 3. Every guard, one at a time.
assert decide(fee(src=dict(SRC, confidence="low")), "fees", "high", wave(r)) == (None, "already-set")
assert decide(r, "fees", None, wave(r)) == (None, "no-standard-header")
assert decide(r, "benefits", "high", wave(r, section="benefits")) == (None, "section-not-covered")
closed = fee(until="2025-12-31")
assert decide(closed, "fees", "high", wave(closed)) == (None, "closed-record")
for t in ("aggregator", "archive", None):
    s = dict(SRC, type=t) if t else {k: v for k, v in SRC.items() if k != "type"}
    rec = fee(src=s)
    assert decide(rec, "fees", "high", wave(rec))[0] is None
assert decide(r, "fees", "high", None) == (None, "new-since-wave")
changed = fee(annual_fee_inr=999)
assert decide(changed, "fees", "high", wave(r)) == (None, "changed-since-wave")
moved = fee()
moved["effective_from"] = "2025-01-01"
assert decide(moved, "fees", "high", wave(r)) == (None, "changed-since-wave")
h = fee(notes="Fee amounts not published on the product page; verify against the schedule.")
assert decide(h, "fees", "high", wave(h)) == (None, "notes-hedged")

# 4. Hedge detection reads both the record notes and the source notes.
assert hedged({"notes": "fees widely reported as ~Rs 1.5L"})
assert hedged({"source": {"notes": "values are program-standard estimates"}})
assert hedged({"notes": "milestone slabs not published"})
assert not hedged({"notes": "Lifetime-free RuPay card, UPI-enabled."})
assert not hedged({"notes": "No published spend-based fee waiver."})

# 5. The write guard accepts only inserted `confidence:` lines.
before = "source:\n  url: u\n  retrieved_on: 2026-07-03\n  type: issuer-page\n"
after = before + "  confidence: high\n"
assert pure_insert(before, after, 1)
assert not pure_insert(before, after, 2)
assert not pure_insert(before, after.replace("url: u", "url: v"), 1)
assert not pure_insert(before, before + "  notes: x\n", 1)

# 6. Round-trip insertion keeps comments and order (only when ruamel is installed;
#    CI installs scripts/requirements.txt, which does not include it).
try:
    import io

    from backfill_source_confidence import add_confidence, make_yaml
except ImportError:  # pragma: no cover
    make_yaml = None
if make_yaml is not None:
    try:
        y = make_yaml()
    except ImportError:
        y = None
    if y is not None:
        text = (
            "fees:\n  - effective_from: 2024-01-01\n    effective_until: null\n"
            "    source:\n      url: https://x.example/p\n      retrieved_on: 2026-07-03\n"
            "      type: issuer-page\n\n# trailing comment\nrewards: []\n"
        )
        doc = y.load(text)
        add_confidence(doc["fees"][0]["source"], "high")
        buf = io.StringIO()
        y.dump(doc, buf)
        out = buf.getvalue()
        assert pure_insert(text, out, 1), out
        assert "      type: issuer-page\n      confidence: high\n\n# trailing comment\n" in out, out

print("OK: confidence backfill tests passed")
