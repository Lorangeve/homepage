import { createContext, useContext } from "solid-js";
import type { ParentComponent } from "solid-js";
import { isServer } from "solid-js/web";
import { createStore } from "solid-js/store";
import type { SetStoreFunction, Store } from "solid-js/store";
import { makePersisted } from "@solid-primitives/storage";

/**
 * 用来存放依赖浏览器 API 的值。
 */
export interface ClientPrefsStore {
  count: number;
}

interface ClientPrefsContextValue {
  store: Store<ClientPrefsStore>;
  setStore: SetStoreFunction<ClientPrefsStore>;
}

const ClientPrefsContext = createContext<ClientPrefsContextValue>();

type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

export const noopStorage: StorageLike = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export function resolveClientPrefsStorage(): StorageLike {
  return isServer ? noopStorage : localStorage;
}

export function useClientPrefsContext() {
  const ctx = useContext(ClientPrefsContext);
  if (!ctx)
    throw new Error("useClientPrefsContext 必须在 ClientPrefs.Provider 内使用");
  return ctx;
}

export const ClientPrefsState: ParentComponent = (props) => {
  const [store, setStore] = makePersisted(
    createStore<ClientPrefsStore>({ count: 0 }),
    {
      name: "store",
      storage: resolveClientPrefsStorage(),
    },
  );

  return (
    <ClientPrefsContext.Provider value={{ store, setStore }}>
      {props.children}
    </ClientPrefsContext.Provider>
  );
};
