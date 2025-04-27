import fs from "node:fs";
import path from "node:path";
import { PluginOption } from "vite";

import { getFixturesPath } from "../utils.ts";
import { getProps } from "./getProps.ts";
import defaultHomeTemplate from "./homeTemplate.ts";
import { IPluginParams } from "../../../story-editor/src/types.ts";

export const vueStoryPlugin = (params?: IPluginParams): PluginOption => {
  const defaultStaticPathPrefix = "/static";
  const staticPathPrefix =
    params?.staticPath?.prefix ?? defaultStaticPathPrefix;

  const defaultPreviewPathPrefix = "/preview";
  const previewPathPrefix =
    params?.previewPath?.prefix ?? defaultPreviewPathPrefix;

  const defaultStoryPathPrefix = "/story";
  const storyPathPrefix = params?.storyPath?.prefix ?? defaultStoryPathPrefix;
  const storyPathTest =
    params?.storyPath?.test ?? new RegExp(`^${defaultStoryPathPrefix}`);

  return {
    name: "@escharm/story/react",
    async load(source) {
      if (storyPathTest.test(source)) {
        const queryStringMatch = source.match(/\?(.+)$/);
        const queryString = queryStringMatch?.[1];
        const searchParams = new URLSearchParams(queryString);
        const componentPath = searchParams.get("path");

        if (!componentPath) {
          return null;
        }

        const fixturesPath =
          params?.fixturesPath?.(source) ?? getFixturesPath(source);

        const mockFilePath = path.join(process.cwd(), fixturesPath);

        let mockData: {
          name: string;
          data: Record<string, unknown>;
        }[] = [];

        if (fs.existsSync(mockFilePath)) {
          try {
            mockData = JSON.parse(fs.readFileSync(mockFilePath, "utf-8"));
          } catch (err) {
            console.error("Failed to read mock data:", err);
          }
        } else {
          const rawCode = fs.readFileSync(
            path.join(process.cwd(), componentPath),
            "utf-8",
          );
          // const props = getProps(rawCode);
          mockData = [
            {
              name: "autoCreate",
              data: {},
              // props?.reduce(
              //   (acc, prop) => {
              //     acc[prop.key] = prop.type;
              //     return acc;
              //   },
              //   {} as Record<string, unknown>,
              // ) || {},
            },
          ];
          try {
            fs.mkdirSync(path.dirname(mockFilePath), { recursive: true });
            fs.writeFileSync(
              mockFilePath,
              JSON.stringify(mockData, null, 2),
              "utf-8",
            );
          } catch (err) {
            console.error("Failed to write mock data:", err);
          }
        }

        const code = params?.homeTemplate
          ? params.homeTemplate(componentPath, mockData)
          : defaultHomeTemplate(componentPath, mockData);

        return code;
      }
      return null;
    },
    configureServer: (server) => {
      server.middlewares.use(staticPathPrefix, async (req, res, next) => {
        const originalUrl = req.url || "";
        const urlWithoutPrefix = originalUrl.startsWith(staticPathPrefix)
          ? originalUrl.slice(staticPathPrefix.length)
          : originalUrl;

        const normalizedUrl = urlWithoutPrefix.startsWith("/")
          ? urlWithoutPrefix
          : "/" + urlWithoutPrefix;

        const filePath = path.join(process.cwd(), normalizedUrl);

        try {
          const stat = fs.statSync(filePath);

          if (stat.isDirectory()) {
            interface DirItem {
              name: string;
              href: string;
            }

            const dirs: DirItem[] = [];
            const files: DirItem[] = [];

            fs.readdirSync(filePath).forEach((item) => {
              const itemPath = path.join(filePath, item);
              const isDir = fs.statSync(itemPath).isDirectory();

              // 修复：使用 path.posix.join 确保生成的路径使用正斜杠
              let relativePath = path.posix.join(normalizedUrl, item);
              // 确保路径以 / 开头
              relativePath = relativePath.startsWith("/")
                ? relativePath
                : "/" + relativePath;
              const href = `${staticPathPrefix}${relativePath}`;

              if (isDir) {
                dirs.push({ name: item, href });
              } else {
                files.push({ name: item, href });
              }
            });

            // 生成目录列表 HTML
            const html = `
                <html><body>
                <ul>
                  ${dirs.map((dir) => `<li><a href="${dir.href}">${dir.name}/</a></li>`).join("\n  ")}
                  ${files
                    .map((file) => {
                      const isVue = file.name.endsWith(".vue");
                      // 修复：使用更可读的URL格式
                      const href = isVue
                        ? `${previewPathPrefix}?path=${encodeURI(
                            file.href.replace(staticPathPrefix, ""),
                          )}`
                        : file.href;
                      return `<li><a href="${href}">${file.name}</a></li>`;
                    })
                    .join("\n  ")}
                </ul>
                </body></html>
              `;

            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
          } else {
            // 处理静态文件
            next();
          }
        } catch (err) {
          console.error("static service:", err);
          next();
        }
      });

      server.middlewares.use(previewPathPrefix, async (req, res) => {
        try {
          const reqUrl = req.originalUrl;
          if (!reqUrl) {
            res.writeHead(400);
            res.end("Missing URL");
            return;
          }

          const transformed = await server.transformRequest(
            reqUrl.replace(previewPathPrefix, storyPathPrefix),
          );

          if (!transformed || !transformed.code) {
            res.writeHead(404);
            res.end("Resource not found or cannot be transformed");
            return;
          }

          const content = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Preview</title>
              </head>
              <body>
                <div id="app"></div>
                <script type="module">
                  ${transformed.code}
                </script>
              </body>
            </html>`;

          const transformedContent = await server.transformIndexHtml(
            req.url || "",
            content,
          );

          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(transformedContent);
        } catch (err) {
          console.error("preview service:", err);
          res.writeHead(500);
          res.end("Internal Server Error");
        }
      });
    },
  } satisfies PluginOption;
};
