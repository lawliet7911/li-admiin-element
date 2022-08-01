import {
  createRouter,
  createWebHashHistory,
  NavigationGuardNext,
  RouteLocationRaw,
  RouteRecordRaw,
} from "vue-router"
import { useUserState } from "~/store"
const DEFAULT_TITLE: string = "Li管理系统"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    alias: "/home",
    component: () => import("~/pages/Home/index.vue"),
    children: [
      {
        path: "/",
        redirect: "dashboard",
      },
      {
        path: "/dashboard",
        name: "DashBoard",
        component: () => import("~/pages/home/dashboard.vue"),
      },
      {
        path: "/demo1",
        name: "demo1",
        component: () => import("~/pages/demo/demo1.vue"),
      },
      {
        path: "/:all(.*)*",
        name: "PageNotFound",
        component: () => import("~/pages/error-page/[...all].vue"),
        meta: {
          title: "找不到页面",
        },
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "登录",
    },
    component: () => import("~/pages/login/index.vue"),
  },
]

let router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next: NavigationGuardNext) => {
  let userState = useUserState()
  let title = useTitle()
  let nextOption: null | RouteLocationRaw = null
  // 未登录
  if (to.name != "Login") {
    if ((userState.user as any)?.id) {
      // next()
    } else {
      // next({ name: "Login" })
      nextOption = { name: "Login" }
    }
  } else {
    if ((userState.user as any)?.id) {
      nextOption = { name: "Home" }
    } else {
      if (to.params.logout !== undefined) next()
      else {
        nextOption = {
          name: "Login",
          params: { logout: !!to.params.logout ? 1 : 0 },
        }
      }
    }
  }
  title.value = (to.meta.title as string) || DEFAULT_TITLE
  if(!nextOption) next()
  else next(nextOption)
})

export default router
