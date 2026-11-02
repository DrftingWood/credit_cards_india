"""scripts/test_backfill_source_confidence.py — D3 confidence-backfill rule tests (no git, no data files)."""
import copy

from backfill_source_confidence import decide, header_tier, hedged, pure_insert, todo_flagged

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

# 3b. Rewards: prose, valuation and channel modelling added after the wave do not
#     take a record out of cover; a changed rate, cap or category does.
def reward(**base_extra):
    base = {"rate": 2, "per_inr": 100, "unit_value_inr": 0.25}
    base.update(base_extra)
    return {"effective_from": "2024-01-01", "effective_until": None, "currency": "points", "base": base,
            "accelerated": [{"category": "dining", "multiplier": 5, "effective_rate": 10, "cap_per_cycle": 1000}],
            "source": dict(SRC)}


rw = reward()
remodelled = reward(unit_value_inr=0.5, unit_value_inr_realized=0.3)
remodelled["accelerated"][0]["channel"] = {"required": False, "class": "cobrand-merchant", "merchants": ["x"]}
remodelled["accelerated"][0]["notes"] = "gated to the co-brand merchant"
remodelled["capping_rules"] = ["no cap documented"]
remodelled["redemption"] = [{"type": "statement-credit"}]
assert decide(remodelled, "rewards", "high", wave(rw, section="rewards")) == ("high", "ok")
# ...unless the source was re-stamped for that later modelling work
restamped = copy.deepcopy(remodelled)
restamped["source"]["retrieved_on"] = "2026-07-05"
assert decide(restamped, "rewards", "high", wave(rw, section="rewards")) == (None, "resourced-since-wave")
renoted = copy.deepcopy(remodelled)
renoted["source"]["notes"] = "2026-07-05: valuation rewritten from secondary sources"
assert decide(renoted, "rewards", "high", wave(rw, section="rewards")) == (None, "resourced-since-wave")
# a fully unchanged record may still have a re-stamped source (link repoint)
assert decide(dict(rw, source=dict(SRC, retrieved_on="2026-10-20")), "rewards", "high", wave(rw, section="rewards")) == ("high", "ok")
for key, val in (("cap_per_cycle", 2000), ("effective_rate", 8), ("canonical_categories", ["dining"])):
    bumped = reward()
    bumped["accelerated"][0][key] = val
    assert decide(bumped, "rewards", "high", wave(rw, section="rewards")) == (None, "changed-since-wave"), key
rate = reward(rate=3)
assert decide(rate, "rewards", "high", wave(rw, section="rewards")) == (None, "changed-since-wave")
excl = reward()
excl["exclusions"] = ["fuel"]
assert decide(excl, "rewards", "high", wave(rw, section="rewards")) == (None, "changed-since-wave")
# fees have no uncovered keys: a changed note still counts as an edit
noted = fee(notes="Renewal fee waived on Rs 2L spend.")
assert decide(noted, "fees", "high", wave(r)) == (None, "changed-since-wave")

# 3c. A record that carried a TODO marker before the cleanup stays unset unless the wave re-examined it.
assert decide(r, "fees", "high", wave(r), flagged=True) == (None, "todo-flagged")
assert decide(r, "fees", "high", wave(r), flagged=True, rechecked=True) == ("high", "ok")
assert decide(r, "fees", "high", wave(r), flagged=False, rechecked=True) == ("high", "ok")
PRE = (
    "id: x\nfees:\n  - effective_from: 2021-01-01\n    effective_until: null\n"
    "    joining_fee_inr: 2999  # TODO verify\n    source:\n      url: u\n"
    "rewards:\n  - effective_from: '2021-01-01'\n    effective_until: null\n"
    "    notes: \"see docs/TODO.md E16\"\n"
    "  - effective_from: 2023-04-01\n    effective_until: null\n    notes: \"caps # TODO verify from live tabs\"\n"
    "benefits:\n  - effective_from: 2021-01-01\n    lounge: 4  # TODO\n"
    "eligibility:\n  min_age: 21  # TODO verify\n"
)
assert todo_flagged(PRE) == {("fees", "2021-01-01"), ("rewards", "2023-04-01"), ("benefits", "2021-01-01")}

# 3d. Doc-level hedges point at real card files and covered sections, each with a citation.
from backfill_source_confidence import DOC_HEDGES, ROOT, SECTIONS  # noqa: E402

for (rel, sec), cite in DOC_HEDGES.items():
    assert (ROOT / rel).exists(), rel
    assert sec in SECTIONS and cite.startswith("docs/"), (rel, sec)

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
