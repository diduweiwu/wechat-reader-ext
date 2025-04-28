<script setup>

import MiniCard from "./MiniCard.vue";
import {reactive} from "vue";

const config = reactive({
  // 无限卡天数
  infiniteCardDays: 0,
  // ios端书币
  iosBookCoin: 0,
  // 安卓端书币
  androidBookCoin: 0,
  // 当前阅读时长
  currentReadingTime: 0,
  // 总共阅读时长
  totalReadingTime: 0,
})
</script>

<template>
  <n-card class="readConfig" size="small" :bordered="false"
          title="我的账户"
          :segmented="{
      content: true,
      footer: 'soft',
    }">
    <n-grid x-gap="10" y-gap="10" cols="2">
      <n-grid-item>
        <mini-card
          title="安卓书币"
          value="0"
          unit="个"/>
      </n-grid-item>
      <n-grid-item>
        <mini-card
          title="苹果书币"
          value="0"
          unit="个"/>
      </n-grid-item>
      <n-grid-item>
        <mini-card
          title="本周阅读时长"
          value="0"
          unit="小时"/>
      </n-grid-item>
      <n-grid-item>
        <mini-card
          title="总阅读时长"
          value="0"
          unit="小时"/>
      </n-grid-item>
      <n-grid-item>
        <mini-card
          title="无限卡"
          value="0"
          unit="天"/>
      </n-grid-item>
      <n-grid-item>
        <div class="account-info">
          <n-space vertical>
            <span>源码地址</span>
            <strong class="gray">
              <a href="https://gitee.com/diduweiwu-itestdev/wechat-reader-ext"
                 target="_blank">点击直达🧐</a>
            </strong>
          </n-space>
        </div>
      </n-grid-item>
    </n-grid>
  </n-card>
</template>

<style scoped>
.account-info {
  border: lightgray solid 1px;
  border-radius: 4px;
  padding: 1px 10px;
  height: 100%;
}
</style>
