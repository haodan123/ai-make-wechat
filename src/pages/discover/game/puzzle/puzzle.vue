<template>
  <view class="puzzle-game">
    <view class="game-header">
      <view class="score-info">
        <text class="score-label">得分:</text>
        <text class="score-value">{{ score }}</text>
      </view>
      <view class="moves-info">
        <text class="moves-label">剩余步数:</text>
        <text class="moves-value">{{ remainingMoves }}</text>
      </view>
    </view>

    <view class="game-board">
      <view class="grid">
        <view 
          v-for="(row, rowIndex) in board" 
          :key="rowIndex" 
          class="row"
        >
          <view 
            v-for="(cell, colIndex) in row" 
            :key="`${rowIndex}-${colIndex}`"
            class="cell"
            :class="[`color-${cell}`, { 'selected': isSelected(rowIndex, colIndex) }]"
            @tap="selectCell(rowIndex, colIndex)"
          >
            <view class="gem"></view>
          </view>
        </view>
      </view>
    </view>

    <view class="game-over" v-if="isGameOver">
      <text class="game-over-text">游戏结束</text>
      <text class="final-score">最终得分: {{ score }}</text>
      <button class="restart-btn" @tap="restartGame">重新开始</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 游戏配置
const BOARD_SIZE = 8
const COLORS = ['red', 'blue', 'green', 'yellow', 'purple']
const INITIAL_MOVES = 20

// 游戏状态
const score = ref(0)
const remainingMoves = ref(INITIAL_MOVES)
const isGameOver = ref(false)
const board = ref([])
const selectedCell = ref(null)

// 初始化游戏板
const initBoard = () => {
  const newBoard = []
  for (let i = 0; i < BOARD_SIZE; i++) {
    const row = []
    for (let j = 0; j < BOARD_SIZE; j++) {
      row.push(COLORS[Math.floor(Math.random() * COLORS.length)])
    }
    newBoard.push(row)
  }
  board.value = newBoard
}

// 检查是否选中
const isSelected = (row, col) => {
  return selectedCell.value && 
         selectedCell.value.row === row && 
         selectedCell.value.col === col
}

// 选择格子
const selectCell = (row, col) => {
  if (isGameOver.value) return

  if (!selectedCell.value) {
    selectedCell.value = { row, col }
  } else {
    // 检查是否相邻
    const isAdjacent = (
      (Math.abs(selectedCell.value.row - row) === 1 && selectedCell.value.col === col) ||
      (Math.abs(selectedCell.value.col - col) === 1 && selectedCell.value.row === row)
    )

    if (isAdjacent) {
      swapCells(selectedCell.value.row, selectedCell.value.col, row, col)
      remainingMoves.value--
      checkGameOver()
    }

    selectedCell.value = null
  }
}

// 交换格子
const swapCells = (row1, col1, row2, col2) => {
  const temp = board.value[row1][col1]
  board.value[row1][col1] = board.value[row2][col2]
  board.value[row2][col2] = temp

  // 检查是否有匹配
  checkMatches()
}

// 检查匹配
const checkMatches = () => {
  let hasMatches = false
  const matches = new Set()

  // 检查行
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE - 2; j++) {
      if (board.value[i][j] === board.value[i][j + 1] && 
          board.value[i][j] === board.value[i][j + 2]) {
        matches.add(`${i},${j}`)
        matches.add(`${i},${j + 1}`)
        matches.add(`${i},${j + 2}`)
        hasMatches = true
      }
    }
  }

  // 检查列
  for (let j = 0; j < BOARD_SIZE; j++) {
    for (let i = 0; i < BOARD_SIZE - 2; i++) {
      if (board.value[i][j] === board.value[i + 1][j] && 
          board.value[i][j] === board.value[i + 2][j]) {
        matches.add(`${i},${j}`)
        matches.add(`${i + 1},${j}`)
        matches.add(`${i + 2},${j}`)
        hasMatches = true
      }
    }
  }

  if (hasMatches) {
    // 计算得分
    score.value += matches.size * 10

    // 移除匹配的宝石并填充新的
    matches.forEach(pos => {
      const [row, col] = pos.split(',').map(Number)
      board.value[row][col] = COLORS[Math.floor(Math.random() * COLORS.length)]
    })

    // 继续检查是否有新的匹配
    setTimeout(() => checkMatches(), 300)
  }
}

// 检查游戏是否结束
const checkGameOver = () => {
  if (remainingMoves.value <= 0) {
    isGameOver.value = true
  }
}

// 重新开始游戏
const restartGame = () => {
  score.value = 0
  remainingMoves.value = INITIAL_MOVES
  isGameOver.value = false
  selectedCell.value = null
  initBoard()
}

// 初始化游戏
onMounted(() => {
  initBoard()
})
</script>

<style lang="scss">
.puzzle-game {
  padding: 20rpx;
  background: #f8f9fa;
  min-height: 100vh;

  .game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;
    margin-bottom: 40rpx;

    .score-info,
    .moves-info {
      background: #ffffff;
      padding: 15rpx 30rpx;
      border-radius: 16rpx;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);

      .score-label,
      .moves-label {
        color: #666;
        font-size: 28rpx;
        margin-right: 10rpx;
      }

      .score-value,
      .moves-value {
        color: #07C160;
        font-size: 32rpx;
        font-weight: bold;
      }
    }
  }

  .game-board {
    padding: 20rpx;
    background: #ffffff;
    border-radius: 20rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);

    .grid {
      display: flex;
      flex-direction: column;
      gap: 10rpx;

      .row {
        display: flex;
        gap: 10rpx;

        .cell {
          width: 80rpx;
          height: 80rpx;
          border-radius: 12rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;

          &.selected {
            transform: scale(0.9);
            box-shadow: 0 0 20rpx rgba(7, 193, 96, 0.3);
          }

          .gem {
            width: 60rpx;
            height: 60rpx;
            border-radius: 30rpx;
            transition: all 0.3s ease;
          }

          &.color-red .gem {
            background: linear-gradient(135deg, #ff6b6b, #ff5252);
          }
          &.color-blue .gem {
            background: linear-gradient(135deg, #4facfe, #00f2fe);
          }
          &.color-green .gem {
            background: linear-gradient(135deg, #07C160, #05a350);
          }
          &.color-yellow .gem {
            background: linear-gradient(135deg, #ffd86f, #ffc107);
          }
          &.color-purple .gem {
            background: linear-gradient(135deg, #a18cd1, #9c27b0);
          }
        }
      }
    }
  }

  .game-over {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 255, 255, 0.95);
    padding: 40rpx;
    border-radius: 20rpx;
    text-align: center;
    box-shadow: 0 4rpx 30rpx rgba(0, 0, 0, 0.15);

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
      background: linear-gradient(135deg, #07C160, #05a350);
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
</style>