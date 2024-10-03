import react from "@vitejs/plugin-react";
import { resolve } from "path";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import autoprefixer from "autoprefixer";
import postcss from "postcss";
import { writeFileSync } from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "vrit-design",
      fileName: (format) => `vrit-design.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "tailwindcss"],

      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "react/jsx-runtime",
          tailwindcss: "tailwindcss",
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  plugins: [
    react(),
    dts({ rollupTypes: true, include: ["src"] }),
    {
      name: "build-css",
      writeBundle: async () => {
        const cssInput = '@import "./src/index.css";';
        const result = await postcss([
          tailwindcss("./tailwind.config.js"),
          autoprefixer,
        ]).process(cssInput, { from: undefined });
        writeFileSync("./dist/index.css", result.css);
      },
    },
  ],
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
});
