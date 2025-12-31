import axios from 'axios';
import envConfig from '@/config/env';
import { showDialog } from 'vant';
import { useUserStore } from '@/stores/user';

// 创建axios实例
const service = axios.create({
  baseURL: envConfig.baseURL, // 从环境配置中获取API基础URL
  timeout: envConfig.timeout, // 从环境配置中获取超时时间
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 从user store获取token并添加到请求头
    const userStore = useUserStore();
    // 打印config
    console.log('userStore:', userStore);
    const token = userStore.token;
    // 打印token
    console.log('token:', token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // 如果token还是空 就从localstorage获取
    // if (!token) {
    //   let token2 = localStorage.getItem('token');
    //   if (token2) {
    //     config.headers['token'] = token2;
    //   }
    // }
    return config;
  },
  error => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    console.log('接口返回:', res);

    // 如果响应码不是000000，认为请求有错误
    if (res.code !== '000000') {
      console.error('接口返回错误:', res.msg);

      // 可以在这里处理特定错误码，例如token过期等
      if (res.code === 'A00102') { // 假设A00102是token过期的错误码
        // 清除token并重定向到登录页
        localStorage.removeItem('token');
        window.location.href = '/login';
      }

      // 返回服务器返回的错误消息，而不是创建新的错误对象
      return Promise.reject({
        message: res.msg || '未知错误',
        code: res.code,
        response: res
      });
    }

    return res;
  },
  error => {
    console.error('响应错误:', error);
    // 处理网络错误等
    const errorMsg = error.response?.data?.msg || error.message || '网络错误，请稍后重试';
    return Promise.reject({
      message: errorMsg,
      code: error.response?.data?.code || 'NETWORK_ERROR',
      response: error.response?.data
    });
  }
);

/**
 * 过滤对象中的空字段
 * @param {Object} obj - 要过滤的对象
 * @returns {Object} - 过滤后的对象
 */
function filterEmptyFields(obj) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  const filteredObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      // 过滤掉 null、undefined 和空字符串
      if (value !== null && value !== undefined && value !== '') {
        filteredObj[key] = value;
      }
    }
  }
  return filteredObj;
}

/**
 * 封装GET请求
 * @param {string} url - 请求URL
 * @param {Object} params - 请求参数
 * @param {boolean} autoShowError - 是否自动显示错误提示，默认为true
 * @returns {Promise} - 返回请求的Promise
 */
export function get(url, params, autoShowError = true) {
  // 过滤空字段
  const filteredParams = filterEmptyFields(params);
  return service({
    url,
    method: 'get',
    params: filteredParams
  }).catch(error => {
    if (autoShowError) {
      // 使用服务器返回的错误消息
      showDialog({ message: error.message || '请求失败' });
    }
    return Promise.reject(error);
  });
}

/**
 * 封装POST请求
 * @param {string} url - 请求URL
 * @param {Object} data - 请求数据
 * @param {boolean} autoShowError - 是否自动显示错误提示，默认为true
 * @returns {Promise} - 返回请求的Promise
 */
export function post(url, data, autoShowError = true) {
  // 过滤空字段
  const filteredData = filterEmptyFields(data);
  return service({
    url,
    method: 'post',
    data: filteredData
  }).catch(error => {
    if (autoShowError) {
      // 使用服务器返回的错误消息
      showDialog({ message: error.message || '请求失败' });
    }
    return Promise.reject(error);
  });
}

/**
 * 封装PUT请求
 * @param {string} url - 请求URL
 * @param {Object} data - 请求数据
 * @param {boolean} autoShowError - 是否自动显示错误提示，默认为true
 * @returns {Promise} - 返回请求的Promise
 */
export function put(url, data, autoShowError = true) {
  // 过滤空字段
  const filteredData = filterEmptyFields(data);
  return service({
    url,
    method: 'put',
    data: filteredData
  }).catch(error => {
    if (autoShowError) {
      // 使用服务器返回的错误消息
      showDialog({ message: error.message || '请求失败' });
    }
    return Promise.reject(error);
  });
}

/**
 * 封装DELETE请求
 * @param {string} url - 请求URL
 * @param {Object} data - 请求数据
 * @param {boolean} autoShowError - 是否自动显示错误提示，默认为true
 * @returns {Promise} - 返回请求的Promise
 */
export function del(url, data, autoShowError = true) {
  // 过滤空字段
  const filteredData = filterEmptyFields(data);
  return service({
    url,
    method: 'delete',
    data: filteredData // 直接传入过滤后的数据作为请求体
  }).catch(error => {
    if (autoShowError) {
      // 使用服务器返回的错误消息
      showDialog({ message: error.message || '请求失败' });
    }
    return Promise.reject(error);
  });
}

export default service;
