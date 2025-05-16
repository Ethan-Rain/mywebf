<template>
  <main class="home">

    <!-- 背景小颗粒 -->
    <div class="dots-bg" aria-hidden="true"></div>

    <!-- 行星轨道系统，替换左侧原先的装饰线条 -->
    <div class="orbit-system" aria-hidden="true">
      <div class="orbit orbit1">
        <div class="planet"></div>
      </div>
      <div class="orbit orbit2">
        <div class="planet earth">
          <div class="moon-orbit">
            <div class="moon"></div>
          </div>
        </div>
      </div>
      <div class="orbit orbit3">
        <div class="planet"></div>
      </div>
    </div>

    <!-- 文字内容区；背景设为透明 -->
    <div class="content">
      <div class="text-block">

        <h1 class="title"> 若葉 睦</h1>
        <h1 class="title">Wakaba Mutsumi</h1>

        <div class="underline" aria-hidden="true"></div>
        <el-button
          class="enter-btn"
          type="primary"
          size="large"
          @click="handleLogin"
          @keyup.enter="handleLogin"
          @keyup.space="handleLogin"
          aria-label="进入系统"
        >
          🥒 进入系统
        </el-button>
      </div>
    </div>

    <!-- 角色立绘 -->
    <img
      class="character-img"
      :src="imageUrl"
      alt="Wakaba Mutsumi"
      loading="lazy"
      @error="handleImageError"
    />
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const imageUrl = ref('/img/Wakaba.png')

const handleLogin = (event: KeyboardEvent | MouseEvent) => {
  if (event instanceof KeyboardEvent && event.key !== 'Enter' && event.key !== ' ') {
    return
  }
  router.push('/login')
}

const handleImageError = () => {
  console.error('Failed to load character image')
  // 如果需要可设置备用图片，例如： imageUrl.value = '/fallback-image.png'
}
</script>

<style scoped>
/* 配色——采用柔和清新的“若叶睦风”风格 */
:root {
  --main-green: #7ecfa1;         /* 主色：柔和嫩绿 */
  --accent-green: #a8e0c8;       /* 辅助色：亮一点的清新绿 */
  --text-shadow-color: rgba(60,120,80,0.3);
  --button-text-color: #ffffff;
  --button-hover-color: rgba(255,255,255,0.85);
}

/* 整体布局 */
.home {
  position: relative;
  display: flex;
  align-items: center;
  height: 100vh;
  padding: 0 60px;
  /* 背景渐变营造轻柔氛围 */
  background: radial-gradient(circle at center, #f0fdfc, #ffffff);
  overflow: hidden;
}

@keyframes pulse {
  0%   { transform: scale(0.8); opacity: 0.4; }
  70%  { transform: scale(1.2); opacity: 0; }
  100% { transform: scale(1.2); opacity: 0; }
}

/* 背景颗粒 */
.dots-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.dots-bg::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(120,179,139,0.1) 2px, transparent 2px);
  background-size: 30px 30px;
}

/* 行星轨道系统 —— 放置在左侧代替原装饰线条 */
.orbit-system {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 400px;
  height: 400px;
  z-index: 1;
}
.orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px dashed rgba(120, 179, 139, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: rotateOrbit 20s linear infinite;
}
.orbit1 {
  width: 200px;
  height: 200px;
}
.orbit2 {
  width: 300px;
  height: 300px;
  animation-duration: 30s;
}
.orbit3 {
  width: 400px;
  height: 400px;
  animation-duration: 40s;
}
.planet {
  width: 12px;
  height: 12px;
  background-color: rgba(120, 179, 139, 0.3);
  border-radius: 50%;
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
}
.earth {
  background-color: rgba(120, 179, 139, 0.3);
  position: absolute;
}
.moon-orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30px;
  height: 30px;
  border: 1px dashed rgba(120, 179, 139, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: rotateOrbit 3s linear infinite reverse;
}
.moon {
  width: 6px;
  height: 6px;
  background-color: #ccc;
  border-radius: 50%;
  position: absolute;
  top: -3px;
  left: 50%;
  transform: translateX(-50%);
}
@keyframes rotateOrbit {
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

/* 文字内容区 */
.content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  height: 100%;
  padding-left: 200px;
}
.text-block {
  display: flex;
  flex-direction: column;
  /* 背景设为透明 */
  background: transparent;
  /* 如果需要轻微区域感，可以考虑增加微妙的边框或阴影 */
  padding: 16px;
  border-radius: 8px;
}
.title {
  font-size: clamp(2rem, 5vw, 3rem);
  color: var(--main-green);
  margin: 0 0 12px;
}
.underline {
  width: clamp(40px,10vw,80px);
  height: 0.3rem;
  background: linear-gradient(90deg, var(--main-green), var(--accent-green));
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
  background: linear-gradient(145deg, var(--main-green), var(--accent-green));
  border: 2px solid rgba(60,120,80,0.7);
  box-shadow: 0 6px 12px rgba(60,120,80,0.2);
  transition: all 0.2s ease;
  color: var(--button-text-color);
  text-shadow: 1px 1px 2px var(--text-shadow-color);
  opacity: 0.95;
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
  box-shadow: 0 10px 20px rgba(60,120,80,0.3);
  border: 2px solid rgba(60,120,80,0.9);
  color: var(--button-hover-color);
  text-shadow: 2px 2px 4px var(--text-shadow-color);
  opacity: 1;
}

/* 角色立绘 */
.character-img {
  position: absolute;
  right: 0;
  bottom: 0;
  height: 100%;
  object-fit: contain;
  z-index: 2;
  filter: drop-shadow(-10px 0 10px rgba(0,0,0,0.1));
  transform: translateY(0);
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .content { padding-left: 100px; max-width:45%; }
  .ring-xsmall { width:100px; height:100px; left:10%; top:36%; }
  .ring-small  { width:180px; height:180px; left:8%; top:32%; }
  .ring-large  { width:280px; height:280px; left:4%; top:28%; }
  .orbit-system { width: 300px; height: 300px; }
}
@media (max-width: 768px) {
  .home { flex-direction: column; justify-content: center; padding:40px; }
  .content { order:2; padding-left:0; text-align:center; align-items:center; }
  .text-block { padding: 12px; }
  .character-img { position:relative; width:60%; height:auto; margin-top:20px; }
}
@media (prefers-reduced-motion) {
  .ring, .enter-btn, .character-img { animation:none!important; transition:none!important; }
}
</style>
