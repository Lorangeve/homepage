import { useLocation } from "@solidjs/router";
import { For } from "solid-js";

const NAV_ITEMS = [
  { path: "/", label: "Home" },
  { path: "/demo", label: "Demo" },
  { path: "/about", label: "About" },
];

export default function Nav() {
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname
      ? "border-sky-600"
      : "border-transparent hover:border-sky-600";
  return (
    <nav class="bg-sky-800">
      <ul class="container flex items-center p-3 text-gray-200">
        <For each={NAV_ITEMS}>
          {(item) => (
            <li class={`border-b-2 ${active(item.path)} mx-1.5 sm:mx-6`}>
              <a href={item.path}>{item.label}</a>
            </li>
          )}
        </For>
      </ul>
    </nav>
  );
}
