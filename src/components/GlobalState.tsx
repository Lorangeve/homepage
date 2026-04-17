import {
  createContext,
  createEffect,
  createSignal,
  onMount,
  useContext,
} from "solid-js";
import type { Accessor, ParentComponent, Setter } from "solid-js";
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
  const [store, setStore] = createStore({});

  let isInitialLoad = true;
  onMount(() => {
    try {
      const raw = localStorage.getItem("store");
      if (!raw) throw new Error("store not found");

      const parsed: StoreType = JSON.parse(raw!);

      if (parsed) setStore(parsed);

      console.log(parsed);
    } catch {
      /* 损坏或非 JSON：保持默认 store / count */
    } finally {
      isInitialLoad = false;
    }
  });

  const globalContextValue: GlobalContextValue = {
    store,
    setStore,
  };

  createEffect(() => {
    if (!isInitialLoad) {
      localStorage.setItem("store", JSON.stringify(store));
      console.log(localStorage.getItem("store"));
    }
  });

  return (
    <GlobalContext.Provider value={globalContextValue}>
      {props.children}
    </GlobalContext.Provider>
  );
};
