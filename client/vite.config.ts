import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJSX from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJSX()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
      "/api/state": {
        target: "ws://localhost:4000",
        changeOrigin: true,
        ws: true,
      },
    },
  },
  resolve: {
    alias: [
      { find: "@", replacement: "/src" },
      { find: "server", replacement: "/../server" },
    ],
  },
});
