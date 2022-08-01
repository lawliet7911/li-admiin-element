import { createApp } from "vue"
import App from "./App.vue"

import "~/assets/styles/global.scss"

import { createPinia } from "pinia"
import router from "~/router"
// import zhCn from 'element-plus/es/locale/lang/zh-cn'

const app = createApp(App)
const pinia = createPinia()

app.use(router).use(pinia)
app.mount("#app")