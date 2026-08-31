<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'
import type { Guide } from '@/types/guide'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'

const auth = useAuthStore()
const guides = ref<Guide[]>([])
const myApps = ref<{ id: string; name: string }[]>([])
const modalOpen = ref(false)
const editing = ref<Record<string, any>>({})

async function load() {
  if (!auth.userId) return
  const { data: apps } = await supabase.from('apps').select('id, name').eq('owner_id', auth.userId)
  myApps.value = apps ?? []
  const appIds = myApps.value.map(a => a.id)

  if (!appIds.length) { guides.value = []; return }
  const { data } = await supabase.from('app_guides').select('*').in('app_id', appIds).order('sort_order')
  guides.value = (data ?? []) as Guide[]
}
onMounted(load)

function appName(appId: string) {
  return myApps.value.find(a => a.id === appId)?.name || '—'
}

function openNew() {
  editing.value = { title: '', app_id: myApps.value[0]?.id || '', is_general: false, is_active: true, sort_order: 0, is_install_guide: false, app_mode: '', daily_time_estimate: '' }
  modalOpen.value = true
}
function openEdit(g: Guide) { editing.value = { ...g }; modalOpen.value = true }
async function save() {
  if (!editing.value.app_id) return
  if (editing.value.id) await supabase.from('app_guides').update(editing.value).eq('id', editing.value.id)
  else await supabase.from('app_guides').insert(editing.value)
  modalOpen.value = false
  await load()
}
async function toggle(g: Guide) {
  await supabase.from('app_guides').update({ is_active: !g.is_active }).eq('id', g.id)
  await load()
}
async function remove(g: Guide) {
  if (!confirm('¿Eliminar esta guía?')) return
  await supabase.from('app_guides').delete().eq('id', g.id)
  await load()
}
</script>

<template>
  <div>
    <div class="header"><h1 class="title">Mis guías</h1><BaseButton :disabled="!myApps.length" @click="openNew">+ Nueva guía</BaseButton></div>

    <BaseAlert v-if="!myApps.length" tone="warning">
      Necesitas tener al menos una aplicación registrada antes de crear guías.
    </BaseAlert>

    <BaseCard v-else>
      <table class="table">
        <thead><tr><th>Título</th><th>App</th><th>Estado</th><th></th></tr></thead>
        <tbody>
          <tr v-for="g in guides" :key="g.id">
            <td>{{ g.title }}</td>
            <td class="muted">{{ appName(g.app_id || '') }}</td>
            <td><BaseBadge :tone="g.is_active ? 'success' : 'neutral'">{{ g.is_active ? 'Publicada' : 'Oculta' }}</BaseBadge></td>
            <td class="actions">
              <BaseButton size="sm" variant="secondary" @click="openEdit(g)">Editar</BaseButton>
              <BaseButton size="sm" variant="secondary" @click="toggle(g)">{{ g.is_active ? 'Despublicar' : 'Publicar' }}</BaseButton>
              <BaseButton size="sm" variant="outline" @click="remove(g)">Eliminar</BaseButton>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!guides.length" class="muted" style="padding: 1rem;">Aún no tienes guías creadas.</p>
    </BaseCard>

    <BaseModal :open="modalOpen" :title="editing.id ? 'Editar guía' : 'Nueva guía'" @close="modalOpen = false">
      <div class="form">
        <BaseSelect v-model="editing.app_id" label="Aplicación" :options="myApps.map(a => ({ value: a.id, label: a.name }))" />
        <BaseInput v-model="editing.title" label="Título" required />
        <BaseInput v-model="editing.summary" label="Resumen corto" />
        <BaseTextarea v-model="editing.content" label="Contenido" :rows="6" />
        <BaseInput v-model="editing.cover_url" label="URL de portada" />
        <BaseInput v-model="editing.telegram_url" label="URL de Telegram (opcional)" />
        <label class="checkbox"><input type="checkbox" v-model="editing.is_install_guide" /> Es guía de instalación</label>
        <BaseSelect v-if="editing.is_install_guide" v-model="editing.app_mode" label="Modo de la app" :options="[{value:'messaging',label:'Mensajería'},{value:'video_calls',label:'Videollamadas'},{value:'live',label:'Live'},{value:'match',label:'Match'}]" />
        <BaseInput v-if="editing.is_install_guide" v-model="editing.daily_time_estimate" label="Tiempo diario estimado (ej. 2-3 horas)" />
        <BaseButton @click="save">Guardar</BaseButton>
      </div>
    </BaseModal>
  </div>
</template>

<style scoped>
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6); }
.title { font-family: var(--font-display); font-size: var(--fs-2xl); }
.table { width: 100%; border-collapse: collapse; }
.table th, .table td { text-align: left; padding: var(--space-3); border-bottom: 1px solid var(--color-border); font-size: var(--fs-sm); }
.muted { color: var(--color-text-faint); font-size: var(--fs-xs); }
.actions { display: flex; gap: var(--space-2); flex-wrap: wrap; }
.form { display: flex; flex-direction: column; gap: var(--space-4); }
.checkbox { display: flex; align-items: center; gap: var(--space-2); font-size: var(--fs-sm); }
</style>
