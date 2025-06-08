<template>
  <div class="media-item" :class="{ 'is-error': media?.isError }">
    <div class="media-container">
      <img
        v-if="media.type === 'image' && !media.isError"
        :src="media.url"
        :alt="media.filename"
        @load="handleLoad"
        @error="handleError"
        class="media-content"
      />
      <video
        v-else-if="media.type === 'video' && !media.isError"
        :src="media.url"
        controls
        autoplay
        muted
        loop
        playsinline
        @loadeddata="handleLoad"
        @error="handleError"
        class="media-content"
      ></video>
      <div v-else class="media-error">
        {{ media.filename }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onBeforeUnmount } from 'vue'

interface MediaItem {
  id: string
  type: 'image' | 'video'
  url: string
  filename: string
  timestamp: number
  isError?: boolean
  // 允许其他可选属性
  [key: string]: unknown
}

const props = withDefaults(defineProps<{
  media: MediaItem
}>(), {
  media: () => ({
    id: '',
    type: 'image',
    url: '',
    filename: 'unknown',
    timestamp: Date.now(),
    isError: false
  })
})

const emit = defineEmits(['load', 'error'])

const handleLoad = () => {
  console.log('Media loaded:', props.media.filename)
  emit('load', props.media)
}

const handleError = (e: Event) => {
  console.error('Media load error:', e)
  const error = new Error(`Failed to load ${props.media.type}: ${props.media.url}`)
  emit('error', error, props.media)
}

// 组件卸载时清理资源
onBeforeUnmount(() => {
  if (props.media.url && props.media.url.startsWith('blob:')) {
    URL.revokeObjectURL(props.media.url)
  }
})
</script>

<style scoped>
.media-item {
  margin-bottom: 1rem;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f5f5f5;
  transition: all 0.3s ease;
}

.media-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  background-color: #f5f5f5;
}

.media-content {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
}

.media-error {
  padding: 2rem;
  color: #f56c6c;
  text-align: center;
  background-color: #fff2f0;
  border: 1px dashed #ffccc7;
  border-radius: 4px;
}

.is-error {
  border: 1px solid #ff4d4f;
}
</style>
