### V3.0全新版本，重新设计UI布局，支持丰富的配置，所有配置做持久化，重启刷新浏览器不再丢失~

### 使用说明

- 安装: 安装TamperMonkey浏览器插件,然后前往安装脚本 [微信读书-WEB端自动阅读插件](https://greasyfork.org/zh-CN/scripts/407535-%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6-web%E7%AB%AF%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E6%8F%92%E4%BB%B6)
- 打开一本书的微信读书界面,点击界面右中方“读”字按钮即可
- 如果需要后台刷时长，请一定记得开启 **定时翻页** 开关
- Edge 浏览器请关闭TAB休眠或者在休眠配置中排除 https://weread.qq.com
- 效果展示

![界面截图](img/ui.png)


### 更新日志

- 2022-07-26
  - 更新UI布局
  - 分离了配置与阅读开关
  - 新增了随机休眠功能
  - 一些开关的文案修改,更容易理解
- 2021-07-23
  - 重新设计UI
  - 修复关闭自动阅读后仍刷新页面bug
  - 重构了下代码
- 2021-06-17
  - 新增我的账户信息展示，展示书币信息（安卓端与IOS端）
  - 新增源码地址链接，有兴趣欢迎一起交流
- 2021-06-15
  - 更新UI样式
  - 新增“自动时长”模式，会自动定时刷新页面，避免被微信读书判定为后台（判定为后台会暂停时长累积）
  - 更新组件为动态引入，减小构建包体积

- 2021-06-02
  - 支持设置滚动步长
  - 支持设置滚动间隔
  - 支持设置滚动方向
  - 支持设置自动翻页模式（前翻页/后翻页）
  - 支持设置阅读宽度（参考并感谢：418878-微信读书加宽度）
  - 支持显示/隐藏微信阅读工具栏
  - 更多功能欢迎留言交流 源码开源在 [开源中国](https://gitee.com/diduweiwu-itestdev/wechat-reader-ext)
  - 感谢 [基础框架](https://github.com/qianjiachun/vue3-tampermonkey) 作者
