// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { applyTheme, wakabaTheme } from './theme'

const app = createApp(App)
const pinia = createPinia()

// 注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 应用默认主题
applyTheme(wakabaTheme)

// 使用插件
app.use(pinia)
app.use(router)
app.use(ElementPlus, {
  locale: zhCn,
  size: 'default',
  zIndex: 2000,
})

// 应用挂载
app.mount('#app')

// 在应用加载时应用主题
const savedTheme = loadTheme()
document.documentElement.style.setProperty('--el-color-primary', savedTheme.colors.primary)
