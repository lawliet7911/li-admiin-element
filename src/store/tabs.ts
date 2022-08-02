import { defineStore } from "pinia"
import { RouteLocationNormalized } from "vue-router"
let router = useRouter()

/**
 * {
 *    '/path1': {
 *       active: false/true,
 *       ...to: RouteLocationNormalized
 *    },
 *    '/path2': {
 *       active: false/true,
 *       ...to: RouteLocationNormalized
 *    }
 * }
 */
export const useTabsStore = defineStore("tabs", {
  state() {
    return {
      tabs: <any>{},
    }
  },
  actions: {
    storeTab(path: string, to: RouteLocationNormalized) {
      if (!path) return
      Object.keys(this.tabs).forEach((k) => {
        this.tabs[k].active = false
      })
      // 不存在
      if (!this.tabs[path]) {
        console.log(to)
        this.tabs[path] = {
          hash: to.hash,
          href: to.href,
          redirectedFrom: to.redirectedFrom,
          matched: to.matched,
          fullPath: to.fullPath,
          path: to.path,
          meta: to.meta,
          name: to.name,
          query: to.query,
          params: to.params,
          active: true,
        }
      } else this.tabs[path].active = true
    },
    activeTab(path: string) {
      router.push
    },
  },
})
