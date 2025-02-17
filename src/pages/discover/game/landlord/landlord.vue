<template>
  <view class="landlord-game">
    <view class="game-header">
      <view class="score-info">
        <text class="label">积分:</text>
        <text class="score">{{ score }}</text>
      </view>
      <button class="start-btn" @tap="startGame" v-if="!gameStarted">开始游戏</button>
    </view>
    
    <view class="game-table" v-if="gameStarted">
      <!-- 其他玩家的牌 -->
      <view class="other-players">
        <view class="player left-player">
          <view class="card-back" v-for="(card, index) in leftPlayerCards" :key="'left'+index"></view>
        </view>
        <view class="player right-player">
          <view class="card-back" v-for="(card, index) in rightPlayerCards" :key="'right'+index"></view>
        </view>
      </view>
      
      <!-- 玩家的牌 -->
      <view class="my-cards">
        <view 
          class="card" 
          v-for="(card, index) in playerCards" 
          :key="index"
          :class="{ 'selected': selectedCards.includes(card) }"
          @tap="selectCard(card)"
        >
          <text class="card-value">{{ card.value }}</text>
          <text class="card-suit">{{ card.suit }}</text>
        </view>
      </view>
      
      <!-- 操作按钮 -->
      <view class="controls" v-if="gameStarted">
        <button class="control-btn pass-btn" @tap="pass" v-if="canPass">不出</button>
        <button class="control-btn play-btn" @tap="playCards" v-if="selectedCards.length > 0">出牌</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

// 游戏状态
const gameStarted = ref(false)
const score = ref(1000)
const canPass = ref(false)

// 玩家手牌
const playerCards = ref([])
const leftPlayerCards = ref([])
const rightPlayerCards = ref([])
const selectedCards = ref([])

// 卡牌花色和数值
const suits = ['♠', '♥', '♣', '♦']
const values = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2']

// 初始化牌组
const initializeDeck = () => {
  const deck = []
  suits.forEach(suit => {
    values.forEach(value => {
      deck.push({ suit, value })
    })
  })
  // 添加大小王
  deck.push({ suit: '', value: 'Joker' })
  deck.push({ suit: '', value: 'JOKER' })
  return deck
}

// 洗牌函数
const shuffleDeck = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

// 开始游戏
const startGame = () => {
  gameStarted.value = true
  const deck = shuffleDeck(initializeDeck())
  
  // 发牌
  playerCards.value = deck.slice(0, 17)
  leftPlayerCards.value = new Array(17)
  rightPlayerCards.value = new Array(17)
  
  // 允许不出
  canPass.value = true
}

// 选择卡牌
const selectCard = (card) => {
  const index = selectedCards.value.indexOf(card)
  if (index === -1) {
    selectedCards.value.push(card)
  } else {
    selectedCards.value.splice(index, 1)
  }
}

// 出牌
const playCards = () => {
  if (selectedCards.value.length === 0) return
  
  // 从玩家手牌中移除选中的牌
  selectedCards.value.forEach(card => {
    const index = playerCards.value.indexOf(card)
    if (index !== -1) {
      playerCards.value.splice(index, 1)
    }
  })
  
  // 清空选中的牌
  selectedCards.value = []
  
  // 检查游戏是否结束
  if (playerCards.value.length === 0) {
    uni.showToast({
      title: '游戏胜利！',
      icon: 'success'
    })
    score.value += 100
    gameStarted.value = false
  }
}

// 不出
const pass = () => {
  selectedCards.value = []
  canPass.value = false
  setTimeout(() => {
    canPass.value = true
  }, 2000)
}
</script>

<style lang="scss">
.landlord-game {
  padding: 20rpx;
  background: #1a6c3b;
  min-height: 100vh;
  
  .game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;
    
    .score-info {
      background: rgba(255, 255, 255, 0.9);
      padding: 10rpx 20rpx;
      border-radius: 10rpx;
      
      .label {
        color: #333;
        margin-right: 10rpx;
      }
      
      .score {
        color: #e6b800;
        font-weight: bold;
      }
    }
    
    .start-btn {
      background: #e6b800;
      color: white;
      padding: 10rpx 30rpx;
      border-radius: 10rpx;
    }
  }
  
  .game-table {
    margin-top: 40rpx;
    
    .other-players {
      display: flex;
      justify-content: space-between;
      margin-bottom: 100rpx;
      
      .player {
        display: flex;
        gap: 5rpx;
        
        .card-back {
          width: 30rpx;
          height: 80rpx;
          background: #b71c1c;
          border-radius: 5rpx;
          border: 2rpx solid #fff;
        }
      }
    }
    
    .my-cards {
      display: flex;
      justify-content: center;
      gap: 10rpx;
      flex-wrap: wrap;
      
      .card {
        width: 100rpx;
        height: 140rpx;
        background: white;
        border-radius: 10rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        transition: all 0.2s;
        
        &.selected {
          transform: translateY(-20rpx);
        }
        
        .card-value {
          font-size: 40rpx;
          font-weight: bold;
          color: #333;
        }
        
        .card-suit {
          font-size: 30rpx;
          color: #666;
        }
      }
    }
    
    .controls {
      display: flex;
      justify-content: center;
      gap: 20rpx;
      margin-top: 40rpx;
      
      .control-btn {
        padding: 15rpx 40rpx;
        border-radius: 10rpx;
        font-size: 32rpx;
        
        &.pass-btn {
          background: #666;
          color: white;
        }
        
        &.play-btn {
          background: #e6b800;
          color: white;
        }
      }
    }
  }
}
</style>