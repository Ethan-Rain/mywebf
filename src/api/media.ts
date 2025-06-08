import request from '@/utils/request'
import type { AxiosResponse } from 'axios'

// 定义响应类型
interface SyncResponse {
  success: boolean
  message: string
  data: {
    syncedCount?: number
    totalCount?: number
    // 根据实际返回的数据结构添加更多字段
    [key: string]: unknown
  }
}

// Redis缓存接口
export const sync = (): Promise<SyncResponse> => {
  return request({
    url: '/media/sync',  // 移除了开头的/api，因为baseURL中已经包含了
    method: 'post',
    responseType: 'json'
  }).then((response: AxiosResponse) => {
    // 确保返回统一的结构
    if (response && typeof response.data.success === 'boolean') {
      return response.data as SyncResponse
    }
    // 如果后端返回的结构不符合预期，转换为我们期望的格式
    return {
      success: false,
      message: '返回数据格式错误',
      data: response
    }
  }).catch((error: unknown) => {
    // 处理错误情况
    console.error('同步失败:', error)
    return {
      success: false,
      message: error.message || '请求失败，请检查网络连接'
    }
  })
}
