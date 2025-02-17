<template>
  <view class="privacy-page">
    <view class="privacy-group">
      <view class="privacy-item">
        <text class="label">朋友圈和视频动态</text>
        <text class="value">所有人可见</text>
        <text class="iconfont icon-right"></text>
      </view>
      <view class="privacy-item">
        <text class="label">新朋友验证</text>
        <switch checked @change="handleVerificationChange" color="#07C160" />
      </view>
    </view>

    <view class="privacy-group">
      <view class="privacy-item">
        <text class="label">通讯录黑名单</text>
        <text class="value">0个</text>
        <text class="iconfont icon-right"></text>
      </view>
      <view class="privacy-item">
        <text class="label">不让他(她)看</text>
        <text class="value">0个</text>
        <text class="iconfont icon-right"></text>
      </view>
      <view class="privacy-item">
        <text class="label">不看他(她)</text>
        <text class="value">0个</text>
        <text class="iconfont icon-right"></text>
      </view>
    </view>

    <view class="privacy-group">
      <view class="privacy-item">
        <text class="label">朋友圈更新提醒</text>
        <switch checked @change="handleMomentsNotification" color="#07C160" />
      </view>
      <view class="privacy-item">
        <text class="label">允许陌生人查看十条朋友圈</text>
        <switch @change="handleStrangerView" color="#07C160" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const handleVerificationChange = (e) => {
  const isChecked = e.detail.value
  uni.showToast({
    title: isChecked ? '已开启新朋友验证' : '已关闭新朋友验证',
    icon: 'none'
  })
}

const handleMomentsNotification = (e) => {
  const isChecked = e.detail.value
  uni.showToast({
    title: isChecked ? '已开启朋友圈提醒' : '已关闭朋友圈提醒',
    icon: 'none'
  })
}

const handleStrangerView = (e) => {
  const isChecked = e.detail.value
  uni.showToast({
    title: isChecked ? '已允许陌生人查看十条朋友圈' : '已关闭陌生人查看权限',
    icon: 'none'
  })
}
</script>

<style lang="scss">
.privacy-page {
  background-color: #F6F7F9;
  min-height: 100vh;

  .privacy-group {
    background-color: #FFFFFF;
    margin-top: 20rpx;

    .privacy-item {
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
        margin-right: 20rpx;
      }

      .icon-right {
        font-size: 32rpx;
        color: #999999;
      }

      switch {
        transform: scale(0.9);
      }
    }
  }
}
</style>