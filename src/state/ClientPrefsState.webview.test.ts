import { afterAll, beforeAll, describe, expect } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { hasWebView, webViewTest } from "~/test/webviewEnv";

let pageUrl = "";
let server: ReturnType<typeof Bun.serve> | undefined;

beforeAll(() => {
  if (!hasWebView) return;
  server = Bun.serve({
    port: 0,
    fetch() {
      return new Response(
        "<!doctype html><html><body>WebView 存储测试</body></html>",
        { headers: { "content-type": "text/html; charset=utf-8" } },
      );
    },
  });
  pageUrl = `http://127.0.0.1:${server.port}/`;
});

afterAll(() => {
  server?.stop(true);
});

describe("ClientPrefs 在 Bun.WebView 中的 localStorage 行为", () => {
  async function createView(options?: Bun.WebView.ConstructorOptions) {
    const view = new Bun.WebView({
      headless: true,
      ...(options ?? {}),
    });
    /** 显式 `navigate`：在本机 Bun 1.3.12 上比仅靠构造函数的 `url` 更稳（避免 localStorage SecurityError） */
    await view.navigate(pageUrl);
    return view;
  }

  webViewTest("临时 dataStore 在多个 WebView 实例间不持久化", async () => {
    const view1 = await createView();
    await view1.evaluate(`localStorage.setItem("counter", "5")`);
    expect(await view1.evaluate<string | null>(`localStorage.getItem("counter")`)).toBe("5");
    view1.close();

    const view2 = await createView();
    expect(await view2.evaluate<string | null>(`localStorage.getItem("counter")`)).toBeNull();
    view2.close();
  });

  webViewTest("目录 dataStore 在多个 WebView 实例间持久化", async () => {
    const dir = await mkdtemp(join(tmpdir(), "bun-webview-storage-"));
    try {
      const view1 = await createView({
        dataStore: { directory: dir },
      });
      await view1.evaluate(`localStorage.setItem("counter", "9")`);
      expect(await view1.evaluate<string | null>(`localStorage.getItem("counter")`)).toBe("9");
      view1.close();

      const view2 = await createView({
        dataStore: { directory: dir },
      });
      expect(await view2.evaluate<string | null>(`localStorage.getItem("counter")`)).toBe("9");
      view2.close();
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
