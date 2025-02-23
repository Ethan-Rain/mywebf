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
import RatingStatistics from '@/components/RatingStatistics.vue'; // 新增：导入RatingStatistics组件

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
    RatingStatistics, // 新增：注册RatingStatistics组件
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
      cachedImages: [], // 改为临时缓存
      cacheSize: 5,
      cacheSizeSetting: 5, // 新增：缓存数量设置
      activeTab: '图片详细信息',
    };
  },

  watch: {
    isCacheEnabled(newVal) {
      if (!newVal) {
        // 禁用缓存时清空缓存
        this.cachedImages = [];
      } else {
        // 启用缓存时补充缓存
        this.refillCache();
      }
    },
    cacheSizeSetting(newVal) {
      // 确保缓存数量在合理范围内
      this.cacheSize = Math.max(1, Math.min(20, parseInt(newVal, 10) || 5));
      // 如果缓存数量减少，移除多余的缓存
      if (this.cachedImages.length > this.cacheSize) {
        this.cachedImages.splice(this.cacheSize);
      }
      // 如果缓存数量增加，补充缓存
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
        // 从缓存中获取图片
        const cachedImage = this.cachedImages.shift();
        this.image = cachedImage.image;
        this.imageInfo = cachedImage.imageInfo;
        this.rating = cachedImage.rating;
        this.isLoading = false;
        // 异步补充缓存
        this.refillCache();
      } else {
        // 从接口获取图片
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
      if (this.isLoading) return; // 如果正在加载，直接返回
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
      if (this.isLoading) return; // 如果正在加载，直接返回
      await this.loadImage();
    },
    async loadImage() {
      try {
        const response = await axiosInstance.get('/images/getRandomImageWithInfo');
        if (response.data.code === 200) {
          this.image = `data:image/jpeg;base64,${response.data.data.base64Image}`;
          this.imageInfo = response.data.data.imageInfo;
          this.rating = response.data.data.score || 0;
          // 如果缓存已启用，将新图片加入缓存
          if (this.isCacheEnabled) {
            this.cachedImages.push({
              image: this.image,
              imageInfo: this.imageInfo,
              rating: this.rating,
            });
            // 如果缓存超过最大大小，移除最早的缓存
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

<style scoped>
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

.image-manager {
  padding: 20px;
  width: 100%;
  min-height: 100vh;
  margin: 0 auto;
  max-width: 1200px;
  background: #f1f2f3; /* Bilibili风格背景色 */
  transition: background-color 0.3s, color 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  border-radius: 16px;
  border: 1px solid #e5e9ef; /* Bilibili风格边框 */
}

.image-manager.dark {
  background: #18191c; /* Bilibili深色模式背景 */
  color: #e0e0e0;
}

h1 {
  font-size: 2.2rem;
  color: #00a1d6; /* Bilibili主题色 */
  margin: 0;
  padding: 20px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.button-group {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  max-width: 800px;
}

.image-container {
  width: 100%;
  max-width: 800px;
  height: 600px;
  background: var(--el-bg-color); /* 使用Element Plus的主题变量 */
  backdrop-filter: blur(5px);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  cursor: pointer;
  transition: transform 0.3s ease;
  background-color: transparent;
}

.image-container:hover {
  transform: scale(1.02);
}

.image-container img:hover {
  transform: scale(1.05);
}

.rating-container {
  width: 100%;
  max-width: 800px;
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.rating {
  margin-top: 16px;
  font-size: 36px; /* 进一步增加星星的大小 */
  --el-rate-icon-size: 36px; /* 确保星星图标的大小与字体大小一致 */
}

.import-section {
  display: flex;
  gap: 12px;
  width: 100%;
  max-width: 800px;
  flex-wrap: wrap;
  justify-content: center;
}

.custom-input {
  flex: 1;
  min-width: 250px;
}

.refresh-button {
  margin-top: 16px;
  background-color: #00a1d6; /* Bilibili主题色 */
  border-color: #00a1d6;
}

.refresh-button:hover {
  background-color: #0091c6; /* 深色主题色 */
  border-color: #0091c6;
}

.tabs-container {
  width: 100%;
  max-width: 800px;
  margin-top: 16px;
  background: var(--el-bg-color); /* 使用Element Plus的主题变量 */
  backdrop-filter: blur(5px);
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
  transition: transform 0.3s ease;
  object-fit: contain;
}

.modal-image:hover {
  transform: scale(1.02);
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