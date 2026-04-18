import { useGlobalContext } from "./GlobalState";

export default function Counter() {
  const { store, setStore } = useGlobalContext();

  return (
    <>
      <button
        class="btn"
        onClick={() => setStore("count", (c) => (c ?? 0) - 1)}
      >
        -
      </button>
      <label class="px-3 text-center">{store.count ?? 0}</label>
      <button
        class="btn"
        onClick={() => setStore("count", (c) => (c ?? 0) + 1)}
      >
        +
      </button>
    </>
  );
}
