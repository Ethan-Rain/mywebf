import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://192.168.31.107:58080',
  timeout: 10000,
})

export default axiosInstance
