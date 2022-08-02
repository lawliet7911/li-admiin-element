import {
  createRouter,
  createWebHashHistory,
  NavigationGuardNext,
  RouteLocationRaw,
  RouteRecordRaw,
} from "vue-router"
import { useUserState } from "~/store"
import { useTabsStore } from "~/store/tabs"
import { Guard } from "./routerGuard"
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
        meta: { title: "面板" },
      },
      {
        path: "/demo1",
        name: "demo1",
        component: () => import("~/pages/demo/demo1.vue"),
        meta: { title: "DEmo1" },
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

router.beforeEach(Guard)

export default router
