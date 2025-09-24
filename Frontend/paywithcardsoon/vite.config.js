import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis",
    "process.env": {}
  },
  resolve: {
    alias: {
      buffer: 'buffer/',
      process: 'process/browser',
    },
  },
  build: {
    target: ['es2020'],
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  optimizeDeps: {
    include: ['@thirdweb-dev/sdk', '@thirdweb-dev/react-core'],
    exclude: ['@thirdweb-dev/contracts-js'],
    esbuildOptions: {
      target: 'es2020',
      supported: { bigint: true }
    }
  }
})
