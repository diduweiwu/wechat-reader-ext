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
      <el-row :gutter="10">
        <el-col :span="12">
          <el-card>
            <div slot="header">阅读设置</div>
            <el-form ref="autoScroll" :model="config" label-width="100px" size="mini">
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
                <el-radio-group:disabled="config.isScrolling"v-model="config.scrollFlag">
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

              <el-form-item>
                <template #label>
                  <el-tooltip placement="left">
                    <div slot="content">
                      开启自动刷时长模式后，可将页面放到后台 <br />
                      会间隔一定时间刷新页面，避免被微信读书检测导致暂停时长累积
                      <br />
                      如果您一直在前端阅读，则可以关闭该项避免影响阅读体验
                    </div>
                    <span><i class="el-icon-info" /> 自动时长</span>
                  </el-tooltip>
                </template>
                <el-radio-group v-model="config.timeFlashMode">
                  <el-radio border :label="true">开启</el-radio>
                  <el-radio border :label="false">关闭</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card>
            <el-form ref="uiConfig" :model="config" label-width="100px" size="mini">
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

export default {
  name: "wechatReaderExt",
  components: { Me },
  mixins: [uiConfig],
  data: () => ({
    config: {
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

      // time flash mode
      timeFlashMode: false,
    },
    timerScroll: null,
    timeFlash: null,
    menuTab: "reading",
  }),
  methods: {
    // 计算翻页方向 -1往前翻 1 往后翻
    computeSwitchPageFlag() {
      // 等待两秒等待页面重新加载完成
      const isLast =
        document.getElementsByClassName("readerFooter_button").length === 0;
      const isFirst =
        document.getElementsByClassName("readerBookInfo").length === 1;
      // 当前是正向，并且已经到达最后一页，则切换到反向
      if (this.config.autoSwitchPageFlag === 1 && isLast) {
        return -1;
      }

      // 当前是逆向，并且已经到底第一页，则切换到反向
      if (this.config.autoSwitchPageFlag === -1 && isFirst) {
        return 1;
      }

      return this.config.autoSwitchPageFlag;
    },
    // 计算滑动方向 -1往上滑动 1往下滑动
    computeScrollFlag() {
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
    startAutoScroll() {
      if (this.timerScroll == null) {
        const _this = this;
        this.timerScroll = setInterval(function () {
          let scrollYOffset =
            window.pageYOffset +
            _this.config.scrollFlag * _this.config.scrollOffset;
          // 模拟滚动
          window.scrollTo(0, scrollYOffset);
          _this.computeScrollFlag();
        }, _this.config.timerScrollIMs);
      }
    },

    fireKeyEvent(el, evtType, keyCode) {
      let evtObj;
      if (document.createEvent) {
        // firefox 浏览器下模拟事件
        if (window.KeyEvent) {
          evtObj = document.createEvent("KeyEvents");
          evtObj.initKeyEvent(evtType, true, true);
          el.dispatchEvent(evtObj);
          return;
        }

        // chrome 浏览器下模拟事件
        evtObj = document.createEvent("UIEvents");
        evtObj.initUIEvent(evtType, true, true);

        delete evtObj.keyCode;
        //为了模拟keycode
        if (typeof evtObj.keyCode === "undefined") {
          Object.defineProperty(evtObj, "keyCode", { value: keyCode });
        } else {
          evtObj.key = String.fromCharCode(keyCode);
        }

        if (typeof evtObj.ctrlKey === "undefined") {
          //为了模拟ctrl键
          Object.defineProperty(evtObj, "ctrlKey", { value: true });
        } else {
          evtObj.ctrlKey = true;
        }

        el.dispatchEvent(evtObj);
        return;
      }

      //IE 浏览器下模拟事件
      if (document.createEventObject) {
        evtObj = document.createEventObject();
        evtObj.keyCode = keyCode;
        el.fireEvent("on" + evtType, evtObj);
      }
    },
    switchToNextPage() {
      // 获取翻页方向标识值,有下一页按钮则为正向翻页，没有的话则反向翻页
      this.config.autoSwitchPageFlag = this.computeSwitchPageFlag();
      // 37为左翻页，39为右翻页
      let keyEventCode = this.config.autoSwitchPageFlag === -1 ? 37 : 39;

      // 此时这里应该判断是否为第一章/最终章,方便往回看,形成阅读闭环
      this.fireKeyEvent(document, "keydown", keyEventCode);
    },
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
    // stop all reading timer
    stopAutoScroll() {
      if (this.timerScroll) {
        clearInterval(this.timerScroll);
        this.timerScroll = null;
      }
    },
    // stop auto flash mode
    stopAutoFlash() {
      if (this.timeFlash) {
        clearInterval(this.timeFlash);
        this.timeFlash = null;
      }
    },
  },
  watch: {
    "config.isScrolling"(newValue, oldValue) {
      if (newValue === true) {
        this.startAutoScroll();
      }

      if (newValue === false) {
        this.stopAutoScroll();
        this.stopAutoFlash();
      }
    },
    "config.scrollFlag": {
      handler: function (newValue, oldValue) {
        // 翻页条件 1.当前正在正向滚动 2.且到达底部时候 3.滚动方向发生改变(即-1->1)
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
    "config.isHideControls": {
      handler: function (newValue, oldValue) {
        // 只有在正向滚动，并且到达底部时候，才进行翻页
        document.querySelector(".readerControls").style.opacity = newValue
          ? "1"
          : "0";
      },
      deep: true,
      immediate: true,
    },
    "config.timeFlashMode"(newValue, oldValue) {
      if (newValue === true) {
        if (this.timeFlash === null) {
          // 70秒自动下一页避免被判定为后台
          this.timeFlash = setInterval(this.switchToNextPage, 70000);
          return false;
        }
      }

      if (newValue === false) {
        this.stopAutoFlash();
      }
    },
    config: {
      handler: function () {
        localStorage.setItem("config", JSON.stringify(this.config));
      },
      deep: true,
    },
  },
  mounted() {
    this.loadConfig();
  },
};
</script>

<style scoped>
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
</style>
