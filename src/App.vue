<template>
  <div class="config-area">
    <el-row>
      <el-col>
        <el-tooltip trigger="hover" placement="left">
          <el-button :circle="true"
                     :plain="!config.isScrolling"
                     :type="config.isScrolling?'success':'default'"
                     @click="config.isScrolling=!config.isScrolling">
            读
          </el-button>
          <template #content>
            点击切换阅读状态~
          </template>
        </el-tooltip>

      </el-col>
      <el-col>
        <el-popover placement="left" width="800" trigger="click">
          <template #reference>
            <el-button type="default" plain circle>
              <i class="el-icon-s-tools"/>
            </el-button>
          </template>

          <ReadConfig :config="config"/>

        </el-popover>
      </el-col>
    </el-row>
  </div>

</template>

<script>
import uiConfig from "./mixins/uiConfig.js";
import pageReload from "./mixins/autoSwitchPage.js";
import keyEvent from "./mixins/keyEvent.js";
import appConfig from "./mixins/appConfig.js";
import ReadConfig from "./com/ReadConfig.vue";

export default {
  name: "wechatReaderExt",
  components: {ReadConfig},
  mixins: [uiConfig, pageReload, keyEvent, appConfig],
  data: () => ({
    config: {
      // 标记是否在自动阅读
      isScrolling: false,
      // 滚动方向标记 1 正向，往下 -1 反向，往上
      scrollFlag: 1,
      // 自动滚动步长
      scrollOffset: 1,
      // 自动滚动时间间隔（毫秒）
      timerScrollIMs: 200,

      // 是否自动翻页
      isAutoSwitchPage: true,
      // 自动翻页方向
      autoSwitchPageFlag: 1,

      // 自动刷时长模式
      timeFlashMode: false,

      // 自动休眠开关
      isRandomSleep: false,
      // 休眠时长,秒数
      sleepCount: 0,
      // 休眠的时长
      sleepTotalCount: 60,
    },
    // 自动阅读定时器
    timerAutoRead: null,

    // 休眠任务
    sleepTask: null,
  }),
  methods: {
    // 切换至下一页
    switchToNextPage() {
      // 先暂定自动滚动
      this.stopAutoRead()
      // 37为左翻页，39为右翻页
      let keyEventCode = this.config.autoSwitchPageFlag === -1 ? 37 : 39;

      // 此时这里应该判断是否为第一章/最终章,方便往回看,形成阅读闭环
      this.fireKeyEvent(document, "keydown", keyEventCode);
      // 等待500毫秒等页面加载完成再重新开启自动滚动
      setTimeout(() => this.startAutoRead(), 500)
    },
    // 计算翻页方向 -1往前翻 1 往后翻
    computeSwitchPageDirection() {
      // 等待两秒等待页面重新加载完成
      const isLast = document.getElementsByClassName("readerFooter_ending_title").length === 1;
      const isFirst = document.getElementsByClassName("chapterItem_current")[0].textContent === '版权信息';

      const needBuyElements = document.getElementsByClassName("readerFooter_button_twoLines")
      const isNeedBuy = needBuyElements.length && needBuyElements[0].textContent.includes('购买');

      // 出现要购买,则自动往前翻,前面肯定不要钱,因为出现要求购买的页面,是不允许往后翻的
      if (isNeedBuy) {
        return -1;
      }

      // 当前是正向，并且已经到达最后一页，则切换到反向
      if (this.config.autoSwitchPageFlag === 1 && isLast) {
        return -1;
      }

      // 当前是逆向，并且已经到底第一页，则切换到正向
      if (this.config.autoSwitchPageFlag === -1 && isFirst) {
        return 1;
      }

      return this.config.autoSwitchPageFlag;
    },
    // 计算滑动方向 -1往上滑动 1往下滑动
    computeScrollPageDirection() {
      const {scrollTop, clientHeight, scrollHeight} = document.documentElement;
      // 已经滚动到底部，切换为往上滚动
      let isReachTop = false
      let isReachBottom = false

      // 已经滚动到顶部
      if (scrollTop === 0) {
        isReachTop = true
      }

      // 已经滚动到底部
      if (scrollTop + clientHeight >= scrollHeight) {
        isReachBottom = true
      }

      // 既没有到达顶部,也没有到达底部,忽略
      if (!(isReachTop || isReachBottom)) {
        return
      }

      // 如果没有开启自动翻页,则停留在当前页面来回刷新
      if (!this.config.isAutoSwitchPage) {
        this.config.scrollFlag = this.config.scrollFlag * -1;
        return;
      }

      // 先计算翻页方向
      this.config.autoSwitchPageFlag = this.computeSwitchPageDirection();

      // 如果开启了自动翻页
      //  如果是最后一页,则切换为往前翻页
      //  如果是第一页,则切换为往后翻页
      // 切换完成页面后,等待两秒钟再进行切换
      this.switchToNextPage();
    },
    // 自动滚动任务
    startAutoRead() {
      if (this.timerAutoRead == null) {
        const _this = this;
        this.timerAutoRead = setInterval(() => {
          // 正在休眠中
          if (this.config.sleepCount > 0) {
            return
          }
          let scrollYOffset = window.scrollY + _this.config.scrollFlag * _this.config.scrollOffset;
          // 模拟滚动
          window.scrollTo(0, scrollYOffset);
          _this.computeScrollPageDirection();
        }, _this.config.timerScrollIMs);
      }
    },
    // stop all reading timer
    stopAutoRead() {
      if (this.timerAutoRead) {
        clearInterval(this.timerAutoRead);
        this.timerAutoRead = null;
      }
    },

    // 启动自动休眠
    startAutoSleep() {
      const {isRandomSleep, isScrolling} = this.config
      if (!isRandomSleep || !!this.sleepTask) {
        return
      }
      this.sleepTask = setInterval(() => {
        // 没有自动阅读了,重置休眠判断
        if (!isScrolling) {
          Object.assign(this.config, {sleepCount: 0})
          return
        }

        const {sleepTotalCount, sleepCount} = this.config

        // 正在休眠中,忽略,但是休眠计数减1
        if (sleepCount > 0) {
          console.log(`正在休眠中,剩余${sleepCount}`)
          Object.assign(this.config, {sleepCount: sleepCount - 1})
          return
        }

        const random = Math.ceil(Math.random() * 1000)
        // 大于等于980,2%概率开启休眠
        if (random >= 980) {
          console.log(`本次随机: ${random}`)
          Object.assign(this.config, {sleepCount: sleepTotalCount})
          console.log(`开启,剩余${sleepTotalCount}`)
        }
      }, 1000)
    },
    stopAutoSleep() {
      console.log('自动阅读停止,关闭休眠任务')
      if (!!this.sleepTask) {
        Object.assign(this.config, {sleepCount: 0})
        clearInterval(this.sleepTask)
      }
    },
  },
  watch: {
    // 切换了 自动阅读 开关
    "config.isScrolling"(newValue, oldValue) {
      if (newValue === true) {
        this.startAutoRead();
        this.startAutoSleep();
      }

      // 阅读开关 被关闭,停止自动阅读,并赋值
      if (newValue === false) {
        this.stopAutoRead();
        this.stopAutoSleep();
      }
    },
  },
};
</script>

<style>
.config-area {
  flex-wrap: wrap;
  position: fixed;
  top: calc(100vh / 2);
  right: 10px;
}

.el-col {
  margin-bottom: 5px;
}

.gray {
  color: #928b8b;
}

.el-card__header {
  padding: 5px 20px !important;
}

.el-divider--horizontal {
  margin: 15px 0;
}

.el-card__body {
  padding: 10px;
}

.el-range-editor--mini.el-input__inner {
  width: 100%;
}
</style>
