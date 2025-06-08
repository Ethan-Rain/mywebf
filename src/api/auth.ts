import request from '@/utils/request'

// 登录接口
export const loginApi = (username: string, password: string) => {
  return request({
    url: '/auth/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

// 登出接口
export const logoutApi = () => {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}
