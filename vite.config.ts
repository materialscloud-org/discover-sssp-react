import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  base: "/discover/sssp/",
  resolve: {
    alias: {
      assets: "/src/assets",
      common: "/src/common",
      components: "/src/components",
      data: "/src/data",
      pages: "/src/components/SSSPTable/pages",
    },
  },
});
