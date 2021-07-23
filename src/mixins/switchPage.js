export default {
  data() {
    return {
      config: { waitSecondsToSwitch: 0 },
      countSwitchPageSeconds: 50
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
        // 等待 大于或等于${this.countSwitchPageSeconds} 秒的时候刷新页面
        if (seconds >= this.countSwitchPageSeconds) {
          this.resetWaitSwitchSeconds()
          switchToNextPage()
        }
      }, 1000);
    },
    stopAutoSwitchPage(timeAutoSwitchPage) {
      if (timeAutoSwitchPage) {
        clearInterval(timeAutoSwitchPage);
      }
      this.resetWaitSwitchSeconds()
      return null
    },
  },
}
