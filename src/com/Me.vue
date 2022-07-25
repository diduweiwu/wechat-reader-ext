<template>
  <div style="height: 268px">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card shadow="hover">
          <div class="mini-card">
            <span>安卓书币</span>
            <br><strong class="gray"><span class="count-number">{{ me.androidBookCoin }}</span> 个</strong>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <div class="mini-card">
            <span>苹果书币</span>
            <br><strong class="gray"><span class="count-number">{{ me.iosBookCoin }}</span> 个</strong>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <div class="mini-card">
            <span>无限卡</span>
            <br><strong class="gray"><span class="count-number">{{ me.infiniteCardDays }}</span> 天</strong>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <div class="mini-card">
            <span>源码地址</span>
            <br><strong class="gray"><a href="https://gitee.com/diduweiwu-itestdev/wechat-reader-ext"
                                        target="_blank">点击直达🧐</a></strong>
          </div>
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
.mini-card {
  height: 95px;
}
.count-number{
font-size: 35px;
}
</style>
