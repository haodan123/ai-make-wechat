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
import { ref } from 'vue'

// 账号与安全
const handleAccountSecurity = () => {
  uni.navigateTo({
    url: '/pages/profile/settings/account-security/account-security'
  })
}

// 隐私设置
const handlePrivacy = () => {
  uni.navigateTo({
    url: '/pages/profile/settings/privacy/privacy'
  })
}

// 新消息通知
const handleNotification = () => {
  uni.navigateTo({
    url: '/pages/profile/settings/notification/notification'
  })
}

// 界面显示
const handleDisplay = () => {
  uni.navigateTo({
    url: '/pages/profile/settings/display/display'
  })
}

// 语言设置
const handleLanguage = () => {
  uni.showActionSheet({
    itemList: ['简体中文', 'English', '日本語'],
    success: function (res) {
      const languages = ['简体中文', 'English', '日本語']
      const selectedLanguage = languages[res.tapIndex]
      uni.showToast({
        title: `已切换为${selectedLanguage}`,
        icon: 'success'
      })
    }
  })
}

// 关于
const handleAbout = () => {
  uni.navigateTo({
    url: '/pages/profile/settings/about/about'
  })
}

// 退出登录
const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        // 清除用户登录状态
        uni.removeStorageSync('userInfo')
        uni.removeStorageSync('token')
        
        // 重定向到登录页
        uni.reLaunch({
          url: '/pages/login/login'
        })
        
        uni.showToast({
          title: '已退出登录',
          icon: 'success'
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