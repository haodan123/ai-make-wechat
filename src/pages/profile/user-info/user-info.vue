<template>
  <view class="user-info-page">
    <view class="info-list">
      <!-- 头像 -->
      <view class="info-item" @tap="changeAvatar">
        <text class="label">头像</text>
        <view class="content">
          <image class="avatar" :src="userInfo.avatar" mode="aspectFill" />
          <text class="iconfont icon-right"></text>
        </view>
      </view>

      <!-- 名字 -->
      <view class="info-item" @tap="changeName">
        <text class="label">名字</text>
        <view class="content">
          <text>{{ userInfo.name }}</text>
          <text class="iconfont icon-right"></text>
        </view>
      </view>

      <!-- 微信号 -->
      <view class="info-item">
        <text class="label">微信号</text>
        <view class="content">
          <text>{{ userInfo.wxId }}</text>
        </view>
      </view>

      <!-- 二维码名片 -->
      <view class="info-item" @tap="showQRCode">
        <text class="label">我的二维码</text>
        <view class="content">
          <text class="iconfont icon-qrcode"></text>
          <text class="iconfont icon-right"></text>
        </view>
      </view>

      <!-- 更多信息 -->
      <view class="info-item" @tap="editMoreInfo">
        <text class="label">更多</text>
        <view class="content">
          <text class="iconfont icon-right"></text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const userInfo = ref({
  name: '微信用户',
  wxId: 'wxid_123456',
  avatar: '/static/avatar/default.png'
})

// 更换头像
const changeAvatar = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      userInfo.value.avatar = res.tempFilePaths[0]
    }
  })
}

// 修改名字
const changeName = () => {
  uni.showModal({
    title: '修改名字',
    editable: true,
    content: userInfo.value.name,
    success: (res) => {
      if (res.confirm && res.content) {
        userInfo.value.name = res.content
      }
    }
  })
}

// 显示二维码
const showQRCode = () => {
  uni.showToast({
    title: '二维码功能开发中',
    icon: 'none'
  })
}

// 编辑更多信息
const editMoreInfo = () => {
  uni.showToast({
    title: '更多信息功能开发中',
    icon: 'none'
  })
}
</script>

<style lang="scss">
.user-info-page {
  background-color: #F6F7F9;
  min-height: 100vh;

  .info-list {
    background-color: #FFFFFF;
    margin-top: 20rpx;

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx;
      border-bottom: 1rpx solid #EBEDF0;

      &:last-child {
        border-bottom: none;
      }

      .label {
        font-size: 32rpx;
        color: #333333;
      }

      .content {
        display: flex;
        align-items: center;

        .avatar {
          width: 120rpx;
          height: 120rpx;
          border-radius: 12rpx;
          margin-right: 20rpx;
        }

        .icon-right {
          color: #999999;
          margin-left: 10rpx;
        }
      }
    }
  }
}
</style>