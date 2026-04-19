import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { SolidPlugin } from "@dschz/bun-plugin-solid";

const repoRoot = path.join(import.meta.dir, "..", "..");
const lucideSource = path.join(repoRoot, "node_modules", "lucide-solid", "dist", "source");

/** lucide-solid ESM 在 SSR 会走 `template()`；把 `icons/*` 指到 `dist/source` 的 JSX。 */
function lucideSolidIconsForSsr(): Bun.BunPlugin {
  return {
    name: "lucide-solid-icons-source",
    setup(build) {
      build.onResolve({ filter: /^lucide-solid\/icons\/[^/]+$/ }, (args) => {
        const icon = args.path.replace(/^lucide-solid\/icons\//, "");
        if (icon.includes("..")) return;
        return { path: path.join(lucideSource, "icons", `${icon}.jsx`) };
      });
    },
  };
}

/** 单文件 SSR 测试入口 → Bun 可 `import` 的 ESM；用完 `dispose()`。 */
export async function buildSolidSsrEntryModule<T extends object>(
  entryAbsolutePath: string,
): Promise<{ module: T; dispose: () => Promise<void> }> {
  const outdir = await mkdtemp(path.join(tmpdir(), "solid-ssr-test-"));
  const built = await Bun.build({
    entrypoints: [entryAbsolutePath],
    outdir,
    target: "bun",
    format: "esm",
    tsconfig: path.join(repoRoot, "tsconfig.json"),
    plugins: [lucideSolidIconsForSsr(), SolidPlugin({ generate: "ssr", hydratable: false })],
  });
  if (!built.success) {
    await rm(outdir, { recursive: true, force: true });
    throw new Error(built.logs.map((l) => l.message).join("\n"));
  }
  const base = path.basename(entryAbsolutePath).replace(/\.tsx?$/, "");
  const outfile = path.join(outdir, `${base}.js`);
  const module = (await import(pathToFileURL(outfile).href)) as T;
  return {
    module,
    dispose: () => rm(outdir, { recursive: true, force: true }),
  };
}
