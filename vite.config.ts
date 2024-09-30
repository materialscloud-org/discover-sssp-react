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
  base: "/discover/sssp/",
  resolve: {
    alias: {
      "@sssp": "/src/SsspApp",
      "@sssp/assets": "/src/SsspApp/assets",
      "@sssp/common": "/src/SsspApp/common",
      "@sssp/components": "/src/SsspApp/components",
      "@sssp/context": "/src/SsspApp/context",
      "@sssp/data": "/src/SsspApp/data",
      "@sssp/models": "/src/SsspApp/models",
      "@sssp/pages": "/src/SsspApp/pages",
      "@sssp/plotting": "/src/SsspApp/plotting",
      "@sssp/services": "/src/SsspApp/services",
    },
  },
});
