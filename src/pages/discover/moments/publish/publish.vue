<template>
  <view class="publish-page">
    <!-- 顶部操作栏 -->
    <view class="top-bar">
      <text class="cancel" @tap="handleCancel">取消</text>
      <text class="publish" :class="{ 'active': canPublish }" @tap="handlePublish">发表</text>
    </view>

    <!-- 内容输入区 -->
    <view class="content-area">
      <textarea
        class="content-input"
        v-model="content"
        placeholder="这一刻的想法..."
        maxlength="1000"
        auto-height
      />
    </view>

    <!-- 媒体内容选择区 -->
    <view class="media-area">
      <view class="media-grid">
        <view
          class="media-item"
          v-for="(item, index) in mediaList"
          :key="index"
        >
          <image
            v-if="item.type === 'image'"
            :src="item.path"
            mode="aspectFill"
            @tap="previewMedia(index)"
          />
          <video
            v-else-if="item.type === 'video'"
            :src="item.path"
            class="video-preview"
          />
          <text class="delete-btn" @tap="deleteMedia(index)">×</text>
        </view>
        <view class="add-media" @tap="chooseMedia" v-if="mediaList.length < 9">
          <text class="iconfont icon-add"></text>
        </view>
      </view>
    </view>

    <!-- 底部功能区 -->
    <view class="bottom-bar">
      <view class="location-picker" @tap="chooseLocation">
        <text class="iconfont icon-location"></text>
        <text class="location-text">{{ location || '所在位置' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

// 发布内容
const content = ref('')
const location = ref('')
const mediaList = ref([])

// 是否可以发布
const canPublish = computed(() => {
  return content.value.trim() || mediaList.value.length > 0
})

// 选择媒体
const chooseMedia = () => {
  uni.showActionSheet({
    itemList: ['拍摄', '从相册选择'],
    success: (res) => {
      if (res.tapIndex === 0) {
        uni.chooseImage({
          count: 9 - mediaList.value.length,
          sizeType: ['compressed'],
          sourceType: ['camera'],
          success: (res) => {
            handleMediaSuccess(res.tempFilePaths, 'image')
          }
        })
      } else {
        uni.chooseMedia({
          count: 9 - mediaList.value.length,
          mediaType: ['image', 'video'],
          sourceType: ['album'],
          success: (res) => {
            res.tempFiles.forEach(file => {
              handleMediaSuccess([file.tempFilePath], file.fileType)
            })
          }
        })
      }
    }
  })
}

// 处理媒体选择结果
const handleMediaSuccess = (paths, type) => {
  paths.forEach(path => {
    mediaList.value.push({
      type,
      path
    })
  })
}

// 预览媒体
const previewMedia = (index) => {
  const item = mediaList.value[index]
  if (item.type === 'image') {
    const images = mediaList.value
      .filter(m => m.type === 'image')
      .map(m => m.path)
    uni.previewImage({
      urls: images,
      current: item.path
    })
  }
}

// 删除媒体
const deleteMedia = (index) => {
  mediaList.value.splice(index, 1)
}

// 选择位置
const chooseLocation = () => {
  uni.chooseLocation({
    success: (res) => {
      location.value = res.name
    }
  })
}

// 取消发布
const handleCancel = () => {
  uni.showModal({
    title: '提示',
    content: '是否放弃编辑？',
    success: (res) => {
      if (res.confirm) {
        uni.navigateBack()
      }
    }
  })
}

// 发布内容
const handlePublish = () => {
  if (!canPublish.value) return
  
  // 这里应该调用上传接口，暂时模拟
  const newMoment = {
    id: Date.now(),
    name: '我',
    avatar: '/static/avatar/default.png',
    content: content.value,
    images: mediaList.value.filter(m => m.type === 'image').map(m => m.path),
    video: mediaList.value.find(m => m.type === 'video')?.path || null,
    time: '刚刚',
    location: location.value,
    likes: [],
    comments: [],
    isLiked: false,
    showActions: false
  }

  // 获取页面实例并更新数据
  const pages = getCurrentPages()
  const momentsPage = pages[pages.length - 2]
  momentsPage.$vm.momentsList.unshift(newMoment)

  uni.navigateBack()
}
</script>

<style lang="scss">
.publish-page {
  min-height: 100vh;
  background-color: #fff;
  padding-bottom: env(safe-area-inset-bottom);

  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 32rpx;
    border-bottom: 1rpx solid #eee;

    .cancel {
      font-size: 32rpx;
      color: #666;
    }

    .publish {
      font-size: 32rpx;
      color: #999;
      &.active {
        color: #07C160;
      }
    }
  }

  .content-area {
    padding: 32rpx;

    .content-input {
      width: 100%;
      min-height: 200rpx;
      font-size: 32rpx;
      line-height: 1.6;
    }
  }

  .media-area {
    padding: 0 32rpx;

    .media-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16rpx;

      .media-item {
        position: relative;
        padding-bottom: 100%;
        background: #f8f8f8;
        border-radius: 12rpx;
        overflow: hidden;

        image, video {
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .delete-btn {
          position: absolute;
          top: 8rpx;
          right: 8rpx;
          width: 44rpx;
          height: 44rpx;
          line-height: 40rpx;
          text-align: center;
          background: rgba(0, 0, 0, 0.5);
          color: #fff;
          border-radius: 50%;
          font-size: 32rpx;
        }
      }

      .add-media {
        position: relative;
        padding-bottom: 100%;
        background: #f8f8f8;
        border-radius: 12rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        .icon-add {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 48rpx;
          color: #999;
        }
      }
    }
  }

  .bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20rpx 32rpx;
    background: #fff;
    border-top: 1rpx solid #eee;

    .location-picker {
      display: inline-flex;
      align-items: center;
      padding: 12rpx 24rpx;
      background: #f8f8f8;
      border-radius: 8rpx;

      .icon-location {
        font-size: 32rpx;
        color: #07C160;
        margin-right: 8rpx;
      }

      .location-text {
        font-size: 28rpx;
        color: #666;
      }
    }
  }
}
</style>