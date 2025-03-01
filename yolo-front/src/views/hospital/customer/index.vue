<template>
  <div class="customer-container">
    <div class="search-box">
      <el-form :inline="true">
        <el-form-item label="客户姓名">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入客户姓名"
            clearable
            @keyup.enter="handleSearch"
          />
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
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="medicalRecordNumber" label="病历号" width="150" />
      <el-table-column prop="lastPurchaseDate" label="最近消费日期" width="150" />
      <el-table-column prop="avatarUrl" label="头像" width="100">
        <template #default="{ row }">
          <el-avatar :size="40" :src="row.avatarUrl" />
        </template>
      </el-table-column>
      <el-table-column prop="createdBy.username" label="创建人" width="120" />
      <el-table-column prop="remarks" label="备注" />
      <el-table-column label="操作" width="150" fixed="right">
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
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="病历号" prop="medicalRecordNumber">
          <el-input v-model="formData.medicalRecordNumber" placeholder="请输入病历号" />
        </el-form-item>
        <el-form-item label="头像" prop="avatarUrl">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="formData.avatarUrl" :src="formData.avatarUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="最近消费" prop="lastPurchaseDate">
          <el-date-picker
            v-model="formData.lastPurchaseDate"
            type="date"
            placeholder="请选择最近消费日期"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model="formData.remarks"
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
import { getCustomerList, createCustomer, updateCustomer, deleteCustomer } from '@/api/customerAPI'

// 搜索表单
const searchForm = reactive({
  name: ''
})

// 表格数据
const loading = ref(false)
const tableData = ref([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// 表单数据
const formRef = ref()
const modalVisible = ref(false)
const modalTitle = ref('')
const formData = reactive({
  name: '',
  avatarUrl: '',
  medicalRecordNumber: '',
  lastPurchaseDate: '',
  remarks: ''
})

// 表单校验规则
const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  medicalRecordNumber: [{ required: true, message: '请输入病历号', trigger: 'blur' }]
}

// 获取客户列表
const fetchCustomerList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.current,
      limit: pagination.pageSize,
      name: searchForm.name
    }
    const res = await getCustomerList(params)
    if (res.code === '000000') {
      tableData.value = res.data.customers
      pagination.total = res.data.pagination.total
    }
  } catch (error) {
    console.error('获取客户列表失败:', error)
    ElMessage.error('获取客户列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  fetchCustomerList()
}

// 重置
const handleReset = () => {
  searchForm.name = ''
  pagination.current = 1
  fetchCustomerList()
}

// 分页大小变化
const handleSizeChange = (val) => {
  pagination.pageSize = val
  fetchCustomerList()
}

// 当前页变化
const handleCurrentChange = (val) => {
  pagination.current = val
  fetchCustomerList()
}

// 新增客户
const handleAdd = () => {
  modalTitle.value = '新增客户'
  Object.assign(formData, {
    name: '',
    avatarUrl: '',
    medicalRecordNumber: '',
    lastPurchaseDate: '',
    remarks: ''
  })
  modalVisible.value = true
}

// 编辑客户
const handleEdit = (row) => {
  modalTitle.value = '编辑客户'
  Object.assign(formData, row)
  modalVisible.value = true
}

// 删除客户
const handleDelete = async (row) => {
  try {
    const res = await deleteCustomer(row.customerId)
    if (res.code === '000000') {
      ElMessage.success('删除成功')
      fetchCustomerList()
    }
  } catch (error) {
    console.error('删除客户失败:', error)
    ElMessage.error('删除客户失败')
  }
}

// 弹窗确认
const handleModalOk = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        let res
        if (modalTitle.value === '新增客户') {
          res = await createCustomer(formData)
        } else {
          res = await updateCustomer(formData)
        }
        if (res.code === '000000') {
          ElMessage.success(`${modalTitle.value}成功`)
          modalVisible.value = false
          fetchCustomerList()
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

// 添加头像上传处理函数
const handleAvatarSuccess = (res) => {
  formData.avatarUrl = res.data.url
}

onMounted(() => {
  fetchCustomerList()
})
</script>

<style lang="scss" scoped>
.customer-container {
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

  .avatar-uploader {
    :deep(.el-upload) {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);

      &:hover {
        border-color: var(--el-color-primary);
      }
    }
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
  }

  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
}
</style>
