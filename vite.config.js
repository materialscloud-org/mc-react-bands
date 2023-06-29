import { resolve } from "path";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import libCss from "vite-plugin-libcss";

import * as packageJson from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), libCss()],
  build: {
    cssCodeSplit: true,
    lib: {
      entry: resolve(__dirname, "src/lib/index.jsx"),
      name: "mc-react-bands",
      fileName: (format) => `mc-react-bands.${format}.js`,
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies)],
    },
  },
});
