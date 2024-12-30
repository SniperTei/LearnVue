<script setup>
import { useRouter } from 'vue-router'
// import { useUserStore } from '@/stores/user';
// 导入header和sidebar
import Header from '@/components/layout/header.vue'
import Sidebar from '@/components/layout/sidebar.vue'
const router = useRouter()
// const userStore = useUserStore()
console.log('router : ', router)
console.log('router.matched : ', router.matched)
// const userInfo = userStore.userInfo
// const logoutBtnClick = () => {
//   console.log('logoutBtnClick')
//   ElMessageBox.alert('是否确认退出登录?', '提示', {
//     confirmButtonText: '确定',
//     callback: action => {
//       if (action === 'confirm') {
//         userStore.clearUserInfo()
//         router.push({ path: '/' })
//       } 
//     }
//   })
// }

</script>
<template>
  <div class="wrapper">
    <!-- 左右结构，左边sidebar， 右边上下结构，上面header， 下面内容 -->
    <Sidebar />
    <div class="main">
      <Header />
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.wrapper {
  display: flex;
  .main {
    display: flex;
    flex-direction: column;
    .content {
      flex: 1;
      padding: 20px;
    }
  }
}
</style>
