import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { themes, applyTheme as applyThemeUtil, loadTheme } from '@/theme'
import type { Theme } from '@/theme'

export const useThemeStore = defineStore('theme', () => {
  // 当前主题
  const currentTheme = ref<Theme>(loadTheme())
  
  // 切换主题
  const changeTheme = (themeName: string) => {
    const theme = themes[themeName as keyof typeof themes]
    if (theme) {
      applyTheme(theme)
    }
  }
  
  // 应用主题
  const applyTheme = (theme: Theme) => {
    try {
      applyThemeUtil(theme)
      currentTheme.value = theme
      return true
    } catch (error) {
      console.error('Failed to apply theme:', error)
      return false
    }
  }
  
  // 初始化主题
  const initTheme = () => {
    const savedTheme = loadTheme()
    if (savedTheme) {
      return applyTheme(savedTheme)
    }
    return false
  }
  
  // 获取当前主题名称
  const currentThemeName = computed(() => currentTheme.value.name)
  
  // 监听主题变化
  watch(() => currentTheme.value, (newTheme) => {
    if (newTheme) {
      applyThemeUtil(newTheme)
    }
  }, { immediate: true })
  
  return {
    currentTheme,
    currentThemeName,
    changeTheme,
    applyTheme,
    initTheme
  }
})

export default useThemeStore
