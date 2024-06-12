# general-mgmt

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

#### 1. 创建项目
```
npm create vue@latest

Project name: … sniper-cinema-pc
✔ Add TypeScript? … [No] / Yes
✔ Add JSX Support? … [No] / Yes
✔ Add Vue Router for Single Page Application development? … No / [Yes]
✔ Add Pinia for state management? … No / [Yes]
✔ Add Vitest for Unit Testing? … [No] / Yes
✔ Add an End-to-End Testing Solution? › [No]
✔ Add ESLint for code quality? … No / [Yes]
✔ Add Prettier for code formatting? … [No] / Yes
✔ Add Vue DevTools 7 extension for debugging? (experimental) … No / [Yes]

```

#### 2. elementPlus 自动导入（可选）
```
npm install -D unplugin-vue-components unplugin-auto-import
```

```
npm i axios
```

```
.eslintrc.cjs

rules: {
    // 不强制要求组件名multi word
    'vue/multi-word-component-names': 0,
  }
```