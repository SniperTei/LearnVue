<template>
  <div class="user-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <div class="header-actions">
            <el-input
              v-model="searchQuery"
              placeholder="搜索用户名"
              class="search-input"
              @input="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="userList"
        style="width: 100%"
      >
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="mobile" label="手机号" />
        <el-table-column prop="gender" label="性别">
          <template #default="{ row }">
            {{ row.gender === 'male' ? '男' : '女' }}
          </template>
        </el-table-column>
        <el-table-column prop="lastLoginAt" label="最后登录时间">
          <template #default="{ row }">
            {{ formatDate(row.lastLoginAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="{ row }">
            <el-button
              v-if="isAdmin"
              type="primary"
              link
              @click="handleEditMenus(row)"
            >
              菜单权限
            </el-button>
            <el-button
              type="primary"
              link
              @click="handleView(row)"
            >
              查看
            </el-button>
            <el-button
              v-if="isAdmin"
              type="primary"
              link
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="isAdmin"
              type="danger"
              link
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 用户详情对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" :disabled="dialogType === 'view'" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" :disabled="dialogType === 'view'" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="formData.mobile" :disabled="dialogType === 'view'" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="formData.gender" :disabled="dialogType === 'view'">
            <el-option label="男" value="male" />
            <el-option label="女" value="female" />
          </el-select>
        </el-form-item>
        <el-form-item label="生日" prop="birthDate">
          <el-date-picker
            v-model="formData.birthDate"
            type="date"
            :disabled="dialogType === 'view'"
          />
        </el-form-item>
        <el-form-item v-if="dialogType === 'view'" label="管理员">
          <el-tag :type="formData.isAdmin ? 'success' : 'info'">
            {{ formData.isAdmin ? '是' : '否' }}
          </el-tag>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            v-if="dialogType !== 'view'"
            type="primary"
            @click="handleSubmit"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 菜单权限对话框 -->
    <el-dialog
      v-model="menuDialogVisible"
      title="菜单权限设置"
      width="400px"
    >
      <el-form>
        <el-form-item label="管理员权限">
          <el-switch v-model="isAdminSwitch" />
        </el-form-item>
      </el-form>
      <el-tree
        ref="menuTreeRef"
        :data="menuTree"
        show-checkbox
        node-key="code"
        :props="{
          label: 'title',
          children: 'children'
        }"
        :disabled="isAdminSwitch"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="menuDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitMenus">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { 
  getUserList,
  getUserDetail,
  updateUser,
  deleteUser,
  getUserMenus,
  updateUserMenus
} from '@/api/userAPI'
import { formatDate } from '@/utils/date'

// Store
const userStore = useUserStore()
const isAdmin = computed(() => userStore.isAdmin)

// Data
const loading = ref(false)
const userList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchQuery = ref('')

// Dialog
const dialogVisible = ref(false)
const dialogType = ref('view') // view, edit
const formRef = ref(null)
const formData = ref({
  username: '',
  email: '',
  mobile: '',
  gender: 'male',
  birthDate: '',
  isAdmin: false
})

// Menu Dialog
const menuDialogVisible = ref(false)
const menuTreeRef = ref(null)
const menuTree = ref([])
const currentUserId = ref(null)
const isAdminSwitch = ref(false)

// Form Rules
const formRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  birthDate: [
    { required: true, message: '请选择生日', trigger: 'change' }
  ]
}

// Computed
const dialogTitle = computed(() => {
  switch (dialogType.value) {
    case 'view':
      return '用户详情'
    case 'edit':
      return '编辑用户'
    default:
      return ''
  }
})

// Methods
const fetchUsers = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: pageSize.value,
      username: searchQuery.value || undefined
    }
    const res = await getUserList(params)
    if (res.code === '000000' && res.data) {
      userList.value = res.data.users
      total.value = res.data.pagination.total
    } else {
      ElMessage.error(res.msg || '获取用户列表失败')
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchUsers()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  fetchUsers()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchUsers()
}

const handleView = async (row) => {
  dialogType.value = 'view'
  try {
    const res = await getUserDetail(row.userId)
    if (res.code === '000000' && res.data) {
      formData.value = { ...res.data }
      dialogVisible.value = true
    } else {
      ElMessage.error(res.msg || '获取用户详情失败')
    }
  } catch (error) {
    console.error('Error fetching user detail:', error)
    ElMessage.error('获取用户详情失败')
  }
}

const handleEdit = async (row) => {
  dialogType.value = 'edit'
  try {
    const res = await getUserDetail(row.userId)
    if (res.code === '000000' && res.data) {
      formData.value = { ...res.data }
      dialogVisible.value = true
    } else {
      ElMessage.error(res.msg || '获取用户详情失败')
    }
  } catch (error) {
    console.error('Error fetching user detail:', error)
    ElMessage.error('获取用户详情失败')
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该用户吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const res = await deleteUser(row.userId)
      if (res.code === '000000') {
        ElMessage.success('删除成功')
        fetchUsers()
      } else {
        ElMessage.error(res.msg || '删除失败')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    const res = await updateUser(formData.value.id, formData.value)
    if (res.code === '000000') {
      ElMessage.success('更新成功')
      dialogVisible.value = false
      fetchUsers()
    } else {
      ElMessage.error(res.msg || '更新失败')
    }
  } catch (error) {
    console.error('Error updating user:', error)
    ElMessage.error('更新失败')
  }
}

const handleEditMenus = async (row) => {
  currentUserId.value = row.userId
  try {
    const res = await getUserMenus(row.userId)
    if (res.code === '000000' && res.data) {
      menuTree.value = res.data.menus || []
      const checkedMenus = res.data.menuCodes || []
      isAdminSwitch.value = res.data.isAdmin || false
      menuDialogVisible.value = true
      // 等待DOM更新后设置选中状态
      await nextTick()
      menuTreeRef.value?.setCheckedKeys(checkedMenus)
    } else {
      ElMessage.error(res.msg || '获取菜单权限失败')
    }
  } catch (error) {
    console.error('Error fetching user menus:', error)
    ElMessage.error('获取菜单权限失败')
  }
}

const handleSubmitMenus = async () => {
  if (!menuTreeRef.value || !currentUserId.value) return
  
  try {
    const checkedKeys = isAdminSwitch.value ? [] : menuTreeRef.value.getCheckedKeys()
    const res = await updateUserMenus(currentUserId.value, checkedKeys, isAdminSwitch.value)
    if (res.code === '000000') {
      ElMessage.success('更新成功')
      menuDialogVisible.value = false
    } else {
      ElMessage.error(res.msg || '更新失败')
    }
  } catch (error) {
    console.error('Error updating user menus:', error)
    ElMessage.error('更新失败')
  }
}

// Lifecycle
onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 16px;
}

.search-input {
  width: 200px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
