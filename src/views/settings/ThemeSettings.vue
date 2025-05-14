<template>
  <div class="theme-settings">
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <span>主题设置</span>
        </div>
      </template>

      <el-form label-position="top">
        <!-- 预设主题 -->
        <el-form-item label="预设主题">
          <div class="theme-presets">
            <div 
              v-for="theme in presetThemes" 
              :key="theme.name"
              class="theme-preset"
              :class="{ 'active': currentTheme.name === theme.name }"
              @click="applyPresetTheme(theme.name)"
            >
              <div class="theme-preview" :style="{
                background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.accent} 100%)`
              }">
                <el-icon v-if="currentTheme.name === theme.name" class="check-icon">
                  <Check />
                </el-icon>
              </div>
              <span class="theme-name">{{ theme.label }}</span>
            </div>
          </div>
        </el-form-item>

        <!-- 自定义主题 -->
        <el-divider>自定义主题</el-divider>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="主色">
              <el-color-picker 
                v-model="customTheme.colors.primary" 
                show-alpha
                @change="applyCustomTheme"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="强调色">
              <el-color-picker 
                v-model="customTheme.colors.accent" 
                show-alpha
                @change="applyCustomTheme"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="文字主色">
              <el-color-picker 
                v-model="customTheme.colors.textPrimary" 
                @change="applyCustomTheme"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文字次色">
              <el-color-picker 
                v-model="customTheme.colors.textSecondary" 
                @change="applyCustomTheme"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="背景色">
              <el-color-picker 
                v-model="customTheme.colors.backgroundColor" 
                @change="applyCustomTheme"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="卡片背景">
              <el-color-picker 
                v-model="customTheme.colors.cardBg" 
                @change="applyCustomTheme"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单背景">
              <el-color-picker 
                v-model="customTheme.colors.menuBg" 
                @change="applyCustomTheme"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单文字">
              <el-color-picker 
                v-model="customTheme.colors.menuText" 
                @change="applyCustomTheme"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" @click="saveCustomTheme">
            保存为自定义主题
          </el-button>
          <el-button @click="resetToDefault">
            重置为默认
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 主题预览 -->
    <el-card class="preview-card">
      <template #header>
        <div class="card-header">
          <span>主题预览</span>
        </div>
      </template>
      
      <div class="preview-container">
        <div class="preview-header">
          <div class="preview-logo">Logo</div>
          <div class="preview-nav">
            <span class="nav-item active">首页</span>
            <span class="nav-item">图片</span>
            <span class="nav-item">收藏</span>
            <span class="nav-item">设置</span>
          </div>
          <div class="preview-user">
            <el-avatar :size="32" src="/img/avatars/wakaba.png" />
          </div>
        </div>
        
        <div class="preview-sidebar">
          <div class="sidebar-menu">
            <div class="menu-item active">
              <el-icon><House /></el-icon>
              <span>首页</span>
            </div>
            <div class="menu-item">
              <el-icon><Picture /></el-icon>
              <span>图片库</span>
            </div>
            <div class="menu-item">
              <el-icon><Star /></el-icon>
              <span>收藏夹</span>
            </div>
            <div class="menu-item">
              <el-icon><Setting /></el-icon>
              <span>设置</span>
            </div>
          </div>
        </div>
        
        <div class="preview-content">
          <el-card class="preview-card-item">
            <template #header>
              <div class="card-header">
                <span>欢迎使用</span>
              </div>
            </template>
            <p>这是一个主题预览卡片，展示当前主题下的样式效果。</p>
            <div class="preview-actions">
              <el-button type="primary">主要按钮</el-button>
              <el-button>默认按钮</el-button>
              <el-button type="link">文字按钮</el-button>
            </div>
          </el-card>
          
          <el-alert
            title="提示信息"
            type="info"
            :closable="false"
            show-icon
            class="preview-alert"
          >
            这是一条提示信息，用于展示当前主题下的提示样式。
          </el-alert>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { Check, House, Picture, Star, Setting } from '@element-plus/icons-vue'
import { useTheme } from '@/composables/useTheme'
import { ElMessage } from 'element-plus'

const { currentTheme, applyTheme } = useTheme()

// 预设主题
const presetThemes = [
  {
    name: 'wakaba',
    label: '若叶睦',
    colors: {
      primary: '#4e7c5f',
      accent: '#f8c291',
      textPrimary: '#2c3e50',
      textSecondary: '#7f8c8d',
      backgroundColor: '#f5f9f5',
      cardBg: '#ffffff',
      menuBg: '#4e7c5f',
      menuText: '#ffffff',
      menuHover: '#3a5d4a',
      menuActive: '#f8c291',
    }
  },
  {
    name: 'light',
    label: '明亮',
    colors: {
      primary: '#409EFF',
      accent: '#67C23A',
      textPrimary: '#303133',
      textSecondary: '#909399',
      backgroundColor: '#f5f7fa',
      cardBg: '#ffffff',
      menuBg: '#304156',
      menuText: '#bfcbd9',
      menuHover: '#263445',
      menuActive: '#409EFF',
    }
  },
  {
    name: 'dark',
    label: '暗黑',
    colors: {
      primary: '#409EFF',
      accent: '#67C23A',
      textPrimary: '#e6e6e6',
      textSecondary: '#a0a0a0',
      backgroundColor: '#141414',
      cardBg: '#1f1f1f',
      menuBg: '#1f1f1f',
      menuText: '#bfcbd9',
      menuHover: '#2d2d2d',
      menuActive: '#409EFF',
    }
  },
  {
    name: 'pink',
    label: '粉红',
    colors: {
      primary: '#e91e63',
      accent: '#ff4081',
      textPrimary: '#2c3e50',
      textSecondary: '#7f8c8d',
      backgroundColor: '#fff5f7',
      cardBg: '#ffffff',
      menuBg: '#e91e63',
      menuText: '#ffffff',
      menuHover: '#c2185b',
      menuActive: '#ff80ab',
    }
  }
]

// 自定义主题
const customTheme = reactive({
  name: 'custom',
  colors: {
    primary: '#4e7c5f',
    accent: '#f8c291',
    textPrimary: '#2c3e50',
    textSecondary: '#7f8c8d',
    backgroundColor: '#f5f9f5',
    cardBg: '#ffffff',
    menuBg: '#4e7c5f',
    menuText: '#ffffff',
    menuHover: '#3a5d4a',
    menuActive: '#f8c291',
  }
})

// 应用预设主题
const applyPresetTheme = (themeName: string) => {
  const theme = presetThemes.find(t => t.name === themeName)
  if (theme) {
    Object.assign(customTheme.colors, theme.colors)
    applyTheme(theme)
  }
}

// 应用自定义主题
const applyCustomTheme = () => {
  applyTheme(customTheme)
}

// 保存自定义主题
const saveCustomTheme = () => {
  const newTheme = {
    name: 'custom',
    label: '自定义主题',
    colors: { ...customTheme.colors }
  }
  
  // 更新预设主题中的自定义主题
  const index = presetThemes.findIndex(t => t.name === 'custom')
  if (index !== -1) {
    presetThemes[index] = newTheme
  } else {
    presetThemes.push(newTheme)
  }
  
  ElMessage.success('自定义主题已保存')
}

// 重置为默认主题
const resetToDefault = () => {
  applyPresetTheme('wakaba')
  ElMessage.success('已重置为默认主题')
}

// 初始化时加载当前主题
onMounted(() => {
  Object.assign(customTheme.colors, currentTheme.value.colors)
})
</script>

<style scoped>
.theme-settings {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.settings-card,
.preview-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.theme-presets {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  margin-top: 8px;
}

.theme-preset {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  padding: 8px;
  border-radius: 4px;
}

.theme-preset:hover {
  background-color: var(--el-color-primary-light-9);
}

.theme-preset.active {
  background-color: var(--el-color-primary-light-8);
}

.theme-preview {
  width: 100%;
  height: 80px;
  border-radius: 4px;
  margin-bottom: 8px;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--el-border-color);
}

.check-icon {
  position: absolute;
  right: 8px;
  bottom: 8px;
  color: #fff;
  background-color: var(--el-color-primary);
  border-radius: 50%;
  padding: 4px;
}

.theme-name {
  font-size: 14px;
  color: var(--el-text-color-regular);
}

/* 预览区域样式 */
.preview-container {
  position: relative;
  min-height: 400px;
  background-color: var(--backgroundColor);
  border-radius: 4px;
  overflow: hidden;
}

.preview-header {
  height: 60px;
  background-color: var(--menuBg);
  display: flex;
  align-items: center;
  padding: 0 20px;
  color: var(--menuText);
  justify-content: space-between;
}

.preview-logo {
  font-weight: bold;
  font-size: 18px;
}

.preview-nav {
  display: flex;
  gap: 24px;
}

.nav-item {
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
  color: var(--menuActive);
  font-weight: 500;
}

.preview-sidebar {
  position: absolute;
  left: 0;
  top: 60px;
  bottom: 0;
  width: 200px;
  background-color: var(--menuBg);
  color: var(--menuText);
  padding: 20px 0;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 12px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  gap: 8px;
}

.menu-item:hover {
  background-color: var(--menuHover);
}

.menu-item.active {
  background-color: var(--menuActive);
  color: #fff;
}

.preview-content {
  margin-left: 200px;
  padding: 24px;
  min-height: 400px;
  background-color: var(--backgroundColor);
}

.preview-card-item {
  margin-bottom: 16px;
}

.preview-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.preview-alert {
  margin-top: 16px;
}
</style>
