<template>
  <el-popover placement="left" width="800" title="阅读配置">
    <template #reference>
      <el-button
        :style="{ opacity: config.isScrolling ? 0.5 : 1 }"
        type="default"
        class="config-button"
        plain
        circle
        >读
      </el-button>
    </template>

    <el-card shadow="hover">
      <el-row :gutter="5">
        <el-col :span="12">
          <el-card>
            <div slot="header">阅读设置</div>
            <el-form
              ref="autoScroll"
              :model="config"
              label-width="100px"
              size="mini"
            >
              <el-form-item>
                <template #label>
                  <el-tooltip placement="left">
                    <div slot="content">
                      开启自动刷时长模式后，可将页面放到后台 <br />
                      会间隔一定时间刷新页面，避免被微信读书检测导致暂停时长累积
                      <br />
                      如果您一直在前端阅读，则可以关闭该项避免影响阅读体验
                    </div>
                    <span><i class="el-icon-info" />自动时长</span>
                  </el-tooltip>
                </template>
                <el-radio-group v-model="config.timeFlashMode">
                  <el-radio border :label="true">开启</el-radio>
                  <el-radio border :label="false">关闭</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="自动阅读">
                <el-radio-group v-model="config.isScrolling" size="mini">
                  <el-radio border :label="true">开启</el-radio>
                  <el-radio border :label="false">关闭</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="自动步长">
                <el-input
                  :disabled="config.isScrolling"
                  v-model="config.scrollOffset"
                  min="1"
                  max="200"
                  maxlength="3"
                  type="number"
                >
                  <template #suffix>
                    <i>像素</i>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item label="滚动间隔">
                <el-input
                  :disabled="config.isScrolling"
                  v-model="config.timerScrollIMs"
                  min="200"
                  max="90000"
                  maxlength="5"
                >
                  <template #suffix><i>毫秒</i></template>
                </el-input>
              </el-form-item>

              <el-form-item label="阅读方向">
                <el-radio-group
                  :disabled="config.isScrolling"
                  v-model="config.scrollFlag"
                >
                  <el-radio border :label="1">正向</el-radio>
                  <el-radio border :label="-1">反向</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="自动翻页">
                <el-radio-group
                  :disabled="config.isScrolling"
                  v-model="config.isAutoSwitchPage"
                >
                  <el-radio border :label="true">开启</el-radio>
                  <el-radio border :label="false">关闭</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="翻页方向">
                <el-radio-group
                  v-model="config.autoSwitchPageFlag"
                  :disabled="config.isScrolling || !config.isAutoSwitchPage"
                >
                  <el-radio border :label="1">正向</el-radio>
                  <el-radio border :label="-1">反向</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card>
            <div slot="header">界面设置</div>
            <el-form
              ref="uiConfig"
              :model="config"
              label-width="100px"
              size="mini"
            >
              <el-form-item label="阅读宽度">
                <el-input
                  v-model="config.readContentWidth"
                  type="number"
                  :max="20000"
                  :min="100"
                >
                  <template #suffix><i>像素</i></template>
                </el-input>
              </el-form-item>

              <el-form-item label="工具栏">
                <el-radio-group v-model="config.isHideControls">
                  <el-radio border :label="true">显示</el-radio>
                  <el-radio border :label="false">隐藏</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card>
            <div slot="header">我的账户</div>
            <Me />
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </el-popover>
</template>

<script>
import Me from "@/com/Me";
import uiConfig from "@/mixins/uiConfig";
import pageReload from "@/mixins/pageReload";
import keyEvent from "@/mixins/keyEvent";
import appConfig from "@/mixins/appConfig";
import switchPage from "@/mixins/switchPage";

export default {
  name: "wechatReaderExt",
  components: { Me },
  mixins: [uiConfig, pageReload, keyEvent, appConfig, switchPage],
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
      isAutoSwitchPage: false,
      // 自动翻页方向
      autoSwitchPageFlag: 1,

      // 自动刷时长模式
      timeFlashMode: false,
    },
    // 自动阅读定时器
    timerAutoRead: null,

    // 自动下一页定时器
    timeAutoSwitchPage: null,
  }),
  methods: {
    // 计算翻页方向 -1往前翻 1 往后翻
    computeSwitchPageDirection() {
      // 等待两秒等待页面重新加载完成
      const isLast =
        document.getElementsByClassName("readerFooter_button").length === 0;
      const isFirst =
        document.getElementsByClassName("readerBookInfo").length === 1;
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
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      // 已经滚动到底部，切换为往上滚动
      if (scrollTop + clientHeight >= scrollHeight) {
        this.config.scrollFlag = -1;
      }

      // 已经滚动到顶部，切换为往下滚动
      if (scrollTop === 0) {
        this.config.scrollFlag = 1;
      }
    },
    // 自动滚动任务
    startAutoScroll() {
      if (this.timerAutoRead == null) {
        const _this = this;
        this.timerAutoRead = setInterval(function () {
          let scrollYOffset =
            window.pageYOffset +
            _this.config.scrollFlag * _this.config.scrollOffset;
          // 模拟滚动
          window.scrollTo(0, scrollYOffset);
          _this.computeScrollPageDirection();
        }, _this.config.timerScrollIMs);
      }
    },
    // stop all reading timer
    stopAutoScroll() {
      if (this.timerAutoRead) {
        clearInterval(this.timerAutoRead);
        this.timerAutoRead = null;
      }
    },
    // 切换至下一页
    switchToNextPage() {
      // 获取翻页方向标识值,有下一页按钮则为正向翻页，没有的话则反向翻页
      this.config.autoSwitchPageFlag = this.computeSwitchPageDirection();
      // 37为左翻页，39为右翻页
      let keyEventCode = this.config.autoSwitchPageFlag === -1 ? 37 : 39;

      // 此时这里应该判断是否为第一章/最终章,方便往回看,形成阅读闭环
      this.fireKeyEvent(document, "keydown", keyEventCode);
    },

    // 开启刷时长模式
    startAutoFlash() {
      if (this.timeAutoSwitchPage === null) {
        // 70秒刷新一下页面避免被判定为后台
        this.timeAutoSwitchPage = this.startAutoSwitchPage(
          this.switchToNextPage
        );
      }
    },
    // 停止刷时长模式
    stopAutoFlash() {
      if (this.timeAutoSwitchPage) {
        clearInterval(this.timeAutoSwitchPage);
        this.timeAutoSwitchPage = null;
        this.stopAutoSwitchPage();
      }
    },
  },
  watch: {
    // 切换了 自动阅读 开关
    "config.isScrolling"(newValue, oldValue) {
      if (newValue === true) {
        this.startAutoScroll();
      }

      if (newValue === false) {
        this.stopAutoScroll();
        this.stopAutoFlash();
        Object.assign(this.config, { timeFlashMode: false });
      }
    },
    // 切换了 阅读方向 开关
    "config.scrollFlag": {
      handler: function (newValue, oldValue) {
        // 翻页条件 1.当前正在正向滚动 2.且到达底部时候 3.滚动方向发生改变(即-1->1) 4.开启了自动翻页
        const isScrollSwitched = newValue !== oldValue;
        if (
          this.config.isScrolling &&
          oldValue === 1 &&
          isScrollSwitched &&
          this.config.isAutoSwitchPage
        ) {
          this.switchToNextPage();
        }
      },
      deep: true,
    },
    // 开启自动时长模式
    // 自动时长模式下会做以下操作
    // 1.开启自动阅读
    // 2.每5分钟刷新一次页面
    "config.timeFlashMode"(newValue, oldValue) {
      if (newValue === true) {
        // 开启自动阅读相关功能
        Object.assign(this.config, { isScrolling: true });
        // 开启定时下一页
        this.startAutoFlash();
        // 开启定时刷新页面（避免内存占用）
        this.startAutoReloadPage();
      }

      if (newValue === false) {
        // 关闭自动阅读相关功能
        Object.assign(this.config, { isScrolling: false });

        // 关闭定时下一页
        this.stopAutoFlash();
        // 关闭定时刷新页面
        this.stopAutoReloadPage();
      }
    },
  },
};
</script>

<style>
.config-button {
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
</style>
