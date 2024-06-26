import axios from 'axios';
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

const router = useRouter()
// Create an instance of Axios with custom configuration
const httpInstance = axios.create({
    baseURL: 'http://pcapi-xiaotuxian-front-devtest.itheima.net/', // Replace with your API base URL
    timeout: 5000, // Set a timeout value in milliseconds
    headers: {
        'Content-Type': 'application/json', // Set the default content type
    },
});

// interceptor
// Add a request interceptor
httpInstance.interceptors.request.use(
    (config) => {
        // 1. 从Pinia中获取数据
        const userStore = useUserStore()
        const token = userStore.userInfo.token
        console.log('token:', token)
        // 2. 将数据添加到请求头中
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    (error) => {
        // Do something with request error
        // console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor
httpInstance.interceptors.response.use(
    (response) => {
      // Do something with response data
      return response;
    },
    (error) => {
      // Do something with response error
      console.error('Response error:', error);
      ElMessage.error({
          message: error.message,
          type: 'error'
      })

      // 401: token过期
      if (error.response.status === 401) {
          // 1. 清除用户信息
          const userStore = useUserStore()
          userStore.clearUserInfo()
          // 2. 跳转到登录页
          router.push('/login')
      }
      return Promise.reject(error);
    }
);

// Define your API methods using the Axios instance
export const get = async (url, params) => {
    try {
        const response = await httpInstance.get(url, { params });
        return response.data;
    } catch (error) {
        console.error('GET request failed:', error);
        throw error;
    }
};

export const post = async (url, data) => {
    try {
        const response = await httpInstance.post(url, data);
        return response.data;
    } catch (error) {
        console.error('POST request failed:', error);
        throw error;
    }
};

// Export the Axios instance for global usage
export default httpInstance;