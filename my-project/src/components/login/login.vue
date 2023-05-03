<template>
  <div class="login">
    <el-form class="login-component">
        <el-form-item label="Username">
            <el-input v-model="username"></el-input>
        </el-form-item>
        <el-form-item label="Password">
            <el-input v-model="password"></el-input>
        </el-form-item>
        <div class="login-btns">
            <el-form-item>
                <el-button type="primary" @click="login">Login</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="register">Register</el-button>
            </el-form-item>
        </div>
    </el-form>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'login-component',
    components: {

    },
    setup() {
        return {}
    },
    mounted() {
        console.log('login-component mounted')
    },
    data() {
        return {
            username: '',
            password: '',
        }
    },
    methods: {
        login() {
            this.$emit('login', {
                username: this.username,
                password: this.password,
            })
        },
    },
})
</script>
<style scoped>
.login-component {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.login-btns {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>