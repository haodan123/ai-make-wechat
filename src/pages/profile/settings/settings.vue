<template>
  <view class="settings-page">
    <!-- 账号与安全 -->
    <view class="settings-group">
      <view class="settings-item" @tap="handleAccountSecurity">
        <text class="label">账号与安全</text>
        <text class="iconfont icon-right"></text>
      </view>
    </view>

    <!-- 隐私 -->
    <view class="settings-group">
      <view class="settings-item" @tap="handlePrivacy">
        <text class="label">隐私</text>
        <text class="iconfont icon-right"></text>
      </view>
    </view>

    <!-- 通用 -->
    <view class="settings-group">
      <view class="settings-item" @tap="handleNotification">
        <text class="label">新消息通知</text>
        <text class="iconfont icon-right"></text>
      </view>
      <view class="settings-item" @tap="handleDisplay">
        <text class="label">界面显示</text>
        <text class="iconfont icon-right"></text>
      </view>
      <view class="settings-item" @tap="handleLanguage">
        <text class="label">语言</text>
        <text class="value">简体中文</text>
        <text class="iconfont icon-right"></text>
      </view>
    </view>

    <!-- 关于 -->
    <view class="settings-group">
      <view class="settings-item" @tap="handleAbout">
        <text class="label">关于微信</text>
        <text class="value">版本 8.0.45</text>
        <text class="iconfont icon-right"></text>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-button" @tap="handleLogout">
      <text>退出登录</text>
    </view>
  </view>
</template>

<script setup>
// 账号与安全
const handleAccountSecurity = () => {
  uni.showToast({
    title: '账号与安全功能开发中',
    icon: 'none'
  })
}

// 隐私设置
const handlePrivacy = () => {
  uni.showToast({
    title: '隐私设置功能开发中',
    icon: 'none'
  })
}

// 新消息通知
const handleNotification = () => {
  uni.showToast({
    title: '通知设置功能开发中',
    icon: 'none'
  })
}

// 界面显示
const handleDisplay = () => {
  uni.showToast({
    title: '界面设置功能开发中',
    icon: 'none'
  })
}

// 语言设置
const handleLanguage = () => {
  uni.showToast({
    title: '语言设置功能开发中',
    icon: 'none'
  })
}

// 关于
const handleAbout = () => {
  uni.showToast({
    title: '关于页面开发中',
    icon: 'none'
  })
}

// 退出登录
const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.navigateTo({
          url: '/pages/login/login'
        })
      }
    }
  })
}
</script>

<style lang="scss">
.settings-page {
  background-color: #F6F7F9;
  min-height: 100vh;

  .settings-group {
    background-color: #FFFFFF;
    margin-top: 20rpx;

    .settings-item {
      display: flex;
      align-items: center;
      padding: 30rpx;
      border-bottom: 1rpx solid #EBEDF0;

      &:last-child {
        border-bottom: none;
      }

      .label {
        flex: 1;
        font-size: 32rpx;
        color: #333333;
      }

      .value {
        font-size: 28rpx;
        color: #999999;
        margin-right: 10rpx;
      }

      .icon-right {
        font-size: 32rpx;
        color: #999999;
      }
    }
  }

  .logout-button {
    margin: 40rpx 30rpx;
    background-color: #FFFFFF;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    border-radius: 12rpx;
    font-size: 32rpx;
    color: #FF4D4F;

    &:active {
      opacity: 0.8;
    }
  }
}
</style>