<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Edit, Plus, Timer, Location, Aim } from '@element-plus/icons-vue'
import { createFitness, getFitnessList, updateFitness, deleteFitness } from '@/api/fitnessAPI'
import dayjs from 'dayjs'

// 数据
const records = ref([])
const total = ref(0)
const page = ref(1)
const limit = ref(10)
const dialogVisible = ref(false)
const dialogTitle = ref('新增记录')
const isEditing = ref(false)
const editingId = ref(null)
const formRef = ref(null)

// 查询表单
const queryForm = ref({
  dateRange: [],
  exerciseType: '',
  intensity: ''
})

// 运动类型选项
const exerciseTypes = [
  { label: '跑步', value: '跑步', icon: '🏃' },
  { label: '游泳', value: '游泳', icon: '🏊' },
  { label: '骑行', value: '骑行', icon: '🚴' },
  { label: '力量训练', value: '力量训练', icon: '🏋️' },
  { label: '瑜伽', value: '瑜伽', icon: '🧘' },
  { label: '篮球', value: '篮球', icon: '🏀' },
  { label: '足球', value: '足球', icon: '⚽' },
  { label: '羽毛球', value: '羽毛球', icon: '🏸' },
  { label: '乒乓球', value: '乒乓球', icon: '🏓' },
  { label: '其他', value: '其他', icon: '🎯' }
]

// 运动强度选项
const intensityOptions = [
  { label: '低强度', value: 'low' },
  { label: '中等强度', value: 'moderate' },
  { label: '高强度', value: 'vigorous' }
]

// 表单数据
const form = ref({
  exerciseType: '',
  exerciseDate: '',
  duration: '',
  caloriesBurned: '',
  intensity: 'moderate',
  location: ''
})

// 表单规则
const rules = {
  exerciseType: [{ required: true, message: '请选择运动类型', trigger: 'change' }],
  exerciseDate: [{ required: true, message: '请选择运动时间', trigger: 'change' }],
  duration: [{ required: true, message: '请输入运动时长', trigger: 'blur' }],
  caloriesBurned: [{ required: true, message: '请输入消耗卡路里', trigger: 'blur' }],
  intensity: [{ required: true, message: '请选择运动强度', trigger: 'change' }],
  location: [{ required: true, message: '请输入运动地点', trigger: 'blur' }]
}

// 计算属性
const monthlyCount = computed(() => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  return records.value.filter(record => {
    const recordDate = new Date(record.exerciseDate)
    return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear
  }).length
})

const totalDuration = computed(() => {
  return records.value.reduce((sum, record) => sum + record.duration, 0)
})

const totalCalories = computed(() => {
  return records.value.reduce((sum, record) => sum + record.caloriesBurned, 0)
})

// 获取运动类型图标
const getExerciseIcon = (type) => {
  return exerciseTypes.find(t => t.value === type)?.icon || '🎯'
}

// 格式化日期时间
const formatDateTime = (datetime) => {
  return dayjs(datetime).format('YYYY-MM-DD HH:mm')
}

// 加载健身记录
const loadRecords = async () => {
  try {
    const params = {
      page: page.value,
      limit: limit.value,
      startDate: queryForm.value.dateRange?.[0],
      endDate: queryForm.value.dateRange?.[1],
      exerciseType: queryForm.value.exerciseType,
      intensity: queryForm.value.intensity
    }
    
    const res = await getFitnessList(params)
    if (res.code === '000000') {
      records.value = res.data.records
      total.value = res.data.total
    }
  } catch (error) {
    console.error('获取记录失败:', error)
    ElMessage.error('获取记录失败')
  }
}

// 查询处理
const handleQuery = () => {
  page.value = 1
  loadRecords()
}

// 重置查询
const resetQuery = () => {
  queryForm.value = {
    dateRange: [],
    exerciseType: '',
    intensity: ''
  }
  handleQuery()
}

// 分页处理
const handleSizeChange = (val) => {
  limit.value = val
  loadRecords()
}

const handleCurrentChange = (val) => {
  page.value = val
  loadRecords()
}

// 打开新增对话框
const openAddDialog = () => {
  dialogTitle.value = '新增记录'
  isEditing.value = false
  editingId.value = null
  form.value = {
    exerciseType: '',
    exerciseDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    duration: '',
    caloriesBurned: '',
    intensity: 'moderate',
    location: ''
  }
  dialogVisible.value = true
}

// 打开编辑对话框
const openEditDialog = (record) => {
  dialogTitle.value = '编辑记录'
  isEditing.value = true
  editingId.value = record.fitnessId
  form.value = { ...record }
  dialogVisible.value = true
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    let res
    if (isEditing.value) {
      res = await updateFitness(editingId.value, form.value)
    } else {
      res = await createFitness(form.value)
    }
    
    if (res.code === '000000') {
      ElMessage.success(isEditing.value ? '修改成功' : '添加成功')
      dialogVisible.value = false
      loadRecords()
    }
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败')
  }
}

// 删除记录
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这条记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const res = await deleteFitness(id)
    if (res.code === '000000') {
      ElMessage.success('删除成功')
      loadRecords()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      // ElMessage.error('删除失败')
    }
  }
}

// 初始化
onMounted(() => {
  loadRecords()
})
</script>

<template>
  <div class="fitness-records">
    <div class="page-header">
      <div class="title-stats">
        <h2>健身记录</h2>
        <div class="stats">
          <el-tag type="info">总记录: {{ total }}</el-tag>
          <el-tag type="success">本月记录: {{ monthlyCount }}</el-tag>
          <el-tag type="warning">总时长: {{ totalDuration }}分钟</el-tag>
          <el-tag type="danger">总消耗: {{ totalCalories }}卡路里</el-tag>
        </div>
      </div>
      <el-button type="primary" @click="openAddDialog">
        <el-icon><Plus /></el-icon>新增记录
      </el-button>
    </div>

    <!-- 查询表单 -->
    <el-form :inline="true" :model="queryForm" class="query-form">
      <el-form-item label="日期范围">
        <el-date-picker
          v-model="queryForm.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          @change="handleQuery"
        />
      </el-form-item>
      <el-form-item label="运动类型">
        <el-select v-model="queryForm.exerciseType" placeholder="请选择" clearable @change="handleQuery">
          <el-option
            v-for="type in exerciseTypes"
            :key="type.value"
            :label="type.label"
            :value="type.value"
          >
            <span>{{ type.icon }} {{ type.label }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运动强度">
        <el-select v-model="queryForm.intensity" placeholder="请选择" clearable @change="handleQuery">
          <el-option
            v-for="item in intensityOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 记录列表 -->
    <div class="records-list">
      <el-empty v-if="records.length === 0" description="暂无记录" />
      <el-card v-else v-for="record in records" :key="record.fitnessId" class="record-card">
        <div class="record-header">
          <div class="date-info">
            <span class="date">{{ formatDateTime(record.exerciseDate) }}</span>
          </div>
          <div class="actions">
            <el-button type="primary" link @click="openEditDialog(record)">
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button type="danger" link @click="handleDelete(record.fitnessId)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
        <div class="record-content">
          <div class="exercise-info">
            <el-tag type="success">
              <span class="exercise-type">
                {{ getExerciseIcon(record.exerciseType) }}
                {{ record.exerciseType }}
              </span>
            </el-tag>
            <div class="stats">
              <el-tag type="info">{{ intensityOptions.find(i => i.value === record.intensity)?.label }}</el-tag>
              <span class="stat-item">
                <el-icon><Timer /></el-icon>
                {{ record.duration }} 分钟
              </span>
              <span class="stat-item">
                <el-icon><Aim /></el-icon>
                {{ record.caloriesBurned }} 卡路里
              </span>
            </div>
          </div>
          <div v-if="record.location" class="location">
            <el-icon><Location /></el-icon>
            {{ record.location }}
          </div>
        </div>
      </el-card>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="limit"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="运动类型" prop="exerciseType">
          <el-select v-model="form.exerciseType" placeholder="请选择运动类型" style="width: 100%">
            <el-option
              v-for="type in exerciseTypes"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            >
              <span>{{ type.icon }} {{ type.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="运动时间" prop="exerciseDate">
          <el-date-picker
            v-model="form.exerciseDate"
            type="datetime"
            placeholder="请选择时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="new Date(2000, 1, 1, 8, 0, 0)"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="运动时长" prop="duration">
          <el-input-number
            v-model="form.duration"
            :min="1"
            :max="1440"
            placeholder="请输入运动时长(分钟)"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="消耗卡路里" prop="caloriesBurned">
          <el-input-number
            v-model="form.caloriesBurned"
            :min="1"
            :max="10000"
            placeholder="请输入消耗卡路里"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="运动强度" prop="intensity">
          <el-select v-model="form.intensity" placeholder="请选择运动强度" style="width: 100%">
            <el-option
              v-for="item in intensityOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="运动地点" prop="location">
          <el-input v-model="form.location" placeholder="请输入运动地点" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">
          {{ isEditing ? '保存' : '创建' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.fitness-records {
  padding: 20px;
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    .title-stats {
      display: flex;
      align-items: center;
      gap: 20px;
      
      h2 {
        margin: 0;
        color: #303133;
      }
      
      .stats {
        display: flex;
        gap: 10px;
      }
    }
  }

  .query-form {
    margin-bottom: 20px;
    padding: 20px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  }
  
  .records-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
    
    .record-card {
      transition: transform 0.3s;
      
      &:hover {
        transform: translateY(-5px);
      }
      
      .record-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        
        .date-info {
          .date {
            font-weight: bold;
            color: #303133;
          }
        }
      }
      
      .record-content {
        .exercise-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          
          .exercise-type {
            display: flex;
            align-items: center;
            gap: 5px;
          }
          
          .stats {
            display: flex;
            gap: 15px;
            align-items: center;
            
            .stat-item {
              color: #606266;
              font-size: 14px;
              display: flex;
              align-items: center;
              gap: 4px;
            }
          }
        }
        
        .location {
          color: #606266;
          font-size: 14px;
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}

.el-dialog {
  .el-select {
    width: 100%;
  }
}
</style>
