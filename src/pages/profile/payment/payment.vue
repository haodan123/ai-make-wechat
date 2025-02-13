<template>
  <view class="payment-page">
    <!-- 余额信息 -->
    <view class="balance-card">
      <view class="title">我的余额</view>
      <view class="amount">¥ {{ balance }}</view>
    </view>

    <!-- 功能列表 -->
    <view class="function-list">
      <view class="function-item" @tap="handleTransfer">
        <text class="iconfont icon-transfer"></text>
        <text class="name">转账</text>
      </view>
      <view class="function-item" @tap="handleTopUp">
        <text class="iconfont icon-topup"></text>
        <text class="name">充值</text>
      </view>
      <view class="function-item" @tap="handleWithdraw">
        <text class="iconfont icon-withdraw"></text>
        <text class="name">提现</text>
      </view>
    </view>

    <!-- 交易记录 -->
    <view class="transaction-list">
      <view class="title">交易记录</view>
      <view class="list-content">
        <view v-for="item in transactions" :key="item.id" class="transaction-item">
          <view class="left">
            <text class="type">{{ item.type }}</text>
            <text class="time">{{ item.time }}</text>
          </view>
          <text class="amount" :class="{ 'income': item.amount > 0 }">{{ item.amount > 0 ? '+' : '' }}{{ item.amount }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

// 余额
const balance = ref(1000.00)

// 交易记录
const transactions = ref([
  {
    id: 1,
    type: '转账',
    time: '2024-01-20 14:30',
    amount: -100
  },
  {
    id: 2,
    type: '收款',
    time: '2024-01-19 10:15',
    amount: 200
  }
])

// 转账
const handleTransfer = () => {
  uni.showToast({
    title: '转账功能开发中',
    icon: 'none'
  })
}

// 充值
const handleTopUp = () => {
  uni.showToast({
    title: '充值功能开发中',
    icon: 'none'
  })
}

// 提现
const handleWithdraw = () => {
  uni.showToast({
    title: '提现功能开发中',
    icon: 'none'
  })
}
</script>

<style lang="scss">
.payment-page {
  background-color: #F6F7F9;
  min-height: 100vh;
  padding: 20rpx;

  .balance-card {
    background: linear-gradient(135deg, #07C160, #10ad56);
    padding: 40rpx;
    border-radius: 20rpx;
    color: #FFFFFF;
    margin-bottom: 30rpx;

    .title {
      font-size: 28rpx;
      margin-bottom: 20rpx;
    }

    .amount {
      font-size: 48rpx;
      font-weight: bold;
    }
  }

  .function-list {
    display: flex;
    justify-content: space-around;
    background-color: #FFFFFF;
    padding: 30rpx;
    border-radius: 20rpx;
    margin-bottom: 30rpx;

    .function-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .iconfont {
        font-size: 48rpx;
        color: #07C160;
        margin-bottom: 10rpx;
      }

      .name {
        font-size: 28rpx;
        color: #333333;
      }
    }
  }

  .transaction-list {
    background-color: #FFFFFF;
    border-radius: 20rpx;
    padding: 30rpx;

    .title {
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
    }

    .transaction-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #EBEDF0;

      &:last-child {
        border-bottom: none;
      }

      .left {
        .type {
          font-size: 30rpx;
          color: #333333;
          margin-bottom: 6rpx;
          display: block;
        }

        .time {
          font-size: 24rpx;
          color: #999999;
        }
      }

      .amount {
        font-size: 32rpx;
        color: #FF4D4F;

        &.income {
          color: #07C160;
        }
      }
    }
  }
}
</style>