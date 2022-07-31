import { createRouter, createWebHashHistory, NavigationGuardNext, RouteRecordRaw } from "vue-router"
import { useUserState } from "~/store"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("~/pages/Home/index.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("~/pages/login/index.vue"),
  },
]

let router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next: NavigationGuardNext) => {
  let userState = useUserState()
  // 未登录
  if (to.name != "Login") {
    if ((userState.user as any)?.id) {
      next()
    } else {
      next({ name: "Login" })
    }
  } else {
    // next();
    if ((userState.user as any)?.id) {
      next({ name: "Home" })
    } else {
      if (to.params.logout !== undefined) next()
      else {
        next({ name: "Login", params: { logout: !!to.params.logout ? 1 : 0 } })
      }
    }
  }
  next()
})

export default router
