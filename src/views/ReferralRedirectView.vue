<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { fetchModeratorSlugById } from '@/services/agency.service'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

onMounted(async () => {
  const slug = route.params.slug as string

  if (!auth.initialized) await auth.init()

  if (auth.isAuthenticated) {
    // Regla: si ya pertenece a un moderador, siempre va a SU zona (nadie puede robarse referidos ajenos)
    if (auth.profile?.referred_by) {
      const ownSlug = await fetchModeratorSlugById(auth.profile.referred_by)
      router.replace(ownSlug ? `/agencia/${ownSlug}` : '/')
    } else {
      router.replace('/')
    }
  } else {
    router.replace({ path: '/registro', query: { ref: slug } })
  }
})
</script>

<template>
  <div class="redirect-page">
    <BaseSpinner />
  </div>
</template>

<style scoped>
.redirect-page { min-height: 60vh; display: flex; align-items: center; justify-content: center; }
</style>
