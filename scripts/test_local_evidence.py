"""scripts/test_local_evidence.py — validator local_refs checks (B1/D3); no PDFs needed."""
from pathlib import Path

from validate import ROOT, check_local_evidence, local_ref_warnings

CARD = ROOT / "data" / "cards" / "hdfc" / "test.yaml"
MISSING = "docs/sources/hdfc/INDEX.md.pdf"  # never exists; used as a missing ref
TRACKED = "docs/sources/hdfc/INDEX.md"  # tracked file, so it exists in CI too


def card(*sources):
    return {"fees": [{"source": s} for s in sources]}


# 1. Shape: refs outside docs/sources are errors; refs without fields_verified warn.
errors, warnings = [], []
check_local_evidence(errors, warnings, CARD, card({"url": "u", "local_refs": ["tmp/x.pdf"], "fields_verified": ["fees.x"]}), {})
assert len(errors) == 1 and "must be a repo-relative path" in errors[0], errors
errors, warnings = [], []
check_local_evidence(errors, warnings, CARD, card({"url": "u", "local_refs": [MISSING]}), {})
assert any("no fields_verified" in w for w in warnings), warnings

# 2. Without ref_state the old per-ref warning is kept.
errors, warnings = [], []
check_local_evidence(errors, warnings, CARD, card({"url": "u", "local_refs": [MISSING], "fields_verified": ["fees.x"]}))
assert len(warnings) == 1 and "not found on disk" in warnings[0], warnings

# 3. Archive absent (nothing resolves): one summary line, duplicates folded.
state, errors, warnings = {}, [], []
src = {"url": "u", "local_refs": [MISSING], "fields_verified": ["fees.x"]}
check_local_evidence(errors, warnings, CARD, card(src, src), state)
check_local_evidence(errors, warnings, CARD.with_name("other.yaml"), card(src), state)
assert warnings == [], warnings
out = local_ref_warnings(state)
assert len(out) == 1 and "2 source.local_refs across 2 cards" in out[0] and "archive is absent" in out[0], out

# 4. Archive present (something resolves): each distinct missing ref is named.
state = {}
check_local_evidence([], [], CARD, card({"url": "u", "local_refs": [TRACKED, MISSING], "fields_verified": ["fees.x"]}), state)
out = local_ref_warnings(state)
assert len(out) == 1 and MISSING in out[0] and "check the path" in out[0], out
assert Path(ROOT / TRACKED).exists()

# 5. Nothing missing: nothing to say.
assert local_ref_warnings({"found": {("a", "b")}}) == []
assert local_ref_warnings({}) == []

print("OK: local evidence tests passed")
