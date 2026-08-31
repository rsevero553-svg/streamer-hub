<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { fetchMyPayrollDocuments, uploadModeratorPayrollDocument, deletePayrollDocument, type PayrollDocument } from '@/services/payroll.service'
import { sendModeratorBroadcast } from '@/services/notifications.service'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'

const auth = useAuthStore()
const docs = ref<PayrollDocument[]>([])
const selectedFile = ref<File | null>(null)
const uploading = ref(false)
const error = ref('')
const saved = ref(false)

async function load() {
  if (!auth.userId) return
  docs.value = (await fetchMyPayrollDocuments()).filter(d => d.scope === 'moderator' && d.moderator_id === auth.userId)
}
onMounted(load)

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  selectedFile.value = target.files?.[0] ?? null
}

async function upload() {
  if (!selectedFile.value || !auth.userId) return
  error.value = ''
  uploading.value = true
  try {
    await uploadModeratorPayrollDocument(auth.userId, selectedFile.value)
    await sendModeratorBroadcast(auth.userId, '📄 Nueva nómina disponible', `Tu agencia subió un nuevo documento: ${selectedFile.value.name}`, 'payroll')
    selectedFile.value = null
    saved.value = true
    setTimeout(() => (saved.value = false), 2000)
    await load()
  } catch (e: any) {
    error.value = e?.message || 'No se pudo subir el archivo.'
  } finally {
    uploading.value = false
  }
}

async function remove(doc: PayrollDocument) {
  if (!confirm('¿Eliminar este documento?')) return
  await deletePayrollDocument(doc)
  await load()
}

function daysLeft(expiresAt: string) {
  const diff = new Date(expiresAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}
</script>

<template>
  <div>
    <h1 class="title">Nómina de mi agencia</h1>
    <BaseCard class="section">
      <p class="hint">Solo lo ven las personas registradas con tu link. Se les notifica automáticamente y se borra a los 5 días.</p>
      <BaseAlert v-if="error" tone="danger">{{ error }}</BaseAlert>
      <BaseAlert v-if="saved" tone="success">Documento subido y tus referidos fueron notificados.</BaseAlert>
      <div class="upload-row">
        <input type="file" @change="onFileChange" accept=".pdf,.xlsx,.xls,.csv,.doc,.docx,.txt" />
        <BaseButton :disabled="!selectedFile || uploading" @click="upload">{{ uploading ? 'Subiendo...' : 'Subir documento' }}</BaseButton>
      </div>
    </BaseCard>

    <BaseCard class="section">
      <h2>Documentos activos</h2>
      <div v-for="d in docs" :key="d.id" class="doc">
        <div>
          <strong>{{ d.file_name }}</strong>
          <div class="muted"><BaseBadge tone="warning">Se borra en {{ daysLeft(d.expires_at) }} día(s)</BaseBadge></div>
        </div>
        <BaseButton size="sm" variant="outline" @click="remove(d)">Eliminar ahora</BaseButton>
      </div>
      <p v-if="!docs.length" class="muted">Sin documentos activos.</p>
    </BaseCard>
  </div>
</template>

<style scoped>
.title { font-family: var(--font-display); font-size: var(--fs-2xl); margin-bottom: var(--space-6); }
.section { margin-bottom: var(--space-5); }
.section h2 { font-size: var(--fs-md); margin-bottom: var(--space-3); }
.hint { color: var(--color-text-faint); font-size: var(--fs-xs); margin-bottom: var(--space-4); }
.upload-row { display: flex; gap: var(--space-4); align-items: center; flex-wrap: wrap; }
.doc { display: flex; justify-content: space-between; align-items: center; padding: var(--space-3) 0; border-bottom: 1px solid var(--color-border); gap: var(--space-3); }
.muted { color: var(--color-text-faint); font-size: var(--fs-xs); margin-top: var(--space-1); }
</style>
