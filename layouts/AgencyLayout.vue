<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchAgencyBySlug } from '@/services/agency.service'
import type { Profile } from '@/types/user'
import EmptyState from '@/components/ui/EmptyState.vue'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'

const route = useRoute()
const agency = ref<Profile | null>(null)
const loading = ref(true)

async function load() {
  loading.value = true
  agency.value = await fetchAgencyBySlug(route.params.slug as string)
  loading.value = false
}
onMounted(load)
watch(() => route.params.slug, load)
</script>

<template>
  <div class="agency-layout">
    <BaseSpinner v-if="loading" />
    <EmptyState v-else-if="!agency" message="Esta agencia no existe o ya no está disponible." />
    <template v-else>
      <header class="agency-header">
        <div class="container agency-header__inner">
          <RouterLink :to="`/agencia/${agency.agency_slug}`" class="agency-header__brand">
            <img v-if="agency.agency_logo_url" :src="agency.agency_logo_url" :alt="agency.agency_name || ''" />
            <span v-else class="agency-header__fallback">{{ (agency.agency_name || 'A').slice(0,2).toUpperCase() }}</span>
            <span>{{ agency.agency_name }}</span>
          </RouterLink>
          <nav class="agency-header__nav">
            <RouterLink :to="`/agencia/${agency.agency_slug}`">Inicio</RouterLink>
            <RouterLink :to="`/agencia/${agency.agency_slug}/ser-agente`">Ser agente</RouterLink>
          </nav>
        </div>
      </header>
      <main>
        <RouterView :agency="agency" />
      </main>
      <footer class="agency-footer">
        <div class="container">
          <p>{{ agency.agency_name }} — funciona dentro de Streamer Hub. <RouterLink to="/">Ver plataforma principal</RouterLink></p>
        </div>
      </footer>
    </template>
  </div>
</template>

<style scoped>
.agency-layout { min-height: 100vh; display: flex; flex-direction: column; }
.agency-header { background: var(--color-blue-900); border-bottom: 1px solid var(--color-border); padding: var(--space-4) 0; }
.agency-header__inner { display: flex; justify-content: space-between; align-items: center; }
.agency-header__brand { display: flex; align-items: center; gap: var(--space-3); font-weight: 800; }
.agency-header__brand img { width: 36px; height: 36px; border-radius: var(--radius-md); object-fit: cover; }
.agency-header__fallback { width: 36px; height: 36px; border-radius: var(--radius-md); background: var(--gradient-brand); display: flex; align-items: center; justify-content: center; font-size: var(--fs-sm); }
.agency-header__nav { display: flex; gap: var(--space-5); font-size: var(--fs-sm); font-weight: 600; color: var(--color-text-muted); }
main { flex: 1; }
.agency-footer { padding: var(--space-6) 0; border-top: 1px solid var(--color-border); text-align: center; }
.agency-footer p { font-size: var(--fs-xs); color: var(--color-text-faint); }
.agency-footer a { color: var(--color-pink-400); }
</style>
