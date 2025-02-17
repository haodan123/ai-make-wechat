<template>
  <view class="live-page">
    <!-- 直播列表 -->
    <scroll-view class="live-list" scroll-y>
      <view class="live-item" v-for="live in liveList" :key="live.id" @tap="enterLiveRoom(live)">
        <view class="live-cover">
          <image :src="live.cover" mode="aspectFill" />
          <view class="live-status">
            <text class="iconfont icon-live"></text>
            <text class="viewers">{{live.viewers}}人观看</text>
          </view>
        </view>
        <view class="live-info">
          <image class="avatar" :src="live.avatar" mode="aspectFill" />
          <view class="info-right">
            <text class="title">{{live.title}}</text>
            <view class="streamer-info">
              <text class="name">{{live.streamer}}</text>
              <text class="tag">{{live.tag}}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 直播间 -->
    <view class="live-room" v-if="currentLive" @tap="exitLiveRoom">
      <view class="room-content" @tap.stop>
        <live-player
          class="live-player"
          :src="currentLive.streamUrl"
          mode="live"
          :autoplay="true"
          :muted="false"
          :orientation="'vertical'"
        />
        <view class="room-info">
          <view class="streamer-bar">
            <image class="avatar" :src="currentLive.avatar" mode="aspectFill" />
            <text class="name">{{currentLive.streamer}}</text>
            <text class="viewers">{{currentLive.viewers}}观看</text>
          </view>
          <view class="interaction-bar">
            <input 
              class="comment-input" 
              v-model="newComment"
              placeholder="说点什么..." 
              @confirm="sendComment"
              @keypress.enter="sendComment"
            />
            <view class="action-buttons">
              <text class="iconfont icon-like" @tap="toggleLike" :class="{active: isLiked}"></text>
            </view>
          </view>
        </view>

        <!-- 评论列表 -->
        <scroll-view 
          class="comments-list" 
          scroll-y 
          ref="commentsList"
          :scroll-top="scrollTop"
          @scrolltoupper="loadMoreComments"
          :refresher-enabled="true"
          :refresher-triggered="isRefreshing"
          @refresherrefresh="refreshComments"
        >
          <view class="comment-wrapper">
            <view 
              class="comment-item" 
              v-for="comment in comments" 
              :key="comment.id"
              :class="{'fade-in': comment.isNew}"
            >
              <image class="avatar" :src="comment.avatar" mode="aspectFill" />
              <view class="comment-content">
                <view class="comment-header">
                  <text class="username">{{comment.username}}</text>
                  <text class="time">{{comment.time}}</text>
                </view>
                <text class="text">{{comment.text}}</text>
                <view class="comment-actions" v-if="comment.username === '我'">
                  <text class="delete" @tap="deleteComment(comment.id)">删除</text>
                </view>
              </view>
            </view>
          </view>
          <view class="loading-more" v-if="isLoading">
            <text>加载更多...</text>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, nextTick } from 'vue'

// 直播列表数据
const liveList = ref([
  {
    id: 1,
    title: '新年倒计时直播',
    streamer: '张三',
    avatar: 'https://picsum.photos/100?random=19',
    cover: 'https://picsum.photos/300?random=20',
    streamUrl: 'rtmp://example.com/live/stream1',
    viewers: '2.3w',
    tag: '娱乐'
  },
  {
    id: 2,
    title: '美食探店直播',
    streamer: '李四',
    avatar: 'https://picsum.photos/100?random=21',
    cover: 'https://picsum.photos/300?random=22',
    streamUrl: 'rtmp://example.com/live/stream2',
    viewers: '1.5w',
    tag: '美食'
  }
])

// 当前观看的直播
const currentLive = ref(null)

// 评论列表状态管理
const comments = ref([])
const isLoading = ref(false)
const isRefreshing = ref(false)
const scrollTop = ref(0)
const page = ref(1)
const pageSize = 20

// 评论列表滚动区域引用
const commentsList = ref(null)

// 新评论内容
const newComment = ref('')

// 加载评论列表
const loadComments = async () => {
  if (isLoading.value) return
  isLoading.value = true
  
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    const newComments = Array.from({ length: pageSize }, (_, index) => ({
      id: comments.value.length + index + 1,
      username: `用户${Math.floor(Math.random() * 1000)}`,
      avatar: '/static/avatar/default.png',
      text: `这是第${page.value}页的评论 ${index + 1}`,
      time: '刚刚'
    }))
    
    comments.value = [...comments.value, ...newComments]
    page.value++
  } catch (error) {
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    isLoading.value = false
  }
}

// 刷新评论列表
const refreshComments = async () => {
  isRefreshing.value = true
  page.value = 1
  comments.value = []
  
  try {
    await loadComments()
  } finally {
    isRefreshing.value = false
  }
}

// 加载更多评论
const loadMoreComments = () => {
  loadComments()
}

// 删除评论
const deleteComment = (commentId) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除这条评论吗？',
    success: (res) => {
      if (res.confirm) {
        comments.value = comments.value.filter(comment => comment.id !== commentId)
        uni.showToast({
          title: '删除成功',
          icon: 'none'
        })
      }
    }
  })
}

// 点赞状态
const isLiked = ref(false)

// 进入直播间
const enterLiveRoom = (live) => {
  currentLive.value = live
  isLiked.value = false
}

// 退出直播间
const exitLiveRoom = () => {
  currentLive.value = null
  newComment.value = ''
  isLiked.value = false
}

// 发送评论
const sendComment = () => {
  if (!newComment.value.trim()) return
  
  comments.value.unshift({
    id: comments.value.length + 1,
    username: '我',
    avatar: '/static/avatar/default.png',
    text: newComment.value,
    time: '刚刚'
  })
  
  newComment.value = ''

  // 滚动到评论列表顶部
  nextTick(() => {
    if (commentsList.value) {
      commentsList.value.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  })
}

// 切换点赞状态
const toggleLike = () => {
  isLiked.value = !isLiked.value
  if (isLiked.value) {
    uni.showToast({
      title: '点赞成功',
      icon: 'none'
    })
  }
}
</script>

<style lang="scss">
.live-page {
  background-color: #121212;
  min-height: 100vh;

  .live-list {
    height: 100vh;
    padding: 24rpx;

    .live-item {
      margin-bottom: 32rpx;
      background: linear-gradient(145deg, #1a1a1a 0%, #242424 100%);
      border-radius: 16rpx;
      overflow: hidden;
      box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.2);
      transition: transform 0.3s ease;

      &:active {
        transform: scale(0.98);
      }

      .live-cover {
        position: relative;
        width: 100%;
        height: 400rpx;
        background: linear-gradient(120deg, #1a1a1a 30%, #242424 50%, #1a1a1a 70%);
        background-size: 200% 100%;
        animation: loading-shine 1.5s infinite;

        image {
          width: 100%;
          height: 100%;
          transition: opacity 0.3s ease;

          &[src=""] {
            opacity: 0;
          }
        }

        .live-status {
          position: absolute;
          left: 16rpx;
          top: 16rpx;
          padding: 8rpx 16rpx;
          background: rgba(255, 59, 48, 0.85);
          backdrop-filter: blur(4px);
          border-radius: 24rpx;
          display: flex;
          align-items: center;
          box-shadow: 0 2rpx 8rpx rgba(255, 59, 48, 0.3);

          .iconfont {
            color: #ffffff;
            font-size: 24rpx;
            margin-right: 8rpx;
          }

          .viewers {
            color: #ffffff;
            font-size: 24rpx;
            font-weight: 500;
          }
        }
      }

      .live-info {
        padding: 24rpx;
        display: flex;
        align-items: flex-start;

        .avatar {
          width: 88rpx;
          height: 88rpx;
          border-radius: 50%;
          margin-right: 24rpx;
          border: 4rpx solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(120deg, #1a1a1a 30%, #242424 50%, #1a1a1a 70%);
          background-size: 200% 100%;
          animation: loading-shine 1.5s infinite;
        }

        .info-right {
          flex: 1;

          .title {
            font-size: 32rpx;
            color: #ffffff;
            margin-bottom: 12rpx;
            font-weight: 600;
          }

          .streamer-info {
            display: flex;
            align-items: center;

            .name {
              font-size: 26rpx;
              color: rgba(255, 255, 255, 0.7);
              margin-right: 24rpx;
            }

            .tag {
              font-size: 22rpx;
              color: rgba(255, 255, 255, 0.9);
              background: rgba(255, 255, 255, 0.1);
              padding: 4rpx 16rpx;
              border-radius: 12rpx;
              backdrop-filter: blur(4px);
            }
          }
        }
      }
    }
  }

  .live-room {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    background: #000000;
    z-index: 100;
    animation: fade-in 0.3s ease;

    .room-content {
      height: 100%;
      display: flex;
      flex-direction: column;

      .live-player {
        flex: 1;
        width: 100%;
      }

      .room-info {
        padding: 24rpx;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0));

        .streamer-bar {
          display: flex;
          align-items: center;
          margin-bottom: 24rpx;

          .avatar {
            width: 72rpx;
            height: 72rpx;
            border-radius: 50%;
            margin-right: 24rpx;
            border: 4rpx solid rgba(255, 255, 255, 0.2);
          }

          .name {
            color: #ffffff;
            font-size: 32rpx;
            margin-right: 24rpx;
            font-weight: 600;
          }

          .viewers {
            color: rgba(255, 255, 255, 0.7);
            font-size: 26rpx;
          }
        }

        .interaction-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .comment-input {
            flex: 1;
            height: 72rpx;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 36rpx;
            padding: 0 28rpx;
            color: #ffffff;
            font-size: 28rpx;
            margin-right: 24rpx;
            backdrop-filter: blur(4px);
            border: 2rpx solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;

            &:focus {
              background: rgba(255, 255, 255, 0.2);
              border-color: rgba(255, 255, 255, 0.2);
            }
          }

          .action-buttons {
            display: flex;
            align-items: center;
            gap: 32rpx;

            .iconfont {
              color: rgba(255, 255, 255, 0.9);
              font-size: 48rpx;
              transition: transform 0.2s ease;

              &:active {
                transform: scale(0.9);
              }
            }
          }
        }
      }
    }
  }
}

@keyframes loading-shine {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>