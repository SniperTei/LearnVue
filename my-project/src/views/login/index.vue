<template>
    <div>
        <login></login>
    </div>
</template>
<script>
import login from '@/components/login/login.vue'
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'login-page',
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

</style>