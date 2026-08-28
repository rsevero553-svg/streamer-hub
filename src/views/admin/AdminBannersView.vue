<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '@/services/supabase'
import type { Banner } from '@/types/banner'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'

const banners = ref<Banner[]>([])
const modalOpen = ref(false)
const editing = ref<Partial<Banner>>({})

async function load() {
  const { data } = await supabase.from('banners').select('*').order('sort_order')
  banners.value = (data ?? []) as Banner[]
}
onMounted(load)

function openNew() { editing.value = { title: '', image_url: '', status: 'active', sort_order: 0 }; modalOpen.value = true }
function openEdit(b: Banner) { editing.value = { ...b }; modalOpen.value = true }
async function save() {
  if (editing.value.id) await supabase.from('banners').update(editing.value).eq('id', editing.value.id)
  else await supabase.from('banners').insert(editing.value)
  modalOpen.value = false
  await load()
}
async function toggle(b: Banner) {
  await supabase.from('banners').update({ status: b.status === 'active' ? 'inactive' : 'active' }).eq('id', b.id)
  await load()
}
async function remove(b: Banner) {
  if (!confirm('¿Eliminar este banner?')) return
  await supabase.from('banners').delete().eq('id', b.id)
  await load()
}
</script>

<template>
  <div>
    <div class="header"><h1 class="title">Banners</h1><BaseButton @click="openNew">+ Nuevo banner</BaseButton></div>
    <div class="grid">
      <BaseCard v-for="b in banners" :key="b.id" class="banner-item">
        <img :src="b.image_url" :alt="b.title || ''" />
        <div class="banner-item__body">
          <h4>{{ b.title || 'Sin título' }}</h4>
          <BaseBadge :tone="b.status === 'active' ? 'success' : 'neutral'">{{ b.status }}</BaseBadge>
          <div class="actions">
            <BaseButton size="sm" variant="secondary" @click="openEdit(b)">Editar</BaseButton>
            <BaseButton size="sm" variant="secondary" @click="toggle(b)">{{ b.status === 'active' ? 'Desactivar' : 'Activar' }}</BaseButton>
            <BaseButton size="sm" variant="outline" @click="remove(b)">Eliminar</BaseButton>
          </div>
        </div>
      </BaseCard>
    </div>

    <BaseModal :open="modalOpen" :title="editing.id ? 'Editar banner' : 'Nuevo banner'" @close="modalOpen = false">
      <div class="form">
        <BaseInput v-model="editing.title" label="Título" />
        <BaseInput v-model="editing.subtitle" label="Subtítulo" />
        <BaseInput v-model="editing.image_url" label="URL de imagen" required />
        <BaseInput v-model="editing.link_url" label="URL de destino" />
        <BaseInput v-model="editing.button_text" label="Texto del botón" />
        <BaseButton @click="save">Guardar</BaseButton>
      </div>
    </BaseModal>
  </div>
</template>

<style scoped>
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6); }
.title { font-family: var(--font-display); font-size: var(--fs-2xl); }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--space-5); }
.banner-item img { width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: var(--radius-md); margin-bottom: var(--space-3); }
.banner-item__body h4 { margin-bottom: var(--space-2); }
.actions { display: flex; gap: var(--space-2); flex-wrap: wrap; margin-top: var(--space-3); }
.form { display: flex; flex-direction: column; gap: var(--space-4); }
</style>
