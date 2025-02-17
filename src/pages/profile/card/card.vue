<template>
  <view class="card-page">
    <!-- 卡包分类 -->
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

    <!-- 卡包列表 -->
    <view class="card-list">
      <view v-for="card in cards" :key="card.id" class="card-item" @tap="viewCard(card)">
        <view class="card-content" :style="{ backgroundColor: card.bgColor }">
          <view class="card-header">
            <image class="logo" :src="card.logo" mode="aspectFit" />
            <text class="name">{{ card.name }}</text>
          </view>
          <view class="card-info">
            <text class="number">{{ card.number }}</text>
            <text class="valid-date">有效期至：{{ card.validDate }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 添加卡券按钮 -->
    <view class="add-card" @tap="handleAddCard">
      <text class="iconfont icon-add"></text>
      <text class="text">添加卡券</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

// 分类标签
const tabs = [
  { id: 1, name: '会员卡' },
  { id: 2, name: '优惠券' },
  { id: 3, name: '门票' },
  { id: 4, name: '发票' }
]

// 当前选中的标签
const currentTab = ref(1)

// 卡券列表
const cards = ref([
  {
    id: 1,
    name: '星巴克会员卡',
    logo: 'https://picsum.photos/300?random=36',
    number: '**** **** **** 1234',
    validDate: '2025-12-31',
    bgColor: '#00704A'
  },
  {
    id: 2,
    name: '麦当劳会员卡',
    logo: 'https://picsum.photos/300?random=37',
    number: '**** **** **** 5678',
    validDate: '2025-12-31',
    bgColor: '#FFC72C'
  }
])

// 切换标签
const switchTab = (tabId) => {
  currentTab.value = tabId
  // TODO: 根据标签筛选卡券
}

// 查看卡券详情
const viewCard = (card) => {
  uni.showToast({
    title: '卡券详情功能开发中',
    icon: 'none'
  })
}

// 添加卡券
const handleAddCard = () => {
  uni.showActionSheet({
    itemList: ['扫描添加', '手动输入', '从相册导入'],
    success: (res) => {
      uni.showToast({
        title: '添加卡券功能开发中',
        icon: 'none'
      })
    }
  })
}
</script>

<style lang="scss">
.card-page {
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

  .card-list {
    .card-item {
      margin-bottom: 30rpx;

      .card-content {
        background-color: #FFFFFF;
        border-radius: 20rpx;
        padding: 30rpx;
        box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.1);

        .card-header {
          display: flex;
          align-items: center;
          margin-bottom: 40rpx;

          .logo {
            width: 60rpx;
            height: 60rpx;
            margin-right: 20rpx;
          }

          .name {
            font-size: 32rpx;
            color: #FFFFFF;
            font-weight: bold;
          }
        }

        .card-info {
          .number {
            font-size: 36rpx;
            color: #FFFFFF;
            font-family: monospace;
            letter-spacing: 4rpx;
            display: block;
            margin-bottom: 20rpx;
          }

          .valid-date {
            font-size: 24rpx;
            color: rgba(255,255,255,0.8);
          }
        }
      }
    }
  }

  .add-card {
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