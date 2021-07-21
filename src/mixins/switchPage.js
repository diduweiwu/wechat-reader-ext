export default {
  data() {
    return {
      config: { waitSecondsToSwitch: 0 },
      countSeconds: 180
    }
  },
  methods: {
    plusWaitSwitchSeconds() {
      return this.config.waitSecondsToSwitch++
    },
    resetWaitSwitchSeconds() {
      this.config.waitSecondsToSwitch = 0
    },
    startAutoSwitchPage(switchToNextPage) {
      if (!switchToNextPage) {
        return null;
      }

      return setInterval(() => {
        const seconds = this.plusWaitSwitchSeconds();
        // 等待 大于或等于${this.countSeconds} 秒的时候刷新页面
        if (seconds >= this.countSeconds) {
          switchToNextPage()
        }
      }, 1000);
    },
    stopAutoSwitchPage() {
      this.resetWaitSwitchSeconds()
    },
  },
}
