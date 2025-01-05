import http from '@/utils/http'

/**
 * 上传图片
 * @param {FormData} formData 包含图片文件的表单数据
 * @returns {Promise} 返回上传响应的Promise
 */
export const uploadImages = (formData) => {
  return http.post('/api/v1/common/uploadImg', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
