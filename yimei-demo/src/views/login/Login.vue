<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">用户登录</h2>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username" class="form-label">用户名</label>
          <input
            type="text"
            id="username"
            v-model="loginForm.username"
            placeholder="请输入用户名"
            class="form-input"
            required
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">密码</label>
          <input
            type="password"
            id="password"
            v-model="loginForm.password"
            placeholder="请输入密码"
            class="form-input"
            required
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button type="submit" class="login-button" :disabled="isLoading">
          {{ isLoading ? '登录中...' : '登录' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { login } from '@/api/loginApi';



const router = useRouter();
const userStore = useUserStore();

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: ''
});

// 状态变量
const errorMessage = ref('');
const isLoading = ref(false);

// 处理登录
const handleLogin = async () => {
  // 重置错误信息
  errorMessage.value = '';

  // 简单验证
  if (!loginForm.username || !loginForm.password) {
    errorMessage.value = '请输入用户名和密码';
    return;
  }

  // 模拟加载状态
  isLoading.value = true;

  try {
    const response = await login({
      account: loginForm.username,
      password: loginForm.password
    });

    // 假设接口返回的数据结构包含用户信息
    if (response && response.data) {
      // 保存用户信息到store
      userStore.setUserInfo(response.data.userinfo);

      // 登录成功，跳转到首页
      router.push({ name: 'home' });
    } else {
      errorMessage.value = '登录失败，请稍后重试';
    }
  } catch (error) {
    // 处理网络错误或服务器错误
    errorMessage.value = error.response?.data?.message || '登录失败，请稍后重试';
    console.error('Login error:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.login-box {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.login-title {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: 600;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.form-input {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #409eff;
  }

  &::placeholder {
    color: #999;
  }
}

.error-message {
  color: #f56c6c;
  font-size: 14px;
  text-align: center;
  margin-top: -10px;
}

.login-button {
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;

  &:hover:not(:disabled) {
    background-color: #66b1ff;
  }

  &:disabled {
    background-color: #c0c4cc;
    cursor: not-allowed;
  }
}

// 响应式设计
@media (max-width: 480px) {
  .login-box {
    padding: 30px 20px;
  }

  .login-title {
    font-size: 20px;
  }
}
</style>
