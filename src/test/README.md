# `src/test/` 测试基础设施说明

本目录放的是 **Bun 测试运行器** 用的**共享工具**，不是「测试用例本身」。用例分散在 `src/components/*.webview.test.ts`、`src/state/*.webview.test.ts` 等文件中，通过路径别名 `~/test/...` 引用这里的模块。

## 这套东西是怎么来的

项目使用 **SolidJS** 做 UI，部分场景需要验证两件事：

1. **SSR（服务端渲染字符串）**  
   组件在 `renderToString` 下的 HTML 是否符合预期（占位符、`data-testid`、文案等）。这不要求浏览器，用普通 `test()` 即可。

2. **真实 DOM / 浏览器 API**  
   例如 `localStorage` 在不同 `Bun.WebView` 配置下是否隔离或持久化；或把 SSR 产出的 HTML 塞进一页里，用 `WebView` 里执行脚本做断言。这需要 **Bun 提供的 `Bun.WebView` API**（并非所有环境或所有 Bun 构建都带 WebView）。

于是出现了两层分工：

- **`solidSsrBundle.ts`**：用 **Bun.build** 把「只给测试用的 SSR 入口文件」打成一份可在当前 Bun 进程里 `import()` 的 ESM，从而在不跑整站 Vite/Nitro 的情况下，对任意组件做 SSR 快照式验证。
- **`webviewEnv.ts`**：探测当前运行时是否有 `Bun.WebView`；没有则把依赖 WebView 的用例 **整体跳过**，避免在 CI 或精简 Bun 上硬失败。

另外，Solid 生态里 **lucide-solid** 在 SSR 路径可能依赖 `template()` 等与测试 bundler 不兼容的实现，因此在 `solidSsrBundle` 里加了一个小的 **resolve 插件**，把 `lucide-solid/icons/<name>` 指到包内 `dist/source` 下的 JSX 源文件，保证 SSR 打包能完成。这是为测试打包服务的工程细节，不是业务代码的一部分。

## 目录里有什么

| 文件 | 作用 |
|------|------|
| `solidSsrBundle.ts` | `buildSolidSsrEntryModule()`：单入口 SSR 打包 + 临时目录清理 |
| `webviewEnv.ts` | `hasWebView`、`webViewTest`（有 WebView 才跑，否则 `test.skip`） |
| `README.md` | 本文档 |

## `solidSsrBundle.ts` 怎么用

### API

```ts
import { buildSolidSsrEntryModule } from "~/test/solidSsrBundle";

const { module, dispose } = await buildSolidSsrEntryModule<{
  renderSomething: () => string;
}>("/absolute/path/to/MyComponent.ssr-entry.ts");

try {
  const html = module.renderSomething();
  // expect(html).toContain(...)
} finally {
  await dispose();
}
```

- **`entryAbsolutePath`**：一个 **绝对路径** 的 `.ts` / `.tsx` 文件，对外导出你要在测试里调用的函数（通常返回 `renderToString(...)` 的结果）。
- **构建选项**：`target: "bun"`、`format: "esm"`，插件为 `@dschz/bun-plugin-solid` 的 SSR 模式（`generate: "ssr"`, `hydratable: false`），并带上面的 lucide 解析插件。
- **`dispose()`**：删除 Bun 输出到的临时目录；务必在 `afterAll` 或 `try/finally` 里调用，避免磁盘堆积。

### 推荐模式：`*.ssr-entry.ts`

与路由/应用入口解耦，为测试单独放一个极小的入口文件，例如 `AavatarCard.ssr-entry.ts`：

- 只 `import` 被测组件和必要 context（如 `AppState`）。
- 导出若干 `renderXxxHtml()`，内部用 `createComponent` + `renderToString`。

测试文件里用 `path.join(import.meta.dir, "....ssr-entry.ts")` 拼出绝对路径，再交给 `buildSolidSsrEntryModule`。可参考 `src/components/AavatarCard.webview.test.ts` 与 `src/components/AavatarCard.ssr-entry.ts`。

## `webviewEnv.ts` 怎么用

```ts
import { hasWebView, webViewTest } from "~/test/webviewEnv";
import { describe, test } from "bun:test";

// 需要普通同步测试时仍用 test()
describe("仅 SSR", () => {
  test("…", () => { /* … */ });
});

// 依赖 Bun.WebView 的用例用 webViewTest
describe("在 Bun.WebView 中", () => {
  webViewTest("…", async () => {
    await using view = new Bun.WebView();
    await view.navigate("…");
    expect(await view.evaluate(`…`)).toBe(…);
  });
});
```

- **`webViewTest`**：若 `typeof Bun.WebView === "function"`，行为与 `test` 相同；否则等价于 **`test.skip`**，套件仍通过，只是该条不执行。
- **`hasWebView`**：当 `beforeAll` 里要起 `Bun.serve` 等只有 WebView 测试才需要的资源时，可先判断 `if (!hasWebView) return;`，避免无 WebView 时浪费端口或服务句柄。见 `src/state/ClientPrefsState.webview.test.ts`。

## 当前仓库中的示例用例

| 文件 | 内容概要 |
|------|----------|
| `src/components/AavatarCard.webview.test.ts` | `buildSolidSsrEntryModule` 打 `AavatarCard.ssr-entry.ts`；一组纯 SSR 字符串断言；一组 `webViewTest` 把 HTML 塞进 `data:` URL 页面后在 WebView 里查 DOM |
| `src/state/ClientPrefsState.webview.test.ts` | 仅用 `webViewTest` + 本机 HTTP 页，验证 `dataStore` 临时目录 vs 指定目录对 `localStorage` 持久化的影响 |

命名约定：**`*.webview.test.ts`** 表示「可能包含 WebView」，便于和纯单测区分。

## 怎么运行

在项目根目录：

```bash
bun test
```

或监听模式：

```bash
bun test --watch
```

（与 `package.json` 里 `"test": "bun test"` 一致。）

没有 WebView 的环境中，被 `webViewTest` 包起来的用例会以 **skip** 形式出现；SSR 部分仍会执行。

## 新增一类「SSR + 可选 WebView」测试时可以照做的清单

1. 新增 `YourThing.ssr-entry.ts`，导出返回 HTML 字符串的函数。
2. 新增 `YourThing.webview.test.ts`（或任意 `*.test.ts`，由 Bun 自动发现）。
3. `beforeAll` 里调用 `buildSolidSsrEntryModule`，在 `afterAll` 里 `await dispose()`。
4. 同步断言写在普通 `test()` 里；需要 `Bun.WebView` 的写在 `webViewTest()` 里。
5. 若 lucide 或其它包在 SSR 打包报错，优先在 **`solidSsrBundle.ts` 的插件层** 做最小 resolve/shim，避免污染业务组件。

## 路径别名

`~/test/...` 对应 `src/test/...`，由根目录 `tsconfig.json` 的 `paths` 配置。若测试运行器解析失败，检查是否从仓库根执行 `bun test` 以及 TS/Bun 对 `paths` 的支持是否与当前版本一致。
