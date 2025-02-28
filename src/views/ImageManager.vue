<template>
  <div :class="['image-manager', { dark: isDarkMode, 'focus-mode': isFocusMode }]">
    <!-- 添加专注模式按钮 -->
    <div class="button-group" v-if="!isFocusMode">
      <el-button type="primary" @click="fetchRandomImage" class="custom-button">随机获取图片</el-button>
      <el-button type="primary" @click="enterFocusMode" class="custom-button focus-button">
        <el-icon><FullScreen /></el-icon>
        专注模式
      </el-button>
    </div>

    <!-- 修改专注模式控制栏布局 -->
    <div v-if="isFocusMode" class="focus-controls">
      <!-- 顶部控制栏 -->
      <div class="focus-controls-top">
        <el-button type="text" @click="exitFocusMode" class="exit-focus">
          <el-icon><CloseBold /></el-icon>
          退出专注
        </el-button>
        <el-button 
          type="primary"
          class="focus-next-button"
          @click="fetchRandomImage"
          :loading="isLoading"
        >
          <el-icon><RefreshRight /></el-icon>
          下一张
        </el-button>
      </div>
      
      <!-- 底部评分栏 -->
      <div class="focus-controls-bottom">
        <el-rate 
          v-if="image" 
          v-model="rating" 
          @change="changeRating" 
          class="focus-rating" 
          :disabled="isLoading"
        />
      </div>
    </div>

    <!-- 其他内容根据专注模式显示/隐藏 -->
    <div v-if="isLoading" class="loading-container">
      <el-icon class="is-loading" :size="50"><Loading /></el-icon>
    </div>
    <div v-else-if="image" 
         :class="['image-container', { 'focus-container': isFocusMode }]"
         @touchstart="handleTouchStart"
         @touchmove="handleTouchMove"
         @touchend="handleTouchEnd">
      <img 
        :src="image" 
        alt="Random" 
        @click="!isFocusMode && showImageInModal"
        draggable="false"
      />
    </div>
    
    <!-- 非专注模式下的其他组件 -->
    <template v-if="!isFocusMode">
      <div v-if="image" class="rating-container">
        <el-rate :value="rating" @change="changeRating" class="rating" :disabled="isLoading"></el-rate>
      </div>
      <el-button v-if="image" type="primary" @click="refreshImage" class="refresh-button" :loading="isLoading">刷新图片</el-button>
      <el-tabs 
        v-model="activeTab"
        type="border-card" 
        class="tabs-container mobile-optimized"
      >
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
        <el-tab-pane label="评分统计" name="rating-stats">
          <RatingStatistics 
            :isDarkMode="isDarkMode" 
            :isActive="activeTab === 'rating-stats'"
          />
        </el-tab-pane>
        <el-tab-pane label="筛选设置">
          <ImageFilterConfig 
            @filter-change="handleFilterChange"
            :loading="isLoading" 
          />
        </el-tab-pane>
      </el-tabs>
    </template>
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
import { Loading, FullScreen, CloseBold, RefreshRight } from '@element-plus/icons-vue';
import axiosInstance from '@/utils/axiosInstance';
import ImageInfo from '@/components/ImageInfo.vue';
import ImageImport from '@/components/ImageImport.vue';
import RatingStatistics from '@/components/RatingStatistics.vue';
import ImageFilterConfig from '@/components/ImageFilterConfig.vue';

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
    ImageFilterConfig,
    FullScreen,
    CloseBold,
    RefreshRight,
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
      cachedImages: {}, 
      isCacheRefilling: false,
      maxConcurrentRequests: 3, 
      cacheSize: 5,
      cacheSizeSetting: 5,
      cacheRefillThreshold: 0.3, // 当缓存剩余30%时开始补充
      maxRetries: 3, // 最大重试次数
      retryDelay: 1000, // 重试间隔(ms)
      activeTab: '图片详细信息',
      currentFilter: {
        minScore: null,
        maxScore: null,
        category: '',
        status: ''
      },
      preloadThreshold: 0.5,    // 预加载阈值
      maxCacheEntries: 50,      // 最大缓存条目数
      cacheCleanupInterval: 60000, // 缓存清理间隔(ms)
      lastCleanupTime: Date.now(),
      isFocusMode: false,
      touchStartX: 0,
      touchStartY: 0,
      minSwipeDistance: 50, // 最小滑动距离
      isSwipeInProgress: false,
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
      const oldSize = this.cacheSize;
      this.cacheSize = Math.max(1, Math.min(20, parseInt(newVal, 10) || 5));
      
      // 优化缓存大小调整逻辑
      if (this.cacheSize < oldSize) {
        Object.keys(this.cachedImages).forEach(key => {
          // 保留最新的图片
          this.cachedImages[key] = this.cachedImages[key].slice(-this.cacheSize);
        });
      }
      
      if (this.isCacheEnabled) {
        this.refillCache();
      }
    },
    activeTab(newVal) {
      console.log('当前激活标签:', newVal);
    },
    currentFilter: {
      handler() {
        // 筛选条件变化时，异步补充对应条件的缓存
        if (this.isCacheEnabled) {
          this.refillCache();
        }
      },
      deep: true
    }
  },
  methods: {
    // 获取缓存key
    getCacheKey() {
      return JSON.stringify(this.currentFilter);
    },

    // 优化的缓存获取方法
    getFromCache() {
      if (!this.isCacheEnabled) return null;
      const key = this.getCacheKey();
      const cache = this.cachedImages[key] || [];
      
      if (cache.length > 0) {
        const image = cache.shift();
        
        // 当缓存低于预加载阈值时，开始预加载
        if (cache.length <= this.cacheSize * this.preloadThreshold) {
          this.preloadImages();
        }
        
        return image;
      }
      return null;
    },

    // 新增：预加载图片
    async preloadImages() {
      if (!this.isCacheEnabled || this.isCacheRefilling) return;
      
      setTimeout(async () => {
        try {
          const key = this.getCacheKey();
          const cache = this.cachedImages[key] || [];
          const neededImages = this.cacheSize - cache.length;
          
          if (neededImages <= 0) return;
          
          const promises = Array(Math.min(neededImages, this.maxConcurrentRequests))
            .fill()
            .map(() => this.fetchImageWithRetry());
          
          const results = await Promise.allSettled(promises);
          
          results.forEach(result => {
            if (result.status === 'fulfilled' && result.value) {
              this.addToCache(result.value, key);
            }
          });
        } catch (error) {
          console.error('Error preloading images:', error);
        }
      }, 0);
    },

    // 优化的缓存清理方法
    cleanupCache() {
      const now = Date.now();
      if (now - this.lastCleanupTime < this.cacheCleanupInterval) return;
      
      this.lastCleanupTime = now;
      const cacheEntries = Object.entries(this.cachedImages);
      
      if (cacheEntries.length > this.maxCacheEntries) {
        // 按使用时间排序并删除最旧的缓存
        const sortedEntries = cacheEntries.sort(([, a], [, b]) => 
          (b.lastUsed || 0) - (a.lastUsed || 0)
        );
        
        const entriesToRemove = sortedEntries.slice(this.maxCacheEntries);
        entriesToRemove.forEach(([key]) => {
          delete this.cachedImages[key];
        });
      }
    },

    // 优化的添加缓存方法
    addToCache(image, key = this.getCacheKey()) {
      if (!this.isCacheEnabled) return;
      
      if (!this.cachedImages[key]) {
        this.cachedImages[key] = [];
      }
      
      image.lastUsed = Date.now();
      this.cachedImages[key].push(image);
      
      while (this.cachedImages[key].length > this.cacheSize) {
        this.cachedImages[key].shift();
      }
      
      this.cleanupCache();
    },

    async fetchRandomImage() {
      if (this.isLoading) return;
      
      const cachedImage = this.getFromCache();
      if (cachedImage) {
        this.image = cachedImage.image;
        this.imageInfo = cachedImage.imageInfo;
        this.rating = cachedImage.rating;
        return;
      }
      
      this.isLoading = true;
      this.error = null;
      
      try {
        // 使用带重试的图片获取
        const result = await this.fetchImageWithRetry();
        
        if (result) {
          this.image = result.image;
          this.imageInfo = result.imageInfo;
          this.rating = result.rating;
        } else {
          this.error = '未找到符合条件的图片';
          this.image = null;
          this.imageInfo = null;
          this.rating = 0;
        }
      } catch (error) {
        console.error('Error fetching image:', error);
        this.error = '获取图片时出错';
      } finally {
        this.isLoading = false;
      }
    },
    async refillCache() {
      if (!this.isCacheEnabled || this.isCacheRefilling) return;
      
      const key = this.getCacheKey();
      const cache = this.cachedImages[key] || [];
      
      // 检查是否需要补充缓存
      if (cache.length >= this.cacheSize * this.cacheRefillThreshold) return;
      
      this.isCacheRefilling = true;
      const requestQueue = [];
      const neededImages = this.cacheSize - cache.length;
      
      try {
        // 创建多个并发请求
        for (let i = 0; i < Math.min(neededImages, this.maxConcurrentRequests); i++) {
          requestQueue.push(this.fetchImageWithRetry());
        }
        
        const results = await Promise.allSettled(requestQueue);
        
        results.forEach(result => {
          if (result.status === 'fulfilled' && result.value) {
            this.addToCache(result.value, key);
          }
        });
        
      } catch (error) {
        console.error('Error refilling cache:', error);
      } finally {
        this.isCacheRefilling = false;
      }
    },

    // 新增：带重试机制的图片获取
    async fetchImageWithRetry(retries = 0) {
      try {
        const response = await axiosInstance.get('/images/getRandomImageWithConditions', {
          params: this.currentFilter
        });
        
        if (response.data.code === 200 && response.data.data.images.length > 0) {
          const firstImage = response.data.data.images[0];
          const imageId = firstImage.id;
          
          return {
            image: `data:image/jpeg;base64,${response.data.data.base64Images[imageId]}`,
            imageInfo: firstImage,
            rating: response.data.data.ratings[imageId] || 0
          };
        }
        return null;
      } catch (error) {
        if (retries < this.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
          return this.fetchImageWithRetry(retries + 1);
        }
        throw error;
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
    handleFilterChange(filter) {
      this.currentFilter = filter;
      // 保存筛选条件到本地存储
      localStorage.setItem('imageFilter', JSON.stringify(filter));
      this.fetchRandomImage();
    },
    enterFocusMode() {
      this.isFocusMode = true;
      document.documentElement.requestFullscreen();
    },
    async exitFocusMode() {
      this.isFocusMode = false;
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    },
    // 添加触摸相关方法
    handleTouchStart(event) {
      if (!this.isFocusMode || this.isLoading) return;
      
      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
      this.isSwipeInProgress = true;
    },
    
    handleTouchMove(event) {
      if (!this.isSwipeInProgress) return;
      
      // 防止页面滚动
      event.preventDefault();
    },
    
    handleTouchEnd(event) {
      if (!this.isSwipeInProgress) return;
      
      const touchEndX = event.changedTouches[0].clientX;
      const touchEndY = event.changedTouches[0].clientY;
      
      const deltaX = touchEndX - this.touchStartX;
      const deltaY = Math.abs(touchEndY - this.touchStartY);
      
      // 确保是水平滑动
      if (Math.abs(deltaX) > this.minSwipeDistance && deltaY < 75) {
        if (deltaX < 0) {
          // 向左滑动，加载下一张
          this.fetchRandomImage();
        }
      }
      
      this.isSwipeInProgress = false;
    },
  },
  mounted() {
    // 从本地存储恢复筛选条件
    const savedFilter = localStorage.getItem('imageFilter');
    if (savedFilter) {
      this.currentFilter = JSON.parse(savedFilter);
    }
    // 添加全屏变化监听
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        this.isFocusMode = false;
      }
    });
  },
  created() {
    // 添加移动端检测
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (this.isMobile) {
      this.maxConcurrentRequests = 2; // 移动端降低并发请求数
      this.cacheSize = 3; // 移动端降低缓存大小
    }
  },
  beforeUnmount() {
    document.removeEventListener('fullscreenchange', this.exitFocusMode);
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

@media (max-width: 768px) {
  .image-manager {
    padding: 8px;
    gap: 12px;
    border-radius: 8px;
    
    .button-group {
      padding: 0 8px;
      margin-bottom: 8px;
      
      .custom-button {
        width: 100%;
        max-width: none;
        padding: 10px;
        font-size: 14px;
      }
    }
    
    .image-container {
      height: calc(100vh - 280px); // 动态计算高度,给图片更多空间
      min-height: 300px;
      margin: 0 -8px; // 延伸到边缘
      border-radius: 0; // 移动端去掉圆角
      
      img {
        height: 100%;
        padding: 0; // 移除padding增加空间
        object-fit: contain;
      }
    }
    
    .loading-container {
      height: calc(100vh - 280px);
      min-height: 300px;
    }
    
    .rating-container {
      margin-top: 8px;
      .rating {
        --el-rate-icon-size: 28px; // 稍微缩小评分图标
        transform: none;
        margin: 12px 0;
      }
    }
    
    .tabs-container {
      margin-top: 8px;
      border-radius: 8px;
      
      &.mobile-optimized {
        .el-tabs__header {
          margin: 0;
          padding: 8px 8px 0;
          
          .el-tabs__nav-wrap {
            padding: 0;
          }
          
          .el-tabs__item {
            font-size: 12px;
            height: 36px;
            line-height: 36px;
          }
        }
        
        .el-tabs__content {
          padding: 12px 8px;
        }
      }
    }
    
    .refresh-button {
      margin-top: 8px;
      width: calc(100% - 16px); // 考虑padding
      height: 36px;
      font-size: 14px;
    }
  }
  
  // 全屏模态框优化
  .image-modal {
    background-color: rgba(0, 0, 0, 0.9);
    
    .modal-image {
      max-width: 100%;
      max-height: 100%;
      margin: 0;
      border-radius: 0;
      object-fit: contain;
    }
  }
  
  // 配置部分优化
  .config-section {
    padding: 8px;
    gap: 12px;
    
    .custom-switch {
      margin-top: 4px;
    }
    
    .cache-size-input {
      width: 100%;
    }
  }
}

// 横屏模式优化
@media (max-width: 768px) and (orientation: landscape) {
  .image-manager {
    .image-container {
      height: calc(100vh - 180px); // 横屏时调整高度
    }
    
    .loading-container {
      height: calc(100vh - 180px);
    }
    
    .tabs-container {
      &.mobile-optimized {
        .el-tabs__header {
          .el-tabs__item {
            height: 32px;
            line-height: 32px;
          }
        }
      }
    }
  }
}

// 超小屏幕优化
@media (max-width: 320px) {
  .image-manager {
    .image-container {
      height: calc(100vh - 240px);
      min-height: 240px;
    }
    
    .rating-container .rating {
      --el-rate-icon-size: 24px;
    }
  }
}

// 添加触摸相关优化
@media (hover: none) {
  .image-container img {
    cursor: default;
  }
  
  .custom-button {
    &:active {
      transform: scale(0.98);
    }
  }
}

// 专注模式相关样式
.image-manager.focus-mode {
  padding: 0;
  gap: 0;
  border-radius: 0;
  border: none;
  height: 100vh;
  max-width: none;
  position: relative;
  
  .image-container {
    width: 100vw;
    height: 100vh;
    max-width: none;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
    touch-action: none; // 防止浏览器的默认触摸行为
    
    img {
      max-width: 100vw;
      max-height: 100vh;
      object-fit: contain;
      padding: 0;
      cursor: default; // 移除指针样式
      user-select: none; // 防止图片被选中
      -webkit-user-drag: none; // 防止图片被拖拽
    }
  }
  
  .focus-controls {
    // 移除原有的position: fixed和布局相关样式
    
    .focus-controls-top {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 50%, transparent 100%);
      z-index: 100;
      opacity: 1;
      transition: opacity 0.3s;
      backdrop-filter: blur(5px);
      
      &:not(:hover) {
        opacity: 0.6;
      }
      
      &:hover {
        opacity: 1;
      }
    }
    
    .focus-controls-bottom {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 50%, transparent 100%);
      z-index: 100;
      opacity: 1;
      transition: opacity 0.3s;
      backdrop-filter: blur(5px);
      
      &:not(:hover) {
        opacity: 0.6;
      }
      
      &:hover {
        opacity: 1;
      }
    }

    .focus-rating {
      --el-rate-icon-size: 36px; // 底部评分稍微放大
      filter: drop-shadow(0 0 3px rgba(0,0,0,0.8));
      
      :deep(.el-rate__icon) {
        color: #fff;
        text-shadow: 0 0 3px rgba(0,0,0,0.8);
        margin: 0 4px; // 调整星星间距
        
        &.hover {
          transform: scale(1.1);
        }
        
        &.el-rate__icon--void {
          color: rgba(255, 255, 255, 0.4);
        }
      }
    }

    // ...existing button styles...
  }
  
  // 隐藏非专注模式元素
  .button-group,
  .rating-container,
  .refresh-button,
  .tabs-container {
    display: none;
  }
}

// 添加专注模式按钮样式
.focus-button {
  background: var(--el-color-success);
  border-color: var(--el-color-success);
  
  .el-icon {
    margin-right: 4px;
  }
  
  &:hover {
    background: var(--el-color-success-light-3);
    border-color: var(--el-color-success-light-3);
  }
}

@media (max-width: 768px) {
  // ...existing mobile styles...
  
  .focus-controls {
    padding: 12px;
    
    .focus-controls-top {
      padding: 12px;
    }
    
    .focus-controls-bottom {
      padding: 16px;
    }
    
    .focus-rating {
      --el-rate-icon-size: 32px; // 移动端评分图标大小
    }
    
    // ...existing mobile styles...
  }
}

// 超小屏幕优化
@media (max-width: 320px) {
  .image-manager.focus-mode {
    .focus-controls {
      .focus-rating {
        --el-rate-icon-size: 28px;
      }
    }
  }
}

// 添加滑动过渡动画
@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.image-container {
  &.sliding-out {
    animation: slideOut 0.3s ease-out;
  }
  
  &.sliding-in {
    animation: slideIn 0.3s ease-out;
  }
}

// 移动端优化
@media (max-width: 768px) {
  .image-manager.focus-mode {
    .focus-controls {
      // ...existing styles...
      
      .focus-controls-top {
        // 在移动端隐藏"下一张"按钮，因为可以通过滑动切换
        .focus-next-button {
          display: none;
        }
      }
    }
  }
}
</style>