<template>
  <view class="chat-page" :class="{ 'dark-mode': isDarkMode }">
    <!-- 遮罩层 -->
    <!-- <view class="modal-overlay" :class="{ show: showEmojiPanel || showMorePanel }" @tap="closeAllPanels"></view> -->
    <!-- 顶部导航栏 -->
    <view class="chat-header">
      <text class="title">{{ chatInfo.name }}</text>
      <text class="member-count" v-if="chatInfo.type === 'group'">{{ chatInfo.memberCount }}人</text>
    </view>

    <!-- 聊天内容区域 -->
    <scroll-view class="chat-content" scroll-y>
      <view class="message-list">
        <view v-for="msg in messageList" :key="msg.id" :class="['message-item', msg.isSelf ? 'self' : 'other']">
          <image class="avatar" :src="msg.avatar" mode="aspectFill" @tap="navigateToContactDetail(msg)" />
          <view class="message-content">
            <text class="time">{{ msg.time }}</text>
            <view class="message-bubble">
              <text class="message-text">{{ msg.content }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部输入区域 -->
    <view class="chat-input-area">
      <view class="input-wrapper">
        <view class="function-btn voice-btn" @tap.stop="toggleVoiceInput">
          <text class="iconfont">🎤</text>
        </view>
        <view class="input-box">
          <textarea
            v-model="inputMessage"
            class="message-input"
            :adjust-position="true"
            :show-confirm-bar="false"
            :cursor-spacing="20"
            :maxlength="500"
            :fixed="true"
            :focus="inputFocus"
            placeholder="发送消息"
            @confirm="sendMessage"
            @focus="handleInputFocus"
            @blur="handleInputBlur"
            @input="handleInput"
          />
        </view>
        <view class="function-btn emoji-btn" @tap.stop="toggleEmojiPanel">
          <text class="iconfont">😊</text>
        </view>
        <view class="function-btn more-btn" @tap.stop="toggleMorePanel">
          <text class="iconfont">+</text>
        </view>
        <view class="send-btn" @tap.stop="sendMessage" v-if="inputMessage.trim()">
          <text>发送</text>
        </view>
      </view>
    
      <!-- 更多功能面板 -->
      <view class="more-panel" v-if="showMorePanel" :class="{ 'show': showMorePanel }" @tap.stop>
        <view class="panel-content">
          <view class="function-grid">
            <view class="function-item" @tap.stop="chooseImage">
              <view class="icon-wrapper">
                <text class="iconfont">🖼️</text>
              </view>
              <text class="label">图片</text>
            </view>
            <view class="function-item" @tap.stop="chooseFile">
              <view class="icon-wrapper">
                <text class="iconfont">📎</text>
              </view>
              <text class="label">文件</text>
            </view>
            <view class="function-item" @tap.stop="startVideoCall">
              <view class="icon-wrapper">
                <text class="iconfont">📹</text>
              </view>
              <text class="label">视频通话</text>
            </view>
            <view class="function-item" @tap.stop="openLocation">
              <view class="icon-wrapper">
                <text class="iconfont">📍</text>
              </view>
              <text class="label">位置</text>
            </view>
          </view>
        </view>
      </view>
      
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 获取页面参数
const chatInfo = ref({
  id: '',
  name: ''
})

// 消息列表数据
const messageList = ref([
  {
    id: 1,
    content: '你好，最近怎么样？',
    avatar: 'https://picsum.photos/100?random=18',
    isSelf: false,
    time: '10:30'
  },
  {
    id: 2,
    content: '挺好的，你呢？',
    avatar: 'https://picsum.photos/100?random=18',
    isSelf: true,
    time: '10:31'
  }
])

// 输入框内容
const inputMessage = ref('')

// 表情包列表
const emojiList = ref([
  '😊', '😂', '🤣', '😍', '😘', '😅', '😉', '😋',
  '😎', '😢', '😭', '😱', '😡', '🤔', '😴', '🤗',
  '👍', '👎', '👏', '🙏', '🎉', '❤️', '💔', '💪'
])

// 面板显示状态
const showEmojiPanel = ref(false)
const showMorePanel = ref(false)

// 切换表情包面板
const toggleEmojiPanel = () => {
  showEmojiPanel.value = !showEmojiPanel.value
  if (showEmojiPanel.value) {
    showMorePanel.value = false
  }
}

// 关闭所有面板
const closeAllPanels = () => {
  showEmojiPanel.value = false
  showMorePanel.value = false
}

// 插入表情
const insertEmoji = (emoji) => {
  inputMessage.value += emoji
}

// 选择图片
const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0]
      messageList.value.push({
        id: Date.now(),
        type: 'image',
        content: tempFilePath,
        avatar: 'https://picsum.photos/100?random=18',
        isSelf: true,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      })
    }
  })
}

// 发送消息
const sendMessage = () => {
  if (!inputMessage.value.trim()) return

  messageList.value.push({
    id: Date.now(),
    type: 'text',
    content: inputMessage.value,
    avatar: 'https://picsum.photos/100?random=18',
    isSelf: true,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  })

  inputMessage.value = ''
  showEmojiPanel.value = false
  showMorePanel.value = false
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const { id, name } = currentPage.$page.options
  
  chatInfo.value = {
    id,
    name
  }
})

// 输入框相关状态
const inputFocus = ref(false)
const isVoiceMode = ref(false)
const isRecording = ref(false)

// 切换语音输入模式
const toggleVoiceInput = () => {
  isVoiceMode.value = !isVoiceMode.value
  showEmojiPanel.value = false
  showMorePanel.value = false
}

// 开始录音
const startVoiceRecord = () => {
  isRecording.value = true
  uni.startRecord({
    success: () => {
      uni.showToast({ title: '开始录音', icon: 'none' })
    }
  })
}

// 停止录音
const stopVoiceRecord = () => {
  isRecording.value = false
  uni.stopRecord({
    success: (res) => {
      messageList.value.push({
        id: Date.now(),
        type: 'voice',
        content: res.tempFilePath,
        avatar: 'https://picsum.photos/100?random=18',
        isSelf: true,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      })
    }
  })
}

// 取消录音
const cancelVoiceRecord = () => {
  isRecording.value = false
  uni.stopRecord()
  uni.showToast({ title: '已取消', icon: 'none' })
}

// 切换更多功能面板
const toggleMorePanel = () => {
  showMorePanel.value = !showMorePanel.value
  if (showMorePanel.value) {
    showEmojiPanel.value = false
  }
}

// 选择文件
const chooseFile = () => {
  uni.chooseFile({
    count: 1,
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0]
      messageList.value.push({
        id: Date.now(),
        type: 'file',
        content: tempFilePath,
        avatar: 'https://picsum.photos/100?random=18',
        isSelf: true,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      })
    }
  })
}

// 开始视频通话
const startVideoCall = () => {
  uni.showToast({ title: '视频通话功能开发中', icon: 'none' })
}

// 发送位置
const openLocation = () => {
  uni.chooseLocation({
    success: (res) => {
      messageList.value.push({
        id: Date.now(),
        type: 'location',
        content: JSON.stringify(res),
        avatar: 'https://picsum.photos/100?random=18',
        isSelf: true,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      })
    }
  })
}

// 处理输入框内容变化
const handleInput = (e) => {
  inputMessage.value = e.detail.value
}

// 处理输入框焦点
const handleInputFocus = () => {
  inputFocus.value = true
  showEmojiPanel.value = false
  showMorePanel.value = false
}

const handleInputBlur = () => {
  inputFocus.value = false
}
// 跳转到联系人详情页面
const navigateToContactDetail = (msg) => {
  uni.navigateTo({
    url: `/pages/contact-detail/contact-detail?id=${msg.id}&name=${msg.name}&avatar=${encodeURIComponent(msg.avatar)}`
  })
}
</script>

<style lang="scss">
.chat-page {
  background: var(--bg-gradient, linear-gradient(135deg, #F6F7F9, #EDEDED));
  min-height: 100vh;
  transition: background-color 0.3s ease;

  &.dark-mode {
    --bg-gradient: linear-gradient(135deg, #1a1a1a, #2d2d2d);

    .chat-header {
      background: rgba(40, 40, 40, 0.9);
      .title { color: #ffffff; }
    }

    .message-bubble {
      background: rgba(40, 40, 40, 0.8);
      color: #ffffff;
    }

    .chat-input-area {
      background: rgba(40, 40, 40, 0.9);
      input { background: rgba(60, 60, 60, 0.8); color: #ffffff; }
    }

    .emoji-panel {
      --panel-bg: rgba(40, 40, 40, 0.95);
      --text-color: #fff;
      --item-bg: rgba(60, 60, 60, 0.8);
    }
  }

  .chat-header {
    padding: 20rpx;
    background: #EDEDED;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 88rpx;
  
    .title {
      font-size: 34rpx;
      font-weight: 500;
      color: #000;
    }
  }

  .chat-content {
    padding: 108rpx 20rpx 120rpx;
    background: #EDEDED;
    min-height: 100vh;
  
    .message-item {
      margin-bottom: 30rpx;
      display: flex;
      align-items: flex-start;
      position: relative;
  
      &.self { 
        flex-direction: row-reverse; 
        .message-bubble {
          background: #95EC69;
          margin-right: 20rpx;
          &:before {
            border-left-color: #95EC69;
            right: -16rpx;
            left: auto;
            border-right-color: transparent;
          }
        }
      }
  
      .avatar {
        width: 80rpx;
        height: 80rpx;
        border-radius: 8rpx;
        margin: 0 20rpx;
      }
  
      .message-bubble {
        max-width: 80%;
        padding: 18rpx 24rpx;
        background: #fff;
        border-radius: 8rpx;
        position: relative;
        margin-left: 20rpx;
        word-break: break-all;
  
        &:before {
          content: '';
          position: absolute;
          left: -16rpx;
          top: 20rpx;
          border: 8rpx solid transparent;
          border-right-color: #fff;
        }
  
        .message-text {
          font-size: 32rpx;
          line-height: 1.4;
          color: #000;
        }
      }
    }
  }

  .chat-input-area {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20rpx;
    background: var(--input-area-bg, rgba(247, 247, 247, 0.95));
    backdrop-filter: blur(10px);
    border-top: 1px solid var(--border-color, rgba(229, 229, 229, 0.5));
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    .input-wrapper {
      display: flex;
      align-items: center;
      gap: 20rpx;
      padding: 12rpx 16rpx;
    }

    .function-btn {
      width: 68rpx;
      height: 68rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--btn-bg, rgba(255, 255, 255, 0.9));
      transition: all 0.2s ease;
      
      .iconfont {
        font-size: 40rpx;
        color: var(--icon-color, #576B95);
      }

      &:active {
        background: var(--btn-active-bg, rgba(0, 0, 0, 0.05));
        transform: scale(0.95);
      }

      &.voice-btn {
        margin-right: 4rpx;
      }

      &.emoji-btn,
      &.more-btn {
        margin-left: 4rpx;
      }
    }

    .input-box {
      flex: 1;
      background: var(--input-box-bg, #FFFFFF);
      border-radius: 36rpx;
      border: 1px solid var(--border-color, rgba(229, 229, 229, 0.8));
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      transition: all 0.3s ease;
      
      .message-input {
        width: 100%;
        min-height: 72rpx;
        max-height: 120rpx;
        padding: 16rpx 24rpx;
        font-size: 30rpx;
        line-height: 1.5;
        color: var(--text-color, #333);
      }

      &:focus-within {
        border-color: var(--primary-color, #07C160);
        box-shadow: 0 2px 12px rgba(7, 193, 96, 0.1);
      }
    }

    .send-btn {
      padding: 16rpx 32rpx;
      background: var(--primary-color, #07C160);
      border-radius: 36rpx;
      transition: all 0.2s ease;
      
      text {
        color: #FFFFFF;
        font-size: 28rpx;
        font-weight: 500;
      }

      &:active {
        transform: scale(0.95);
        opacity: 0.9;
      }
    }

    &.dark-mode {
      --input-area-bg: rgba(40, 40, 40, 0.95);
      --border-color: rgba(60, 60, 60, 0.5);
      --input-box-bg: rgba(50, 50, 50, 0.8);
      --icon-color: rgba(255, 255, 255, 0.85);
      --text-color: rgba(255, 255, 255, 0.9);
      --btn-active-bg: rgba(255, 255, 255, 0.1);
      --primary-color: #07C160;
    }
  }

  .more-panel {
    // position: fixed;
    // bottom: 140rpx;
    // left: 0;
    // right: 0;
    background: var(--panel-bg, rgba(255, 255, 255, 0.98));
    border-radius: 24rpx 24rpx 0 0;
    padding: 32rpx 20rpx;
    box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.08);
    z-index: 1000;
    transform: translateY(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &.show {
      transform: translateY(0);
    }

    .panel-content {
      .function-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 32rpx;
        padding: 20rpx;

        .function-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12rpx;

          .icon-wrapper {
            width: 100rpx;
            height: 100rpx;
            background: #F7F7F7;
            border-radius: 20rpx;
            display: flex;
            align-items: center;
            justify-content: center;

            .iconfont {
              font-size: 48rpx;
              color: #576B95;
            }
          }

          .label {
            font-size: 24rpx;
            color: #333;
          }

          &:active {
            opacity: 0.7;
          }
        }
      }
    }
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;

  &.show {
    opacity: 1;
    visibility: visible;
  }
}
</style>