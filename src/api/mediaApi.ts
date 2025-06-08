// src/api/mediaApi.ts
import request from '@/utils/request'

interface MediaParams {
  category?: number
}

// 获取随机图片
export const getRandomImage = (params?: MediaParams) => {
  return request.get('/api/media/random/image', {
    params,
    responseType: 'blob',
    headers: {
      'Accept': 'image/*'
    }
  })
}

// 获取随机视频
export const getRandomVideo = (params?: MediaParams) => {
  return request.get('/api/media/random/video', {
    params,
    responseType: 'blob',
    headers: {
      'Accept': 'video/*'
    }
  })
}

// 获取随机媒体（自动判断类型）
export const getRandomMedia = (type: 'image' | 'video', params?: MediaParams) => {
  return type === 'image'
    ? getRandomImage(params)
    : getRandomVideo(params)
}
