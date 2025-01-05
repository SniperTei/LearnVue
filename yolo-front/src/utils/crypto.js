import CryptoJS from 'crypto-js';

/**
 * MD5加密
 * @param {string} text - 要加密的文本
 * @returns {string} 加密后的文本
 */
export const encryptPassword = (text) => {
  if (!text) return '';
  // 使用 MD5 算法加密，并转换为小写的十六进制字符串
  return CryptoJS.MD5(text).toString().toLowerCase();
};
