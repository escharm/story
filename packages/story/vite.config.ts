import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import react from "@vitejs/plugin-react";

import { reactStoryPlugin } from "./src/react/index.ts";

export default defineConfig({
  plugins: [
    deno(),
    react(),
    tailwindcss(),
    reactStoryPlugin({
      staticPath: {
        prefix: "/static",
      },
      previewPath: {
        prefix: "/preview",
      },
      storyPath: {
        prefix: "/story",
        test: new RegExp(`^/story`),
      },
      fixturesPath(_path) {
        return `${_path.replace("/src", "/src/stories")}.json`;
      },
      tailwindCSS: path.resolve(__dirname, "./src/client/App.css"),
    }),
  ],
  resolve: {
    alias: {
      "@escharm/story-editor": path.resolve(
        __dirname,
        "../../packages/story-editor/src",
      ),
    },
  },
});
