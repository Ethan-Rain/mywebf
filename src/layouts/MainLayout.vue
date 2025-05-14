<!-- src/layouts/MainLayout.vue -->
<template>
  <el-container class="dashboard-container">
    <!-- 侧边栏 -->
    <MenuView />
    
    <!-- 主内容区 -->
    <el-container class="main-container">
      <!-- 顶部导航栏 -->
      <el-header class="main-header">
        <div class="header-content">
          <div class="header-left">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index">
                {{ item.meta?.title || item.name }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <div class="header-actions">
              <el-dropdown>
                <el-button type="primary" text class="theme-switcher">
                  <el-icon><Brush /></el-icon>
                  <span>主题</span>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="changeThemeHandler('wakaba')">
                      <el-icon><Check v-if="currentTheme.name === 'wakaba'" /></el-icon>
                      若叶睦主题
                    </el-dropdown-item>
                    <el-dropdown-item @click="changeThemeHandler('light')">
                      <el-icon><Check v-if="currentTheme.name === 'light'" /></el-icon>
                      亮色主题
                    </el-dropdown-item>
                    <el-dropdown-item @click="changeThemeHandler('dark')">
                      <el-icon><Check v-if="currentTheme.name === 'dark'" /></el-icon>
                      暗色主题
                    </el-dropdown-item>
                    <el-dropdown-item divided @click="router.push('/settings/theme')">
                      <el-icon><Setting /></el-icon>
                      更多主题设置...
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              
              <el-dropdown>
                <div class="user-info">
                  <el-avatar :size="32" src="/img/avatars/wakaba.png" />
                  <span class="username">{{ username }}</span>
                  <el-icon><ArrowDown /></el-icon>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="goToProfile">
                      <el-icon><User /></el-icon>
                      个人中心
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleLogout" divided>
                      <el-icon><SwitchButton /></el-icon>
                      退出登录
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
      </el-header>
      
      <!-- 页面内容 -->
      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowDown, Brush, Check, User, SwitchButton, Setting } from '@element-plus/icons-vue'
import MenuView from '@/views/components/MenuView.vue'
import { useThemeStore } from '@/stores/theme'
import type { Theme } from '@/composables/useTheme'

const route = useRoute()
const router = useRouter()
const themeStore = useThemeStore()

// 获取当前主题
const currentTheme = ref<Theme>(themeStore.currentTheme)

// 监听主题变化
themeStore.$subscribe((mutation, state) => {
  currentTheme.value = state.currentTheme
})

// 切换主题
const changeThemeHandler = (themeName: string) => {
  themeStore.changeTheme(themeName)
}

// 初始化时应用主题
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    themeStore.applyTheme(JSON.parse(savedTheme))
  }
})

// 用户信息
const username = ref('若葉むつみ')

// 面包屑
const breadcrumb = computed(() => {
  return route.matched
    .filter(item => item.meta?.title || item.name)
    .map(item => ({
      path: item.path,
      meta: item.meta || {},
      name: item.name || ''
    }))
})

// 主题状态和逻辑已移至 useTheme 组合式函数

// 跳转到个人中心
const goToProfile = () => {
  router.push('/settings/profile')
}

// 退出登录
const handleLogout = () => {
  // 这里添加退出登录的逻辑
  console.log('退出登录')
  router.push('/login')
}



</script>

<style scoped>
.dashboard-container {
  height: 100vh;
  display: flex;
  overflow: hidden;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background-color: #f5f7fa;
}

.main-header {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  z-index: 10;
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
  height: 100%;
}

.header-actions {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 8px;
}

.theme-switcher {
  margin-right: 8px;
  padding: 0 12px;
  font-size: 16px;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  border: none;
  background: transparent !important;
  color: var(--el-text-color-primary);
}

.theme-switcher:hover {
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9) !important;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 20px;
  transition: all 0.3s;
}

.user-info:hover {
  background-color: #f5f5f5;
}

.username {
  margin: 0 8px;
  color: #333;
  font-size: 14px;
}

.main-content {
  padding: 20px;
  background-color: #f5f7fa;
  overflow-y: auto;
  height: calc(100vh - 60px);
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .main-header {
    padding: 0 16px;
  }
  
  .main-content {
    padding: 16px;
  }
  
  .username {
    display: none;
  }
}
</style>
