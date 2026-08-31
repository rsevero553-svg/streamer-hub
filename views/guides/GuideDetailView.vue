<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchGuideById } from '@/services/guides.service'
import type { Guide } from '@/types/guide'
import { useMeta } from '@/composables/useMeta'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'

const route = useRoute()
const guide = ref<Guide | null>(null)
const loading = ref(true)

const pageTitle = ref('Cargando...')
useMeta(pageTitle)

const MODE_LABELS: Record<string, string> = {
  messaging: 'Mensajería', video_calls: 'Videollamadas', live: 'Live', match: 'Match'
}

onMounted(async () => {
  guide.value = await fetchGuideById(route.params.id as string)
  loading.value = false
  pageTitle.value = guide.value?.title || 'Guía no encontrada'
})
</script>

<template>
  <BaseSpinner v-if="loading" />
  <EmptyState v-else-if="!guide" message="No encontramos esta guía." />
  <section v-else class="page">
    <div class="container detail-narrow">
      <img v-if="guide.cover_url" :src="guide.cover_url" class="cover" :alt="guide.title" />

      <BaseBadge v-if="guide.is_install_guide" tone="accent" style="margin-bottom: 0.75rem;">Guía de instalación</BaseBadge>

      <h1>{{ guide.title }}</h1>
      <p class="summary">{{ guide.summary }}</p>

      <div class="meta-row" v-if="guide.is_install_guide && (guide.app_mode || guide.daily_time_estimate)">
        <BaseBadge v-if="guide.app_mode" tone="neutral">{{ MODE_LABELS[guide.app_mode] || guide.app_mode }}</BaseBadge>
        <BaseBadge v-if="guide.daily_time_estimate" tone="neutral">⏱ {{ guide.daily_time_estimate }}/día</BaseBadge>
      </div>

      <BaseCard class="content">
        <p style="white-space: pre-line;">{{ guide.content }}</p>
      </BaseCard>
      <BaseButton v-if="guide.telegram_url" tag="a" :href="guide.telegram_url" target="_blank" style="margin-top: 1.5rem;">
        Entrar al canal de Telegram
      </BaseButton>
    </div>
  </section>
</template>

<style scoped>
.page { padding: var(--space-8) 0 var(--space-9); }
.detail-narrow { max-width: 720px; }
.cover { width: 100%; border-radius: var(--radius-lg); margin-bottom: var(--space-6); aspect-ratio: 16/9; object-fit: cover; }
h1 { font-family: var(--font-display); font-size: var(--fs-2xl); margin-bottom: var(--space-3); }
.summary { color: var(--color-text-muted); margin-bottom: var(--space-4); font-size: var(--fs-md); }
.meta-row { display: flex; gap: var(--space-2); margin-bottom: var(--space-6); flex-wrap: wrap; }
.content p { line-height: 1.8; color: var(--color-text); }
</style>
