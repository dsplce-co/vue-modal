import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    vue(),
    dts({
      entryRoot: "src",
      insertTypesEntry: true,
      rollupTypes: false,
    }),
    cssInjectedByJsPlugin({
      jsAssetsFilterFunction: ({ fileName }) => fileName === 'index.mjs',
    })
  ],
  build: {
    cssCodeSplit: false,
    lib: {
      entry: {
        index: "src/index.ts",
        resolver: "src/resolver.ts",
      },
      formats: ["es"],
      fileName: (_: string, entryName: string) => `${entryName}.mjs`,
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
