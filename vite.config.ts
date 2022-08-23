import path from "path"
import { defineConfig } from "vite"
import vitePlugins from "./plugins"

export default defineConfig({
  resolve: {
    alias: {
      "~/": `${path.resolve(__dirname, "src")}/`,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "~/assets/styles/mixins.scss";
          @import "~/assets/styles/vars.scss";`, // 预处理
      },
    },
  },
  plugins: vitePlugins(),
  server: {
    host: true,
    open: true,
    cors: true,
    proxy: {
      "^.api": {
        // target: "http://192.168.22.122:5656",
        target: "http://192.168.0.110:5656",
        // target: process.env.API_URL,
        ws: true,
        secure: false,
      },
    },
  },
})
