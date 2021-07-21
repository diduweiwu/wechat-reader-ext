<template>
  <div>
    <el-divider>我的账户</el-divider>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card shadow="hover">
          <span>安卓书币</span>
          <br><strong class="gray">{{ me.androidBookCoin }} 个</strong>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <span>苹果书币</span>
          <br><strong class="gray">{{ me.iosBookCoin }} 个</strong>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <span>无限卡</span>
          <br><strong class="gray">{{ me.infiniteCardDays }} 天</strong>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <span>源码地址</span>
          <br><strong class="gray"><a href="https://gitee.com/diduweiwu-itestdev/wechat-reader-ext"
                                      target="_blank">点击直达🧐</a></strong>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Me",
  data: () => ({
    me: {
      // 无限卡天数
      infiniteCardDays: 0,
      // ios端书币
      iosBookCoin: 0,
      // 安卓端书币
      androidBookCoin: 0,
    },
  }),
  methods: {
    // load member info
    loadMemberInfo() {
      const balanceCallback = res => {
        const {giftBalance: iosBookCoin, peerBalance: androidBookCoin, welfare} = res.data
        const {expiredTime} = welfare
        const infiniteCardDays = Math.floor(expiredTime / 3600 / 24)
        Object.assign(this.me, {iosBookCoin, androidBookCoin, infiniteCardDays})
      }
      axios.post(`/web/pay/balance`, {
        "zoneid": "1",
        "release": "1",
        "pf": "weread_wx-2001-iap-2001-iphone"
      }).then(balanceCallback)
    },
  },
  mounted() {
    this.loadMemberInfo()
  }
}
</script>

<style scoped>

</style>
