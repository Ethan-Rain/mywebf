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
  width: 100%;
  background: var(--el-bg-color); /* 使用Element Plus的主题变量 */
  backdrop-filter: blur(5px);
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  color: var(--el-text-color-regular); /* 使用Element Plus的主题变量 */
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