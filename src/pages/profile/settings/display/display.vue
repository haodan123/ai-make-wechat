<template>
  <view class="display-page">
    <view class="display-group">
      <view class="display-item">
        <text class="label">字体大小</text>
        <text class="value">标准</text>
        <text class="iconfont icon-right"></text>
      </view>
      <view class="display-item">
        <text class="label">深色模式</text>
        <switch @change="handleDarkMode" color="#07C160" />
      </view>
    </view>

    <view class="display-group">
      <view class="display-item">
        <text class="label">聊天背景</text>
        <text class="value">默认</text>
        <text class="iconfont icon-right"></text>
      </view>
      <view class="display-item">
        <text class="label">主题配色</text>
        <text class="value">微信绿</text>
        <text class="iconfont icon-right"></text>
      </view>
    </view>

    <view class="display-group">
      <view class="display-item">
        <text class="label">列表显示大小</text>
        <text class="value">标准</text>
        <text class="iconfont icon-right"></text>
      </view>
      <view class="display-item">
        <text class="label">表情键盘排列</text>
        <text class="value">4行7列</text>
        <text class="iconfont icon-right"></text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const handleDarkMode = (e) => {
  const isChecked = e.detail.value
  uni.showToast({
    title: isChecked ? '已开启深色模式' : '已关闭深色模式',
    icon: 'none'
  })
}
</script>

<style lang="scss">
.display-page {
  background-color: #F6F7F9;
  min-height: 100vh;

  .display-group {
    background-color: #FFFFFF;
    margin-top: 20rpx;

    .display-item {
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

      switch {
        transform: scale(0.9);
      }
    }
  }
}
</style>