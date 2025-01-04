<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const queryParams = ref({
  username: '',
  status: '',
  page: 1,
  pageSize: 10
})

const userList = ref([
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    role: '管理员',
    status: '启用',
    lastLogin: '2023-12-25 12:00:00'
  },
  {
    id: 2,
    username: 'user',
    email: 'user@example.com',
    role: '普通用户',
    status: '启用',
    lastLogin: '2023-12-24 15:30:00'
  }
])
const total = ref(2)

const handleQuery = () => {
  // TODO: 调用查询接口
  ElMessage.success('查询成功')
}

const handleAdd = () => {
  ElMessage.info('新增用户功能开发中...')
}

const handleEdit = (row) => {
  ElMessage.info('编辑用户功能开发中...')
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确认删除用户 ${row.username} 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用删除接口
    ElMessage.success('删除成功')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const handlePageChange = (page) => {
  queryParams.value.page = page
  handleQuery()
}
</script>

<template>
  <div class="users-container">
    <div class="filter-container">
      <el-form :inline="true" :model="queryParams" class="form-inline">
        <el-form-item label="用户名">
          <el-input v-model="queryParams.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option label="启用" value="enabled" />
            <el-option label="禁用" value="disabled" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button type="success" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="userList" border style="width: 100%">
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="role" label="角色" width="120" />
      <el-table-column prop="status" label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="row.status === '启用' ? 'success' : 'danger'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="lastLogin" label="最后登录时间" width="180" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      :current-page="queryParams.page"
      :page-size="queryParams.pageSize"
      :total="total"
      layout="total, prev, pager, next"
      @current-change="handlePageChange"
    />
  </div>
</template>

<style lang="scss" scoped>
.users-container {
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  
  .filter-container {
    margin-bottom: 20px;
  }
  
  .pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
