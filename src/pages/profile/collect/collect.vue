<template>
  <view class="collect-page">
    <!-- 分类标签 -->
    <view class="category-tabs">
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

    <!-- 收藏列表 -->
    <view class="collect-list">
      <view v-for="item in collectList" :key="item.id" class="collect-item" @tap="viewCollectItem(item)">
        <image v-if="item.cover" class="cover" :src="item.cover" mode="aspectFill" />
        <view class="info">
          <text class="title">{{ item.title }}</text>
          <text class="desc">{{ item.desc }}</text>
          <view class="meta">
            <text class="time">{{ item.time }}</text>
            <text class="from">来自：{{ item.from }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

// 分类标签
const tabs = [
  { id: 1, name: '全部' },
  { id: 2, name: '文章' },
  { id: 3, name: '图片' },
  { id: 4, name: '视频' }
]

// 当前选中的标签
const currentTab = ref(1)

// 收藏列表
const collectList = ref([
  {
    id: 1,
    title: '如何提高工作效率？',
    desc: '分享一些实用的工作效率提升技巧...',
    cover: '/static/images/article-cover.png',
    time: '2024-01-20',
    from: '公众号'
  },
  {
    id: 2,
    title: '年度最佳摄影作品',
    desc: '2023年度最受欢迎的风景摄影作品集锦...',
    cover: '/static/images/photo-cover.png',
    time: '2024-01-19',
    from: '朋友圈'
  }
])

// 切换标签
const switchTab = (tabId) => {
  currentTab.value = tabId
  // TODO: 根据标签筛选内容
}

// 查看收藏项
const viewCollectItem = (item) => {
  uni.showToast({
    title: '查看功能开发中',
    icon: 'none'
  })
}
</script>

<style lang="scss">
.collect-page {
  background-color: #F6F7F9;
  min-height: 100vh;

  .category-tabs {
    display: flex;
    background-color: #FFFFFF;
    padding: 20rpx;
    position: sticky;
    top: 0;
    z-index: 1;

    .tab-item {
      flex: 1;
      text-align: center;
      font-size: 28rpx;
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

  .collect-list {
    padding: 20rpx;

    .collect-item {
      background-color: #FFFFFF;
      border-radius: 12rpx;
      margin-bottom: 20rpx;
      overflow: hidden;

      .cover {
        width: 100%;
        height: 300rpx;
      }

      .info {
        padding: 20rpx;

        .title {
          font-size: 32rpx;
          font-weight: bold;
          color: #333333;
          margin-bottom: 10rpx;
        }

        .desc {
          font-size: 28rpx;
          color: #666666;
          margin-bottom: 16rpx;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }

        .meta {
          display: flex;
          justify-content: space-between;
          font-size: 24rpx;
          color: #999999;
        }
      }
    }
  }
}
</style>