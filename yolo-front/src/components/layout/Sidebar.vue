<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const props = defineProps({
  isCollapse: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const userStore = useUserStore()
const activeMenu = computed(() => route.path)

// 从 store 中获取菜单数据
const menus = computed(() => userStore.menus)
</script>

<template>
  <div class="sidebar">
    <div class="logo" :class="{ 'is-collapse': isCollapse }">
      <font-awesome-icon icon="fa-solid fa-code" class="logo-icon" />
      <span v-show="!isCollapse" class="title">YOLO系统</span>
    </div>
    
    <el-scrollbar>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        :unique-opened="true"
        :router="true"
      >
        <template v-for="menu in menus" :key="menu._id">
          <!-- 有子菜单的情况 -->
          <el-sub-menu v-if="menu.children && menu.children.length" :index="menu.path">
            <template #title>
              <font-awesome-icon :icon="menu.icon" />
              <span>{{ menu.title }}</span>
            </template>
            
            <el-menu-item 
              v-for="child in menu.children"
              :key="child._id"
              :index="child.path"
            >
              <font-awesome-icon :icon="child.icon" />
              <span>{{ child.title }}</span>
            </el-menu-item>
          </el-sub-menu>
          
          <!-- 没有子菜单的情况 -->
          <el-menu-item v-else :index="menu.path">
            <font-awesome-icon :icon="menu.meta?.icon" />
            <span>{{ menu.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.sidebar {
  height: 100%;
  background-color: #304156;
  
  .logo {
    height: 50px;
    display: flex;
    align-items: center;
    padding: 10px 16px;
    background: #2b2f3a;
    overflow: hidden;
    
    .logo-icon {
      font-size: 24px;
      color: #409EFF;
      transition: all 0.3s;
    }
    
    .title {
      color: #fff;
      font-size: 16px;
      font-weight: 600;
      white-space: nowrap;
      margin-left: 12px;
      transition: opacity 0.3s;
    }
    
    &.is-collapse {
      padding: 10px;
      justify-content: center;
      
      .logo-icon {
        margin: 0;
      }
    }
  }
  
  :deep(.el-menu) {
    border-right: none;
    
    .svg-inline--fa {
      margin-right: 10px;
      width: 16px;
      text-align: center;
    }
  }
  
  :deep(.el-menu--collapse) {
    width: 64px;
    
    .svg-inline--fa {
      margin-right: 0;
    }
  }
  
  :deep(.el-sub-menu__title) {
    &:hover {
      background-color: #263445 !important;
    }
  }
  
  :deep(.el-menu-item) {
    &:hover {
      background-color: #263445 !important;
    }
    
    &.is-active {
      background-color: #263445 !important;
    }
  }
}
</style>
