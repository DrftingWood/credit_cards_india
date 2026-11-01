import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

const eslint = new ESLint({ cwd: new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1") });

async function messages(code, filePath) {
  const [r] = await eslint.lintText(code, { filePath });
  return r.messages;
}

describe("eslint.config.mjs", () => {
  it("warns on an unused variable", async () => {
    const m = await messages("const foo = 1;\nexport {};\n", "lib/__fixture.ts");
    expect(m.map((x) => x.ruleId)).toContain("@typescript-eslint/no-unused-vars");
  });

  it("allows _-prefixed unused vars, args and caught errors", async () => {
    const code =
      "const _foo = 1;\nexport function f(_a: number) {\n  try {\n    return 1;\n  } catch (_e) {\n    return 2;\n  }\n}\n";
    const m = await messages(code, "lib/__fixture.ts");
    expect(m.filter((x) => x.ruleId === "@typescript-eslint/no-unused-vars")).toEqual([]);
  });

  it("errors on a direct phosphor import outside components/icons", async () => {
    const code = 'import { House } from "@phosphor-icons/react";\nexport const x = House;\n';
    const m = await messages(code, "components/__fixture.tsx");
    const hit = m.find((x) => x.ruleId === "no-restricted-imports");
    expect(hit?.severity).toBe(2);
    expect(hit?.message).toMatch(/icons/);
  });

  it("allows the phosphor import inside components/icons", async () => {
    const code = 'import { House } from "@phosphor-icons/react";\nexport const x = House;\n';
    const m = await messages(code, "components/icons/__fixture.tsx");
    expect(m.find((x) => x.ruleId === "no-restricted-imports")).toBeUndefined();
  });

  it("keeps the size rules at warn", async () => {
    const code = "export function f(a: number, b: number, c: number, d: number) {\n  return a + b + c + d;\n}\n";
    const m = await messages(code, "lib/__fixture.ts");
    expect(m.find((x) => x.ruleId === "max-params")?.severity).toBe(1);
  });
});
