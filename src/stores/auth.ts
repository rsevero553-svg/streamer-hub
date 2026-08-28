import { defineStore } from 'pinia'
import { supabase } from '@/services/supabase'
import { fetchOwnProfile } from '@/services/profiles.service'
import type { Profile } from '@/types/user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userId: null as string | null,
    profile: null as Profile | null,
    initialized: false
  }),
  getters: {
    isAuthenticated: (state) => !!state.userId,
    isAdmin: (state) => state.profile?.role === 'admin'
  },
  actions: {
    async init() {
      const { data } = await supabase.auth.getSession()
      this.userId = data.session?.user.id ?? null
      if (this.userId) this.profile = await fetchOwnProfile(this.userId)
      this.initialized = true

      supabase.auth.onAuthStateChange(async (_event, session) => {
        this.userId = session?.user.id ?? null
        this.profile = this.userId ? await fetchOwnProfile(this.userId) : null
      })
    },
    async refreshProfile() {
      if (this.userId) this.profile = await fetchOwnProfile(this.userId)
    },
    clear() {
      this.userId = null
      this.profile = null
    }
  }
})
