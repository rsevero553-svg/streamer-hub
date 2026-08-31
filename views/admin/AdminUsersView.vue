<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '@/services/supabase'
import type { Profile } from '@/types/user'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

const users = ref<Profile[]>([])
const search = ref('')
const loading = ref(true)

async function load() {
  loading.value = true
  const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
  users.value = (data ?? []) as Profile[]
  loading.value = false
}
onMounted(load)

async function toggleActive(u: Profile) {
  await supabase.from('profiles').update({ is_active: !u.is_active }).eq('id', u.id)
  await load()
}
async function toggleRole(u: Profile) {
  const newRole = u.role === 'admin' ? 'user' : 'admin'
  if (!confirm(`¿Cambiar el rol de ${u.full_name} a "${newRole}"?`)) return
  await supabase.from('profiles').update({ role: newRole }).eq('id', u.id)
  await load()
}

function filtered() {
  const q = search.value.trim().toLowerCase()
  if (!q) return users.value
  return users.value.filter(u =>
    u.full_name?.toLowerCase().includes(q) ||
    u.email?.toLowerCase().includes(q) ||
    u.phone?.toLowerCase().includes(q)
  )
}
</script>

<template>
  <div>
    <h1 class="title">Usuarios</h1>
    <BaseInput v-model="search" placeholder="Buscar por nombre, correo o teléfono..." class="search" />

    <BaseCard>
      <table class="table">
        <thead>
          <tr><th>Nombre</th><th>Contacto</th><th>Rol</th><th>Estado</th><th>Registro</th><th></th></tr>
        </thead>
        <tbody>
          <tr v-for="u in filtered()" :key="u.id">
            <td>{{ u.full_name }}</td>
            <td>
              <div>{{ u.email }}</div>
              <div class="muted">{{ u.phone }}</div>
            </td>
            <td><BaseBadge :tone="u.role === 'admin' ? 'accent' : 'neutral'">{{ u.role }}</BaseBadge></td>
            <td><BaseBadge :tone="u.is_active ? 'success' : 'danger'">{{ u.is_active ? 'Activo' : 'Suspendido' }}</BaseBadge></td>
            <td class="muted">{{ new Date(u.created_at).toLocaleDateString('es') }}</td>
            <td class="actions">
              <BaseButton size="sm" variant="secondary" @click="toggleRole(u)">
                {{ u.role === 'admin' ? 'Quitar admin' : 'Hacer admin' }}
              </BaseButton>
              <BaseButton size="sm" variant="outline" @click="toggleActive(u)">
                {{ u.is_active ? 'Suspender' : 'Reactivar' }}
              </BaseButton>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!loading && !filtered().length" class="muted" style="padding: 1rem;">No se encontraron usuarios.</p>
    </BaseCard>
  </div>
</template>

<style scoped>
.title { font-family: var(--font-display); font-size: var(--fs-2xl); margin-bottom: var(--space-5); }
.search { max-width: 360px; margin-bottom: var(--space-5); }
.table { width: 100%; border-collapse: collapse; }
.table th, .table td { text-align: left; padding: var(--space-3); border-bottom: 1px solid var(--color-border); font-size: var(--fs-sm); }
.muted { color: var(--color-text-faint); font-size: var(--fs-xs); }
.actions { display: flex; gap: var(--space-2); flex-wrap: wrap; }
</style>
