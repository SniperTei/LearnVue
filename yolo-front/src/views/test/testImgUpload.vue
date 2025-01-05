<template>
  <div class="upload-test-container">
    <h2>图片上传测试</h2>
    
    <!-- 单文件上传 -->
    <div class="upload-section">
      <h3>单文件上传</h3>
      <el-upload
        class="single-uploader"
        action="#"
        :auto-upload="false"
        :show-file-list="true"
        :on-change="handleSingleFileChange"
        accept="image/*"
      >
        <template #trigger>
          <el-button type="primary">选择图片</el-button>
        </template>
        
        <template #tip>
          <div class="el-upload__tip">
            只能上传 jpg/png 文件，且不超过 5MB
          </div>
        </template>
      </el-upload>
      
      <div class="preview-section" v-if="singlePreviewUrl">
        <h4>预览</h4>
        <img :src="singlePreviewUrl" class="preview-image" @click="previewImage(singlePreviewUrl)" />
        <el-button type="danger" size="small" @click="clearSinglePreview">删除预览</el-button>
      </div>
      
      <el-button 
        type="success" 
        @click="uploadSingleFile"
        :disabled="!singleFile"
        :loading="singleUploading"
      >
        上传图片
      </el-button>
    </div>
    
    <!-- 多文件上传 -->
    <div class="upload-section">
      <h3>多文件上传</h3>
      <el-upload
        class="multiple-uploader"
        action="#"
        :auto-upload="false"
        multiple
        list-type="picture-card"
        :on-change="handleMultipleFileChange"
        :on-remove="handleRemove"
        accept="image/*"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      
      <el-button 
        type="success" 
        @click="uploadMultipleFiles"
        :disabled="!multipleFiles.length"
        :loading="multipleUploading"
      >
        上传所有图片
      </el-button>
    </div>
    
    <!-- 上传结果 -->
    <div class="result-section" v-if="uploadedUrls.length">
      <h3>上传结果</h3>
      <div class="uploaded-images">
        <div v-for="(url, index) in uploadedUrls" :key="index" class="image-item">
          <img :src="url" class="preview-image" @click="previewImage(url)" />
          <div class="image-actions">
            <el-button type="danger" size="small" @click="removeUploadedImage(index)">
              删除
            </el-button>
            <el-button type="primary" size="small" @click="copyUrl(url)">
              复制链接
            </el-button>
          </div>
          <el-input v-model="uploadedUrls[index]" readonly size="small" />
        </div>
      </div>
    </div>
    
    <!-- 图片预览对话框 -->
    <el-dialog v-model="previewVisible" title="图片预览" width="80%">
      <img :src="previewImageUrl" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { uploadImages } from '@/api/uploadAPI'

// 单文件上传相关
const singleFile = ref(null)
const singlePreviewUrl = ref('')
const singleUploading = ref(false)

// 多文件上传相关
const multipleFiles = ref([])
const multipleUploading = ref(false)

// 上传结果
const uploadedUrls = ref([])

// 图片预览
const previewVisible = ref(false)
const previewImageUrl = ref('')

// 处理单文件选择
const handleSingleFileChange = (file) => {
  const isImage = file.raw.type.startsWith('image/')
  const isLt5M = file.raw.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!')
    return false
  }

  // 清除之前的预览
  if (singlePreviewUrl.value) {
    URL.revokeObjectURL(singlePreviewUrl.value)
  }

  singleFile.value = file.raw
  singlePreviewUrl.value = URL.createObjectURL(file.raw)
}

// 移除预览图片
const clearSinglePreview = () => {
  if (singlePreviewUrl.value) {
    URL.revokeObjectURL(singlePreviewUrl.value)
    singlePreviewUrl.value = ''
  }
  singleFile.value = null
}

// 处理多文件选择
const handleMultipleFileChange = (file) => {
  const isImage = file.raw.type.startsWith('image/')
  const isLt5M = file.raw.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!')
    return false
  }

  multipleFiles.value.push(file.raw)
}

// 移除文件
const handleRemove = (file) => {
  const index = multipleFiles.value.indexOf(file.raw)
  if (index !== -1) {
    multipleFiles.value.splice(index, 1)
  }
}

// 上传单个文件
const uploadSingleFile = async () => {
  if (!singleFile.value) return
  
  singleUploading.value = true
  try {
    const formData = new FormData()
    formData.append('files', singleFile.value)
    
    const response = await uploadImages(formData)
    if (response.success) {
      ElMessage.success('上传成功')
      uploadedUrls.value = response.data.urls
    } else {
      ElMessage.error(response.message || '上传失败')
    }
  } catch (error) {
    console.error('上传失败:', error)
    ElMessage.error('上传失败，请重试')
  } finally {
    singleUploading.value = false
  }
}

// 上传多个文件
const uploadMultipleFiles = async () => {
  if (!multipleFiles.value.length) return
  
  multipleUploading.value = true
  try {
    const formData = new FormData()
    multipleFiles.value.forEach(file => {
      formData.append('files', file)
    })
    
    const response = await uploadImages(formData)
    if (response.success) {
      ElMessage.success('上传成功')
      uploadedUrls.value = response.data.urls
    } else {
      ElMessage.error(response.message || '上传失败')
    }
  } catch (error) {
    console.error('上传失败:', error)
    ElMessage.error('上传失败，请重试')
  } finally {
    multipleUploading.value = false
  }
}

// 预览图片
const previewImage = (url) => {
  previewImageUrl.value = url
  previewVisible.value = true
}

// 删除已上传的图片
const removeUploadedImage = (index) => {
  ElMessageBox.confirm(
    '确定要删除这张图片吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    uploadedUrls.value.splice(index, 1)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 复制URL
const copyUrl = async (url) => {
  try {
    await navigator.clipboard.writeText(url)
    ElMessage.success('复制成功')
  } catch (error) {
    console.error('复制失败:', error)
    ElMessage.error('复制失败，请手动复制')
  }
}
</script>

<style lang="scss" scoped>
.upload-test-container {
  padding: 20px;
  
  .upload-section {
    margin-bottom: 30px;
    
    h3 {
      margin-bottom: 15px;
    }
    
    .preview-section {
      margin: 15px 0;
      position: relative;
      
      .preview-image {
        max-width: 200px;
        max-height: 200px;
        border-radius: 4px;
        cursor: pointer;
      }
    }
  }
  
  .result-section {
    .uploaded-images {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 15px;
      
      .image-item {
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        padding: 10px;
        
        .preview-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 4px;
          cursor: pointer;
          transition: transform 0.3s;
          
          &:hover {
            transform: scale(1.02);
          }
        }
        
        .image-actions {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
        }
        
        .el-input {
          margin-top: 10px;
        }
      }
    }
  }
  
  .el-upload__tip {
    color: #909399;
    font-size: 12px;
    margin-top: 7px;
  }
}
</style>
