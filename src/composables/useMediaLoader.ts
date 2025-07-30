// src/composables/useMediaLoader.ts
import { ref, onUnmounted } from 'vue'
import { getRandomMedia } from '@/api/mediaApi'

interface MediaItem {
  id: string
  type: 'image' | 'video'
  url: string
  filename: string
  timestamp: number
  isError?: boolean
  contentType?: string
}

export function useMediaLoader() {
  const mediaItems = ref<MediaItem[]>([])
  const isLoading = ref(false)
  const hasMore = ref(true)
  const currentCategory = ref('1') // 修改为字符串类型
  const currentMediaType = ref<'all' | 'image' | 'video'>('all')
  const page = ref(1)

  // 清理blob URL
  const cleanupBlobUrls = () => {
    mediaItems.value.forEach(item => {
      if (item.url && item.url.startsWith('blob:')) {
        URL.revokeObjectURL(item.url)
      }
    })
  }

  const loadMedia = async (reset = false) => {
    if (isLoading.value || (!hasMore.value && !reset)) return

    try {
      isLoading.value = true

      const type = currentMediaType.value === 'all'
        ? Math.random() > 0.5 ? 'image' : 'video'
        : currentMediaType.value as 'image' | 'video'

      console.log(`Fetching random ${type}...`)

      const response = await getRandomMedia(type, {
        category: Number(currentCategory.value) || 1
      })

      if (!response || !response.data) {
        throw new Error('未收到有效的数据响应')
      }

      const responseData = response.data
      const contentType = response.headers?.['content-type'] || (type === 'image' ? 'image/jpeg' : 'video/mp4')

      return new Promise<void>((resolve, reject) => {
        try {
          // 处理 Blob 或 ArrayBuffer 响应
          const processBlob = (blob: Blob) => {
            const objectUrl = URL.createObjectURL(blob)

            // 获取文件扩展名
            const extension = type === 'image'
              ? blob.type.split('/')[1] || 'jpg'
              : 'mp4'

            const mediaItem: MediaItem = {
              id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
              type,
              url: objectUrl,
              filename: `media-${Date.now()}.${extension}`,
              timestamp: Date.now(),
              contentType: blob.type
            }

            if (reset) {
              cleanupBlobUrls()
              mediaItems.value = [mediaItem]
            } else {
              mediaItems.value = [...mediaItems.value, mediaItem]
            }

            hasMore.value = true
            page.value++
            resolve()
          }


          if (responseData instanceof Blob) {
            processBlob(responseData)
          } else if (responseData instanceof ArrayBuffer) {
            const blob = new Blob([responseData], { type: contentType })
            processBlob(blob)
          } else if (typeof responseData === 'string') {
            // 处理 base64 字符串
            if (responseData.startsWith('data:')) {
              const matches = responseData.match(/^data:(.+?);base64,(.+)$/)
              if (matches && matches.length === 3) {
                const mimeType = matches[1]
                const byteString = atob(matches[2])
                const arrayBuffer = new ArrayBuffer(byteString.length)
                const uint8Array = new Uint8Array(arrayBuffer)
                for (let i = 0; i < byteString.length; i++) {
                  uint8Array[i] = byteString.charCodeAt(i)
                }
                const blob = new Blob([arrayBuffer], { type: mimeType })
                processBlob(blob)
              } else {
                throw new Error('Invalid data URL format')
              }
            } else {
              // 普通字符串
              const blob = new Blob([responseData], { type: 'text/plain' })
              processBlob(blob)
            }
          } else {
            throw new Error('不支持的响应数据类型')
          }
        } catch (error) {
          console.error('处理媒体数据时出错:', error)
          reject(error instanceof Error ? error : new Error('处理媒体数据失败'))
        }
      })
    } catch (error) {
      console.error('加载媒体失败:', error)
      const errorItem: MediaItem = {
        id: `error-${Date.now()}`,
        type: 'image',
        url: '',
        filename: `加载失败: ${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: Date.now(),
        isError: true
      }

      if (reset) {
        mediaItems.value = [errorItem]
      } else {
        mediaItems.value = [...mediaItems.value, errorItem]
      }

      hasMore.value = false
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 切换分类
  const changeCategory = (category: string) => {
    currentCategory.value = category
    loadMedia(true)
  }

  // 切换媒体类型
  const changeMediaType = (type: 'all' | 'image' | 'video') => {
    currentMediaType.value = type
    loadMedia(true)
  }

  // 组件卸载时清理资源
  onUnmounted(() => {
    cleanupBlobUrls()
  })

  return {
    mediaItems,
    isLoading,
    hasMore,
    currentCategory,
    currentMediaType,
    loadMedia,
    changeCategory,
    changeMediaType
  }
}
