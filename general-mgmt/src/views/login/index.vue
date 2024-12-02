<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElButton, ElForm, ElFormItem, ElInput } from 'element-plus'
// 引入md5
import md5 from 'js-md5'
// userStore
import { useUserStore } from '@/stores/userStore'
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
// const login = async () => {
//   console.log(username.value, password.value)
//   // 登录逻辑
//   await userStore.getUserInfo({ username: username.value, password: password.value})
//   // await userStore.getUserInfo({ username.value, password.value })
//   ElMessage.success('登录成功')
//   router.replace('/')
// }
</script>

<template>
  <div class="login-container">
    <el-form class="login-form">
      <h3>YOLO系统</h3>
      <div>
        <el-form-item >
          <el-input v-model="username"></el-input>
        </el-form-item>
      </div>
      <div>
        <el-form-item >
          <el-input type="password" v-model="password"></el-input>
        </el-form-item>
      </div>
      <div>
        <el-button type="primary" @click="login">Login</el-button>
      </div>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  background-color: #2d3a4b;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  .login-form {
    width: 300px;
    padding: 20px;
    border-radius: 5px;
    background-color: #304156;
    h3 {
      color: white;
      text-align: center;
    }
    // 按钮
    .el-button {
      width: 100%;
    }
  }
}

h1 {
  color: white;
}
</style>