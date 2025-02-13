<template>
  <view class="contacts-page" @tap="() => showSearchHistory = false">
    <scroll-view scroll-y scroll-with-animation class="contact-list" :style="{ height: scrollViewHeight }" :scroll-into-view="currentLetter" @scroll="handleScroll">
      <!-- 搜索框 -->
      <view class="search-box" @tap.stop>
        <view class="search-input">
          <text class="iconfont icon-search"></text>
          <input 
            type="text" 
            v-model="searchKeyword" 
            placeholder="搜索姓名或拼音" 
            class="input" 
            @input="handleSearch"
            @focus="showSearchHistory = true"
            @blur="() => setTimeout(() => showSearchHistory = false, 200)"
            @confirm="saveSearchHistory"
          />
          <text 
            v-if="showClearBtn" 
            class="iconfont icon-close clear-btn"
            @tap="clearSearch"
          ></text>
        </view>
        
        <!-- 搜索历史 -->
        <view class="search-history" v-if="showSearchHistory && searchHistory.length > 0">
          <view class="history-header">
            <text class="title">搜索历史</text>
            <text class="clear" @tap="clearSearchHistory">清空</text>
          </view>
          <view class="history-list">
            <view 
              class="history-item" 
              v-for="item in searchHistory" 
              :key="item"
              @tap="selectHistory(item)"
            >
              <text class="iconfont icon-time"></text>
              <text class="keyword">{{item}}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 新的朋友等功能入口 -->
      <view class="function-list">
        <view class="function-item" v-for="item in functionList" :key="item.id" @tap="handleFunction(item)">
          <view class="icon" :style="{ backgroundColor: item.bgColor }">
            <text class="iconfont" :class="item.icon"></text>
          </view>
          <text class="name">{{ item.name }}</text>
        </view>
      </view>

      <!-- 联系人列表 -->
      <view class="contact-group" v-for="group in filteredContactGroups" :key="group.letter" :id="`letter-${group.letter}`" :data-letter="group.letter">
        <view class="group-title">{{ group.letter }}</view>
        <view class="group-list">
          <view class="contact-item" v-for="contact in group.list" :key="contact.id" @tap="showContactDetail(contact)">
            <image class="avatar" :src="contact.avatar" mode="aspectFill" />
            <text class="name">{{ contact.name }}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 字母索引 -->
    <view class="index-list">
      <text v-for="letter in letters" :key="letter" class="index-item" :class="{ active: activeIndex === letter }" @tap="scrollToLetter(letter)">{{ letter }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import pinyin from 'pinyin-match'

// 功能列表
const functionList = ref([
  { id: 1, name: '新的朋友', icon: 'icon-add-friend', bgColor: '#54B4EF' },
  { id: 2, name: '群聊', icon: 'icon-group', bgColor: '#54B4EF' },
  { id: 3, name: '标签', icon: 'icon-tag', bgColor: '#54B4EF' },
  { id: 4, name: '公众号', icon: 'icon-official', bgColor: '#54B4EF' }
])

// 联系人分组数据
const contactGroups = ref([
  {
    letter: 'A',
    list: [
      { id: 1, name: 'Alice', avatar: '/static/avatar/default.png' },
      { id: 2, name: 'Andy', avatar: '/static/avatar/default.png' },
      { id: 3, name: 'Alex', avatar: '/static/avatar/default.png' },
      { id: 4, name: 'Anna', avatar: '/static/avatar/default.png' },
      { id: 53, name: 'Aaron', avatar: '/static/avatar/default.png' },
      { id: 54, name: 'Amber', avatar: '/static/avatar/default.png' },
      { id: 55, name: 'Adrian', avatar: '/static/avatar/default.png' },
      { id: 56, name: 'Amanda', avatar: '/static/avatar/default.png' }
    ]
  },
  {
    letter: 'B',
    list: [
      { id: 5, name: 'Bob', avatar: '/static/avatar/default.png' },
      { id: 6, name: 'Bill', avatar: '/static/avatar/default.png' },
      { id: 7, name: 'Bruce', avatar: '/static/avatar/default.png' },
      { id: 57, name: 'Benjamin', avatar: '/static/avatar/default.png' },
      { id: 58, name: 'Bella', avatar: '/static/avatar/default.png' },
      { id: 59, name: 'Brian', avatar: '/static/avatar/default.png' },
      { id: 60, name: 'Betty', avatar: '/static/avatar/default.png' }
    ]
  },
  {
    letter: 'C',
    list: [
      { id: 8, name: 'Charlie', avatar: '/static/avatar/default.png' },
      { id: 9, name: 'Catherine', avatar: '/static/avatar/default.png' }
    ]
  },
  {
    letter: 'D',
    list: [
      { id: 10, name: 'David', avatar: '/static/avatar/default.png' },
      { id: 11, name: 'Daniel', avatar: '/static/avatar/default.png' }
    ]
  },
  {
    letter: 'E',
    list: [
      { id: 12, name: 'Emma', avatar: '/static/avatar/default.png' },
      { id: 13, name: 'Eric', avatar: '/static/avatar/default.png' }
    ]
  },
  {
    letter: 'F',
    list: [
      { id: 14, name: 'Frank', avatar: '/static/avatar/default.png' },
      { id: 15, name: 'Fiona', avatar: '/static/avatar/default.png' }
    ]
  },
  {
    letter: 'G',
    list: [
      { id: 16, name: 'George', avatar: '/static/avatar/default.png' },
      { id: 17, name: 'Grace', avatar: '/static/avatar/default.png' }
    ]
  },
  {
    letter: 'H',
    list: [
      { id: 18, name: 'Henry', avatar: '/static/avatar/default.png' },
      { id: 19, name: 'Hannah', avatar: '/static/avatar/default.png' }
    ]
  },
  {
    letter: 'I',
    list: [
      { id: 20, name: 'Ian', avatar: '/static/avatar/default.png' },
      { id: 21, name: 'Iris', avatar: '/static/avatar/default.png' }
    ]
  },
  {
    letter: 'J',
    list: [
      { id: 22, name: 'Jack', avatar: '/static/avatar/default.png' },
      { id: 23, name: 'Julia', avatar: '/static/avatar/default.png' }
    ]
  },
  {
    letter: 'K',
    list: [
      { id: 24, name: 'Kevin', avatar: '/static/avatar/default.png' },
      { id: 25, name: 'Kate', avatar: '/static/avatar/default.png' }
    ]
  },
  {
    letter: 'L',
    list: [
      { id: 26, name: 'Leo', avatar: '/static/avatar/default.png' },
      { id: 27, name: 'Lucy', avatar: '/static/avatar/default.png' }
    ]
  },
  {
    letter: 'M',
    list: [
      { id: 28, name: 'Mike', avatar: '/static/avatar/default.png' },
      { id: 29, name: 'Mary', avatar: '/static/avatar/default.png' }
    ]
  },
  {
    letter: 'N',
    list: [
      { id: 30, name: 'Nick', avatar: '/static/avatar/default.png' },
      { id: 31, name: 'Nancy', avatar: '/static/avatar/default.png' }
    ]
  },
  {
    letter: 'O',
    list: [
      { id: 32, name: 'Oliver', avatar: '/static/avatar/default.png' },
      { id: 33, name: 'Olivia', avatar: '/static/avatar/default.png' }
    ]
  },
  {
    letter: 'P',
    list: [
      { id: 34, name: 'Peter', avatar: '/static/avatar/default.png' },
      { id: 35, name: 'Penny', avatar: '/static/avatar/default.png' }
    ]
  },
  {
    letter: 'Q',
    list: [
      { id: 36, name: 'Quinn', avatar: '/static/avatar/default.png' }
    ]
  },
  {
    letter: 'R',
    list: [
      { id: 37, name: 'Ryan', avatar: '/static/avatar/default.png' },
      { id: 38, name: 'Rachel', avatar: '/static/avatar/default.png' }
    ]
  },
  {
    letter: 'S',
    list: [
      { id: 39, name: 'Sam', avatar: '/static/avatar/default.png' },
      { id: 40, name: 'Sarah', avatar: '/static/avatar/default.png' }
    ]
  },
  {
    letter: 'T',
    list: [
      { id: 41, name: 'Tom', avatar: '/static/avatar/default.png' },
      { id: 42, name: 'Tina', avatar: '/static/avatar/default.png' }
    ]
  },
  {
    letter: 'U',
    list: [
      { id: 43, name: 'Uma', avatar: '/static/avatar/default.png' }
    ]
  },
  {
    letter: 'V',
    list: [
      { id: 44, name: 'Victor', avatar: '/static/avatar/default.png' },
      { id: 45, name: 'Victoria', avatar: '/static/avatar/default.png' }
    ]
  },
  {
    letter: 'W',
    list: [
      { id: 46, name: 'William', avatar: '/static/avatar/default.png' },
      { id: 47, name: 'Wendy', avatar: '/static/avatar/default.png' }
    ]
  },
  {
    letter: 'X',
    list: [
      { id: 48, name: 'Xavier', avatar: '/static/avatar/default.png' }
    ]
  },
  {
    letter: 'Y',
    list: [
      { id: 49, name: 'Yolanda', avatar: '/static/avatar/default.png' },
      { id: 50, name: 'Yuki', avatar: '/static/avatar/default.png' }
    ]
  },
  {
    letter: 'Z',
    list: [
      { id: 51, name: 'Zack', avatar: '/static/avatar/default.png' },
      { id: 52, name: 'Zoe', avatar: '/static/avatar/default.png' },
      { id: 61, name: 'Zachary', avatar: '/static/avatar/default.png' },
      { id: 62, name: 'Zelda', avatar: '/static/avatar/default.png' },
      { id: 63, name: 'Zeus', avatar: '/static/avatar/default.png' }
    ]
  }
])

// 字母索引
const letters = ref(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'])
// 当前选中的字母索引ID
const currentLetter = ref('')

// 获取可用高度，用于设置滚动区域的高度
const scrollViewHeight = ref('100vh')

// 当前高亮的字母
const activeIndex = ref('')

// 监听滚动事件，更新当前高亮的字母索引
const handleScroll = (e) => {
  
  const scrollTop = e.detail.scrollTop
  const groups = document.querySelectorAll('.contact-group')
  let currentGroup = null
  
  for (let group of groups) {
    const rect = group.getBoundingClientRect()
    
    if (rect.top <= 150) { // 调整判断阈值，考虑搜索框和功能列表的高度
      currentGroup = group
    } else {
      break // 一旦找到第一个未到达阈值的组，就停止遍历
    }
  }


  if (currentGroup) {
    const letter = currentGroup.dataset.letter
    if (activeIndex.value !== letter) {
      activeIndex.value = letter
      // console.log(letter);
      
    }
  }
}

// 在onMounted中添加滚动监听
onMounted(() => {
  uni.getSystemInfo({
    success: (res) => {
      scrollViewHeight.value = `${res.windowHeight}px`
    }
  })
})

// 处理功能项点击，跳转到对应的功能页面
const handleFunction = (item) => {
  uni.navigateTo({
    url: `/pages/contacts/${item.name}/index`
  })
}

// 显示联系人详情页面
const showContactDetail = (contact) => {
  uni.navigateTo({
    url: `/pages/contact-detail/contact-detail?id=${contact.id}`
  })
}

// 点击字母索引时，滚动到对应的联系人分组
const scrollToLetter = (letter) => {
  currentLetter.value = `letter-${letter}`
}

// 搜索相关状态
const searchKeyword = ref('')
const searchHistory = ref([])
const showClearBtn = ref(false)
const showSearchHistory = ref(false)

// 防抖函数
const debounce = (fn, delay) => {
  let timer = null
  return (...args) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// 过滤后的联系人分组数据
const filteredContactGroups = computed(() => {
  if (!searchKeyword.value.trim()) return contactGroups.value
  const keyword = searchKeyword.value.trim().toLowerCase()
  
  return contactGroups.value.map(group => ({
    letter: group.letter,
    list: group.list.filter(contact => {
      const name = contact.name.toLowerCase()
      const pinyinMatch = pinyin.match(contact.name, keyword)
      return name.includes(keyword) || pinyinMatch !== false
    })
  })).filter(group => group.list.length > 0)
})

// 处理搜索输入
const handleSearch = debounce(() => {
  const hasKeyword = searchKeyword.value.trim().length > 0
  showClearBtn.value = hasKeyword
  
  if (hasKeyword) {
    currentLetter.value = ''
    activeIndex.value = filteredContactGroups.value[0]?.letter || ''
  }
}, 300)

// 清空搜索
const clearSearch = () => {
  searchKeyword.value = ''
  showClearBtn.value = false
  showSearchHistory.value = true
}

// 选择搜索历史
const selectHistory = (keyword) => {
  searchKeyword.value = keyword
  handleSearch()
}

// 保存搜索历史
const saveSearchHistory = () => {
  if (!searchKeyword.value) return
  const keyword = searchKeyword.value
  searchHistory.value = [keyword, ...searchHistory.value.filter(k => k !== keyword)].slice(0, 10)
  uni.setStorageSync('contactSearchHistory', searchHistory.value)
}

// 清空搜索历史
const clearSearchHistory = () => {
  searchHistory.value = []
  uni.removeStorageSync('contactSearchHistory')
}

// 监听搜索关键词变化
watch(searchKeyword, () => {
  handleSearch()
})

// 在组件挂载时加载搜索历史
onMounted(() => {
  const history = uni.getStorageSync('contactSearchHistory')
  if (history) {
    searchHistory.value = history
  }
})
</script>

<style lang="scss">
.contacts-page {
  background: var(--bg-gradient, linear-gradient(135deg, #F6F7F9, #EDEDED));
  min-height: 100vh;
  transition: background-color 0.3s ease;

  &.dark-mode {
    --bg-gradient: linear-gradient(135deg, #1a1a1a, #2d2d2d);

    .search-box {
      background: rgba(40, 40, 40, 0.9);
      .search-input { background: rgba(60, 60, 60, 0.8); color: #ffffff; }
    }

    .function-list {
      .function-item {
        background: rgba(40, 40, 40, 0.8);
        .name { color: #ffffff; }
      }
    }

    .contact-group {
      .group-title { color: #888888; }
      .contact-item {
        background: rgba(40, 40, 40, 0.8);
        .name { color: #ffffff; }
      }
    }

    .index-list { color: #888888; }
  }

  .search-box {
    padding: 20rpx;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(12px);
    position: relative;
    z-index: 100;

    .search-input {
      display: flex;
      align-items: center;
      padding: 16rpx 24rpx;
      background: #f5f5f5;
      border-radius: 36rpx;
      transition: all 0.3s ease;

      &:active {
        background: #ffffff;
        box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
      }

      .icon-search {
        margin-right: 12rpx;
        color: #999999;
        font-size: 28rpx;
      }

      .input {
        flex: 1;
        font-size: 28rpx;
        color: #333;
      }

      .clear-btn {
        padding: 10rpx;
        color: #999;
        font-size: 24rpx;
      }

      .placeholder {
        color: #999999;
        font-size: 28rpx;
      }
    }

    .search-history {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: #fff;
      border-radius: 0 0 20rpx 20rpx;
      box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
      padding: 20rpx;
      
      .history-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20rpx;
        
        .title {
          font-size: 28rpx;
          color: #333;
          font-weight: 500;
        }
        
        .clear {
          font-size: 24rpx;
          color: #999;
          padding: 10rpx;
        }
      }
      
      .history-list {
        .history-item {
          display: flex;
          align-items: center;
          padding: 16rpx 0;
          
          .icon-time {
            font-size: 24rpx;
            color: #999;
            margin-right: 12rpx;
          }
          
          .keyword {
            font-size: 28rpx;
            color: #333;
          }
        }
      }
    }
  }

  .function-list {
    padding: 20rpx;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20rpx;

    .function-item {
      background: rgba(255, 255, 255, 0.8);
      border-radius: 20rpx;
      padding: 24rpx;
      text-align: center;
      transition: all 0.3s ease;
      animation: fadeIn 0.3s ease;

      &:active { transform: scale(0.95); }

      .icon {
        width: 80rpx;
        height: 80rpx;
        margin: 0 auto 12rpx;
        border-radius: 16rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        .iconfont {
          font-size: 40rpx;
          color: #ffffff;
        }
      }

      .name {
        font-size: 24rpx;
        color: #333333;
      }
    }
  }

  .contact-group {
    padding: 0 20rpx;

    .group-title {
      padding: 16rpx 0;
      font-size: 28rpx;
      color: #999999;
    }

    .contact-item {
      display: flex;
      align-items: center;
      padding: 20rpx;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 16rpx;
      margin-bottom: 12rpx;
      transition: all 0.3s ease;
      animation: slideIn 0.3s ease;

      &:active { transform: scale(0.98); }

      .avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 12rpx;
        margin-right: 20rpx;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 400% 100%;
        animation: shimmer 1.5s infinite;
      }

      @keyframes shimmer {
        0% {
          background-position: 100% 0;
        }
        100% {
          background-position: -100% 0;
        }
      }
      .name {
        font-size: 32rpx;
        color: #333333;
      }
    }
  }

  .index-list {
    position: fixed;
    right: 16rpx;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12rpx;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(8px);
    border-radius: 24rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    .index-item {
      padding: 6rpx 8rpx;
      margin: 2rpx 0;
      font-size: 24rpx;
      font-weight: 500;
      color: #666666;
      transition: all 0.2s ease;
      border-radius: 8rpx;

      &.active {
        transform: scale(1.2);
        color: #07C160;
        background: rgba(7, 193, 96, 0.1);
      }

      &:active {
        transform: scale(1.2);
        color: #07C160;
        background: rgba(7, 193, 96, 0.1);
      }
    }

    &:active {
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.15);
    }
  }

  &.dark-mode {
    .index-list {
      background: rgba(40, 40, 40, 0.8);
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.2);

      .index-item {
        color: #aaaaaa;

        &:active {
          color: #07C160;
          background: rgba(7, 193, 96, 0.15);
        }
      }

      &:active {
        background: rgba(40, 40, 40, 0.9);
      }
    }
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20rpx); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(20rpx); }
  to { opacity: 1; transform: translateX(0); }
}
</style>