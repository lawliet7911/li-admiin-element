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
      Object.keys(this.tabs).forEach((key) => {
        this.tabs[key].active = false
      })
      // 不存在
      if (!this.tabs[path]) this.tabs[path] = { ...to, active: true }
    },
    activeTab(path: string) {
      router.push
    },
  },
})
