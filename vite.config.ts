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
      "@sssp": "/src/SsspApp",
      "@sssp/assets": "/src/SsspApp/assets",
      "@sssp/common": "/src/SsspApp/common",
      "@sssp/components": "/src/SsspApp/components",
      "@sssp/context": "/src/SsspApp/context",
      "@sssp/models": "/wsrc/SsspApp/models",
      "@sssp/pages": "/src/SsspApp/pages",
      "@sssp/plotting": "/src/SsspApp/plotting",
      "@sssp/services": "/src/SsspApp/services",
    },
  },
});
