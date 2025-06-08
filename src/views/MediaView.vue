<template>
  <div class="media-viewer">
    <MediaFilter
      v-model:category="currentCategory"
      v-model:mediaType="currentMediaType"
      @refresh="refreshMedia"
    />
    
    <div class="media-list">
      <MediaItem
        v-for="(item, index) in mediaItems"
        :key="item.id"
        :media="item"
        :is-visible="isItemVisible(index)"
        @load="handleMediaLoad"
        @error="handleMediaError"
      />
    </div>
    
    <MediaLoader :loading="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useMediaLoader } from '@/composables/useMediaLoader'
import MediaFilter from '@/components/media/MediaFilter.vue'
import MediaItem from '@/components/media/MediaItem.vue'
import MediaLoader from '@/components/media/MediaLoader.vue'

const {
  mediaItems,
  isLoading,
  currentCategory,
  currentMediaType,
  loadMedia,
  loadMore,
  cleanup
} = useMediaLoader()

// 刷新媒体列表
const refreshMedia = () => {
  loadMedia(true)
}

// 可见性检查
const isItemVisible = (index: number) => {
  return index >= mediaItems.value.length - 3
}

// 加载更多
const handleScroll = () => {
  if (isLoading.value) return
  
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement
  const distanceToBottom = scrollHeight - (scrollTop + clientHeight)
  
  if (distanceToBottom < 300) {
    loadMore()
  }
}

// 生命周期
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  loadMedia(true)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  cleanup()
})

// 事件处理
const handleMediaLoad = (item: any) => {
  console.log('Media loaded:', item)
}

const handleMediaError = (error: Error) => {
  console.error('Media load error:', error)
}
</script>

<style scoped>
.media-viewer {
  background-color: #000;
  min-height: 100vh;
  padding-top: var(--safe-area-inset-top);
  padding-bottom: var(--safe-area-inset-bottom);
}

.media-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 10px;
  max-width: 1000px;
  margin: 0 auto;
  padding-top: 80px;
  padding-bottom: 40px;
}
</style>
