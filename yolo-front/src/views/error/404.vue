<script setup>
import { useRouter } from 'vue-router'
import { CircleClose } from '@element-plus/icons-vue'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="error-container">
    <div class="error-content">
      <el-icon class="error-icon"><CircleClose /></el-icon>
      <h1>404</h1>
      <h2>抱歉，您访问的页面不存在</h2>
      <div class="error-actions">
        <el-button type="primary" @click="goBack">返回上页</el-button>
        <el-button @click="goHome">回到首页</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.error-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  
  .error-content {
    text-align: center;
    padding: 40px;
    
    .error-icon {
      font-size: 80px;
      color: #f56c6c;
      margin-bottom: 20px;
    }
    
    h1 {
      font-size: 72px;
      color: #303133;
      margin: 0;
      line-height: 1.2;
    }
    
    h2 {
      font-size: 24px;
      color: #606266;
      margin: 20px 0;
      font-weight: normal;
    }
    
    .error-actions {
      margin-top: 30px;
      
      .el-button + .el-button {
        margin-left: 16px;
      }
    }
  }
}
</style>
