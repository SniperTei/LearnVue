import axios from 'axios';
import { ElMessage } from 'element-plus';

class Http {
  constructor() {
    this.instance = axios.create({
      baseURL: this.getBaseURL(),
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      },
      // 修改参数序列化方式
      paramsSerializer: {
        indexes: null // 数组格式化时不添加索引
      }
    });

    // 请求拦截器
    this.instance.interceptors.request.use(
      config => {
        // 从 localStorage 获取 token
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // 如果有 params，直接展开到 URL 参数中
        // if (config.params) {
        //   config.params = { ...config.params };
        // }
        
        console.log('发送请求:', {
          url: config.url,
          method: config.method,
          data: config.data,
          params: config.params,
          headers: config.headers
        });
        
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
        
        // 只认 code === '000000' 为成功
        if (res.code === '000000') {
          return res;
        }
        
        // 其他情况都是失败
        const error = new Error(res.msg || 'Request failed');
        error.response = response;
        return Promise.reject(error);
      },
      error => {
        console.error('响应错误:', {
          status: error.response?.status,
          data: error.response?.data,
          config: error.config
        });
        
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
        }
        
        // 只有在 showError !== false 时才显示错误消息
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
    // get 请求使用 params
    return this.instance.get(url, {
      ...config,
      params
    });
  }

  post(url, data = {}, config = {}) {
    // 确保 data 不会被嵌套在 params 中
    return this.instance.post(url, data, {
      ...config,
      // params: undefined  // 移除 params，避免嵌套
    });
  }

  put(url, data = {}, config = {}) {
    return this.instance.put(url, data, config);
  }

  delete(url, config = {}) {
    return this.instance.delete(url, config);
  }
}

export default new Http();
