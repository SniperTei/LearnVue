/**
 * 环境配置文件
 * 用于管理不同环境下的配置参数
 */

// 获取当前环境 - 使用 import.meta.env 替代 process.env
const env = import.meta.env.MODE || 'dev';

// 配置对象
const config = {
  // 当前环境
  env,

  // 是否为开发环境
  isDev: env === 'dev' || env === 'development',

  // 是否为测试环境
  isTest: env === 'test',

  // 是否为生产环境
  isProd: env === 'prod',

  // API基础URL
  baseURL: import.meta.env.VITE_APP_API_URL || '',

  // 请求超时时间
  timeout: 45000,

  // 是否启用Mock数据
  mockEnabled: env === 'dev' || env === 'development',
  // mockEnabled: false,

  // 系统标题 - 使用 import.meta.env 替代 process.env
  title: import.meta.env.VITE_APP_TITLE || 'ArbaDemo'
};

export default config;
