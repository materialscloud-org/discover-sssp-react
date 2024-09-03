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
      "@sssp": "/src/SSSPTable",
      "@sssp/common": "/src/SSSPTable/common",
      "@sssp/components": "/src/SSSPTable/components",
      "@sssp/context": "/src/SSSPTable/context",
      "@sssp/data": "/src/SSSPTable/data",
      "@sssp/models": "/src/SSSPTable/models",
      "@sssp/pages": "/src/SSSPTable/pages",
      "@sssp/plotting": "/src/SSSPTable/plotting",
      "@sssp/services": "/src/SSSPTable/services",
    },
  },
});
