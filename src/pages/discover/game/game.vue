<template>
  <view class="game-page">
    <view class="game-list">
      <!-- 游戏列表 -->
      <view class="game-item" v-for="game in gameList" :key="game.id">
        <view class="game-icon-wrapper">
          <image 
            class="game-icon" 
            :src="game.icon" 
            mode="aspectFill"
            @error="handleImageError(game)"
            :class="{'loading': !imageLoaded[game.id]}"
            @load="handleImageLoad(game.id)"
          />
        </view>
        <view class="game-info">
          <text class="game-name">{{ game.name }}</text>
          <text class="game-desc">{{ game.description }}</text>
        </view>
        <button class="play-btn" @tap="playGame(game.id)">开始</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

// 游戏列表数据
const gameList = ref([
  {
    id: 1,
    name: '欢乐斗地主',
    description: '最受欢迎的棋牌游戏',
    icon: '/static/game/landlord.png'
  },
  {
    id: 2,
    name: '跳一跳',
    description: '考验反应能力的休闲游戏',
    icon: '/static/game/jump.png'
  },
  {
    id: 3,
    name: '消消乐',
    description: '经典三消游戏',
    icon: '/static/game/puzzle.png'
  }
])

// 图片加载状态
const imageLoaded = ref({})

// 处理图片加载完成
const handleImageLoad = (gameId) => {
  imageLoaded.value[gameId] = true
}

// 处理图片加载错误
const handleImageError = (game) => {
  game.icon = '/static/game/default.png' // 设置默认图片
}

// 开始游戏
const playGame = (gameId) => {
  // 根据游戏ID跳转到对应的游戏页面
  const gamePages = {
    1: '/pages/discover/game/landlord/landlord',
    2: '/pages/discover/game/jump/jump',
    3: '/pages/discover/game/puzzle/puzzle'
  }

  if (gamePages[gameId]) {
    uni.navigateTo({
      url: gamePages[gameId]
    })
  } else {
    uni.showToast({
      title: '游戏正在开发中',
      icon: 'none'
    })
  }
}
</script>

<style lang="scss">
.game-page {
  padding: 24rpx;
  background: #f8f9fa;
  min-height: 100vh;

  .game-list {
    .game-item {
      display: flex;
      align-items: center;
      padding: 24rpx;
      background: #ffffff;
      border-radius: 16rpx;
      margin-bottom: 24rpx;
      box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
      transform: translateY(0);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:active {
        transform: translateY(2rpx);
        box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.06);
      }

      .game-icon-wrapper {
        width: 128rpx;
        height: 128rpx;
        border-radius: 24rpx;
        margin-right: 24rpx;
        overflow: hidden;
        background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
      }

      .game-icon {
        width: 100%;
        height: 100%;
        border-radius: 24rpx;
        transition: all 0.3s ease;

        &.loading {
          opacity: 0;
          transform: scale(0.95);
        }
      }

      .game-info {
        flex: 1;

        .game-name {
          font-size: 34rpx;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 10rpx;
          line-height: 1.3;
        }

        .game-desc {
          font-size: 28rpx;
          color: #7f8c8d;
          line-height: 1.4;
        }
      }

      .play-btn {
        padding: 16rpx 36rpx;
        background: linear-gradient(135deg, #07C160, #05a350);
        color: #fff;
        border-radius: 32rpx;
        font-size: 28rpx;
        font-weight: 500;
        box-shadow: 0 4rpx 12rpx rgba(7, 193, 96, 0.2);
        transition: all 0.3s ease;

        &:active {
          transform: translateY(2rpx);
          box-shadow: 0 2rpx 6rpx rgba(7, 193, 96, 0.15);
          opacity: 0.9;
        }
      }
    }
  }
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>