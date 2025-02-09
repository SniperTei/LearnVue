import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import AutoImport from 'unplugin-auto-import/vite';
import { fileURLToPath, URL } from 'node:url';
import { loadEnv } from 'vite';
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const pathSrc = path.resolve(__dirname, 'src');
  
  return {
    resolve: {
      alias: {
        '@': pathSrc,
      },
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    plugins: [
      vue(),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          charset: false,
          additionalData: `@use "@/styles/_variables.scss" as *;`
        }
      }
    },
    build: {
      // 生产环境构建配置
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production'
        }
      },
      // 构建优化
      rollupOptions: {
        output: {
          manualChunks: {
            'element-plus': ['element-plus'],
            'vue': ['vue', 'vue-router', 'pinia'],
          }
        }
      },
      // 启用 gzip 压缩
      brotliSize: true,
      // chunk 大小警告的限制
      chunkSizeWarningLimit: 1500
    }
  }
})
