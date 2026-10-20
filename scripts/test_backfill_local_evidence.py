"""scripts/test_backfill_local_evidence.py — D3 local-evidence backfill rule tests (no git, no PDFs)."""
from backfill_local_evidence import AS_OF, CLAIMS, Claim, evaluate, get_path, pure_insert

SRC = {"url": "https://www.example.bank.in/card", "retrieved_on": "2026-07-03", "type": "issuer-page"}


def fee(**kw):
    rec = {"effective_from": "2024-01-01", "effective_until": None, "joining_fee_inr": 500, "annual_fee_inr": 500,
           "finance_charge_monthly_pct": 3.75, "forex_markup_pct": 3.5, "source": dict(SRC)}
    rec.update(kw)
    return rec


def reward(cap=1000, n_acc=1):
    acc = [{"category": "dining", "multiplier": 5, "effective_rate": 5, "cap_per_cycle": cap}] * n_acc
    return {"effective_from": "2024-01-01", "effective_until": None, "currency": "points",
            "base": {"rate": 1, "per_inr": 100}, "accelerated": acc, "source": dict(SRC)}


FEES = Claim("t-fees", "x", "fees", ("finance_charge_monthly_pct", "forex_markup_pct"),
             {"card": {"finance_charge_monthly_pct": 3.75, "forex_markup_pct": 3.5}}, "docs/sources/x/a.pdf", "test")
ASOF = Claim("t-asof", "x", "fees", ("annual_fee_inr",), {"card": {"annual_fee_inr": AS_OF}}, "docs/sources/x/a.pdf",
             "test", rev="abc")
EARN = Claim("t-earn", "x", "rewards", ("base.rate", "accelerated.cap_per_cycle"),
             {"card": {"base.rate": AS_OF, "accelerated.cap_per_cycle": 1000}}, "docs/sources/x/b.pdf", "test",
             rev="abc", all_accelerators=True)

# 1. Paths resolve inside the record; the accelerator path needs exactly one accelerator.
assert get_path(fee(), "forex_markup_pct") == 3.5
assert get_path(fee(), "fee_waiver") is KeyError
assert get_path(reward(), "base.per_inr") == 100
assert get_path(reward(), "accelerated.cap_per_cycle") == 1000
assert get_path(reward(n_acc=2), "accelerated.cap_per_cycle") is KeyError

# 2. Literal claims: every matching field is listed; a mismatching one is dropped.
assert evaluate(FEES, "card", fee(), None) == (["fees.finance_charge_monthly_pct", "fees.forex_markup_pct"], "ok")
assert evaluate(FEES, "card", fee(forex_markup_pct=0.99), None) == (["fees.finance_charge_monthly_pct"], "ok")
assert evaluate(FEES, "card", fee(finance_charge_monthly_pct=3.6, forex_markup_pct=2.0), None) == ([], "value-mismatch")
assert evaluate(FEES, "other", fee(), None) == ([], "not-in-claim")
assert evaluate(FEES, "card", None, None) == ([], "no-open-record")

# 3. Existing evidence is never merged into.
assert evaluate(FEES, "card", fee(source=dict(SRC, fields_verified=["fees.x"])), None) == ([], "has-evidence")
assert evaluate(FEES, "card", fee(source=dict(SRC, local_refs=["docs/sources/x/c.pdf"])), None) == ([], "has-evidence")

# 4. "Confirmed as-is" claims compare against the record at the verification commit.
assert evaluate(ASOF, "card", fee(), fee()) == (["fees.annual_fee_inr"], "ok")
assert evaluate(ASOF, "card", fee(annual_fee_inr=999), fee()) == ([], "value-mismatch")
assert evaluate(ASOF, "card", fee(), None) == ([], "no-record-at-rev")

# 5. Reward claims are all-or-nothing and need every accelerator covered.
assert evaluate(EARN, "card", reward(), reward()) == (["rewards.base.rate", "rewards.accelerated.cap_per_cycle"], "ok")
assert evaluate(EARN, "card", reward(cap=2000), reward(cap=2000)) == ([], "value-changed")
assert evaluate(EARN, "card", reward(n_acc=2), reward(n_acc=2)) == ([], "accelerators-not-all-covered")

# 6. The write guard accepts only the inserted evidence lines.
before = "    source:\n      url: u\n      confidence: high\n"
after = before + "      local_refs:\n        - docs/sources/x/a.pdf\n      fields_verified:\n        - fees.forex_markup_pct\n"
assert pure_insert(before, after, 4)
assert not pure_insert(before, after, 3)
assert not pure_insert(before, after.replace("url: u", "url: v"), 4)
tail = "\nrewards:\n"
assert pure_insert(before + tail, after + tail, 4, blocks=1)
# a blank line that drifts into the middle of the inserted block splits it: refused
drift = before + "      local_refs:\n        - docs/sources/x/a.pdf\n      fields_verified:\n\n        - fees.forex_markup_pct\nrewards:\n"
assert not pure_insert(before + tail, drift, 4, blocks=1)

# 7. The shipped claims are well-formed: refs under docs/sources/*.pdf, every expected field is declared,
#    AS_OF claims name a commit, and reward claims cover all accelerators.
for c in CLAIMS:
    refs = c.ref.values() if isinstance(c.ref, dict) else [c.ref]
    assert all(r.startswith("docs/sources/") and r.endswith(".pdf") for r in refs), c.id
    assert c.section in ("fees", "rewards"), c.id
    for slug, want in c.expect.items():
        assert set(want) <= set(c.fields), (c.id, slug)
        if any(v is AS_OF for v in want.values()):
            assert c.rev, c.id
    if c.section == "rewards":
        assert c.all_accelerators, c.id
    assert c.cite, c.id

print("OK: local evidence backfill tests passed")
