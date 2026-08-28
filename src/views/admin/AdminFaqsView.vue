<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '@/services/supabase'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'

const faqs = ref<any[]>([])
const modalOpen = ref(false)
const editing = ref<any>({})

async function load() {
  const { data } = await supabase.from('faqs').select('*').order('sort_order')
  faqs.value = data ?? []
}
onMounted(load)

function openNew() { editing.value = { question: '', answer: '', is_active: true, sort_order: 0 }; modalOpen.value = true }
function openEdit(f: any) { editing.value = { ...f }; modalOpen.value = true }
async function save() {
  if (editing.value.id) await supabase.from('faqs').update(editing.value).eq('id', editing.value.id)
  else await supabase.from('faqs').insert(editing.value)
  modalOpen.value = false
  await load()
}
async function toggle(f: any) {
  await supabase.from('faqs').update({ is_active: !f.is_active }).eq('id', f.id)
  await load()
}
async function remove(f: any) {
  if (!confirm('¿Eliminar esta pregunta frecuente?')) return
  await supabase.from('faqs').delete().eq('id', f.id)
  await load()
}
</script>

<template>
  <div>
    <div class="header"><h1 class="title">Preguntas frecuentes</h1><BaseButton @click="openNew">+ Nueva pregunta</BaseButton></div>
    <BaseCard>
      <table class="table">
        <tbody>
          <tr v-for="f in faqs" :key="f.id">
            <td>{{ f.question }}</td>
            <td><BaseBadge :tone="f.is_active ? 'success' : 'neutral'">{{ f.is_active ? 'Visible' : 'Oculta' }}</BaseBadge></td>
            <td class="actions">
              <BaseButton size="sm" variant="secondary" @click="openEdit(f)">Editar</BaseButton>
              <BaseButton size="sm" variant="secondary" @click="toggle(f)">{{ f.is_active ? 'Ocultar' : 'Mostrar' }}</BaseButton>
              <BaseButton size="sm" variant="outline" @click="remove(f)">Eliminar</BaseButton>
            </td>
          </tr>
        </tbody>
      </table>
    </BaseCard>

    <BaseModal :open="modalOpen" :title="editing.id ? 'Editar pregunta' : 'Nueva pregunta'" @close="modalOpen = false">
      <div class="form">
        <BaseInput v-model="editing.question" label="Pregunta" required />
        <BaseTextarea v-model="editing.answer" label="Respuesta" :rows="4" required />
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
