import type { Plugin } from "vite"
import { compileScript, parse } from "vue/compiler-sfc"
import ms from "magic-string"

export interface Options {
  name?: boolean
}

export default (options: Options = {}): Plugin => {
  return {
    name: "vite-plugin-vue-setup-name",
    enforce: "pre",
    async transform(code, id) {
      if (id.includes(".vue")) {
        return addScriptName(code, id)
      }
      return null
    },
  }
}

const addScriptName = (code: string, id: string) => {
  const { descriptor } = parse(code)
  if (!descriptor.script && descriptor.scriptSetup) {
    let result = compileScript(descriptor, { id })
    // let result = descriptor.scriptSetup

    let name = result.attrs.name
    let lang = result.attrs.lang
    if (name) {
      let codeStr =
        `\n<script ${lang ? `lang="${lang}"` : ""}>
      import { defineComponent } from 'vue'
      export default defineComponent({
        name: '${name}',
      })
      </script>\n` + code
      // return codeStr
      return {
        code: codeStr,
        map: new ms(codeStr).generateMap(),
      }
    }
  } else return null
  return null
}
