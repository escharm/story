/**
 * @param path path=/src/client/App.tsx
 */
export function getFixturesPath(path: string) {
  return `${path.replace("/src", "/src/stories")}.json`;
}
