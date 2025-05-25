// src/utils/request.ts
import { ElMessage } from 'element-plus'

// 从环境变量获取API基地址（需以VITE_开头）
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8089'

// 基础请求函数（带认证拦截）
export const fetchWithAuth = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  // 拼接完整API地址
  const fullUrl = `${API_BASE_URL}${url}`
  const token = localStorage.getItem('token')
  options.headers = {
    ...options?.headers,
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }

  try {
    const response = await fetch(fullUrl, options)
    const data = await response.json()

    if (!response.ok) {
      ElMessage.error(data.message || '请求失败')
      throw new Error(data.message || '请求失败')
    }
    return data as T
  } catch (error) {
    ElMessage.error('网络请求失败，请重试')
    throw error
  }
}

// 登录请求
export const loginApi = async (username: string, password: string) => {
  return fetchWithAuth<{ token: string; message: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  })
}

// 注册请求
export const registerApi = async (userData: {
  username: string
  password: string
  confirmPassword: string
  email: string
}) => {
  return fetchWithAuth<{ userId: number; message: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  })
}

// 注销请求
export const logoutApi = async () => {
  return fetchWithAuth<{ message: string }>('/auth/logout', {
    method: 'POST'
  })
}

// 由于找不到 service，这里假设导出 fetchWithAuth 作为默认导出
export default fetchWithAuth
