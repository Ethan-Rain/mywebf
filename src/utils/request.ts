// src/utils/request.ts
import axios from 'axios'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 从localStorage中获取token
    const token = localStorage.getItem('token')
    // 如果token存在，则添加到请求头中
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 确保响应数据是Blob类型（如果是二进制响应）
    if (response.config.responseType === 'blob' && response.data) {
      // 如果响应是Blob类型，确保它的type正确
      if (response.data instanceof Blob) {
        const contentType = response.headers['content-type']
        if (contentType) {
          // 创建一个新的Blob，确保type正确
          const blob = new Blob([response.data], { type: contentType })
          response.data = blob
        }
      }
    }
    return response
  },
  error => {
    console.error('API Error:', error)
    if (error.response) {
      console.error('Error response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      })
    }
    return Promise.reject(error)
  }
)

export default request
