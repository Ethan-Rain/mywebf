import { createRouter, createWebHistory } from 'vue-router'
import ImageManager from '@/views/ImageManager.vue'
import VideoPlayer from '@/views/VideoPlayer.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/image-manager'
    },
    {
      path: '/image-manager',
      name: 'image-manager',
      component: ImageManager
    },
    {
      path: '/video-player',
      name: 'video-player',
      component: VideoPlayer
    }
  ]
})

export default router
