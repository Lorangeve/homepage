import { A } from "@solidjs/router";
import Counter from "~/components/Counter";

export default function About() {
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        关于
      </h1>
      <Counter />
      <p class="mt-8">
        访问{" "}
        <a
          href="https://solidjs.com"
          target="_blank"
          class="text-sky-600 hover:underline"
        >
          solidjs.com
        </a>
        ，了解如何构建 Solid 应用。
      </p>
      <p class="my-4">
        <A href="/" class="text-sky-600 hover:underline">
          首页
        </A>
        {" - "}
        <span>关于页</span>
      </p>
    </main>
  );
}
