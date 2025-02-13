<template>
  <view class="profile-page" :class="{ 'dark-mode': isDarkMode }">
    <!-- 个人信息卡片 -->
    <view class="profile-card" @tap="navigateToUserInfo" :style="{ opacity: scrollOpacity }">
      <view class="user-info">
        <image class="avatar" :src="userInfo.avatar" mode="aspectFill" />
        <view class="info">
          <view class="name-row">
            <text class="name">{{ userInfo.name }}</text>
            <text class="wx-id">微信号：{{ userInfo.wxId }}</text>
          </view>
          <view class="status" @tap.stop="showStatusEdit">
            <text>{{ userInfo.status }}</text>
            <text class="iconfont icon-right"></text>
          </view>
        </view>
        <view class="qrcode-wrapper" @tap.stop="showQRCode">
          <text class="iconfont icon-qrcode qrcode"></text>
        </view>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="feature-list">
      <view class="feature-group">
        <view class="feature-item" @tap="navigateToPayment">
          <text class="iconfont icon-payment"></text>
          <text class="name">支付</text>
        </view>
      </view>

      <view class="feature-group">
        <view class="feature-item" @tap="navigateToCollect">
          <text class="iconfont icon-collect"></text>
          <text class="name">收藏</text>
        </view>
        <view class="feature-item" @tap="navigateToAlbum">
          <text class="iconfont icon-album"></text>
          <text class="name">相册</text>
        </view>
        <view class="feature-item" @tap="navigateToCard">
          <text class="iconfont icon-card"></text>
          <text class="name">卡包</text>
        </view>
        <view class="feature-item" @tap="navigateToEmoji">
          <text class="iconfont icon-emoji"></text>
          <text class="name">表情</text>
        </view>
      </view>

      <view class="feature-group">
        <view class="feature-item" @tap="navigateToSettings">
          <text class="iconfont icon-settings"></text>
          <text class="name">设置</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 用户信息
const userInfo = ref({
  name: '微信用户',
  wxId: 'wxid_123456',
  avatar: '/static/avatar/default.png',
  status: '这个人很懒，什么都没写'
})

// 深色模式状态
const isDarkMode = ref(false)

// 滚动透明度
const scrollOpacity = ref(1)

// 监听系统主题变化
const watchSystemTheme = () => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  isDarkMode.value = mediaQuery.matches
  mediaQuery.addEventListener('change', (e) => {
    isDarkMode.value = e.matches
  })
}

// 监听页面滚动
const handleScroll = () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  scrollOpacity.value = Math.max(1 - scrollTop / 200, 0.3)
}

onMounted(() => {
  watchSystemTheme()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 显示状态编辑
const showStatusEdit = () => {
  uni.showModal({
    title: '个性签名',
    editable: true,
    content: userInfo.value.status,
    placeholderText: '请输入个性签名',
    success: (res) => {
      if (res.confirm && res.content) {
        userInfo.value.status = res.content
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

// 导航到用户信息页面
const navigateToUserInfo = () => {
  uni.navigateTo({
    url: '/pages/profile/user-info/user-info'
  })
}

// 导航到支付页面
const navigateToPayment = () => {
  uni.navigateTo({
    url: '/pages/profile/payment/payment'
  })
}

// 导航到收藏页面
const navigateToCollect = () => {
  uni.navigateTo({
    url: '/pages/profile/collect/collect'
  })
}

// 导航到相册页面
const navigateToAlbum = () => {
  uni.navigateTo({
    url: '/pages/profile/album/album'
  })
}

// 导航到卡包页面
const navigateToCard = () => {
  uni.navigateTo({
    url: '/pages/profile/card/card'
  })
}

// 导航到表情页面
const navigateToEmoji = () => {
  uni.navigateTo({
    url: '/pages/profile/emoji/emoji'
  })
}

// 导航到设置页面
const navigateToSettings = () => {
  uni.navigateTo({
    url: '/pages/profile/settings/settings'
  })
}
</script>

<style lang="scss">
.profile-page {
  background: var(--bg-color, #f7f7f7);
  min-height: 100vh;
  padding: 0;

  .profile-card {
    background: #ffffff;
    padding: 24rpx 32rpx;
    margin-bottom: 24rpx;

    .user-info {
      display: flex;
      align-items: center;

      .avatar {
        width: 140rpx;
        height: 140rpx;
        border-radius: 16rpx;
        margin-right: 32rpx;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 400% 100%;
        animation: shimmer 1.5s infinite;
      }

      @keyframes shimmer {
        0% {
          background-position: 100% 0;
        }
        100% {
          background-position: -100% 0;
        }
      }

      .info {
        flex: 1;

        .name-row {
          display: flex;
          align-items: center;
          margin-bottom: 8rpx;

          .name {
            font-size: 42rpx;
            font-weight: 500;
            color: #000000;
            margin-right: 16rpx;
          }

          .wx-id {
            font-size: 28rpx;
            color: #888888;
          }
        }

        .status {
          font-size: 30rpx;
          color: #888888;
          display: flex;
          align-items: center;

          .icon-right {
            margin-left: 8rpx;
            font-size: 24rpx;
            color: #cccccc;
          }
        }
      }

      .qrcode-wrapper {
        padding: 8rpx;
        
        .qrcode {
          font-size: 44rpx;
          color: #888888;
        }
      }
    }
  }

  .feature-list {
    .feature-group {
      margin-bottom: 24rpx;
      background: #ffffff;

      .feature-item {
        display: flex;
        align-items: center;
        padding: 32rpx;
        border-bottom: 1rpx solid #f5f5f5;

        &:last-child {
          border-bottom: none;
        }

        .iconfont {
          font-size: 48rpx;
          color: #07C160;
          margin-right: 24rpx;
        }

        .name {
          font-size: 34rpx;
          color: #000000;
          flex: 1;
        }

        &::after {
          content: '';
          width: 32rpx;
          height: 32rpx;
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23CCCCCC"><path d="M9.29 15.88L13.17 12 9.29 8.12a.996.996 0 1 1 1.41-1.41l4.59 4.59c.39.39.39 1.02 0 1.41L10.7 17.3a.996.996 0 0 1-1.41 0c-.38-.39-.39-1.03 0-1.42z"/></svg>');
          background-size: contain;
          background-repeat: no-repeat;
        }
      }
    }
  }

  &.dark-mode {
    --bg-color: #111111;

    .profile-card {
      background: #1f1f1f;

      .name { color: #ffffff; }
      .wx-id { color: rgba(255, 255, 255, 0.6); }
      .status { color: rgba(255, 255, 255, 0.8); }
      .qrcode { color: rgba(255, 255, 255, 0.6); }
    }

    .feature-group {
      background: #1f1f1f;

      .feature-item {
        border-bottom-color: rgba(255, 255, 255, 0.1);

        .name { color: #ffffff; }
        &::after {
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23666666"><path d="M9.29 15.88L13.17 12 9.29 8.12a.996.996 0 1 1 1.41-1.41l4.59 4.59c.39.39.39 1.02 0 1.41L10.7 17.3a.996.996 0 0 1-1.41 0c-.38-.39-.39-1.03 0-1.42z"/></svg>');
        }
      }
    }
  }
}
</style>