<template>
  <Transition name="fade">
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <div class="loading-text">加载中...</div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.loading {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s ease-in-out infinite;
}

.loading-text {
  font-size: 14px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
