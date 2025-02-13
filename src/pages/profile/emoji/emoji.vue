<template>
  <view class="emoji-page">
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

    <!-- 表情列表 -->
    <view class="emoji-list">
      <view v-for="emoji in emojiList" :key="emoji.id" class="emoji-item" @tap="previewEmoji(emoji)">
        <image class="emoji-image" :src="emoji.url" mode="aspectFill" />
        <text class="name">{{ emoji.name }}</text>
      </view>
    </view>

    <!-- 添加表情按钮 -->
    <view class="add-emoji" @tap="handleAddEmoji">
      <text class="iconfont icon-add"></text>
      <text class="text">添加表情</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

// 分类标签
const tabs = [
  { id: 1, name: '全部' },
  { id: 2, name: '收藏' },
  { id: 3, name: '斗图' },
  { id: 4, name: '贴图' }
]

// 当前选中的标签
const currentTab = ref(1)

// 表情列表
const emojiList = ref([
  {
    id: 1,
    name: '可爱猫咪',
    url: '/static/images/emoji/cat.png'
  },
  {
    id: 2,
    name: '开心狗狗',
    url: '/static/images/emoji/dog.png'
  }
])

// 切换标签
const switchTab = (tabId) => {
  currentTab.value = tabId
  // TODO: 根据标签筛选表情
}

// 预览表情
const previewEmoji = (emoji) => {
  uni.previewImage({
    urls: [emoji.url],
    current: emoji.url
  })
}

// 添加表情
const handleAddEmoji = () => {
  uni.showActionSheet({
    itemList: ['从相册选择', '从聊天记录选择', '从表情商店添加'],
    success: (res) => {
      uni.showToast({
        title: '添加表情功能开发中',
        icon: 'none'
      })
    }
  })
}
</script>

<style lang="scss">
.emoji-page {
  background-color: #F6F7F9;
  min-height: 100vh;
  padding: 20rpx;

  .category-tabs {
    display: flex;
    background-color: #FFFFFF;
    border-radius: 12rpx;
    padding: 10rpx;
    margin-bottom: 30rpx;

    .tab-item {
      flex: 1;
      text-align: center;
      font-size: 28rpx;
      color: #666666;
      padding: 16rpx 0;
      position: relative;

      &.active {
        color: #07C160;
        font-weight: 500;

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

  .emoji-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20rpx;
    padding: 10rpx;

    .emoji-item {
      background-color: #FFFFFF;
      border-radius: 12rpx;
      padding: 16rpx;
      text-align: center;

      .emoji-image {
        width: 120rpx;
        height: 120rpx;
        margin-bottom: 10rpx;
      }

      .name {
        font-size: 24rpx;
        color: #666666;
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .add-emoji {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #FFFFFF;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-top: 40rpx;

    .iconfont {
      font-size: 40rpx;
      color: #07C160;
      margin-right: 10rpx;
    }

    .text {
      font-size: 32rpx;
      color: #07C160;
    }
  }
}
</style>