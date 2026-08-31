<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '@/services/supabase'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'

const users = ref<any[]>([])
const payments = ref<any[]>([])
const modalOpen = ref(false)
const editing = ref<any>({})
const origin = ref('')
const copiedSlug = ref<string | null>(null)

async function copyLink(slug: string) {
  try {
    await navigator.clipboard.writeText(`${origin.value}/r/${slug}`)
    copiedSlug.value = slug
    setTimeout(() => (copiedSlug.value = null), 1500)
  } catch { /* noop */ }
}

async function load() {
  const [u, p] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    supabase.from('membership_payments').select('*, profiles!membership_payments_moderator_id_fkey(full_name)').eq('status', 'pending_review').order('claimed_at', { ascending: false })
  ])
  users.value = u.data ?? []
  payments.value = p.data ?? []
}
onMounted(() => {
  origin.value = typeof window !== 'undefined' ? window.location.origin : ''
  load()
})

function moderators() {
  return users.value.filter(u => u.role === 'moderator')
}
function regularUsers() {
  return users.value.filter(u => u.role === 'user')
}

function openPromote(u: any) {
  editing.value = { ...u, agency_name: u.agency_name || '', agency_slug: u.agency_slug || '', moderator_whatsapp: u.moderator_whatsapp || '' }
  modalOpen.value = true
}
async function savePromotion() {
  await supabase.from('profiles').update({
    role: 'moderator',
    agency_name: editing.value.agency_name,
    agency_slug: editing.value.agency_slug,
    moderator_whatsapp: editing.value.moderator_whatsapp,
    membership_status: 'overdue'
  }).eq('id', editing.value.id)
  modalOpen.value = false
  await load()
}
async function demote(u: any) {
  if (!confirm(`¿Quitar el rol de moderador a ${u.full_name}? Sus apps quedarán sin dueño visible pero no se eliminan.`)) return
  await supabase.from('profiles').update({ role: 'user' }).eq('id', u.id)
  await load()
}
async function confirmPayment(p: any) {
  await supabase.from('membership_payments').update({ status: 'confirmed', confirmed_at: new Date().toISOString() }).eq('id', p.id)
  const expires = new Date()
  expires.setDate(expires.getDate() + 30)
  await supabase.from('profiles').update({ membership_status: 'paid', membership_expires_at: expires.toISOString() }).eq('id', p.moderator_id)
  await load()
}
async function rejectPayment(p: any) {
  await supabase.from('membership_payments').update({ status: 'rejected' }).eq('id', p.id)
  await load()
}
</script>

<template>
  <div>
    <h1 class="title">Moderadores (agencias)</h1>

    <BaseCard v-if="payments.length" class="section">
      <h2>Pagos de membresía pendientes de confirmar</h2>
      <table class="table">
        <tbody>
          <tr v-for="p in payments" :key="p.id">
            <td>{{ p.profiles?.full_name }}</td>
            <td>{{ p.amount }} {{ p.currency }}</td>
            <td>{{ new Date(p.claimed_at).toLocaleString('es') }}</td>
            <td class="actions">
              <BaseButton size="sm" @click="confirmPayment(p)">✓ Pago confirmado</BaseButton>
              <BaseButton size="sm" variant="outline" @click="rejectPayment(p)">Rechazar</BaseButton>
            </td>
          </tr>
        </tbody>
      </table>
    </BaseCard>

    <BaseCard class="section">
      <h2>Moderadores activos</h2>
      <table class="table">
        <thead><tr><th>Agencia</th><th>Contacto</th><th>Membresía</th><th></th></tr></thead>
        <tbody>
          <tr v-for="m in moderators()" :key="m.id">
            <td>
              {{ m.agency_name || m.full_name }}
              <div v-if="m.agency_slug" class="ref-link">
                <code>{{ origin }}/r/{{ m.agency_slug }}</code>
                <button class="copy-btn" @click="copyLink(m.agency_slug)">{{ copiedSlug === m.agency_slug ? '✓' : 'Copiar' }}</button>
              </div>
            </td>
            <td class="muted">{{ m.email }}</td>
            <td><BaseBadge :tone="m.membership_status === 'paid' ? 'success' : m.membership_status === 'pending_review' ? 'warning' : 'danger'">{{ m.membership_status }}</BaseBadge></td>
            <td class="actions">
              <BaseButton size="sm" variant="outline" @click="demote(m)">Quitar moderador</BaseButton>
            </td>
          </tr>
        </tbody>
      </table>
    </BaseCard>

    <BaseCard class="section">
      <h2>Usuarios (promover a moderador)</h2>
      <table class="table">
        <tbody>
          <tr v-for="u in regularUsers()" :key="u.id">
            <td>{{ u.full_name }}</td>
            <td class="muted">{{ u.email }}</td>
            <td class="actions">
              <BaseButton size="sm" @click="openPromote(u)">Hacer moderador</BaseButton>
            </td>
          </tr>
        </tbody>
      </table>
    </BaseCard>

    <BaseModal :open="modalOpen" title="Convertir en moderador / agencia" @close="modalOpen = false">
      <div class="form">
        <BaseInput v-model="editing.agency_name" label="Nombre de la agencia" required />
        <BaseInput v-model="editing.agency_slug" label="Slug (url: /agencia/tu-slug)" required />
        <p v-if="editing.agency_slug" class="link-preview">Link para compartir: <code>{{ origin }}/r/{{ editing.agency_slug }}</code></p>
        <BaseInput v-model="editing.moderator_whatsapp" label="WhatsApp de contacto de la agencia" />
        <BaseButton @click="savePromotion">Confirmar</BaseButton>
      </div>
    </BaseModal>
  </div>
</template>

<style scoped>
.title { font-family: var(--font-display); font-size: var(--fs-2xl); margin-bottom: var(--space-6); }
.section { margin-bottom: var(--space-5); }
.section h2 { font-size: var(--fs-md); margin-bottom: var(--space-3); }
.table { width: 100%; border-collapse: collapse; }
.table td, .table th { text-align: left; padding: var(--space-3); border-bottom: 1px solid var(--color-border); font-size: var(--fs-sm); }
.muted { color: var(--color-text-faint); font-size: var(--fs-xs); }
.ref-link { display: flex; align-items: center; gap: var(--space-2); margin-top: var(--space-1); }
.ref-link code { font-size: var(--fs-xs); color: var(--color-text-muted); word-break: break-all; }
.copy-btn { background: var(--color-surface-strong); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 2px var(--space-2); font-size: var(--fs-xs); color: var(--color-text); flex-shrink: 0; }
.link-preview { font-size: var(--fs-sm); color: var(--color-text-muted); margin-top: -0.5rem; }
.link-preview code { color: var(--color-pink-400); word-break: break-all; }
.actions { display: flex; gap: var(--space-2); flex-wrap: wrap; }
.form { display: flex; flex-direction: column; gap: var(--space-4); }
</style>
