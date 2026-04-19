import { clientOnly } from "@solidjs/start";
import { useClientPrefsContext } from "~/state/ClientPrefsState";

function CounterImpl() {
  const { store, setStore } = useClientPrefsContext();

  return (
    <>
      <button
        class="btn"
        onClick={() => setStore("count", (c: number) => c - 1)}
      >
        减
      </button>
      <label class="px-3 text-center">{store.count}</label>
      <button
        class="btn"
        onClick={() => setStore("count", (c: number) => c + 1)}
      >
        加
      </button>
    </>
  );
}

const CounterShell = clientOnly(() =>
  Promise.resolve({ default: CounterImpl }),
);

export default function Counter() {
  return (
    <CounterShell
      fallback={
        <>
          <button class="btn" disabled>
            减
          </button>
          <label class="px-3 text-center">0</label>
          <button class="btn" disabled>
            加
          </button>
        </>
      }
    />
  );
}
