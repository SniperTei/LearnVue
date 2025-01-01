<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElButton, ElForm, ElFormItem, ElInput } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
// 引入md5
import md5 from 'js-md5'
// userStore
import { useUserStore } from '@/stores/user'

const username = ref('')
const password = ref('')
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const login = async () => {
  try {
    const passwordMD5 = md5(password.value).toUpperCase()
    await userStore.getUserInfo({ username: username.value, password: passwordMD5})
    ElMessage.success('登录成功')
    const redirect = route.query.redirect || '/home'
    router.replace(redirect)
  } catch (err) {
    console.error(err)
    const errMsg = err.msg || '未知错误'
    ElMessage.error('登录失败: ' + errMsg)
  }
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
@import '@/styles/variables.scss';

.login-container {
  background-color: $bg-color-primary;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .login-form {
    width: 400px;
    padding: $spacing-extra-large;
    border-radius: $border-radius-large;
    background-color: $bg-color-secondary;
    box-shadow: $box-shadow-dark;
    
    .title {
      color: $text-color-light;
      text-align: center;
      font-size: $font-size-extra-large;
      font-weight: $font-weight-primary;
      margin-bottom: $spacing-extra-large;
    }

    .form-item {
      margin-bottom: $spacing-large;

      &:last-child {
        margin-bottom: 0;
      }

      :deep(.el-input) {
        .el-input__wrapper {
          background-color: $bg-color-light;
          border: 1px solid $border-color-light;
          box-shadow: none;
          
          &:hover, &:focus {
            border-color: $primary-color;
          }
        }

        input {
          color: $text-color-light;
          height: 40px;
          
          &::placeholder {
            color: $text-color-placeholder;
          }
        }

        .el-input__prefix-inner {
          color: $text-color-placeholder;
        }
      }
    }

    .login-button {
      width: 100%;
      height: 40px;
      font-size: $font-size-medium;
    }
  }
}
</style>