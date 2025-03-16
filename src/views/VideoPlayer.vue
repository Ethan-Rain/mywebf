<template>
  <div class="video-player-container">
    <div class="video-wrapper">
      <video
        ref="videoRef"
        class="video-player"
        controls
        @error="handleVideoError"
        @loadedmetadata="handleVideoLoaded"
        preload="metadata"
      >
        <source :src="videoUrl" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </div>
    
    <div class="error-message" v-if="error">
      {{ error }}
    </div>

    <div class="video-controls" v-if="!error">
      <el-input
        v-model="videoPath"
        placeholder="输入视频路径（例如：鱼子酱fash/鱼子酱.mp4）"
        class="path-input"
        :disabled="isLoading"
      >
        <template #append>
          <el-button @click="loadVideo" :loading="isLoading">
            {{ isLoading ? '加载中' : '加载视频' }}
          </el-button>
        </template>
      </el-input>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import axiosInstance from '@/utils/axiosInstance'

export default {
  name: 'VideoPlayer',
  setup() {
    const videoRef = ref(null)
    const videoPath = ref('')
    const error = ref(null)
    const isLoading = ref(false)

    const videoUrl = computed(() => {
      if (!videoPath.value) return ''
      const encodedPath = encodeURIComponent(videoPath.value)
      // 直接使用stream接口
      return `http://192.168.31.107:58080/video/stream?path=${encodedPath}`
    })

    const loadVideo = async () => {
      if (!videoPath.value) {
        ElMessage.warning('请输入视频路径')
        return
      }

      error.value = null
      isLoading.value = true

      try {
        if (videoRef.value) {
          videoRef.value.load()
        }
      } catch (err) {
        console.error('视频加载错误:', err)
        error.value = '视频加载失败：' + (err.message || '未知错误')
        ElMessage.error(error.value)
      } finally {
        isLoading.value = false
      }
    }

    // 监听videoPath的变化，重置错误状态
    watch(videoPath, () => {
      if (error.value) {
        error.value = null
      }
    })

    const handleVideoError = (e) => {
      error.value = '视频播放出错：' + (e.target.error?.message || '未知错误')
      ElMessage.error('视频播放出错')
    }

    const handleVideoLoaded = () => {
      ElMessage.success('视频加载成功')
    }

    return {
      videoRef,
      videoPath,
      videoUrl,
      error,
      isLoading,
      loadVideo,
      handleVideoError,
      handleVideoLoaded
    }
  }
}
</script>

<style scoped>
.video-player-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.video-wrapper {
  width: 100%;
  background: #000;
  aspect-ratio: 16/9;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.video-player {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.video-controls {
  margin-top: 20px;
}

.path-input {
  width: 100%;
}

.error-message {
  color: #f56c6c;
  margin: 20px 0;
  padding: 10px;
  background: #fef0f0;
  border-radius: 4px;
}
</style>
