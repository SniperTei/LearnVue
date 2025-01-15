<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { createMovie, updateMovie, getMovieDetail } from '@/api/movieAPI'
import { uploadImages } from '@/api/uploadAPI'

const route = useRoute()
const router = useRouter()
const movieId = route.params.id
const isEdit = !!movieId

const loading = ref(false)
const uploadLoading = ref(false)
const form = ref({
  title: '',
  genres: '',
  director: '',
  actors: '',
  releaseDate: '',
  duration: '',
  description: '',
  imageUrl: '',
  rating: 0
})

// 文件上传相关
const fileList = ref([])
const uploadFiles = ref([])

const genreOptions = [
  { label: '动作', value: '动作' },
  { label: '喜剧', value: '喜剧' },
  { label: '科幻', value: '科幻' },
  { label: '剧情', value: '剧情' },
  { label: '冒险', value: '冒险' },
  { label: '悬疑', value: '悬疑' },
  { label: '恐怖', value: '恐怖' },
  { label: '爱情', value: '爱情' }
]

const rules = {
  title: [{ required: true, message: '请输入电影名称', trigger: 'blur' }],
  genres: [{ required: true, message: '请选择电影类型', trigger: 'change' }],
  director: [{ required: true, message: '请输入导演', trigger: 'blur' }],
  actors: [{ required: true, message: '请输入演员', trigger: 'blur' }],
  releaseDate: [{ required: true, message: '请选择上映日期', trigger: 'change' }],
  duration: [{ required: true, message: '请输入时长', trigger: 'blur' }],
  imageUrl: [{ required: true, message: '请上传电影海报', trigger: 'change' }]
}

const formRef = ref(null)

const loadMovieDetail = async () => {
  if (!isEdit) return
  
  try {
    loading.value = true
    const result = await getMovieDetail(movieId)
    if (result.code === '000000' && result.data) {
      form.value = { ...result.data }
      // 如果有图片，初始化文件列表
      if (form.value.imageUrl) {
        fileList.value = [{
          name: 'movie-poster',
          url: form.value.imageUrl
        }]
      }
    } else {
      ElMessage.error(result.msg || '获取电影详情失败')
    }
  } catch (error) {
    console.error('Error loading movie detail:', error)
    ElMessage.error('获取电影详情失败')
  } finally {
    loading.value = false
  }
}

// 处理文件选择
const handleFileChange = (file, files) => {
  if (files.length > 1) {
    ElMessage.warning('只能上传1张海报')
    files.splice(1)
  }
  uploadFiles.value = files
}

// 处理文件移除
const handleFileRemove = (file, files) => {
  uploadFiles.value = files
  form.value.imageUrl = ''
}

// 超出限制处理
const handleExceed = () => {
  ElMessage.warning('只能上传1张海报')
}

// 上传前检查
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 上传电影海报
const uploadMoviePoster = async () => {
  if (!uploadFiles.value.length) return true

  try {
    uploadLoading.value = true
    const formData = new FormData()
    uploadFiles.value.forEach(file => {
      formData.append('files', file.raw)
    })

    const res = await uploadImages(formData)
    if (res.code === '000000' && res.data.urls?.length > 0) {
      form.value.imageUrl = res.data.urls[0].url
      ElMessage.success('海报上传成功')
      return true
    } else {
      ElMessage.error('海报上传失败')
      return false
    }
  } catch (error) {
    console.error('上传海报失败:', error)
    ElMessage.error('海报上传失败')
    return false
  } finally {
    uploadLoading.value = false
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    // 如果有新上传的文件，先上传图片
    if (uploadFiles.value.length > 0) {
      const uploadSuccess = await uploadMoviePoster()
      if (!uploadSuccess) {
        loading.value = false
        return
      }
    }
    
    const result = isEdit 
      ? await updateMovie(movieId, form.value)
      : await createMovie(form.value)
    
    if (result.code === '000000') {
      ElMessage.success(isEdit ? '更新成功' : '创建成功')
      router.push('/entertainment/movie')
    } else {
      ElMessage.error(result.msg || '操作失败')
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    ElMessage.error('操作失败')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.back()
}

onMounted(() => {
  loadMovieDetail()
})
</script>

<template>
  <div class="movie-detail">
    <el-card v-loading="loading">
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑电影' : '新增电影' }}</span>
        </div>
      </template>
      
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="movie-form"
      >
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="电影名称" prop="title">
              <el-input v-model="form.title" placeholder="请输入电影名称" />
            </el-form-item>
            
            <el-form-item label="电影类型" prop="genres">
              <el-select 
                v-model="form.genres" 
                multiple 
                placeholder="请选择电影类型"
                class="w-100"
              >
                <el-option 
                  v-for="option in genreOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
            
            <el-form-item label="导演" prop="director">
              <el-input v-model="form.director" placeholder="请输入导演" />
            </el-form-item>
            
            <el-form-item label="演员" prop="actors">
              <el-input v-model="form.actors" placeholder="请输入演员，多个演员用逗号分隔" />
            </el-form-item>
            
            <el-form-item label="上映日期" prop="releaseDate">
              <el-date-picker
                v-model="form.releaseDate"
                type="date"
                placeholder="请选择上映日期"
                class="w-100"
              />
            </el-form-item>
            
            <el-form-item label="时长(分钟)" prop="duration">
              <el-input-number 
                v-model="form.duration" 
                :min="1"
                controls-position="right"
                class="w-100"
              />
            </el-form-item>
            
            <el-form-item label="评分" prop="rating">
              <el-rate 
                v-model="form.rating"
                :max="5"
                :allow-half="true"
                class="w-100"
              />
            </el-form-item>
            
            <el-form-item label="简介" prop="description">
              <el-input
                v-model="form.description"
                type="textarea"
                :rows="4"
                placeholder="请输入电影简介"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="8">
            <el-form-item label="电影海报" prop="imageUrl">
              <el-upload
                class="poster-uploader"
                :action="null"
                :auto-upload="false"
                :show-file-list="true"
                :before-upload="beforeUpload"
                :on-change="handleFileChange"
                :on-remove="handleFileRemove"
                :on-exceed="handleExceed"
                :file-list="fileList"
                :limit="1"
                accept="image/*"
                list-type="picture-card"
              >
                <el-icon v-if="!form.imageUrl"><Plus /></el-icon>
                <template #tip>
                  <div class="el-upload__tip">
                    只能上传一张海报，且不超过 2MB
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            {{ isEdit ? '更新' : '创建' }}
          </el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.movie-detail {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.movie-form {
  margin-top: 20px;
}

.w-100 {
  width: 100%;
}

.el-upload__tip {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}

:deep(.el-upload--picture-card) {
  width: 200px;
  height: 280px;
  line-height: 280px;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 200px;
  height: 280px;
}

:deep(.el-upload-list--picture-card .el-upload-list__item img) {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style>
