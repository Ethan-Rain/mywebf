import request from '@/utils/request'

// 定义登录响应数据类型
interface LoginResponse {
  token: string;
  [key: string]: string | number | boolean | object | null | undefined;  // 允许其他基本字段类型
}
// 登录接口
export const loginApi = (username: string, password: string) => {
  return request<LoginResponse>({
    url: '/security/auth/login',
    method: 'post',
    data: {
      username,
      password
    },
    withCredentials: true  // 必须
  })
}
// 登出接口
export const logoutApi = () => {
  return request({
    url: '/security/auth/logout',
    method: 'post'
  })
}
