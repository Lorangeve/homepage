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

  return (
    <button
      class="w-50 rounded-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 active:border-gray-400 px-8 py-4"
      onClick={() => setStore("count", countIns)}
    >
      Clicks: {count()}
    </button>
  );
}
