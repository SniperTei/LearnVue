<template>
  <div class="navbar">
    <div class="left">
      <div class="hamburger">
        <el-icon><Fold /></el-icon>
      </div>
    </div>
    
    <div class="right">
      <el-dropdown trigger="click">
        <div class="avatar-container">
          <el-avatar :size="30" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
          <span class="username">{{ username }}</span>
          <el-icon><CaretBottom /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleProfile">个人信息</el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Fold, CaretBottom } from '@element-plus/icons-vue'

const router = useRouter()
const username = ref('Admin')

const handleProfile = () => {
  // 跳转到个人信息页面
  router.push('/profile')
}

const handleLogout = () => {
  // 清除用户信息和token
  // TODO: 调用登出接口
  router.push('/login')
  ElMessage.success('退出成功')
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.left {
  .hamburger {
    font-size: 20px;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      color: #409EFF;
    }
  }
}

.right {
  .avatar-container {
    display: flex;
    align-items: center;
    cursor: pointer;
    
    .username {
      margin: 0 8px;
      color: #606266;
    }
  }
}
</style>
