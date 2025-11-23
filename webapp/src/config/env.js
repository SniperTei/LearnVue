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
    // API基础URL
    apiBaseUrl: import.meta.env.VITE_APP_API_URL || 'http://localhost:3000',
    // 是否启用调试模式
    debug: true,
    // 请求超时时间（毫秒）
    requestTimeout: 15000,
  },
  // 生产环境配置
  production: {
    // API基础URL
    apiBaseUrl: import.meta.env.VITE_APP_API_URL || 'https://api.example.com',
    // 是否启用调试模式
    debug: false,
    // 请求超时时间（毫秒）
    requestTimeout: 10000,
  },
};

// 合并配置
const config = {
  ...baseConfig,
  ...environmentConfigs[env] || environmentConfigs.development,
};

// 导出配置
export default config;

// 导出配置的类型定义（TypeScript 类型提示）
// export type EnvConfig = typeof config;
