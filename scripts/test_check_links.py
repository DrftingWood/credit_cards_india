"""scripts/test_check_links.py — link-checker classification tests (no network)."""
from check_links import classify, collect_urls, redirect_kind

DEEP = "https://www.hdfc.bank.in/credit-cards/infinia-credit-card"

# redirect kinds
assert redirect_kind(DEEP, DEEP) is None
assert redirect_kind(DEEP, DEEP + "/") == "cosmetic"
assert redirect_kind("http://hdfc.bank.in/credit-cards/infinia-credit-card", DEEP) == "cosmetic"
assert redirect_kind(DEEP, "https://www.hdfc.bank.in/") == "to-homepage"
assert redirect_kind(DEEP, "https://www.hdfc.bank.in/credit-cards/infinia") == "moved"
assert redirect_kind("https://www.hdfc.bank.in/", "https://www.hdfc.bank.in/home") == "moved"

# status classes
assert classify(200, DEEP, DEEP)["status"] == "ok"
assert classify(200, DEEP, "https://www.hdfc.bank.in/") == {"status": "redirect", "redirect_kind": "to-homepage"}
assert classify(404, DEEP, DEEP)["status"] == "not-found"
assert classify(410, DEEP, DEEP)["status"] == "not-found"
# bank bot walls are "blocked", never "not-found"
assert classify(403, DEEP, DEEP)["status"] == "blocked"
assert classify(429, DEEP, DEEP)["status"] == "blocked"
assert classify(503, DEEP, DEEP, "<title>Just a moment...</title>")["status"] == "blocked"
assert classify(200, DEEP, DEEP, "<html><title>Access Denied</title>")["status"] == "blocked"
assert classify(503, DEEP, DEEP)["status"] == "server-error"
assert classify(400, DEEP, DEEP)["status"] == "client-error"
assert classify(None, DEEP, None, error="URLError: timed out")["status"] == "network-error"

# collection: kinds and refs
out = {}
collect_urls({
    "website": "https://www.hdfcbank.com",
    "fees": [{"source": {"url": DEEP, "retrieved_on": "2026-07-03"}}],
    "rewards": [{"accelerated": [{"source": {"url": DEEP}}]}],
    "application": {"apply_url": "https://apply.example.com/x", "pre_approval_check_url": None},
    "notes": "see https://not-collected.example.com",
}, "", out)
assert set(out) == {"https://www.hdfcbank.com", DEEP, "https://apply.example.com/x"}
assert [r["kind"] for r in out[DEEP]] == ["source", "source"]
assert out[DEEP][1]["ref"] == "rewards[0].accelerated[0].source.url"
assert out["https://apply.example.com/x"][0]["kind"] == "application"
assert out["https://www.hdfcbank.com"][0]["kind"] == "website"

print("OK: check_links core tests passed")

# soft-404 and migration redirect kinds
assert redirect_kind("https://www.indusind.bank.in/in/en/personal/cards/credit-card/pinnacle-credit-card.html",
                     "https://www.indusind.bank.in/in/en/404.html") == "to-error-page"
assert redirect_kind("https://www.axisbank.com/retail/cards/credit-card/olympus-credit-card",
                     "https://www.axis.bank.in/sitemap") == "to-error-page"
assert redirect_kind("https://www.hsbc.co.in/credit-cards/products/taj/",
                     "https://www.hsbc.bank.in/credit-cards/products/taj/") == "host-moved"
assert redirect_kind("https://www.hdfcbank.com", "https://www.hdfc.bank.in/") == "host-moved"
# a redirect into a bot-manager interstitial is a block, not a moved page
assert classify(200, "https://www.federal.bank.in/visa-celesta-credit-card",
                "https://validate.perfdrive.com/?ssa=x&ssc=https%3A%2F%2Fwww.federal.bank.in")["status"] == "blocked"
print("OK: redirect-kind tests passed")
