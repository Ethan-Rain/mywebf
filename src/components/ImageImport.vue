<template>
  <div :class="['import-section', { dark: isDarkMode }]">
    <el-input v-model="directoryPath" placeholder="输入目录路径" style="width: 300px; margin-right: 10px;" class="custom-input"></el-input>
    <el-button type="primary" @click="handleImport" class="custom-button" :loading="isLoading">导入图片</el-button>
    <div v-if="importResult" class="import-result">
      <p>{{ importResult.message }}</p>
      <p v-if="importResult.success">总图片数: {{ importResult.totalImages }}</p>
    </div>
    <el-progress v-if="isLoading" :percentage="progress" :status="progressStatus" class="progress-bar"></el-progress>
  </div>
</template>

<script>
import { ElInput, ElButton, ElProgress } from 'element-plus';

export default {
  name: 'ImageImport',
  components: {
    ElInput,
    ElButton,
    ElProgress,
  },
  props: {
    importResult: {
      type: Object,
      default: () => ({}),
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isDarkMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      directoryPath: '',
      progress: 0,
      progressStatus: 'success',
    };
  },
  methods: {
    handleImport() {
      this.$emit('importImages', this.directoryPath);
      this.simulateProgress();
    },
    simulateProgress() {
      if (this.isLoading) {
        this.progress = 0;
        const interval = setInterval(() => {
          if (this.progress >= 100) {
            clearInterval(interval);
            return;
          }
          this.progress += 10;
        }, 300);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.import-section {
  display: flex;
  gap: 12px;
  width: 100%;
  max-width: 800px;
  flex-wrap: wrap;
  justify-content: center;
  background: var(--el-bg-color);
  color: var(--el-text-color-primary);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  padding: 16px;

  &.dark {
    background: var(--el-bg-color-overlay);
    color: var(--el-text-color-primary);
    border-color: var(--el-border-color-light);
  }
}

.custom-input {
  flex: 1;
  min-width: 250px;
}

.import-result {
  width: 100%;
  text-align: center;
  margin-top: 16px;
}

.progress-bar {
  width: 100%;
  margin-top: 16px;
}
</style>