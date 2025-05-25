// src/stores/user.ts
import { defineStore } from 'pinia'
import { logoutApi } from '@/utils/request'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    username: ''
  }),
  actions: {
    // 保存登录状态
    setLoginState(token: string, username: string) {
      this.token = token
      this.username = username
      localStorage.setItem('token', token)
    },
    // 执行注销操作
    async logout() {
      try {
        await logoutApi()
        this.clearLoginState()
        const router = useRouter()
        router.push('/login')
      } catch (error) {
        console.error('注销失败:', error)
      }
    },
    // 清除登录状态
    clearLoginState() {
      this.token = null
      this.username = ''
      localStorage.removeItem('token')
    },

    // 检查用户是否已登录
    checkLogin(): boolean {
      return !!this.token || !!localStorage.getItem('token')
    }
  }
})

export default useUserStore
