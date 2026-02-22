import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      protocolImports: true,
    }),
  ],
  server: {
    port: 3000,
  },
  // Set base path for gh-pages (https://materialscloud-org.github.io/discover-sssp-react/)
  base: "/discover-sssp-react/",
  resolve: {
    alias: {
      "@sssp": "/src/sssp",
      "@sssp/assets": "/src/sssp/assets",
      "@sssp/common": "/src/sssp/common",
      "@sssp/components": "/src/sssp/components",
      "@sssp/context": "/src/sssp/context",
      "@sssp/models": "/src/sssp/models",
      "@sssp/pages": "/src/sssp/pages",
      "@sssp/plotting": "/src/sssp/plotting",
      "@sssp/services": "/src/sssp/services",
    },
  },
});
