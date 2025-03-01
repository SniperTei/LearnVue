<template>
  <div class="performance-container">
    <div class="search-box">
      <el-form :inline="true">
        <el-form-item label="客户姓名">
          <el-input
            v-model="searchForm.customerName"
            placeholder="请输入客户姓名"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="项目类型">
          <el-select
            v-model="searchForm.performanceType"
            placeholder="请选择项目类型"
            clearable
          >
            <el-option label="注射类" value="inject" />
            <el-option label="护肤类" value="skin" />
            <el-option label="手术类" value="operate" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      :data="tableData"
      v-loading="loading"
      style="width: 100%"
    >
      <el-table-column prop="customerId.name" label="客户姓名" />
      <el-table-column prop="performanceType" label="项目类型">
        <template #default="{ row }">
          {{ typeMap[row.performanceType] }}
        </template>
      </el-table-column>
      <el-table-column prop="performanceDate" label="项目日期" />
      <el-table-column prop="amount" label="消费金额" />
      <el-table-column prop="itemA" label="项目A" />
      <el-table-column prop="itemB" label="项目B" />
      <el-table-column prop="performanceRemarks" label="备注" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-popconfirm
            title="确定要删除这条记录吗?"
            @confirm="handleDelete(row)"
          >
            <template #reference>
              <el-button link type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="pagination.current"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="modalVisible"
      :title="modalTitle"
      width="650px"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="选择客户" v-if="!formData.customerId">
          <el-radio-group v-model="customerSelectType">
            <el-radio label="new">新客户</el-radio>
            <el-radio label="existing">已有客户</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 新客户信息 -->
        <template v-if="customerSelectType === 'new'">
          <el-form-item label="客户姓名" prop="name">
            <el-input v-model="formData.name" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="病历号" prop="medicalRecordNumber">
            <el-input v-model="formData.medicalRecordNumber" placeholder="请输入病历号" />
          </el-form-item>
        </template>

        <!-- 选择已有客户 -->
        <template v-if="customerSelectType === 'existing'">
          <el-form-item label="选择客户" prop="customerId">
            <el-select
              v-model="formData.customerId"
              placeholder="请选择客户"
              filterable
              :filter-method="filterCustomers"
              style="width: 100%"
            >
              <el-option
                v-for="item in customerOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </template>

        <!-- 业绩信息 -->
        <el-form-item label="项目日期" prop="performanceDate">
          <el-date-picker
            v-model="formData.performanceDate"
            type="datetime"
            placeholder="请选择项目日期"
            style="width: 100%"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="项目类型" prop="performanceType">
          <el-select v-model="formData.performanceType" placeholder="请选择项目类型">
            <el-option label="注射类" value="inject" />
            <el-option label="护肤类" value="skin" />
            <el-option label="手术类" value="operate" />
          </el-select>
        </el-form-item>
        <el-form-item label="消费金额" prop="amount">
          <el-input-number
            v-model="formData.amount"
            placeholder="请输入消费金额"
            :precision="2"
            :step="100"
            :min="0"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="项目A" prop="itemA">
          <el-input v-model="formData.itemA" placeholder="请输入项目A" />
        </el-form-item>
        <el-form-item label="项目B" prop="itemB">
          <el-input v-model="formData.itemB" placeholder="请输入项目B" />
        </el-form-item>
        <el-form-item label="备注" prop="performanceRemarks">
          <el-input
            v-model="formData.performanceRemarks"
            type="textarea"
            placeholder="请输入备注"
            :rows="4"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleModalCancel">取消</el-button>
          <el-button type="primary" @click="handleModalOk">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { getCustomerList } from '@/api/customerAPI'
import {
  getPerformanceList,
  createPerformanceWithCustomer,
  createPerformance,
  updatePerformance,
  deletePerformance
} from '@/api/performanceAPI'

const typeMap = {
  inject: '注射类',
  skin: '护肤类',
  operate: '手术类'
}

// 搜索表单
const searchForm = reactive({
  customerName: '',
  performanceType: ''
})

// 表格数据
const loading = ref(false)
const tableData = ref([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// 客户选择相关
const customerSelectType = ref('new')
const customerOptions = ref([])

// 表单数据
const formRef = ref()
const modalVisible = ref(false)
const modalTitle = ref('')
const formData = reactive({
  customerId: '',
  performanceId: '',
  name: '',
  medicalRecordNumber: '',
  performanceDate: '',
  performanceType: '',
  amount: '',
  itemA: '',
  itemB: '',
  performanceRemarks: ''
})

// 表单校验规则
const rules = {
  customerId: [{ required: true, message: '请选择客户', trigger: 'change' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  medicalRecordNumber: [{ required: true, message: '请输入病历号', trigger: 'blur' }],
  performanceDate: [{ required: true, message: '请选择项目日期', trigger: 'change' }],
  performanceType: [{ required: true, message: '请选择项目类型', trigger: 'change' }],
  amount: [{ required: true, message: '请输入消费金额', trigger: 'change' }],
  itemA: [{ required: true, message: '请输入项目A', trigger: 'blur' }]
}

// 获取业绩列表
const fetchPerformanceList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.current,
      limit: pagination.pageSize,
      customerName: searchForm.customerName,
      performanceType: searchForm.performanceType
    }
    const res = await getPerformanceList(params)
    if (res.code === '000000') {
      tableData.value = res.data.performances
      pagination.total = res.data.pagination.total
    }
  } catch (error) {
    console.error('获取业绩列表失败:', error)
    ElMessage.error('获取业绩列表失败')
  } finally {
    loading.value = false
  }
}

// 获取客户列表
const fetchCustomerList = async () => {
  try {
    const res = await getCustomerList({ limit: 1000 })
    if (res.code === '000000') {
      customerOptions.value = res.data.customers.map(item => ({
        label: `${item.name} (${item.medicalRecordNumber})`,
        value: item.customerId
      }))
    }
  } catch (error) {
    console.error('获取客户列表失败:', error)
    ElMessage.error('获取客户列表失败')
  }
}

// 客户搜索过滤
const filterCustomers = (query) => {
  if (query) {
    const lowercaseQuery = query.toLowerCase()
    return customerOptions.value.filter(item =>
      item.label.toLowerCase().includes(lowercaseQuery)
    )
  }
  return customerOptions.value
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  fetchPerformanceList()
}

// 重置
const handleReset = () => {
  searchForm.customerName = ''
  searchForm.performanceType = ''
  pagination.current = 1
  fetchPerformanceList()
}

// 分页大小变化
const handleSizeChange = (val) => {
  pagination.pageSize = val
  fetchPerformanceList()
}

// 当前页变化
const handleCurrentChange = (val) => {
  pagination.current = val
  fetchPerformanceList()
}

// 新增业绩
const handleAdd = () => {
  modalTitle.value = '新增业绩'
  customerSelectType.value = 'new'
  Object.assign(formData, {
    customerId: '',
    performanceId: '',
    name: '',
    medicalRecordNumber: '',
    performanceDate: '',
    performanceType: '',
    amount: '',
    itemA: '',
    itemB: '',
    performanceRemarks: ''
  })
  modalVisible.value = true
}

// 编辑业绩
const handleEdit = (row) => {
  modalTitle.value = '编辑业绩'
  customerSelectType.value = 'existing'
  Object.assign(formData, {
    ...row,
    customerId: row.customerId,
    performanceId: row.performanceId
  })
  modalVisible.value = true
}

// 删除业绩
const handleDelete = async (row) => {
  try {
    console.log('row.performanceId', row.performanceId)
    const res = await deletePerformance(row.performanceId)
    if (res.code === '000000') {
      ElMessage.success('删除成功')
      fetchPerformanceList()
    }
  } catch (error) {
    console.error('删除业绩失败:', error)
    ElMessage.error('删除业绩失败')
  }
}

// 弹窗确认
const handleModalOk = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        let res
        if (modalTitle.value === '新增业绩') {
          if (customerSelectType.value === 'new') {
            res = await createPerformanceWithCustomer(formData)
          } else {
            res = await createPerformance(formData)
          }
        } else {
          res = await updatePerformance(formData)
        }

        if (res.code === '000000') {
          ElMessage.success(`${modalTitle.value}成功`)
          modalVisible.value = false
          fetchPerformanceList()
        }
      } catch (error) {
        console.error(`${modalTitle.value}失败:`, error)
        ElMessage.error(`${modalTitle.value}失败`)
      }
    }
  })
}

// 弹窗取消
const handleModalCancel = () => {
  modalVisible.value = false
  formRef.value.resetFields()
}

onMounted(() => {
  fetchPerformanceList()
  fetchCustomerList()
})
</script>

<style lang="scss" scoped>
.performance-container {
  padding: 24px;
  background: #fff;
  
  .search-box {
    margin-bottom: 24px;
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
