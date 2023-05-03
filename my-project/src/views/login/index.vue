<template>
    <div class="content">
        <img class="login-bg" src="../../assets/login/login-bg.jpeg" mode="aspectFill"/>
        <div class="login-content">
            <span class="title-text">JYP</span>
            <login @login="login"></login>
        </div>
    </div>
</template>
<script>
import login from '@/components/login/login.vue'
import { defineComponent } from 'vue'
import { useUserStore } from '@/stores/userStore'
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
            router:[]
        }
    },
    methods: {
        login(params) {
            const userStore = useUserStore()
            
            userStore.login({
                username: params.username,
                password: params.password,
            })

            console.log('router : ' + this.$router)
            this.$router.push('home')
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