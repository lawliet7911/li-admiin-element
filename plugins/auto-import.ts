import AutoImport from "unplugin-auto-import/vite"
import IconResolver from "unplugin-icons/resolver"

export default function createAutoImportPlugin() {
  return AutoImport({
    imports: [
      "vue",
      "vue-router",
      "pinia",
      "@vueuse/core",
      {
        axios: [
          ["default", "axios"], // import { default as axios } from 'axios',
        ],
      },
    ],
    resolvers: [
      IconResolver({
        componentPrefix: "icon",
        enabledCollections: ["carbon", "ep"],
      }),
    ],
    dts: true, // 生成dts
    vueTemplate: true,
  })
}
