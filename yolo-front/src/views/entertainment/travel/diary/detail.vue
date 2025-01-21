<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { createTravelDiary, getTravelDiaryDetail, updateTravelDiary } from '@/api/travelAPI'
import { Plus } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const diaryId = route.params.travelDiaryId
const isView = computed(() => route.query.mode === 'view')
const isEdit = computed(() => !!diaryId && !isView.value)

// Form data
const formRef = ref(null)
const formData = ref({
  title: '',
  content: '',
  location: {
    country: '',
    city: '',
    place: ''
  },
  images: [],
  travelPlanId: '',
  tags: []
})

const formRules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' }
  ],
  'location.country': [
    { required: true, message: '请输入国家', trigger: 'blur' }
  ],
  'location.city': [
    { required: true, message: '请输入城市', trigger: 'blur' }
  ],
  'location.place': [
    { required: true, message: '请输入地点', trigger: 'blur' }
  ]
}

const loading = ref(false)
const tagInput = ref('')
const imageUploadUrl = '/api/v1/common/uploadImg'

// Methods
const handleSubmit = async () => {
  if (!formRef.value || isView.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    const apiCall = isEdit.value ? 
      () => updateTravelDiary(diaryId, formData.value) :
      () => createTravelDiary(formData.value)
    
    const result = await apiCall()
    
    if (result.code === '000000') {
      ElMessage.success(isEdit.value ? '游记更新成功' : '游记创建成功')
      router.push('/entertainment/travel/diary')
    } else {
      ElMessage.error(result.msg || (isEdit.value ? '更新失败' : '创建失败'))
    }
  } catch (error) {
    console.error('Error submitting diary:', error)
    ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.back()
}

const handleAddTag = () => {
  if (tagInput.value && !formData.value.tags.includes(tagInput.value)) {
    formData.value.tags.push(tagInput.value)
  }
  tagInput.value = ''
}

const handleRemoveTag = (tag) => {
  if (isView.value) return
  const index = formData.value.tags.indexOf(tag)
  if (index > -1) {
    formData.value.tags.splice(index, 1)
  }
}

const handleImageSuccess = (response, uploadFile) => {
  if (response.code === '000000' && response.data?.url) {
    formData.value.images.push({
      url: response.data.url,
      caption: uploadFile.name
    })
  } else {
    ElMessage.error('图片上传失败')
  }
}

const handleImageRemove = (file) => {
  if (isView.value) return
  const index = formData.value.images.findIndex(img => img.url === file.url)
  if (index > -1) {
    formData.value.images.splice(index, 1)
  }
}

const loadDiaryDetail = async () => {
  if (!diaryId) return
  
  try {
    loading.value = true
    const result = await getTravelDiaryDetail(diaryId)
    
    if (result.code === '000000' && result.data) {
      formData.value = { ...result.data }
    } else {
      ElMessage.error(result.msg || '获取游记详情失败')
      router.push('/entertainment/travel/diary')
    }
  } catch (error) {
    console.error('Error loading diary:', error)
    ElMessage.error('获取游记详情失败')
    router.push('/entertainment/travel/diary')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDiaryDetail()
})
</script>

<template>
  <div class="diary-detail">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="title">
            {{ isView ? '游记详情' : (isEdit ? '编辑游记' : '写新游记') }}
          </span>
          <div class="header-actions" v-if="isView">
            <el-button type="primary" @click="router.push(`/entertainment/travel/diary/detail/${diaryId}`)">
              编辑
            </el-button>
          </div>
        </div>
      </template>
      
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        v-loading="loading"
        :disabled="isView"
      >
        <el-form-item label="标题" prop="title">
          <el-input 
            v-model="formData.title"
            placeholder="请输入游记标题"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="地点">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item prop="location.country">
                <el-input 
                  v-model="formData.location.country"
                  placeholder="国家"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="location.city">
                <el-input 
                  v-model="formData.location.city"
                  placeholder="城市"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="location.place">
                <el-input 
                  v-model="formData.location.place"
                  placeholder="具体地点"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        
        <el-form-item label="内容" prop="content">
          <el-input
            v-model="formData.content"
            type="textarea"
            :rows="8"
            placeholder="记录下你的旅行见闻..."
            maxlength="2000"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="图片">
          <el-upload
            v-if="!isView"
            :action="imageUploadUrl"
            list-type="picture-card"
            :on-success="handleImageSuccess"
            :on-remove="handleImageRemove"
            :headers="{
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          
          <div v-else class="image-preview">
            <el-image
              v-for="(image, index) in formData.images"
              :key="index"
              :src="image.url"
              :alt="image.caption"
              fit="cover"
              :preview-src-list="formData.images.map(img => img.url)"
            >
              <template #placeholder>
                <div class="image-placeholder">
                  加载中...
                </div>
              </template>
            </el-image>
          </div>
        </el-form-item>
        
        <el-form-item label="标签">
          <template v-if="!isView">
            <div class="tags-input">
              <el-input
                v-model="tagInput"
                placeholder="输入标签后回车"
                @keyup.enter="handleAddTag"
              >
                <template #append>
                  <el-button @click="handleAddTag">添加</el-button>
                </template>
              </el-input>
            </div>
          </template>
          
          <div class="tags-list" v-if="formData.tags.length">
            <el-tag
              v-for="tag in formData.tags"
              :key="tag"
              :closable="!isView"
              @close="handleRemoveTag(tag)"
            >
              {{ tag }}
            </el-tag>
          </div>
        </el-form-item>
        
        <el-form-item v-if="!isView">
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            {{ isEdit ? '更新' : '发布' }}
          </el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.diary-detail {
  padding: 20px;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .title {
      font-size: 18px;
      font-weight: bold;
    }
  }
  
  .el-form {
    margin-top: 20px;
    
    :deep(.el-form-item) {
      margin-bottom: 24px;
      
      .el-form-item__label {
        font-weight: 500;
      }
      
      .el-textarea {
        .el-textarea__inner {
          min-height: 120px !important;
          line-height: 1.6;
        }
      }
    }
    
    .location-form {
      .el-col {
        .el-form-item {
          margin-bottom: 0;
        }
      }
    }
  }
  
  .tags-input {
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    
    .el-tag {
      margin-right: 8px;
      margin-bottom: 8px;
    }
    
    .input-new-tag {
      width: 90px;
    }
  }
  
  .image-preview {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    margin-top: 16px;
    
    .el-image {
      height: 200px;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .image-placeholder {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
      background: #f5f7fa;
      color: #909399;
      border-radius: 8px;
      border: 1px dashed #d9d9d9;
      transition: all 0.3s;
      
      &:hover {
        border-color: #409eff;
        color: #409eff;
      }
      
      .el-icon {
        font-size: 24px;
      }
    }
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid #ebeef5;
  }
}
</style>
