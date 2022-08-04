import type { RouteLocationNormalized, RouteRecordName } from "vue-router"
import { useRouter } from "vue-router"
/** 
 * eg param
 * {
 *    'name': {
 *       active: false/true,
 *       ...to: RouteLocationNormalized
 *    }
 * }
 */
export type routeStore = RouteLocationNormalized & { active: true | false }
export type routeStoreValue = {
  [key: RouteRecordName]: routeStore
}
export const useTabsStore = defineStore("tabs", {
  state() {
    return {
      tabs: <routeStoreValue>{},
      include: <any>[],
    }
  },
  actions: {
    storeTab(name: RouteRecordName, to: RouteLocationNormalized) {
      if (!name) return
      if (this.include.indexOf(to.name) < 0) this.include.push(to.name)
      Object.keys(this.tabs).forEach((k) => {
        this.tabs[k].active = false
      })
      // 不存在
      if (!this.tabs[name]) {
        this.tabs[name] = {
          ...to,
          active: true,
        }
      } else this.tabs[name].active = true
    },
    async closeTab(name: RouteRecordName): Promise<RouteLocationNormalized | undefined> {
      if (!name) return undefined
      let index = this.include.indexOf(name)
      this.include.splice(index, 1)
      // this.tabs[name] = null
      delete this.tabs[name]
      let rePath: string = ""
      if (this.include[index]) {
        rePath = this.include[index]
      } else {
        rePath = this.include[index - 1]
      }
      return this.tabs[rePath]
    },
  },
})
