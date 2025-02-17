<template>
  <view class="video-page">
    <!-- 导航栏 -->
    <!-- <view class="nav-bar">
      <text class="title">视频</text>
    </view> -->

    <!-- 视频列表 -->
    <scroll-view class="video-list" scroll-y>
      <view class="video-item" v-for="video in videoList" :key="video.id" @tap="playVideo(video)">
        <view class="video-cover">
          <image :src="video.cover" mode="aspectFill" />
          <view class="play-icon">
            <text class="iconfont icon-play"></text>
          </view>
          <text class="duration">{{video.duration}}</text>
        </view>
        <view class="video-info">
          <image class="avatar" :src="video.avatar" mode="aspectFill" />
          <view class="info-right">
            <text class="title">{{video.title}}</text>
            <view class="stats">
              <text class="author">{{video.author}}</text>
              <text class="views">{{video.views}}次观看</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 视频播放弹窗 -->
    <video-player
      v-if="currentVideo"
      :video="currentVideo"
      :comments="comments"
      @close="closeVideo"
      @submit-comment="handleCommentSubmit"
      @like-comment="handleCommentLike"
      @reply-comment="handleCommentReply"
      @toggle-like="handleVideoLike"
      @share="handleShare"
    />
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import VideoPlayer from './components/VideoPlayer.vue'

// 视频列表数据
const videoList = ref([{
    id: 1,
    title: '2024年新年祝福',
    author: '张三',
    avatar: 'https://picsum.photos/100?random=23',
    cover: 'https://picsum.photos/300?random=24',
    url: 'https://example.com/video1.mp4',
    duration: '2:30',
    views: '1.2w',
    likes: '2.5w',
    likeCount: 25000,
    isLiked: false,
    commentCount: 0
  },
  {
    id: 2,
    title: '美食探店记',
    author: '李四',
    avatar: 'https://picsum.photos/100?random=25',
    cover: 'https://picsum.photos/300?random=26',
    url: 'https://example.com/video2.mp4',
    duration: '3:45',
    views: '8.9w',
    likes: '5.6w',
    likeCount: 56000,
    isLiked: false,
    commentCount: 0
  }
])

// 当前播放的视频
const currentVideo = ref(null)

// 评论列表
const comments = ref([])

// 加载评论数据
const loadComments = async (videoId) => {
  try {
    // 模拟从服务器获取评论数据
    const storedComments = uni.getStorageSync(`video_comments_${videoId}`) || []
    comments.value = storedComments
    
    // 更新视频的评论数
    const video = videoList.value.find(v => v.id === videoId)
    if (video) {
      video.commentCount = storedComments.length
    }
  } catch (e) {
    console.error('加载评论失败:', e)
  }
}

// 播放视频
const playVideo = (video) => {
  currentVideo.value = { ...video }
  // 加载评论数据
  loadComments(video.id)
  // 记录播放历史
  savePlayHistory(video)
}

// 关闭视频
const closeVideo = () => {
  currentVideo.value = null
  comments.value = []
}

// 处理评论提交
const handleCommentSubmit = (commentText) => {
  if (!commentText.trim()) return
  
  const newComment = {
    id: Date.now(),
    username: '我',
    avatar: '/static/avatar/default.png',
    text: commentText,
    time: '刚刚',
    likes: 0,
    isLiked: false,
    replies: []
  }
  
  comments.value.unshift(newComment)
  
  // 更新视频的评论数
  if (currentVideo.value) {
    const video = videoList.value.find(v => v.id === currentVideo.value.id)
    if (video) {
      video.commentCount = comments.value.length
    }
    
    // 保存评论数据
    try {
      uni.setStorageSync(`video_comments_${currentVideo.value.id}`, comments.value)
    } catch (e) {
      console.error('保存评论失败:', e)
    }
  }
  
  // 显示评论成功提示
  uni.showToast({
    title: '评论成功',
    icon: 'success'
  })
}

// 处理评论点赞
const handleCommentLike = (commentId) => {
  const comment = comments.value.find(c => c.id === commentId)
  if (comment) {
    comment.isLiked = !comment.isLiked
    comment.likes += comment.isLiked ? 1 : -1
    
    // 保存评论数据
    if (currentVideo.value) {
      try {
        uni.setStorageSync(`video_comments_${currentVideo.value.id}`, comments.value)
      } catch (e) {
        console.error('保存评论点赞状态失败:', e)
      }
    }
    
    // 显示点赞动画
    uni.showToast({
      title: comment.isLiked ? '点赞成功' : '已取消点赞',
      icon: 'none'
    })
  }
}

// 处理评论回复
const handleCommentReply = (comment) => {
  uni.showModal({
    title: '回复评论',
    editable: true,
    placeholderText: '请输入回复内容',
    success: (res) => {
      if (res.confirm && res.content.trim()) {
        const reply = {
          id: Date.now(),
          username: '我',
          avatar: '/static/avatar/default.png',
          text: res.content,
          time: '刚刚',
          likes: 0,
          isLiked: false
        }
        
        if (!comment.replies) {
          comment.replies = []
        }
        comment.replies.push(reply)
        
        // 保存评论数据
        if (currentVideo.value) {
          try {
            uni.setStorageSync(`video_comments_${currentVideo.value.id}`, comments.value)
          } catch (e) {
            console.error('保存评论回复失败:', e)
          }
        }
        
        // 显示回复成功提示
        uni.showToast({
          title: '回复成功',
          icon: 'success'
        })
      }
    }
  })
}

// 处理视频点赞
const handleVideoLike = () => {
  if (currentVideo.value) {
    const video = videoList.value.find(v => v.id === currentVideo.value.id)
    if (video) {
      video.isLiked = !video.isLiked
      video.likeCount += video.isLiked ? 1 : -1
      video.likes = formatCount(video.likeCount)
      currentVideo.value = { ...video }
      
      // 保存点赞状态
      try {
        const likedVideos = uni.getStorageSync('liked_videos') || {}
        if (video.isLiked) {
          likedVideos[video.id] = true
        } else {
          delete likedVideos[video.id]
        }
        uni.setStorageSync('liked_videos', likedVideos)
      } catch (e) {
        console.error('保存视频点赞状态失败:', e)
      }
      
      // 显示点赞动画
      uni.showToast({
        title: video.isLiked ? '点赞成功' : '已取消点赞',
        icon: 'none'
      })
    }
  }
}

// 格式化数字
const formatCount = (count) => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + 'w'
  }
  return count.toString()
}

// 初始化点赞状态
const initLikeStatus = () => {
  try {
    const likedVideos = uni.getStorageSync('liked_videos') || {}
    videoList.value.forEach(video => {
      if (likedVideos[video.id]) {
        video.isLiked = true
      }
    })
  } catch (e) {
    console.error('初始化点赞状态失败:', e)
  }
}

// 生命周期钩子
onMounted(() => {
  // 初始化点赞状态
  initLikeStatus()
})

onUnmounted(() => {
  // 清理工作，例如保存状态
})
</script>

<style lang="scss">
.video-page {
  background-color: #121212;
  min-height: 100vh;

  .nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 88rpx;
    background: #1a1a1a;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;

    .title {
      color: #fff;
      font-size: 32rpx;
      font-weight: 500;
    }
  }

  .video-list {
    // margin-top: 88rpx;
    height: calc(100vh - 88rpx);
    padding: 24rpx;
    box-sizing: border-box;

    .video-item {
      margin-bottom: 32rpx;
      background: linear-gradient(145deg, #1a1a1a 0%, #242424 100%);
      border-radius: 16rpx;
      overflow: hidden;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.2);

      .video-cover {
        position: relative;
        width: 100%;
        height: 360rpx;

        image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .play-icon {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 80rpx;
          height: 80rpx;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;

          .icon-play {
            color: #fff;
            font-size: 40rpx;
          }
        }

        .duration {
          position: absolute;
          right: 16rpx;
          bottom: 16rpx;
          padding: 4rpx 12rpx;
          background: rgba(0, 0, 0, 0.6);
          color: #fff;
          font-size: 24rpx;
          border-radius: 4rpx;
        }
      }

      .video-info {
        padding: 16rpx;
        display: flex;
        align-items: center;

        .avatar {
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
          margin-right: 16rpx;
        }

        .info-right {
          flex: 1;

          .title {
            color: #fff;
            font-size: 28rpx;
            margin-bottom: 8rpx;
          }

          .stats {
            display: flex;
            align-items: center;
            color: #999;
            font-size: 24rpx;

            .author {
              margin-right: 16rpx;
            }
          }
        }
      }
    }
  }
}
</style>