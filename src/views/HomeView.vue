<script setup lang="ts">
// 由于 TheWelcome 定义但未使用，移除该导入语句
// import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <main class="home-container">
    <section class="hero-section">
      <h1 class="hero-title">欢迎来到我的网站</h1>
      <p class="hero-description">简洁、美观的单页应用</p>
      <button class="hero-button">立即开始</button>
    </section>
  </main>
</template>

<style scoped>
.hero-section {
  text-align: center;
  padding: 80px 20px;
}

.hero-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 20px;
}

.hero-description {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 30px;
}

.hero-button {
  padding: 12px 30px;
  font-size: 1.1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.hero-button:hover {
  background-color: #2980b9;
}
</style>

<TheWelcome />

<!-- 全局样式（移除scoped，专门处理全局属性） -->
<style>
/* 全局鼠标指针（关键修复：移除scoped） */
body {
  cursor: url('/cursors/Normal Select.ani'), auto; /* 对应public/cursors/Normal Select.ani */
}

a,
button,
.clickable {
  cursor: url('/cursors/Link.ani'), pointer; /* 对应public/cursors/Link.ani */
}

input,
textarea,
[contenteditable] {
  cursor: url('/cursors/Text Select.ani'), text; /* 对应public/cursors/Text Select.ani */
}

/* 背景图配置（新增） */
.home-container {
  min-height: 100vh;
  background-image: url('/images/wakaba-bg.jpg'); /* 对应public/images/wakaba-bg.jpg */
  background-size: cover;
  background-position: center;
}
</style>
.home-container { padding: 20px; max-width: 1200px; margin: 0 auto; } .hero-section { text-align:
center; padding: 100px 0; background-color: #f8f9fa; border-radius: 8px; margin-bottom: 40px; }
.hero-title { font-size: 3rem; margin-bottom: 20px; color: #343a40; } .hero-description { font-size:
1.2rem; color: #495057; max-width: 800px; margin: 0 auto; } .hero-button { padding: 10px 20px;
font-size: 1rem; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor:
pointer; transition: background-color 0.3s; } .hero-button:hover { background-color: #0056b3; }
.features-section { margin-bottom: 40px; } .section-title { text-align: center; font-size: 2rem;
margin-bottom: 30px; color: #343a40; } .feature-cards { display: flex; justify-content:
space-between; } .feature-card { flex: 1; background-color: white; border-radius: 8px; padding:
20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); text-align: center; margin: 0 10px; } .feature-image
{ max-width: 100%; height: auto; margin-bottom: 20px; } .feature-title { font-size: 1.5rem;
margin-bottom: 10px; color: #343a40; } .feature-description { font-size: 1rem; color: #495057; }
.testimonials-section { margin-bottom: 40px; } .testimonial-cards { display: flex; justify-content:
space-between; } .testimonial-card { flex: 1; background-color: white; border-radius: 8px; padding:
20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); text-align: center; margin: 0 10px; }
.testimonial-text { font-size: 1rem; color: #495057; margin-bottom: 10px; } .testimonial-author {
font-size: 0.9rem; color: #007bff; }
<!-- 由于不清楚此处多余的 </style> 出现原因，若没有对应的 <style> 标签，应移除该结束标签 -->
<!-- 已移除无效的结束标签 -->
