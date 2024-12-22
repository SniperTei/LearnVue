<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="sidebar.collapse"
      :background-color="sidebar.bgColor"
      :text-color="sidebar.textColor"
      router
    >
      <template v-for="item in menuData">
          <template v-if="item.children">
              <el-sub-menu :index="item.index" :key="item.index" v-permiss="item.id">
                  <template #title>
                      <el-icon>
                          <component :is="item.icon"></component>
                      </el-icon>
                      <span>{{ item.title }}</span>
                  </template>
                  <template v-for="subItem in item.children">
                      <el-sub-menu
                          v-if="subItem.children"
                          :index="subItem.index"
                          :key="subItem.index"
                          v-permiss="item.id"
                      >
                          <template #title>{{ subItem.title }}</template>
                          <el-menu-item
                              v-for="(threeItem, i) in subItem.children"
                              :key="i"
                              :index="threeItem.index"
                          >
                              {{ threeItem.title }}
                          </el-menu-item>
                      </el-sub-menu>
                      <el-menu-item v-else :index="subItem.index" v-permiss="item.id">
                          {{ subItem.title }}
                      </el-menu-item>
                  </template>
              </el-sub-menu>
          </template>
          <template v-else>
              <el-menu-item :index="item.index" :key="item.index" v-permiss="item.id">
                  <el-icon>
                      <component :is="item.icon"></component>
                  </el-icon>
                  <template #title>{{ item.title }}</template>
              </el-menu-item>
          </template>
      </template>
  </el-menu>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useSidebarStore } from '@/stores/sidebar';
import { useRoute } from 'vue-router';
// import { menuData } from '@/components/menu';

// const menuData = [
//     {
//         id: '0',
//         title: '系统首页',
//         index: '/dashboard',
//         icon: 'Odometer',
//     },
//     {
//         id: '1',
//         title: '系统管理',
//         index: '1',
//         icon: 'HomeFilled',
//         children: [
//             {
//                 id: '11',
//                 pid: '1',
//                 index: '/system-user',
//                 title: '用户管理',
//             },
//             {
//                 id: '12',
//                 pid: '1',
//                 index: '/system-role',
//                 title: '角色管理',
//             },
//             {
//                 id: '13',
//                 pid: '1',
//                 index: '/system-menu',
//                 title: '菜单管理',
//             },
//         ],
//     },
//     {
//         id: '2',
//         title: '组件',
//         index: '2-1',
//         icon: 'Calendar',
//         children: [
//             {
//                 id: '21',
//                 pid: '3',
//                 index: '/form',
//                 title: '表单',
//             },
//             {
//                 id: '22',
//                 pid: '3',
//                 index: '/upload',
//                 title: '上传',
//             },
//             {
//                 id: '23',
//                 pid: '2',
//                 index: '/carousel',
//                 title: '走马灯',
//             },
//             {
//                 id: '24',
//                 pid: '2',
//                 index: '/calendar',
//                 title: '日历',
//             },
//             {
//                 id: '25',
//                 pid: '2',
//                 index: '/watermark',
//                 title: '水印',
//             },
//             {
//                 id: '26',
//                 pid: '2',
//                 index: '/tour',
//                 title: '分布引导',
//             },
//             {
//                 id: '27',
//                 pid: '2',
//                 index: '/steps',
//                 title: '步骤条',
//             },
//             {
//                 id: '28',
//                 pid: '2',
//                 index: '/statistic',
//                 title: '统计',
//             },
//             {
//                 id: '29',
//                 pid: '3',
//                 index: '29',
//                 title: '三级菜单',
//                 children: [
//                     {
//                         id: '291',
//                         pid: '29',
//                         index: '/editor',
//                         title: '富文本编辑器',
//                     },
//                     {
//                         id: '292',
//                         pid: '29',
//                         index: '/markdown',
//                         title: 'markdown编辑器',
//                     },
//                 ],
//             },
//         ],
//     },
//     {
//         id: '3',
//         title: '表格',
//         index: '3',
//         icon: 'Calendar',
//         children: [
//             {
//                 id: '31',
//                 pid: '3',
//                 index: '/table',
//                 title: '基础表格',
//             },
//             {
//                 id: '32',
//                 pid: '3',
//                 index: '/table-editor',
//                 title: '可编辑表格',
//             },
//             {
//                 id: '33',
//                 pid: '3',
//                 index: '/import',
//                 title: '导入Excel',
//             },
//             {
//                 id: '34',
//                 pid: '3',
//                 index: '/export',
//                 title: '导出Excel',
//             },
//         ],
//     },
//     {
//         id: '4',
//         icon: 'PieChart',
//         index: '4',
//         title: '图表',
//         children: [
//             {
//                 id: '41',
//                 pid: '4',
//                 index: '/schart',
//                 title: 'schart图表',
//             },
//             {
//                 id: '42',
//                 pid: '4',
//                 index: '/echarts',
//                 title: 'echarts图表',
//             },
//         ],
//     },
//     {
//         id: '5',
//         icon: 'Guide',
//         index: '/icon',
//         title: '图标',
//         permiss: '5',
//     },
//     {
//         id: '7',
//         icon: 'Brush',
//         index: '/theme',
//         title: '主题',
//     },
//     {
//         id: '6',
//         icon: 'DocumentAdd',
//         index: '6',
//         title: '附加页面',
//         children: [
//             {
//                 id: '61',
//                 pid: '6',
//                 index: '/ucenter',
//                 title: '个人中心',
//             },
//             {
//                 id: '62',
//                 pid: '6',
//                 index: '/login',
//                 title: '登录',
//             },
//             {
//                 id: '63',
//                 pid: '6',
//                 index: '/register',
//                 title: '注册',
//             },
//             {
//                 id: '64',
//                 pid: '6',
//                 index: '/reset-pwd',
//                 title: '重设密码',
//             },
//             {
//                 id: '65',
//                 pid: '6',
//                 index: '/403',
//                 title: '403',
//             },
//             {
//                 id: '66',
//                 pid: '6',
//                 index: '/404',
//                 title: '404',
//             },
//         ],
//     },
// ];

const menuData = [
    {
        id: '0',
        title: '系统首页',
        index: '/dashboard',
        icon: 'Odometer',
    },
    {
        id: '1',
        title: '图书',
        index: '/booklist',
        icon: 'Odometer',
    },
    {
        id: '2',
        title: '影视',
        index: '/movielist',
        icon: 'Odometer',
    },
    // {
    //     id: '3',
    //     title: '健身',
    //     index: '/dashboard',
    //     icon: 'Odometer',
    // },
    {
        id: '4',
        title: '美食',
        index: '/foodlist',
        icon: 'Odometer',
    },
    {
        id: '5',
        title: '酒精',
        index: '/alcohol',
        icon: 'Odometer',
    },
    {
        id: '6',
        title: '饮酒',
        index: '/drink',
        icon: 'Odometer',
    },
]

const route = useRoute();
const onRoutes = computed(() => {
    return route.path;
});

const sidebar = useSidebarStore();
// 打印sidebar的bgColor
console.log('sidebar : ', sidebar)
</script>

<style scoped>
.sidebar {
  display: flex;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}

.sidebar-el-menu {
  min-height: 100%;
}
</style>