<template>
  <div class="common-layout">
    <el-container>
      <el-header class="home-header">JYP Home</el-header>
      <el-container class="home-container">
        <el-aside class="home-aside">
          <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
            <el-menu-item index="1">
              <el-icon><icon-menu /></el-icon>
              <span>Navigator One</span>
            </el-menu-item>
            <el-menu-item index="2">
              <el-icon><icon-menu /></el-icon>
              <span>Navigator Two</span>
            </el-menu-item>
            <el-menu-item index="3">
              <el-icon><icon-menu /></el-icon>
              <span>Navigator Three</span>
            </el-menu-item>
            <el-menu-item index="4">
              <el-icon><icon-menu /></el-icon>
              <span>Navigator Four</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>


<script>
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
        
      }
    },
    methods: {

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