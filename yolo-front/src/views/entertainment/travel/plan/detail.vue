<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  getTravelPlanDetail,
  publishTravelPlan,
  unpublishTravelPlan,
  deleteTravelPlan
} from '@/api/travelAPI'

const route = useRoute()
const router = useRouter()
const travelPlan = ref(null)
const loading = ref(true)

// Fetch travel plan details
const fetchTravelPlan = async () => {
  try {
    loading.value = true
    const result = await getTravelPlanDetail(route.params.travelPlanId)
    if (result.code === '000000') {
      travelPlan.value = result.data
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

// Handle publish/unpublish
const handlePublishStatus = async (action) => {
  try {
    const apiCall = action === 'publish' ? publishTravelPlan : unpublishTravelPlan
    const result = await apiCall(route.params.travelPlanId)
    if (result.code === '000000') {
      ElMessage.success(result.msg)
      travelPlan.value = result.data
    } else {
      ElMessage.error(result.msg || `${action === 'publish' ? '发布' : '取消发布'}失败`)
    }
  } catch (error) {
    console.error(`Error ${action}ing travel plan:`, error)
    ElMessage.error(`${action === 'publish' ? '发布' : '取消发布'}失败`)
  }
}

// Delete travel plan
const handleDelete = async () => {
  try {
    const result = await deleteTravelPlan(route.params.travelPlanId)
    if (result.code === '000000') {
      ElMessage.success('删除成功')
      router.push('/entertainment/travel')
    } else {
      ElMessage.error(result.msg || '删除失败')
    }
  } catch (error) {
    console.error('Error deleting travel plan:', error)
    ElMessage.error('删除失败')
  }
}

onMounted(() => {
  fetchTravelPlan()
})
</script>

<template>
  <div class="travel-plan-detail">
    <el-card v-loading="loading">
      <template #header>
        <div class="card-header">
          <h2 class="title">{{ travelPlan?.title }}</h2>
          <div class="actions">
            <el-button-group>
              <el-button 
                v-if="travelPlan?.status === 'draft'"
                type="primary"
                @click="handlePublishStatus('publish')"
              >
                发布
              </el-button>
              <el-button 
                v-else
                type="warning"
                @click="handlePublishStatus('unpublish')"
              >
                取消发布
              </el-button>
              <el-button 
                type="primary" 
                @click="router.push(`/entertainment/travel/plan/edit/${route.params.travelPlanId}`)"
              >
                编辑
              </el-button>
              <el-button 
                type="danger"
                @click="handleDelete"
              >
                删除
              </el-button>
            </el-button-group>
          </div>
        </div>
      </template>

      <div v-if="travelPlan" class="plan-content">
        <div class="description">
          <h3>描述</h3>
          <p>{{ travelPlan.description }}</p>
        </div>

        <div class="destination">
          <h3>目的地</h3>
          <el-descriptions :column="3" border>
            <el-descriptions-item label="国家">
              {{ travelPlan.destination.country }}
            </el-descriptions-item>
            <el-descriptions-item label="城市">
              {{ travelPlan.destination.city }}
            </el-descriptions-item>
            <el-descriptions-item label="地点">
              {{ travelPlan.destination.locations.join(', ') }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="itinerary">
          <h3>行程安排</h3>
          <el-timeline>
            <el-timeline-item
              v-for="day in travelPlan.itinerary"
              :key="day.date"
              :timestamp="day.date"
              placement="top"
            >
              <el-card>
                <h4>第{{ day.day }}天</h4>
                <el-timeline>
                  <el-timeline-item
                    v-for="(activity, index) in day.activities"
                    :key="index"
                    :timestamp="activity.time"
                    size="small"
                  >
                    <p>{{ activity.activity }} @ {{ activity.location }}</p>
                    <p class="duration">时长：{{ activity.duration }}</p>
                  </el-timeline-item>
                </el-timeline>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>

        <div class="meta-info">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="创建时间">
              {{ new Date(travelPlan.createdAt).toLocaleString() }}
            </el-descriptions-item>
            <el-descriptions-item label="更新时间">
              {{ new Date(travelPlan.updatedAt).toLocaleString() }}
            </el-descriptions-item>
            <el-descriptions-item label="创建者">
              {{ travelPlan.createdBy.username }}
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="travelPlan.status === 'published' ? 'success' : 'warning'">
                {{ travelPlan.status === 'published' ? '已发布' : '草稿' }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.travel-plan-detail {
  padding: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      margin: 0;
      font-size: 24px;
    }
  }

  .plan-content {
    > div {
      margin-bottom: 30px;

      h3 {
        margin-bottom: 15px;
        font-size: 18px;
        border-bottom: 2px solid #eee;
        padding-bottom: 10px;
      }
    }
  }

  .description {
    p {
      color: #666;
      line-height: 1.6;
    }
  }

  .itinerary {
    .duration {
      color: #666;
      font-size: 0.9em;
      margin-top: 5px;
    }
  }

  :deep(.el-timeline-item__content) {
    h4 {
      margin: 0 0 10px;
    }
  }
}
</style>
