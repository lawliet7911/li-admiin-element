import { createApp } from "vue"
import "./style.css"
import App from "./App.vue"
// import zhCn from 'element-plus/es/locale/lang/zh-cn'
import "element-plus/dist/index.css"
import "element-plus/theme-chalk/dark/css-vars.css"
import "~/assets/main.scss"
import { createPinia } from "pinia"
import router from "~/router"
const app = createApp(App)
const pinia = createPinia()
app.use(router).use(pinia)

app.mount("#app")