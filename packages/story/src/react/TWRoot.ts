import fsPromise from "node:fs/promises";

import {
  compile,
  Features,
  type Instrumentation,
  normalizePath,
} from "@tailwindcss/node";
import { clearRequireCache } from "@tailwindcss/node/require-cache";
import { Scanner } from "@tailwindcss/oxide";
import path from "node:path";

export function idToPath(id: string) {
  return path.resolve(id.replace(/\?.*$/, ""));
}

const DEBUG = process.env.DEBUG;

class Root {
  // The lazily-initialized Tailwind compiler components. These are persisted
  // throughout rebuilds but will be re-initialized if the rebuild strategy is
  // set to `full`.
  private compiler?: Awaited<ReturnType<typeof compile>>;

  // The lazily-initialized Tailwind scanner.
  private scanner?: Scanner;

  // List of all candidates that were being returned by the root scanner during
  // the lifetime of the root.
  private candidates: Set<string> = new Set<string>();

  // List of all build dependencies (e.g. imported  stylesheets or plugins) and
  // their last modification timestamp. If no mtime can be found, we need to
  // assume the file has always changed.
  private buildDependencies = new Map<string, number | null>();

  constructor(
    private id: string,
    private base: string,

    private customCssResolver: (
      id: string,
      base: string,
    ) => Promise<string | false | undefined>,
    private customJsResolver: (
      id: string,
      base: string,
    ) => Promise<string | false | undefined>,
  ) {}

  // Generate the CSS for the root file. This can return false if the file is
  // not considered a Tailwind root. When this happened, the root can be GCed.
  public async generate(
    content: string,
    _addWatchFile: (file: string) => void,
    I: Instrumentation,
  ): Promise<string | false> {
    const inputPath = idToPath(this.id);

    function addWatchFile(file: string) {
      // Don't watch the input file since it's already a dependency anc causes
      // issues with some setups (e.g. Qwik).
      if (file === inputPath) {
        return;
      }

      // Scanning `.svg` file containing a `#` or `?` in the path will
      // crash Vite. We work around this for now by ignoring updates to them.
      //
      // https://github.com/tailwindlabs/tailwindcss/issues/16877
      if (/[#?].*\.svg$/.test(file)) {
        return;
      }
      _addWatchFile(file);
    }

    const requiresBuildPromise = this.requiresBuild();
    const inputBase = path.dirname(path.resolve(inputPath));

    if (!this.compiler || !this.scanner || (await requiresBuildPromise)) {
      clearRequireCache(Array.from(this.buildDependencies.keys()));
      this.buildDependencies.clear();

      this.addBuildDependency(idToPath(inputPath));

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      DEBUG && I.start("Setup compiler");
      const addBuildDependenciesPromises: Promise<void>[] = [];
      this.compiler = await compile(content, {
        base: inputBase,
        shouldRewriteUrls: true,
        onDependency: (path) => {
          addWatchFile(path);
          addBuildDependenciesPromises.push(this.addBuildDependency(path));
        },

        customCssResolver: this.customCssResolver,
        customJsResolver: this.customJsResolver,
      });
      await Promise.all(addBuildDependenciesPromises);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      DEBUG && I.end("Setup compiler");

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      DEBUG && I.start("Setup scanner");

      const sources = (() => {
        // Disable auto source detection
        if (this.compiler.root === "none") {
          return [];
        }

        // No root specified, auto-detect based on the `**/*` pattern
        if (this.compiler.root === null) {
          return [{ base: this.base, pattern: "**/*", negated: false }];
        }

        // Use the specified root
        return [{ ...this.compiler.root, negated: false }];
      })().concat(this.compiler.sources);

      this.scanner = new Scanner({ sources });
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      DEBUG && I.end("Setup scanner");
    } else {
      for (const buildDependency of this.buildDependencies.keys()) {
        addWatchFile(buildDependency);
      }
    }

    if (
      !(
        this.compiler.features &
        (Features.AtApply |
          Features.JsPluginCompat |
          Features.ThemeFunction |
          Features.Utilities)
      )
    ) {
      return false;
    }

    if (this.compiler.features & Features.Utilities) {
      // This should not be here, but right now the Vite plugin is setup where we
      // setup a new scanner and compiler every time we request the CSS file
      // (regardless whether it actually changed or not).
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      DEBUG && I.start("Scan for candidates");
      for (const candidate of this.scanner.scan()) {
        this.candidates.add(candidate);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      DEBUG && I.end("Scan for candidates");
    }

    if (this.compiler.features & Features.Utilities) {
      // Watch individual files found via custom `@source` paths
      for (const file of this.scanner.files) {
        addWatchFile(file);
      }

      // Watch globs found via custom `@source` paths
      for (const glob of this.scanner.globs) {
        if (glob.pattern[0] === "!") continue;

        let relative = path.relative(this.base, glob.base);
        if (relative[0] !== ".") {
          relative = "./" + relative;
        }
        // Ensure relative is a posix style path since we will merge it with the
        // glob.
        relative = normalizePath(relative);

        addWatchFile(path.posix.join(relative, glob.pattern));

        const root = this.compiler.root;

        if (root !== "none" && root !== null) {
          const basePath = normalizePath(path.resolve(root.base, root.pattern));

          const isDir = await fsPromise.stat(basePath).then(
            (stats) => stats.isDirectory(),
            () => false,
          );

          if (!isDir) {
            throw new Error(
              `The path given to \`source(…)\` must be a directory but got \`source(${basePath})\` instead.`,
            );
          }
        }
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    DEBUG && I.start("Build CSS");
    const result = this.compiler.build([...this.candidates]);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    DEBUG && I.end("Build CSS");

    return result;
  }

  private async addBuildDependency(path: string) {
    let mtime: number | null = null;
    try {
      mtime = (await fsPromise.stat(path)).mtimeMs;
    } catch {
      /* empty */
    }
    this.buildDependencies.set(path, mtime);
  }

  private async requiresBuild(): Promise<boolean> {
    for (const [path, mtime] of this.buildDependencies) {
      if (mtime === null) return true;
      try {
        const stat = await fsPromise.stat(path);
        if (stat.mtimeMs > mtime) {
          return true;
        }
      } catch {
        return true;
      }
    }
    return false;
  }
}

export default Root;
