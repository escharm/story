import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  "./examples/react-story-example/vite.config.ts",
  "./packages/story/vite.config.ts",
  "./examples/vite-project/vite.config.ts",
  "./examples/vue-story-example/vite.config.ts",
  "./examples/caputre-example/vite.config.ts"
])
