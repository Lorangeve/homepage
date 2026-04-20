import { Component, Show, Suspense, createResource } from "solid-js";
import { useAppStateContext } from "~/state/AppState";

import IconNoImage from "lucide-solid/icons/link-2-off";
import IconUserRound from "lucide-solid/icons/user-round";

interface AvatarCardProps {
  url: string;
}

export const AvatarCard: Component<AvatarCardProps> = (props) => {
  const { store } = useAppStateContext();

  return (
    <div
      data-testid="avatar-card"
      class="w-52 h-32 mx-10 my-5 px-3 py-2 flex justify-center items-center rounded-md bg-blue-200 dark:bg-blue-600/65 shadow border-3 border-blue-100 overflow-auto"
    >
      <Avatar url={props.url} />
      {store.appName}
    </div>
  );
};

interface AvatarProps {
  url: string;
}

const AvatarImage: Component<AvatarProps> = (props) => {
  const [src] = createResource(() => props.url);

  return (
    <Show when={!src.error} fallback={<AvatarPlaceholder />}>
      <img
        data-testid="avatar-image"
        class="mx-3 size-10"
        src={src()!}
        alt=""
      />
    </Show>
  );
};

const AvatarPlaceholder: Component = () => (
  <div
    data-testid="avatar-placeholder"
    class="mx-3 h-10 w-14 relative bg-gray-300 dark:bg-gray-500 rounded flex justify-center items-center"
  >
    <IconNoImage class="[--style:1] absolute -top-[calc(var(--style)/3*1rem)] -right-[calc(var(--style)/3*1rem)] size-[calc(var(--style)*1rem)] bg-amber-500 rounded p-1 stroke-3 stroke-amber-50" />
    <IconUserRound />
  </div>
);

/** 导出供测试：非法 / 请求失败走占位，合法 URL 经 Suspense 后渲染 `<img>` */
export const Avatar: Component<AvatarProps> = (props) => (
  <Suspense fallback={<AvatarPlaceholder />}>
    <AvatarImage url={props.url} />
  </Suspense>
);
