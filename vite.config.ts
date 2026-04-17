import { defineConfig } from "vite";
// import { nitroV2Plugin as nitro } from "@solidjs/vite-plugin-nitro-2";
import { nitro } from "nitro/vite";
import { solidStart } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    solidStart(),
    tailwindcss(),
    nitro({
      preset: "cloudflare-pages",
      cloudflare: {
        deployConfig: true,
        nodeCompat: true,
      },
    }),
  ],
});
