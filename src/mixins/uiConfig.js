export default {
  data: () => ({
    config: {
      // content width 阅读区域宽度
      readContentWidth: 1000,

      // 隐藏工具栏
      isHideControls: false,
    },
  }),
  methods: {
    // 更改内容区域宽度
    resizeWidth(newWidth) {
      document.querySelector(".readerContent .app_content").style["max-width"] =
        newWidth + "px";
      document.querySelector(".readerTopBar").style["max-width"] =
        newWidth + "px";
      const myEvent = new Event("resize");
      window.dispatchEvent(myEvent);
    },
  },
  watch: {
    "config.readContentWidth": {
      handler: function (newValue, oldValue) {
        // 设置阅读区域宽度
        this.resizeWidth(newValue);
      },
      deep: true,
    },

    "config.isHideControls": {
      handler: function (newValue, oldValue) {
        // 只有在正向滚动，并且到达底部时候，才进行翻页
        document.querySelector(".readerControls").style.opacity = newValue
          ? "1"
          : "0";
      },
      deep: true,
      immediate: true,
    },
  },
}
