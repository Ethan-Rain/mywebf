// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HomeView from '@/views/HomeView.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'
import ThemeSettings from '@/views/settings/ThemeSettings.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        { 
          path: '', 
          component: HomeView,
          meta: { title: '首页' }
        },
        { 
          path: 'dashboard', 
          component: DashboardView,
          meta: { title: '仪表盘' }
        },
        {
          path: 'settings/theme',
          component: ThemeSettings,
          meta: { title: '主题设置' }
        }
      ]
    }
  ]
})

export default router
