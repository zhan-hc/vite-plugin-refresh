# vite-plugin-page-refresh

这是一个可以自动刷新取最新的部署前端页面的vite插件，避免缓存，适用一些活动页面部署之后存在缓存的问题

## 安装
```js
npm i vite-plugin-page-refresh
yarn add vite-plugin-page-refresh
```

## refreshPlugin

**refreshPlugin(packPath, projectName)**

`packPath`代表打包路径

`projectName`代表存储在localStorage中缓存的名称，默认值为'refreshProject'，到时候会把对应的生成的最新的html版本存储来进行对比更新

## 使用方法

```js
import refreshPlugin from 'vite-plugin-page-refresh'

// vite.config.td | vite.confing.js

export default defineConfig({
  plugins: [
    // path.resolve(process.cwd(), 'dist')代表当前项目的dist目录
    refreshPlugin(path.resolve(process.cwd(), 'dist'))
  ]
})

```
