<template>
  <div class="menu-container">
    <el-menu
      :default-active="activePath"
      class="el-menu-vertical"
      :collapse="isCollapse"
      router
      :collapse-transition="false"
    >
      <div class="logo-container" @click="toggleCollapse">
        <img v-if="!isCollapse" src="/img/wakaba-logo.svg" alt="若葉むつみ" class="logo" />
        <el-icon v-else class="collapse-icon"><Fold /></el-icon>
      </div>

      <el-menu-item index="/home">
        <el-icon><House /></el-icon>
        <span>首页</span>
      </el-menu-item>

      <el-sub-menu index="2">
        <template #title>
          <el-icon><Picture /></el-icon>
          <span>图片管理</span>
        </template>
        <el-menu-item index="/dashboard">
          <el-icon><DataAnalysis /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/gallery">
          <el-icon><PictureRounded /></el-icon>
          <span>图库</span>
        </el-menu-item>
        <el-menu-item index="/upload">
          <el-icon><Upload /></el-icon>
          <span>上传</span>
        </el-menu-item>
        <el-menu-item index="/random-image">
          <el-icon><PictureRounded /></el-icon>
          <span>随机图片</span>
        </el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="3">
        <template #title>
          <el-icon><Setting /></el-icon>
          <span>设置</span>
        </template>
        <el-menu-item index="/settings/profile">
          <el-icon><User /></el-icon>
          <span>个人资料</span>
        </el-menu-item>
        <el-menu-item index="/settings/theme">
          <el-icon><Brush /></el-icon>
          <span>主题设置</span>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Fold,
  House,
  Picture,
  DataAnalysis,
  PictureRounded,
  Upload,
  Setting,
  User,
  Brush
} from '@element-plus/icons-vue'

const isCollapse = ref(false)
const route = useRoute()

const activePath = computed(() => route.path)

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<style scoped>
.menu-container {
  height: 100%;
  background-color: var(--menu-bg);
  transition: width 0.3s;
  position: relative;
  z-index: 100;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
}

/* 菜单项样式 */
.el-menu-vertical:not(.el-menu--collapse) {
  width: 220px;
  min-height: 100%;
  border-right: none;
  background-color: var(--menu-bg) !important;
}

/* 折叠时的菜单样式 */
.el-menu--collapse {
  width: 64px;
  min-height: 100%;
  border-right: none;
  background-color: var(--menu-bg) !important;
}

/* logo 容器 */
.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  cursor: pointer;
  background-color: var(--menu-bg);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
}

.logo {
  height: 32px;
  transition: all 0.3s;
}

.collapse-icon {
  font-size: 24px;
  color: var(--menu-text);
  transition: all 0.3s;
}

/* 菜单项悬停效果 */
:deep(.el-menu-item) {
  margin: 4px 8px;
  border-radius: 6px;
  transition: all 0.3s;
  color: var(--menu-text) !important;
}

:deep(.el-menu-item:hover) {
  background-color: var(--menu-hover) !important;
  color: #fff !important;
}

:deep(.el-menu-item.is-active) {
  background-color: rgba(0, 0, 0, 0.1) !important;
  color: var(--menu-active) !important;
  font-weight: 500;
}

/* 子菜单标题样式 */
:deep(.el-sub-menu__title) {
  color: var(--menu-text) !important;
  margin: 4px 8px;
  border-radius: 6px;
}

:deep(.el-sub-menu__title:hover) {
  background-color: var(--menu-hover) !important;
  color: #fff !important;
}

/* 子菜单内容样式 */
:deep(.el-menu--inline) {
  background-color: rgba(0, 0, 0, 0.1) !important;
}

:deep(.el-menu--inline .el-menu-item) {
  margin: 2px 8px 2px 8px;
  padding-left: 40px !important;
}

/* 菜单项图标 */
:deep(.el-menu-item .el-icon),
:deep(.el-sub-menu__title .el-icon) {
  color: var(--menu-text);
}

:deep(.el-menu-item.is-active .el-icon) {
  color: var(--menu-active);
}

:deep(.el-sub-menu .el-icon) {
  margin-right: 8px;
}

/* 折叠时的样式 */
:deep(.el-menu--collapse .el-sub-menu > .el-sub-menu__title .el-sub-menu__icon-arrow) {
  display: none;
}

:deep(.el-menu--collapse .el-sub-menu) {
  position: relative;
}

:deep(.el-menu--collapse .el-menu--popup) {
  min-width: 200px;
  margin-left: 4px;
  background-color: var(--menu-bg) !important;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 4px 0;
}

/* 添加一些动画效果 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  animation: fadeIn 0.3s ease-out;
}

/* 响应式调整 */
@media (max-width: 768px) {
  :deep(.el-menu--collapse) {
    width: 100%;
  }

  .logo-container {
    justify-content: center;
  }
}
</style>
