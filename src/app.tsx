import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import Nav from "~/components/Nav";
import "./app.css";
import { GlobalState } from "./components/GlobalState";

export default function App() {
  return (
    <Router
      root={(props) => (
        <GlobalState>
          <Nav />
          <Suspense>
            <main class="flex">{props.children}</main>
          </Suspense>
        </GlobalState>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
