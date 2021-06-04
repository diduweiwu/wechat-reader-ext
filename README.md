# 油猴脚本开发骨架（基于 Vue2）

## 介绍

```text
npm install
最近迷上了油猴脚本编写，但是使用原生 JS 去写简直是噩梦，各种样式，事件，数据同步等特别恼火
某天突然想到能像 VUE 一样快速开发就好了
所以到处寻找，找到了一个框架 https://github.com/qianjiachun/vue3-tampermonkey
可惜是 vue3，我也基于他开发了一个脚本
但是 vue3 目前有些组件还不支持，所以寻求一个 vue2 版本，而且这个兄弟的目录结构有点点繁琐
故决定自己造个轮子
```

### 技术选型

- vue2
- webpack 打包工具

### 用法

- 第三方组件引入

```text
和正常开发vue无区别，npm/cnpm安装就好了，我试了element ui引入，也没有问题，
不需要的同学自己移除掉就行
```

- 运行+开发+调试

```text
与正常开发调试流程一样，npm run dev启动本地运行环境
```

- 打包

```text
打包使用 npm run build 即可,打包会在./dist目录下生成一个js bundle，正好符合油猴脚本需要
```

- 油猴加载本地 js 进行调试

```text
使用 @require file://xxxxx/dist/build.js 方式引入
但是使用这种方式需要到tampermonkey插件详情打开"允许访问文件网址"权限
```

- 发布

```text
npm run build后复制 dist/build.js里面内容到油猴发布页面粘贴发布
```
