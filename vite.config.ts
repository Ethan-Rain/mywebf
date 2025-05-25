import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  base: './',
  assetsInclude: ['**/*.cur', '**/*.ani'],
  build: {
    assetsInlineLimit: 0
  },
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:8089', // 后端服务地址
        changeOrigin: true, // 允许跨域
        secure: false // 关闭HTTPS验证（如果后端是HTTP）
      }
    }
  }
})
