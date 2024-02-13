<template>
  <el-card>
    <div slot="header">我的账户</div>
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
            <span>本周阅读时长</span>
            <br><strong class="gray"><span class="count-number">{{
              (me.currentReadingTime / 3600).toFixed(2) / 1
            }}</span>
            小时</strong>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="hover">
          <div class="mini-card">
            <span>总阅读时长</span>
            <br><strong class="gray"><span class="count-number">{{ (me.totalReadingTime / 3600).toFixed(2) / 1 }}</span>
            小时</strong>
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

  </el-card>
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
      // 当前阅读时长
      currentReadingTime: 0,
      // 总共阅读时长
      totalReadingTime: 0,
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
    // 加载个人信息，此处只展示阅读时长
    loadMemberProfile() {
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
        Object.assign(this.me, {currentReadingTime, totalReadingTime})
      })
    }
  },
  mounted() {
    this.loadMemberInfo()
    this.loadMemberProfile()
  }
}
</script>

<style scoped>
.mini-card {
  height: 50px;
}

.count-number {
  font-size: 25px;
}
</style>
