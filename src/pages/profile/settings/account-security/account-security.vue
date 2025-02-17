<template>
  <view class="account-security">
    <view class="security-group">
      <view class="security-item" @tap="handlePasswordChange">
        <text class="label">修改密码</text>
        <text class="iconfont icon-right"></text>
      </view>
      <view class="security-item" @tap="handleDevices">
        <text class="label">登录设备管理</text>
        <text class="value">1台设备在线</text>
        <text class="iconfont icon-right"></text>
      </view>
      <view class="security-item" @tap="handleMoreSecurity">
        <text class="label">更多安全设置</text>
        <text class="iconfont icon-right"></text>
      </view>
    </view>

    <view class="security-group">
      <view class="security-item" @tap="handleEmergencyContact">
        <text class="label">紧急联系人</text>
        <text class="value">未设置</text>
        <text class="iconfont icon-right"></text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const handlePasswordChange = () => {
  uni.showToast({
    title: '修改密码功能开发中',
    icon: 'none'
  })
}

const handleDevices = () => {
  uni.showToast({
    title: '设备管理功能开发中',
    icon: 'none'
  })
}

const handleMoreSecurity = () => {
  uni.showToast({
    title: '更多安全设置开发中',
    icon: 'none'
  })
}

const handleEmergencyContact = () => {
  uni.showToast({
    title: '紧急联系人功能开发中',
    icon: 'none'
  })
}
</script>

<style lang="scss">
.account-security {
  background-color: #F6F7F9;
  min-height: 100vh;

  .security-group {
    background-color: #FFFFFF;
    margin-top: 20rpx;

    .security-item {
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
}
</style>