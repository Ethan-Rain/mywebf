<template>
  <div class="filter-container">
    <select v-model="localCategory" class="filter-select" aria-label="选择分类">
      <option v-for="cat in categories" :key="cat.value" :value="cat.value">
        {{ cat.label }}
      </option>
    </select>
    
    <select v-model="localMediaType" class="filter-select" aria-label="选择媒体类型">
      <option v-for="type in mediaTypes" :key="type.value" :value="type.value">
        {{ type.label }}
      </option>
    </select>
    
    <button class="filter-btn" @click="handleRefresh" aria-label="刷新">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M23 4v6h-6"></path>
        <path d="M1 20v-6h6"></path>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  category: {
    type: String,
    default: '1'
  },
  mediaType: {
    type: String,
    default: 'all'
  }
})

const emit = defineEmits(['update:category', 'update:mediaType', 'refresh'])

const localCategory = ref(props.category)
const localMediaType = ref(props.mediaType)

// 分类选项
const categories = [
  { value: '1', label: '分类1' },
  { value: '2', label: '分类2' },
  { value: '3', label: '分类3' }
]

// 媒体类型选项
const mediaTypes = [
  { value: 'all', label: '全部' },
  { value: 'image', label: '图片' },
  { value: 'video', label: '视频' }
]

// 监听变化
watch(localCategory, (newVal) => {
  emit('update:category', newVal)
})

watch(localMediaType, (newVal) => {
  emit('update:mediaType', newVal)
})

// 刷新按钮点击
const handleRefresh = () => {
  emit('refresh')
}
</script>

<style scoped>
.filter-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  gap: 12px;
  padding: 15px 16px;
  background: rgba(15, 15, 15, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
}

.filter-select {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  outline: none;
}

.filter-select option {
  background: #000;
  color: #fff;
}

.filter-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:active {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(0.95);
}
</style>
