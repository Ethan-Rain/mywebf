<template>
  <div :class="['rating-statistics', { dark: isDarkMode }]">
    <el-card class="statistics-card">
      <div class="header-container">
        <el-button 
          type="primary" 
          @click="initChart" 
          :loading="loading"
          class="refresh-btn"
        >
          刷新数据
        </el-button>
      </div>
      <div v-loading="loading">
        <div v-if="chartData.length" ref="chart" style="height: 400px;"></div>
        <p v-else>暂无评分数据</p>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ElCard } from 'element-plus';
import * as echarts from 'echarts';
import axiosInstance from '@/utils/axiosInstance';

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
  data() {
    return {
      loading: false,
      chartData: [],
      chartInstance: null
    };
  },
  watch: {
    isActive: {
      handler(val) {
        console.log('isActive changed:', val); // 添加调试日志
        if (val) {
          this.initChart();
        }
      },
      immediate: true
    },
    isDarkMode() {
      this.updateChartTheme();
    }
  },
  mounted() {
    this.initChart();
  },
  methods: {
    async initChart() {
      try {
        this.loading = true;
        const response = await axiosInstance.get('/ratings/filter/countRatingsByScore');
        
        if (response.data.code === 200) {
          this.chartData = Object.values(response.data.data);
          this.renderChart();
        }
      } catch (error) {
        console.error('获取评分数据失败:', error);
      } finally {
        this.loading = false;
      }
    },
    renderChart() {
      if (!this.$refs.chart) return;
      
      // 销毁已有实例
      if (this.chartInstance) {
        this.chartInstance.dispose();
        window.removeEventListener('resize', this.resizeHandler); // 移除旧监听
      }
      
      // 添加主题变量
      const theme = this.isDarkMode ? {
        backgroundColor: 'transparent',
        textStyle: { color: '#E5E5E5' },
        axisLine: { lineStyle: { color: '#666' } }
      } : {};
      
      // 创建新实例
      this.chartInstance = echarts.init(this.$refs.chart);
      
      // 添加resize事件监听
      this.resizeHandler = () => this.chartInstance.resize();
      window.addEventListener('resize', this.resizeHandler);
      
      const option = {
        ...theme,
        title: {
          text: '评分分布统计',
          left: 'center',
          textStyle: {
            color: this.isDarkMode ? '#E5E5E5' : '#333'
          }
        },
        tooltip: {
          trigger: 'item'
        },
        xAxis: {
          type: 'category',
          data: this.chartData.map(item => `${item.score} 星`),
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: this.chartData.map(item => item.count),
          type: 'bar',
          itemStyle: {
            color: '#409EFF'
          }
        }]
      };
      
      this.chartInstance.setOption(option);
      window.addEventListener('resize', () => this.chartInstance.resize());
    },
    updateChartTheme() {
      if (this.chartInstance) {
        this.chartInstance.dispose();
        this.renderChart();
      }
    }
  },
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  }
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
  
  /* 新增容器高度限制 */
  min-height: 460px;
}

/* 新增图表容器样式 */
.statistics-card >>> div[ref="chart"] {
  width: 100%;
  height: 400px !important;
}

/* 新增头部容器样式 */
.header-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.refresh-btn {
  margin-left: auto;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
}

.dark .refresh-btn {
  background-color: var(--el-color-primary-dark-2);
  border-color: var(--el-color-primary-light-3);
  
  &:hover {
    background-color: var(--el-color-primary-dark-1);
  }
}
</style>