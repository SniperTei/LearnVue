<template>
    <div>
        wangdefa
        <!-- <el-form>
            <el-form-item label="Username">
                <el-input v-model="username" />
            </el-form-item>
            <el-form-item label="Password">
                <el-input v-model="password" />
            </el-form-item>
            <el-form-item>
                <el-button @click="login">Login</el-button>
            </el-form-item>
        </el-form> -->
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
            this.$store.dispatch('login', {
                username: this.username,
                password: this.password,
            })
        },
    },
})
</script>
<style scoped>
</style>