/**
 * 环境配置文件
 * 用于管理不同环境下的配置参数
 */

// 获取当前环境 - 使用 import.meta.env 替代 process.env
const env = import.meta.env.MODE || 'development';

// 基础配置
const baseConfig = {
  // 当前环境
  env,
  // 是否为开发环境
  isDev: env === 'development',
  // 是否为生产环境
  isProd: env === 'production',
  // 应用标题
  title: import.meta.env.VITE_APP_TITLE || '移动端H5应用',
  // 应用版本
  version: '1.0.0',
};

// 不同环境的特定配置
const environmentConfigs = {
  // 开发环境配置
  development: {
    // API基础URL - 匹配后端FastAPI端口8000
    apiBaseUrl: import.meta.env.VITE_APP_API_URL || 'http://localhost:8000',
    // 是否启用调试模式
    debug: true,
    // 请求超时时间（毫秒）
    requestTimeout: 30000,
  },
  // 生产环境配置
  production: {
    // API基础URL
    apiBaseUrl: import.meta.env.VITE_APP_API_URL || 'https://api.example.com',
    // 是否启用调试模式
    debug: false,
    // 请求超时时间（毫秒）
    requestTimeout: 30000,
  },
};

// 合并配置
const config = {
  ...baseConfig,
  ...environmentConfigs[env] || environmentConfigs.development,
};

// 导出配置 - 同时支持 baseURL 和 apiBaseUrl 属性名以保持兼容性
export default {
  ...config,
  baseURL: config.apiBaseUrl, // 添加 baseURL 别名
  timeout: config.requestTimeout, // 添加 timeout 别名
};

// 导出配置的类型定义（TypeScript 类型提示）
// export type EnvConfig = typeof config;
