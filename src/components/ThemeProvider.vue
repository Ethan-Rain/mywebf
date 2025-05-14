<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { ref, provide, watch } from 'vue';
import { Theme, themes, applyTheme, loadTheme } from '@/theme';

const currentTheme = ref<Theme>(loadTheme());

// 应用主题
const setTheme = (themeName: keyof typeof themes) => {
  currentTheme.value = themes[themeName];
  applyTheme(currentTheme.value);
};

// 监听主题变化
watch(currentTheme, (newTheme) => {
  applyTheme(newTheme);
}, { deep: true });

// 提供主题和设置主题的方法
provide('theme', {
  currentTheme,
  themes: Object.keys(themes),
  setTheme,
});

// 初始化时应用主题
applyTheme(currentTheme.value);
</script>
