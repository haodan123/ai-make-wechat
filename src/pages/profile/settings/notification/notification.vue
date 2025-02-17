<template>
  <view class="notification-page">
    <view class="notification-group">
      <view class="notification-item">
        <text class="label">接收新消息通知</text>
        <switch checked @change="handleNewMessageNotification" color="#07C160" />
      </view>
      <view class="notification-item">
        <text class="label">声音</text>
        <switch checked @change="handleSound" color="#07C160" />
      </view>
      <view class="notification-item">
        <text class="label">震动</text>
        <switch checked @change="handleVibration" color="#07C160" />
      </view>
    </view>

    <view class="notification-group">
      <view class="notification-item">
        <text class="label">视频通话通知</text>
        <switch checked @change="handleVideoCallNotification" color="#07C160" />
      </view>
      <view class="notification-item">
        <text class="label">语音通话通知</text>
        <switch checked @change="handleVoiceCallNotification" color="#07C160" />
      </view>
    </view>

    <view class="notification-group">
      <view class="notification-item">
        <text class="label">通知显示消息详情</text>
        <switch checked @change="handleShowMessageDetail" color="#07C160" />
      </view>
      <view class="notification-item">
        <text class="label">消息预览</text>
        <switch checked @change="handleMessagePreview" color="#07C160" />
      </view>
    </view>

    <view class="notification-tips">
      <text>关闭后，当收到微信消息时，通知提示将不显示发信人和内容摘要</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const handleNewMessageNotification = (e) => {
  const isChecked = e.detail.value
  uni.showToast({
    title: isChecked ? '已开启新消息通知' : '已关闭新消息通知',
    icon: 'none'
  })
}

const handleSound = (e) => {
  const isChecked = e.detail.value
  uni.showToast({
    title: isChecked ? '已开启声音' : '已关闭声音',
    icon: 'none'
  })
}

const handleVibration = (e) => {
  const isChecked = e.detail.value
  uni.showToast({
    title: isChecked ? '已开启震动' : '已关闭震动',
    icon: 'none'
  })
}

const handleVideoCallNotification = (e) => {
  const isChecked = e.detail.value
  uni.showToast({
    title: isChecked ? '已开启视频通话通知' : '已关闭视频通话通知',
    icon: 'none'
  })
}

const handleVoiceCallNotification = (e) => {
  const isChecked = e.detail.value
  uni.showToast({
    title: isChecked ? '已开启语音通话通知' : '已关闭语音通话通知',
    icon: 'none'
  })
}

const handleShowMessageDetail = (e) => {
  const isChecked = e.detail.value
  uni.showToast({
    title: isChecked ? '已开启消息详情显示' : '已关闭消息详情显示',
    icon: 'none'
  })
}

const handleMessagePreview = (e) => {
  const isChecked = e.detail.value
  uni.showToast({
    title: isChecked ? '已开启消息预览' : '已关闭消息预览',
    icon: 'none'
  })
}
</script>

<style lang="scss">
.notification-page {
  background-color: #F6F7F9;
  min-height: 100vh;

  .notification-group {
    background-color: #FFFFFF;
    margin-top: 20rpx;

    .notification-item {
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

      switch {
        transform: scale(0.9);
      }
    }
  }

  .notification-tips {
    padding: 24rpx 30rpx;
    font-size: 28rpx;
    color: #999999;
    line-height: 1.4;
  }
}
</style>