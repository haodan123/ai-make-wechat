<template>
  <view class="jump-game">
    <canvas
      id="gameCanvas"
      class="game-canvas"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    ></canvas>
    
    <view class="game-ui">
      <view class="score-board">
        <text class="score-label">得分:</text>
        <text class="score-value">{{ score }}</text>
      </view>
      
      <view class="game-over" v-if="isGameOver">
        <text class="game-over-text">游戏结束</text>
        <text class="final-score">最终得分: {{ score }}</text>
        <button class="restart-btn" @tap="restartGame">重新开始</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 游戏状态
const score = ref(0)
const isGameOver = ref(false)
let canvas = null
let ctx = null
let animationFrame = null

// 游戏参数
const GRAVITY = 0.5
const JUMP_FORCE = 12
const PLATFORM_WIDTH = 80
const PLATFORM_GAP = 200

// 游戏对象
let player = {
  x: 100,
  y: 300,
  width: 40,
  height: 40,
  velocityY: 0,
  isJumping: false
}

let platforms = []
let pressStartTime = 0
let isPressed = false

// 初始化游戏
const initGame = () => {
  score.value = 0
  isGameOver.value = false
  player.y = 300
  player.velocityY = 0
  platforms = []
  
  // 创建初始平台
  for (let i = 0; i < 3; i++) {
    platforms.push({
      x: i * (PLATFORM_WIDTH + PLATFORM_GAP),
      y: 400,
      width: PLATFORM_WIDTH,
      height: 20
    })
  }
}

// 游戏循环
const gameLoop = () => {
  if (isGameOver.value) return
  
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // 更新玩家
  updatePlayer()
  
  // 绘制玩家
  ctx.fillStyle = '#07C160'
  ctx.fillRect(player.x, player.y, player.width, player.height)
  
  // 绘制平台
  ctx.fillStyle = '#2c3e50'
  platforms.forEach(platform => {
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height)
  })
  
  animationFrame = requestAnimationFrame(gameLoop)
}

// 更新玩家状态
const updatePlayer = () => {
  // 应用重力
  player.velocityY += GRAVITY
  player.y += player.velocityY
  
  // 检测碰撞
  platforms.forEach(platform => {
    if (
      player.y + player.height >= platform.y &&
      player.y + player.height <= platform.y + platform.height &&
      player.x + player.width > platform.x &&
      player.x < platform.x + platform.width
    ) {
      player.y = platform.y - player.height
      player.velocityY = 0
      player.isJumping = false
    }
  })
  
  // 游戏结束检测
  if (player.y > canvas.height) {
    isGameOver.value = true
    cancelAnimationFrame(animationFrame)
  }
  
  // 移动平台
  platforms.forEach(platform => {
    platform.x -= 2
  })
  
  // 移除超出屏幕的平台
  if (platforms[0].x + PLATFORM_WIDTH < 0) {
    platforms.shift()
    // 添加新平台
    const lastPlatform = platforms[platforms.length - 1]
    platforms.push({
      x: lastPlatform.x + PLATFORM_WIDTH + PLATFORM_GAP,
      y: 400 - Math.random() * 100,
      width: PLATFORM_WIDTH,
      height: 20
    })
    score.value++
  }
}

// 触摸事件处理
const handleTouchStart = () => {
  if (!isGameOver.value) {
    pressStartTime = Date.now()
    isPressed = true
  }
}

const handleTouchEnd = () => {
  if (!isGameOver.value && !player.isJumping) {
    const pressDuration = Date.now() - pressStartTime
    const jumpPower = Math.min(pressDuration / 100, 2) * JUMP_FORCE
    player.velocityY = -jumpPower
    player.isJumping = true
    isPressed = false
  }
}

// 重新开始游戏
const restartGame = () => {
  initGame()
  gameLoop()
}

// 生命周期钩子
onMounted(() => {
  canvas = document.getElementById('gameCanvas')
  ctx = canvas.getContext('2d')
  
  // 设置画布大小
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  
  initGame()
  gameLoop()
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrame)
})
</script>

<style lang="scss">
.jump-game {
  position: relative;
  width: 100%;
  height: 100vh;
  background: #f8f9fa;
  
  .game-canvas {
    width: 100%;
    height: 100%;
  }
  
  .game-ui {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    pointer-events: none;
    
    .score-board {
      padding: 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .score-label {
        font-size: 32rpx;
        color: #2c3e50;
        margin-right: 10rpx;
      }
      
      .score-value {
        font-size: 40rpx;
        font-weight: bold;
        color: #07C160;
      }
    }
    
    .game-over {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.9);
      padding: 40rpx;
      border-radius: 20rpx;
      text-align: center;
      pointer-events: auto;
      
      .game-over-text {
        font-size: 48rpx;
        font-weight: bold;
        color: #2c3e50;
        margin-bottom: 20rpx;
      }
      
      .final-score {
        font-size: 36rpx;
        color: #07C160;
        margin-bottom: 30rpx;
        display: block;
      }
      
      .restart-btn {
        background: #07C160;
        color: white;
        padding: 20rpx 60rpx;
        border-radius: 100rpx;
        font-size: 32rpx;
        border: none;
        
        &:active {
          opacity: 0.9;
          transform: scale(0.98);
        }
      }
    }
  }
}
</style>