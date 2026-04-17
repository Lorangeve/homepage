import {
  createEffect,
  createRenderEffect,
  createSignal,
  onMount,
} from "solid-js";
import { useGlobalContext } from "./GlobalState";

export default function Counter() {
  const { store, setStore } = useGlobalContext();

  const count = () => store.count ?? 0;
  const countIns = () => (store.count === null ? 0 : store.count + 1);
  const countDes = () => (store.count === null ? 0 : store.count - 1);

  return (
    <>
      <button class="btn" onClick={() => setStore("count", countDes)}>
        -
      </button>
      <label class="px-3 text-center">{count()}</label>
      <button class="btn" onClick={() => setStore("count", countIns)}>
        +
      </button>
    </>
  );
}
