import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 创建 Vue 应用
const app = createApp(App)

// 注册插件（Vue Router、Pinia）
app.use(createPinia())
app.use(router)

// 挂载到 #app
app.mount('#app')  // 只执行一次
