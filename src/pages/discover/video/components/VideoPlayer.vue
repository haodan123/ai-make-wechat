<template>
  <view class="video-modal">
    <view class="modal-content">
      <!-- 返回按钮和标题栏 -->
      <view class="header-bar">
        <view class="back-btn" @tap="handleClose">
          <text class="iconfont icon-back"></text>
        </view>
        <text class="title">{{ video.title }}</text>
      </view>

      <!-- 视频播放区域 -->
      <view class="video-container">
        <video
          :src="video.url"
          class="video-player"
          :poster="video.cover"
          :controls="showControls"
          :show-center-play-btn="false"
          :enable-progress-gesture="true"
          :show-fullscreen-btn="true"
          @fullscreenchange="handleFullscreenChange"
          @tap="toggleControls"
          ref="videoRef"
        />

        <!-- 自定义控制层 -->
        <view class="custom-controls" v-if="showControls" @tap.stop>
          <view class="play-btn" @tap="togglePlay">
            <text class="iconfont" :class="isPlaying ? 'icon-pause' : 'icon-play'"></text>
          </view>
        </view>
      </view>

      <!-- 视频信息和操作栏 -->
      <view class="video-info">
        <view class="author-info">
          <image class="avatar" :src="video.avatar" mode="aspectFill" />
          <view class="info">
            <text class="name">{{ video.author }}</text>
            <text class="views">{{ video.views }}次观看</text>
          </view>
        </view>
        <view class="action-bar">
          <view class="action-item" @tap="$emit('toggle-like')">
            <text class="iconfont icon-like" :class="{ 'active': video.isLiked }"></text>
            <text class="count">{{ video.likes }}</text>
          </view>
          <view class="action-item" @tap="toggleComments">
            <text class="iconfont icon-comment"></text>
            <text class="count">{{ comments.length }}</text>
          </view>
          <view class="action-item" @tap="$emit('share')">
            <text class="iconfont icon-share"></text>
            <text class="count">分享</text>
          </view>
        </view>
      </view>

      <!-- 评论区域 -->
      <view class="comments-section" :class="{ 'show': showComments }">
        <view class="comments-header">
          <text class="title">评论 {{ comments.length }}</text>
          <text class="close-btn" @tap="toggleComments">收起</text>
        </view>
        <scroll-view class="comments-list" scroll-y>
          <view class="comment-item" v-for="comment in comments" :key="comment.id">
            <image class="avatar" :src="comment.avatar" mode="aspectFill" />
            <view class="comment-content">
              <view class="comment-header">
                <text class="username">{{ comment.username }}</text>
                <text class="time">{{ comment.time }}</text>
              </view>
              <text class="text">{{ comment.text }}</text>
              <view class="comment-actions">
                <view class="action" @tap="$emit('like-comment', comment.id)">
                  <text class="iconfont icon-like" :class="{ 'active': comment.isLiked }"></text>
                  <text class="count">{{ comment.likes }}</text>
                </view>
                <view class="action" @tap="$emit('reply-comment', comment)">
                  <text class="iconfont icon-reply"></text>
                  <text>回复</text>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
        <view class="comment-input-area">
          <input 
            type="text" 
            v-model="commentText" 
            placeholder="添加评论..."
            @confirm="submitComment"
          />
          <text class="submit-btn" @tap="submitComment">发送</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  video: {
    type: Object,
    required: true
  },
  comments: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'close',
  'submit-comment',
  'like-comment',
  'reply-comment',
  'toggle-like',
  'share'
])

// 视频控制相关状态
const videoRef = ref(null)
const isPlaying = ref(false)
const showControls = ref(true)
const isFullscreen = ref(false)

// 评论相关状态
const showComments = ref(false)
const commentText = ref('')

// 控制显示/隐藏
const toggleControls = () => {
  showControls.value = !showControls.value
}

// 播放/暂停控制
const togglePlay = () => {
  if (videoRef.value) {
    if (isPlaying.value) {
      videoRef.value.pause()
    } else {
      videoRef.value.play()
    }
    isPlaying.value = !isPlaying.value
  }
}

// 全屏控制
const handleFullscreenChange = (e) => {
  isFullscreen.value = e.detail.fullScreen
}

// 评论区显示控制
const toggleComments = () => {
  showComments.value = !showComments.value
}

// 提交评论
const submitComment = () => {
  if (!commentText.value.trim()) return
  emit('submit-comment', commentText.value)
  commentText.value = ''
}

// 关闭视频
const handleClose = () => {
  if (isFullscreen.value) {
    videoRef.value?.exitFullScreen()
  }
  emit('close')
}
</script>

<style lang="scss">
.video-modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  background: #000;
  z-index: 999;

  .modal-content {
    height: 100%;
    display: flex;
    flex-direction: column;

    .header-bar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 88rpx;
      padding: 0 24rpx;
      display: flex;
      align-items: center;
      z-index: 2;
      background: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent);

      .back-btn {
        width: 72rpx;
        height: 72rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        
        .icon-back {
          color: #fff;
          font-size: 40rpx;
        }
      }

      .title {
        flex: 1;
        color: #fff;
        font-size: 28rpx;
        margin-left: 16rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .video-container {
      position: relative;
      width: 100%;
      flex: 1;
      background: #000;

      .video-player {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .custom-controls {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0,0,0,0.3);

        .play-btn {
          width: 100rpx;
          height: 100rpx;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;

          .iconfont {
            color: #fff;
            font-size: 60rpx;
          }
        }
      }
    }

    .video-info {
      padding: 24rpx;
      background: #1a1a1a;

      .author-info {
        display: flex;
        align-items: center;
        margin-bottom: 24rpx;

        .avatar {
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
          margin-right: 16rpx;
        }

        .info {
          flex: 1;

          .name {
            color: #fff;
            font-size: 28rpx;
            margin-bottom: 4rpx;
          }

          .views {
            color: #999;
            font-size: 24rpx;
          }
        }
      }

      .action-bar {
        display: flex;
        justify-content: space-around;

        .action-item {
          display: flex;
          flex-direction: column;
          align-items: center;

          .iconfont {
            color: #fff;
            font-size: 48rpx;
            margin-bottom: 8rpx;

            &.active {
              color: #ff4d4f;
            }
          }

          .count {
            color: #999;
            font-size: 24rpx;
          }
        }
      }
    }

    .comments-section {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      max-height: 60vh;
      background: #1a1a1a;
      border-radius: 20rpx 20rpx 0 0;
      transform: translateY(100%);
      transition: transform 0.3s ease-out;

      &.show {
        transform: translateY(0);
      }

      .comments-header {
        padding: 24rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1rpx solid rgba(255,255,255,0.1);

        .title {
          color: #fff;
          font-size: 28rpx;
          font-weight: 500;
        }

        .close-btn {
          color: #999;
          font-size: 24rpx;
        }
      }

      .comments-list {
        max-height: calc(60vh - 180rpx);
        padding: 24rpx;

        .comment-item {
          display: flex;
          margin-bottom: 24rpx;

          .avatar {
            width: 64rpx;
            height: 64rpx;
            border-radius: 50%;
            margin-right: 16rpx;
          }

          .comment-content {
            flex: 1;

            .comment-header {
              margin-bottom: 8rpx;

              .username {
                color: #fff;
                font-size: 26rpx;
                margin-right: 16rpx;
              }

              .time {
                color: #999;
                font-size: 24rpx;
              }
            }

            .text {
              color: #fff;
              font-size: 26rpx;
              line-height: 1.4;
              margin-bottom: 12rpx;
            }

            .comment-actions {
              display: flex;
              gap: 24rpx;

              .action {
                display: flex;
                align-items: center;

                .iconfont {
                  color: #999;
                  font-size: 28rpx;
                  margin-right: 8rpx;

                  &.active {
                    color: #ff4d4f;
                  }
                }

                .count {
                  color: #999;
                  font-size: 24rpx;
                }
              }
            }
          }
        }
      }

      .comment-input-area {
        padding: 24rpx;
        border-top: 1rpx solid rgba(255,255,255,0.1);
        display: flex;
        align-items: center;
        gap: 16rpx;

        input {
          flex: 1;
          height: 72rpx;
          background: rgba(255,255,255,0.1);
          border-radius: 36rpx;
          padding: 0 24rpx;
          color: #fff;
          font-size: 26rpx;

          &::placeholder {
            color: #999;
          }
        }

        .submit-btn {
          padding: 12rpx 32rpx;
          background: #ff4d4f;
          color: #fff;
          font-size: 26rpx;
          border-radius: 32rpx;
        }
      }
    }
  }
}
</style>