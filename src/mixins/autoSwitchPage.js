export default {
  // 自动刷新页面，微信读书web端有内存泄漏问题
  //当切换章节的时候，会导致内存积压，此时只能通过刷新页面释放内存
  // 故我们在开启 自动时长模式时候会开启这个定时任务去释放内存
  data() {
    return {
      // wait seconds to reload 等待刷新页面的时间
      config: {
        waitSecondsToReload: 0,
        countPageReloadSeconds: 60
      },
      timeAutoReloadPage: null,
      // 刷新页面的秒数间隔
    }
  },
  watch: {
    // 自动阅读开关开启后
    "config.isScrolling"(newValue, oldValue) {
      (!!newValue && !!this.config.timeFlashMode) ? this.startAutoSwitchPage() : this.stopAutoSwitchPage()
    }
  },
  methods: {
    plusWaitSeconds() {
      return this.config.waitSecondsToReload++
    },
    resetWaitSeconds() {
      this.config.waitSecondsToReload = 0
    },
    startAutoSwitchPage() {
      // 指定间隔切换页面
      if (!this.timeAutoReloadPage) {
        this.timeAutoReloadPage = setInterval(() => {
          const seconds = this.plusWaitSeconds();
          // 等待 大于或等于${this.countPageReloadSeconds} 秒的时候刷新页面,触发后台统计时长
          // 并且不处于休眠状态
          if (seconds >= this.config.countPageReloadSeconds && this.config.sleepCount === 0) {
            // 直接使用刷新页面的方式，避免后台切换页面失败
            this.resetWaitSeconds()
            location.reload()
          }
        }, 1000);
      }
    },
    stopAutoSwitchPage() {
      if (this.timeAutoReloadPage) {
        clearInterval(this.timeAutoReloadPage)
        this.timeAutoReloadPage = null;
        this.resetWaitSeconds()
      }
    },
  },
}
