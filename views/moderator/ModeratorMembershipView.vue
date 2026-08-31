<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'

const auth = useAuthStore()
const history = ref<any[]>([])

onMounted(async () => {
  if (!auth.userId) return
  const { data } = await supabase.from('membership_payments').select('*').eq('moderator_id', auth.userId).order('claimed_at', { ascending: false })
  history.value = data ?? []
})
</script>

<template>
  <div>
    <h1 class="title">Membresía</h1>
    <BaseCard style="margin-bottom: 1.5rem;">
      <p>Estado actual:
        <BaseBadge :tone="auth.profile?.membership_status === 'paid' ? 'success' : 'danger'">{{ auth.profile?.membership_status }}</BaseBadge>
      </p>
      <p v-if="auth.profile?.membership_expires_at" class="muted">Vence: {{ new Date(auth.profile.membership_expires_at).toLocaleDateString('es') }}</p>
    </BaseCard>
    <BaseCard>
      <h2>Historial de pagos</h2>
      <table class="table">
        <tbody>
          <tr v-for="h in history" :key="h.id">
            <td>{{ new Date(h.claimed_at).toLocaleDateString('es') }}</td>
            <td>{{ h.amount }} {{ h.currency }}</td>
            <td><BaseBadge :tone="h.status === 'confirmed' ? 'success' : h.status === 'rejected' ? 'danger' : 'warning'">{{ h.status }}</BaseBadge></td>
          </tr>
        </tbody>
      </table>
      <p v-if="!history.length" class="muted">Aún no has reportado ningún pago.</p>
    </BaseCard>
  </div>
</template>

<style scoped>
.title { font-family: var(--font-display); font-size: var(--fs-2xl); margin-bottom: var(--space-6); }
.table { width: 100%; border-collapse: collapse; margin-top: var(--space-3); }
.table td { padding: var(--space-3); border-bottom: 1px solid var(--color-border); font-size: var(--fs-sm); }
.muted { color: var(--color-text-faint); font-size: var(--fs-sm); }
</style>
