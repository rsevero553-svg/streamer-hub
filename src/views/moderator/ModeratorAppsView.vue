<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'
import type { AppEntity } from '@/types/application'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'

const apps = ref<AppEntity[]>([])
const auth = useAuthStore()
const modalOpen = ref(false)
const editing = ref<Partial<AppEntity>>({})

async function load() {
  const { data } = await supabase.from('apps').select('*').order('sort_order')
  apps.value = (data ?? []) as AppEntity[]
}
onMounted(load)

function openNew() {
  editing.value = { name: '', slug: '', gender: 'women', status: 'active', agency_required: false, sort_order: 0, countriesText: '', owner_id: auth.profile?.role === 'moderator' ? auth.userId : null, requires_verification: false } as any
  modalOpen.value = true
}
function openEdit(app: AppEntity) {
  editing.value = { ...app, countriesText: (app.available_countries ?? []).join(', ') } as any
  modalOpen.value = true
}
async function save() {
  const payload: any = { ...editing.value }
  payload.available_countries = payload.countriesText
    ? payload.countriesText.split(',').map((c: string) => c.trim()).filter(Boolean)
    : null
  delete payload.countriesText
  payload.last_verified_at = new Date().toISOString()

  if (payload.id) {
    await supabase.from('apps').update(payload).eq('id', payload.id)
  } else {
    await supabase.from('apps').insert(payload)
  }
  modalOpen.value = false
  await load()
}
async function toggleActive(app: AppEntity) {
  const status = app.status === 'active' ? 'inactive' : 'active'
  await supabase.from('apps').update({ status }).eq('id', app.id)
  await load()
}
async function remove(app: AppEntity) {
  if (!confirm(`¿Eliminar "${app.name}"?`)) return
  await supabase.from('apps').delete().eq('id', app.id)
  await load()
}
</script>

<template>
  <div>
    <div class="header">
      <h1 class="title">Aplicaciones</h1>
      <BaseButton @click="openNew">+ Nueva aplicación</BaseButton>
    </div>

    <BaseCard>
      <table class="table">
        <thead><tr><th>Nombre</th><th>Público</th><th>Estado</th><th>Agencia</th><th>Destacada</th><th></th></tr></thead>
        <tbody>
          <tr v-for="a in apps" :key="a.id">
            <td>{{ a.name }}</td>
            <td>{{ a.gender === 'women' ? 'Mujeres' : 'Hombres' }}</td>
            <td><BaseBadge :tone="a.status === 'active' ? 'success' : 'neutral'">{{ a.status }}</BaseBadge></td>
            <td>{{ a.agency_required ? 'Sí' : 'No' }}</td>
            <td>{{ a.featured ? '⭐' : '—' }}</td>
            <td class="actions">
              <BaseButton size="sm" variant="secondary" tag="a" :href="`/moderador/apps/${a.id}`">Gestionar</BaseButton>
              <BaseButton size="sm" variant="secondary" @click="openEdit(a)">Editar</BaseButton>
              <BaseButton size="sm" variant="secondary" @click="toggleActive(a)">{{ a.status === 'active' ? 'Desactivar' : 'Activar' }}</BaseButton>
              <BaseButton size="sm" variant="outline" @click="remove(a)">Eliminar</BaseButton>
            </td>
          </tr>
        </tbody>
      </table>
    </BaseCard>

    <BaseModal :open="modalOpen" :title="editing.id ? 'Editar aplicación' : 'Nueva aplicación'" @close="modalOpen = false">
      <div class="form">
        <BaseInput v-model="editing.name" label="Nombre" required />
        <BaseInput v-model="editing.slug" label="Slug (url)" required />
        <BaseSelect v-model="editing.gender" label="Público objetivo" :options="[{ value: 'women', label: 'Mujeres' }, { value: 'men', label: 'Hombres' }]" />
        <BaseInput v-model="editing.logo_url" label="URL del logo" />
        <BaseInput v-model="editing.banner_url" label="URL del banner" />
        <label class="checkbox"><input type="checkbox" v-model="editing.agency_required" /> Requiere agencia</label>
        <label class="checkbox"><input type="checkbox" v-model="editing.featured" /> Destacada en Home</label>
        <BaseInput v-model="editing.target_audience" label="Público objetivo (ej. mayores de 18, streamers principiantes...)" />
        <BaseInput v-model.number="editing.minimum_age" type="number" label="Edad mínima" />
        <BaseInput v-model="editing.countriesText" label="Países disponibles (separados por coma)" />
        <BaseInput v-model="editing.points_system" label="Sistema de puntos/monedas (descripción breve)" />
        <label class="checkbox"><input type="checkbox" v-model="editing.requires_verification" /> Requiere verificación (ID + foto del momento por WhatsApp)</label>
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
.actions { display: flex; gap: var(--space-2); flex-wrap: wrap; }
.form { display: flex; flex-direction: column; gap: var(--space-4); }
.checkbox { display: flex; align-items: center; gap: var(--space-2); font-size: var(--fs-sm); }
</style>
