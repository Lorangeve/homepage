import { describe, expect, test } from "bun:test";
import { createStore } from "solid-js/store";
import { makePersisted } from "@solid-primitives/storage";
import { resolveClientPrefsStorage } from "./ClientPrefsState";

describe("ClientPrefs 存储解析", () => {
  test("在测试/服务端运行时返回类 storage 对象", () => {
    const storage = resolveClientPrefsStorage();
    expect(typeof storage.getItem).toBe("function");
    expect(typeof storage.setItem).toBe("function");
    expect(typeof storage.removeItem).toBe("function");
  });
});

describe("makePersisted 行为", () => {
  test("初始化时从合法 storage 恢复 store", () => {
    const memory = new Map<string, string>();
    memory.set("store", JSON.stringify({ count: 7 }));

    const storage = {
      getItem: (key: string) => memory.get(key) ?? null,
      setItem: (key: string, value: string) => {
        memory.set(key, value);
      },
      removeItem: (key: string) => {
        memory.delete(key);
      },
    };

    const [store, setStore] = makePersisted(createStore({ count: 0 }), {
      name: "store",
      storage,
    });

    expect(store.count).toBe(7);

    setStore("count", (c) => c + 1);
    expect(memory.get("store")).toBe(JSON.stringify({ count: 8 }));
  });

  test("直接传入不完整的 storage 时抛出", () => {
    expect(() =>
      makePersisted(createStore({ count: 0 }), {
        name: "store",
        storage: {} as never,
      }),
    ).toThrow("storage.getItem is not a function");
  });
});
