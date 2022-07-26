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
        console.log("解析配置出错，使用默认配置");
      }
    },

  },
  mounted() {
    // 等待元素加载完成再进行配置加载
    const timeCheck = setInterval(() => {
      const loadFlag = document.getElementsByClassName('readerFooter').length

      console.log(`继续等待和检查 ${loadFlag}`);
      if (loadFlag) {
        console.log('页面加载完成，开始加载配置');
        this.loadConfig()
        clearInterval(timeCheck);
      }
    }, 1000)
  },
}
