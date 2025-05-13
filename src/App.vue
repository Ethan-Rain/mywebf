<template>
  <div class="app-container">
    <!-- 主内容区域 -->
    <main class="main-content">
      <RouterView />
    </main>

    <!-- 固定底部 -->
    <footer class="icp-footer">
      <p>© 2025 MyWebsite. All rights reserved.</p>
      <p>
        <a href="https://beian.miit.gov.cn"
           target="_blank"
           rel="noopener noreferrer"
           class="icp-link">
          蜀ICP备2023021465号-1
        </a>
      </p>
    </footer>
  </div>
</template>

<style scoped>
/* 主容器布局 */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 主内容区域自适应 */
.main-content {
  flex: 1;
  padding: 20px;
}

/* 统一页脚样式 */
.icp-footer {
  padding: 1.5rem 0;
  background: rgba(0, 0, 0, 0.8);
  color: #c1d7c1;
  text-align: center;
  position: fixed; /* 修改为固定定位 */
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  backdrop-filter: blur(5px);
}

/* 主容器布局 */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-bottom: 80px; /* 添加底部内边距防止内容遮挡 */
}

/* 页脚链接样式 */
.icp-link {
  color: #a8d1a8;
  transition: color 0.3s ease;
  position: relative;
  padding: 0 0.5rem;
}

.icp-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: currentColor;
  transition: width 0.3s ease;
}

.icp-link:hover {
  color: #8db38d;
}

.icp-link:hover::after {
  width: 100%;
}
</style>

<script lang="ts">
// 应用根组件
export default {
  name: 'App',
  setup() {
    return {}
  }
}
</script>
