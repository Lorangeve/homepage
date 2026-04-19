/**
 * SSR 测试入口：`AavatarCard.webview.test.ts` 通过 `buildSolidSsrEntryModule` 打包后 `import`。
 */
import { createComponent } from "solid-js";
import { renderToString } from "solid-js/web";
import { AppState } from "../state/AppState";
import { Avatar, AvatarCard } from "./AavatarCard";

export function renderAvatarCardHtml() {
  return renderToString(() =>
    createComponent(AppState, {
      get children() {
        return createComponent(AvatarCard, {});
      },
    }),
  );
}

export function renderAvatarValidHtml() {
  return renderToString(() =>
    createComponent(Avatar, { url: "https://example.com/favicon.ico" }),
  );
}
