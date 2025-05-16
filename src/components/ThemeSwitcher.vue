<template>
  <el-dropdown @command="handleCommand" trigger="click">
    <span class="theme-switcher">
      <el-icon><Brush /></el-icon>
      <span class="theme-name">{{ currentThemeName }}</span>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item 
          v-for="themeName in themeNames" 
          :key="themeName"
          :command="themeName"
          :class="{ 'is-active': themeName === currentThemeName }"
        >
          {{ themeName }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { Brush } from '@element-plus/icons-vue';
import type { ThemeName } from '@/theme';

interface ThemeContext {
  currentTheme: { value: { name: ThemeName } };
  setTheme: (name: ThemeName) => void;
}

const themeContext = inject<ThemeContext>('theme');
const currentTheme = themeContext?.currentTheme || { value: { name: 'wakaba' as const } };

const setTheme = (name: ThemeName) => {
  themeContext?.setTheme?.(name);
};

const themeNames: ThemeName[] = ['wakaba', 'light', 'dark', 'custom'];

const currentThemeName = computed(() => currentTheme.value?.name || 'wakaba');

const handleCommand = (command: ThemeName) => {
  setTheme(command);
};
</script>

<style scoped>
.theme-switcher {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 12px;
  height: 100%;
  color: var(--menu-text);
}

.theme-switcher:hover {
  background-color: var(--menu-hover);
}

.theme-name {
  margin-left: 4px;
  font-size: 14px;
}

:deep(.el-dropdown-menu__item) {
  text-transform: capitalize;
}

:deep(.el-dropdown-menu__item.is-active) {
  color: var(--menu-active);
  font-weight: bold;
}
</style>
