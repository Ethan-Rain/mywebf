<template>
  <img
    ref="imgRef"
    :src="placeholder"
    :data-src="src"
    :alt="alt"
    :class="['lazy-image', { 'lazy-image--loaded': isLoaded }]"
    @load="handleLoad"
    @error="handleError"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%232a2a2a"/%3E%3C/svg%3E'
  }
})

const emit = defineEmits(['load', 'error'])

const imgRef = ref<HTMLImageElement | null>(null)
const isLoaded = ref(false)

const loadImage = () => {
  if (!imgRef.value || isLoaded.value) return

  const img = new Image()
  img.src = props.src

  img.onload = () => {
    if (imgRef.value) {
      imgRef.value.src = props.src
      isLoaded.value = true
      emit('load')
    }
  }

  img.onerror = (err) => {
    console.error('Image load error:', err)
    emit('error', new Error(`Failed to load image: ${props.src}`))
  }
}

const handleLoad = () => {
  isLoaded.value = true
  emit('load')
}

const handleError = (e: Event) => {
  console.error('Image error:', e)
  emit('error', new Error(`Error loading image: ${props.src}`))
}

// 使用 IntersectionObserver 实现懒加载
const { stop } = useIntersectionObserver(
  imgRef,
  ([{ isIntersecting }]) => {
    if (isIntersecting && !isLoaded.value) {
      loadImage()
      stop()
    }
  },
  {
    rootMargin: '200px'
  }
)

onMounted(() => {
  // 如果图片已经在视口内，立即加载
  if (imgRef.value) {
    const rect = imgRef.value.getBoundingClientRect()
    if (rect.top < window.innerHeight + 200) {
      loadImage()
    }
  }
})
</script>

<style scoped>
.lazy-image {
  max-width: 100%;
  max-height: 70vh;
  width: auto;
  height: auto;
  object-fit: contain;
  transition: opacity 0.3s ease;
  opacity: 0;
}

.lazy-image--loaded {
  opacity: 1;
}
</style>
