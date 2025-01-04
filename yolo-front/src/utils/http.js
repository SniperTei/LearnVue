import axios from 'axios';
import { ElMessage } from 'element-plus';

class Http {
  constructor() {
    this.instance = axios.create({
      baseURL: this.getBaseURL(),
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // 请求拦截器
    this.instance.interceptors.request.use(
      config => {
        console.log('发送请求:', {
          url: config.url,
          method: config.method,
          data: config.data,
          params: config.params,
          headers: config.headers
        });
        
        // 从 localStorage 获取 token
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
      },
      error => {
        console.error('请求错误:', error);
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      response => {
        console.log('收到响应:', {
          status: response.status,
          data: response.data,
          headers: response.headers
        });
        
        const res = response.data;
        
        // 支持多个成功响应码，包括删除操作的204状态码
        if (!['000000', '200', 200, '204', 204].includes(res.code) && response.status !== 204) {
          // 如果是401，说明token过期或无效
          if (res.code === 'A00401' || response.status === 401) {
            // 清除token并跳转到登录页
            localStorage.removeItem('token');
            window.location.href = '/login';
          }
          
          // 显示错误信息
          if (response.config?.showError !== false) {
            ElMessage.error(res.msg || '操作失败');
          }
          
          return Promise.reject(new Error(res.msg || '操作失败'));
        }
        
        return res;
      },
      error => {
        console.error('响应错误:', error);
        console.error('错误详情:', {
          status: error.response?.status,
          data: error.response?.data,
          config: error.config
        });
        
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        
        if (error.config?.showError !== false) {
          ElMessage.error(error.response?.data?.msg || '网络请求失败');
        }
        
        return Promise.reject(error);
      }
    );
  }

  getBaseURL() {
    return import.meta.env.VITE_API_BASE_URL || '/api';
  }

  get(url, params = {}, config = {}) {
    return this.instance.get(url, { params, ...config });
  }

  post(url, data = {}, config = {}) {
    return this.instance.post(url, data, config);
  }

  put(url, data = {}, config = {}) {
    return this.instance.put(url, data, config);
  }

  delete(url, config = {}) {
    return this.instance.delete(url, config);
  }
}

export default new Http();
