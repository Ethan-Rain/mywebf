import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.31.107:58080', // 设置基础 URL
  withCredentials: true, // 如果需要携带凭证
});

export default axiosInstance;
