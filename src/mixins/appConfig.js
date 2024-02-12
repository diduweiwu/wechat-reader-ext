export default {
  data() {
    return {
      config: {},
      autoSleepTask: null,
    }
  },
  watch: {
    config: {
      handler: function () {
        localStorage.setItem("config", JSON.stringify(this.config));
      },
      deep: true,
    },
  },
  methods: {
    loadConfig() {
      const configJson = localStorage.getItem("config");
      if (!configJson) {
        return;
      }
      try {
        const config = JSON.parse(configJson);
        Object.assign(this.config, config);
        console.log('当前配置是', this.config)
      } catch (e) {
        console.error("解析配置出错，使用默认配置");
      }
    },
  },
  mounted() {
    // 等待元素加载完成再进行配置加载
    const timeCheck = setInterval(() => {
      const loadFlag = document.querySelector('.navBarOffset')

      if (loadFlag) {
        console.log('页面加载完成，开始加载配置');
        this.loadConfig()

        document.querySelector(".navBarOffset").style.paddingTop = this.config.isHideControls
          ? "100px" : "0px"
        clearInterval(timeCheck);
      }
    }, 1000)
  },
}
