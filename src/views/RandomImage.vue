<template>
  <div class="image-viewer-page">
    <div class="main-image-container">
      <transition name="image-fade" mode="out-in">
        <el-image
          v-if="currentImage.url"
          :key="currentImage.url"
          :src="currentImage.url"
          :preview-src-list="albumPreviewList"
          :initial-index="currentImage.albumIndex"
          fit="contain"
          :preview-teleported="true"
          hide-on-click-modal
          class="main-image"
          :zoom-rate="1.2"
          :max-scale="5"
          :min-scale="0.5"
        >
          <template #placeholder>
            <div class="image-loading-spinner"></div>
          </template>
          <template #error>
            <div class="image-error-state">
              <el-icon><CircleClose /></el-icon>
              <span>图片加载失败</span>
            </div>
          </template>
        </el-image>
        <el-empty v-else description="点击下方按钮，开始探索" class="main-image-empty" />
      </transition>
    </div>

    <transition name="el-zoom-in-top">
      <div v-show="isAlbumVisible" class="album-panel">
        <div class="album-header">
          <h3>相册: {{ albumFolderName }}</h3>
          <el-tag type="info" size="small" round>共 {{ albumImages.length }} 张</el-tag>
        </div>
        <div class="thumbnail-grid" ref="thumbnailGridRef">
          <div
            v-for="(img, index) in visibleThumbnails"
            :key="img.file_path"
            class="thumbnail-item"
            :class="{ 'is-active': img.file_path === currentImage.url }"
            @click="selectImageFromAlbum(index)"
          >
            <el-image :src="img.file_path" fit="cover" lazy class="thumbnail-img" />
          </div>
        </div>
        <div class="album-footer" v-if="hasMoreThumbnails">
          <el-button text bg @click="loadMoreThumbnails" :loading="isFetchingAlbum">加载更多</el-button>
        </div>
      </div>
    </transition>

    <div class="actions-bar">
      <el-button-group>
        <el-tooltip content="上一张 (←)" placement="top">
          <el-button @click="navigateImage(-1)" :disabled="!hasPreviousImage">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="随机一张" placement="top">
          <el-button type="primary" @click="fetchRandomImage" :loading="isFetchingRandom">
            <el-icon><Refresh /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="下一张 (→)" placement="top">
          <el-button @click="navigateImage(1)" :disabled="!hasNextImage">
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </el-tooltip>
      </el-button-group>

      <el-tooltip content="图片信息" placement="top">
        <el-button @click="isInfoDialogVisible = true" :disabled="!currentImage.url">
          <el-icon><InfoFilled /></el-icon>
        </el-button>
      </el-tooltip>

      <el-tooltip :content="isAlbumVisible ? '隐藏相册 (Esc)' : '查看相册'" placement="top">
        <el-button
          :type="isAlbumVisible ? 'success' : ''"
          @click="toggleAlbumView"
          :loading="isFetchingAlbum && albumImages.length === 0"
          :disabled="!currentImage.url"
        >
          <el-icon><FolderOpened /></el-icon>
        </el-button>
      </el-tooltip>
    </div>

    <el-dialog v-model="isInfoDialogVisible" title="图片信息" width="clamp(300px, 60%, 800px)">
      <el-descriptions v-if="currentImage.info" :column="1" border>
        <el-descriptions-item v-for="(value, key) in currentImage.info" :key="key" :label="String(key)">
          <span style="word-break: break-all;">{{ value }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import {
  Refresh, InfoFilled, FolderOpened, ArrowRight, ArrowLeft, CircleClose
} from '@element-plus/icons-vue';

// --- 类型定义 ---
interface MediaInfo {
  file_path: string;
  file_name: string;
  [key: string]: any;
}

// --- 状态管理 (State) ---

// Refs
const thumbnailGridRef = ref<HTMLDivElement | null>(null);

// 核心状态
const currentImage = ref<{
  url: string;
  info: MediaInfo | null;
  albumIndex: number; // 在当前相册中的索引
}>({ url: '', info: null, albumIndex: -1 });

const albumImages = ref<MediaInfo[]>([]);

// UI & 加载状态
const isFetchingRandom = ref(false);
const isFetchingAlbum = ref(false);
const isAlbumVisible = ref(false);
const isInfoDialogVisible = ref(false);

// 相册“加载更多”相关状态
const THUMBNAIL_BATCH_SIZE = 30; // 每次加载30张缩略图
const visibleThumbnailCount = ref(THUMBNAIL_BATCH_SIZE);

// --- 计算属性 (Computed) ---

const albumPreviewList = computed(() => albumImages.value.map(img => img.file_path));
const albumFolderName = computed(() => {
  const path = currentImage.value.info?.file_path || '';
  const parts = path.split('/');
  return parts.length > 1 ? parts[parts.length - 2] : '未知相册';
});

// 导航状态
const hasPreviousImage = computed(() => albumImages.value.length > 0 && currentImage.value.albumIndex > 0);
const hasNextImage = computed(() => albumImages.value.length > 0 && currentImage.value.albumIndex < albumImages.value.length - 1);

// 相册缩略图
const visibleThumbnails = computed(() => albumImages.value.slice(0, visibleThumbnailCount.value));
const hasMoreThumbnails = computed(() => visibleThumbnailCount.value < albumImages.value.length);

// --- API & 核心方法 ---

// 封装的 fetch
async function apiFetch<T>(url: string, body: object): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`请求失败: ${response.status}`);
  return response.json();
}

// 更新当前图片
const updateCurrentImage = (info: MediaInfo, albumIndex: number) => {
  currentImage.value = { url: info.file_path, info, albumIndex };
};

// 获取随机图片
const fetchRandomImage = async () => {
  if (isFetchingRandom.value) return;
  isFetchingRandom.value = true;
  try {
    const data = await apiFetch<MediaInfo>('http://localhost:8080/api/media/random/imageByURL', { type: 'IMAGE' });
    updateCurrentImage(data, -1);
    // 切换到随机图片时，重置并隐藏相册
    isAlbumVisible.value = false;
    albumImages.value = [];
  } catch (error: any) {
    ElMessage.error(`获取随机图片失败: ${error.message}`);
    currentImage.value = { url: '', info: null, albumIndex: -1 };
  } finally {
    isFetchingRandom.value = false;
  }
};

// 切换相册视图
const toggleAlbumView = async () => {
  if (!currentImage.value.url) return;

  isAlbumVisible.value = !isAlbumVisible.value;

  // 如果是打开相册且相册为空，则加载
  if (isAlbumVisible.value && albumImages.value.length === 0) {
    if (isFetchingAlbum.value) return;
    isFetchingAlbum.value = true;
    try {
      const data = await apiFetch<MediaInfo[]>('http://localhost:8080/api/media/random/queryResourcesInTheSameFolder', {
        file_path: currentImage.value.info!.file_path,
      });
      albumImages.value = data;
      // 在加载相册后，重新定位当前图片索引
      const newIndex = data.findIndex(img => img.file_path === currentImage.value.url);
      if (newIndex !== -1) {
        currentImage.value.albumIndex = newIndex;
      }
      visibleThumbnailCount.value = THUMBNAIL_BATCH_SIZE; // 重置显示数量
    } catch (error: any) {
      ElMessage.error(`加载相册失败: ${error.message}`);
      isAlbumVisible.value = false; // 加载失败则关闭
    } finally {
      isFetchingAlbum.value = false;
    }
  }
};

// 从相册选择
const selectImageFromAlbum = (index: number) => {
  const actualIndexInAlbum = albumImages.value.findIndex(
    img => img.file_path === visibleThumbnails.value[index].file_path
  );
  if (actualIndexInAlbum !== -1) {
    updateCurrentImage(albumImages.value[actualIndexInAlbum], actualIndexInAlbum);
  }
};

// 上/下一张
const navigateImage = (direction: 1 | -1) => {
  if (albumImages.value.length === 0) {
    fetchRandomImage();
    return;
  }
  const newIndex = currentImage.value.albumIndex + direction;
  if (newIndex >= 0 && newIndex < albumImages.value.length) {
    updateCurrentImage(albumImages.value[newIndex], newIndex);
  }
};

// 加载更多缩略图
const loadMoreThumbnails = () => {
  visibleThumbnailCount.value += THUMBNAIL_BATCH_SIZE;
};

// --- 生命周期 & 事件监听 ---
onMounted(() => {
  fetchRandomImage();
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

const handleKeyDown = (e: KeyboardEvent) => {
  if (isInfoDialogVisible.value) return;
  switch (e.code) {
    case 'ArrowRight': e.preventDefault(); navigateImage(1); break;
    case 'ArrowLeft': e.preventDefault(); navigateImage(-1); break;
    case 'Escape': if (isAlbumVisible.value) { e.preventDefault(); isAlbumVisible.value = false; } break;
  }
};

// 监听当前图片变化，如果相册可见，则滚动到对应缩略图
watch(() => currentImage.value.albumIndex, (newIndex) => {
  if (isAlbumVisible.value && newIndex !== -1) {
    nextTick(() => {
      const activeThumbnail = thumbnailGridRef.value?.querySelector('.is-active');
      activeThumbnail?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }
});
</script>

<style scoped>
/* --- 页面整体布局 --- */
.image-viewer-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #f0f2f5;
  overflow: hidden;
}

/* --- 主图显示区 (核心布局) --- */
.main-image-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  min-height: 0;
  position: relative;
  overflow: hidden; /* 移除滚动条 */
  max-width: 100%;
  max-height: calc(100vh - 60px); /* 留出操作栏空间 */
}

.main-image, .main-image-empty {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* 确保图片完整显示 */
  border-radius: 8px;
}
.main-image {
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}

.image-loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: var(--el-color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.image-error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #f56c6c;
}
.image-error-state .el-icon {
  font-size: 2.5rem;
}
.image-error-state span {
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

/* --- 下方相册面板 --- */
.album-panel {
  flex-shrink: 0;
  max-height: 40vh;
  background-color: #ffffff;
  border-top: 1px solid #e4e7ed;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
}

.album-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid #e4e7ed;
}

.album-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.thumbnail-grid {
  padding: 1rem 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, 120px); /* 固定宽度，防止堆叠 */
  gap: 1rem;
  overflow-y: auto;
  align-content: start;
  justify-content: center; /* 居中排列 */
}

.thumbnail-item {
  width: 120px;
  height: 120px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease-in-out;
}
.thumbnail-item:hover {
  transform: scale(1.05);
  border-color: var(--el-color-primary-light-5);
}
.thumbnail-item.is-active {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 2px var(--el-color-primary);
  transform: scale(1.02);
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* --- 操作栏 --- */
.actions-bar {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-radius: 50px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

/* --- 动画 --- */
.image-fade-enter-active,
.image-fade-leave-active {
  transition: opacity 0.3s ease;
}
.image-fade-enter-from,
.image-fade-leave-to {
  opacity: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* --- 移动端适配 --- */
@media (max-width: 768px) {
  .actions-bar {
    padding: 0.5rem;
    gap: 0.5rem;
  }
  .thumbnail-grid {
    grid-template-columns: repeat(auto-fit, 80px);
    gap: 0.5rem;
    padding: 0.75rem;
  }
  .thumbnail-item {
    width: 80px;
    height: 80px;
  }
  .album-panel {
    max-height: 45vh;
  }
  .main-image-container {
    max-height: calc(100vh - 80px); /* 调整移动端操作栏空间 */
  }
}
</style>
