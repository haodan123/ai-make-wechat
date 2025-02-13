<template>
  <view class="discover-page">
    <view class="discover-list">
      <!-- 朋友圈 -->
      <view class="discover-item" @tap="navigateToMoments">
        <view class="item-left">
          <text class="iconfont icon-moments"></text>
          <text class="name">朋友圈</text>
        </view>
        <text class="iconfont icon-right"></text>
      </view>

      <!-- 视频号 -->
      <view class="discover-item" @tap="navigateToVideoChannel">
        <view class="item-left">
          <text class="iconfont icon-video"></text>
          <text class="name">视频号</text>
        </view>
        <text class="iconfont icon-right"></text>
      </view>

      <!-- 直播 -->
      <view class="discover-item" @tap="navigateToLive">
        <view class="item-left">
          <text class="iconfont icon-live"></text>
          <text class="name">直播</text>
        </view>
        <text class="iconfont icon-right"></text>
      </view>

      <!-- 扫一扫 -->
      <view class="discover-item" @tap="handleScan">
        <view class="item-left">
          <text class="iconfont icon-scan"></text>
          <text class="name">扫一扫</text>
        </view>
        <text class="iconfont icon-right"></text>
      </view>

      <!-- 摇一摇 -->
      <view class="discover-item" @tap="handleShake">
        <view class="item-left">
          <text class="iconfont icon-shake"></text>
          <text class="name">摇一摇</text>
        </view>
        <text class="iconfont icon-right"></text>
      </view>

      <!-- 小程序 -->
      <view class="discover-item" @tap="navigateToMiniPrograms">
        <view class="item-left">
          <text class="iconfont icon-miniprogram"></text>
          <text class="name">小程序</text>
        </view>
        <text class="iconfont icon-right"></text>
      </view>

      <!-- 游戏 -->
      <view class="discover-item" @tap="navigateToGames">
        <view class="item-left">
          <text class="iconfont icon-game"></text>
          <text class="name">游戏</text>
        </view>
        <text class="iconfont icon-right"></text>
      </view>
    </view>
  </view>
</template>

<script setup>
// 跳转到朋友圈
const navigateToMoments = () => {
  uni.navigateTo({
    url: '/pages/discover/moments/moments'
  })
}

// 跳转到视频号
const navigateToVideoChannel = () => {
  uni.navigateTo({
    url: '/pages/discover/video/video'
  })
}

// 跳转到直播
const navigateToLive = () => {
  uni.navigateTo({
    url: '/pages/discover/live/live'
  })
}

// 扫一扫功能
const handleScan = () => {
  // 添加动画效果
  const scanAnimation = uni.createAnimation({
    duration: 500,
    timingFunction: 'ease'
  })
  scanAnimation.scale(1.2).step()
  scanAnimation.scale(1).step()

  uni.scanCode({
    success: (res) => {
      // 震动反馈
      uni.vibrateShort()
      uni.showToast({
        title: '扫描成功',
        icon: 'success'
      })
      // 处理扫描结果
      handleScanResult(res.result)
    },
    fail: () => {
      uni.showToast({
        title: '扫描失败',
        icon: 'error'
      })
    }
  })
}

// 处理扫描结果
const handleScanResult = (result) => {
  // 判断扫描结果类型
  if (result.startsWith('http')) {
    uni.navigateTo({
      url: `/pages/webview/webview?url=${encodeURIComponent(result)}`
    })
  } else if (result.startsWith('wxp://')) {
    // 处理支付码
    uni.showToast({
      title: '暂不支持支付码',
      icon: 'none'
    })
  } else {
    // 其他二维码内容
    uni.showModal({
      title: '扫描结果',
      content: result,
      showCancel: false
    })
  }
}

// 摇一摇功能
const handleShake = () => {
  let isShaking = false
  let lastTime = 0
  let lastX = 0
  let lastY = 0
  let lastZ = 0
  const SHAKE_THRESHOLD = 15

  uni.onAccelerometerChange((res) => {
    const curTime = Date.now()
    if ((curTime - lastTime) > 100) {
      const diffTime = curTime - lastTime
      const speed = Math.abs(res.x + res.y + res.z - lastX - lastY - lastZ) / diffTime * 10000

      if (speed > SHAKE_THRESHOLD && !isShaking) {
        isShaking = true
        // 震动反馈
        uni.vibrateShort()
        // 播放摇一摇动画
        playShakeAnimation()
        // 随机匹配附近的人
        matchNearbyUser()
        setTimeout(() => {
          isShaking = false
        }, 2000)
      }

      lastTime = curTime
      lastX = res.x
      lastY = res.y
      lastZ = res.z
    }
  })
}

// 播放摇一摇动画
const playShakeAnimation = () => {
  const shakeAnimation = uni.createAnimation({
    duration: 200,
    timingFunction: 'ease'
  })
  shakeAnimation.rotate(10).step()
  shakeAnimation.rotate(-10).step()
  shakeAnimation.rotate(0).step()
}

// 匹配附近的人
const matchNearbyUser = () => {
  uni.showLoading({
    title: '正在搜索附近的人...'
  })

  setTimeout(() => {
    uni.hideLoading()
    uni.showModal({
      title: '匹配成功',
      content: '找到了一位附近的朋友，是否打招呼？',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({
            url: '/pages/chat/chat'
          })
        }
      }
    })
  }, 2000)
}

// 跳转到小程序页面
const navigateToMiniPrograms = () => {
  uni.showToast({
    title: '小程序功能开发中',
    icon: 'none'
  })
}

// 跳转到游戏中心
const navigateToGames = () => {
  uni.navigateTo({
    url: '/pages/discover/game/game'
  })
}
</script>

<style lang="scss">
.discover-page {
  background: linear-gradient(135deg, #F6F7F9, #EDEDED);
  min-height: 100vh;
  padding: 20rpx;

  .discover-list {
    margin-top: 20rpx;
    border-radius: 24rpx;
    overflow: hidden;
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20rpx);

    .discover-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 32rpx 40rpx;
      background: rgba(255, 255, 255, 0.6);
      border-bottom: 1rpx solid rgba(237, 237, 237, 0.6);
      transition: all 0.3s ease;

      &:active {
        transform: scale(0.98);
        background: rgba(255, 255, 255, 0.8);
      }

      .item-left {
        display: flex;
        align-items: center;

        .iconfont {
          font-size: 44rpx;
          margin-right: 24rpx;
          color: #07C160;
          transition: transform 0.3s ease;

          &:active {
            transform: scale(1.1);
          }
        }

        .name {
          font-size: 32rpx;
          color: #333333;
          font-weight: 500;
        }
      }

      .icon-right {
        color: #BBBBBB;
        font-size: 32rpx;
        transition: transform 0.3s ease;
      }

      &:hover .icon-right {
        transform: translateX(4rpx);
      }
    }
  }
}
</style>