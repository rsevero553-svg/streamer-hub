<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '@/services/supabase'
import { sendGlobalNotification, sendAdminToModeratorNotification, fetchMyNotifications, type AppNotification } from '@/services/notifications.service'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'

const moderators = ref<{ id: string; agency_name: string }[]>([])
const history = ref<AppNotification[]>([])

const globalTitle = ref('')
const globalBody = ref('')
const globalSaved = ref(false)

const targetModerator = ref('')
const directTitle = ref('')
const directBody = ref('')
const directType = ref('membership_warning')
const directSaved = ref(false)

async function load() {
  const { data } = await supabase.from('profiles').select('id, agency_name').eq('role', 'moderator')
  moderators.value = (data ?? []).map(m => ({ id: m.id, agency_name: m.agency_name || 'Sin nombre' }))
  history.value = await fetchMyNotifications()
}
onMounted(load)

async function sendGlobal() {
  await sendGlobalNotification(globalTitle.value, globalBody.value, 'policy_update')
  globalTitle.value = ''
  globalBody.value = ''
  globalSaved.value = true
  setTimeout(() => (globalSaved.value = false), 2000)
  await load()
}

async function sendDirect() {
  if (!targetModerator.value) return
  await sendAdminToModeratorNotification(targetModerator.value, directTitle.value, directBody.value, directType.value)
  directTitle.value = ''
  directBody.value = ''
  directSaved.value = true
  setTimeout(() => (directSaved.value = false), 2000)
  await load()
}
</script>

<template>
  <div>
    <h1 class="title">Notificaciones</h1>

    <BaseCard class="section">
      <h2>Enviar a TODOS los usuarios</h2>
      <p class="hint">Úsalo para políticas nuevas, avisos técnicos o anuncios generales.</p>
      <BaseAlert v-if="globalSaved" tone="success">Enviado a todos.</BaseAlert>
      <div class="form">
        <BaseInput v-model="globalTitle" label="Título" required />
        <BaseTextarea v-model="globalBody" label="Mensaje" :rows="3" required />
        <BaseButton @click="sendGlobal">Enviar a todos</BaseButton>
      </div>
    </BaseCard>

    <BaseCard class="section">
      <h2>Enviar a un moderador específico</h2>
      <p class="hint">Solo ese moderador la ve (ej. aviso de membresía vencida). No llega a sus referidos.</p>
      <BaseAlert v-if="directSaved" tone="success">Enviado.</BaseAlert>
      <div class="form">
        <BaseSelect v-model="targetModerator" label="Moderador" :options="moderators.map(m => ({ value: m.id, label: m.agency_name }))" />
        <BaseSelect v-model="directType" label="Tipo" :options="[{value:'membership_warning',label:'Aviso de membresía'},{value:'platform_error',label:'Aviso técnico'},{value:'general',label:'General'}]" />
        <BaseInput v-model="directTitle" label="Título" required />
        <BaseTextarea v-model="directBody" label="Mensaje" :rows="3" required />
        <BaseButton @click="sendDirect">Enviar al moderador</BaseButton>
      </div>
    </BaseCard>

    <BaseCard class="section">
      <h2>Historial reciente</h2>
      <div v-for="n in history" :key="n.id" class="item">
        <strong>{{ n.title }}</strong>
        <p>{{ n.body }}</p>
        <span class="muted">{{ n.scope }} · {{ new Date(n.created_at).toLocaleString('es') }}</span>
      </div>
      <p v-if="!history.length" class="muted">Sin notificaciones enviadas todavía.</p>
    </BaseCard>
  </div>
</template>

<style scoped>
.title { font-family: var(--font-display); font-size: var(--fs-2xl); margin-bottom: var(--space-6); }
.section { margin-bottom: var(--space-5); }
.section h2 { font-size: var(--fs-md); margin-bottom: var(--space-2); }
.hint { color: var(--color-text-faint); font-size: var(--fs-xs); margin-bottom: var(--space-4); }
.form { display: flex; flex-direction: column; gap: var(--space-4); }
.item { padding: var(--space-3) 0; border-bottom: 1px solid var(--color-border); }
.item p { color: var(--color-text-muted); font-size: var(--fs-sm); margin: var(--space-1) 0; }
.muted { color: var(--color-text-faint); font-size: var(--fs-xs); }
</style>
