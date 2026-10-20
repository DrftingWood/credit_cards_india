import { describe, test, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { UsagePanel, DeclaredUsageSummary } from "./usage-panel";
import { DEFAULT_USAGE, setFamilyShare, toggleEcosystem, type UsageGroup, type UsageDelta } from "@/lib/usage";

const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
const GROUPS: UsageGroup[] = [
  { family: "amazon", label: "Amazon", tokens: ["amazon-pay"], categories: ["online"] },
  { family: "smartbuy", label: "HDFC SmartBuy", tokens: ["smartbuy"], categories: ["travel"] },
];

describe("UsagePanel", () => {
  test("asks one share question per merchant, naming the bucket it applies to", () => {
    const html = renderToStaticMarkup(<UsagePanel groups={GROUPS} usage={setFamilyShare(DEFAULT_USAGE, "amazon", 40)} ecosystem={null} deltas={[]} />);
    expect(html).toContain("Amazon");
    expect(html).toContain("HDFC SmartBuy");
    expect(html).toMatch(/Online shopping/);
    expect(html).toContain('value="40"');
    expect(EMOJI.test(html)).toBe(false);
  });

  test("a closed-loop card asks whether the user redeems in its ecosystem", () => {
    const html = renderToStaticMarkup(<UsagePanel groups={[]} usage={toggleEcosystem(DEFAULT_USAGE, "Tata Neu")} ecosystem="Tata Neu" deltas={[]} />);
    expect(html).toMatch(/I redeem in Tata Neu/);
    expect(html).toContain("checked");
  });

  test("lists what the usage unlocked, with the ₹ change", () => {
    const deltas: UsageDelta[] = [{ category: "online", label: "Online shopping", change: "unlocked", delta_inr_monthly: 320 }];
    const html = renderToStaticMarkup(<UsagePanel groups={GROUPS} usage={DEFAULT_USAGE} ecosystem={null} deltas={deltas} />);
    expect(html).toMatch(/Unlocked/);
    expect(html).toContain("+₹320/mo");
  });

  test("renders nothing when the card has no usage questions", () => {
    expect(renderToStaticMarkup(<UsagePanel groups={[]} usage={DEFAULT_USAGE} ecosystem={null} deltas={[]} />)).toBe("");
  });
});

describe("DeclaredUsageSummary", () => {
  test("one entry per merchant family, not per alias token", () => {
    const u = setFamilyShare(setFamilyShare(DEFAULT_USAGE, "amazon", 40), "swiggy", 60);
    const html = renderToStaticMarkup(<DeclaredUsageSummary usage={u} />);
    expect(html.match(/Amazon/g)).toHaveLength(1);
    expect(html).toContain("40%");
    expect(html).toContain("Swiggy");
  });
  test("says how to declare when nothing is", () => {
    expect(renderToStaticMarkup(<DeclaredUsageSummary usage={DEFAULT_USAGE} />)).toMatch(/No merchant shares declared/);
  });
});
