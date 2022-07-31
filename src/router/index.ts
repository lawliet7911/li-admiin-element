import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"

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

router.beforeEach((to, from, next) => {
  next()
})

export default router
