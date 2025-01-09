<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as travelPlanAPI from '@/api/travelPlanAPI'

// Travel plans data
const travelPlans = ref([])
const loading = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = ref(10)

// Form dialog
const createDialogVisible = ref(false)
const formLoading = ref(false)
const planForm = ref({
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  destination: {
    country: '',
    city: '',
    locations: []
  },
  itinerary: [{
    day: 1,
    date: '',
    activities: [{
      time: '',
      location: '',
      activity: '',
      duration: ''
    }]
  }]
})

const planFormRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
  'destination.country': [{ required: true, message: '请输入国家', trigger: 'blur' }],
  'destination.city': [{ required: true, message: '请输入城市', trigger: 'blur' }]
}

const planFormRef = ref(null)

// Reset form
const resetForm = () => {
  if (planFormRef.value) {
    planFormRef.value.resetFields()
  }
  planForm.value = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    destination: {
      country: '',
      city: '',
      locations: []
    },
    itinerary: [{
      day: 1,
      date: '',
      activities: [{
        time: '',
        location: '',
        activity: '',
        duration: ''
      }]
    }]
  }
}

// Watch for date changes to update itinerary
const updateItineraryDates = () => {
  if (planForm.value.startDate) {
    const startDate = new Date(planForm.value.startDate)
    planForm.value.itinerary[0].date = planForm.value.startDate
  }
}

// Handlers
const handleCreatePlan = () => {
  createDialogVisible.value = true
}

const handleCreateConfirm = async () => {
  if (!planFormRef.value) return
  
  await planFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        formLoading.value = true
        const response = await travelPlanAPI.createTravelPlan(planForm.value)
        if (response.code === '000000') {
          ElMessage.success('创建成功')
          createDialogVisible.value = false
          resetForm()
          fetchTravelPlans()
        }
      } catch (error) {
        ElMessage.error(error.response?.data?.msg || '创建失败')
      } finally {
        formLoading.value = false
      }
    }
  })
}

const handleCreateCancel = () => {
  createDialogVisible.value = false
  resetForm()
}

const handleLocationRemove = (location) => {
  const index = planForm.value.destination.locations.indexOf(location)
  if (index !== -1) {
    planForm.value.destination.locations.splice(index, 1)
  }
}

const handleLocationAdd = (location) => {
  if (location && !planForm.value.destination.locations.includes(location)) {
    planForm.value.destination.locations.push(location)
  }
}

const handleActivityChange = (index, field, value) => {
  planForm.value.itinerary[0].activities[0][field] = value
}

// Fetch travel plans
const fetchTravelPlans = async () => {
  try {
    loading.value = true
    const response = await travelPlanAPI.getTravelPlans({
      page: currentPage.value,
      limit: pageSize.value
    })
    if (response.code === '000000') {
      travelPlans.value = response.data.travelPlans
      totalPages.value = response.data.totalPages
    }
  } catch (error) {
    ElMessage.error('获取旅行计划失败')
  } finally {
    loading.value = false
  }
}

const handlePlanDetail = async (plan) => {
  try {
    const response = await travelPlanAPI.getTravelPlan(plan._id)
    if (response.code === '000000') {
      // TODO: Navigate to detail page with plan data
      ElMessage.info('计划详情功能开发中...')
    }
  } catch (error) {
    ElMessage.error('获取计划详情失败')
  }
}

const handlePublishPlan = async (plan) => {
  try {
    const response = await travelPlanAPI.updateTravelPlan(plan._id, {
      status: 'published'
    })
    if (response.code === '000000') {
      ElMessage.success('发布成功')
      fetchTravelPlans()
    }
  } catch (error) {
    ElMessage.error('发布失败')
  }
}

const handleUnpublishPlan = async (plan) => {
  try {
    const response = await travelPlanAPI.updateTravelPlan(plan._id, {
      status: 'draft'
    })
    if (response.code === '000000') {
      ElMessage.success('取消发布成功')
      fetchTravelPlans()
    }
  } catch (error) {
    ElMessage.error('取消发布失败')
  }
}

const handleDeletePlan = async (plan) => {
  try {
    await ElMessageBox.confirm('确定要删除该旅行计划吗？', '提示', {
      type: 'warning'
    })
    const response = await travelPlanAPI.deleteTravelPlan(plan._id)
    if (response.code === '000000') {
      ElMessage.success('删除成功')
      fetchTravelPlans()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchTravelPlans()
}

// Initial fetch
onMounted(() => {
  fetchTravelPlans()
})
</script>

<template>
  <div class="travel-container">
    <el-tabs v-model="activeTab" class="travel-tabs">
      <el-tab-pane label="旅游计划" name="plans">
        <div class="section-header">
          <h2>我的旅行计划</h2>
          <el-button type="primary" @click="handleCreatePlan">
            <el-icon><Plus /></el-icon>创建新计划
          </el-button>
        </div>
        
        <el-row :gutter="20" v-loading="loading">
          <el-col :span="12" v-for="plan in travelPlans" :key="plan._id">
            <el-card class="plan-card">
              <div class="plan-header">
                <h3 @click="handlePlanDetail(plan)">{{ plan.title }}</h3>
                <el-tag :type="plan.status === 'published' ? 'success' : 'warning'">
                  {{ plan.status === 'published' ? '已发布' : '草稿' }}
                </el-tag>
              </div>
              <div class="plan-info">
                <template v-if="plan.startDate && plan.endDate">
                  <p><el-icon><Calendar /></el-icon> {{ plan.startDate.split('T')[0] }} 至 {{ plan.endDate.split('T')[0] }}</p>
                </template>
                <template v-if="plan.destination">
                  <p>
                    <el-icon><Location /></el-icon> 
                    {{ plan.destination.country }} · {{ plan.destination.city }}
                  </p>
                  <p v-if="plan.destination.locations?.length" class="locations">
                    <el-tag 
                      v-for="location in plan.destination.locations" 
                      :key="location"
                      size="small"
                    >
                      {{ location }}
                    </el-tag>
                  </p>
                </template>
                <p class="plan-description">{{ plan.description || '暂无描述' }}</p>
                <div class="plan-meta">
                  <span class="created-by">
                    <el-icon><User /></el-icon> {{ plan.createdBy?.username }}
                  </span>
                  <span class="created-time">
                    <el-icon><Clock /></el-icon> {{ new Date(plan.createdAt).toLocaleDateString() }}
                  </span>
                </div>
              </div>
              <div class="plan-actions">
                <el-button 
                  type="primary" 
                  link 
                  @click="handlePlanDetail(plan)"
                >
                  编辑
                </el-button>
                <el-button 
                  :type="plan.status === 'published' ? 'warning' : 'success'" 
                  link 
                  @click="plan.status === 'published' ? handleUnpublishPlan(plan) : handlePublishPlan(plan)"
                >
                  {{ plan.status === 'published' ? '取消发布' : '发布' }}
                </el-button>
                <el-button 
                  type="danger" 
                  link 
                  @click="handleDeletePlan(plan)"
                >
                  删除
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <el-pagination
          v-if="totalPages > 1"
          class="pagination"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="totalPages * pageSize"
          layout="total, prev, pager, next"
          @current-change="handlePageChange"
        />
      </el-tab-pane>

      <el-tab-pane label="旅行游记" name="diaries">
        <div class="section-header">
          <h2>旅行游记</h2>
          <el-button type="primary">
            <el-icon><Edit /></el-icon>写游记
          </el-button>
        </div>
        <el-empty description="游记功能开发中..." />
      </el-tab-pane>
    </el-tabs>

    <!-- Create Plan Dialog -->
    <el-dialog
      v-model="createDialogVisible"
      title="创建旅行计划"
      width="700px"
      :close-on-click-modal="false"
      @close="handleCreateCancel"
    >
      <el-form
        ref="planFormRef"
        :model="planForm"
        :rules="planFormRules"
        label-width="100px"
        :disabled="formLoading"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="planForm.title" placeholder="请输入旅行计划标题" />
        </el-form-item>
        
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker
            v-model="planForm.startDate"
            type="date"
            placeholder="选择开始日期"
            value-format="YYYY-MM-DD"
            :disabled-date="(time) => time.getTime() < Date.now()"
            @change="updateItineraryDates"
          />
        </el-form-item>
        
        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker
            v-model="planForm.endDate"
            type="date"
            placeholder="选择结束日期"
            value-format="YYYY-MM-DD"
            :disabled-date="(time) => time.getTime() < Date.now() || (planForm.startDate && time.getTime() < new Date(planForm.startDate).getTime())"
          />
        </el-form-item>
        
        <el-form-item label="国家" prop="destination.country">
          <el-input v-model="planForm.destination.country" placeholder="请输入目的地国家" />
        </el-form-item>
        
        <el-form-item label="城市" prop="destination.city">
          <el-input v-model="planForm.destination.city" placeholder="请输入目的地城市" />
        </el-form-item>
        
        <el-form-item label="景点">
          <el-tag
            v-for="location in planForm.destination.locations"
            :key="location"
            closable
            class="location-tag"
            @close="handleLocationRemove(location)"
          >
            {{ location }}
          </el-tag>
          <el-input
            v-if="planForm.destination.locations.length < 5"
            class="location-input"
            placeholder="输入景点名称后回车"
            @keyup.enter="handleLocationAdd($event.target.value); $event.target.value = ''"
          />
        </el-form-item>

        <el-divider>第1天行程</el-divider>
        
        <div class="activity-form">
          <el-form-item label="时间">
            <el-time-picker
              v-model="planForm.itinerary[0].activities[0].time"
              format="HH:mm"
              placeholder="选择时间"
              @change="val => handleActivityChange(0, 'time', val)"
            />
          </el-form-item>

          <el-form-item label="地点">
            <el-input
              v-model="planForm.itinerary[0].activities[0].location"
              placeholder="请输入活动地点"
              @input="val => handleActivityChange(0, 'location', val)"
            />
          </el-form-item>

          <el-form-item label="活动">
            <el-input
              v-model="planForm.itinerary[0].activities[0].activity"
              placeholder="请输入活动内容"
              @input="val => handleActivityChange(0, 'activity', val)"
            />
          </el-form-item>

          <el-form-item label="时长">
            <el-input
              v-model="planForm.itinerary[0].activities[0].duration"
              placeholder="例如：3小时"
              @input="val => handleActivityChange(0, 'duration', val)"
            />
          </el-form-item>
        </div>
        
        <el-form-item label="描述">
          <el-input
            v-model="planForm.description"
            type="textarea"
            rows="3"
            placeholder="请输入计划描述"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCreateCancel">取消</el-button>
          <el-button type="primary" @click="handleCreateConfirm" :loading="formLoading">
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
    
    .plan-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;

      h3 {
        margin: 0;
        font-size: 18px;
        color: #303133;
        cursor: pointer;

        &:hover {
          color: #409EFF;
        }
      }
    }

    .plan-info {
      p {
        margin: 8px 0;
        color: #606266;
        display: flex;
        align-items: center;
        gap: 8px;

        .el-icon {
          font-size: 16px;
        }

        &.locations {
          flex-wrap: wrap;
          gap: 4px;
        }
      }

      .plan-description {
        margin: 12px 0;
        color: #909399;
        font-size: 14px;
      }

      .plan-meta {
        display: flex;
        gap: 20px;
        color: #909399;
        font-size: 13px;

        span {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }
    }

    .plan-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #EBEEF5;
    }
  }

  .location-tag {
    margin-right: 8px;
    margin-bottom: 8px;
  }

  .location-input {
    width: 200px;
  }

  .activity-form {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 20px;
  }

  :deep(.el-form-item__content) {
    flex-wrap: wrap;
  }

  .pagination {
    margin-top: 20px;
    text-align: right;
    padding: 0 20px;
  }
}
</style>