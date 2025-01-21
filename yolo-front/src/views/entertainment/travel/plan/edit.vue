<template>
  <div class="travel-plan-edit">
    <div class="page-header">
      <div class="title-section">
        <el-button link @click="router.back()">
          <el-icon><ArrowLeft /></el-icon>返回
        </el-button>
        <h2>编辑旅行计划</h2>
      </div>
    </div>

    <el-card v-loading="loading">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="输入旅行计划标题" />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="输入旅行计划描述"
          />
        </el-form-item>

        <el-form-item label="目的地">
          <div class="destination-inputs">
            <el-form-item prop="destination.country">
              <el-input v-model="form.destination.country" placeholder="国家" />
            </el-form-item>
            <el-form-item prop="destination.city">
              <el-input v-model="form.destination.city" placeholder="城市" />
            </el-form-item>
            <el-form-item prop="destination.locations">
              <el-select
                v-model="form.destination.locations"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="添加具体地点"
              />
            </el-form-item>
          </div>
        </el-form-item>

        <el-form-item label="行程安排">
          <div class="itinerary-section">
            <div v-for="(day, dayIndex) in form.itinerary" :key="dayIndex" class="day-section">
              <div class="day-header">
                <h4>第{{ day.day }}天</h4>
                <el-button type="danger" link @click="removeDay(dayIndex)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
              
              <el-form-item :prop="'itinerary.' + dayIndex + '.date'">
                <el-date-picker
                  v-model="day.date"
                  type="date"
                  placeholder="选择日期"
                />
              </el-form-item>

              <div class="activities">
                <div v-for="(activity, actIndex) in day.activities" :key="actIndex" class="activity-item">
                  <el-row :gutter="10">
                    <el-col :span="6">
                      <el-time-picker
                        v-model="activity.time"
                        placeholder="时间"
                        format="HH:mm"
                      />
                    </el-col>
                    <el-col :span="6">
                      <el-input v-model="activity.location" placeholder="地点" />
                    </el-col>
                    <el-col :span="6">
                      <el-input v-model="activity.activity" placeholder="活动" />
                    </el-col>
                    <el-col :span="4">
                      <el-input v-model="activity.duration" placeholder="时长" />
                    </el-col>
                    <el-col :span="2">
                      <el-button type="danger" link @click="removeActivity(dayIndex, actIndex)">
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </el-col>
                  </el-row>
                </div>
                <el-button type="primary" link @click="addActivity(dayIndex)">
                  <el-icon><Plus /></el-icon>添加活动
                </el-button>
              </div>
            </div>
            <el-button type="primary" @click="addDay">添加天数</el-button>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">保存修改</el-button>
          <el-button @click="router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Delete, Plus } from '@element-plus/icons-vue'
import { getTravelPlanDetail, updateTravelPlan } from '@/api/travelAPI'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)
const loading = ref(true)

const form = ref({
  title: '',
  description: '',
  destination: {
    country: '',
    city: '',
    locations: []
  },
  itinerary: []
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
  'destination.country': [{ required: true, message: '请输入国家', trigger: 'blur' }],
  'destination.city': [{ required: true, message: '请输入城市', trigger: 'blur' }]
}

// Fetch travel plan details
const fetchTravelPlan = async () => {
  try {
    loading.value = true
    const result = await getTravelPlanDetail(route.params.travelPlanId)
    if (result.code === '000000') {
      const { title, description, destination, itinerary } = result.data
      form.value = {
        title,
        description,
        destination: {
          country: destination.country,
          city: destination.city,
          locations: destination.locations || []
        },
        itinerary: itinerary.map(day => ({
          ...day,
          activities: day.activities.map(act => ({
            ...act,
            time: act.time ? new Date(`2000-01-01T${act.time}`) : null
          }))
        }))
      }
    } else {
      ElMessage.error(result.msg || '获取旅行计划失败')
    }
  } catch (error) {
    console.error('Error fetching travel plan:', error)
    ElMessage.error('获取旅行计划失败')
  } finally {
    loading.value = false
  }
}

// Add new day
const addDay = () => {
  const newDay = {
    day: form.value.itinerary.length + 1,
    date: null,
    activities: []
  }
  form.value.itinerary.push(newDay)
}

// Remove day
const removeDay = (dayIndex) => {
  form.value.itinerary.splice(dayIndex, 1)
  // Update day numbers
  form.value.itinerary.forEach((day, index) => {
    day.day = index + 1
  })
}

// Add new activity to a day
const addActivity = (dayIndex) => {
  form.value.itinerary[dayIndex].activities.push({
    time: null,
    location: '',
    activity: '',
    duration: ''
  })
}

// Remove activity
const removeActivity = (dayIndex, actIndex) => {
  form.value.itinerary[dayIndex].activities.splice(actIndex, 1)
}

// Submit form
const submitForm = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    
    // Format the data before submission
    const submitData = {
      ...form.value,
      itinerary: form.value.itinerary.map(day => ({
        ...day,
        activities: day.activities.map(act => ({
          ...act,
          time: act.time ? act.time.toTimeString().slice(0, 5) : null
        }))
      }))
    }

    const result = await updateTravelPlan(route.params.travelPlanId, submitData)
    if (result.code === '000000') {
      ElMessage.success('保存成功')
      router.back()
    } else {
      ElMessage.error(result.msg || '保存失败')
    }
  } catch (error) {
    console.error('Error updating travel plan:', error)
    ElMessage.error('保存失败')
  }
}

onMounted(() => {
  fetchTravelPlan()
})
</script>

<style lang="scss" scoped>
.travel-plan-edit {
  padding: 20px;

  .page-header {
    margin-bottom: 20px;

    .title-section {
      display: flex;
      align-items: center;
      gap: 12px;

      h2 {
        margin: 0;
      }
    }
  }

  .destination-inputs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;

    .el-form-item {
      margin-bottom: 0;
    }
  }

  .itinerary-section {
    .day-section {
      border: 1px solid var(--el-border-color);
      border-radius: 4px;
      padding: 16px;
      margin-bottom: 16px;

      .day-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        h4 {
          margin: 0;
        }
      }

      .activities {
        .activity-item {
          margin-bottom: 12px;
        }
      }
    }
  }
}
</style>
