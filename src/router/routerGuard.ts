import {
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteLocationRaw,
} from "vue-router"
import { useUserState,useTabsStore } from "~/store"
const DEFAULT_TITLE: string = "Li管理系统"

export const Guard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  let userState = useUserState()
  let title = useTitle()
  let nextOption: null | RouteLocationRaw = null

  if (to.name != "Login") {
    if ((userState.user as any)?.id) {
      // 不是去登录页
      storeAlive(to)
    } else {
      nextOption = { name: "Login" }
    }
  } else {
    if ((userState.user as any)?.id) {
      nextOption = { name: "Home" }
    } else {
      if (to.params.logout === undefined) {
        nextOption = {
          name: "Login",
          params: { logout: !!to.params.logout ? 1 : 0 },
        }
      }
    }
  }
  title.value = (to.meta.title as string) || DEFAULT_TITLE
  if (!nextOption) next()
  else next(nextOption)
}

const storeAlive = (to: RouteLocationNormalized) => {
  let tabState = useTabsStore()
  // fullPath包含url参数，不同参数不缓存
  tabState.storeTab(to.fullPath, to)
}
