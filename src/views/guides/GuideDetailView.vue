<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchGuideById } from '@/services/guides.service'
import type { Guide } from '@/types/guide'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'

const route = useRoute()
const guide = ref<Guide | null>(null)
const loading = ref(true)

onMounted(async () => {
  guide.value = await fetchGuideById(route.params.id as string)
  loading.value = false
})
</script>

<template>
  <BaseSpinner v-if="loading" />
  <EmptyState v-else-if="!guide" message="No encontramos esta guía." />
  <section v-else class="page">
    <div class="container detail-narrow">
      <img v-if="guide.cover_url" :src="guide.cover_url" class="cover" :alt="guide.title" />
      <h1>{{ guide.title }}</h1>
      <p class="summary">{{ guide.summary }}</p>
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
.summary { color: var(--color-text-muted); margin-bottom: var(--space-6); font-size: var(--fs-md); }
.content p { line-height: 1.8; color: var(--color-text); }
</style>
