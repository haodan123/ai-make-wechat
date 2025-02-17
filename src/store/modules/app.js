import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    theme: 'light',
    language: 'zh_CN',
    fontSize: 'normal',
    soundEnabled: true,
    vibrateEnabled: true,
    notificationEnabled: true,
    backgroundImage: '',
    chatBackgroundImage: ''
  }),
  
  getters: {
    currentTheme: (state) => state.theme,
    currentLanguage: (state) => state.language,
    currentFontSize: (state) => state.fontSize,
    isSoundEnabled: (state) => state.soundEnabled,
    isVibrateEnabled: (state) => state.vibrateEnabled,
    isNotificationEnabled: (state) => state.notificationEnabled
  },
  
  actions: {
    setTheme(theme) {
      this.theme = theme
    },
    
    setLanguage(language) {
      this.language = language
    },
    
    setFontSize(size) {
      this.fontSize = size
    },
    
    toggleSound() {
      this.soundEnabled = !this.soundEnabled
    },
    
    toggleVibrate() {
      this.vibrateEnabled = !this.vibrateEnabled
    },
    
    toggleNotification() {
      this.notificationEnabled = !this.notificationEnabled
    },
    
    setBackgroundImage(url) {
      this.backgroundImage = url
    },
    
    setChatBackgroundImage(url) {
      this.chatBackgroundImage = url
    },
    
    resetSettings() {
      this.theme = 'light'
      this.language = 'zh_CN'
      this.fontSize = 'normal'
      this.soundEnabled = true
      this.vibrateEnabled = true
      this.notificationEnabled = true
      this.backgroundImage = ''
      this.chatBackgroundImage = ''
    }
  },
  
  persist: {
    key: 'app-store',
    paths: ['theme', 'language', 'fontSize', 'soundEnabled', 'vibrateEnabled', 'notificationEnabled', 'backgroundImage', 'chatBackgroundImage']
  }
})