// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";
import { GlobalState } from "./components/GlobalState";

mount(() => <StartClient />, document.getElementById("app")!);
