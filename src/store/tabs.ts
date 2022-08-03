import { RouteLocationNormalized } from "vue-router"
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
      include: <any>[]
    }
  },
  actions: {
    storeTab(path: string, to: RouteLocationNormalized) {
      if (!path) return
      if(this.include.indexOf(to.name) < 0)
      this.include.push(to.name)
      Object.keys(this.tabs).forEach((k) => {
        this.tabs[k].active = false
      })
      // 不存在
      if (!this.tabs[path]) {
        this.tabs[path] = {
          ...to,
          active: true,
        }
        // this.tabs[path] = {
        //   hash: to.hash,
        //   href: to.href,
        //   redirectedFrom: to.redirectedFrom,
        //   matched: to.matched,
        //   fullPath: to.fullPath,
        //   path: to.path,
        //   meta: to.meta,
        //   name: to.name,
        //   query: to.query,
        //   params: to.params,
        //   active: true,
        // }
      } else this.tabs[path].active = true
    },
    activeTab(path: string) {
      let router = useRouter()
      router.push
    },
    closeTab(path:string) {
      if(!path) return
      let index = this.include.indexOf(path);
      this.include.splice(index,1);
      this.tabs[path] = null
      delete this.tabs[path]
    }
  },
})
