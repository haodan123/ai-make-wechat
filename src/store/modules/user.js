import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    userInfo: null,
    isLogin: false,
    contacts: [],
    chatList: []
  }),
  
  getters: {
    hasLogin: (state) => state.isLogin,
    getUserInfo: (state) => state.userInfo,
    getContacts: (state) => state.contacts,
    getChatList: (state) => state.chatList
  },
  
  actions: {
    setToken(token) {
      this.token = token
    },
    
    setUserInfo(info) {
      this.userInfo = info
      this.isLogin = true
    },
    
    updateContacts(contacts) {
      this.contacts = contacts
    },
    
    updateChatList(chatList) {
      this.chatList = chatList
    },
    
    logout() {
      this.token = ''
      this.userInfo = null
      this.isLogin = false
      this.contacts = []
      this.chatList = []
    }
  },
  
  persist: {
    key: 'user-store',
    paths: ['token', 'userInfo', 'isLogin']
  }
})