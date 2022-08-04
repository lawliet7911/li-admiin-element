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
  let s: ms | undefined
  const filename = /.*\/(\S*)/.exec(id)![1]
  const str = () => s || (s = new ms(code))
  const { descriptor } = parse(code)
  if (!descriptor.script && descriptor.scriptSetup) {
    let result = compileScript(descriptor, { id })
    let name = result.attrs.name
    let lang = result.attrs.lang
    if (name) {
      str().appendLeft(
        0,
        `<script ${lang ? `lang="${lang}"` : ""}>
      import { defineComponent } from 'vue'
      export default defineComponent({
        name: '${name}',
      })
      </script>\n`
      )
      // return codeStr
      const map = str().generateMap()
      // const map = new ms(codeStr).generateDecodedMap()
      map.file = filename
      map.sources = [filename]
      return {
        map: map,
        code: str().toString(),
      }
    }
  } else return null
}
