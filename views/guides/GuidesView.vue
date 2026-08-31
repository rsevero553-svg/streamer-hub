<script setup lang="ts">
import { useMeta } from '@/composables/useMeta'
useMeta('Guías', 'Guías paso a paso para comenzar, registrarte y sacar el máximo provecho de cada aplicación.')
import { onMounted, ref } from 'vue'
import { fetchGuides } from '@/services/guides.service'
import type { Guide } from '@/types/guide'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const guides = ref<Guide[]>([])
const state = ref<'loading' | 'success' | 'empty' | 'error'>('loading')

onMounted(async () => {
  try {
    guides.value = await fetchGuides()
    state.value = guides.value.length ? 'success' : 'empty'
  } catch { state.value = 'error' }
})
</script>

<template>
  <section class="page">
    <div class="container">
      <h1 class="page__title">Guías de capacitación</h1>
      <p class="page__subtitle">Aprende paso a paso cómo comenzar, registrarte y sacar el máximo provecho.</p>

      <BaseSpinner v-if="state === 'loading'" />
      <EmptyState v-else-if="state !== 'success'" message="No hay guías disponibles actualmente." />
      <div v-else class="guides-grid">
        <RouterLink v-for="g in guides" :key="g.id" :to="`/guias/${g.id}`" class="animate-fade-up">
          <BaseCard class="guide-card tilt-card">
            <img v-if="g.cover_url" :src="g.cover_url" :alt="g.title" class="guide-card__img" />
            <h3>{{ g.title }}</h3>
            <p>{{ g.summary }}</p>
          </BaseCard>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page { padding: var(--space-8) 0 var(--space-9); }
.page__title { font-family: var(--font-display); font-size: var(--fs-2xl); margin-bottom: var(--space-2); }
.page__subtitle { color: var(--color-text-muted); margin-bottom: var(--space-6); }
.guides-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--space-5); }
.guide-card__img { border-radius: var(--radius-md); margin-bottom: var(--space-4); aspect-ratio: 16/9; object-fit: cover; }
.guide-card h3 { margin-bottom: var(--space-2); }
.guide-card p { color: var(--color-text-muted); font-size: var(--fs-sm); }
</style>
