<template>
  <div class="login-container">
    <el-form class="login-form" :model="form" :rules="rules" ref="formRef">
      <h3 class="title">用户注册</h3>
      
      <div class="form-item">
        <el-form-item prop="username">
          <el-input 
            v-model="form.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
          ></el-input>
        </el-form-item>
      </div>

      <div class="form-item">
        <el-form-item prop="password">
          <el-input 
            type="password" 
            v-model="form.password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
          ></el-input>
        </el-form-item>
      </div>

      <div class="form-item">
        <el-form-item prop="confirmPassword">
          <el-input 
            type="password" 
            v-model="form.confirmPassword"
            placeholder="请确认密码"
            :prefix-icon="Lock"
          ></el-input>
        </el-form-item>
      </div>

      <div class="form-item">
        <el-form-item prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio label="male">男</el-radio>
            <el-radio label="female">女</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>

      <div class="form-item">
        <el-form-item prop="birthday">
          <el-date-picker
            v-model="form.birthday"
            type="date"
            placeholder="请选择生日"
            style="width: 100%"
          />
        </el-form-item>
      </div>

      <div class="form-item">
        <el-form-item prop="avatar">
          <el-input 
            v-model="form.avatar"
            placeholder="请输入头像URL"
            :prefix-icon="Picture"
          ></el-input>
        </el-form-item>
      </div>

      <div class="form-item">
        <el-form-item prop="phone">
          <el-input 
            v-model="form.phone"
            placeholder="请输入手机号"
            :prefix-icon="Iphone"
          ></el-input>
        </el-form-item>
      </div>

      <div class="form-item">
        <el-form-item prop="email">
          <el-input 
            v-model="form.email"
            placeholder="请输入邮箱"
            :prefix-icon="Message"
          ></el-input>
        </el-form-item>
      </div>

      <div class="form-item">
        <el-form-item prop="isAdmin">
          <el-checkbox v-model="form.isAdmin">是否是管理员</el-checkbox>
        </el-form-item>
      </div>

      <div class="form-item">
        <el-button type="primary" @click="handleRegister" class="login-button">注册</el-button>
      </div>
      <div class="form-item">
        <router-link to="/login">
          <el-button type="text" class="register-button">已有账号？去登录</el-button>
        </router-link>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { User, Lock, Picture, Iphone, Message } from '@element-plus/icons-vue';

const formRef = ref(null);
const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  gender: 'male',
  birthday: '',
  avatar: '',
  isAdmin: false,
  phone: '',
  email: '',
});

const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'));
  } else {
    if (form.confirmPassword !== '') {
      formRef.value?.validateField('confirmPassword');
    }
    callback();
  }
};

const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== form.password) {
    callback(new Error('两次输入密码不一致!'));
  } else {
    callback();
  }
};

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, validator: validatePass, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validatePass2, trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
};

const handleRegister = async () => {
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
    console.log('注册信息:', form);
    // 在这里处理注册逻辑
  } catch (error) {
    console.error('表单验证失败:', error);
  }
};
</script>

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

      :deep(.el-radio) {
        color: $text-color-light;
        margin-right: $spacing-large;
      }

      :deep(.el-checkbox) {
        color: $text-color-light;
      }

      :deep(.el-date-editor) {
        width: 100%;
        .el-input__wrapper {
          background-color: $bg-color-light;
          border: 1px solid $border-color-light;
          box-shadow: none;
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
