import { ref } from 'vue'
import type { Theme } from '@/theme'

// 默认主题配置
const defaultTheme: Theme = {
  name: 'wakaba',
  label: '若叶睦',
  colors: {
    primary: '#4e7c5f',
    primaryLight: '#e8f3e9',
    accent: '#f8c291',
    textPrimary: '#2c3e50',
    textSecondary: '#7f8c8d',
    borderColor: '#d1d9d6',
    backgroundColor: '#f5f9f5',
    cardBg: '#ffffff',
    menuBg: '#4e7c5f',
    menuText: '#ffffff',
    menuHover: '#3a5d4a',
    menuActive: '#f8c291',
  }
}

// 从本地存储加载主题
export function loadTheme(): Theme {
  const savedTheme = localStorage.getItem('theme')
  return savedTheme ? JSON.parse(savedTheme) : defaultTheme
}

// 保存主题到本地存储
export function saveTheme(theme: Theme) {
  localStorage.setItem('theme', JSON.stringify(theme))
}

// 应用主题
export function applyTheme(theme: Theme) {
  const root = document.documentElement
  const { colors } = theme
  
  // 设置CSS变量
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value as string)
  })
  
  // 设置Element Plus主题色
  root.style.setProperty('--el-color-primary', colors.primary)
  
  // 保存当前主题
  currentTheme.value = theme
  saveTheme(theme)
}

// 当前主题
const currentTheme = ref<Theme>(loadTheme())

// 主题组合式函数
export function useTheme() {
  // 应用当前主题
  applyTheme(currentTheme.value)
  
  return {
    currentTheme,
    applyTheme
  }
}
