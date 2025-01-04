<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// 方式1：直接引入需要的图标
import {
  HomeFilled,
  Location,
  Menu as IconMenu,
  Setting,
  User,
  VideoCamera
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const props = defineProps({
  isCollapse: {
    type: Boolean,
    default: false
  }
})

// 获取路由配置中的菜单
const menus = computed(() => {
  return router.options.routes.filter(route => {
    return route.meta && !route.meta.hidden
  })
})

const activeMenu = computed(() => route.path)

// 图标映射表
const iconMap = {
  'HomeFilled': HomeFilled,
  'Location': Location,
  'Menu': IconMenu,
  'Setting': Setting,
  'User': User,
  'VideoCamera': VideoCamera
}
</script>

<template>
  <div class="sidebar">
    <div class="logo" :class="{ 'is-collapse': isCollapse }">
      <!-- 方式1：直接使用引入的图标组件 -->
      <el-icon class="logo-icon" :size="32">
        <HomeFilled />
      </el-icon>
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
        <template v-for="menu in menus" :key="menu.path">
          <!-- 有子菜单的情况 -->
          <el-sub-menu v-if="menu.children && menu.children.length" :index="menu.path">
            <template #title>
              <!-- 方式2：使用 el-icon 组件动态渲染 -->
              <el-icon>
                <component :is="iconMap[menu.meta?.icon] || Setting" />
              </el-icon>
              <span>{{ menu.meta?.title }}</span>
            </template>
            
            <el-menu-item 
              v-for="child in menu.children"
              :key="child.path"
              :index="menu.path + '/' + child.path"
            >
              <el-icon>
                <component :is="iconMap[child.meta?.icon] || User" />
              </el-icon>
              <span>{{ child.meta?.title }}</span>
            </el-menu-item>
          </el-sub-menu>
          
          <!-- 没有子菜单的情况 -->
          <el-menu-item v-else :index="menu.path">
            <el-icon>
              <component :is="iconMap[menu.meta?.icon] || HomeFilled" />
            </el-icon>
            <span>{{ menu.meta?.title }}</span>
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
  }
  
  :deep(.el-menu--collapse) {
    width: 64px;
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
