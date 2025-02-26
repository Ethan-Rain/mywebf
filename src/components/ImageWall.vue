<template>
  <div class="image-wall">
    <div class="wall-header">
      <el-select v-model="layout" placeholder="选择布局">
        <el-option label="小图模式" value="small" />
        <el-option label="中图模式" value="medium" />
        <el-option label="大图模式" value="large" />
      </el-select>
      <div class="wall-settings">
        <el-switch
          v-model="autoRefreshAfterRating"
          active-text="评分后刷新"
          class="setting-switch"
        />
      </div>
      <el-button type="primary" @click="loadMoreImages" :loading="loading">
        加载更多
      </el-button>
    </div>
    
    <div :class="['wall-container', layout]">
      <div v-for="(image, index) in images" 
           :key="index" 
           class="image-item">
        <img :src="`data:image/jpeg;base64,${image.base64Image}`" 
             :alt="image.imageInfo.fileName" 
             @click="handleImageClick(image)" />
        <div class="image-overlay" @click.stop>
          <el-rate v-model="image.rating" 
                  @change="(value) => handleRatingChange(image, value)"
                  :disabled="loading">
          </el-rate>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-overlay">
      <el-icon class="is-loading"><Loading /></el-icon>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import axiosInstance from '@/utils/axiosInstance'

export default {
  name: 'ImageWall',
  components: {
    Loading
  },
  props: {
    filter: {
      type: Object,
      default: () => ({})
    },
    parentCache: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      images: [],
      loading: false,
      layout: 'medium',
      page: 1,
      pageSize: 12,
      autoRefreshAfterRating: true, // 新增设置项
      isCacheEnabled: false,  // 添加缓存控制
      cachedImages: {},       // 修改为对象,用于存储不同条件的缓存
      cacheSize: 5,           // 每个条件的缓存大小
      isCacheRefilling: false // 新增:标记是否正在补充缓存
    }
  },
  methods: {
    // 获取缓存key
    getCacheKey() {
      return JSON.stringify({
        ...this.filter,
        page: this.page,
        pageSize: this.pageSize
      })
    },

    // 从缓存获取图片
    getFromCache() {
      // 优先使用父组件的缓存
      if (this.parentCache && this.parentCache.getFromCache) {
        const parentCachedImage = this.parentCache.getFromCache();
        if (parentCachedImage) return parentCachedImage;
      }
      
      // 回退到自己的缓存逻辑
      if (!this.isCacheEnabled) return null
      const key = this.getCacheKey()
      const cache = this.cachedImages[key] || []
      // 一次性返回多个缓存图片
      if (cache.length > 0) {
        const imagesToReturn = cache.splice(0, this.pageSize)
        return imagesToReturn
      }
      return null
    },

    // 添加到缓存
    addToCache(images) {
      // 同步到父组件的缓存
      if (this.parentCache && this.parentCache.addToCache) {
        images.forEach(image => this.parentCache.addToCache(image));
      }
      
      // 保存到自己的缓存
      if (!this.isCacheEnabled) return
      const key = this.getCacheKey()
      if (!this.cachedImages[key]) {
        this.cachedImages[key] = []
      }
      
      const cache = this.cachedImages[key]
      cache.push(...images)
      
      // 限制缓存大小
      while (cache.length > this.cacheSize) {
        cache.shift()
      }
    },

    async loadMoreImages() {
      // 如果正在加载则直接返回
      if (this.loading) return
      
      // 尝试从缓存获取图片
      if (this.isCacheEnabled) {
        const cachedImages = this.getFromCache()
        if (cachedImages && cachedImages.length > 0) {
          // 直接添加缓存的图片，无需显示加载状态
          this.images.push(...cachedImages)
          // 异步补充缓存
          this.refillCache()
          return
        }
      }
      
      // 只有在需要从服务器加载时才显示加载状态
      this.loading = true
      
      try {
        const response = await axiosInstance.get('/api/images', {
          params: {
            page: this.page,
            pageSize: this.pageSize,
            ...this.filter
          }
        })

        if (response.data.images && response.data.images.length > 0) {
          this.images.push(...response.data.images)
          this.page++
          
          // 如果启用了缓存,预加载下一页数据
          if (this.isCacheEnabled) {
            this.prefetchNextPage()
          }
        }
      } catch (error) {
        ElMessage.error('加载图片时出错')
      } finally {
        this.loading = false
      }
    },

    async refillCache() {
      if (!this.isCacheEnabled || this.isCacheRefilling) return
      
      this.isCacheRefilling = true
      try {
        const key = this.getCacheKey()
        const cache = this.cachedImages[key] || []
        
        if (cache.length < this.cacheSize) {
          const response = await axiosInstance.get('/api/images', {
            params: {
              page: this.page + 1,
              pageSize: this.cacheSize - cache.length,
              ...this.filter
            }
          })
          
          if (response.data.images) {
            this.addToCache(response.data.images)
          }
        }
      } catch (error) {
        console.error('补充缓存时出错:', error)
      } finally {
        this.isCacheRefilling = false
      }
    },

    async prefetchNextPage() {
      const response = await axiosInstance.get('/api/images', {
        params: {
          page: this.page + 1,
          pageSize: this.pageSize,
          ...this.filter
        }
      })
      
      if (response.data.images) {
        this.addToCache(response.data.images)
      }
    },

    handleImageClick(image) {
      this.$emit('image-click', image)
    },
    
    async handleRatingChange(image, value) {
      const originalRating = image.rating
      image.rating = value // 立即更新UI显示
      
      // 如果需要刷新且启用了缓存，立即使用缓存替换图片
      if (this.autoRefreshAfterRating && this.isCacheEnabled) {
        const cachedImage = this.getFromCache()
        if (cachedImage) {
          const index = this.images.findIndex(img => img === image)
          if (index !== -1) {
            this.images[index] = cachedImage
          }
        }
      }

      // 异步进行评分更新和缓存补充
      try {
        const response = await axiosInstance.put(`/ratings/change/${image.imageInfo.id}/${value}`)
        if (response.data.code === 200) {
          ElMessage.success('评分更新成功')
          
          // 如果启用了缓存，补充缓存
          if (this.isCacheEnabled) {
            this.refillCache()
          } 
          // 如果需要刷新但没有缓存或缓存未命中，从服务器获取新图片
          else if (this.autoRefreshAfterRating) {
            const params = {
              ...this.filter,
              pageSize: 1
            }
            
            const newImageResponse = await axiosInstance.get('/images/getRandomImageWithConditions', { params })
            if (newImageResponse.data.code === 200 && newImageResponse.data.data.images.length > 0) {
              const newImage = {
                imageInfo: newImageResponse.data.data.images[0],
                base64Image: newImageResponse.data.data.base64Images[newImageResponse.data.data.images[0].id],
                rating: newImageResponse.data.data.ratings[newImageResponse.data.data.images[0].id] || 0
              }
              
              const index = this.images.findIndex(img => img === image)
              if (index !== -1) {
                this.images[index] = newImage
              }
            }
          }
        } else {
          image.rating = originalRating
          ElMessage.error('评分更新失败')
        }
      } catch (error) {
        image.rating = originalRating
        console.error('Error updating rating:', error)
        ElMessage.error('评分更新失败')
      }
    },

    // 新增方法：异步补充缓存和替换图片
    async refillCacheAndReplace(image) {
      try {
        const params = {
          ...this.filter,
          pageSize: 1
        }
        
        const response = await axiosInstance.get('/images/getRandomImageWithConditions', { params })
        
        if (response.data.code === 200 && response.data.data.images.length > 0) {
          const newImage = {
            imageInfo: response.data.data.images[0],
            base64Image: response.data.data.base64Images[response.data.data.images[0].id],
            rating: response.data.data.ratings[response.data.data.images[0].id] || 0
          }

          // 如果没有使用缓存中的图片才替换
          if (this.isCacheEnabled) {
            this.addToCache(newImage)
          } else {
            const index = this.images.findIndex(img => img === image)
            if (index !== -1) {
              this.images[index] = newImage
            }
          }
        }
      } catch (error) {
        console.error('Error refilling cache:', error)
      }
    },

    reset() {
      this.images = []
      this.page = 1
      this.cachedImages = {} // 清空所有缓存
      this.loadMoreImages()
    }
  },
  
  created() {
    // 从本地存储恢复设置
    const savedAutoRefresh = localStorage.getItem('imageWallAutoRefresh')
    if (savedAutoRefresh !== null) {
      this.autoRefreshAfterRating = savedAutoRefresh === 'true'
    }
    // 恢复缓存设置
    const savedCacheEnabled = localStorage.getItem('imageWallCacheEnabled')
    if (savedCacheEnabled !== null) {
      this.isCacheEnabled = savedCacheEnabled === 'true'
    }
    this.loadMoreImages()
  },
  
  watch: {
    filter: {
      handler() {
        this.reset()
      },
      deep: true
    },
    // 添加设置的本地存储
    autoRefreshAfterRating: {
      handler(newVal) {
        localStorage.setItem('imageWallAutoRefresh', newVal)
      }
    },
    isCacheEnabled: {
      handler(newVal) {
        localStorage.setItem('imageWallCacheEnabled', newVal)
        if (!newVal) {
          this.cachedImages = {}
        } else {
          this.refillCache()
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.image-wall {
  width: 100%;
  
  .wall-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 0 16px;

    .wall-settings {
      display: flex;
      align-items: center;
      gap: 16px;
      
      .setting-switch {
        margin: 0 8px;
      }
    }
  }
  
  .wall-container {
    display: grid;
    gap: 16px;
    padding: 16px;
    
    &.small {
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      .image-item {
        height: 160px;
      }
    }
    
    &.medium {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      .image-item {
        height: 240px;
      }
    }
    
    &.large {
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      .image-item {
        height: 320px;
      }
    }
  }
  
  .image-item {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
    
    &:hover {
      transform: translateY(-4px);
      
      .image-overlay {
        opacity: 1;
      }
    }
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .image-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 12px;
      background: rgba(0, 0, 0, 0.6);
      opacity: 0;
      transition: opacity 0.3s;
      display: flex;
      justify-content: center;
      cursor: default;
    }
  }
  
  .loading-overlay {
    display: flex;
    justify-content: center;
    padding: 20px;
    font-size: 24px;
  }
}
</style>
