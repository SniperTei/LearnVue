import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [
        // 配置elementPlus采用sass样式配色系统
        ElementPlusResolver(
          { importStyle: 'sass'}
        )
      ],
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // 自动导入定制化样式文件进行覆盖
        additionalData: 
        `@use "@/styles/element/index.scss" as *;
        @use "@/styles/var.scss" as *;`
      },
      // less: {
      //   modifyVars: {
      //     'primary-color': '#1890ff',
      //     'link-color': '#1890ff',
      //     'border-radius-base': '2px'
      //   },
      //   javascriptEnabled: true
      // }
    }
  },
  resolve: {
    // 实际的路径转换 @ -> /src
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
