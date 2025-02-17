<template>
  <view class="message-page" @tap="handlePageTap">
    <scroll-view class="message-list" scroll-y refresher-enabled :refresher-triggered="isRefreshing" @refresherrefresh="onRefresh" @scrolltolower="onLoadMore">
      <view class="refresh-text" v-if="isRefreshing">正在刷新...</view>
      <view v-for="chat in sortedChatList" :key="chat.id" class="chat-item" @tap="navigateToChat(chat)" :class="{ 'slide-left': chat.isSlide, 'pinned': chat.isPinned }" @touchstart="touchStart($event, chat)" @touchmove="touchMove($event, chat)" @touchend="touchEnd(chat)">
        <view class="chat-content">
          <view class="avatar">
            <image :src="chat.avatar" mode="aspectFill" />
            <view v-if="chat.type === 'group'" class="group-indicator"></view>
          </view>
          <view class="content">
            <view class="header">
              <view class="name-container">
                <text v-if="chat.isPinned" class="pin-icon">📌</text>
                <text class="name">{{ chat.name }}</text>
              </view>
              <text class="time">{{ chat.lastTime }}</text>
            </view>
            <view class="message">
              <text class="text">{{ chat.lastMessage }}</text>
              <view v-if="chat.unread" class="badge">{{ chat.unread }}</view>
            </view>
          </view>
        </view>
        <view class="action-buttons" :class="{ 'show': chat.isSlide }">
          <view class="pin-btn" @tap.stop="togglePin(chat)">
            <text>{{ chat.isPinned ? '取消置顶' : '置顶' }}</text>
          </view>
          <view class="delete-btn" @tap.stop="confirmDelete(chat)">
            <text>删除</text>
          </view>
        </view>
      </view>
      <view class="loading-more" v-if="isLoadingMore">
        <text>加载中...</text>
      </view>
      <view class="no-more" v-if="noMoreData">
        <text>没有更多数据了</text>
      </view>
    </scroll-view>

    <!-- 快捷操作按钮 -->
    <view class="quick-actions">
      <view class="action-btn" @tap="startVoiceCall">
        <text class="iconfont icon-voice"></text>
      </view>
      <view class="action-btn" @tap="startVideoCall">
        <text class="iconfont icon-video"></text>
      </view>
      <view class="action-btn" @tap="createGroup">
        <text class="iconfont icon-group"></text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

// 分页和加载状态
const pageSize = 10
const currentPage = ref(1)
const isRefreshing = ref(false)
const isLoadingMore = ref(false)
const noMoreData = ref(false)

// 聊天列表数据
const chatList = ref([
  {
    id: 1,
    name: '张三',
    avatar: 'https://picsum.photos/100?random=13',
    lastMessage: '你好，最近怎么样？',
    lastTime: '上午 10:30',
    unread: 2,
    type: 'single',
    isSlide: false,
    isPinned: false
  },
  {
    id: 2,
    name: '微信团队',
    avatar: 'https://picsum.photos/100?random=14',
    lastMessage: '欢迎使用微信',
    lastTime: '昨天',
    unread: 0,
    type: 'single',
    isSlide: false
  },
  {
    id: 3,
    name: '朋友群',
    avatar: 'https://picsum.photos/100?random=15',
    lastMessage: '[张三]: 周末一起吃饭？',
    lastTime: '昨天',
    unread: 5,
    type: 'group',
    isSlide: false
  }
])

// 触摸开始位置
let startX = 0

// 触摸开始
const touchStart = (event, chat) => {
  startX = event.touches[0].clientX
  // 重置其他项的滑动状态
  chatList.value.forEach(item => {
    if (item.id !== chat.id) {
      item.isSlide = false
    }
  })
}

// 触摸移动
const touchMove = (event, chat) => {
  const moveX = event.touches[0].clientX
  const distance = startX - moveX

  if (distance > 0) { // 右向左滑动
    chat.isSlide = distance > 50
  } else if (distance < 0) { // 左向右滑动
    chat.isSlide = false
  }
}

// 处理页面点击
const handlePageTap = () => {
  chatList.value.forEach(chat => {
    chat.isSlide = false
  })
}

// 触摸结束
const touchEnd = (chat) => {
  startX = 0
}

// 切换置顶状态
const togglePin = (chat) => {
  chat.isPinned = !chat.isPinned
  chat.isSlide = false
}

// 对聊天列表进行排序
const sortedChatList = computed(() => {
  return [...chatList.value].sort((a, b) => {
    if (a.isPinned === b.isPinned) {
      return 0
    }
    return a.isPinned ? -1 : 1
  })
})

// 确认删除
const confirmDelete = (chat) => {
  uni.showModal({
    title: '确认删除',
    content: '是否删除此聊天？',
    success: (res) => {
      if (res.confirm) {
        chatList.value = chatList.value.filter(item => item.id !== chat.id)
      } else {
        chat.isSlide = false
      }
    }
  })
}

// 跳转到聊天详情
const navigateToChat = (chat) => {
  if (!chat.isSlide) {
    uni.navigateTo({
      url: `/pages/chat/chat?id=${chat.id}&name=${chat.name}&type=${chat.type}`
    })
  }
}

// 发起语音通话
const startVoiceCall = () => {
  uni.showActionSheet({
    itemList: ['选择联系人', '创建群通话'],
    success: (res) => {
      uni.showToast({
        title: '语音通话功能开发中',
        icon: 'none'
      })
    }
  })
}

// 发起视频通话
const startVideoCall = () => {
  uni.showActionSheet({
    itemList: ['选择联系人', '创建群通话'],
    success: (res) => {
      uni.showToast({
        title: '视频通话功能开发中',
        icon: 'none'
      })
    }
  })
}

// 创建群聊
const createGroup = () => {
  uni.showToast({
    title: '创建群聊功能开发中',
    icon: 'none'
  })
}

// 下拉刷新
const onRefresh = async () => {
  try {
    isRefreshing.value = true
    // 模拟数据刷新
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 重置分页状态
    currentPage.value = 1
    noMoreData.value = false
    
    // 模拟新数据
    chatList.value = [
      {
        id: Math.random(),
        name: '新消息',
        avatar: 'https://picsum.photos/100?random=' + Math.floor(Math.random() * 100),
        lastMessage: '新的聊天消息',
        lastTime: '刚刚',
        unread: 1,
        type: 'single',
        isSlide: false,
        isPinned: false
      },
      ...chatList.value.slice(0, 5)
    ]
  } catch (error) {
    uni.showToast({
      title: '刷新失败',
      icon: 'none'
    })
  } finally {
    isRefreshing.value = false
  }
}

// 上滑加载更多
const onLoadMore = async () => {
  if (isLoadingMore.value || noMoreData.value) return
  
  try {
    isLoadingMore.value = true
    // 模拟加载延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟加载更多数据
    const moreData = Array(3).fill(0).map((_, index) => ({
      id: Math.random(),
      name: `联系人 ${currentPage.value * pageSize + index + 1}`,
      avatar: `https://picsum.photos/100?random=${Math.floor(Math.random() * 100)}`,
      lastMessage: '历史消息...',
      lastTime: '更早',
      unread: 0,
      type: 'single',
      isSlide: false,
      isPinned: false
    }))
    
    chatList.value = [...chatList.value, ...moreData]
    currentPage.value++
    
    // 模拟数据加载完毕
    if (currentPage.value >= 4) {
      noMoreData.value = true
    }
  } catch (error) {
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    isLoadingMore.value = false
  }
}
</script>

<style lang="scss">
@use "sass:color";

@mixin text-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.message-page {
  background: var(--bg-gradient, linear-gradient(135deg, #F6F7F9, #EDEDED));
  min-height: 100vh;
  padding: 20rpx;
  transition: background-color 0.3s ease;

  .message-list {
    height: calc(100vh - 40rpx);
    position: relative;

    .refresh-text {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 10;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(8px);
      padding: 20rpx;
      text-align: center;
      color: #666;
      font-size: 24rpx;
      transition: all 0.3s ease;
    }

    .chat-item {
      position: relative;
      transform: translateY(20rpx);
      opacity: 0;
      animation: slideIn 0.3s ease forwards;
      overflow: hidden;
      margin-bottom: 20rpx;
      will-change: transform;

      &.slide-left {
        z-index: 1;
      }
      .chat-content {
        display: flex;
        padding: 24rpx;
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(12px);
        border-radius: 20rpx;
        box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
        transition: transform 0.3s ease;

        &:active {
          transform: scale(0.98);
          background: rgba(255, 255, 255, 0.9);
        }
      }

      &.slide-left .chat-content {
        transform: translateX(-280rpx);
      }

      .action-buttons {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        transform: translateX(280rpx);
        transition: transform 0.3s ease;

        .pin-btn, .delete-btn {
          width: 140rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          font-size: 32rpx;
        }

        .pin-btn {
          background-color: #07C160;
          &:active {
            background-color: color.scale(#07C160, $lightness: -10%);
          }
        }

        .delete-btn {
          background-color: #FF6B6B;
          border-radius: 0 20rpx 20rpx 0;
          &:active {
            background-color: color.scale(#FF6B6B, $lightness: -10%);
          }
        }
      }

      &.slide-left .action-buttons {
        transform: translateX(0);
      }

      &.pinned {
        .chat-content {
          border: 2rpx solid #07C160;
        }

        .pin-icon {
          margin-right: 8rpx;
          font-size: 28rpx;
        }
      }

      .avatar {
        position: relative;
        margin-right: 20rpx;

        image {
          width: 96rpx;
          height: 96rpx;
          border-radius: 16rpx;
          box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
        }

        .group-indicator {
          position: absolute;
          right: -4rpx;
          bottom: -4rpx;
          width: 24rpx;
          height: 24rpx;
          background: #07C160;
          border-radius: 50%;
          border: 4rpx solid #FFFFFF;
        }
      }

      .content {
        flex: 1;
        overflow: hidden;

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8rpx;

          .name {
            font-size: 32rpx;
            font-weight: 600;
            color: #2C3E50;
          }

          .time {
            font-size: 24rpx;
            color: #999999;
          }
        }

        .message {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .text {
            flex: 1;
            font-size: 28rpx;
            color: #666666;
            @include text-ellipsis;
          }

          .badge {
            min-width: 36rpx;
            height: 36rpx;
            padding: 0 8rpx;
            background: #FF6B6B;
            border-radius: 18rpx;
            color: #FFFFFF;
            font-size: 24rpx;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
  }

  .quick-actions {
    position: fixed;
    right: 32rpx;
    bottom: 120rpx;
    display: flex;
    flex-direction: column;
    gap: 20rpx;

    .action-btn {
      width: 96rpx;
      height: 96rpx;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(12px);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;

      &:active {
        transform: scale(0.9);
        box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
      }

      .iconfont {
        font-size: 48rpx;
        color: #07C160;
      }
    }
  }
}

@keyframes slideIn {
  from {
    transform: translateY(20rpx);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.message-page,
.refresh-text,
.loading-more,
.no-more {
  text-align: center;
  padding: 20rpx;
  color: #999;
  font-size: 24rpx;
}
</style>