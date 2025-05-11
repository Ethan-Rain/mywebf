import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 挂载应用
app.mount('#app')

// 应用挂载后强制调整DOM宽度
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const fixLayout = () => {
      // 强制设置根元素宽度
      document.documentElement.style.width = '100vw'
      document.body.style.width = '100vw'
      
      // 强制设置应用容器宽度
      const appElement = document.getElementById('app')
      if (appElement) {
        appElement.style.width = '100vw'
        appElement.style.maxWidth = '100vw'
        appElement.style.position = 'absolute'
        appElement.style.left = '0'
        appElement.style.right = '0'
        
        // 查找所有子容器并设置宽度
        const wrapperElements = appElement.querySelectorAll('.app-wrapper, .home-view, .hero-container, .features-container, .statistics-container')
        wrapperElements.forEach(el => {
          ;(el as HTMLElement).style.width = '100vw'
          ;(el as HTMLElement).style.maxWidth = '100vw'
          ;(el as HTMLElement).style.position = 'relative'
          ;(el as HTMLElement).style.left = '0'
          ;(el as HTMLElement).style.right = '0'
        })
      }
      
      // 触发窗口调整事件，强制重新计算布局
      window.dispatchEvent(new Event('resize'))
    }
    
    // 立即执行一次
    fixLayout()
    
    // 0.5秒后再执行一次
    setTimeout(fixLayout, 500)
  }, 100)
})
