// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

// 布局组件
import MainLayout from '@/layouts/MainLayout.vue'

// 页面组件
import WakabaView from '@/views/WakabaView.vue'
import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'
import ThemeSettings from '@/views/settings/ThemeSettings.vue'

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Welcome',
    component: WakabaView,
    meta: { title: '欢迎', requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/home',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      { 
        path: '', 
        name: 'Home',
        component: HomeView,
        meta: { title: '首页', requiresAuth: true }
      },
      { 
        path: 'dashboard', 
        name: 'Dashboard',
        component: DashboardView,
        meta: { title: '仪表盘', requiresAuth: true }
      },
      {
        path: 'settings/theme',
        name: 'ThemeSettings',
        component: ThemeSettings,
        meta: { title: '主题设置', requiresAuth: true }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const isAuthenticated = userStore.checkLogin()
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} | 图片管理系统`
  }
  
  // 检查是否需要登录
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.name === 'Login' && isAuthenticated) {
    // 如果已经登录，访问登录页则跳转到首页
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
