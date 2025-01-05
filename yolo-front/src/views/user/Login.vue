<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';
import { login } from '@/api/userAPI';
import { useUserStore } from '@/stores/user';
import '@/styles/variables.scss';

const router = useRouter();
const userStore = useUserStore();

const form = ref({
  username: '',
  password: '',
});

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
};

const formRef = ref(null);
const loading = ref(false);

const handleLogin = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate();
  loading.value = true;
  
  await login(form.value)
    .then(data => {
      // 保存用户信息和token
      const userStore = useUserStore();
      userStore.setToken(data.token);
      userStore.setUserInfo({
        ...data.user
      });
      userStore.setMenus(data.menus || []);
      
      ElMessage.success('登录成功');
      router.push('/');
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<template>
  <div class="login-container">
    <el-form 
      class="login-form" 
      ref="formRef"
      :model="form"
      :rules="rules"
    >
      <h3 class="title">YOLO系统</h3>
      <div class="form-item">
        <el-form-item prop="username">
          <el-input 
            v-model="form.username"
            placeholder="用户名" 
            :prefix-icon="User"
          />
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
      </div>
      <el-button 
        :loading="loading" 
        type="primary" 
        class="login-button"
        @click="handleLogin"
      >
        登录
      </el-button>
      <div class="form-item">
        <router-link to="/register">
          <el-button type="text" class="register-button">没有账号？去注册</el-button>
        </router-link>
      </div>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

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

    .register-button {
      width: 100%;
      color: $text-color-placeholder;
      &:hover {
        color: $primary-color;
      }
    }
  }
}
</style>
