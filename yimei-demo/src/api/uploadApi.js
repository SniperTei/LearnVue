/**
 * 文件上传API
 */
import { post } from '@/utils/request';

/**
 * 上传文件
 * @param {File} file - 要上传的文件
 * @returns {Promise} - 返回上传结果的Promise
 */
export function uploadFile(file) {
  // 创建FormData对象用于多部分表单数据
  const formData = new FormData();

  // 添加文件到FormData，参数名与Android接口保持一致
  formData.append('file', file);

  // 使用封装的post方法上传文件
  // FormData对象会自动设置正确的Content-Type和边界
  return post('/api/common/upload', formData);
}
