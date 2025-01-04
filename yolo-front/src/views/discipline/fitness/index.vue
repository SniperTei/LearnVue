<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'

// 健身记录数据结构
const fitnessRecords = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增记录')
const isEditing = ref(false)
const editingIndex = ref(-1)

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

// 表单数据
const form = ref({
  date: '',
  exerciseType: '',
  duration: '',
  calories: '',
  notes: ''
})

// 表单规则
const rules = {
  date: [{ required: true, message: '请选择日期', trigger: 'change' }],
  exerciseType: [{ required: true, message: '请选择运动类型', trigger: 'change' }],
  duration: [{ required: true, message: '请输入运动时长', trigger: 'blur' }],
  calories: [{ required: true, message: '请输入消耗卡路里', trigger: 'blur' }]
}

// 从 localStorage 加载数据
onMounted(() => {
  const savedRecords = localStorage.getItem('fitnessRecords')
  if (savedRecords) {
    fitnessRecords.value = JSON.parse(savedRecords)
  }
})

// 保存数据到 localStorage
const saveToLocalStorage = () => {
  localStorage.setItem('fitnessRecords', JSON.stringify(fitnessRecords.value))
}

// 打开新增对话框
const openAddDialog = () => {
  dialogTitle.value = '新增记录'
  isEditing.value = false
  form.value = {
    date: new Date().toISOString().split('T')[0],
    exerciseType: '',
    duration: '',
    calories: '',
    notes: ''
  }
  dialogVisible.value = true
}

// 打开编辑对话框
const openEditDialog = (index) => {
  dialogTitle.value = '编辑记录'
  isEditing.value = true
  editingIndex.value = index
  const record = fitnessRecords.value[index]
  form.value = { ...record }
  dialogVisible.value = true
}

// 删除记录
const deleteRecord = (index) => {
  ElMessageBox.confirm('确定要删除这条记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    fitnessRecords.value.splice(index, 1)
    saveToLocalStorage()
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 提交表单
const submitForm = async (formEl) => {
  if (!formEl) return
  
  await formEl.validate((valid) => {
    if (valid) {
      if (isEditing.value) {
        fitnessRecords.value[editingIndex.value] = { ...form.value }
        ElMessage.success('修改成功')
      } else {
        fitnessRecords.value.unshift({ ...form.value })
        ElMessage.success('添加成功')
      }
      saveToLocalStorage()
      dialogVisible.value = false
    }
  })
}

// 统计数据
const statistics = computed(() => {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))
  
  return {
    total: fitnessRecords.value.length,
    thisMonth: fitnessRecords.value.filter(record => {
      const recordDate = new Date(record.date)
      return recordDate >= thirtyDaysAgo
    }).length,
    totalDuration: fitnessRecords.value.reduce((sum, record) => sum + parseInt(record.duration || 0), 0),
    totalCalories: fitnessRecords.value.reduce((sum, record) => sum + parseInt(record.calories || 0), 0)
  }
})

// 获取运动类型图标
const getExerciseIcon = (type) => {
  return exerciseTypes.find(t => t.value === type)?.icon || '🎯'
}
</script>

<template>
  <div class="fitness-records">
    <div class="page-header">
      <div class="title-stats">
        <h2>健身记录</h2>
        <div class="stats">
          <el-tag type="info">总记录: {{ statistics.total }}</el-tag>
          <el-tag type="success">本月记录: {{ statistics.thisMonth }}</el-tag>
          <el-tag type="warning">总时长: {{ statistics.totalDuration }}分钟</el-tag>
          <el-tag type="danger">总消耗: {{ statistics.totalCalories }}卡路里</el-tag>
        </div>
      </div>
      <el-button type="primary" @click="openAddDialog">
        <el-icon><Plus /></el-icon>新增记录
      </el-button>
    </div>

    <!-- 记录列表 -->
    <div class="records-list">
      <el-empty v-if="fitnessRecords.length === 0" description="暂无记录" />
      <el-card v-else v-for="(record, index) in fitnessRecords" :key="index" class="record-card">
        <div class="record-header">
          <div class="date-info">
            <span class="date">{{ record.date }}</span>
          </div>
          <div class="actions">
            <el-button type="primary" link @click="openEditDialog(index)">
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button type="danger" link @click="deleteRecord(index)">
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
              <span class="stat-item">
                <font-awesome-icon icon="fa-solid fa-clock" />
                {{ record.duration }} 分钟
              </span>
              <span class="stat-item">
                <font-awesome-icon icon="fa-solid fa-fire" />
                {{ record.calories }} 卡路里
              </span>
            </div>
          </div>
          <div v-if="record.notes" class="notes">
            <font-awesome-icon icon="fa-solid fa-comment" />
            {{ record.notes }}
          </div>
        </div>
      </el-card>
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
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        
        <el-form-item label="运动类型" prop="exerciseType">
          <el-select
            v-model="form.exerciseType"
            placeholder="选择运动类型"
            style="width: 100%"
          >
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
        
        <el-form-item label="运动时长" prop="duration">
          <el-input-number
            v-model="form.duration"
            :min="1"
            placeholder="输入运动时长（分钟）"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="消耗卡路里" prop="calories">
          <el-input-number
            v-model="form.calories"
            :min="1"
            placeholder="输入消耗卡路里"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="备注" prop="notes">
          <el-input
            v-model="form.notes"
            type="textarea"
            rows="3"
            placeholder="记录运动感受..."
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm(formRef)">
          {{ isEditing ? '保存' : '添加' }}
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
  
  .records-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    
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
            
            .stat-item {
              color: #606266;
              font-size: 14px;
              
              .svg-inline--fa {
                margin-right: 5px;
              }
            }
          }
        }
        
        .notes {
          color: #606266;
          font-size: 14px;
          margin-top: 8px;
          
          .svg-inline--fa {
            margin-right: 6px;
          }
        }
      }
    }
  }
}

.el-dialog {
  .el-select {
    width: 100%;
  }
}

:deep(.el-tag) {
  .svg-inline--fa {
    margin-right: 5px;
  }
}
</style>
