<template>
  <div class="dashboard-container">
    <h2>仪表盘</h2>
    <div class="dashboard-content">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>用户总数</span>
                <el-icon><User /></el-icon>
              </div>
            </template>
            <div class="card-content">
              <span class="number">1,234</span>
              <span class="text">活跃用户</span>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>今日访问</span>
                <el-icon><View /></el-icon>
              </div>
            </template>
            <div class="card-content">
              <span class="number">423</span>
              <span class="text">浏览量</span>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>系统消息</span>
                <el-icon><Message /></el-icon>
              </div>
            </template>
            <div class="card-content">
              <span class="number">12</span>
              <span class="text">未读消息</span>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>系统状态</span>
                <el-icon><Loading /></el-icon>
              </div>
            </template>
            <div class="card-content">
              <span class="number">98%</span>
              <span class="text">运行正常</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { User, View, Message, Loading } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;
  
  .dashboard-content {
    margin-top: 20px;
    
    .el-card {
      margin-bottom: 20px;
      
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .el-icon {
          font-size: 20px;
          color: #409EFF;
        }
      }
      
      .card-content {
        text-align: center;
        
        .number {
          font-size: 24px;
          font-weight: bold;
          color: #303133;
          display: block;
          margin-bottom: 8px;
        }
        
        .text {
          font-size: 14px;
          color: #909399;
        }
      }
    }
  }
}
</style>
