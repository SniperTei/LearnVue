<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'

// 饮酒记录数据结构
const drinkingRecords = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增记录')
const isEditing = ref(false)
const editingIndex = ref(-1)

// 表单数据
const form = ref({
  date: '',
  wine: '',
  amount: '',
  mood: '',
  notes: ''
})

// 表单规则
const rules = {
  date: [{ required: true, message: '请选择日期', trigger: 'change' }],
  wine: [{ required: true, message: '请输入酒名', trigger: 'blur' }],
  amount: [{ required: true, message: '请输入饮酒量', trigger: 'blur' }]
}

// 心情选项（扩展）
const moodOptions = [
  { label: '开心', value: '开心', icon: '😊', color: '#67C23A' },
  { label: '放松', value: '放松', icon: '😌', color: '#409EFF' },
  { label: '平静', value: '平静', icon: '😐', color: '#909399' },
  { label: '疲惫', value: '疲惫', icon: '😫', color: '#E6A23C' },
  { label: '压力', value: '压力', icon: '😰', color: '#F56C6C' },
  { label: '兴奋', value: '兴奋', icon: '🤩', color: '#8E44AD' },
  { label: '社交', value: '社交', icon: '🤝', color: '#3498DB' },
  { label: '庆祝', value: '庆祝', icon: '🎉', color: '#E74C3C' },
  { label: '无聊', value: '无聊', icon: '🥱', color: '#95A5A6' },
  { label: '失落', value: '失落', icon: '😢', color: '#34495E' }
]

// 常见酒类选项（带颜色）
const wineTypes = [
  { name: '啤酒', color: '#F7B733' },
  { name: '红葡萄酒', color: '#C0392B' },
  { name: '白葡萄酒', color: '#F1C40F' },
  { name: '威士忌', color: '#D35400' },
  { name: '伏特加', color: '#3498DB' },
  { name: '白酒', color: '#ECF0F1' },
  { name: '清酒', color: '#BDC3C7' },
  { name: '其他', color: '#95A5A6' }
]

// 获取酒类颜色
const getWineColor = (wineName) => {
  const wineType = wineTypes.find(type => type.name === wineName)
  return wineType ? wineType.color : '#95A5A6'
}

// 统计数据
const statistics = computed(() => {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))
  
  return {
    total: drinkingRecords.value.length,
    thisMonth: drinkingRecords.value.filter(record => {
      const recordDate = new Date(record.date)
      return recordDate >= thirtyDaysAgo
    }).length,
    byType: Object.fromEntries(
      wineTypes.map(type => [
        type.name,
        drinkingRecords.value.filter(record => record.wine === type.name).length
      ])
    ),
    byMood: Object.fromEntries(
      moodOptions.map(mood => [
        mood.value,
        drinkingRecords.value.filter(record => record.mood === mood.value).length
      ])
    )
  }
})

// 从 localStorage 加载数据
onMounted(() => {
  const savedRecords = localStorage.getItem('drinkingRecords')
  if (savedRecords) {
    drinkingRecords.value = JSON.parse(savedRecords)
  }
})

// 保存数据到 localStorage
const saveToLocalStorage = () => {
  localStorage.setItem('drinkingRecords', JSON.stringify(drinkingRecords.value))
}

// 打开新增对话框
const openAddDialog = () => {
  dialogTitle.value = '新增记录'
  isEditing.value = false
  form.value = {
    date: new Date().toISOString().split('T')[0],
    wine: '',
    amount: '',
    mood: '',
    notes: ''
  }
  dialogVisible.value = true
}

// 打开编辑对话框
const openEditDialog = (index) => {
  dialogTitle.value = '编辑记录'
  isEditing.value = true
  editingIndex.value = index
  const record = drinkingRecords.value[index]
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
    drinkingRecords.value.splice(index, 1)
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
        drinkingRecords.value[editingIndex.value] = { ...form.value }
        ElMessage.success('修改成功')
      } else {
        drinkingRecords.value.unshift({ ...form.value })
        ElMessage.success('添加成功')
      }
      saveToLocalStorage()
      dialogVisible.value = false
    }
  })
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
      <el-card v-else v-for="(record, index) in drinkingRecords" :key="index" class="record-card">
        <div class="record-header">
          <div class="date-mood">
            <span class="date">{{ record.date }}</span>
            <span v-if="record.mood" class="mood" :style="{ color: moodOptions.find(m => m.value === record.mood)?.color }">
              {{ moodOptions.find(m => m.value === record.mood)?.icon }}
              {{ record.mood }}
            </span>
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
          <div class="wine-info">
            <el-tag :color="getWineColor(record.wine)" effect="dark">
              <font-awesome-icon icon="fa-solid fa-wine-glass" />
              {{ record.wine }}
            </el-tag>
            <span class="amount">{{ record.amount }}</span>
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
        label-width="80px"
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
        
        <el-form-item label="酒名" prop="wine">
          <el-select
            v-model="form.wine"
            filterable
            allow-create
            placeholder="选择或输入酒名"
            style="width: 100%"
          >
            <el-option
              v-for="type in wineTypes"
              :key="type.name"
              :label="type.name"
              :value="type.name"
            >
              <el-tag :color="type.color" effect="dark">{{ type.name }}</el-tag>
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="饮酒量" prop="amount">
          <el-input v-model="form.amount" placeholder="例如：2瓶、300ml" />
        </el-form-item>
        
        <el-form-item label="心情" prop="mood">
          <el-select v-model="form.mood" placeholder="选择心情" style="width: 100%">
            <el-option
              v-for="option in moodOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            >
              <span :style="{ color: option.color }">
                {{ option.icon }} {{ option.label }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="备注" prop="notes">
          <el-input
            v-model="form.notes"
            type="textarea"
            rows="3"
            placeholder="记录一下此刻的想法..."
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
        
        .date-mood {
          .date {
            font-weight: bold;
            color: #303133;
          }
          
          .mood {
            margin-left: 10px;
          }
        }
      }
      
      .record-content {
        .wine-info {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          
          .amount {
            margin-left: 10px;
            color: #606266;
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
