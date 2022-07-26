<template>
  <el-row :gutter="5">
    <el-col :span="12">
      <el-card style="min-height: 450px">
        <div slot="header">阅读设置</div>
        <el-form ref="autoScroll"
                 :disabled="config.isScrolling"
                 :model="config"
                 label-width="100px"
                 size="mini">
          <el-form-item label="自动阅读" v-if="false">
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

          <br/>
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
            <el-radio-group v-model="config.isAutoSwitchPage">
              <el-radio border :label="true">开启</el-radio>
              <el-radio border :label="false">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="翻页方向">
            <el-radio-group v-model="config.autoSwitchPageFlag">
              <el-radio border :label="1">正向</el-radio>
              <el-radio border :label="-1">反向</el-radio>
            </el-radio-group>
          </el-form-item>

          <br/>
          <el-form-item>
            <template #label>
              <el-tooltip placement="left">
                <div slot="content">
                  <p>开启定时翻页后，可将页面放到后台,推荐设置为30秒~60秒之间</p>
                  <p>会间隔一定时间进行翻页操作，避免被微信读书检测导致暂停时长累积</p>
                  <strong>!如果您一直在前端阅读，则可以关闭该项避免影响阅读体验!</strong>
                </div>
                <span><i class="el-icon-info"/> 定时翻页</span>
              </el-tooltip>
            </template>
            <el-radio-group v-model="config.timeFlashMode">
              <el-radio border :label="true">开启</el-radio>
              <el-radio border :label="false">关闭</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="翻页间隔">
            <el-input
              :disabled="!config.timeFlashMode"
              v-model="config.countPageReloadSeconds"
              min="10"
              max="600"
              maxlength="3"
              type="number"
            >
              <template #suffix>
                <i>秒</i>
              </template>
            </el-input>
          </el-form-item>

        </el-form>
      </el-card>
    </el-col>

    <el-col :span="12">
      <el-card header="其他设置">
        <el-form
          ref="uiConfig"
          :model="config"
          label-width="100px"
          :disabled="config.isScrolling"
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

          <el-form-item label="随机休眠">
            <template #label>
              <el-tooltip placement="left">
                <template #content>
                  开启后,会有%1的概率开启休眠指定时长(时长为下面配置的 休眠时长 ),休眠结束后会继续自动阅读
                </template>
                <span><i class="el-icon-info"/> 随机休眠</span>
              </el-tooltip>
            </template>
            <el-radio-group v-model="config.isRandomSleep">
              <el-radio border :label="true">开启</el-radio>
              <el-radio border :label="false">关闭</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="休眠时长">
            <el-input
              :disabled="!config.isRandomSleep"
              v-model="config.sleepTotalCount"
              min="10"
              max="6000"
              maxlength="4"
              type="number"
            >
              <template #suffix>
                <i>秒</i>
              </template>
            </el-input>
          </el-form-item>
        </el-form>

      </el-card>
    </el-col>

    <el-col :span="12">
      <Me/>
    </el-col>
  </el-row>
</template>

<script>
import Me from "./Me.vue";

export default {
  name: "ReadConfig",
  components: {Me},
  props: {
    config: {type: Object, default: {}},
  },
  data() {
    return {
      sleepInterval: null
    }
  },
  watch: {
    // 开启自动时长模式
    // 自动时长模式下会做以下操作
    // 1.开启自动阅读
    // 2.每5分钟刷新一次页面
    "config.timeFlashMode"(newValue, oldValue) {
      Object.assign(this.config, {timeFlashMode: !!newValue});
    },
  },
}
</script>

<style scoped>

</style>
