<template>
  <div class="drinking-container">
    <div class="page-header">
      <div class="title-stats">
        <h2>饮酒记录</h2>
        <div class="stats">
          <el-tag type="info">本月记录: {{ monthlyRecords.length }}</el-tag>
        </div>
      </div>
      <el-button type="primary" @click="router.push('/discipline/drinking/add')">
        <el-icon><Plus /></el-icon>新增记录
      </el-button>
    </div>

    <!-- 日历视图 -->
    <div class="calendar-view">
      <el-calendar v-model="currentDate">
        <template #header="{ date }">
          <div class="calendar-header">
            <el-button-group>
              <el-button size="small" @click="selectPrevMonth">
                <el-icon><ArrowLeft /></el-icon>
              </el-button>
              <el-button size="small" @click="selectNextMonth">
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </el-button-group>
            <span class="current-month">{{ formatMonth(date) }}</span>
            <el-button size="small" @click="currentDate = new Date()">
              今天
            </el-button>
          </div>
        </template>
        
        <template #date-cell="{ data }">
          <div class="calendar-cell" :class="{ 'has-records': hasRecords(data) }">
            <div class="date-number">{{ data.day.split('-')[2] }}</div>
            <div class="records-list" v-if="hasRecords(data)">
              <div 
                v-for="record in getRecordsByDate(data)" 
                :key="record._id"
                class="record-item"
                @click.stop="openEditDialog(record)"
              >
                <el-tooltip 
                  :content="formatRecordTooltip(record)" 
                  placement="top" 
                  :show-after="200"
                >
                  <div class="record-content">
                    <span class="drink-name">{{ record.alcoholId.name }}</span>
                    <span class="drink-amount">{{ record.amount }}{{ record.unit }}</span>
                  </div>
                </el-tooltip>
                <el-button 
                  type="danger" 
                  link 
                  size="small"
                  @click.stop="handleDelete(record._id)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </template>
      </el-calendar>
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
        <el-form-item label="酒精名称" prop="alcoholId">
          <el-select v-model="form.alcoholId" placeholder="请选择酒精名称" style="width: 100%">
            <el-option
              v-for="type in alcoholTypes"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="单位" prop="unit">
          <el-select v-model="form.unit" placeholder="请选择单位" style="width: 100%">
            <el-option label="瓶" value="瓶" />
            <el-option label="杯" value="杯" />
            <el-option label="罐" value="罐" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="数量" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入数量" />
        </el-form-item>
        
        <el-form-item label="饮酒时间" prop="drinkTime">
          <el-date-picker
            v-model="form.drinkTime"
            type="datetime"
            placeholder="请选择时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="new Date(2000, 1, 1, 20, 0, 0)"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="心情" prop="mood">
          <el-input v-model="form.mood" placeholder="请输入心情" />
        </el-form-item>
        
        <el-form-item label="场合" prop="occasion">
          <el-input v-model="form.occasion" placeholder="请输入场合" />
        </el-form-item>
        
        <el-form-item label="地点" prop="location">
          <el-input v-model="form.location" placeholder="请输入地点" />
        </el-form-item>
        
        <el-form-item label="同饮" prop="companions">
          <el-input v-model="form.companions" placeholder="请输入同饮" />
        </el-form-item>
        
        <el-form-item label="备注" prop="note">
          <el-input
            v-model="form.note"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
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

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Edit, Plus, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { createDrink, getDrinkList, updateDrink, deleteDrink } from '@/api/drinkAPI'

const router = useRouter()

// 数据
const drinkingRecords = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增记录')
const isEditing = ref(false)
const editingId = ref(null)
const formRef = ref(null)
const currentDate = ref(new Date())

// 酒精类型选项
const alcoholTypes = [
  { label: '啤酒', value: 'beer' },
  { label: '白酒', value: 'baijiu' },
  { label: '红酒', value: 'red_wine' },
  { label: '洋酒', value: 'foreign_wine' },
  { label: '清酒', value: 'sake' },
  { label: '烧酒', value: 'shochu' }
]

// 表单数据
const form = ref({
  alcoholId: '',
  unit: '瓶',
  amount: '',
  drinkTime: '',
  mood: '',
  occasion: '',
  location: '',
  companions: '',
  note: ''
})

// 表单规则
const rules = {
  alcoholId: [
    { required: true, message: '请选择酒精名称', trigger: 'change' }
  ],
  unit: [
    { required: true, message: '请选择单位', trigger: 'change' }
  ],
  amount: [
    { required: true, message: '请输入数量', trigger: 'blur' }
  ],
  drinkTime: [
    { required: true, message: '请选择时间', trigger: 'change' }
  ]
}

// 计算当月记录
const monthlyRecords = computed(() => {
  const currentMonth = currentDate.value.getMonth()
  const currentYear = currentDate.value.getFullYear()
  return drinkingRecords.value.filter(record => {
    const recordDate = new Date(record.drinkTime)
    return recordDate.getMonth() === currentMonth && 
           recordDate.getFullYear() === currentYear
  })
})

// 检查日期是否有记录
const hasRecords = (data) => {
  const date = data.day
  return drinkingRecords.value.some(record => 
    record.drinkTime.startsWith(date)
  )
}

// 获取指定日期的记录
const getRecordsByDate = (data) => {
  const date = data.day
  return drinkingRecords.value.filter(record => 
    record.drinkTime.startsWith(date)
  ).sort((a, b) => new Date(b.drinkTime) - new Date(a.drinkTime))
}

// 格式化月份显示
const formatMonth = (date) => {
  return new Date(date).toLocaleString('zh-CN', { year: 'numeric', month: 'long' })
}

// 格式化记录提示
const formatRecordTooltip = (record) => {
  const time = new Date(record.drinkTime).toLocaleString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
  return `${time}
${record.alcoholId.name} ${record.amount}${record.unit}
场合: ${record.occasion}
心情: ${record.mood}
地点: ${record.location}
${record.companions?.length ? `同饮: ${record.companions.join(', ')}` : ''}
${record.note ? `备注: ${record.note}` : ''}`
}

// 选择上个月
const selectPrevMonth = () => {
  const date = new Date(currentDate.value)
  date.setMonth(date.getMonth() - 1)
  currentDate.value = date
  loadDrinkingRecords()
}

// 选择下个月
const selectNextMonth = () => {
  const date = new Date(currentDate.value)
  date.setMonth(date.getMonth() + 1)
  currentDate.value = date
  loadDrinkingRecords()
}

// 加载饮酒记录
const loadDrinkingRecords = async () => {
  try {
    const data = await getDrinkList();
    drinkingRecords.value = data.drinks || [];
  } catch (error) {
    console.error('加载饮酒记录失败:', error);
    ElMessage.error(error.message || '加载数据失败，请重试');
  }
};

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
    
    if (isEditing.value) {
      await updateDrink(editingId.value, form.value);
      ElMessage.success('修改成功');
    } else {
      await createDrink(form.value);
      ElMessage.success('添加成功');
    }
    
    dialogVisible.value = false;
    loadDrinkingRecords();
  } catch (error) {
    console.error('提交表单失败:', error);
    ElMessage.error(error.message || '操作失败，请重试');
  }
};

// 删除记录
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这条记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    
    await deleteDrink(id);
    ElMessage.success('删除成功');
    loadDrinkingRecords();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error);
      ElMessage.error(error.message || '删除失败，请重试');
    }
  }
};

// 初始化
loadDrinkingRecords()
</script>

<style lang="scss" scoped>
.drinking-container {
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
      }
      
      .stats {
        display: flex;
        gap: 10px;
      }
    }
  }
  
  .calendar-view {
    :deep(.el-calendar) {
      --el-calendar-cell-width: 14.28571%;
      background-color: #fff;
      
      .calendar-header {
        display: flex;
        align-items: center;
        gap: 16px;
        
        .current-month {
          font-size: 16px;
          font-weight: 500;
        }
      }
      
      .calendar-cell {
        height: 120px;
        padding: 8px;
        
        &.has-records {
          background-color: var(--el-color-primary-light-9);
        }
        
        .date-number {
          font-size: 16px;
          margin-bottom: 8px;
          color: var(--el-text-color-primary);
        }
        
        .records-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-height: calc(100% - 30px);
          overflow-y: auto;
          
          .record-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 4px 8px;
            background-color: #fff;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s;
            
            &:hover {
              background-color: var(--el-color-primary-light-8);
              
              .el-button {
                opacity: 1;
              }
            }
            
            .record-content {
              display: flex;
              align-items: center;
              gap: 8px;
              flex: 1;
              min-width: 0;
              
              .drink-name {
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 12px;
                color: var(--el-text-color-primary);
              }
              
              .drink-amount {
                font-size: 12px;
                color: var(--el-text-color-secondary);
              }
            }
            
            .el-button {
              opacity: 0;
              transition: opacity 0.3s;
              padding: 2px;
            }
          }
        }
      }
      
      .el-calendar__body {
        padding: 12px;
      }
    }
  }
}
</style>
