import {
  createContext,
  createEffect,
  createSignal,
  useContext,
} from "solid-js";
import type { Accessor, ParentComponent, Setter } from "solid-js";
import { createStore } from "solid-js/store";
import type { StoreSetter, Store } from "solid-js/store";

interface GlobalContextValue {
  store: Store<Record<string, any>>;
  setStore: StoreSetter<Record<string, any>>;
  count: Accessor<number>;
  setCount: Setter<number>;
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
  const [count, setCount] = createSignal(0);

  const globalContextValue: GlobalContextValue = {
    store,
    setStore,
    count,
    setCount,
  };

  createEffect(() => {});

  return (
    <GlobalContext.Provider value={globalContextValue}>
      {props.children}
    </GlobalContext.Provider>
  );
};
