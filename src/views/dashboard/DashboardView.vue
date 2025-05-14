<!-- App.vue 或主布局文件 -->
<template>
  <el-container class="dashboard-container">
    <!-- 主体部分 -->
    <el-container>
      <!-- 可以加一个头部 -->
      <el-header>后台管理系统</el-header>

      <!-- 页面内容：路由展示区域 -->
      <el-main class="content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
</script>

<style scoped>
.dashboard-container {
  height: 100vh;
}
.sidebar {
  background-color: #304156;
  color: #fff;
  overflow-y: auto;
}
.content {
  padding: 20px;
  background-color: #f5f7fa;
  height: 100%;
}
</style>
