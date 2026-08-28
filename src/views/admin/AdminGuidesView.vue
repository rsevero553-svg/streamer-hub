<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '@/services/supabase'
import type { Guide } from '@/types/guide'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'

const guides = ref<Guide[]>([])
const modalOpen = ref(false)
const editing = ref<Partial<Guide>>({})

async function load() {
  const { data } = await supabase.from('app_guides').select('*').order('sort_order')
  guides.value = (data ?? []) as Guide[]
}
onMounted(load)

function openNew() { editing.value = { title: '', is_general: true, is_active: true, sort_order: 0 }; modalOpen.value = true }
function openEdit(g: Guide) { editing.value = { ...g }; modalOpen.value = true }
async function save() {
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
    <div class="header"><h1 class="title">Guías</h1><BaseButton @click="openNew">+ Nueva guía</BaseButton></div>
    <BaseCard>
      <table class="table">
        <thead><tr><th>Título</th><th>Estado</th><th></th></tr></thead>
        <tbody>
          <tr v-for="g in guides" :key="g.id">
            <td>{{ g.title }}</td>
            <td><BaseBadge :tone="g.is_active ? 'success' : 'neutral'">{{ g.is_active ? 'Publicada' : 'Oculta' }}</BaseBadge></td>
            <td class="actions">
              <BaseButton size="sm" variant="secondary" @click="openEdit(g)">Editar</BaseButton>
              <BaseButton size="sm" variant="secondary" @click="toggle(g)">{{ g.is_active ? 'Despublicar' : 'Publicar' }}</BaseButton>
              <BaseButton size="sm" variant="outline" @click="remove(g)">Eliminar</BaseButton>
            </td>
          </tr>
        </tbody>
      </table>
    </BaseCard>

    <BaseModal :open="modalOpen" :title="editing.id ? 'Editar guía' : 'Nueva guía'" @close="modalOpen = false">
      <div class="form">
        <BaseInput v-model="editing.title" label="Título" required />
        <BaseInput v-model="editing.summary" label="Resumen corto" />
        <BaseTextarea v-model="editing.content" label="Contenido" :rows="6" />
        <BaseInput v-model="editing.cover_url" label="URL de portada" />
        <BaseInput v-model="editing.telegram_url" label="URL de Telegram (opcional)" />
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
</style>
