export default {
  // 自动刷新页面，微信读书web端有内存泄漏问题
  //当切换章节的时候，会导致内存积压，此时只能通过刷新页面释放内存
  // 故我们在开启 自动时长模式时候会开启这个定时任务去释放内存
  data() {
    return {
      // wait seconds to reload 等待刷新页面的时间
      config: { waitSecondsToReload: 0 },
      timeAutoReloadPage: null,
      // 刷新页面的秒数间隔
      countPageReloadSeconds: 118
    }
  },
  methods: {
    plusWaitSeconds() {
      return this.config.waitSecondsToReload++
    },
    resetWaitSeconds() {
      this.config.waitSecondsToReload = 0
    },
    startAutoReloadPage() {
      // 5分钟刷新一次页面
      if (!this.timeAutoReloadPage) {
        this.timeAutoReloadPage = setInterval(() => {
          const seconds = this.plusWaitSeconds();
          // 等待 大于或等于${this.countPageReloadSeconds} 秒的时候刷新页面
          if (seconds >= this.countPageReloadSeconds) {
            this.resetWaitSeconds()
            window.location.reload()
          }
        }, 1000);
      }
    },
    stopAutoReloadPage() {
      if (this.timeAutoReloadPage) {
        clearInterval(this.timeAutoReloadPage)
        this.timeAutoReloadPage = null;
        this.resetWaitSeconds()
      }
    },
  },
}
