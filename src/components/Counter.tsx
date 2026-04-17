import { createSignal } from "solid-js";
import { useGlobalContext } from "./GlobalState";

export default function Counter() {
  // const [count, setCount] = createSignal(0);
  const { count, setCount } = useGlobalContext();
  return (
    <button
      class="w-50 rounded-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 active:border-gray-400 px-8 py-4"
      onClick={() => setCount((prev) => prev + 1)}
    >
      Clicks: {count()}
    </button>
  );
}
