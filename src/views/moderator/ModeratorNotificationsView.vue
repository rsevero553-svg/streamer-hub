<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { sendModeratorBroadcast, fetchMyNotifications, type AppNotification } from '@/services/notifications.service'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'

const auth = useAuthStore()
const title = ref('')
const body = ref('')
const type = ref('general')
const saved = ref(false)
const history = ref<AppNotification[]>([])

async function load() {
  history.value = (await fetchMyNotifications()).filter(n => n.scope === 'moderator_broadcast')
}
onMounted(load)

async function send() {
  if (!auth.userId) return
  await sendModeratorBroadcast(auth.userId, title.value, body.value, type.value)
  title.value = ''
  body.value = ''
  saved.value = true
  setTimeout(() => (saved.value = false), 2000)
  await load()
}
</script>

<template>
  <div>
    <h1 class="title">Notificar a mis referidos</h1>
    <BaseCard class="section">
      <p class="hint">Solo las personas registradas con tu link recibirán esto (nómina subida, apps o guías nuevas, avisos de tu agencia).</p>
      <BaseAlert v-if="saved" tone="success">Enviado a tus referidos.</BaseAlert>
      <div class="form">
        <BaseSelect v-model="type" label="Tipo" :options="[{value:'general',label:'General'},{value:'new_app',label:'Nueva app'},{value:'new_guide',label:'Nueva guía'},{value:'payroll',label:'Nómina/cobro'}]" />
        <BaseInput v-model="title" label="Título" required />
        <BaseTextarea v-model="body" label="Mensaje" :rows="4" required />
        <BaseButton @click="send">Enviar a mis referidos</BaseButton>
      </div>
    </BaseCard>

    <BaseCard class="section">
      <h2>Historial enviado</h2>
      <div v-for="n in history" :key="n.id" class="item">
        <strong>{{ n.title }}</strong>
        <p>{{ n.body }}</p>
        <span class="muted">{{ new Date(n.created_at).toLocaleString('es') }}</span>
      </div>
      <p v-if="!history.length" class="muted">Aún no has enviado notificaciones.</p>
    </BaseCard>
  </div>
</template>

<style scoped>
.title { font-family: var(--font-display); font-size: var(--fs-2xl); margin-bottom: var(--space-6); }
.section { margin-bottom: var(--space-5); }
.section h2 { font-size: var(--fs-md); margin-bottom: var(--space-3); }
.hint { color: var(--color-text-faint); font-size: var(--fs-xs); margin-bottom: var(--space-4); }
.form { display: flex; flex-direction: column; gap: var(--space-4); }
.item { padding: var(--space-3) 0; border-bottom: 1px solid var(--color-border); }
.item p { color: var(--color-text-muted); font-size: var(--fs-sm); margin: var(--space-1) 0; }
.muted { color: var(--color-text-faint); font-size: var(--fs-xs); }
</style>
