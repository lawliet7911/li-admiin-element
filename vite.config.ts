import path from "path"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import Components from "unplugin-vue-components/vite"
import AutoImport from "unplugin-auto-import/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import Icons from "unplugin-icons/vite"
import IconsResolver from "unplugin-icons/resolver"
export default defineConfig({
  resolve: {
    alias: {
      "~/": `${path.resolve(__dirname, "src")}/`,
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
            // default imports
            ["default", "axios"], // import { default as axios } from 'axios',
          ],
        },
      ],
      dts: true,
      vueTemplate: true,
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({ prefix: false, enabledCollections: ["ep", "carbon"] }),
      ],
      dts: true,
    }),
    Icons({
      autoInstall: true
    }),
  ],
  server: {
    host: true,
    open: true,
  },
})
