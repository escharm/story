import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { reactStoryPlugin } from "@escharm/story/react";

import deno from "@deno/vite-plugin";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [deno(), react(), reactStoryPlugin()],
  resolve: {
    alias: {
      "@escharm/story-editor": path.resolve(
        __dirname,
        "../../packages/story-editor/src",
      ),
    },
  },
});
