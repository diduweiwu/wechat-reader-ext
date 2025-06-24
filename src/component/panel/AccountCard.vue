<script setup>

import {onMounted, reactive} from "vue";
import MiniCard from "@/component/panel/MiniCard.vue";
import axios from "axios";

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


// load member info
const loadMemberInfo = () => {
  const balanceCallback = res => {
    const {giftBalance: iosBookCoin, peerBalance: androidBookCoin, welfare} = res.data
    const {expiredTime} = welfare
    const infiniteCardDays = Math.floor(expiredTime / 3600 / 24)
    Object.assign(config, {iosBookCoin, androidBookCoin, infiniteCardDays})
  }
  axios.post(`/web/pay/balance`, {
    "zoneid": "1",
    "release": "1",
    "pf": "weread_wx-2001-iap-2001-iphone"
  }).then(balanceCallback)
}

// 加载个人信息，此处只展示阅读时长
const loadMemberProfile = ()=> {
  let profileApi = "https://i.weread.qq.com/user/profile"
  axios.get(profileApi, {
    withCredentials: true,
    params: {
      gender: 1,
      signature: 1,
      vDesc: 1,
      location: 1,
      totalReadingTime: 1,
      currentReadingTime: 1,
      finishedBookCount: 1,
      followerCount: 1,
      followingCount: 1,
      totalLikedCount: 1,
      isFollowing: 1,
      platform: "wp",
    }
  }).then(response => {
    const {status, data} = response
    if (status !== 200) {
      return
    }
    const {currentReadingTime, totalReadingTime} = data
    Object.assign(config, {currentReadingTime, totalReadingTime})
  })
}

onMounted(() => {
  loadMemberInfo()
  loadMemberProfile()
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
          :value="config.androidBookCoin"
          unit="个"/>
      </n-grid-item>
      <n-grid-item>
        <mini-card
          title="苹果书币"
          :value="config.iosBookCoin"
          unit="个"/>
      </n-grid-item>
      <n-grid-item>
        <mini-card
          title="本周阅读时长"
          :value="config.currentReadingTime"
          unit="小时"/>
      </n-grid-item>
      <n-grid-item>
        <mini-card
          title="总阅读时长"
          :value="config.totalReadingTime"
          unit="小时"/>
      </n-grid-item>
      <n-grid-item>
        <mini-card
          title="无限卡"
          :value="config.infiniteCardDays"
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
