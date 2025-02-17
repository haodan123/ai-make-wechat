<template>
  <view class="album-page">
    <!-- 相册分类 -->
    <view class="album-tabs">
      <view
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-item"
        :class="{ 'active': currentTab === tab.id }"
        @tap="switchTab(tab.id)"
      >
        {{ tab.name }}
      </view>
    </view>

    <!-- 相册内容 -->
    <view class="album-content">
      <!-- 相册列表 -->
      <view class="album-list" v-if="currentTab === 1">
        <view v-for="album in albums" :key="album.id" class="album-item" @tap="openAlbum(album)">
          <image class="cover" :src="album.cover" mode="aspectFill" />
          <view class="info">
            <text class="name">{{ album.name }}</text>
            <text class="count">{{ album.count }}张</text>
          </view>
        </view>
      </view>

      <!-- 照片列表 -->
      <view class="photo-list" v-else>
        <view v-for="photo in photos" :key="photo.id" class="photo-item" @tap="previewImage(photo)">
          <image class="photo" :src="photo.url" mode="aspectFill" />
          <text v-if="photo.type === 'video'" class="iconfont icon-video video-icon"></text>
        </view>
      </view>
    </view>

    <!-- 底部工具栏 -->
    <view class="toolbar">
      <view class="tool-item" @tap="handleUpload">
        <text class="iconfont icon-upload"></text>
        <text class="name">上传</text>
      </view>
      <view class="tool-item" @tap="handleNewAlbum">
        <text class="iconfont icon-add"></text>
        <text class="name">新建相册</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

// 分类标签
const tabs = [
  { id: 1, name: '相册' },
  { id: 2, name: '照片' }
]

// 当前选中的标签
const currentTab = ref(1)

// 相册列表
const albums = ref([
  {
    id: 1,
    name: '我的相册',
    cover: 'https://picsum.photos/300?random=32',
    count: 24
  },
  {
    id: 2,
    name: '朋友圈相册',
    cover: 'https://picsum.photos/300?random=33',
    count: 56
  }
])

// 照片列表
const photos = ref([
  {
    id: 1,
    url: 'https://picsum.photos/300?random=34',
    type: 'image'
  },
  {
    id: 2,
    url: 'https://picsum.photos/300?random=35',
    type: 'video'
  }
])

// 切换标签
const switchTab = (tabId) => {
  currentTab.value = tabId
}

// 打开相册
const openAlbum = (album) => {
  uni.showToast({
    title: '相册功能开发中',
    icon: 'none'
  })
}

// 预览图片
const previewImage = (photo) => {
  if (photo.type === 'video') {
    uni.showToast({
      title: '视频播放功能开发中',
      icon: 'none'
    })
    return
  }
  
  uni.previewImage({
    urls: [photo.url]
  })
}

// 上传文件
const handleUpload = () => {
  uni.showActionSheet({
    itemList: ['拍摄', '从手机相册选择'],
    success: (res) => {
      uni.showToast({
        title: '上传功能开发中',
        icon: 'none'
      })
    }
  })
}

// 新建相册
const handleNewAlbum = () => {
  uni.showModal({
    title: '新建相册',
    editable: true,
    placeholderText: '请输入相册名称',
    success: (res) => {
      if (res.confirm && res.content) {
        uni.showToast({
          title: '创建功能开发中',
          icon: 'none'
        })
      }
    }
  })
}
</script>

<style lang="scss">
.album-page {
  background-color: #F6F7F9;
  min-height: 100vh;
  padding-bottom: 120rpx;

  .album-tabs {
    display: flex;
    background-color: #FFFFFF;
    padding: 20rpx;
    position: sticky;
    top: 0;
    z-index: 1;

    .tab-item {
      flex: 1;
      text-align: center;
      font-size: 32rpx;
      color: #666666;
      padding: 16rpx 0;
      position: relative;

      &.active {
        color: #07C160;

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 40rpx;
          height: 4rpx;
          background-color: #07C160;
          border-radius: 2rpx;
        }
      }
    }
  }

  .album-content {
    padding: 20rpx;

    .album-list {
      display: flex;
      flex-wrap: wrap;
      gap: 20rpx;

      .album-item {
        width: calc(50% - 10rpx);
        background-color: #FFFFFF;
        border-radius: 12rpx;
        overflow: hidden;

        .cover {
          width: 100%;
          height: 300rpx;
        }

        .info {
          padding: 16rpx;

          .name {
            font-size: 28rpx;
            color: #333333;
            margin-bottom: 8rpx;
            display: block;
          }

          .count {
            font-size: 24rpx;
            color: #999999;
          }
        }
      }
    }

    .photo-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10rpx;

      .photo-item {
        width: calc(33.33% - 7rpx);
        position: relative;

        .photo {
          width: 100%;
          height: 240rpx;
          border-radius: 8rpx;
        }

        .video-icon {
          position: absolute;
          right: 10rpx;
          bottom: 10rpx;
          color: #FFFFFF;
          font-size: 40rpx;
          text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.3);
        }
      }
    }
  }

  .toolbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100rpx;
    background-color: #FFFFFF;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);

    .tool-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .iconfont {
        font-size: 44rpx;
        color: #07C160;
        margin-bottom: 6rpx;
      }

      .name {
        font-size: 24rpx;
        color: #333333;
      }
    }
  }
}
</style>