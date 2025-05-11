<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <div class="logo">图片管理系统</div>
      <nav class="app-nav">
        <RouterLink to="/" class="nav-link">首页</RouterLink>
        <RouterLink to="/about" class="nav-link">关于</RouterLink>
      </nav>
    </header>

    <main class="app-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
/* 基础重置和全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  color: #212529;
}

/* 自定义鼠标样式 */
body {
  cursor: url('/cursors/Normal Select.ani'), auto !important;
}

a, button, .clickable {
  cursor: url('/cursors/Link.ani'), pointer !important;
}

input, textarea {
  cursor: url('/cursors/Text Select.ani'), text !important;
}

/* 应用容器 */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  max-width: 100%;
  position: relative;
  overflow-x: hidden;
}

/* 顶部导航样式 */
.app-header {
  width: 100vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: rgba(0, 123, 255, 0.9);
  color: white;
  position: relative;
  z-index: 10;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.app-nav {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 8px 15px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover,
.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
}

/* 主内容区域 */
.app-content {
  flex: 1;
  width: 100%;
  overflow-x: hidden;
}
.app-content {
  flex: 1;
  width: 100vw;
  max-width: 100%;
  position: relative;
  overflow-x: hidden;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    padding: 1rem;
  }
  
  .logo {
    margin-bottom: 1rem;
  }
  
  .app-nav {
    width: 100%;
    justify-content: center;
  }
}
</style>