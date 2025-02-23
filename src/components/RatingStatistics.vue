<template>
  <div :class="['rating-statistics', { dark: isDarkMode }]">
    <el-card class="statistics-card">
      <p>评分统计功能已移除。</p>
    </el-card>
  </div>
</template>

<script>
import { ElCard } from 'element-plus';

export default {
  name: 'RatingStatistics',
  components: {
    ElCard,
  },
  props: {
    isDarkMode: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.rating-statistics {
  width: 100%;
  padding: 20px;
  background: var(--el-bg-color);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.statistics-card {
  background: var(--el-bg-color);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
}
</style>