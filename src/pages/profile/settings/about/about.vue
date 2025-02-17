<template>
  <view class="about-page">
    <view class="logo-section">
      <image class="logo" src="/static/logo.png" mode="aspectFit"></image>
      <text class="version">微信 8.0.45</text>
    </view>

    <view class="about-group">
      <view class="about-item" @tap="handleFeatures">
        <text class="label">功能介绍</text>
        <text class="iconfont icon-right"></text>
      </view>
      <view class="about-item" @tap="handlePrivacyPolicy">
        <text class="label">隐私政策</text>
        <text class="iconfont icon-right"></text>
      </view>
      <view class="about-item" @tap="handleUserAgreement">
        <text class="label">用户协议</text>
        <text class="iconfont icon-right"></text>
      </view>
    </view>

    <view class="about-group">
      <view class="about-item" @tap="handleCopyright">
        <text class="label">版权信息</text>
        <text class="iconfont icon-right"></text>
      </view>
    </view>

    <view class="copyright-info">
      <text>Copyright © 2011-2024 Tencent. All Rights Reserved.</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const handleFeatures = () => {
  uni.showToast({
    title: '功能介绍开发中',
    icon: 'none'
  })
}

const handlePrivacyPolicy = () => {
  uni.showToast({
    title: '隐私政策开发中',
    icon: 'none'
  })
}

const handleUserAgreement = () => {
  uni.showToast({
    title: '用户协议开发中',
    icon: 'none'
  })
}

const handleCopyright = () => {
  uni.showToast({
    title: '版权信息开发中',
    icon: 'none'
  })
}
</script>

<style lang="scss">
.about-page {
  background-color: #F6F7F9;
  min-height: 100vh;

  .logo-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60rpx 0;
    background-color: #FFFFFF;

    .logo {
      width: 140rpx;
      height: 140rpx;
      margin-bottom: 20rpx;
    }

    .version {
      font-size: 32rpx;
      color: #333333;
    }
  }

  .about-group {
    background-color: #FFFFFF;
    margin-top: 20rpx;

    .about-item {
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

      .icon-right {
        font-size: 32rpx;
        color: #999999;
      }
    }
  }

  .copyright-info {
    text-align: center;
    padding: 40rpx 30rpx;
    font-size: 24rpx;
    color: #999999;
  }
}
</style>