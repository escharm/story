import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tsImport } from "tsx/esm/api";
import path from "path";

const { reactStoryPlugin } = await tsImport("@escharm/story", import.meta.url);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), reactStoryPlugin()],
  resolve: {
    alias: {
      "@escharm/story-editor": path.resolve(
        __dirname,
        "../../packages/story-editor/src",
      ),
    },
  },
});
