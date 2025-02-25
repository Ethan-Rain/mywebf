<template>
  <div class="filter-config">
    <el-form :model="filterForm" label-width="100px">
      <el-form-item label="评分范围">
        <el-row :gutter="10">
          <el-col :span="11">
            <el-input-number 
              v-model="filterForm.minScore" 
              :min="0" 
              :max="5"
              :step="0.5"
              placeholder="最低分"
            />
          </el-col>
          <el-col :span="2" class="text-center">-</el-col>
          <el-col :span="11">
            <el-input-number 
              v-model="filterForm.maxScore" 
              :min="0" 
              :max="5"
              :step="0.5"
              placeholder="最高分"
            />
          </el-col>
        </el-row>
      </el-form-item>
      
      <el-form-item label="图片分类">
        <el-select 
          v-model="filterForm.category"
          clearable 
          placeholder="选择分类"
        >
          <el-option
            v-for="item in categories"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="图片状态">
        <el-select 
          v-model="filterForm.status"
          clearable 
          placeholder="选择状态"
        >
          <el-option
            v-for="item in statuses"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-row :gutter="10" justify="center">
          <el-col :span="12">
            <el-button type="primary" @click="applyFilter" :loading="loading">
              应用筛选
            </el-button>
          </el-col>
          <el-col :span="12">
            <el-button @click="resetFilter">重置筛选</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'ImageFilterConfig',
  props: {
    loading: Boolean
  },
  data() {
    return {
      filterForm: {
        minScore: null,
        maxScore: null,
        category: '',
        status: ''
      },
      categories: ['风景', '人像', '动物', '建筑', '艺术', '其他'],
      statuses: ['正常', '待审核', '已归档']
    }
  },
  methods: {
    applyFilter() {
      this.$emit('filter-change', { ...this.filterForm })
    },
    resetFilter() {
      this.filterForm = {
        minScore: null,
        maxScore: null,
        category: '',
        status: ''
      }
      this.$emit('filter-change', { ...this.filterForm })
    }
  }
}
</script>

<style scoped>
.filter-config {
  padding: 20px;
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);
}

.text-center {
  text-align: center;
  line-height: 32px;
}
</style>
