/**
 * SSR 测试入口：`AavatarCard.webview.test.ts` 通过 `buildSolidSsrEntryModule` 打包后 `import`。
 * 头像需异步 `fetch` 校验，故用 `renderToStringAsync`。
 */
import { createComponent } from "solid-js";
import { renderToStringAsync } from "solid-js/web";
import { AppState } from "../state/AppState";
import { Avatar, AvatarCard } from "./AavatarCard";

export async function renderAvatarCardHtml() {
  return renderToStringAsync(() =>
    createComponent(AppState, {
      get children() {
        return createComponent(AvatarCard, {
          url: "/favicon.ico",
        });
      },
    }),
  );
}

export async function renderAvatarValidHtml() {
  return renderToStringAsync(() =>
    createComponent(Avatar, { url: "https://example.com/favicon.ico" }),
  );
}
