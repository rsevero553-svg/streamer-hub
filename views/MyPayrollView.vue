<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchMyPayrollDocuments, getPayrollDownloadUrl, type PayrollDocument } from '@/services/payroll.service'
import { useMeta } from '@/composables/useMeta'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'

useMeta('Mi nómina', 'Consulta y descarga tus documentos de cobro.')

const docs = ref<PayrollDocument[]>([])
const loading = ref(true)

onMounted(async () => {
  try { docs.value = await fetchMyPayrollDocuments() } catch { docs.value = [] }
  loading.value = false
})

function daysLeft(expiresAt: string) {
  const diff = new Date(expiresAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

async function download(doc: PayrollDocument) {
  const url = await getPayrollDownloadUrl(doc.file_path)
  if (url) window.open(url, '_blank')
}
</script>

<template>
  <section class="page">
    <div class="container narrow">
      <h1 class="page__title">Mi nómina</h1>
      <p class="page__subtitle">Documentos de cobro disponibles. Se eliminan automáticamente 5 días después de subirse.</p>

      <BaseSpinner v-if="loading" />
      <EmptyState v-else-if="!docs.length" message="No hay documentos disponibles por ahora." />
      <div v-else class="list">
        <BaseCard v-for="d in docs" :key="d.id" class="doc">
          <div class="doc__info">
            <strong>{{ d.file_name }}</strong>
            <span class="doc__meta">
              <BaseBadge :tone="d.scope === 'global' ? 'accent' : 'neutral'">{{ d.scope === 'global' ? 'General' : 'De tu agencia' }}</BaseBadge>
              · Se borra en {{ daysLeft(d.expires_at) }} día(s)
            </span>
          </div>
          <BaseButton size="sm" @click="download(d)">Descargar</BaseButton>
        </BaseCard>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page { padding: var(--space-8) 0 var(--space-9); }
.narrow { max-width: 640px; }
.page__title { font-family: var(--font-display); font-size: var(--fs-2xl); margin-bottom: var(--space-2); }
.page__subtitle { color: var(--color-text-muted); margin-bottom: var(--space-6); font-size: var(--fs-sm); }
.list { display: flex; flex-direction: column; gap: var(--space-4); }
.doc { display: flex; justify-content: space-between; align-items: center; gap: var(--space-4); flex-wrap: wrap; }
.doc__info { display: flex; flex-direction: column; gap: var(--space-2); }
.doc__meta { font-size: var(--fs-xs); color: var(--color-text-faint); display: flex; align-items: center; gap: var(--space-2); }
</style>
