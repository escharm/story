import esbuild from "rollup-plugin-esbuild";
import { visualizer } from "rollup-plugin-visualizer";

// 创建通用的输出配置生成函数
const createOutputs = (name) => [
  {
    dir: `dist/umd`,
    name,
    format: "umd",
    entryFileNames: `${name}.js`,
  },
  {
    dir: `dist/esm`,
    name,
    format: "esm",
    entryFileNames: `${name}.js`,
  },
];

// 创建通用的插件配置
const createPlugins = (name) => [
  esbuild.default(),
  visualizer({
    emitFile: true,
    filename: `stats-${name}.html`,
  }),
];

// 主入口配置
const mainConfig = {
  input: ["./src/index.ts"],
  plugins: createPlugins("index"),
  output: createOutputs("index"),
};

// React 入口配置
const reactConfig = {
  input: ["./src/react/index.ts"],
  plugins: createPlugins("react"),
  output: createOutputs("react"),
  external: ["react", "react-dom"],
};

// Vue 入口配置
const vueConfig = {
  input: ["./src/vue/index.ts"],
  plugins: createPlugins("vue"),
  output: createOutputs("vue"),
  external: ["vue"],
};

export default [mainConfig, reactConfig, vueConfig];
