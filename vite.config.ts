import path from "path"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import Components from "unplugin-vue-components/vite"
import AutoImport from "unplugin-auto-import/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import Icons from "unplugin-icons/vite"
import IconsResolver from "unplugin-icons/resolver"

// import dotenv from "dotenv"
// dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

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
  plugins: [
    vue(),
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        "@vueuse/core",
        {
          axios: [
            ["default", "axios"], // import { default as axios } from 'axios',
          ],
        },
      ],
      // 自动将图标以icon开头组件导入 !!!
      resolvers: [
        IconsResolver({
          componentPrefix: "icon",
          enabledCollections: ["carbon", "ep"],
        }),
      ],
      dts: true,
      vueTemplate: true,
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: false,
          enabledCollections: ["ep", "carbon"],
        }), // ep - element-plus / carbon - iconify-carbon
      ],
      dts: true,
    }),
    Icons({
      autoInstall: true,
    }),
  ],
  server: {
    host: true,
    open: true,
    cors: true,
    proxy: {
      "^.api": {
        // target: "http://192.168.22.122:5656",
        target: "http://192.168.0.107:5656",
        // target: process.env.API_URL,
        ws: true,
        secure: false,
      },
    },
  },
})
