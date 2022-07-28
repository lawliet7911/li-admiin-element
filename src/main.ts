import { createApp } from "vue"
import "./style.css"
import App from "./App.vue"
// import zhCn from 'element-plus/es/locale/lang/zh-cn'
import "element-plus/dist/index.css"
import "element-plus/theme-chalk/dark/css-vars.css"
import "~/assets/main.scss"

import router from "~/router"
const app = createApp(App)

app.use(router)

app.mount("#app")