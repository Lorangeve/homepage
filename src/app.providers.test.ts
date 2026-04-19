import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

describe("应用 Provider 组合", () => {
  test("路由由 AppState 包裹，且 AppState 在 ClientPrefsState 外层", () => {
    const appFile = readFileSync(new URL("./app.tsx", import.meta.url), "utf8");
    const appStateIdx = appFile.indexOf("<AppState>");
    const clientPrefsIdx = appFile.indexOf("<ClientPrefsState>");

    expect(appStateIdx).toBeGreaterThan(-1);
    expect(clientPrefsIdx).toBeGreaterThan(-1);
    expect(appStateIdx).toBeLessThan(clientPrefsIdx);
  });
});
