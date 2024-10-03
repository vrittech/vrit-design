import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import { resolve } from "path";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

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
        const postcss = await import("postcss");
        const fs = await import("fs/promises");

        const cssContent = await fs.readFile("./src/index.css", "utf-8");
        const result = await postcss
          .default([tailwindcss("./tailwind.config.js"), autoprefixer])
          .process(cssContent, { from: undefined });

        await fs.writeFile("./dist/index.css", result.css);
      },
    },
  ],
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
});
