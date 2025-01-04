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
        console.log('请求参数:', config);
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      response => {
        const res = response.data;
        // 支持多个成功响应码
        if (!['000000', '200', 200].includes(res.code)) {
          // 如果配置了自动提示，则显示错误信息
          if (response.config.showError !== false) {
            ElMessage.error(res.msg || '请求失败');
          }
          return Promise.reject(res);
        }
        return res;
      },
      error => {
        const res = {
          code: 'A00500',
          msg: error.message || '网络请求失败',
          statusCode: error.response?.status || 500
        };
        // 如果配置了自动提示，则显示错误信息
        if (error.config?.showError !== false) {
          ElMessage.error(res.msg);
        }
        return Promise.reject(res);
      }
    );
  }

  getBaseURL() {
    return import.meta.env.VITE_API_BASE_URL || '/api';
  }

  get(url, params, config = {}) {
    return this.instance.get(url, { params, ...config });
  }

  post(url, data, config = {}) {
    return this.instance.post(url, data, config);
  }

  put(url, data, config = {}) {
    return this.instance.put(url, data, config);
  }

  delete(url, params, config = {}) {
    return this.instance.delete(url, { params, ...config });
  }
}

export default new Http();
