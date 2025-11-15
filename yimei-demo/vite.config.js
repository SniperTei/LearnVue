import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    cors: true,
    // 禁用类型检查以加快开发速度
    https: false,
    proxy: {
      '/api': {
        // target: 'http://yimei.cc/',
        target: 'http://156.226.180.172',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
        headers: {
          // Origin: 'http://yimei.cc/'
          'Origin': 'http://156.226.180.172'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
