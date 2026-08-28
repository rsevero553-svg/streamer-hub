<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '@/services/supabase'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'

const socials = ref<any[]>([])
const modalOpen = ref(false)
const editing = ref<any>({})

async function load() {
  const { data } = await supabase.from('social_links').select('*').order('sort_order')
  socials.value = data ?? []
}
onMounted(load)

function openNew() { editing.value = { platform: '', url: '', icon: '', position: 'right', is_active: true, sort_order: 0 }; modalOpen.value = true }
function openEdit(s: any) { editing.value = { ...s }; modalOpen.value = true }
async function save() {
  if (editing.value.id) await supabase.from('social_links').update(editing.value).eq('id', editing.value.id)
  else await supabase.from('social_links').insert(editing.value)
  modalOpen.value = false
  await load()
}
async function toggle(s: any) {
  await supabase.from('social_links').update({ is_active: !s.is_active }).eq('id', s.id)
  await load()
}
async function remove(s: any) {
  if (!confirm('¿Eliminar esta red social?')) return
  await supabase.from('social_links').delete().eq('id', s.id)
  await load()
}
</script>

<template>
  <div>
    <div class="header"><h1 class="title">Redes sociales</h1><BaseButton @click="openNew">+ Agregar</BaseButton></div>
    <BaseCard>
      <table class="table">
        <tbody>
          <tr v-for="s in socials" :key="s.id">
            <td>{{ s.platform }}</td><td>{{ s.url }}</td><td>{{ s.position }}</td>
            <td><BaseBadge :tone="s.is_active ? 'success' : 'neutral'">{{ s.is_active ? 'Activa' : 'Oculta' }}</BaseBadge></td>
            <td class="actions">
              <BaseButton size="sm" variant="secondary" @click="openEdit(s)">Editar</BaseButton>
              <BaseButton size="sm" variant="secondary" @click="toggle(s)">{{ s.is_active ? 'Ocultar' : 'Mostrar' }}</BaseButton>
              <BaseButton size="sm" variant="outline" @click="remove(s)">Eliminar</BaseButton>
            </td>
          </tr>
        </tbody>
      </table>
    </BaseCard>

    <BaseModal :open="modalOpen" :title="editing.id ? 'Editar red social' : 'Nueva red social'" @close="modalOpen = false">
      <div class="form">
        <BaseInput v-model="editing.platform" label="Plataforma (ej. Instagram)" required />
        <BaseInput v-model="editing.url" label="URL" required />
        <BaseInput v-model="editing.icon" label="Ícono/emoji (opcional)" />
        <BaseSelect v-model="editing.position" label="Posición" :options="[{value:'left',label:'Izquierda (junto al chat)'},{value:'right',label:'Derecha (botones flotantes)'}]" />
        <BaseButton @click="save">Guardar</BaseButton>
      </div>
    </BaseModal>
  </div>
</template>

<style scoped>
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6); }
.title { font-family: var(--font-display); font-size: var(--fs-2xl); }
.table { width: 100%; border-collapse: collapse; }
.table td { padding: var(--space-3); border-bottom: 1px solid var(--color-border); font-size: var(--fs-sm); }
.actions { display: flex; gap: var(--space-2); flex-wrap: wrap; }
.form { display: flex; flex-direction: column; gap: var(--space-4); }
</style>
