import vue from "@vitejs/plugin-vue"
import createAutoImportPlugin from "./auto-import"
import createAutoImportComponentPlugin from "./auto-import-component"
import Icons from "unplugin-icons/vite"
import setupName from "./setup-name"

export default function vitePlugins() {
  const plugins: any[] = []
  plugins.push(vue())
  plugins.push(setupName()) // setup name设置组件name
  plugins.push(createAutoImportPlugin())
  plugins.push(createAutoImportComponentPlugin())
  plugins.push(Icons({ autoInstall: true }))
  return plugins
}
