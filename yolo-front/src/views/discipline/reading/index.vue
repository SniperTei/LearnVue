<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'

// 阅读记录数据结构
const readingRecords = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增记录')
const isEditing = ref(false)
const editingIndex = ref(-1)

// 表单数据
const form = ref({
  date: '',
  bookName: '',
  pages: '',
  duration: '',
  notes: ''
})

// 表单规则
const rules = {
  date: [{ required: true, message: '请选择日期', trigger: 'change' }],
  bookName: [{ required: true, message: '请输入书名', trigger: 'blur' }],
  pages: [{ required: true, message: '请输入阅读页数', trigger: 'blur' }],
  duration: [{ required: true, message: '请输入阅读时长', trigger: 'blur' }]
}

// 统计数据
const statistics = computed(() => {
  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()
  
  return {
    total: readingRecords.value.length,
    thisMonth: readingRecords.value.filter(record => {
      const recordDate = new Date(record.date)
      return recordDate.getMonth() === thisMonth && recordDate.getFullYear() === thisYear
    }).length,
    totalPages: readingRecords.value.reduce((sum, record) => sum + Number(record.pages), 0),
    totalDuration: readingRecords.value.reduce((sum, record) => {
      const [hours, minutes] = record.duration.split(':').map(Number)
      return sum + hours * 60 + minutes
    }, 0)
  }
})

// 格式化阅读时长
const formatDuration = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours}小时${minutes}分钟`
}

// 从 localStorage 加载数据
onMounted(() => {
  const savedRecords = localStorage.getItem('readingRecords')
  if (savedRecords) {
    readingRecords.value = JSON.parse(savedRecords)
  }
})

// 保存数据到 localStorage
const saveToLocalStorage = () => {
  localStorage.setItem('readingRecords', JSON.stringify(readingRecords.value))
}

// 打开新增对话框
const openAddDialog = () => {
  dialogTitle.value = '新增记录'
  isEditing.value = false
  form.value = {
    date: new Date().toISOString().split('T')[0],
    bookName: '',
    pages: '',
    duration: '',
    notes: ''
  }
  dialogVisible.value = true
}

// 打开编辑对话框
const openEditDialog = (index) => {
  dialogTitle.value = '编辑记录'
  isEditing.value = true
  editingIndex.value = index
  const record = readingRecords.value[index]
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
    readingRecords.value.splice(index, 1)
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
        readingRecords.value[editingIndex.value] = { ...form.value }
        ElMessage.success('修改成功')
      } else {
        readingRecords.value.unshift({ ...form.value })
        ElMessage.success('添加成功')
      }
      saveToLocalStorage()
      dialogVisible.value = false
    }
  })
}
</script>

<template>
  <div class="reading-records">
    <div class="page-header">
      <div class="title-stats">
        <h2>阅读记录</h2>
        <div class="stats">
          <el-tag type="info">总记录: {{ statistics.total }}</el-tag>
          <el-tag type="success">本月记录: {{ statistics.thisMonth }}</el-tag>
          <el-tag type="warning">总页数: {{ statistics.totalPages }}</el-tag>
          <el-tag type="danger">总时长: {{ formatDuration(statistics.totalDuration) }}</el-tag>
        </div>
      </div>
      <el-button type="primary" @click="openAddDialog">
        <el-icon><Plus /></el-icon>新增记录
      </el-button>
    </div>

    <!-- 记录列表 -->
    <div class="records-list">
      <el-empty v-if="readingRecords.length === 0" description="暂无记录" />
      <el-card v-else v-for="(record, index) in readingRecords" :key="index" class="record-card">
        <div class="record-header">
          <div class="date">{{ record.date }}</div>
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
          <div class="book-info">
            <font-awesome-icon icon="fa-solid fa-book" />
            <span class="book-name">{{ record.bookName }}</span>
          </div>
          <div class="reading-stats">
            <el-tag type="success">{{ record.pages }} 页</el-tag>
            <el-tag type="warning">{{ record.duration }}</el-tag>
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
        
        <el-form-item label="书名" prop="bookName">
          <el-input v-model="form.bookName" placeholder="输入书名" />
        </el-form-item>
        
        <el-form-item label="阅读页数" prop="pages">
          <el-input-number
            v-model="form.pages"
            :min="1"
            :max="9999"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="阅读时长" prop="duration">
          <el-time-picker
            v-model="form.duration"
            format="HH:mm"
            value-format="HH:mm"
            placeholder="选择阅读时长"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="读书感想" prop="notes">
          <el-input
            v-model="form.notes"
            type="textarea"
            rows="3"
            placeholder="记录一下读书感想..."
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
.reading-records {
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
        
        .date {
          font-weight: bold;
          color: #303133;
        }
      }
      
      .record-content {
        .book-info {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          
          .svg-inline--fa {
            color: #409EFF;
            margin-right: 8px;
          }
          
          .book-name {
            font-weight: 500;
            color: #303133;
          }
        }
        
        .reading-stats {
          display: flex;
          gap: 10px;
          margin-bottom: 8px;
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
</style>
