import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import IconsResolver from "unplugin-icons/resolver"

export default function createAutoImportComponentPlugin() {
  return (
    Components({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: false,
          enabledCollections: ["ep", "carbon"],
        }),
      ],
      dts: true,
    })
  )
}
