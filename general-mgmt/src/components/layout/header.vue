<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessageBox } from 'element-plus'
import { Expand, Fold } from '@element-plus/icons-vue'
import defaultAvatar from '@/assets/default-avatar.svg'

const router = useRouter()
const userStore = useUserStore()
const isCollapse = ref(false)

const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

const handleCommand = async (command) => {
  if (command === 'logout') {
    await ElMessageBox.confirm('确认退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    userStore.logout()
    router.push('/login')
  }
}
</script>

<template>
  <div class="header">
    <div class="left">
      <el-icon class="toggle-button" @click="toggleSidebar">
        <Expand v-if="isCollapse" />
        <Fold v-else />
      </el-icon>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="right">
      <el-dropdown @command="handleCommand">
        <span class="user-wrapper">
          <img :src="defaultAvatar" class="avatar">
          <span class="username">{{ userStore.username }}</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  height: 50px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  
  .left {
    display: flex;
    align-items: center;
    
    .toggle-button {
      padding: 0 15px;
      cursor: pointer;
      font-size: 16px;
      
      &:hover {
        color: #409EFF;
      }
    }
  }
  
  .right {
    .user-wrapper {
      cursor: pointer;
      display: flex;
      align-items: center;
      
      .avatar {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        margin-right: 8px;
      }
      
      .username {
        font-size: 14px;
        color: #606266;
      }
    }
  }
}
</style>
