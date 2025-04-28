<script setup>

import {reactive, watch} from "vue";
import {updatePartialReadConfig} from "../../config/autoReadConfig";
import {emitter, eventKey} from "../../helper/eventHelper";

const props = defineProps({
  config: {
    type: Object,
    required: true,
    default: {}
  }
})

const config = reactive({
  readStep: 100,
  readIntervalMillis: 100,
  readDirection: "down",
  switchPageDirection: "right",
  autoSwitch: false,
  autoRefresh: false,
  autoRefreshSeconds: 10,
})

if (props.config) {
  Object.assign(config, props.config)
}

// 监听
watch(config, (newVal) => {
  updatePartialReadConfig(newVal)
  emitter.emit(eventKey.READ_CONFIG_UPDATE_EVENT, newVal)
})
</script>

<template>
  <n-card class="readConfig" size="small" :bordered="false"
          title="阅读设置"
          :segmented="{
      content: true,
      footer: 'soft',
    }">
    <n-form size="small" label-placement="left" :model="config" label-width="auto">
      <n-form-item label="自动步长">
        <n-input-number placeholder=""
                        v-model:value="config.readStep"
                        button-placement="both"
                        :min="1"
                        :max="1000">
          <template #suffix>像素</template>
        </n-input-number>
      </n-form-item>
      <n-form-item label="滚动间隔">
        <n-input-number placeholder=""
                        v-model:value="config.readIntervalMillis"
                        button-placement="both"
                        :min="2"
                        :max="10000">
          <template #suffix>毫秒</template>
        </n-input-number>
      </n-form-item>
      <n-form-item label="阅读方向">
        <n-radio-group v-model:value="config.readDirection">
          <n-space justify="space-evenly">
            <n-radio value="up">往上</n-radio>
            <n-radio value="down">往下</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="翻页方向">
        <n-radio-group v-model:value="config.switchPageDirection">
          <n-space justify="space-evenly">
            <n-radio value="left">往左</n-radio>
            <n-radio value="right">往右</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="自动翻页">
        <n-radio-group v-model:value="config.autoSwitch">
          <n-space justify="space-evenly">
            <n-radio :value="true">开启</n-radio>
            <n-radio :value="false">关闭</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="❗️定时刷新">
        <n-radio-group v-model:value="config.autoRefresh">
          <n-space justify="space-evenly">
            <n-radio :value="true">开启</n-radio>
            <n-radio :value="false">关闭</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="刷新间隔">
        <n-input-number placeholder=""
                        v-model:value="config.autoRefreshSeconds"
                        button-placement="both"
                        :min="5"
                        :max="3600">
          <template #suffix>秒</template>
        </n-input-number>
      </n-form-item>
    </n-form>
    <n-alert :bordered="false" type="success">提示：ctrl+回车键 可快速 开启/关闭 自动阅读</n-alert>
  </n-card>
</template>

<style scoped>

</style>
