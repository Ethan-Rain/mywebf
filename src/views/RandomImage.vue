<template>
  <div class="random-image-page">
    <div class="image-container" v-if="imageUrl">
      <el-image
        :src="imageUrl"
        :preview-src-list="previewList"
        fit="contain"
        :preview-teleported="true"
        :initial-index="currentIndex"
        class="random-image"
        @error="onImgError"
      >
        <template #error>
          <div class="image-error">
            <el-icon><Picture /></el-icon>
            <span>图片加载失败</span>
          </div>
        </template>
      </el-image>
    </div>
    <div v-else class="no-image">
      <el-empty description="暂无图片" />
    </div>

    <div class="actions">
      <el-button
        type="primary"
        @click="fetchImage"
        :loading="loading"
        :disabled="loading"
      >
        {{ loading ? '加载中...' : '刷新图片' }}
      </el-button>
      <el-button
        @click="showInfo = true"
        :disabled="!mediaInfo.file_name"
      >
        详情
      </el-button>
      <el-button
        @click="queryResourcesInTheSameFolder"
        :loading="loadingSameFolder"
        :disabled="!mediaInfo.file_name || loadingSameFolder"
      >
        获取同集资源
      </el-button>
    </div>

    <el-dialog
      v-model="showInfo"
      title="图片信息"
      width="50%"
    >
      <el-descriptions border>
        <el-descriptions-item
          v-for="(value, key) in mediaInfo"
          :key="key"
          :label="key"
        >
          {{ value }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="showInfo = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElButton, ElImage, ElDialog, ElDescriptions, ElDescriptionsItem, ElIcon } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'

interface MediaInfo {
  file_path?: string
  file_name?: string
  [key: string]: string | number | boolean | null | undefined
}

const imageUrl = ref('')
const mediaInfo = ref<MediaInfo>({})
const loading = ref(false)
const loadingSameFolder = ref(false)
const showInfo = ref(false)
const currentIndex = ref(0)
const imageInfoList = ref<MediaInfo[]>([])

const previewList = computed(() => {
  return imageInfoList.value.length > 0
    ? imageInfoList.value.map(item => item.file_path as string)
    : imageUrl.value ? [imageUrl.value] : []
})

const queryResourcesInTheSameFolder = async () => {
  if (!mediaInfo.value.file_path) return

  loadingSameFolder.value = true
  try {
    const res = await fetch('http://localhost:8080/api/media/random/queryResourcesInTheSameFolder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file_path: mediaInfo.value.file_path })
    })
    if (!res.ok) throw new Error('请求失败')
    const data = await res.json()
    imageInfoList.value = data
    if (data.length > 0) {
      imageUrl.value = data[0].file_path as string
      currentIndex.value = 0
    }
  } catch (error) {
    console.error('获取同集资源失败:', error)
    ElMessage.error("获取同集资源失败，请稍后重试")
  } finally {
    loadingSameFolder.value = false
  }
}

const fetchImage = async () => {
  loading.value = true
  try {
    const res = await fetch('http://localhost:8080/api/media/random/imageByURL', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'IMAGE' })
    })
    if (!res.ok) throw new Error('请求失败')
    const data = await res.json()
    mediaInfo.value = data
    imageUrl.value = data.file_path as string
    imageInfoList.value = [] // 清空同集资源
    currentIndex.value = 0
  } catch (error) {
    console.error('获取图片失败:', error)
    imageUrl.value = ''
    mediaInfo.value = {}
    ElMessage.error("获取图片失败，请稍后重试")
  } finally {
    loading.value = false
  }
}

const onImgError = () => {
  imageUrl.value = ''
  ElMessage.error("图片加载失败，请刷新重试")
}

// 初始加载图片
fetchImage()
</script>

<style scoped>
.random-image-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  min-height: 80vh;
}

.image-container {
  margin-bottom: 1.5rem;
  width: 100%;
  max-width: 90vw;
  max-height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.random-image {
  max-width: 100%;
  max-height: 70vh;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  background: #f5f7fa;
  object-fit: contain;
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  color: #909399;
}

.image-error .el-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.actions {
  display: flex;
  gap: 1rem;
  margin: 1.5rem 0;
  flex-wrap: wrap;
  justify-content: center;
}

.no-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 400px;
}

:deep(.el-dialog__body) {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
