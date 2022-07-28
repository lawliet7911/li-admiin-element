import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("~/pages/Home/index.vue"),
  },
]

let router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
