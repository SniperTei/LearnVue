<script setup>
import { ref } from 'vue'
// import { useRouter } from 'vue-router'
const username = ref('')
const password = ref('')
// const router = useRouter()
const login = () => {
  console.log(username.value, password.value)
  if (username.value === 'admin' && password.value === 'admin110') {
    console.log('登录成功')
    // 登录成功跳到layout页面
    // router.replace('/')
  } else {
    console.log('登录失败')
  }
}
</script>

<template>
  <div class="login-container">
    <el-form class="login-form">
      <h3>后台管理系统</h3>
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
}

h1 {
  color: white;
}
</style>