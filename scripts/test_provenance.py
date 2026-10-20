"""scripts/test_provenance.py — rule-level provenance unit tests (no network, no data files)."""
from datetime import date

from provenance import Coverage, grade, in_strict_scope, iter_rules

TODAY = date(2026, 10, 20)
GOOD = {
    "url": "https://www.hdfc.bank.in/credit-cards/infinia-credit-card",
    "retrieved_on": "2026-07-03",
    "type": "issuer-page",
    "confidence": "high",
}


def card(rewards, status="active"):
    return {"id": "hdfc-test", "issuer": "hdfc", "status": status, "rewards": rewards}


def record(source, accelerated=(), until=None):
    return {"effective_from": "2024-01-01", "effective_until": until, "currency": "points",
            "base": {"rate": 4, "per_inr": 150}, "accelerated": list(accelerated), "source": source}


# 1. Inheritance: an accelerator without its own source takes the record's.
c = card([record(GOOD, [{"category": "dining"}, {"category": "travel", "source": dict(GOOD, retrieved_on="2026-08-01")}])])
rules = list(iter_rules(c))
assert [r.loc for r in rules] == ["rewards[0].base", "rewards[0].accelerated[0]", "rewards[0].accelerated[1]"]
assert [r.explicit for r in rules] == [False, False, True]
assert rules[1].source is GOOD
assert rules[2].source["retrieved_on"] == "2026-08-01"

# 2. A complete, fresh, issuer-owned source has no gaps.
assert all(grade(r, TODAY) == [] for r in rules), [r.gaps for r in rules]

# 3. Soft gaps: thin but not wrong.
thin = {"url": GOOD["url"], "retrieved_on": "2026-01-02"}
r = next(iter_rules(card([record(thin)])))
assert set(grade(r, TODAY)) == {"stale", "no-type", "no-confidence"}

# 4. Hard gaps: bare homepage, non-http scheme, aggregator host.
r = next(iter_rules(card([record(dict(GOOD, url="https://www.scapia.cards/"))])))
assert "homepage-url" in grade(r, TODAY)
r = next(iter_rules(card([record(dict(GOOD, url="ftp://example.com/x.pdf"))])))
assert "bad-scheme" in grade(r, TODAY)
r = next(iter_rules(card([record(dict(GOOD, url="https://www.paisabazaar.com/x"))])))
assert "aggregator" in grade(r, TODAY, aggregator_hosts={"www.paisabazaar.com"})
# a homepage with a query string is a specific page, not a placeholder
r = next(iter_rules(card([record(dict(GOOD, url="https://example.com/?card=x"))])))
assert "homepage-url" not in grade(r, TODAY)

# 5. fields_verified that names only the base leaves inherited accelerators unvouched;
#    a list with no reward paths at all neither vouches nor contradicts.
fv_base = dict(GOOD, fields_verified=["rewards.base.rate", "fees.annual_fee_inr"])
base_rule, acc_rule = list(iter_rules(card([record(fv_base, [{"category": "dining"}])])))
assert grade(base_rule, TODAY) == []
assert grade(acc_rule, TODAY) == ["unvouched"]
fv_fees = dict(GOOD, fields_verified=["fees.annual_fee_inr"])
assert all(grade(x, TODAY) == [] for x in iter_rules(card([record(fv_fees, [{"category": "dining"}])])))
# an explicit rule-level source is never "unvouched" by the record's list
own = list(iter_rules(card([record(fv_base, [{"category": "dining", "source": GOOD}])])))[1]
assert grade(own, TODAY) == []

# 6. Strict scope: open records of active/invite-only cards only.
closed = next(iter_rules(card([record(thin, until="2025-12-31")])))
assert not in_strict_scope(closed, card([]))
opened = next(iter_rules(card([record(thin)])))
assert in_strict_scope(opened, card([], status="invite-only"))
assert not in_strict_scope(opened, card([], status="discontinued"))

# 7. Coverage counts only in-scope rules and reports strict readiness.
cov = Coverage()
c = card([record(thin, until="2025-12-31"), record(GOOD, [{"category": "dining"}])])
for rule in iter_rules(c):
    grade(rule, TODAY)
    cov.add(c, "data/cards/hdfc/test.yaml", rule)
assert (cov.rules, cov.scoped, cov.strict_ready) == (3, 2, 2)
assert cov.gap_counts["stale"] == 0  # the stale rule is historical, out of scope
assert "strict-ready 2/2 (100%)" in "\n".join(cov.summary_lines())

print("OK: provenance core tests passed")
