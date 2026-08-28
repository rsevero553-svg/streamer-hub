import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    mobileMenuOpen: false,
    helpChatOpen: false
  }),
  actions: {
    toggleMobileMenu(v?: boolean) { this.mobileMenuOpen = v ?? !this.mobileMenuOpen },
    toggleHelpChat(v?: boolean) { this.helpChatOpen = v ?? !this.helpChatOpen }
  }
})
