import { Component, ErrorBoundary } from "solid-js";
import { useAppStateContext } from "~/state/AppState";

import IconNoImage from "lucide-solid/icons/link-2-off";
import IconUserRound from "lucide-solid/icons/user-round";

import * as z from "zod";

export const AvatarCard: Component = () => {
  const { store } = useAppStateContext();

  return (
    <div
      data-testid="avatar-card"
      class="w-52 h-32 mx-10 my-5 px-3 py-2 flex justify-center items-center rounded-md bg-blue-300 dark:bg-blue-600/65 overflow-auto"
    >
      <Avatar url={"httpstailwindcss.com/favicon.ico"} />
      {store.appName}
    </div>
  );
};

const AvatarUrlSchema = z.url();

interface AvatarProps {
  url: z.infer<typeof AvatarUrlSchema>;
}

const AvatarImage: Component<AvatarProps> = (props) => {
  const parsed = AvatarUrlSchema.safeParse(props.url);
  if (!parsed.success) throw new Error("Invalid avatar URL");
  return (
    <img
      data-testid="avatar-image"
      class="mx-3 size-10"
      src={parsed.data}
      alt=""
    />
  );
};

const AvatarPlaceholder: Component = () => (
  <div
    data-testid="avatar-placeholder"
    class="mx-3 h-10 w-14 relative bg-gray-500 rounded flex justify-center items-center"
  >
    <IconNoImage class="[--style:1] absolute -top-[calc(var(--style)/3*1rem)] -right-[calc(var(--style)/3*1rem)] size-[calc(var(--style)*1rem)] bg-amber-500 rounded p-1 stroke-3 stroke-amber-50" />
    <IconUserRound />
  </div>
);

/** 导出供测试：非法 URL 走 ErrorBoundary，合法 URL 渲染 `<img>` */
export const Avatar: Component<AvatarProps> = (props) => (
  <ErrorBoundary fallback={(_err, _reset) => <AvatarPlaceholder />}>
    <AvatarImage url={props.url} />
  </ErrorBoundary>
);
