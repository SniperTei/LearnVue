<template>
    <div class="content">
        <img class="login-bg" src="../../assets/login/login-bg.jpeg" mode="aspectFill"/>
        <div class="login-content">
            <span class="title-text">JYP</span>
            <login></login>
        </div>
    </div>
</template>
<script>
import login from '@/components/login/login.vue'
import { defineComponent } from 'vue'
export default defineComponent({
    components: {
        login,
    },
    mounted() {
        console.log('login-page mounted')
    },
    setup() {
        return {}
    },
    data() {
        return {
            // username: '',
            // password: '',
        }
    },
    methods: {
        login() {
            // this.$store.dispatch('login', {
            //     username: this.username,
            //     password: this.password,
            // })
        },
    },
})
</script>
<style scoped>
.title-text {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
    /* background-color: green; */
    display: block;
    text-align: center;
}
.content {
    width: 100vw;
    height: 100vh;
    position: relative;
    /* display: flex; */
}
.login-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
    /* opacity: 0.5; */
    left: 0px;
    top: 0px;
    background-size: cover;
}
.login-content {
    width: 360px;
    /* height: 300px; */
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px 60px;
    border-radius: 8px;
}
</style>