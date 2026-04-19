import { createContext, useContext } from "solid-js";
import type { ParentComponent } from "solid-js";
import { createStore } from "solid-js/store";
import type { SetStoreFunction, Store } from "solid-js/store";

/**
 * 可在 SSR 中安全使用的应用级元数据。
 * 仅存放不依赖浏览器 API 的值。
 */
export interface AppStateStore {
  appName: string;
}

interface AppStateContextValue {
  store: Store<AppStateStore>;
  setStore: SetStoreFunction<AppStateStore>;
}

const AppStateContext = createContext<AppStateContextValue>();

export function useAppStateContext() {
  const ctx = useContext(AppStateContext);
  if (!ctx)
    throw new Error("useAppStateContext 必须在 AppState.Provider 内使用");
  return ctx;
}

export const AppState: ParentComponent = (props) => {
  const [store, setStore] = createStore<AppStateStore>({
    appName: "Lorangeve's Homepage",
  });

  return (
    <AppStateContext.Provider value={{ store, setStore }}>
      {props.children}
    </AppStateContext.Provider>
  );
};
