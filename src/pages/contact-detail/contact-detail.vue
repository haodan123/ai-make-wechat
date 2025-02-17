<template>
  <view class="contact-detail" :class="{ 'dark-mode': isDarkMode }">
    <!-- 顶部信息卡片 -->
    <view class="info-card">
      <image class="avatar" :src="contactInfo.avatar" mode="aspectFill" />
      <view class="info-content">
        <view class="name-row">
          <text class="name">{{ contactInfo.name }}</text>
          <text class="gender" :class="contactInfo.gender">{{ contactInfo.gender === 'male' ? '♂' : '♀' }}</text>
        </view>
        <text class="wx-id">微信号：{{ contactInfo.wxId }}</text>
        <text class="region">地区：{{ contactInfo.region }}</text>
      </view>
    </view>

    <!-- 社交信息 -->
    <view class="info-section">
      <view class="section-item" @tap="navigateToMoments">
        <text>朋友圈</text>
        <view class="right-content">
          <image v-if="contactInfo.latestMoment" class="moment-preview" :src="contactInfo.latestMoment" mode="aspectFill" />
          <text class="iconfont icon-right"></text>
        </view>
      </view>
      <view class="section-item" @tap="showMoreInfo">
        <text>更多信息</text>
        <text class="iconfont icon-right"></text>
      </view>
    </view>

    <!-- 互动功能 -->
    <view class="action-section">
      <view class="action-item" @tap="startChat">
        <text class="iconfont icon-message"></text>
        <text>发消息</text>
      </view>
      <view class="action-item" @tap="startVoiceCall">
        <text class="iconfont icon-voice"></text>
        <text>语音通话</text>
      </view>
      <view class="action-item" @tap="startVideoCall">
        <text class="iconfont icon-video"></text>
        <text>视频通话</text>
      </view>
    </view>

    <!-- 设置选项 -->
    <view class="settings-section">
      <view class="section-item" @tap="toggleStarred">
        <text>设为星标朋友</text>
        <switch :checked="contactInfo.isStarred" color="#07C160" />
      </view>
      <view class="section-item" @tap="showRemarkEdit">
        <text>设置备注和标签</text>
        <text class="iconfont icon-right"></text>
      </view>
      <view class="section-item warning" @tap="showBlockDialog">
        <text>加入黑名单</text>
        <text class="iconfont icon-right"></text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 获取路由参数
const contactId = ref('')
const isDarkMode = ref(false)

// 联系人信息
const contactInfo = ref({
  avatar: 'https://picsum.photos/100?random=16',
  name: '',
  gender: 'male',
  wxId: '',
  region: '未知',
  latestMoment: '',
  isStarred: false
})

// 获取联系人信息
const fetchContactInfo = (id) => {
  // 这里模拟从服务器获取数据
  // 实际开发中应该调用API获取数据
  contactInfo.value = {
    avatar: 'https://picsum.photos/100?random=16',
    name: 'John Doe',
    gender: 'male',
    wxId: 'johndoe123',
    region: '广东 深圳',
    latestMoment: 'https://picsum.photos/300?random=17',
    isStarred: false
  }
}

// 页面加载时获取联系人信息
onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  contactId.value = currentPage.$page?.options?.id
  
  if (contactId.value) {
    fetchContactInfo(contactId.value)
  }

  // 获取系统主题
  uni.getSystemInfo({
    success: (res) => {
      isDarkMode.value = res.theme === 'dark'
    }
  })
})

// 导航到朋友圈
const navigateToMoments = () => {
  uni.navigateTo({
    url: `/pages/discover/moments/moments?id=${contactId.value}`
  })
}

// 显示更多信息
const showMoreInfo = () => {
  uni.navigateTo({
    url: `/pages/contact-info/contact-info?id=${contactId.value}`
  })
}

// 开始聊天
const startChat = () => {
  uni.navigateTo({
    url: `/pages/chat/chat?id=${contactId.value}`
  })
}

// 开始语音通话
const startVoiceCall = () => {
  uni.showToast({
    title: '正在开发中',
    icon: 'none'
  })
}

// 开始视频通话
const startVideoCall = () => {
  uni.showToast({
    title: '正在开发中',
    icon: 'none'
  })
}

// 切换星标状态
const toggleStarred = () => {
  contactInfo.value.isStarred = !contactInfo.value.isStarred
  // 这里应该调用API更新星标状态
}

// 显示备注编辑
const showRemarkEdit = () => {
  uni.navigateTo({
    url: `/pages/contact-remark/contact-remark?id=${contactId.value}`
  })
}

// 显示拉黑确认对话框
const showBlockDialog = () => {
  uni.showModal({
    title: '加入黑名单',
    content: '加入黑名单后，你将不再收到对方的消息',
    confirmText: '确认',
    confirmColor: '#FF4D4F',
    success: (res) => {
      if (res.confirm) {
        // 这里应该调用API将用户加入黑名单
        uni.showToast({
          title: '已加入黑名单',
          icon: 'success'
        })
      }
    }
  })
}
</script>

<style lang="scss">
.contact-detail {
  min-height: 100vh;
  background: var(--bg-color, #F6F7F9);
  padding: 20rpx;

  &.dark-mode {
    --bg-color: #1a1a1a;
    --card-bg: rgba(40, 40, 40, 0.8);
    --text-color: #ffffff;
    --secondary-text: #888888;
    --border-color: rgba(255, 255, 255, 0.1);
  }

  .info-card {
    background: var(--card-bg, rgba(255, 255, 255, 0.9));
    border-radius: 20rpx;
    padding: 30rpx;
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    backdrop-filter: blur(12px);

    .avatar {
      width: 140rpx;
      height: 140rpx;
      border-radius: 16rpx;
      margin-right: 30rpx;
    }

    .info-content {
      flex: 1;

      .name-row {
        display: flex;
        align-items: center;
        margin-bottom: 12rpx;

        .name {
          font-size: 36rpx;
          font-weight: 600;
          color: var(--text-color, #333333);
          margin-right: 12rpx;
        }

        .gender {
          font-size: 28rpx;
          &.male { color: #54B4EF; }
          &.female { color: #FF6B6B; }
        }
      }

      .wx-id, .region {
        font-size: 28rpx;
        color: var(--secondary-text, #999999);
        margin-top: 8rpx;
        display: block;
      }
    }
  }

  .info-section, .action-section, .settings-section {
    background: var(--card-bg, rgba(255, 255, 255, 0.9));
    border-radius: 20rpx;
    margin-bottom: 20rpx;
    backdrop-filter: blur(12px);
    overflow: hidden;
  }

  .section-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    color: var(--text-color, #333333);
    font-size: 32rpx;
    border-bottom: 2rpx solid var(--border-color, rgba(0, 0, 0, 0.05));

    &:last-child {
      border-bottom: none;
    }

    &:active {
      background: var(--active-bg, rgba(0, 0, 0, 0.05));
    }

    &.warning {
      color: #FF4D4F;
    }

    .right-content {
      display: flex;
      align-items: center;

      .moment-preview {
        width: 80rpx;
        height: 80rpx;
        border-radius: 8rpx;
        margin-right: 12rpx;
      }
    }

    .icon-right {
      color: var(--secondary-text, #999999);
      font-size: 28rpx;
    }
  }

  .action-section {
    display: flex;
    justify-content: space-around;
    padding: 30rpx;

    .action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: var(--text-color, #333333);

      .iconfont {
        font-size: 48rpx;
        color: #07C160;
        margin-bottom: 12rpx;
      }

      text {
        font-size: 28rpx;
      }

      &:active {
        opacity: 0.8;
      }
    }
  }
}
</style>