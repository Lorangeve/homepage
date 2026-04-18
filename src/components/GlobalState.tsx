import { createContext, createEffect, on, onMount, useContext } from "solid-js";
import type { ParentComponent } from "solid-js";
import { createStore } from "solid-js/store";
import type { SetStoreFunction, Store } from "solid-js/store";

type StoreType = Record<string, any>;

interface GlobalContextValue {
  store: Store<StoreType>;
  setStore: SetStoreFunction<StoreType>;
}

const GlobalContext = createContext<GlobalContextValue>();

export function useGlobalContext() {
  const ctx = useContext(GlobalContext);

  if (!ctx) throw new Error("应该在 ContextProvider 中使用！");
  return ctx;
}

export interface GlobalStateProps {}

export const GlobalState: ParentComponent<GlobalStateProps> = (props) => {
  const [store, setStore] = createStore<StoreType>({});

  onMount(() => {
    try {
      const raw = localStorage.getItem("store");
      if (raw) {
        const parsed: StoreType = JSON.parse(raw);
        if (parsed && typeof parsed === "object") setStore(parsed);
      }
    } catch {
      /* 损坏或非 JSON：保持默认 store */
    }

    // 先完成 hydrate，再监听后续变化；defer 避免注册后立即写一次。
    createEffect(
      on(
        () => JSON.stringify(store),
        (serialized) => {
          localStorage.setItem("store", serialized);
        },
        { defer: true },
      ),
    );
  });

  const globalContextValue: GlobalContextValue = {
    store,
    setStore,
  };

  return (
    <GlobalContext.Provider value={globalContextValue}>
      {props.children}
    </GlobalContext.Provider>
  );
};
