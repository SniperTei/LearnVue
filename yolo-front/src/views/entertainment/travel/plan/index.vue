<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getTravelPlans, getTravelDiaries, deleteTravelPlan, createTravelPlan } from '@/api/travelAPI'

// Router
const router = useRouter()

// Data
const loading = ref(false)
const travelPlans = ref([])
const travelDiaries = ref([])
const activeTab = ref('plans')

// Create dialog
const createDialogVisible = ref(false)
const createFormLoading = ref(false)
const createForm = ref({
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  destination: {
    country: '',
    city: '',
    locations: []
  },
  itinerary: []
})

// New itinerary item form
const itineraryForm = ref({
  day: 1,
  date: '',
  activities: []
})

const activityForm = ref({
  time: '',
  location: '',
  activity: '',
  duration: ''
})

const createFormRules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入描述', trigger: 'blur' }
  ],
  startDate: [
    { required: true, message: '请选择开始日期', trigger: 'change' }
  ],
  endDate: [
    { required: true, message: '请选择结束日期', trigger: 'change' }
  ],
  'destination.country': [
    { required: true, message: '请输入国家', trigger: 'blur' }
  ],
  'destination.city': [
    { required: true, message: '请输入城市', trigger: 'blur' }
  ]
}

const createFormRef = ref(null)
const locationInput = ref('')

// Helper function to format date string
const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Methods for create dialog
const handleCreatePlan = () => {
  createDialogVisible.value = true
}

const handleAddLocation = () => {
  if (locationInput.value) {
    createForm.value.destination.locations.push(locationInput.value)
    locationInput.value = ''
  }
}

const handleRemoveLocation = (index) => {
  createForm.value.destination.locations.splice(index, 1)
}

const handleAddActivity = () => {
  if (!activityForm.value.activity || !activityForm.value.location) {
    ElMessage.warning('请填写活动内容和地点')
    return
  }

  const time = activityForm.value.time ? 
    new Date(activityForm.value.time).toLocaleTimeString('zh', { hour: '2-digit', minute: '2-digit', hour12: false }) :
    ''

  itineraryForm.value.activities.push({
    time,
    location: activityForm.value.location,
    activity: activityForm.value.activity,
    duration: activityForm.value.duration
  })

  activityForm.value = {
    time: '',
    location: '',
    activity: '',
    duration: ''
  }
}

const handleRemoveActivity = (index) => {
  itineraryForm.value.activities.splice(index, 1)
}

const handleAddItinerary = () => {
  if (!itineraryForm.value.date) {
    ElMessage.warning('请选择日期')
    return
  }
  
  if (itineraryForm.value.activities.length === 0) {
    ElMessage.warning('请至少添加一个活动')
    return
  }
  
  createForm.value.itinerary.push({
    day: itineraryForm.value.day,
    date: formatDate(itineraryForm.value.date),
    activities: [...itineraryForm.value.activities]
  })
  
  const nextDay = itineraryForm.value.day + 1
  const nextDate = new Date(itineraryForm.value.date)
  nextDate.setDate(nextDate.getDate() + 1)
  
  itineraryForm.value = {
    day: nextDay,
    date: formatDate(nextDate),
    activities: []
  }
}

const handleRemoveItinerary = (index) => {
  createForm.value.itinerary.splice(index, 1)
}

const resetCreateForm = () => {
  createForm.value = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    destination: {
      country: '',
      city: '',
      locations: []
    },
    itinerary: []
  }
  itineraryForm.value = {
    day: 1,
    date: '',
    activities: []
  }
  activityForm.value = {
    time: '',
    location: '',
    activity: '',
    duration: ''
  }
  if (createFormRef.value) {
    createFormRef.value.resetFields()
  }
}

const handleCreateSubmit = async () => {
  if (!createFormRef.value) return
  
  try {
    await createFormRef.value.validate()
    
    // Validate itinerary
    if (!createForm.value.itinerary.length) {
      ElMessage.warning('请至少添加一个行程')
      return
    }

    // Validate activities in each itinerary
    for (const item of createForm.value.itinerary) {
      if (!item.activities.length) {
        ElMessage.warning('每个行程至少需要一个活动')
        return
      }
      for (const activity of item.activities) {
        if (!activity.activity || !activity.location) {
          ElMessage.warning('活动内容和地点不能为空')
          return
        }
      }
    }

    createFormLoading.value = true
    
    // Format dates before submission
    const formData = {
      ...createForm.value,
      startDate: formatDate(createForm.value.startDate),
      endDate: formatDate(createForm.value.endDate),
      itinerary: createForm.value.itinerary.map(item => ({
        ...item,
        date: formatDate(item.date)
      }))
    }
    
    const result = await createTravelPlan(formData)
    if (result.code === '000000') {
      ElMessage.success('创建成功')
      createDialogVisible.value = false
      resetCreateForm()
      fetchTravelPlans()
    } else {
      ElMessage.error(result.msg || '创建失败')
    }
  } catch (error) {
    console.error('Error creating travel plan:', error)
    ElMessage.error(typeof error === 'object' ? JSON.stringify(error) : error)
  } finally {
    createFormLoading.value = false
  }
}

const handleCreateCancel = () => {
  createDialogVisible.value = false
  resetCreateForm()
}

// Fetch data
const fetchTravelPlans = async () => {
  try {
    loading.value = true
    const result = await getTravelPlans()
    console.log('Travel plans list response:', result)
    
    if (result.code === '000000' && result.data) {
      // Access the travelPlans array from the nested structure
      travelPlans.value = result.data.travelPlans || []
    } else {
      ElMessage.error(result.msg || '获取旅行计划失败')
      travelPlans.value = []
    }
  } catch (error) {
    console.error('Error fetching travel plans:', error)
    ElMessage.error('获取旅行计划失败')
    travelPlans.value = []
  } finally {
    loading.value = false
  }
}

const fetchTravelDiaries = async () => {
  try {
    loading.value = true
    const result = await getTravelDiaries()
    console.log('Travel diaries response:', result)
    
    if (result.code === '000000' && result.data) {
      travelDiaries.value = result.data.diaries || []
    } else {
      ElMessage.error(result.msg || '获取旅行日记失败')
      travelDiaries.value = []
    }
  } catch (error) {
    console.error('Error fetching travel diaries:', error)
    ElMessage.error('获取旅行日记失败')
    travelDiaries.value = []
  } finally {
    loading.value = false
  }
}

// Handlers
const handleDelete = async (row) => {
  try {
    const result = await deleteTravelPlan(row._id)
    if (result.code === '000000') {
      ElMessage.success('删除成功')
      fetchTravelPlans()
    } else {
      ElMessage.error(result.msg || '删除失败')
    }
  } catch (error) {
    console.error('Error deleting travel plan:', error)
    ElMessage.error('删除失败')
  }
}

const handleCreateDiary = () => {
  router.push('/entertainment/travel/diary/create')
}

// Watch tab changes
const handleTabChange = (tab) => {
  if (tab === 'plans') {
    fetchTravelPlans()
  } else if (tab === 'diaries') {
    fetchTravelDiaries()
  }
}

// Watch startDate to set initial itinerary date
watch(() => createForm.value.startDate, (newDate) => {
  if (newDate && !itineraryForm.value.date) {
    itineraryForm.value.date = newDate
  }
})

// Initial data load
onMounted(() => {
  fetchTravelPlans()
})
</script>

<template>
  <div class="travel-container">
    <el-tabs v-model="activeTab" class="travel-tabs" @tab-change="handleTabChange">
      <el-tab-pane label="旅游计划" name="plans">
        <div class="section-header">
          <h2>我的旅行计划</h2>
          <el-button type="primary" @click="handleCreatePlan">
            <el-icon><Plus /></el-icon>创建新计划
          </el-button>
        </div>
        
        <el-row :gutter="20" v-loading="loading">
          <el-col 
            :span="12" 
            v-for="plan in travelPlans" 
            :key="plan._id"
          >
            <el-card 
              class="plan-card" 
              @click="router.push(`/entertainment/travel/detail/${plan._id}`)"
            >
              <div class="plan-header">
                <h3>{{ plan.title }}</h3>
                <el-tag :type="plan.status === 'published' ? 'success' : 'warning'">
                  {{ plan.status === 'published' ? '已发布' : '未发布' }}
                </el-tag>
              </div>
              <div class="plan-content">
                <p><el-icon><Calendar /></el-icon> {{ formatDate(plan.startDate) }} - {{ formatDate(plan.endDate) }}</p>
                <p><el-icon><Location /></el-icon> {{ plan.destination?.city }}, {{ plan.destination?.country }}</p>
                <p v-if="plan.destination?.locations?.length">
                  <el-icon><List /></el-icon> 景点：{{ plan.destination.locations.join(', ') }}
                </p>
                <p class="plan-description">{{ plan.description }}</p>
                <div class="plan-itinerary" v-if="plan.itinerary?.length">
                  <p><strong>行程安排：</strong></p>
                  <ul>
                    <li v-for="(item, index) in plan.itinerary" :key="index">
                      第{{ item.day }}天 ({{ formatDate(item.date) }}): 
                      <template v-if="item.activities?.length">
                        {{ item.activities.map(a => `${a.time} ${a.activity}(${a.location})`).join(', ') }}
                      </template>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="plan-actions">
                <el-button 
                  type="danger" 
                  @click.stop="handleDelete(plan)"
                  :loading="loading"
                >
                  <el-icon><Delete /></el-icon>删除
                </el-button>
              </div>
            </el-card>
          </el-col>
          <el-empty 
            v-if="!loading && (!travelPlans || travelPlans.length === 0)" 
            description="暂无旅行计划" 
          />
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="旅行日记" name="diaries">
        <div class="section-header">
          <h2>我的旅行日记</h2>
          <el-button type="primary" @click="handleCreateDiary">
            <el-icon><Plus /></el-icon>写新日记
          </el-button>
        </div>
        
        <el-row :gutter="20" v-loading="loading">
          <el-col 
            :span="12" 
            v-for="diary in travelDiaries" 
            :key="diary._id"
          >
            <el-card class="diary-card">
              <div class="diary-header">
                <h3>{{ diary.title }}</h3>
                <div class="diary-meta">
                  <span class="diary-time">
                    <el-icon><Calendar /></el-icon>
                    {{ formatDateTime(diary.createdAt) }}
                  </span>
                </div>
              </div>
              
              <div class="diary-location" v-if="diary.location">
                <el-icon><Location /></el-icon>
                {{ diary.location.country }} · {{ diary.location.city }} · {{ diary.location.place }}
              </div>
              
              <div class="diary-content">
                <p>{{ diary.content }}</p>
              </div>
              
              <div class="diary-images" v-if="diary.images?.length">
                <el-image
                  v-for="image in diary.images"
                  :key="image._id"
                  :src="image.url"
                  :alt="image.caption"
                  fit="cover"
                  :preview-src-list="diary.images.map(img => img.url)"
                >
                  <template #error>
                    <div class="image-error">
                      <el-icon><Picture /></el-icon>
                      图片加载失败
                    </div>
                  </template>
                </el-image>
              </div>
              
              <div class="diary-tags" v-if="diary.tags?.length">
                <el-tag
                  v-for="tag in diary.tags"
                  :key="tag"
                  size="small"
                  effect="plain"
                  class="diary-tag"
                >
                  {{ tag }}
                </el-tag>
              </div>
              
              <div class="diary-actions">
                <el-button 
                  type="primary" 
                  link 
                  @click="handleEditDiary(diary)"
                >
                  <el-icon><Edit /></el-icon>编辑
                </el-button>
                <el-button 
                  type="danger" 
                  link 
                  @click="handleDeleteDiary(diary)"
                >
                  <el-icon><Delete /></el-icon>删除
                </el-button>
              </div>
            </el-card>
          </el-col>
          
          <el-empty 
            v-if="!loading && (!travelDiaries || travelDiaries.length === 0)" 
            description="暂无旅行日记" 
          />
        </el-row>
      </el-tab-pane>
    </el-tabs>
    
    <!-- Create Travel Plan Dialog -->
    <el-dialog
      v-model="createDialogVisible"
      title="创建旅行计划"
      width="70%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="createFormRef"
        :model="createForm"
        :rules="createFormRules"
        label-width="100px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="createForm.title" placeholder="请输入旅行计划标题" />
        </el-form-item>
        
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="createForm.description"
            type="textarea"
            rows="3"
            placeholder="请输入旅行计划描述"
          />
        </el-form-item>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始日期" prop="startDate">
              <el-date-picker
                v-model="createForm.startDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="选择开始日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束日期" prop="endDate">
              <el-date-picker
                v-model="createForm.endDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="选择结束日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-divider>目的地信息</el-divider>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="国家" prop="destination.country">
              <el-input v-model="createForm.destination.country" placeholder="请输入国家" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="城市" prop="destination.city">
              <el-input v-model="createForm.destination.city" placeholder="请输入城市" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="景点">
          <div class="location-input">
            <el-input
              v-model="locationInput"
              placeholder="输入景点名称"
              @keyup.enter="handleAddLocation"
            >
              <template #append>
                <el-button @click="handleAddLocation">添加</el-button>
              </template>
            </el-input>
          </div>
          <div class="locations-list" v-if="createForm.destination.locations.length">
            <el-tag
              v-for="(location, index) in createForm.destination.locations"
              :key="index"
              closable
              @close="handleRemoveLocation(index)"
              class="location-tag"
            >
              {{ location }}
            </el-tag>
          </div>
        </el-form-item>
        
        <el-divider>行程安排</el-divider>
        
        <!-- Itinerary Form -->
        <div class="itinerary-form">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="第几天">
                <el-input-number 
                  v-model="itineraryForm.day" 
                  :min="1" 
                  controls-position="right"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="日期">
                <el-date-picker
                  v-model="itineraryForm.date"
                  type="date"
                  value-format="YYYY-MM-DD"
                  placeholder="选择日期"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-form-item label="活动">
            <div class="activity-form">
              <el-row :gutter="20">
                <el-col :span="6">
                  <el-time-picker
                    v-model="activityForm.time"
                    format="HH:mm"
                    placeholder="时间"
                    style="width: 100%"
                  />
                </el-col>
                <el-col :span="6">
                  <el-input v-model="activityForm.location" placeholder="地点" />
                </el-col>
                <el-col :span="6">
                  <el-input v-model="activityForm.activity" placeholder="活动内容" />
                </el-col>
                <el-col :span="6">
                  <el-input 
                    v-model="activityForm.duration" 
                    placeholder="持续时间"
                    @keyup.enter="handleAddActivity"
                  >
                    <template #append>
                      <el-button @click="handleAddActivity">添加</el-button>
                    </template>
                  </el-input>
                </el-col>
              </el-row>
            </div>
            
            <div class="activities-list" v-if="itineraryForm.activities.length">
              <el-table :data="itineraryForm.activities" style="width: 100%">
                <el-table-column prop="time" label="时间" width="100" />
                <el-table-column prop="location" label="地点" />
                <el-table-column prop="activity" label="活动" />
                <el-table-column prop="duration" label="持续时间" width="120" />
                <el-table-column label="操作" width="80">
                  <template #default="{ $index }">
                    <el-button
                      type="danger"
                      link
                      @click="handleRemoveActivity($index)"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleAddItinerary">
              <el-icon><Plus /></el-icon>添加到行程
            </el-button>
          </el-form-item>
        </div>
        
        <!-- Itinerary List -->
        <div class="itinerary-list" v-if="createForm.itinerary.length">
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in createForm.itinerary"
              :key="index"
              :timestamp="'第' + item.day + '天 - ' + item.date"
              placement="top"
            >
              <el-card>
                <template #header>
                  <div class="itinerary-header">
                    <span>行程安排</span>
                    <el-button
                      type="danger"
                      link
                      @click="handleRemoveItinerary(index)"
                    >
                      删除
                    </el-button>
                  </div>
                </template>
                <el-table :data="item.activities" style="width: 100%">
                  <el-table-column prop="time" label="时间" width="100" />
                  <el-table-column prop="location" label="地点" />
                  <el-table-column prop="activity" label="活动" />
                  <el-table-column prop="duration" label="持续时间" width="120" />
                </el-table>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCreateCancel">取消</el-button>
          <el-button
            type="primary"
            :loading="createFormLoading"
            @click="handleCreateSubmit"
          >
            创建
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.travel-container {
  padding: 20px;
  background: #fff;
  min-height: calc(100vh - 120px);

  .travel-tabs {
    :deep(.el-tabs__nav-wrap) {
      padding: 0 20px;
    }
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0;
    padding: 0 20px;

    h2 {
      margin: 0;
      font-size: 20px;
      color: #303133;
    }
  }

  .plan-card {
    margin-bottom: 20px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    }

    .plan-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;

      h3 {
        margin: 0;
        font-size: 18px;
        color: #303133;
      }
    }

    .plan-content {
      margin: 15px 0;
      
      p {
        margin: 8px 0;
        display: flex;
        align-items: center;
        gap: 8px;
        
        .el-icon {
          color: #409EFF;
        }
      }
      
      .plan-description {
        color: #606266;
        font-size: 14px;
        margin: 12px 0;
      }
      
      .plan-itinerary {
        margin-top: 15px;
        padding: 12px;
        background-color: #f5f7fa;
        border-radius: 4px;
        
        p {
          margin: 0 0 8px;
        }
        
        ul {
          margin: 0;
          padding-left: 20px;
          
          li {
            margin-bottom: 8px;
            color: #606266;
            font-size: 14px;
            line-height: 1.4;
            
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
    }

    .plan-actions {
      margin-top: 15px;
      text-align: right;
    }
  }

  .diary-card {
    margin-bottom: 20px;
    overflow: hidden;

    .diary-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
      
      h3 {
        margin: 0;
        font-size: 18px;
        color: #303133;
      }
      
      .diary-meta {
        color: #909399;
        font-size: 14px;
        
        .diary-time {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }
    }
    
    .diary-location {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #409EFF;
      font-size: 14px;
      margin-bottom: 12px;
    }
    
    .diary-content {
      margin: 16px 0;
      color: #606266;
      line-height: 1.6;
      
      p {
        margin: 0;
        white-space: pre-line;
      }
    }
    
    .diary-images {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 8px;
      margin: 16px 0;
      
      .el-image {
        width: 100%;
        height: 150px;
        border-radius: 4px;
        overflow: hidden;
        
        .image-error {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #909399;
          background: #f5f7fa;
          font-size: 14px;
          
          .el-icon {
            font-size: 24px;
            margin-bottom: 8px;
          }
        }
      }
    }
    
    .diary-tags {
      margin: 16px 0;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      
      .diary-tag {
        margin: 0;
      }
    }
    
    .diary-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #ebeef5;
    }
  }

  .location-input {
    margin-bottom: 10px;
  }

  .locations-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    
    .location-tag {
      margin: 0;
    }
  }

  .itinerary-form {
    background-color: #f5f7fa;
    padding: 20px;
    border-radius: 4px;
    margin-bottom: 20px;
  }

  .activity-form {
    margin-bottom: 15px;
  }

  .activities-list {
    margin-top: 15px;
  }

  .itinerary-list {
    margin-top: 20px;
    
    .itinerary-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}
</style>