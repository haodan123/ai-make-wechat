<template>
  <view class="moments-page">
    <!-- 顶部封面和个人信息 -->
    <view class="header">
      <image class="cover" src="/static/moments/cover.png" mode="aspectFill" />
      <view class="profile">
        <text class="name">昵称</text>
        <image class="avatar" src="/static/avatar/default.png" mode="aspectFill" />
      </view>
    </view>

    <!-- 发布按钮 -->
    <view class="publish-btn" @tap="navigateToPublish">
      <text class="iconfont icon-add">+</text>
    </view>

    <!-- 朋友圈列表 -->
    <view class="moments-list">
      <view class="moment-item" v-for="moment in momentsList" :key="moment.id" @longpress="toggleActions(moment)">
        <view class="user-info">
          <image class="avatar" :src="moment.avatar" mode="aspectFill" />
          <text class="name">{{ moment.name }}</text>
        </view>
        <view class="content">
          <text class="text">{{ moment.content }}</text>
          
          <!-- 图片/视频展示 -->
          <view class="media-content" v-if="moment.images || moment.video">
            <template v-if="moment.video">
              <video :src="moment.video" class="video-player" />
            </template>
            <template v-else-if="moment.images && moment.images.length">
              <view class="images" :class="{'single-image': moment.images.length === 1}">
                <image
                  v-for="(image, index) in moment.images"
                  :key="index"
                  :src="image"
                  mode="aspectFill"
                  @tap="previewImage(moment.images, index)"
                />
              </view>
            </template>
          </view>

          <!-- 位置信息 -->
          <view class="location-info" v-if="moment.location" @tap="viewLocation(moment.location)">
            <text class="iconfont icon-location"></text>
            <text class="location-text">{{ moment.location }}</text>
          </view>

          <view class="time-location">
            <text class="time">{{ moment.time }}</text>
          </view>

          <!-- 互动区域 -->
          <view class="interaction-area">
            <view class="actions" :class="{show: moment.showActions}">
              <view class="action-btn" @tap="handleLike(moment)">
                <text class="iconfont" :class="moment.isLiked ? 'icon-like-filled' : 'icon-like'"></text>
              </view>
              <view class="action-btn" @tap="handleComment(moment)">
                <text class="iconfont icon-comment"></text>
              </view>
            </view>

            <!-- 点赞和评论列表 -->
            <view class="likes-comments" v-if="moment.likes.length || moment.comments.length">
              <view class="likes" v-if="moment.likes.length">
                <text class="iconfont icon-like-filled"></text>
                <text v-for="(like, index) in moment.likes" :key="like.id">
                  {{ like.name }}{{ index < moment.likes.length - 1 ? '，' : '' }}
                </text>
              </view>
              <view class="comments" v-if="moment.comments.length">
                <view class="comment-item" v-for="comment in moment.comments" :key="comment.id">
                  <text class="comment-user">{{ comment.name }}：</text>
                  <text class="comment-content">{{ comment.content }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>


  </view>
</template>

<script setup>
import { ref } from 'vue'

// 朋友圈列表数据
const momentsList = ref([
  {
    id: 1,
    name: '张三',
    avatar: 'https://picsum.photos/100?random=29',
    content: '今天天气真好！',
    images: [
      'https://picsum.photos/300?random=30',
      'https://picsum.photos/300?random=31'
    ],
    video: null,
    time: '10分钟前',
    location: '北京市朝阳区',
    likes: [
      { id: 1, name: '李四' },
      { id: 2, name: '王五' }
    ],
    comments: [
      { id: 1, name: '李四', content: '确实不错！' }
    ],
    isLiked: false,
    showActions: false
  }
])

// 预览图片
const previewImage = (images, current) => {
  uni.previewImage({
    urls: images,
    current: images[current]
  })
}

// 查看位置
const viewLocation = (location) => {
  uni.showToast({
    title: `查看${location}`,
    icon: 'none'
  })
}

// 切换操作菜单
const toggleActions = (moment) => {
  moment.showActions = !moment.showActions
}

// 处理点赞
const handleLike = (moment) => {
  moment.isLiked = !moment.isLiked
  if (moment.isLiked) {
    moment.likes.push({ id: Date.now(), name: '我' })
  } else {
    const index = moment.likes.findIndex(like => like.name === '我')
    if (index > -1) {
      moment.likes.splice(index, 1)
    }
  }
  moment.showActions = false
}

// 处理评论
const handleComment = (moment) => {
  uni.showModal({
    title: '评论',
    editable: true,
    placeholderText: '请输入评论内容',
    success: (res) => {
      if (res.confirm && res.content) {
        moment.comments.push({
          id: Date.now(),
          name: '我',
          content: res.content
        })
      }
    }
  })
  moment.showActions = false
}

// 跳转到发布页面
const navigateToPublish = () => {
  uni.navigateTo({
    url: '/pages/discover/moments/publish/publish'
  })
}
</script>

<style lang="scss">
.moments-page {
  background: linear-gradient(145deg, #F8F9FB, #EBEDF0);
  min-height: 100vh;

  .header {
    position: relative;
    height: 460rpx;
    overflow: hidden;

    .cover {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transform: scale(1.1);
      filter: brightness(0.85) saturate(1.1);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

      &:active {
        transform: scale(1.15);
        filter: brightness(0.9) saturate(1.2);
      }
    }

    .profile {
      position: absolute;
      right: 32rpx;
      bottom: 0rpx;
      display: flex;
      align-items: center;
      padding: 20rpx;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      border-radius: 20rpx;
      box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
      transform: translateY(0);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:active {
        transform: translateY(-6rpx);
        box-shadow: 0 16rpx 36rpx rgba(0, 0, 0, 0.12);
      }

      .name {
        color: #2C3E50;
        font-size: 34rpx;
        font-weight: 600;
        margin-right: 24rpx;
      }

      .avatar {
        width: 128rpx;
        height: 128rpx;
        border-radius: 16rpx;
        box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
      }
    }
  }

  .moments-list {
    padding: 80rpx 24rpx 24rpx;

    .moment-item {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(12px);
      border-radius: 24rpx;
      padding: 24rpx;
      margin-bottom: 24rpx;
      box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;

      &:active {
        transform: translateY(-4rpx);
        box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
      }

      .user-info {
        display: flex;
        align-items: center;
        margin-bottom: 16rpx;

        .avatar {
          width: 80rpx;
          height: 80rpx;
          border-radius: 12rpx;
          margin-right: 16rpx;
        }

        .name {
          font-size: 32rpx;
          font-weight: 600;
          color: #2C3E50;
        }
      }

      .content {
        .text {
          font-size: 30rpx;
          color: #333333;
          line-height: 1.6;
          margin-bottom: 16rpx;
        }

        .media-content {
          margin: 16rpx 0;

          .video-player {
            width: 100%;
            height: 400rpx;
            border-radius: 16rpx;
          }

          .images {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8rpx;

            &.single-image {
              grid-template-columns: 1fr;
              max-width: 400rpx;
            }

            image {
              width: 100%;
              height: 200rpx;
              border-radius: 12rpx;
              object-fit: cover;
            }
          }
        }

        .location-info {
          display: inline-flex;
          align-items: center;
          background: rgba(0, 0, 0, 0.05);
          padding: 8rpx 16rpx;
          border-radius: 8rpx;
          margin: 8rpx 0;

          .icon-location {
            color: #07C160;
            font-size: 28rpx;
            margin-right: 8rpx;
          }

          .location-text {
            font-size: 26rpx;
            color: #666666;
          }
        }

        .time-location {
          font-size: 24rpx;
          color: #999999;
          margin: 8rpx 0;
        }

        .interaction-area {
          margin-top: 16rpx;

          .actions {
            display: flex;
            justify-content: flex-end;
            gap: 16rpx;
            opacity: 0;
            transition: opacity 0.3s ease;

            &.show {
              opacity: 1;
            }

            .action-btn {
              background: rgba(0, 0, 0, 0.05);
              padding: 8rpx 16rpx;
              border-radius: 8rpx;

              .iconfont {
                font-size: 32rpx;
                color: #666666;

                &.icon-like-filled {
                  color: #FF6B6B;
                }
              }
            }
          }

          .likes-comments {
            margin-top: 16rpx;
            background: rgba(0, 0, 0, 0.02);
            border-radius: 12rpx;
            padding: 16rpx;

            .likes {
              display: flex;
              align-items: center;
              font-size: 28rpx;
              color: #666666;

              .icon-like-filled {
                color: #FF6B6B;
                margin-right: 8rpx;
              }
            }

            .comments {
              margin-top: 12rpx;
              font-size: 28rpx;

              .comment-item {
                margin: 8rpx 0;

                .comment-user {
                  color: #07C160;
                  font-weight: 500;
                }

                .comment-content {
                  color: #333333;
                }
              }
            }
          }
        }
      }
    }
  }
}
.publish-btn {
  position: fixed;
  right: 32rpx;
  bottom: 120rpx;
  width: 100rpx;
  height: 100rpx;
  background: linear-gradient(135deg, #07C160, #10B981);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 32rpx rgba(7, 193, 96, 0.3);
  transform: translateY(0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;

  &:active {
    transform: translateY(-6rpx) scale(0.95);
    box-shadow: 0 12rpx 48rpx rgba(7, 193, 96, 0.4);
  }

  .iconfont {
    font-size: 48rpx;
    color: #FFFFFF;
    font-weight: 300;
    transform: rotate(0);
    transition: transform 0.3s ease;
  }

  &:active .iconfont {
    transform: rotate(90deg);
  }
}
</style>