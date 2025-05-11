<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <main class="home-container">
    <section class="hero-section">
      <h1 class="hero-title">欢迎来到我的网站</h1>
      <p class="hero-description">这里是一个精致、美观的首页设计</p>
      <button class="hero-button">了解更多</button>
    </section>

    <section class="features-section">
      <h2 class="section-title">我们的特色</h2>
      <div class="feature-cards">
        <div class="feature-card">
          <img src="../assets/feature1.png" alt="Feature 1" class="feature-image">
          <h3 class="feature-title">特色一</h3>
          <p class="feature-description">描述特色一的内容</p>
        </div>
        <div class="feature-card">
          <img src="../assets/feature2.png" alt="Feature 2" class="feature-image">
          <h3 class="feature-title">特色二</h3>
          <p class="feature-description">描述特色二的内容</p>
        </div>
        <div class="feature-card">
          <img src="../assets/feature3.png" alt="Feature 3" class="feature-image">
          <h3 class="feature-title">特色三</h3>
          <p class="feature-description">描述特色三的内容</p>
        </div>
      </div>
    </section>

    <section class="testimonials-section">
      <h2 class="section-title">用户评价</h2>
      <div class="testimonial-cards">
        <div class="testimonial-card">
          <p class="testimonial-text">"这个网站真的很棒，界面设计非常精致！"</p>
          <p class="testimonial-author">- 用户A</p>
        </div>
        <div class="testimonial-card">
          <p class="testimonial-text">"我非常喜欢这里的特色功能，非常实用！"</p>
          <p class="testimonial-author">- 用户B</p>
        </div>
      </div>
    </section>

    <TheWelcome />
  </main>
</template>

<style scoped>
.home-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  padding: 100px 0;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 40px;
}

.hero-title {
  font-size: 3rem;
  margin-bottom: 20px;
  color: #343a40;
}

.hero-description {
  font-size: 1.2rem;
  color: #495057;
  max-width: 800px;
  margin: 0 auto;
}

.hero-button {
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.hero-button:hover {
  background-color: #0056b3;
}

.features-section {
  margin-bottom: 40px;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 30px;
  color: #343a40;
}

.feature-cards {
  display: flex;
  justify-content: space-between;
}

.feature-card {
  flex: 1;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  text-align: center;
  margin: 0 10px;
}

.feature-image {
  max-width: 100%;
  height: auto;
  margin-bottom: 20px;
}

.feature-title {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #343a40;
}

.feature-description {
  font-size: 1rem;
  color: #495057;
}

.testimonials-section {
  margin-bottom: 40px;
}

.testimonial-cards {
  display: flex;
  justify-content: space-between;
}

.testimonial-card {
  flex: 1;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  text-align: center;
  margin: 0 10px;
}

.testimonial-text {
  font-size: 1rem;
  color: #495057;
  margin-bottom: 10px;
}

.testimonial-author {
  font-size: 0.9rem;
  color: #007bff;
}
</style>