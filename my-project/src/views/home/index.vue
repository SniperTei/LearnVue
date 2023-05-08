<template>
  <div class="common-layout">
    <el-container>
      <el-header class="home-header">JYP Home</el-header>
      <el-container class="main-container">
        <el-aside class="home-aside">
          <el-menu default-active="1" class="el-menu-vertical-demo" @select="menuselect">
            <el-menu-item index="1">
              <router-link to="/home">
                <el-icon><icon-menu /></el-icon>
                <span>首页</span>
              </router-link>
            </el-menu-item>
            <el-menu-item index="2">
              <router-link to="/recipe">
                <el-icon><icon-menu /></el-icon>
                <span>菜谱</span>
              </router-link>
            </el-menu-item>
            <el-menu-item index="3">
              <el-icon><icon-menu /></el-icon>
              <span>收纳</span>
            </el-menu-item>
            <el-menu-item index="4">
              <el-icon><icon-menu /></el-icon>
              <span>健康</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main class="home-container">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>


<script>
// import { defineComponent } from 'vue'
// import IconMenu from '@/components/icon/icon-menu.vue'
export default {
  components: {
    
  },
  setup() {
    return {}
  },
  mounted() {
    console.log('home mounted')
  },
  data() {
    return {
      currentMenu: '1',
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log('key : ' + key + ' keyPath : ' + keyPath + ' open')
    },
    handleClose(key, keyPath) {
      console.log('key : ' + key + ' keyPath : ' + keyPath + ' close')
    },
    menuselect(index, indexPath) {
      console.log('index : ' + index + ' indexPath : ' + indexPath)
      if (index == 2) { // 菜谱
        this.$router.push('recipe')
      }
    },
  },
}
</script>

<style scoped>
.home-header {
  background-color: aqua;
  width: 100%;
}
.home-container {
  background-color: red;
}
.home-aside {
  background-color: green;
  width: 200px;
}
</style>