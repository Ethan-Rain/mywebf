<!-- src/App.vue -->
<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useThemeStore } from './stores/theme'

// 初始化主题
const themeStore = useThemeStore()

// 应用初始主题
onMounted(() => {
  themeStore.initTheme()
})
</script>

<style>
:root {
  /* 默认主题变量 - 会被 JavaScript 动态覆盖 */
  --primary: #4e7c5f;
  --primaryLight: #e8f3e9;
  --accent: #f8c291;
  --textPrimary: #2c3e50;
  --textSecondary: #7f8c8d;
  --borderColor: #d1d9d6;
  --backgroundColor: #f5f9f5;
  --cardBg: #ffffff;
  --menuBg: #4e7c5f;
  --menuText: #ffffff;
  --menuHover: #3a5d4a;
  --menuActive: #f8c291;
  
  /* 滚动条 */
  --scrollbar-thumb: var(--primary);
  --scrollbar-track: var(--backgroundColor);
  
  /* 动画 */
  --transition-base: all 0.3s ease-in-out;
  
  /* Element Plus 主题变量 */
  --el-color-primary: var(--primary);
  --el-color-primary-light-3: var(--primaryLight);
  --el-color-primary-light-5: var(--primaryLight);
  --el-color-primary-light-7: var(--primaryLight);
  --el-color-primary-light-8: var(--primaryLight);
  --el-color-primary-light-9: var(--primaryLight);
  --el-color-primary-dark-2: var(--primary);
}

/* 暗色主题变量 */
[data-theme="dark"] {
  --primary: #409EFF;
  --primaryLight: #1e1e1e;
  --accent: #409EFF;
  --textPrimary: #e6e6e6;
  --textSecondary: #a0a0a0;
  --borderColor: #2c3e50;
  --backgroundColor: #141414;
  --cardBg: #1f1f1f;
  --menuBg: #1f1f1f;
  --menuText: #bfcbd9;
  --menuHover: #2d2d2d;
  --menuActive: #409EFF;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background-color: var(--backgroundColor);
  color: var(--textPrimary);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 0.3s, color 0.3s;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb);
  border-radius: 4px;
}

::-webkit-scrollbar-track {
  background-color: var(--scrollbar-track);
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: var(--transition-base);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式布局 */
@media (max-width: 992px) {
  :root {
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  :root {
    font-size: 13px;
  }
}

/* 全局样式重置 */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 全局链接样式 */
a {
  color: var(--primary);
  text-decoration: none;
  transition: color 0.3s;
}

a:hover {
  color: var(--accent);
}

/* 工具类 */
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.full-width {
  width: 100%;
}

.full-height {
  height: 100%;
}

.pointer {
  cursor: pointer;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.text-left {
  text-align: left;
}

/* 边距工具类 */
.mt-1 { margin-top: 0.25rem; }
.mr-1 { margin-right: 0.25rem; }
.mb-1 { margin-bottom: 0.25rem; }
.ml-1 { margin-left: 0.25rem; }

.mt-2 { margin-top: 0.5rem; }
.mr-2 { margin-right: 0.5rem; }
.mb-2 { margin-bottom: 0.5rem; }
.ml-2 { margin-left: 0.5rem; }

.mt-3 { margin-top: 1rem; }
.mr-3 { margin-right: 1rem; }
.mb-3 { margin-bottom: 1rem; }
.ml-3 { margin-left: 1rem; }

.mt-4 { margin-top: 1.5rem; }
.mr-4 { margin-right: 1.5rem; }
.mb-4 { margin-bottom: 1.5rem; }
.ml-4 { margin-left: 1.5rem; }

.mt-5 { margin-top: 2rem; }
.mr-5 { margin-right: 2rem; }
.mb-5 { margin-bottom: 2rem; }
.ml-5 { margin-left: 2rem; }

.mt-6 { margin-top: 3rem; }
.mr-6 { margin-right: 3rem; }
.mb-6 { margin-bottom: 3rem; }
.ml-6 { margin-left: 3rem; }

/* 内边距工具类 */
.pt-1 { padding-top: 0.25rem; }
.pr-1 { padding-right: 0.25rem; }
.pb-1 { padding-bottom: 0.25rem; }
.pl-1 { padding-left: 0.25rem; }

.pt-2 { padding-top: 0.5rem; }
.pr-2 { padding-right: 0.5rem; }
.pb-2 { padding-bottom: 0.5rem; }
.pl-2 { padding-left: 0.5rem; }

.pt-3 { padding-top: 1rem; }
.pr-3 { padding-right: 1rem; }
.pb-3 { padding-bottom: 1rem; }
.pl-3 { padding-left: 1rem; }

.pt-4 { padding-top: 1.5rem; }
.pr-4 { padding-right: 1.5rem; }
.pb-4 { padding-bottom: 1.5rem; }
.pl-4 { padding-left: 1.5rem; }

.pt-5 { padding-top: 2rem; }
.pr-5 { padding-right: 2rem; }
.pb-5 { padding-bottom: 2rem; }
.pl-5 { padding-left: 2rem; }

.pt-6 { padding-top: 3rem; }
.pr-6 { padding-right: 3rem; }
.pb-6 { padding-bottom: 3rem; }
.pl-6 { padding-left: 3rem; }
</style>
