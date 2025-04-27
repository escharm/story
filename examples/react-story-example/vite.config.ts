import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { reactStoryPlugin } from "@escharm/story/react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), reactStoryPlugin()],
});
