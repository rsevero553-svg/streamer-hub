import { defineStore } from 'pinia'
import { fetchApps, fetchFeaturedApps } from '@/services/applications.service'
import type { AppEntity } from '@/types/application'
import type { LoadState } from '@/types/misc'

export const useAppsStore = defineStore('apps', {
  state: () => ({
    women: [] as AppEntity[],
    men: [] as AppEntity[],
    featured: [] as AppEntity[],
    state: 'idle' as LoadState
  }),
  actions: {
    async loadAll() {
      this.state = 'loading'
      try {
        const [women, men, featured] = await Promise.all([
          fetchApps('women'),
          fetchApps('men'),
          fetchFeaturedApps()
        ])
        this.women = women
        this.men = men
        this.featured = featured
        this.state = (women.length + men.length) === 0 ? 'empty' : 'success'
      } catch (e) {
        this.state = 'error'
      }
    }
  }
})
