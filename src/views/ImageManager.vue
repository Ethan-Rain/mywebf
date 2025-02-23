<template>
  <div :class="['image-manager', { dark: isDarkMode }]">
    <h1>图片管理</h1>
    <div class="button-group">
      <el-button type="primary" @click="fetchRandomImage" class="custom-button">随机获取图片</el-button>
      <el-switch v-model="isDarkMode" active-text="黑夜模式" inactive-text="白天模式" class="custom-switch"></el-switch>
    </div>
    <div v-if="image" class="image-container">
      <img :src="image" alt="Random" @click="showImageInModal" />
    </div>
    <el-button v-if="image" type="primary" @click="refreshImage" class="refresh-button">刷新图片</el-button>
    <div v-if="isImageModalVisible" class="image-modal" @click="isImageModalVisible = false">
      <img :src="image" alt="Full Size" class="modal-image" />
    </div>
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
    <div class="import-section">
      <el-input v-model="directoryPath" placeholder="输入目录路径" style="width: 300px; margin-right: 10px;" class="custom-input"></el-input>
      <el-button type="primary" @click="importImages" class="custom-button">导入图片</el-button>
    </div>
    <div v-if="importResult" class="import-result">
      <p>{{ importResult.message }}</p>
      <p v-if="importResult.success">总图片数: {{ importResult.totalImages }}</p>
    </div>
    <div v-if="imageInfo" class="image-info">
      <div class="info-item"><strong>文件名:</strong> {{ imageInfo.fileName }}</div>
      <div class="info-item"><strong>格式:</strong> {{ imageInfo.format }}</div>
      <div class="info-item"><strong>大小:</strong> {{ (imageInfo.size / 1024).toFixed(2) }} KB</div>
      <div class="info-item"><strong>状态:</strong> {{ imageInfo.status }}</div>
      <div class="info-item"><strong>创建时间:</strong> {{ new Date(imageInfo.createdAt).toLocaleString() }}</div>
      <div class="info-item"><strong>更新时间:</strong> {{ new Date(imageInfo.updatedAt).toLocaleString() }}</div>
      <el-rate v-model="rating" @change="changeRating" class="rating"></el-rate>
    </div>
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p class="loading-text">正在导入图片，请稍候...</p>
    </div>
  </div>
</template>

<script>
import axiosInstance from '@/utils/axiosInstance'; // 导入 Axios 实例
import { ElButton, ElSwitch, ElInput, ElMessage } from 'element-plus';

export default {
  name: 'ImageManager',
  components: {
    ElButton,
    ElSwitch,
    ElInput,
    ElMessage,
  },
  data() {
    return {
      image: null,
      imageInfo: null, // 新增 imageInfo 数据
      directoryPath: '',
      importResult: null,
      error: null,
      isDarkMode: false,
      isImageModalVisible: false,
      isLoading: false,
      rating: 0, // 新增 rating 数据
    };
  },
  methods: {
    async fetchRandomImage() {
      await this.loadImage();
    },
    async importImages() {
      this.isLoading = true;
      try {
        const sanitizedPath = this.directoryPath.replace(/\\/g, '\\\\');
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
    async reloadImage() {
      if (this.image) {
        const currentImage = this.image;
        this.image = null;
        setTimeout(() => {
          this.image = currentImage;
        }, 100);
      }
    },
    async refreshImage() {
      await this.loadImage();
    },
    async loadImage() {
      try {
        const response = await axiosInstance.get('/images/getRandomImageWithInfo');
        if (response.data.code === 200) {
          this.image = `data:image/jpeg;base64,${response.data.data.base64Image}`;
          this.imageInfo = response.data.data.imageInfo; // 保存 imageInfo 数据
          this.rating = response.data.data.score || 0; // 初始化 rating 数据
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
            await this.fetchRandomImage(); // 评分成功后刷新图片
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
.image-manager {
  padding: 20px;
  width: 100%;
  height: 100vh; /* 全屏显示 */
  margin: 0;
  background: linear-gradient(135deg, #f9f9f9, #e0e0e0); /* 渐变背景 */
  border-radius: 0; /* 去掉圆角 */
  box-shadow: none; /* 去掉阴影 */
  transition: background-color 0.3s, color 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* 调整为顶部对齐 */
  position: relative; /* 为了定位刷新按钮 */
}

.image-manager.dark {
  background: linear-gradient(135deg, #2c3e50, #34495e); /* 深色渐变背景 */
  color: #ecf0f1; /* 修改为浅色字体 */
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 2.5em;
  color: #34495e;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.custom-button {
  background-color: #3498db !important;
  border-color: #3498db !important;
  color: #fff !important;
  transition: background-color 0.3s, box-shadow 0.3s, transform 0.3s;
  cursor: pointer; /* 优化鼠标样式 */
}

.custom-button:hover {
  background-color: #2980b9 !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px); /* 按钮悬停效果 */
}

.custom-switch .el-switch__core {
  background-color: #3498db !important;
}

.custom-input .el-input__inner {
  border-color: #3498db !important;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.custom-input .el-input__inner:focus {
  border-color: #2980b9 !important;
  box-shadow: 0 0 8px rgba(41, 128, 185, 0.5); /* 输入框聚焦效果 */
}

.image-container {
  text-align: center;
  margin: 20px auto;  /* 改为自动边距实现水平居中 */
  width: 100%;
  max-width: 800px;  /* 添加最大宽度限制 */
  height: 400px; /* 固定高度 */
  display: flex;      /* 新增flex布局 */
  justify-content: center;
  align-items: center;
  border: 1px solid #ddd; /* 调试用边框，可移除 */
  border-radius: 12px; /* 增加圆角 */
  background-color: #fff; /* 增加白色背景 */
  transition: box-shadow 0.3s, transform 0.3s;
}

.image-container:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: scale(1.02); /* 图片容器悬停效果 */
}

.image-container img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 12px;
  object-fit: contain; /* 确保图片适应容器 */
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.image-container img:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
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
}

.modal-image {
  max-width: 90%;
  max-height: 90%;
  border-radius: 12px;
}

.error-message {
  color: #e74c3c;
  text-align: center;
  margin-top: 20px;
}

.import-section {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  flex-wrap: wrap;
}

.import-result {
  text-align: center;
  margin-top: 20px;
}

.image-info {
  margin-top: 20px;
  text-align: left; /* 左对齐 */
  background-color: #f0f0f0;
  padding: 20px; /* 增加内边距 */
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%; /* 全宽 */
  max-width: 800px; /* 最大宽度 */
}

.image-info .info-item {
  margin-bottom: 10px; /* 增加项之间的间距 */
}

.image-info .rating {
  text-align: center; /* 居中对齐 */
  margin-top: 20px; /* 增加顶部间距 */
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-left-color: #ffffff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 10px;
  color: #ffffff;
  font-size: 1.2em;
}

.refresh-button {
  margin-top: 20px; /* 将按钮放置在图片下方 */
  background-color: #e74c3c;
  border-color: #e74c3c;
  color: #fff;
  transition: background-color 0.3s, box-shadow 0.3s, transform 0.3s;
  cursor: pointer;
}

.refresh-button:hover {
  background-color: #c0392b;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.rating {
  margin-top: 10px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (min-width: 1200px) {
  .image-manager {
    max-width: 80%; /* 确保在大屏幕上内容不会太宽 */
  }
}

@media (max-width: 600px) {
  .image-manager {
    padding: 10px;
  }

  h1 {
    font-size: 2em; /* 调整标题大小 */
  }

  .button-group {
    flex-direction: column;
    gap: 10px;
  }

  .import-section {
    flex-direction: column;
    gap: 10px;
  }

  .image-container {
    height: auto; /* 适应内容高度 */
    max-width: 100%; /* 移动端全宽显示 */
  }

  .image-container img {
    max-width: 100%;
    max-height: 100%;
  }
}
</style>