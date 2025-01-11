<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { createMovie, updateMovie, getMovieDetail } from '@/api/movieAPI'

const route = useRoute()
const router = useRouter()
const movieId = route.params.id
const isEdit = !!movieId

const loading = ref(false)
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
  imageUrl: [{ required: true, message: '请输入海报链接', trigger: 'blur' }]
}

const formRef = ref(null)

const loadMovieDetail = async () => {
  if (!isEdit) return
  
  try {
    loading.value = true
    const result = await getMovieDetail(movieId)
    if (result.code === '000000' && result.data) {
      form.value = { ...result.data }
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

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    const submitFn = isEdit ? updateMovie : createMovie
    const result = await submitFn(isEdit ? movieId : form.value, form.value)
    
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
        <el-form-item label="电影名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入电影名称" />
        </el-form-item>
        
        <el-form-item label="电影类型" prop="genres">
          <el-select v-model="form.genres" placeholder="请选择电影类型">
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
          />
        </el-form-item>
        
        <el-form-item label="时长(分钟)" prop="duration">
          <el-input-number v-model="form.duration" :min="1" />
        </el-form-item>
        
        <el-form-item label="评分" prop="rating">
          <el-rate v-model="form.rating" :max="5" />
        </el-form-item>
        
        <el-form-item label="海报链接" prop="imageUrl">
          <el-input v-model="form.imageUrl" placeholder="请输入海报图片链接" />
        </el-form-item>
        
        <el-form-item label="简介" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入电影简介"
          />
        </el-form-item>
        
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
  max-width: 600px;
  margin: 0 auto;
}
</style>
