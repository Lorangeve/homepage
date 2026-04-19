import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import Nav from "~/components/Nav";
import "./app.css";
import { AppState } from "./state/AppState";
import { ClientPrefsState } from "./state/ClientPrefsState";

export default function App() {
  return (
    <Router
      root={(props) => (
        <AppState>
          <ClientPrefsState>
            <Nav />
            <Suspense>
              <main class="flex">{props.children}</main>
            </Suspense>
          </ClientPrefsState>
        </AppState>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
