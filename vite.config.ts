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
    host: '0.0.0.0', // 或 true，表示监听所有网络接口，包括你的局域网 IP
    port: 5173,       // 可选：指定端口
    proxy: {
      // 代理 /api/images 开头的请求到后端
      '/api/images': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        ws: true,
        // 重写路径，将 /api/images 前缀替换为空
        rewrite: (path) => path.replace(/^\/api\/images/, ''),
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('Images API Proxy Error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('Sending Images API Request:', {
              method: req.method,
              originalUrl: req.url,
              proxyPath: proxyReq.path,
              host: proxyReq.host,
              headers: proxyReq.getHeaders()
            });
          });
          proxy.on('proxyRes', (proxyRes) => {
            console.log('Received Images API Response:', {
              statusCode: proxyRes.statusCode,
              statusMessage: proxyRes.statusMessage,
              headers: proxyRes.headers
            });
          });
        }
      },
      // 代理 /api/videos 开头的请求到后端
      '/api/videos': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        ws: true,
        // 重写路径，将 /api/videos 前缀替换为空
        rewrite: (path) => path.replace(/^\/api\/videos/, ''),
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('Videos API Proxy Error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('Sending Videos API Request:', {
              method: req.method,
              originalUrl: req.url,
              proxyPath: proxyReq.path,
              host: proxyReq.host,
              headers: proxyReq.getHeaders()
            });
          });
          proxy.on('proxyRes', (proxyRes) => {
            console.log('Received Videos API Response:', {
              statusCode: proxyRes.statusCode,
              statusMessage: proxyRes.statusMessage,
              headers: proxyRes.headers
            });
          });
        }
      },
      // 代理其他 /api 开头的请求
      '^/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        ws: true
      },
      // 代理 security 开头的路径
      '/security': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
