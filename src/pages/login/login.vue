<template>
  <view class="login-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <text class="iconfont icon-left" @tap="handleBack"></text>
      <text class="title">登录</text>
    </view>

    <!-- Logo -->
    <view class="logo-section">
      <image class="logo" src="https://picsum.photos/200?random=11" mode="aspectFit" />
      <text class="app-name">微信</text>
    </view>

    <!-- 登录选项 -->
    <view class="login-options">
      <!-- 手机号登录 -->
      <view v-if="loginType === 'phone'" class="login-form">
        <view class="input-group">
          <input type="number" v-model="phoneForm.phone" placeholder="请输入手机号" maxlength="11" />
          <button class="verify-btn" :disabled="!canSendCode || counting" @tap="sendVerifyCode">
            {{ counting ? `${countdown}s后重试` : '获取验证码' }}
          </button>
        </view>
        <view class="input-group">
          <input type="number" v-model="phoneForm.code" placeholder="请输入验证码" maxlength="6" />
        </view>
        <button class="submit-btn" :disabled="!canSubmitPhone" @tap="handlePhoneSubmit">登录</button>
        <text class="switch-type" @tap="switchLoginType('wechat')">使用微信号登录</text>
      </view>

      <!-- 微信号登录 -->
      <view v-if="loginType === 'wechat'" class="login-form">
        <view class="input-group">
          <input type="text" v-model="wechatForm.account" placeholder="微信号/QQ号/邮箱" />
        </view>
        <view class="input-group">
          <input type="password" v-model="wechatForm.password" placeholder="请输入密码" />
        </view>
        <button class="submit-btn" :disabled="!canSubmitWechat" @tap="handleWechatSubmit">登录</button>
        <text class="switch-type" @tap="switchLoginType('phone')">使用手机号登录</text>
      </view>

      <!-- 登录选项按钮 -->
      <view v-if="!loginType" class="login-buttons">
        <view class="login-option phone" @tap="switchLoginType('phone')">
          <text class="iconfont icon-phone"></text>
          <text class="option-text">用手机号登录</text>
        </view>
        <view class="login-option wechat" @tap="switchLoginType('wechat')">
          <text class="iconfont icon-wechat"></text>
          <text class="option-text">用微信号/QQ号/邮箱登录</text>
        </view>
      </view>
    </view>

    <!-- 底部提示 -->
    <view class="bottom-tips">
      <text class="tip-text">登录即表示同意</text>
      <text class="link-text" @tap="handleServiceAgreement">服务协议</text>
      <text class="tip-text">和</text>
      <text class="link-text" @tap="handlePrivacyPolicy">隐私政策</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

// 登录类型
const loginType = ref('')

// 手机号表单
const phoneForm = ref({
  phone: '',
  code: ''
})

// 微信号表单
const wechatForm = ref({
  account: '',
  password: ''
})

// 验证码倒计时
const counting = ref(false)
const countdown = ref(60)
let timer = null

// 计算属性
const canSendCode = computed(() => {
  return /^1\d{10}$/.test(phoneForm.value.phone)
})

const canSubmitPhone = computed(() => {
  return canSendCode.value && phoneForm.value.code.length === 6
})

const canSubmitWechat = computed(() => {
  return wechatForm.value.account && wechatForm.value.password.length >= 6
})

// 切换登录类型
const switchLoginType = type => {
  loginType.value = type
}

// 发送验证码
const sendVerifyCode = () => {
  if (!canSendCode.value || counting.value) return

  // 模拟发送验证码
  uni.showLoading({ title: '发送中' })
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({
      title: '验证码已发送',
      icon: 'success'
    })

    // 开始倒计时
    counting.value = true
    timer = setInterval(() => {
      if (countdown.value > 0) {
        countdown.value--
      } else {
        clearInterval(timer)
        counting.value = false
        countdown.value = 60
      }
    }, 1000)
  }, 1500)
}

// 手机号登录提交
const handlePhoneSubmit = () => {
  if (!canSubmitPhone.value) return

  uni.showLoading({ title: '登录中' })
  // 模拟登录请求
  setTimeout(() => {
    uni.hideLoading()
    loginSuccess()
  }, 1500)
}

// 微信号登录提交
const handleWechatSubmit = () => {
  if (!canSubmitWechat.value) return

  uni.showLoading({ title: '登录中' })
  // 模拟登录请求
  setTimeout(() => {
    uni.hideLoading()
    loginSuccess()
  }, 1500)
}

// 登录成功处理
const loginSuccess = () => {
  // 保存用户信息
  uni.setStorageSync('userInfo', {
    id: 'user_' + Date.now(),
    name: '微信用户',
    avatar: 'https://picsum.photos/100?random=12'
  })

  // 跳转到首页
  uni.switchTab({
    url: '/pages/message/message'
  })
}

// 返回上一页
const handleBack = () => {
  uni.navigateBack()
}

// 服务协议
const handleServiceAgreement = () => {
  uni.showToast({
    title: '服务协议功能开发中',
    icon: 'none'
  })
}

// 隐私政策
const handlePrivacyPolicy = () => {
  uni.showToast({
    title: '隐私政策功能开发中',
    icon: 'none'
  })
}

// 组件销毁时清除定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style lang="scss">
.login-page {
  min-height: 100vh;
  background-color: #ffffff;
  padding-top: var(--status-bar-height);
  transition: background-color 0.3s ease;

  .nav-bar {
    position: relative;
    display: flex;
    align-items: center;
    height: 44px;
    padding: 0 16px;
    background-color: #ffffff;

    .icon-left {
      font-size: 24px;
      color: #000000;
      opacity: 0.9;
    }

    .title {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      font-size: 17px;
      font-weight: 500;
      color: #000000;
    }
  }

  .logo-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 48px;
    animation: fadeInDown 0.6s ease;

    .logo {
      width: 88px;
      height: 88px;
      border-radius: 22px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      transition: transform 0.3s ease;

      &:active {
        transform: scale(0.95);
      }
    }

    .app-name {
      margin-top: 16px;
      font-size: 24px;
      color: #000000;
      font-weight: 400;
    }
  }

  .login-options {
    margin-top: 48px;
    padding: 0 32px;
    animation: fadeInUp 0.6s ease;

    .login-buttons {
      .login-option {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 52px;
        margin-bottom: 20px;
        border-radius: 12px;
        font-weight: 500;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);

        .iconfont {
          font-size: 20px;
          margin-right: 8px;
        }

        .option-text {
          font-size: 16px;
        }

        &.phone {
          background-color: #07c160;

          .iconfont,
          .option-text {
            color: #ffffff;
          }
        }

        &.wechat {
          background-color: #f7f7f7;

          .iconfont,
          .option-text {
            color: #000000;
          }
        }

        &:active {
          opacity: 0.7;
        }
      }
    }

    .login-form {
      .input-group {
        position: relative;
        margin-bottom: 24px;

        input {
          width: 86%;
          height: 56px;
          padding: 0 24px;
          border-radius: 16px;
          background-color: #f7f7f7;
          font-size: 16px;
          color: #000000;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

          &:focus {
            background-color: #f0f0f0;
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);

            &::placeholder {
              color: #999999;
              opacity: 0.7;
            }
          }
        }

        .verify-btn {
          position: absolute;
          right: 12px;
          top: 10px;
          height: 36px;
          padding: 0 20px;
          border-radius: 12px;
          background-color: #07c160;
          color: #ffffff;
          font-size: 14px;
          font-weight: 500;
          line-height: 36px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

          &:active:not(:disabled) {
            transform: scale(0.96);
            background-color: darken(#07c160, 5%);
          }

          &:disabled {
            background-color: #e8e8e8;
            color: #999999;
          }
        }
      }
    }
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-color-scheme: dark) {
    .login-page {
      background-color: #000000;

      .nav-bar {
        background-color: #000000;

        .icon-left,
        .title {
          color: #ffffff;
        }
      }

      .logo-section {
        .app-name {
          color: #ffffff;
        }
      }

      .login-options {
        .login-form {
          .input-group {
            input {
              background-color: #1c1c1e;
              color: #ffffff;

              &::placeholder {
                color: #666666;
              }
            }
          }
        }

        .login-buttons {
          .login-option {
            &.wechat {
              background-color: #1c1c1e;

              .iconfont,
              .option-text {
                color: #ffffff;
              }
            }
          }
        }
      }
    }
  }
  .switch-type {
    margin-top: 20px;
    display: block;
    text-align: center;
    font-size: 14px;
    color: #576b95;

    &:active {
      opacity: 0.7;
    }
  }
  .bottom-tips {
    position: fixed;
    bottom: 32px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 16px;
    z-index: 1;

    .tip-text {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.5);
      line-height: 1.4;
    }

    .link-text {
      font-size: 13px;
      color: #576b95;
      margin: 0 4px;
      transition: all 0.3s ease;
      position: relative;

      &:active {
        opacity: 0.7;
      }

      &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: -2px;
        height: 1px;
        background-color: currentColor;
        opacity: 0.3;
      }
    }
  }
  .bottom-tips {
    .tip-text {
      // color: rgba(255, 255, 255, 0.5);
    }

    .link-text {
      color: #7d90b7;
    }
  }
}
</style>
