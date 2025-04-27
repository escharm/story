import type { ISaveHierarchyParams } from "@escharm/story-editor";
import { Instrumentation } from "@tailwindcss/node";
import fs from "node:fs";
import path from "node:path";
import { ViteDevServer } from "vite";

import { updateHtmlTagClassNames } from "./htmlMatcher.ts";
import DefaultMap from "./TWDefaultMap.ts";
import Root from "./TWRoot.ts";

export const saveHierarchyChange =
  (
    server: ViteDevServer,
    tailwindCSS: string,
    roots: DefaultMap<string, Root>,
  ) =>
  async (params: ISaveHierarchyParams) => {
    const { searchId, hierarchy } = params;

    try {
      const searchParams = new URLSearchParams(searchId);
      const componentPath = searchParams.get("path");

      if (componentPath && hierarchy) {
        const rawCode = fs.readFileSync(
          path.join(process.cwd(), componentPath),
          "utf-8",
        );

        // const value = updateHtmlTagClassNames(
        //   rawCode,
        //   hierarchy.id,
        //   hierarchy.manualData.className,
        // );

        // fs.writeFileSync(path.join(process.cwd(), componentPath), value);
      }

      const generated = await generateTWStyle(roots, tailwindCSS);
      server.ws.send("UPDATE_TW_STYLE", {
        content: generated,
      });
    } catch (error) {
      console.error(error);
    }
  };

export const generateTWStyle = async (
  roots: DefaultMap<string, Root>,
  tailwindCSS: string,
) => {
  using I = new Instrumentation();
  const src = fs.readFileSync(tailwindCSS, "utf-8");
  const root = roots.get(tailwindCSS);
  const generated = await root.generate(src, () => {}, I);
  return generated;
};

export const initTWSTyle =
  (
    server: ViteDevServer,
    tailwindCSS: string,
    roots: DefaultMap<string, Root>,
  ) =>
  async () => {
    const generated = await generateTWStyle(roots, tailwindCSS);

    server.ws.send("UPDATE_TW_STYLE", {
      content: generated,
    });
  };
