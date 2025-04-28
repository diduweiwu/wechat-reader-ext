<script setup>
import {reactive, watch} from "vue";
import {updatePartialReadConfig} from "../../config/autoReadConfig";

const props = defineProps({
  config: {
    type: Object,
    required: true,
    default: {}
  }
})

const config = reactive({
  readWith: 1024,
  autoWith: false,
  showToolbar: false,
  randomSleep: false,
  sleepTimeSeconds: 60,
})

if (props.config) {
  Object.assign(config, props.config)
}

// 监听
watch(config, (newVal) => {
  updatePartialReadConfig(newVal)
})
</script>

<template>
  <n-card class="readConfig" size="small" :bordered="false"
          title="其他设置"
          :segmented="{
      content: true,
      footer: 'soft',
    }">
    <n-form size="small" label-placement="left" :model="config" label-width="auto">
      <n-form-item label="阅读宽度">
        <n-input-number placeholder=""
                        v-model:value="config.readWith"
                        button-placement="both"
                        :min="1"
                        :max="4096">
          <template #suffix>像素</template>
        </n-input-number>
      </n-form-item>

      <n-form-item label="自动宽度">
        <n-radio-group v-model:value="config.autoWith">
          <n-space justify="space-evenly">
            <n-radio :value="true">开启</n-radio>
            <n-radio :value="false">关闭</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="工具栏">
        <n-radio-group v-model:value="config.showToolbar">
          <n-space justify="space-evenly">
            <n-radio :value="true">显示</n-radio>
            <n-radio :value="false">隐藏</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="随机休眠">
        <n-radio-group v-model:value="config.randomSleep">
          <n-space justify="space-evenly">
            <n-radio :value="true">开启</n-radio>
            <n-radio :value="false">关闭</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>

      <n-form-item label="休眠时长">
        <n-input-number placeholder=""
                        v-model:value="config.sleepTimeSeconds"
                        button-placement="both"
                        :min="1"
                        :max="1000">
          <template #suffix>秒</template>
        </n-input-number>
      </n-form-item>
    </n-form>
  </n-card>
</template>

<style scoped>

</style>
