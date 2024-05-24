import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  console.log('env:', env)
  console.log('mode:', mode)
  console.log('env1:', env.VITE_API_URL)
  return {
    // define: {
    //   // 'process.env': env
    //   __APP_ENV__: JSON.stringify(env.APP_ENV),
    // },
    // api proxy
    // server: {
    //   open: true,
    //   proxy: {
    //     '/api': {
    //       target: 'http://127.0.0.1:8000/',
    //       logLevel: 'debug',
    //       changeOrigin: true,
    //       // rewrite: path => path.replace(/^\/api/, 'api')
    //     }
    //   }
    // },
    // devServer: {
    //   open: true,
    //   port: 3000,
    //   proxy: {
    //     '/api': {
    //       target: 'http://' + env.VITE_API_URL,
    //       changeOrigin: true,
    //       rewrite: path => path.replace(/^\/api/, ''),
    //       logLevel: 'debug'
    //     }
    //   }
    // },
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
  }
})


// export default defineConfig({
//   plugins: [
//     vue(),
//     VueDevTools(),
//     AutoImport({
//       resolvers: [ElementPlusResolver()],
//     }),
//     Components({
//       resolvers: [
//         // 配置elementPlus采用sass样式配色系统
//         ElementPlusResolver(
//           { importStyle: 'sass'}
//         )
//       ],
//     }),
//   ],
//   css: {
//     preprocessorOptions: {
//       scss: {
//         // 自动导入定制化样式文件进行覆盖
//         additionalData: 
//         `@use "@/styles/element/index.scss" as *;
//         @use "@/styles/var.scss" as *;`
//       },
//       // less: {
//       //   modifyVars: {
//       //     'primary-color': '#1890ff',
//       //     'link-color': '#1890ff',
//       //     'border-radius-base': '2px'
//       //   },
//       //   javascriptEnabled: true
//       // }
//     }
//   },
//   resolve: {
//     // 实际的路径转换 @ -> /src
//     alias: {
//       '@': fileURLToPath(new URL('./src', import.meta.url))
//     }
//   }
// })
