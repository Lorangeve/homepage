import { test } from "bun:test";

export const hasWebView = typeof Bun.WebView === "function";

export const webViewTest: typeof test = hasWebView ? test : test.skip;
