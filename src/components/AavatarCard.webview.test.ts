import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import path from "node:path";
import { buildSolidSsrEntryModule } from "~/test/solidSsrBundle";
import { webViewTest } from "~/test/webviewEnv";

const ssrEntry = path.join(import.meta.dir, "AavatarCard.ssr-entry.ts");

function pageDataUrl(innerBodyHtml: string) {
  const doc = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"/></head><body>${innerBodyHtml}</body></html>`;
  return `data:text/html;charset=utf-8,${encodeURIComponent(doc)}`;
}

let disposeBundle: (() => Promise<void>) | undefined;
let renderAvatarCardHtml: () => Promise<string>;
let renderAvatarValidHtml: () => Promise<string>;

beforeAll(async () => {
  const { module, dispose } = await buildSolidSsrEntryModule<{
    renderAvatarCardHtml: () => Promise<string>;
    renderAvatarValidHtml: () => Promise<string>;
  }>(ssrEntry);
  disposeBundle = dispose;
  renderAvatarCardHtml = module.renderAvatarCardHtml;
  renderAvatarValidHtml = module.renderAvatarValidHtml;
});

afterAll(async () => {
  await disposeBundle?.();
});

describe("AvatarCard SSR", () => {
  test("产物含占位与应用名", async () => {
    const html = await renderAvatarCardHtml();
    expect(html).toContain('data-testid="avatar-placeholder"');
    expect(html).not.toContain('data-testid="avatar-image"');
    expect(html).toContain("Lorangeve's Homepage");
  });

  test("合法 URL 含头像图", async () => {
    const html = await renderAvatarValidHtml();
    expect(html).toContain('data-testid="avatar-image"');
    expect(html).toContain("https://example.com/favicon.ico");
    expect(html).not.toContain('data-testid="avatar-placeholder"');
  });
});

describe("AvatarCard 在 Bun.WebView 中", () => {
  webViewTest("非法 URL 时页面展示占位且含应用名", async () => {
    await using view = new Bun.WebView();
    await view.navigate(pageDataUrl(await renderAvatarCardHtml()));
    expect(
      await view.evaluate<boolean>(`Boolean(document.querySelector('[data-testid="avatar-placeholder"]'))`),
    ).toBe(true);
    expect(
      await view.evaluate<boolean>(`Boolean(document.querySelector('[data-testid="avatar-image"]'))`),
    ).toBe(false);
    expect(await view.evaluate<string>(`document.body?.innerText ?? ""`)).toContain("Lorangeve's Homepage");
  });

  webViewTest("合法 URL 时页面展示头像地址", async () => {
    await using view = new Bun.WebView();
    await view.navigate(pageDataUrl(await renderAvatarValidHtml()));
    expect(
      await view.evaluate<string>(
        `document.querySelector('[data-testid="avatar-image"]')?.getAttribute("src") ?? ""`,
      ),
    ).toBe("https://example.com/favicon.ico");
    expect(
      await view.evaluate<boolean>(`Boolean(document.querySelector('[data-testid="avatar-placeholder"]'))`),
    ).toBe(false);
  });
});
