// 引入 axios 及其类型定义
import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// 创建一个 axios 实例，用于发送 HTTP 请求
const service: AxiosInstance = axios.create({
  baseURL: '/api', // 设置请求的基础路径（全局前缀）
  timeout: 10000, // 请求超时时间（单位：毫秒）
})

// 请求拦截器：在请求发出之前做一些处理
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 获取本地存储中的 token
    const token = localStorage.getItem('token')
    if (token) {
      // 如果存在 token，则将其添加到请求头中
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`, // 使用 Bearer Token 认证方式
      }
    }
    return config // 返回修改后的请求配置
  },
  (error) => Promise.reject(error) // 如果请求出错，返回错误信息
)

// 响应拦截器：在响应返回之后做一些处理
service.interceptors.response.use(
  (response: AxiosResponse) => response.data, // 直接返回响应数据部分
  (error) => Promise.reject(error) // 如果响应出错，返回错误信息
)

// 导出该 axios 实例，供其他文件使用
export default service
