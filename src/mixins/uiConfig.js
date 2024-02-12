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
    "config.autoWidth": {
      handler: function (newValue, oldValue) {
        if (!!newValue) {
          this.resizeWidth(8000);
        } else {
          this.resizeWidth(this.config.readContentWidth);
        }
      }
    },
    "config.isHideControls": {
      handler: function (newValue, oldValue) {
        document.querySelector(".readerTopBar").style.display = newValue
          ? "" : "none"

        let navBarOffset = document.querySelector(".navBarOffset")
        if (!!navBarOffset) {
          document.querySelector(".navBarOffset").style.paddingTop = newValue
            ? "100px" : "0px"
        }

        // 隐藏头部和侧边的工具栏
        document.querySelector(".readerControls").style.opacity = newValue
          ? "1"
          : "0";
      },
      deep: true,
      immediate: true,
    },
  },
}
