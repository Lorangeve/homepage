import {
  createContext,
  createEffect,
  createSignal,
  onMount,
  useContext,
} from "solid-js";
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
  const [skipSave, setSkipSave] = createSignal(true);

  onMount(() => {
    try {
      const raw = localStorage.getItem("store");
      if (!raw) return;

      const parsed: StoreType = JSON.parse(raw);
      if (parsed && typeof parsed === "object") setStore(parsed);
    } catch {
      /* 损坏或非 JSON：保持默认 store */
    } finally {
      setSkipSave(false);
    }
  });

  const globalContextValue: GlobalContextValue = {
    store,
    setStore,
  };

  createEffect(() => {
    const serialized = JSON.stringify(store);
    if (skipSave()) return;
    localStorage.setItem("store", serialized);
  });

  return (
    <GlobalContext.Provider value={globalContextValue}>
      {props.children}
    </GlobalContext.Provider>
  );
};
