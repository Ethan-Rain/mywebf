import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export interface UserInfo {
  username: string
  token?: string
  avatar?: string
  roles?: string[]
}

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo | null>(null)
  const token = ref<string>('')
  const router = useRouter()

  // 登录
  const login = async (loginData: { username: string; password: string }) => {
    try {
      // 这里应该是调用登录API
      // const { data } = await loginApi(loginData)
      
      // 模拟登录成功
      const mockData = {
        username: loginData.username,
        token: 'mock_token_' + Math.random().toString(36).substr(2),
        roles: ['admin']
      }
      
      userInfo.value = mockData
      token.value = mockData.token
      
      // 保存到本地存储
      localStorage.setItem('token', mockData.token)
      localStorage.setItem('userInfo', JSON.stringify(mockData))
      
      return mockData
    } catch (error) {
      console.error('Login error:', error)
      throw new Error('登录失败')
    }
  }

  // 登出
  const logout = () => {
    userInfo.value = null
    token.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    router.push('/login')
  }

  // 检查登录状态
  const checkLogin = () => {
    const localToken = localStorage.getItem('token')
    const localUser = localStorage.getItem('userInfo')
    
    if (localToken && localUser) {
      token.value = localToken
      userInfo.value = JSON.parse(localUser)
      return true
    }
    return false
  }

  return {
    userInfo,
    token,
    login,
    logout,
    checkLogin
  }
})

export default useUserStore
