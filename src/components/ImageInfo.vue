<template>
  <div class="image-info">
    <div v-for="(value, key) in imageInfo" :key="key" class="info-item">
      <strong>{{ key }}:</strong> {{ value }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageInfo',
  props: {
    imageInfo: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style scoped>
.image-info {
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color);
  color: var(--el-text-color-primary);
  
  .info-item {
    background: var(--el-bg-color);
    border-color: var(--el-border-color);
  }
}
.image-info .info-item {
  padding: 8px 12px;
  background-color: var(--el-fill-color-light); /* 使用Element Plus的主题变量 */
  border-radius: 8px;
  backdrop-filter: blur(5px);
  border: 1px solid var(--el-border-color); /* 使用Element Plus的主题变量 */
  color: var(--el-text-color-regular); /* 使用Element Plus的主题变量 */
}
</style>