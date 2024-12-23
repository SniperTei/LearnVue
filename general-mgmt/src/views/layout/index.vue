<script setup>
// import { useRouter } from 'vue-router'
// import { useUserStore } from '@/stores/user';
// 导入header和sidebar
import Header from '@/components/layout/header.vue'
import Sidebar from '@/components/layout/sidebar.vue'
// const router = useRouter()
// const userStore = useUserStore()
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
    <Header class="head"/>
    <div class="main">
      <Sidebar class="sidebar" />
      <div class="content">
        <!-- <Tabs class="tabs" /> -->
        <router-view />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.wrapper {
  .main {
    display: flex;
    .tabs {
      flex: 1;
    }
    .content {
      flex: 1;
      padding: 20px;
    }
  }
}
</style>
