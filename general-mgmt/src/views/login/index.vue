<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElButton, ElForm, ElFormItem, ElInput } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
// 引入md5
import md5 from 'js-md5'
// userStore
import { useUserStore } from '@/stores/user'
const username = ref('')
const password = ref('')
const router = useRouter()
const userStore = useUserStore()
const login = async () => {
  let passwordMD5 = md5(password.value).toUpperCase()
  // 登录逻辑
  userStore.getUserInfo({ username: username.value, password: passwordMD5}).then(() => {
    ElMessage.success('登录成功')
    router.replace('/home')
  }).catch((err) => {
    console.log(err)
    let errMsg = err.msg;
    ElMessage.error('登录失败: ' + errMsg)
  })
}
</script>

<template>
  <div class="login-container">
    <el-form class="login-form">
      <h3 class="title">YOLO系统</h3>
      <div class="form-item">
        <el-form-item>
          <el-input 
            v-model="username"
            placeholder="请输入用户名"
            :prefix-icon="User"
          ></el-input>
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item>
          <el-input 
            type="password" 
            v-model="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            @keyup.enter="login"
          ></el-input>
        </el-form-item>
      </div>
      <div class="form-item">
        <el-button type="primary" @click="login" class="login-button">登录</el-button>
      </div>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  background-color: #2d3a4b;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .login-form {
    width: 400px;
    padding: 35px;
    border-radius: 8px;
    background-color: #304156;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    
    .title {
      color: #fff;
      text-align: center;
      font-size: 26px;
      font-weight: bold;
      margin-bottom: 35px;
    }

    .form-item {
      margin-bottom: 25px;

      &:last-child {
        margin-bottom: 0;
      }

      :deep(.el-input) {
        .el-input__wrapper {
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: none;
          
          &:hover, &:focus {
            border-color: #409EFF;
          }
        }

        input {
          color: #fff;
          height: 40px;
          
          &::placeholder {
            color: rgba(255, 255, 255, 0.7);
          }
        }

        .el-input__prefix-inner {
          color: rgba(255, 255, 255, 0.7);
        }
      }
    }

    .login-button {
      width: 100%;
      height: 40px;
      font-size: 16px;
    }
  }
}
</style>