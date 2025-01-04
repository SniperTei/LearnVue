<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { createDrink, getDrinkList, updateDrink, deleteDrink } from '@/api/drinkAPI'

// 饮酒记录数据
const drinkingRecords = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增记录')
const isEditing = ref(false)
const editingId = ref(null)
const formRef = ref(null)

// 表单数据
const form = ref({
  drinkName: '',
  alcoholType: '',
  unit: '瓶',
  drinkTime: '',
  reason: ''
})

// 表单规则
const rules = {
  drinkName: [{ required: true, message: '请输入饮品名称', trigger: 'blur' }],
  alcoholType: [{ required: true, message: '请选择酒类', trigger: 'change' }],
  drinkTime: [{ required: true, message: '请选择饮酒时间', trigger: 'change' }],
  unit: [{ required: true, message: '请输入单位', trigger: 'blur' }]
}

// 常见酒类选项
const alcoholTypes = [
  { label: '啤酒', value: '啤酒', color: '#F7B733' },
  { label: '红葡萄酒', value: '红葡萄酒', color: '#C0392B' },
  { label: '白葡萄酒', value: '白葡萄酒', color: '#F1C40F' },
  { label: '威士忌', value: '威士忌', color: '#D35400' },
  { label: '伏特加', value: '伏特加', color: '#3498DB' },
  { label: '白酒', value: '白酒', color: '#ECF0F1' },
  { label: '清酒', value: '清酒', color: '#BDC3C7' }
]

// 获取酒类颜色
const getAlcoholTypeColor = (type) => {
  const alcoholType = alcoholTypes.find(item => item.value === type)
  return alcoholType ? alcoholType.color : '#95A5A6'
}

// 统计数据
const statistics = computed(() => {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))
  
  return {
    total: drinkingRecords.value.length,
    thisMonth: drinkingRecords.value.filter(record => {
      const recordDate = new Date(record.drinkTime)
      return recordDate >= thirtyDaysAgo
    }).length
  }
})

// 加载数据
const loadDrinkingRecords = async () => {
  try {
    const response = await getDrinkList()
    if (response.code === '000000') {
      drinkingRecords.value = response.data
    } else {
      ElMessage.error(response.msg || '获取记录失败')
    }
  } catch (error) {
    console.error('获取记录失败:', error)
    ElMessage.error('获取记录失败，请重试')
  }
}

// 初始化加载数据
onMounted(() => {
  loadDrinkingRecords()
})

// 打开新增对话框
const openAddDialog = () => {
  dialogTitle.value = '新增记录'
  isEditing.value = false
  editingId.value = null
  form.value = {
    drinkName: '',
    alcoholType: '',
    unit: '瓶',
    drinkTime: new Date().toISOString().slice(0, 16),
    reason: ''
  }
  dialogVisible.value = true
}

// 打开编辑对话框
const openEditDialog = (record) => {
  dialogTitle.value = '编辑记录'
  isEditing.value = true
  editingId.value = record._id
  form.value = {
    drinkName: record.drinkName,
    alcoholType: record.alcoholType,
    unit: record.unit,
    drinkTime: record.drinkTime.slice(0, 16),
    reason: record.reason
  }
  dialogVisible.value = true
}

// 删除记录
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这条记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    console.log('正在删除记录:', id)
    const response = await deleteDrink(id)
    console.log('删除响应:', response)
    
    if (response?.code === '000000') {
      ElMessage.success('删除成功')
      await loadDrinkingRecords()
    } else {
      ElMessage.error(response?.msg || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error(error.response?.data?.msg || '删除失败，请重试')
    }
  }
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) {
    console.error('表单引用不存在')
    return
  }
  
  try {
    // 先进行表单验证
    await formRef.value.validate()
    
    const data = {
      drinkName: form.value.drinkName,
      alcoholType: form.value.alcoholType,
      unit: form.value.unit,
      drinkTime: new Date(form.value.drinkTime).toISOString(),
      reason: form.value.reason
    }
    
    console.log('提交的数据:', data)
    
    let response
    if (isEditing.value) {
      response = await updateDrink(editingId.value, data)
    } else {
      response = await createDrink(data)
    }
    
    console.log('API响应:', response)
    
    if (response.code === '000000') {
      ElMessage.success(isEditing.value ? '修改成功' : '添加成功')
      dialogVisible.value = false
      loadDrinkingRecords()
    } else {
      ElMessage.error(response.msg || (isEditing.value ? '修改失败' : '添加失败'))
    }
  } catch (error) {
    console.error('提交表单时发生错误:', error)
    if (error.message) {
      ElMessage.error(error.response?.data?.msg || (isEditing.value ? '修改失败，请重试' : '添加失败，请重试'))
    }
  }
}
</script>

<template>
  <div class="drinking-records">
    <div class="page-header">
      <div class="title-stats">
        <h2>饮酒记录</h2>
        <div class="stats">
          <el-tag type="info">总记录: {{ statistics.total }}</el-tag>
          <el-tag type="success">本月记录: {{ statistics.thisMonth }}</el-tag>
        </div>
      </div>
      <el-button type="primary" @click="openAddDialog">
        <el-icon><Plus /></el-icon>新增记录
      </el-button>
    </div>

    <!-- 记录列表 -->
    <div class="records-list">
      <el-empty v-if="drinkingRecords.length === 0" description="暂无记录" />
      <el-card v-else v-for="record in drinkingRecords" :key="record.id" class="record-card">
        <div class="record-header">
          <div class="date-info">
            <span class="date">{{ new Date(record.drinkTime).toLocaleString() }}</span>
          </div>
          <div class="actions">
            <el-button type="primary" link @click="openEditDialog(record)">
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button type="danger" link @click="handleDelete(record._id)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
        <div class="record-content">
          <div class="drink-info">
            <el-tag :color="getAlcoholTypeColor(record.alcoholType)" effect="dark">
              <font-awesome-icon icon="fa-solid fa-wine-glass" />
              {{ record.alcoholType }}
            </el-tag>
            <span class="drink-name">{{ record.drinkName }}</span>
            <span class="unit">{{ record.unit }}</span>
          </div>
          <div v-if="record.reason" class="reason">
            原因：{{ record.reason }}
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
        <el-form-item label="饮品名称" prop="drinkName">
          <el-input v-model="form.drinkName" placeholder="请输入饮品名称" />
        </el-form-item>
        
        <el-form-item label="酒类" prop="alcoholType">
          <el-select v-model="form.alcoholType" placeholder="请选择酒类" style="width: 100%">
            <el-option
              v-for="type in alcoholTypes"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入单位" />
        </el-form-item>
        
        <el-form-item label="饮酒时间" prop="drinkTime">
          <el-date-picker
            v-model="form.drinkTime"
            type="datetime"
            placeholder="请选择饮酒时间"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="原因" prop="reason">
          <el-input
            v-model="form.reason"
            type="textarea"
            placeholder="请输入饮酒原因"
            :rows="3"
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

<style lang="scss" scoped>
.drinking-records {
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
  
  .records-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    
    .record-card {
      .record-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        
        .date-info {
          .date {
            font-size: 14px;
            color: #606266;
          }
        }
      }
      
      .record-content {
        .drink-info {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
          
          .drink-name {
            font-size: 16px;
            font-weight: 500;
          }
          
          .unit {
            color: #606266;
          }
        }
        
        .reason {
          color: #606266;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
