import md5 from 'md5';

/**
 * MD5加密
 * @param {string} text - 要加密的文本
 * @returns {string} 加密后的文本
 */
export const encryptPassword = (text) => {
  return md5(text);
};
