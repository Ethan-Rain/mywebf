<template>
  <div class="home">
    <!-- 脉冲环 -->
    <div class="ring ring-xsmall"></div>
    <div class="ring ring-small"></div>
    <div class="ring ring-large"></div>

    <!-- 背景小颗粒 -->
    <div class="dots-bg"></div>

    <div class="content">
      <div class="decor-line"></div>
      <div class="text-block">
        <h1 class="title" role="banner">Wakaba Mutsumi</h1>
        <div class="underline"></div>
        <el-button
          class="enter-btn"
          type="primary"
          size="large"
          @click="goToLogin"
          @keyup.enter="goToLogin"
          tabindex="0"
          aria-label="进入系统"
        >
          🥒 进入系统
        </el-button>
      </div>
    </div>

    <img
      class="character-img"
      src="/img/Wakaba.png"
      alt="Wakaba Mutsumi"
      loading="lazy"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const goToLogin = () => router.push('/login')
</script>

<style scoped>
/* 变量定义移动到 .home 上 */
.home {
  --main-green: #4e7c5f;
  --accent-green: #78b38b;

  position: relative;
  display: flex;
  align-items: center;
  height: 100vh;
  padding: 0 60px;
  background: #fff;
  overflow: hidden;
}

/* 脉冲环 */
.ring {
  position: absolute;
  border-radius: 50%;
  animation: pulse 3s ease-out infinite;
  z-index: 1;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}
.ring-xsmall {
  width: 120px; height: 120px;
  top: 34%; left: 14%;
  border: 2px solid var(--accent-green);
  animation-delay: 0.8s;
}
.ring-small {
  width: 220px; height: 220px;
  top: 28%; left: 8%;
  border: 2px solid var(--main-green);
  animation-delay: 0s;
}
.ring-large {
  width: 340px; height: 340px;
  top: 24%; left: 4%;
  border: 2px solid var(--accent-green);
  animation-delay: 1.5s;
}
@keyframes pulse {
  0%   { transform: scale(0.8); opacity: 0.4; }
  70%  { transform: scale(1.2); opacity: 0; }
  100% { transform: scale(1.2); opacity: 0; }
}

/* 背景小颗粒 */
.dots-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.dots-bg::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(78,124,95,0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}

/* 文字区 */
.content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  height: 100%;
  padding-left: 200px;
}
.decor-line {
  width: 4px; height: 180px;
  background: var(--accent-green);
  margin-right: 24px;
  border-radius: 2px;
}
.text-block {
  display: flex;
  flex-direction: column;
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(6px);
  padding: 16px;
  border-radius: 8px;
}

/* 排版 */
.title {
  font-size: clamp(2rem, 5vw, 3rem);
  color: var(--main-green);
  margin: 0 0 12px;
}
.underline {
  width: clamp(40px,10vw,80px);
  height: 0.3rem;
  background: linear-gradient(90deg,var(--main-green),var(--accent-green));
  margin-bottom: 24px;
}

/* 按钮 */
.enter-btn {
  position: relative;
  overflow: hidden;
  width: clamp(140px,20vw,180px);
  font-size: clamp(1rem,2vw,1.1rem);
  padding: clamp(8px,1.5vw,12px) clamp(20px,3vw,32px);
  border-radius: 24px;
  background: linear-gradient(145deg,var(--main-green),var(--accent-green));
  box-shadow: 0 6px 12px rgba(58,93,74,0.3);
  transition: transform 0.2s, box-shadow 0.2s;
}
.enter-btn:focus-visible {
  outline: 2px solid var(--accent-green);
  outline-offset: 2px;
}
.enter-btn::before {
  content:"";
  position:absolute; top:0; left:-100%;
  width:100%; height:100%;
  background: rgba(255,255,255,0.2);
  transform: skewX(-25deg);
}
.enter-btn:hover::before {
  left:200%;
  transition:left 0.8s ease;
}
.enter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(58,93,74,0.4);
}

/* 立绘 */
.character-img {
  position: absolute;
  right: 0; bottom: 0;
  height: 100%; object-fit: contain;
  z-index: 2;
  filter: drop-shadow(-10px 0 10px rgba(0,0,0,0.1));
}

/* 响应式 & 无障碍 */
@media (max-width: 1200px) {
  .content { padding-left: 100px; max-width:45%; }
  .ring-xsmall { width:100px;height:100px;left:10%;top:36%; }
  .ring-small  { width:180px;height:180px;left:8%; top:32%; }
  .ring-large  { width:280px;height:280px;left:4%; top:28%; }
}
@media (max-width: 768px) {
  .home { flex-direction:column;justify-content:center;padding:40px; }
  .content { order:2;padding-left:0;text-align:center;align-items:center; }
  .decor-line { display:none; }
  .character-img { position:relative;width:60%;height:auto;margin-top:20px; }
}
@media (prefers-reduced-motion) {
  .ring, .enter-btn, .character-img { animation:none!important; transition:none!important; }
}
</style>
