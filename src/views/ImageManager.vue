<template>
  <div :class="['image-manager', { dark: isDarkMode }]">
    <div class="button-group">
      <el-button type="primary" @click="fetchRandomImage" class="custom-button">随机获取图片</el-button>
    </div>
    <div v-if="isLoading" class="loading-container">
      <el-icon class="is-loading" :size="50"><Loading /></el-icon>
    </div>
    <div v-else-if="image" class="image-container">
      <img :src="image" alt="Random" @click="showImageInModal" />
    </div>
    <div v-if="image" class="rating-container">
      <el-rate :value="rating" @change="changeRating" class="rating" :disabled="isLoading"></el-rate>
    </div>
    <el-button v-if="image" type="primary" @click="refreshImage" class="refresh-button" :loading="isLoading">刷新图片</el-button>
    <el-tabs type="border-card" class="tabs-container">
      <el-tab-pane label="图片详细信息">
        <ImageInfo :imageInfo="imageInfo" :isDarkMode="isDarkMode" />
      </el-tab-pane>
      <el-tab-pane label="图片导入">
        <ImageImport @importImages="handleImportImages" :importResult="importResult" :isLoading="isLoading" :isDarkMode="isDarkMode" />
      </el-tab-pane>
      <el-tab-pane label="配置">
        <div class="config-section">
          <el-switch v-model="isDarkMode" active-text="黑夜模式" inactive-text="白天模式" class="custom-switch"></el-switch>
          <el-switch v-model="isCacheEnabled" active-text="启用缓存" inactive-text="禁用缓存" class="custom-switch"></el-switch>
          <el-input v-model="cacheSizeSetting" placeholder="缓存数量" type="number" min="1" max="20" class="cache-size-input"></el-input>
        </div>
      </el-tab-pane>
      <el-tab-pane label="评分统计">
        <RatingStatistics :isDarkMode="isDarkMode" :isActive="activeTab === '评分统计'" />
      </el-tab-pane>
    </el-tabs>
    <div v-if="isImageModalVisible" class="image-modal" @click="isImageModalVisible = false">
      <img :src="image" alt="Full Size" class="modal-image" />
    </div>
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script>
import { ElButton, ElSwitch, ElTabs, ElTabPane, ElMessage, ElRate, ElIcon } from 'element-plus';
import { Loading } from '@element-plus/icons-vue';
import axiosInstance from '@/utils/axiosInstance';
import ImageInfo from '@/components/ImageInfo.vue';
import ImageImport from '@/components/ImageImport.vue';
import RatingStatistics from '@/components/RatingStatistics.vue';

export default {
  name: 'ImageManager',
  components: {
    ElButton,
    ElSwitch,
    ElTabs,
    ElTabPane,
    ElRate,
    ElIcon,
    Loading,
    ImageInfo,
    ImageImport,
    RatingStatistics,
  },
  data() {
    return {
      image: null,
      imageInfo: null,
      importResult: null,
      error: null,
      isDarkMode: false,
      isImageModalVisible: false,
      isLoading: false,
      rating: 0,
      isCacheEnabled: false,
      cachedImages: [],
      cacheSize: 5,
      cacheSizeSetting: 5,
      activeTab: '图片详细信息',
    };
  },
  watch: {
    isCacheEnabled(newVal) {
      if (!newVal) {
        this.cachedImages = [];
      } else {
        this.refillCache();
      }
    },
    cacheSizeSetting(newVal) {
      this.cacheSize = Math.max(1, Math.min(20, parseInt(newVal, 10) || 5));
      if (this.cachedImages.length > this.cacheSize) {
        this.cachedImages.splice(this.cacheSize);
      }
      if (this.isCacheEnabled) {
        this.refillCache();
      }
    },
  },
  methods: {
    async fetchRandomImage() {
      if (this.isLoading) return;
      this.isLoading = true;

      if (this.isCacheEnabled && this.cachedImages.length > 0) {
        const cachedImage = this.cachedImages.shift();
        this.image = cachedImage.image;
        this.imageInfo = cachedImage.imageInfo;
        this.rating = cachedImage.rating;
        this.isLoading = false;
        this.refillCache();
      } else {
        await this.loadImage();
        this.isLoading = false;
      }
    },
    async refillCache() {
      while (this.isCacheEnabled && this.cachedImages.length < this.cacheSize) {
        try {
          const response = await axiosInstance.get('/images/getRandomImageWithInfo');
          if (response.data.code === 200) {
            const cachedImage = {
              image: `data:image/jpeg;base64,${response.data.data.base64Image}`,
              imageInfo: response.data.data.imageInfo,
              rating: response.data.data.score || 0,
            };
            this.cachedImages.push(cachedImage);
          }
        } catch (error) {
          console.error('Error refilling cache:', error);
        }
      }
    },
    async handleImportImages(directoryPath) {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        const sanitizedPath = directoryPath.replace(/\\/g, '\\\\');
        const response = await axiosInstance.post('/images/scan', null, {
          params: { path: sanitizedPath }
        });
        if (response.data.code === 200) {
          this.importResult = {
            message: response.data.message,
            totalImages: response.data.data,
            success: true,
          };
          ElMessage.success('图片导入成功');
        } else {
          this.importResult = {
            message: '导入图片时出错，请稍后再试。',
            success: false,
          };
          ElMessage.error('导入图片时出错，请稍后再试。');
        }
      } catch (error) {
        console.error('Error importing images:', error);
        this.error = '导入图片时出错，请稍后再试。';
        ElMessage.error('导入图片时出错，请稍后再试。');
      } finally {
        this.isLoading = false;
      }
    },
    async refreshImage() {
      if (this.isLoading) return;
      await this.loadImage();
    },
    async loadImage() {
      try {
        const response = await axiosInstance.get('/images/getRandomImageWithInfo');
        if (response.data.code === 200) {
          this.image = `data:image/jpeg;base64,${response.data.data.base64Image}`;
          this.imageInfo = response.data.data.imageInfo;
          this.rating = response.data.data.score || 0;
          if (this.isCacheEnabled) {
            this.cachedImages.push({
              image: this.image,
              imageInfo: this.imageInfo,
              rating: this.rating,
            });
            if (this.cachedImages.length > this.cacheSize) {
              this.cachedImages.shift();
            }
          }
        } else {
          this.error = '加载图片时出错，请稍后再试。';
        }
      } catch (error) {
        console.error('Error loading image:', error);
        this.error = '加载图片时出错，请稍后再试。';
      }
    },
    async changeRating(newRating) {
      if (this.imageInfo && this.imageInfo.id) {
        try {
          const response = await axiosInstance.put(`/ratings/change/${this.imageInfo.id}/${newRating}`);
          if (response.data.code === 200) {
            ElMessage.success('评分更新成功');
            await this.fetchRandomImage();
          } else {
            ElMessage.error('评分更新失败');
          }
        } catch (error) {
          console.error('Error updating rating:', error);
          ElMessage.error('评分更新失败');
        }
      }
    },
    showImageInModal() {
      this.isImageModalVisible = true;
    },
  },
};
</script>

<style scoped lang="scss">
.image-manager {
  padding: 20px;
  width: 100%;
  min-height: 100vh;
  margin: 0 auto;
  max-width: 1200px;
  background: #f1f2f3;
  transition: background-color 0.3s, color 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  border-radius: 16px;
  border: 1px solid #e5e9ef;
}

.image-manager.dark {
  background: #18191c;
  color: #e0e0e0;
}
.button-group {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  max-width: 800px;
  
  .custom-button {
    padding: 12px 28px;
    border-radius: 12px;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
}

// 增加刷新按钮特殊样式
.refresh-button {
  margin-top: 20px;
  border: 2px solid var(--el-color-primary);
  background: linear-gradient(
    45deg,
    var(--el-color-primary),
    var(--el-color-primary-light-3)
  );
  color: white;
}

// 适配夜间模式
.image-manager.dark {
  .custom-button {
    background: var(--el-color-primary-dark-2);
    border-color: var(--el-color-primary-light-3);
    
    &:hover {
      background: var(--el-color-primary-dark-1);
    }
  }
  
  .refresh-button {
    border-color: var(--el-color-primary-light-5);
  }
}
.loading-container {
  width: 100%;
  max-width: 800px;
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--el-bg-color);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.image-container {
  width: 100%;
  max-width: 800px;
  height: 600px;
  background: var(--el-bg-color-page);  // 从--el-bg-color改为层级更深的背景变量
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: inherit;
    z-index: -1;
  }
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  cursor: pointer;
  background: var(--el-bg-color-page); // 添加图片背景色继承
  padding: 8px; // 增加呼吸空间
}
.rating-container {
  width: 100%;
  max-width: 800px;
  margin-top: 16px;
  display: flex;
  justify-content: center;
  .rating {
    --el-rate-icon-size: 48px;  // 从42px增大到48px
    --el-rate-text-color: var(--el-text-color-regular);
    --el-rate-disabled-void-color: var(--el-border-color-light);
    
    // 新增以下调整
    margin: 24px 0;
    transform: scale(1.1);
    transform-origin: center;
    
    .el-rate__item {
      margin-right: 16px !important;  // 增加星星间距
    }
  }
  @media (max-width: 768px) {
    .rating {
      --el-rate-icon-size: 36px;  // 移动端适当缩小
      transform: none;
    }
  }
}
.tabs-container {
  width: 100%;
  max-width: 800px;
  margin-top: 16px;
  background: var(--el-bg-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  cursor: pointer;
}

.modal-image {
  max-width: 90%;
  max-height: 90%;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.config-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

.custom-switch {
  margin-top: 8px;
}
</style>