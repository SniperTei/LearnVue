import { fileURLToPath, URL } from 'node:url'
import path from 'path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // 自动导入全局变量文件
        additionalData: `@import "${path.resolve(__dirname, 'src/styles/variables.scss')}";`,
      },
    },
  },
  // server: {
  //   host: '0.0.0.0',
  //   port: 5173,
  //   cors: true,
  //   // 禁用类型检查以加快开发速度
  //   https: false,
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, '/api'),
  //       headers: {
  //         'Origin': 'http://localhost'
  //       }
  //     }
  //   }
  // },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
