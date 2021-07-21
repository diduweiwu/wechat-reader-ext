export default {
  data() {
    return {
      config: {}
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
      } catch (e) {
        console.log("解析配置出错，使用默认配置");
      }
    },
  },
  mounted() {
    this.loadConfig();
  },
}
